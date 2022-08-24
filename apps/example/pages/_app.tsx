import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import type { AppProps } from "next/app";

import {
  connectorsForWallets,
  RainbowKitProvider,
  wallet,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import { Valora, CeloWallet, CeloDance } from "@celo/rainbowkit-celo/wallets";
import { Alfajores, Mainnet } from "@celo/rainbowkit-celo/chains";

const { chains, provider } = configureChains(
  [Alfajores, Mainnet],
  [jsonRpcProvider({ rpc: (chain) => ({ http: chain.rpcUrls.default }) })]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      Valora({ chains }),
      CeloWallet({ chains }),
      CeloDance({ chains }),
      wallet.steak({ chains }),
      wallet.walletConnect({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
