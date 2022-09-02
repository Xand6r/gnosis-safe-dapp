import type { AppProps } from "next/app";
import Head from "next/head";
import { ethers } from "ethers";
import { Web3ReactProvider } from "@web3-react/core";
import { ToastContainer } from 'react-toastify';
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  function getLibrary(provider: any) {
    const gottenProvider:any = new ethers.providers.Web3Provider(provider, "any"); // this will vary according to whether you use e.g. ethers or web3.js
    gottenProvider.provider.on("accountsChanged", () => {
        // when account has been changed, refresh the page
        window.location.reload();
    });
    return gottenProvider;
  }

  return (
    <>
      <Head>
        <title>Usher Gnosis</title>
        <meta name="description" content="A tech test for shuaibu alexander" />
        <link rel="icon" href="/assets/metamask.svg" />
      </Head>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Component {...pageProps} />
      </Web3ReactProvider>
      <ToastContainer />
    </>
  );
}

export default MyApp;
