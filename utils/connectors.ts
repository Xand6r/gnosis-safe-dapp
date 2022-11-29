import { InjectedConnector } from "@web3-react/injected-connector";

const SUPPORTED_CHAIN_IDS = [
  5, //for rinkeby
  1 //mainnet
];

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
});
