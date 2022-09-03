import type { NextPage } from "next";
import makeBlockie from "ethereum-blockies-base64";
import { Menu } from "antd";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import axios from "axios";
import type { MenuProps } from "antd";
import React from "react";
import { LoadingOutlined, LockOutlined } from "@ant-design/icons";
import { Spin, Avatar } from "antd";
import { getItem } from "utils/helpers";
import SafeInformation from "./components/safeinformation";
import { toast } from "react-toastify";
import Unconnected from "components/unconnected";

const antIcon = <LoadingOutlined style={{ fontSize: 42 }} spin />;

const Home: NextPage = () => {
  const { chainId, account } = useWeb3React();
  const [safes, setSafes] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [noSafe, setNoSafe] = useState(false);
  const [activeSafe, setActiveSafe] = useState<string>("");

  const onClick: MenuProps["onClick"] = (e: any) => {
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
        const newData = safes.map((safeAddress: string) =>
          getItem(safeAddress, <Avatar src={makeBlockie(safeAddress)}></Avatar>)
        );
        setSafes([
          {
            key: "safes",
            label: "Gnosis Safes",
            icon: <LockOutlined />,
            children: newData,
          },
        ]);
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Spin
      indicator={antIcon}
      spinning={loading}
      tip="Loading safes associated with this ethereum account..."
    >
      <div style={{ display: "flex" }}>
        {activeSafe && (
          <>
            <aside>
              <Menu
                onClick={onClick}
                style={{ width: 256 }}
                defaultSelectedKeys={[activeSafe]}
                defaultOpenKeys={["safes"]}
                mode="inline"
                items={safes}
              />
            </aside>
            <SafeInformation activeSafe={activeSafe} />
          </>
        )}

        {noSafe && (
          <Unconnected text="There are no safes associated with this account, Please try another." />
        )}
      </div>
    </Spin>
  );
};

export default Home;
