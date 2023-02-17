import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  omniWallet,
  walletConnectWallet,
  coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { Valora, CeloWallet } from "@celo/rainbowkit-celo/wallets";

import type { Chain } from "@rainbow-me/rainbowkit";


export default function connectors({chains, appName}: {chains: Chain[], appName?: string}) {
  return connectorsForWallets([
    {
      groupName: "Celo Only",
      wallets: [
        Valora({chains}),
        CeloWallet({chains}),
      ]
    },
    { groupName: "Supports Celo",
      wallets: [
        metaMaskWallet({chains}),
        omniWallet({ chains }),
        walletConnectWallet({ chains }),
      ].concat(appName ? [coinbaseWallet({appName, chains })]: [])
    }
  ])
}
