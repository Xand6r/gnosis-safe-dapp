import type { NextPage } from 'next';
import Image from 'next/image';

import styles from './unconnected.module.scss';

const Unconnected: NextPage<{ text: String }> = ({ text }) => {
  return (
    <section className={styles.unconnected}>
      <div>
        <Image layout="fill" src="/assets/void.png" alt="" />
      </div>
      <h2>{text}</h2>
    </section>
  );
};

export default Unconnected;
