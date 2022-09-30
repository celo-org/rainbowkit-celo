import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const YourApp = () => {
  return <ConnectButton />;
};

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Celo Config for RainbowKit</title>
        <meta name="description" content="RainbowKit with Celo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h2>Celo 🌈 RainbowKit</h2>
        <ConnectButton />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/celo-org/rainbowkit-celo"
          target="_blank"
          rel="noopener noreferrer"
          title="Code"
        >
          💾
        </a>
      </footer>
    </div>
  );
};

export default Home;
