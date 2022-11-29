import Safe, { SafeFactory, SafeAccountConfig } from '@gnosis.pm/safe-core-sdk';
import { useWeb3React } from '@web3-react/core';
import { useState } from 'react';
import { useSafe } from './usesafe';

export function useCreateSafe() {
  const [loading, setLoading] = useState(false);
  const { account = '' } = useWeb3React();
  const { ethAdapter } = useSafe();

  async function createSafe() {
    if (!account) throw new Error('Not connected to metamask');
    if (loading) throw new Error('Still creating safe');
    try {
      setLoading(true);
      const safeFactory = await SafeFactory.create({ ethAdapter });

      const owners = [account];
      const threshold = 1;
      const safeAccountConfig: SafeAccountConfig = {
        owners,
        threshold
      };

      const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig });
      return safeSdk;
    } finally {
      setLoading(false);
    }
  }
  return { loading, createSafe };
}
