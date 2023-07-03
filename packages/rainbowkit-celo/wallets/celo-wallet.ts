import type { Chain, Wallet } from "@rainbow-me/rainbowkit";
import { getWalletConnectConnector } from "@rainbow-me/rainbowkit";

import { Alfajores, Baklava, Celo } from "@celo/rainbowkit-celo/chains";
import { getWalletConnectUri } from "@celo/rainbowkit-celo/utils/getWalletConnectUri";

export interface CeloWalletOptions {
  chains: Chain[];
  projectId: string;
}

export const CeloWallet = ({
  chains = [Alfajores, Baklava, Celo],
  projectId,
}: CeloWalletOptions): Wallet => ({
  id: "celo-wallet",
  name: "Celo Wallet",
  iconUrl: "https://rainbowkit-with-celo.vercel.app/icons/mono.svg",
  iconBackground: "#FFF",
  createConnector: () => {
    const connector = getWalletConnectConnector({
      version: "2",
      chains,
      projectId,
    });
    return {
      connector,
      mobile: {
        getUri: () => getWalletConnectUri(connector, "2"),
      },
      desktop: {
        getUri: async () => {
          const uri = await getWalletConnectUri(connector, "2");
          return `celowallet://wc?uri=${encodeURIComponent(uri)}`;
        },
      },
    };
  },
});

export default CeloWallet;
