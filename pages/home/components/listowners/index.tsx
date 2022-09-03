import type { NextPage } from "next";
import { Avatar, List } from "antd";
import styles from "./listowners.module.scss";
import makeBlockie from "ethereum-blockies-base64";
import { useWeb3React } from "@web3-react/core";

const generateEtherscanLink = (address: string, chainId:any) => {
  if(chainId == 1){
    return `https://etherscan.io/address/${address}`
  }
  return `https://rinkeby.etherscan.io/address/${address}`;
};

const ListOwners: NextPage<{
  owners: { address: string; label: string; balance: string }[];
}> = ({ owners }) => {
  const { chainId } = useWeb3React();
  return (
    <section className={styles.owners}>
      <List
        size="large"
        itemLayout="horizontal"
        dataSource={owners}
        header={<h3>Owners</h3>}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={makeBlockie(item.address)} />}
              title={
                <a rel="noreferrer" target="_blank" href={generateEtherscanLink(item.address, chainId)}>
                  {item.label}
                </a>
              }
              description={`Token balance: ${item.balance}ETH`}
            />
          </List.Item>
        )}
      />
    </section>
  );
};

export default ListOwners;
