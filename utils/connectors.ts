import { InjectedConnector } from "@web3-react/injected-connector";

const SUPPORTED_CHAIN_IDS = [
  4, //for rinkeby
];

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
});
