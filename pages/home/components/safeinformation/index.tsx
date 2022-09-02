import type { NextPage } from "next";
import { ethers } from "ethers";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import Safe, { AddOwnerTxParams } from "@gnosis.pm/safe-core-sdk";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";
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
  const [safe, setSafe] = useState<Safe>();
  const [owners, setOwners] = useState<
    { address: string; label: string; balance: string }[]
  >([]);

  // load safe details and initialise safe constructor
  useEffect(() => {
    if (!activeSafe) return;
    (async function () {
      const ethAdapter = new EthersAdapter({
        ethers,
        signer: library.getSigner(),
      });
      const safeSdk: Safe = await Safe.create({
        ethAdapter: ethAdapter,
        safeAddress: activeSafe,
      });
      setSafe(safeSdk);
    })().catch((err) => {
      console.log({ err });
    });
  }, [activeSafe]);

  // fetch owners of safe
  async function fetchOwners() {
    if (!safe) return;
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
    setOwners(await Promise.all(ownersDetails));
  }
  useEffect(() => {
    fetchOwners();
  }, [safe]);

  const addOwner = async (userAddress: string, onSuccess: () => void) => {
    if (!safe) return;
    if (!ethers.utils.isAddress(userAddress)) {
      return toast.error("The address passed in is invalid");
    }
    try {
      setLoading({ status: true, message: "Adding new owner to safe" });
      const params: AddOwnerTxParams = {
        ownerAddress: userAddress,
      };
      const safeTransaction = await safe.createAddOwnerTx(params);
      const txResponse = await safe.executeTransaction(safeTransaction);
      await txResponse.transactionResponse?.wait();
      toast.success("Account sucesfully added as owner");
      onSuccess();
      fetchOwners();//refetch owners
    } catch (error: any) {
      toast.error(
        `There was an error adding this owner: ${error.reason || error.message}`
      );
    } finally {
      setLoading({ status: false, message: "" });
    }
  };

  const sendTransaction = async (
    ethvalue: string,
    recipientAddress: string,
    onSuccess: () => void
  ) => {
    if (!safe) return;
    try {
      setLoading({ status: true, message: "Transferring funds..." });
      const safeTransactionData: SafeTransactionDataPartial = {
        to: recipientAddress,
        value: ethers.utils.parseEther(ethvalue).toString(),
        data: recipientAddress,
      };
      const safeTransaction = await safe.createTransaction({
        safeTransactionData,
      });
      const executeTxResponse = await safe.executeTransaction(safeTransaction);
      await executeTxResponse.transactionResponse?.wait();
      onSuccess();
      toast.success("Funds Sucesfully sent");
    } catch (error: any) {
      console.log({ error });
      toast.error(
        `There was an error adding this owner: ${error.reason || error.message}`
      );
    } finally {
      setLoading({ status: false, message: "" });
    }
  };

  return (
    <Spin indicator={antIcon} spinning={loading.status} tip={loading.message}>
      <div className={styles.safeinformation}>
        <section>
          <Title level={4}>
            <b>rin:</b>
            {activeSafe}
          </Title>

          <div>
            {/*  */}
            <Popover
              placement="bottom"
              content={<SendToken onAdd={sendTransaction} />}
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
              content={<AddOwner onAdd={addOwner} />}
              title="Add new owner to safe"
            >
              {/* <Tooltip title=""> */}
              <Button
                type="primary"
                shape="circle"
                icon={<UserAddOutlined />}
                size="large"
              />
              {/* </Tooltip> */}
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
