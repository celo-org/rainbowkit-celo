# Rainbowkit-celo

This is a plugin to help [rainbowkit](https://www.rainbowkit.com/docs) developers support the CELO protocol faster.
It includes the chain information as well as the main CELO wallets (Valora, Celo Wallet, Celo Terminal...).

## Installation

```sh
npm install @celo/rainbowkit-celo
```

This package has `@rainbow-me/rainbowkit` as a peer dependency and expect it to be installed too. Follow [their instructions](https://www.rainbowkit.com/docs/installation) if that's not done yet.

## Usage

```ts
import {
  connectorsForWallets,
  RainbowKitProvider
} from "@rainbow-me/rainbowkit";
import { 
  metaMaskWallet, 
  omniWallet, 
  walletConnectWallet 
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

// Import known recommended wallets
import { Valora, CeloWallet, CeloDance } from "@celo/rainbowkit-celo/wallets";

// Import CELO chain information
import { Alfajores, Celo } from "@celo/rainbowkit-celo/chains";

const { chains, provider } = configureChains(
  [Alfajores, Celo],
  [jsonRpcProvider({ rpc: (chain) => ({ http: chain.rpcUrls.default }) })]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended with CELO",
    wallets: [
      Valora({ chains }),
      CeloWallet({ chains }),
      CeloDance({ chains }),
      metaMaskWallet({ chains }),
      omniWallet({ chains }),
      walletConnectWallet({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

// ... Your exisiting app.
```


## Adding wallets to the config 

If the wallet exists in the normal rainbow kit package you can add it to the Supports Celo list at [lists/index.ts](https://github.com/celo-org/rainbowkit-celo/blob/main/packages/rainbowkit-celo/lists/index.ts) 

If the wallet needs a new config add a new file in [wallets folder](https://github.com/celo-org/rainbowkit-celo/tree/main/packages/rainbowkit-celo/wallets) with the config needed for you wallet. Then import this to the lists/index.ts file 
