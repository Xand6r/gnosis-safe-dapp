import type { NextPage } from "next";
import { ethers } from "ethers";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import Safe from "@gnosis.pm/safe-core-sdk";
import { LoadingOutlined } from "@ant-design/icons";
import { UserAddOutlined, TransactionOutlined } from "@ant-design/icons";
import styles from "./saleinformation.module.scss";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Button, Spin, Typography, Popover } from "antd";
import AddOwner from "../addowner";
import { toast } from "react-toastify";
import SendToken from "../sendtoken";
import ListOwners from "../listowners";
const { Title } = Typography;

const antIcon = <LoadingOutlined style={{ fontSize: 42 }} spin />;
const SafeInformation: NextPage<{ activeSafe: string }> = ({ activeSafe }) => {
  const { library } = useWeb3React();
  const [loading, setLoading] = useState({
    status: false,
    message: "",
  });
  const [ethBalance, setEthBalance] = useState("0");
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
      setLoading({ status: true, message: "loading safe information" });
      const ethAdapter = new EthersAdapter({
        ethers,
        signer: library.getSigner(),
      });
      const safeSdk: Safe = await Safe.create({
        ethAdapter: ethAdapter,
        safeAddress: activeSafe,
      });
      setSafe(safeSdk);
      setSafeBalance();
    })()
      .catch((err) => {
        console.log({ err });
      })
      .finally(() => {
        setLoading({ status: false, message: "" });
      });
  }, [activeSafe]);

  // fetch owners of safe
  async function fetchOwners() {
    if (!safe) return;
    setLoading({ status: true, message: "loading safe owners" });
    const owners = await safe.getOwners();
    const ownersDetails = owners.map(async (owner) => {
      const label = await library.lookupAddress(owner);
      const balance = await library.getBalance(owner);

      return {
        address: owner,
        label: label || owner,
        balance: (+ethers.utils.formatEther(balance).toString()).toFixed(2),
      };
    });
    const ownerDetails = await Promise.all(ownersDetails);
    setOwners(ownerDetails);
    setLoading({ status: false, message: "" });
  }
  useEffect(() => {
    fetchOwners();
  }, [safe]);

  return (
    <Spin indicator={antIcon} spinning={loading.status} tip={loading.message}>
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
            <Popover
              placement="bottom"
              content={
                <SendToken
                  safe={safe}
                  setLoading={setLoading}
                  setSafeBalance={setSafeBalance}
                />
              }
              title="Send token from safe"
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
