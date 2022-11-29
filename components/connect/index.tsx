import { Button } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import type { NextPage } from 'next';
import React from 'react';
import { useConnectWallet } from 'hooks/useconnectwallet';
import { useWeb3React } from '@web3-react/core';

const ConnectButton: NextPage = () => {
  const { active, account } = useWeb3React();
  const { connectWalletPressed } = useConnectWallet();

  return (
    <div>
      <Button
        icon={<LoginOutlined />}
        type="primary"
        size="large"
        disabled={active}
        onClick={connectWalletPressed}
      >
        {active && account && account.length > 0 ? (
          account.slice(0, 4) + '......' + account.slice(38)
        ) : (
          <span>Connect Metamask</span>
        )}
      </Button>
    </div>
  );
};

export default ConnectButton;
