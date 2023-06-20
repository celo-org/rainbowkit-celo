import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import SyntaxHighlighter from "react-syntax-highlighter";

const code = `// for 0.12.0
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import celoGroups from "@celo/rainbowkit-celo/lists";
import { Alfajores, Celo, Cannoli } from "@celo/rainbowkit-celo/chains";

const projectId = "your-wallet-connnect-project-id" // get one at https://cloud.walletconnect.com/app

const connectors = celoGroups({
  chains,
  projectId,
  appName: (typeof document === "object" && document.title) || "Sample App",
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function Wrap() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} coolMode={true}>
        <YourApp />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

function YourApp() {
  return <ConnectButton />;
};
`;

export function Demo() {
  return (
    <div className={styles.code}>
      <SyntaxHighlighter language="typescript">{code}</SyntaxHighlighter>
    </div>
  );
}

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Celo Config for RainbowKit</title>
        <meta name="description" content="RainbowKit with Celo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h2 className={styles.title}>Celo 🌈 RainbowKit</h2>
        <ConnectButton />
        <Demo />
        <em>
          Follow the instructions for{" "}
          <a
            className={styles.inlineLink}
            href="https://www.rainbowkit.com/docs/installation"
          >
            installing rainbowkit
          </a>{" "}
          and...
        </em>
        <h3>Install As a Package</h3>
        <code className={styles.install}>yarn add @celo/rainbowkit-celo</code>
        <h3>Or copy from source files</h3>
        <a
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
          href="https://github.com/celo-org/rainbowkit-celo/tree/main/packages/rainbowkit-celo/chains"
        >
          Chains
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
          href="https://github.com/celo-org/rainbowkit-celo/tree/main/packages/rainbowkit-celo/wallets"
        >
          Wallets
        </a>
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
    </>
  );
};

export default Home;
