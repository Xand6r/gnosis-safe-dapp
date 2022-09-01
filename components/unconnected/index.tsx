import type { NextPage } from "next";
import Image from "next/image";

import styles from "./unconnected.module.scss";

const Home: NextPage = () => {
  return (
    <section className={styles.unconnected}>
      <div>
        <Image layout="fill" src="/assets/void.png" />
      </div>
      <h2>Please connect your wallet to proceed.</h2>
    </section>
  );
};

export default Home;
