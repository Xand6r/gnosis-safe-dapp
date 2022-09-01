import type { NextPage } from "next";
import Header from "components/header";
import HomePage from "pages/home";
import Unconnected from "components/unconnected";
import { useWeb3React } from "@web3-react/core";

const Home: NextPage = () => {
  const { active } = useWeb3React();
  return (
    <div>
      <Header />
      {active ? <HomePage /> : <Unconnected />}
    </div>
  );
};

export default Home;