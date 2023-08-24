import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  omniWallet,
  walletConnectWallet,
  coinbaseWallet,
  safeWallet,
  braveWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { Valora, CeloWallet, MetaMask } from "@celo/rainbowkit-celo/wallets";

import type { Chain } from "@rainbow-me/rainbowkit";

export default function connectors({
  chains,
  appName,
  projectId,
}: {
  chains: Chain[];
  projectId: string;
  appName?: string;
}) {
  return connectorsForWallets([
    {
      groupName: "Celo Only",
      wallets: [
        Valora({ chains, projectId }),
        CeloWallet({ chains, projectId }),
      ],
    },
    {
      groupName: "Supports Celo",
      wallets: [
        MetaMask({ chains, projectId }),
        braveWallet({ chains }), // only shows when in brave and  celo chains are configured in brave wallet
        safeWallet({ chains }),
        omniWallet({ chains, projectId }),
        walletConnectWallet({ chains, projectId }),
      ].concat(appName ? [coinbaseWallet({ appName, chains })] : []),
    },
  ]);
}
