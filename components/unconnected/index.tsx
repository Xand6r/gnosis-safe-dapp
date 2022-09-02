import type { NextPage } from "next";
import Image from "next/image";

import styles from "./unconnected.module.scss";

const DEFAULT_TEXT = " Please connect your wallet to proceed.";
const Unconnected: NextPage<{ text: String }> = ({ text = DEFAULT_TEXT }) => {
  return (
    <section className={styles.unconnected}>
      <div>
        <Image layout="fill" src="/assets/void.png" />
      </div>
      <h2>{text}</h2>
    </section>
  );
};

export default Unconnected;
