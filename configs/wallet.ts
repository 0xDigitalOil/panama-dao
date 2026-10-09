import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  process.env.NEXT_PUBLIC_TOKEN_NETWORK == "5"
    ? [chain.goerli]
    : [chain.mainnet],
  [
    // wagmi 0.8's alchemyProvider uses the retired alchemyapi.io host; point at g.alchemy.com.
    jsonRpcProvider({
      rpc: (c) => ({
        http: `https://${c.id === 5 ? "eth-goerli" : "eth-mainnet"}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
      }),
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export { wagmiClient, chains };
