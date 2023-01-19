import Layout from "@/components/Layout";
import dynamic from "next/dynamic";
import {
  Formik,
  Field,
  Form,
  useField,
  FieldArray,
  useFormikContext,
} from "formik";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useDAOAddresses } from "@/hooks/fetch";
import { GovernorABI } from "@buildersdk/sdk";
import { parseEther } from "ethers/lib/utils.js";
import Link from "next/link";
import Image from "next/image";
import AuthWrapper from "@/components/AuthWrapper";
import { useDebounce } from "@/hooks/useDebounce";
import { useIsMounted } from "@/hooks/useIsMounted";
import { Fragment } from "react";
import { TOKEN_CONTRACT } from "constants/addresses";
import { useUserVotes } from "@/hooks/fetch/useUserVotes";
import { useCurrentThreshold } from "@/hooks/fetch/useCurrentThreshold";
interface Transaction {
  address: string;
  valueInETH: number;
}
interface Values {
  title: string;
  summary: string;
  transactions: Transaction[];
}

export default function Create() {
  return (
    <Layout>
      <div className="flex flex-col items-center">
        <div className="max-w-[650px] w-full">
          <div className="flex items-center">
            <Link
              href="/vote"
              className="flex items-center border border-skin-stroke hover:bg-skin-muted rounded-full p-2 mr-4"
            >
              <ArrowLeftIcon className="h-4" />
            </Link>

            <div className="text-2xl sm:text-4xl font-bold relative font-heading text-skin-base">
              Create your proposal
            </div>
          </div>

          <Formik
            initialValues={{ title: "", transactions: [], summary: "" }}
            onSubmit={() => {}}
            render={({ values }) => (
              <Form className="mt-6 flex flex-col w-full">
                <label className="relative text-md font-heading text-skin-base">
                  Proposal title
                </label>

                <Field
                  name="title"
                  placeholder="My New Proposal"
                  className="bg-skin-muted text-skin-base placeholder:text-skin-muted px-3 py-3 rounded-lg w-full text-md mt-2 focus:outline-none"
                />

                <label className="relative text-md font-heading text-skin-base mt-6">
                  Transactions
                </label>

                <FieldArray
                  name="transactions"
                  render={(arrayHelpers) => (
                    <div className="mt-2">
                      {values.transactions.map((_, index) => (
                        <div
                          key={index}
                          className="mb-4 border p-4 rounded-md flex flex-col"
                        >
                          <div className="flex items-center justify-between">
                            <label className="text-sm w-52">Recipent</label>
                            <button onClick={() => arrayHelpers.remove(index)}>
                              <XMarkIcon className="h-6" />
                            </button>
                          </div>
                          <Field
                            name={`transactions[${index}].address`}
                            placeholder="0x04bfb0034F24E..."
                            className="bg-skin-muted text-skin-base placeholder:text-skin-muted px-3 py-3 rounded-lg w-full text-md mt-2 focus:outline-none"
                          />

                          <label className="text-sm mt-4">Value</label>
                          <div className="flex items-center mt-2">
                            <Field
                              name={`transactions.${index}.valueInETH`}
                              placeholder="0.1"
                              type="number"
                              className="bg-skin-muted text-skin-base placeholder:text-skin-muted px-3 py-3 rounded-l-lg w-full text-md focus:outline-none"
                            />
                            <label className="bg-skin-muted h-12 flex items-center border-l px-4">
                              ETH
                            </label>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() =>
                          arrayHelpers.push({ address: "", valueInETH: 0 })
                        }
                        className={`bg-skin-muted text-skin-muted rounded-lg text-md w-full h-12 flex items-center justify-around`}
                      >
                        Add Transaction
                      </button>

                      <div className="mt-6 text-sm text-skin-muted">
                        Add one or more transactions and describe your proposal
                        for the community. The proposal cannot modified after
                        submission, so please verify all information before
                        submitting.
                      </div>
                    </div>
                  )}
                />

                <label className="relative text-md font-heading text-skin-base mt-6">
                  Summary
                </label>

                <HTMLTextEditor />

                <SubmitButton />
              </Form>
            )}
          />
        </div>
      </div>
    </Layout>
  );
}

const SubmitButton = () => {
  const { values: formValues } = useFormikContext<Values>();
  const { transactions, title, summary } = formValues || {};
  const { data: addresses } = useDAOAddresses({
    tokenContract: TOKEN_CONTRACT,
  });

  const { data: userVotes } = useUserVotes();
  const { data: currentThreshold } = useCurrentThreshold({
    governorContract: addresses?.governor,
  });

  const targets = transactions?.map((t) => t.address as `0x${string}`) || [];

  const values =
    transactions?.map((t) => parseEther(t.valueInETH.toString() || "0")) || [];
  const callDatas = transactions?.map(() => "0x" as `0x${string}`) || [];
  const description = `${title}&&${summary}`;

  const args = [targets, values, callDatas, description] as const;
  const debouncedArgs = useDebounce(args);

  const { config } = usePrepareContractWrite({
    address: addresses?.governor,
    abi: GovernorABI,
    functionName: "propose",
    args: debouncedArgs,
    enabled: debouncedArgs && !values.find((x) => x.isZero()),
  });
  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess, status } = useWaitForTransaction({
    hash: data?.hash,
  });

  const isMounted = useIsMounted();

  if (!isMounted) return <Fragment />;

  const hasBalance = userVotes && userVotes >= (currentThreshold || 0);

  const buttonClass = `${
    write
      ? "bg-skin-button-accent hover:bg-skin-button-accent-hover"
      : "bg-skin-button-muted"
  } text-skin-inverted rounded-lg text-md w-full h-12 mt-4 flex items-center justify-around`;

  return (
    <AuthWrapper className={buttonClass}>
      <button
        onClick={() => write?.()}
        disabled={!hasBalance || !write || isSuccess || isLoading}
        type="button"
        className={buttonClass}
      >
        {!hasBalance ? (
          "You don't have enough votes to submit a proposal"
        ) : isSuccess ? (
          <div className="flex items-center">
            <div className="mr-2">Proposal Submitted</div>
            <CheckCircleIcon className="h-5" />
          </div>
        ) : isLoading ? (
          <Image src="/spinner.svg" alt="spinner" width={25} height={25} />
        ) : (
          "Submit Proposal"
        )}
      </button>
    </AuthWrapper>
  );
};

const HTMLTextEditor = () => {
  const props = { name: "summary", type: "text", id: "summary" };
  const [_, meta, helpers] = useField(props.name);

  const { value } = meta;
  const { setValue } = helpers;

  const RichTextEditor = dynamic(() => import("@mantine/rte"), {
    ssr: false,
    loading: () => (
      <div className="mt-2 min-h-[250px] bg-gray-100 rounded-md animate-pulse" />
    ),
  });

  return (
    <RichTextEditor
      controls={[
        ["bold", "italic", "underline", "link"],
        ["unorderedList", "h1", "h2", "h3"],
      ]}
      className="mt-2 min-h-[250px]"
      value={value}
      onChange={(value) => setValue(value)}
      {...props}
    />
  );
};
