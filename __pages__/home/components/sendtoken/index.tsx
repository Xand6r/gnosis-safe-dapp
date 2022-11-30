import type { NextPage } from 'next';
import { Input, Button } from 'antd';
import { useEffect, useState } from 'react';
import Safe from '@gnosis.pm/safe-core-sdk';
import { ethers } from 'ethers';

import { toast } from 'react-toastify';
import { useWeb3React } from '@web3-react/core';
import erc20ABI from 'data/erc20ABI.json';
import { useSafeServiceClient } from 'hooks/safe/usesafeserviceclient';

const defaultStyle = { marginBottom: '3px' };

const SendToken: NextPage<{
  safe: Safe | undefined;
  setLoading: any;
  setSafeBalance: () => void;
}> = ({ safe, setLoading }) => {
  const [amount, setAmount] = useState<number>();
  const [tokenAddress, setAddress] = useState('');
  const [recipient, setRecipient] = useState('');
  const { library } = useWeb3React();
  const { proposeSafeTransaction } = useSafeServiceClient();

  const ProposeTransferTransaction = async () => {
    if (!safe) return;
    if (!amount || amount <= 0)
      return toast.error('Amount must be greater than 0');
    if (!ethers.utils.isAddress(tokenAddress))
      return toast.error('Invalid ERC20 token Address');
    if (!ethers.utils.isAddress(recipient))
      return toast.error('Invalid ERC20 recipient Address');
    try {
      setLoading({ status: true, message: 'Proposing Transactions...' });
      // generate the key values of the transaction
      const erc20Contract = new ethers.Contract(
        tokenAddress,
        erc20ABI,
        library.getSigner()
      );
      const decimals = await erc20Contract.decimals();
      const transferAmount = ethers.utils.parseUnits('' + amount, +decimals);
      const {
        data = '',
        value = 0,
        to = ''
      } = await erc20Contract.populateTransaction.transfer(
        recipient,
        transferAmount
      );
      // propose a safe transaction.
      await proposeSafeTransaction(safe, { to, data, value: +value });
      toast.success('Transaction has been proposed');
    } catch (error: any) {
      console.log({ error });
      toast.error(
        `There was an error sending this token: ${
          error.reason || error.message
        }`
      );
    } finally {
      setLoading({ status: false, message: '' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={defaultStyle}>
        <Input
          onChange={(e) => setAddress(e.target.value)}
          placeholder="ERC20 Token address"
          value={tokenAddress}
        />
      </div>
      <div style={defaultStyle}>
        <Input
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Recipient Address"
          value={recipient}
        />
      </div>
      <div style={defaultStyle}>
        <Input onChange={(e) => setAmount(+e.target.value)} placeholder="0.9" />
      </div>
      <Button onClick={ProposeTransferTransaction} type="primary">
        Propose Transaction
      </Button>
    </div>
  );
};

export default SendToken;
