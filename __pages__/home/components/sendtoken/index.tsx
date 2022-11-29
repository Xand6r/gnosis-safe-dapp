import type { NextPage } from 'next';
import { Input, Button } from 'antd';
import { useState } from 'react';
import { SafeTransactionDataPartial } from '@gnosis.pm/safe-core-sdk-types';
import Safe from '@gnosis.pm/safe-core-sdk';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

const DEFAULT_RECIPIENT = '0xc6D330E5B7Deb31824B837Aa77771178bD8e6713';
const defaultStyle = { marginBottom: '3px' };

const SendToken: NextPage<{
  safe: Safe | undefined;
  setLoading: any;
  setSafeBalance: () => void;
}> = ({ safe, setLoading, setSafeBalance }) => {
  const [text, setText] = useState('');
  const [address, setAddress] = useState(DEFAULT_RECIPIENT);

  const sendTransaction = async () => {
    if (!safe) return;
    try {
      setLoading({ status: true, message: 'Transferring funds...' });
      const safeTransactionData: SafeTransactionDataPartial = {
        to: address,
        value: ethers.utils.parseEther(text).toString(),
        data: address
      };
      const safeTransaction = await safe.createTransaction({
        safeTransactionData
      });
      const executeTxResponse = await safe.executeTransaction(safeTransaction);
      await executeTxResponse.transactionResponse?.wait();
      toast.success('Funds Sucesfully sent');
      setText('');
      setSafeBalance();
    } catch (error: any) {
      console.log({ error });
      toast.error(
        `There was an error adding this owner: ${error.reason || error.message}`
      );
    } finally {
      setLoading({ status: false, message: '' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={defaultStyle}>
        <Input
          onChange={(e) => setText(e.target.value)}
          placeholder="0.9 eth"
        />
      </div>
      <div style={defaultStyle}>
        <Input
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x..."
          value={address}
          disabled
        />
      </div>
      <Button onClick={sendTransaction} type="primary">
        Send Token
      </Button>
    </div>
  );
};

export default SendToken;
