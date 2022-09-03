import type { NextPage } from 'next';
import Image from "next/image";
import ConnectButton from 'components/connect';
import styles from "./header.module.scss"

const Header: NextPage = () => {
  return (
    <header className={styles.header}>
      <span>
        <Image layout='fill' src="/assets/logo.png"/>
      </span>
      <ConnectButton />
    </header>
  )
}

export default Header
