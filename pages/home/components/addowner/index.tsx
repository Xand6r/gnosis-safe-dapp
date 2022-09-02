import type { NextPage } from "next";
import { Input, Button } from "antd";
import { useState } from "react";

const AddOwner: NextPage<{ onAdd: (addr: string, onSuccess: any) => void }> = ({
  onAdd,
}) => {
  const [text, setText] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: "3px" }}>
        <Input onChange={(e) => setText(e.target.value)} placeholder="0x..." />
      </div>
      <Button onClick={() => onAdd(text, () => setText(""))} type="primary">
        Add Owner
      </Button>
    </div>
  );
};

export default AddOwner;
