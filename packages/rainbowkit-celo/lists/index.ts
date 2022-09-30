import { connectorsForWallets,  wallet } from "@rainbow-me/rainbowkit";
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
        wallet.metaMask({chains}),
        wallet.steak({ chains }),
        wallet.ledger({chains}),
        wallet.walletConnect({ chains }),
      ]
    }
  ])
}
