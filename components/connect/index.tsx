import { Button } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import type { NextPage } from "next";
import React from "react";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import { useEagerConnect, useInactiveListener } from "../../utils/hooks";
import { injected } from "../../utils/connectors";

const ConnectButton: NextPage = () => {
  const { connector, activate, active, error, account } = useWeb3React();

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] =
    React.useState<typeof injected>();
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);
  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  React.useEffect(() => {
    if (!error) return;
    let message;
    if (error.name === "UnsupportedChainIdError") {
      message = "Unsupported network, please connect to Ropsten network";
    } else {
      message = error.message;
    }
    toast.error(message, {
      position: "top-left",
    });
  }, [error]);

  const connectWalletPressed = () => {
    setActivatingConnector(injected);
    activate(injected);
  };
  console.log(error);

  return (
    <div>
      <Button
        icon={<LoginOutlined />}
        type='primary'
        size='large'
        disabled={active}
        onClick={connectWalletPressed}
      >
        {active && account && account.length > 0 ? (
          account.slice(0, 4) + "......" + account.slice(38)
        ) : (
          <span>Connect Metamask</span>
        )}
      </Button>
    </div>
  );
};


export default ConnectButton;
