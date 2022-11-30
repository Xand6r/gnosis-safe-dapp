import { ethers } from 'ethers';
import SafeServiceClient from '@gnosis.pm/safe-service-client';
import EthersAdapter from '@safe-global/safe-ethers-lib';
import { SafeTransactionDataPartial } from '@gnosis.pm/safe-core-sdk-types';
import { useWeb3React } from '@web3-react/core';
import type Safe from '@gnosis.pm/safe-core-sdk';

export function useSafeServiceClient() {
  const { library, chainId, account } = useWeb3React();
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: library.getSigner()
  });
  const chainName = chainId == 1 ? 'mainnet' : 'goerli';

  const safeService = new SafeServiceClient({
    txServiceUrl: `https://safe-transaction-${chainName}.safe.global`,
    ethAdapter
  });

  const proposeSafeTransaction = async (
    safeSDK: Safe,
    {
      to,
      data,
      value = 0
    }: {
      to: string;
      data: string;
      value?: number;
    }
  ) => {
    const safeTransactionData: SafeTransactionDataPartial = {
      to,
      data,
      value: value.toString()
    };
    const safeTransaction = await safeSDK.createTransaction({
      safeTransactionData
    });
    const safeTransactionHash = await safeSDK.getTransactionHash(safeTransaction);
    const owner1Signature = await safeSDK.signTransactionHash(safeTransactionHash);
    const payload = {
      safeAddress: safeSDK.getAddress(),
      safeTxHash: safeTransactionHash,
      safeTransactionData: safeTransaction.data,
      senderSignature: owner1Signature.data,
      senderAddress: account || ''
    };
    await safeService.proposeTransaction(payload);
  };

  return { safeService, proposeSafeTransaction };
}
