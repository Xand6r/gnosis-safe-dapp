import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import Safe from '@gnosis.pm/safe-core-sdk';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Spin, Typography, Popover, Tooltip, Modal } from 'antd';
import {
  UserAddOutlined,
  TransactionOutlined,
  PlusOutlined,
  SendOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import styles from './saleinformation.module.scss';
import { useSafe } from 'hooks/safe/usesafe';

import AddOwner from '../addowner';
import ReceiveToken from '../receivetoken';
import ListOwners from '../listowners';
import SendToken from '../sendtoken';
import { useCreateSafe } from 'hooks/safe/usecreatesafe';
import { toast } from 'react-toastify';
import { useModal } from 'hooks/usemodal';
import Queue from '../queue';
import { useSafeServiceClient } from 'hooks/safe/usesafeserviceclient';

const { Title } = Typography;

const antIcon = <LoadingOutlined style={{ fontSize: 42 }} spin />;
const SafeInformation: NextPage<{
  activeSafe: string;
  onAddSafe: (addr: string) => Promise<void>;
}> = ({ activeSafe, onAddSafe }) => {
  const { library } = useWeb3React();
  const { ethAdapter } = useSafe();
  const { createSafe, loading: createSafeLoading } = useCreateSafe();
  const { showModal, isModalOpen, handleOk, handleCancel } = useModal();
  const { fetchSafeTokens } = useSafeServiceClient();
  const [allTokens, setAllTokens] = useState<any>([]);
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
  const setSafeBalance = async (safeAddr: string) => {
    const balances = await fetchSafeTokens(safeAddr);
    // show first 3 tokens
    const parsedBalance = balances
      .filter(({ tokenAddress }) => Boolean(tokenAddress))
      .map((singleTokenBalance) => {
        const {
          balance,
          token: { name, decimals }
        } = singleTokenBalance;

        return {
          balance: +balance / Math.pow(10, +decimals),
          name
        };
      })
      .slice(0, 3);
    setAllTokens(parsedBalance);
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
      setSafeBalance(safeSdk.getAddress());
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
            <div className={styles.balances}>
              {allTokens.map((tokenBalance: any) => (
                <Title key={tokenBalance.name} level={5}>
                  <b style={{ textTransform: 'capitalize' }}>
                    {tokenBalance.name.toLowerCase()} Balance:{' '}
                  </b>
                  {tokenBalance.balance} {tokenBalance.name.toUpperCase()}
                </Title>
              ))}
            </div>
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
            <Tooltip title="Proposed Transactions">
              <Button
                type="primary"
                shape="circle"
                icon={<CheckCircleOutlined />}
                size="large"
                onClick={showModal}
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
              title="Send ERC token to safe"
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
      {isModalOpen && (
        <Modal
          title="Proposed Transactions (Click to approve transaction)"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Queue safe={safe} refresh={isModalOpen} />
        </Modal>
      )}
    </Spin>
  );
};

export default SafeInformation;
