import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  omniWallet,
  walletConnectWallet,
  ledgerWallet
} from '@rainbow-me/rainbowkit/wallets';
import { Valora, CeloWallet } from "@celo/rainbowkit-celo/wallets";

import type { Chain } from "@rainbow-me/rainbowkit";


export default function connectors({chains}: {chains: Chain[]}) {
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
        ledgerWallet({chains}),
        walletConnectWallet({ chains }),
      ]
    }
  ])
}
