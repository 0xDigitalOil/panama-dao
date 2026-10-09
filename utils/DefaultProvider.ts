import { providers } from "ethers";

// ethers v5's AlchemyProvider still points at eth-mainnet.alchemyapi.io, a host
// Alchemy retired. Build the URL on the current g.alchemy.com domain instead.
const isGoerli = process.env.NEXT_PUBLIC_TOKEN_NETWORK === "5";
const alchemyUrl = `https://${isGoerli ? "eth-goerli" : "eth-mainnet"}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`;

const provider = new providers.StaticJsonRpcProvider(
  alchemyUrl,
  isGoerli ? "goerli" : "mainnet"
);

export default provider;
