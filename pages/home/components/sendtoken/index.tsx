import type { NextPage } from "next";
import { Input, Button } from "antd";
import { useState } from "react";

const recipientAddress = "0xc6D330E5B7Deb31824B837Aa77771178bD8e6713";
const defaultStyle = { marginBottom: "3px" };

const SendToken: NextPage<{
  onAdd: (
    ethvalue: string,
    recipientAddress: string,
    onSuccess: () => void
  ) => void;
}> = ({ onAdd }) => {
  const [text, setText] = useState("");
  const [address, setAddress] = useState(recipientAddress);
  

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
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
      <Button
        onClick={() => onAdd(text, recipientAddress, () => setText(""))}
        type="primary"
      >
        Send Token
      </Button>
    </div>
  );
};

export default SendToken;
