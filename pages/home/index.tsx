import type { NextPage } from "next";
import { useWeb3React } from "@web3-react/core";

const Home: NextPage = () => {
  const { connector, activate, active, error, account } = useWeb3React();

  return <div>hello</div>;
};

export default Home;
