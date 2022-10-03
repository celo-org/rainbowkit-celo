import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import SyntaxHighlighter from "react-syntax-highlighter";

const code = `import { RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import celoGroups from "@celo/rainbowkit-celo/lists"
import { Alfajores, Mainnet } from "@celo/rainbowkit-celo/chains";

const { chains, provider } = configureChains(
  [Alfajores, Mainnet],
  [jsonRpcProvider({ rpc: (chain) => ({ http: chain.rpcUrls.default }) })]
);

const connectors = celoGroups({chains})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function Wrap() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <YourApp/>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

function YourApp() {
  return <ConnectButton />;
};
`

export function Demo() {
return <div className={styles.code}>
  <SyntaxHighlighter language="typescript" >
    {code}
  </SyntaxHighlighter>
  </div>
}


export const YourApp = () => {
  return <ConnectButton />;
};

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
        <Demo />
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
      </>
  );
};

export default Home;
