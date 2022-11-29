import axios from 'axios';
import { Avatar } from 'antd';
import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import makeBlockie from 'ethereum-blockies-base64';
import { toast } from 'react-toastify';
import { LockOutlined } from '@ant-design/icons';
import { getItem } from 'utils/helpers';
import type { MenuProps } from 'antd';

export function useFetchSafe() {
  const { chainId, account } = useWeb3React();
  const [safes, setSafes] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [noSafe, setNoSafe] = useState(false);
  const [activeSafe, setActiveSafe] = useState<string>('');

  const setCurrentSafe: MenuProps['onClick'] = (e: any) => {
    setActiveSafe(e.key);
  };

  // fetch all the safes associated with this address
  useEffect(() => {
    setLoading(true);
    if (loading) return;
    axios
      .get(
        `https://safe-client.gnosis.io/v1/chains/${chainId}/owners/${account}/safes`
      )
      .then(({ data }) => {
        const { safes = [] } = data;
        if (!safes.length) {
          return setNoSafe(true);
        }
        setActiveSafe(safes[0]);
        const newData: any = safes.map((safeAddress: string) =>
          getItem(safeAddress, <Avatar src={makeBlockie(safeAddress)}></Avatar>)
        );
        setSafes([
          {
            key: 'safes',
            label: 'Gnosis Safes',
            icon: <LockOutlined />,
            children: newData
          }
        ]);
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const addNewSafe = async (safeAddress: string) => {
    const newData: any = getItem(
      safeAddress,
      <Avatar src={makeBlockie(safeAddress)}></Avatar>
    );

    if (!safes.length) {
      setSafes([
        {
          key: 'safes',
          label: 'Gnosis Safes',
          icon: <LockOutlined />,
          children: newData
        }
      ]);
    } else {
      const allSafes = [...safes];
      allSafes[0].children.push(newData);
      setSafes([...allSafes]);
    }
  };

  return {
    safes,
    noSafe,
    activeSafe,
    loading,
    setCurrentSafe,
    addNewSafe
  };
}
