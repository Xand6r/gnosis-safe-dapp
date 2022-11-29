import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { toast } from "react-toastify";

import { injected } from "utils/connectors";
import { useInactiveListener } from 'hooks/metamask/useinactivelistener';
import { useEagerConnect } from 'hooks/metamask/useeagerconnect';

export function useConnectWallet() {
  const { connector, activate, error } = useWeb3React();
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
    if (error.name === 'UnsupportedChainIdError') {
      message =
        'Unsupported network, please connect to Rinkeby or Main network';
    } else {
      message = error.message;
    }
    toast.error(message, {
      position: 'top-left'
    });
  }, [error]);

  const connectWalletPressed = () => {
    setActivatingConnector(injected);
    activate(injected);
  };

  return {connectWalletPressed}
}
