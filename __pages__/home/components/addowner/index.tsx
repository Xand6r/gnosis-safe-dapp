import type { NextPage } from "next";
import { Input, Button } from "antd";
import { useState } from "react";
import Safe, { AddOwnerTxParams } from "@gnosis.pm/safe-core-sdk";
import { ethers } from "ethers";
import { toast } from "react-toastify";

const AddOwner: NextPage<{
  safe: Safe | undefined;
  setLoading: any;
  fetchOwners: () => void;
}> = ({ safe, setLoading, fetchOwners }) => {
  const [text, setText] = useState("");

  const addOwner = async () => {
    if (!safe) return;
    if (!ethers.utils.isAddress(text)) {
      return toast.error("The address passed in is invalid");
    }
    try {
      setLoading({ status: true, message: "Adding new owner to safe" });
      const params: AddOwnerTxParams = {
        ownerAddress: text,
      };
      const safeTransaction = await safe.createAddOwnerTx(params);
      const txResponse = await safe.executeTransaction(safeTransaction);
      await txResponse.transactionResponse?.wait();
      toast.success("Account sucesfully added as owner");
      setText("");
      fetchOwners(); //refetch owners
    } catch (error: any) {
      toast.error(
        `There was an error adding this owner: ${error.reason || error.message}`
      );
    } finally {
      setLoading({ status: false, message: "" });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: "3px" }}>
        <Input onChange={(e) => setText(e.target.value)} placeholder="0x..." />
      </div>
      <Button onClick={addOwner} type="primary">
        Add Owner
      </Button>
    </div>
  );
};

export default AddOwner;
