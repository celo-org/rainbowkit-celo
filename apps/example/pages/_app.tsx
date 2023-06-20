import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import celoGroups from "@celo/rainbowkit-celo/lists";
import { Alfajores, Celo, Cannoli } from "@celo/rainbowkit-celo/chains";
import { Address, defineChain, serializeTransaction } from "viem";
import type { SerializeTransactionFn } from "viem/dist/types/utils/transaction/serializeTransaction";
import { celo } from "viem/chains"
import { TransactionSerializable, TransactionSerializableGeneric } from "viem/dist/types/types/transaction"

type TXType = TransactionSerializableGeneric & {
  type: 'cip42',
  feeCurrency: Address,
} | TransactionSerializable

const mySerializer: SerializeTransactionFn<TXType> = (transaction) => {
  if (transaction.type === 'cip42') {
    return '0x7c' as const
  }
  return serializeTransaction(transaction)
}

const celoWithSerializer = defineChain({...celo, serializer: mySerializer});

const transaction: TXType = {
  chainId: 44787,
  invalidTestProperty: 'boo',
  feeCurrency: '0x00000'
}

const s = celoWithSerializer.serializer(transaction)

const { chains, publicClient } = configureChains(
  [Celo, Alfajores, Cannoli],
  [
    jsonRpcProvider({
      rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
    }),
  ]
);

const projectId = "944abdcd5d7e2b5d256ff7cc35021cc5";

const connectors = celoGroups({
  chains,
  projectId,
  appName: (typeof document === "object" && document.title) || "Sample App",
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient: publicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} coolMode={true}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
