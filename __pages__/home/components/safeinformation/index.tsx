import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import Safe from '@gnosis.pm/safe-core-sdk';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Spin, Typography, Popover, Tooltip } from 'antd';
import {
  UserAddOutlined,
  TransactionOutlined,
  PlusOutlined,
  SendOutlined
} from '@ant-design/icons';
import styles from './saleinformation.module.scss';
import { useSafe } from 'hooks/safe/usesafe';

import AddOwner from '../addowner';
import ReceiveToken from '../receivetoken';
import ListOwners from '../listowners';
import SendToken from '../sendtoken';
import { useCreateSafe } from 'hooks/safe/usecreatesafe';
import { toast } from 'react-toastify';

const { Title } = Typography;

const antIcon = <LoadingOutlined style={{ fontSize: 42 }} spin />;
const SafeInformation: NextPage<{
  activeSafe: string;
  onAddSafe: (addr: string) => Promise<void>;
}> = ({ activeSafe, onAddSafe }) => {
  const { library } = useWeb3React();
  const { ethAdapter } = useSafe();
  const { createSafe, loading: createSafeLoading } = useCreateSafe();
  const [loading, setLoading] = useState({
    status: false,
    message: ''
  });
  const [ethBalance, setEthBalance] = useState('0');
  const [safe, setSafe] = useState<Safe>();
  const [owners, setOwners] = useState<
    { address: string; label: string; balance: string }[]
  >([]);

  // refresh the balance of the safe
  const setSafeBalance = async () => {
    const safeBalance = await library.getBalance(activeSafe);
    const parsedBalance = (+ethers.utils
      .formatEther(safeBalance)
      .toString()).toFixed(2);
    setEthBalance(parsedBalance);
  };

  // load safe details and initialise safe constructor
  useEffect(() => {
    if (!activeSafe) return;
    (async function fetchSafeInformation() {
      setLoading({ status: true, message: 'loading safe information' });
      const safeSdk: Safe = await Safe.create({
        ethAdapter: ethAdapter,
        safeAddress: activeSafe
      });
      setSafe(safeSdk);
      setSafeBalance();
    })()
      .catch((err) => {
        console.log({ err });
      })
      .finally(() => {
        setLoading({ status: false, message: '' });
      });
  }, [activeSafe]);

  // fetch owners of safe
  async function fetchOwners() {
    if (!safe) return;
    setLoading({ status: true, message: 'loading safe owners' });
    const owners = await safe.getOwners();
    const ownersDetails = owners.map(async (owner) => {
      const label = await library.lookupAddress(owner);
      const balance = await library.getBalance(owner);

      return {
        address: owner,
        label: label || owner,
        balance: (+ethers.utils.formatEther(balance).toString()).toFixed(2)
      };
    });
    const ownerDetails = await Promise.all(ownersDetails);
    setOwners(ownerDetails);
    setLoading({ status: false, message: '' });
  }

  useEffect(() => {
    fetchOwners();
  }, [safe]);

  const localCreateSafe = async () => {
    try {
      setLoading({ ...loading, message: 'Creating safe...' });
      const createdSafe = await createSafe();
      const address = createdSafe.getAddress();
      onAddSafe(address);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <Spin
      indicator={antIcon}
      spinning={loading.status || createSafeLoading}
      tip={loading.message}
    >
      <div className={styles.safeinformation}>
        <section>
          <section>
            <Title level={4}>
              <b>rin: </b>
              {activeSafe}
            </Title>
            <Title level={4}>
              <b>ETH Balance: </b>
              {ethBalance}ETH
            </Title>
          </section>

          <div>
            {/*  */}
            <Tooltip title="Create safe">
              <Button
                type="primary"
                shape="circle"
                icon={<PlusOutlined />}
                size="large"
                onClick={localCreateSafe}
              />
            </Tooltip>
            {/*  */}
            {/*  */}
            <Popover
              placement="bottom"
              content={
                <SendToken
                  safe={safe}
                  setLoading={setLoading}
                  setSafeBalance={setSafeBalance}
                />
              }
              title="Propose ERC20 Token transfer"
            >
              <Button
                type="primary"
                shape="circle"
                icon={<SendOutlined />}
                size="large"
              />
            </Popover>
            {/*  */}
            {/*  */}
            <Popover
              placement="bottom"
              content={
                <ReceiveToken
                  safe={safe}
                  setLoading={setLoading}
                  setSafeBalance={setSafeBalance}
                />
              }
              title="Send token to safe"
            >
              <Button
                type="primary"
                shape="circle"
                icon={<TransactionOutlined />}
                size="large"
              />
            </Popover>
            {/*  */}
            {/*  */}
            <Popover
              placement="bottom"
              content={
                <AddOwner
                  safe={safe}
                  setLoading={setLoading}
                  fetchOwners={fetchOwners}
                />
              }
              title="Add new owner to safe"
            >
              <Button
                type="primary"
                shape="circle"
                icon={<UserAddOutlined />}
                size="large"
              />
            </Popover>
            {/*  */}
          </div>
        </section>
        <section>
          <ListOwners owners={owners} />
        </section>
      </div>
    </Spin>
  );
};

export default SafeInformation;
