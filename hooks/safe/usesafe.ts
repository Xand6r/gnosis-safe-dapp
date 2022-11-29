import EthersAdapter from '@gnosis.pm/safe-ethers-lib';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

export function useSafe() {
  const { library } = useWeb3React();

  const ethAdapter = new EthersAdapter({
    ethers,
    signer: library.getSigner()
  });

  return {
    ethAdapter
  };
}
