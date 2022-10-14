import type { Chain, Wallet } from "@rainbow-me/rainbowkit";
import { getWalletConnectConnector } from "@rainbow-me/rainbowkit";

import { Alfajores, Baklava, Celo } from "../chains";

// rainbowkit utils has it but doesn't export it :/
export function isAndroid(): boolean {
  return (
    typeof navigator !== "undefined" && /android/i.test(navigator.userAgent)
  );
}

export interface ValoraOptions {
  chains: Chain[];
}

export const Valora = ({
  chains = [Alfajores, Baklava, Celo],
}: ValoraOptions): Wallet => ({
  id: "valora",
  name: "Valora",
  iconUrl:
    "https://registry.walletconnect.com/api/v1/logo/md/d01c7758d741b363e637a817a09bcf579feae4db9f5bb16f599fdd1f66e2f974",
  iconBackground: "#FFF",
  downloadUrls: {
    android: "https://play.google.com/store/apps/details?id=co.clabs.valora",
    ios: "https://apps.apple.com/app/id1520414263?mt=8",
    qrCode: "https://valoraapp.com/"
  },
  createConnector: () => {
    const connector = getWalletConnectConnector({
      chains,
    });
    async function getUri() {
      const { uri } = (await connector.getProvider()).connector;
      return isAndroid()
        ? uri
        : `https://valoraapp.com/wc?uri=${encodeURIComponent(uri)}`;
    }
    return {
      connector,
      mobile: {
        getUri,
      },
      qrCode: {
        getUri,
        instructions: {
          learnMoreUrl: "https://valoraapp.com/learn",
          steps: [
            {
              description:
                "The crypto wallet to buy, send, spend, earn, and collect NFTs on the Celo blockchain.",
              step: "install",
              title: "Open the Valora app",
            },
            {
              description:
                "After you scan, a connection prompt will appear for you to connect your wallet.",
              step: "scan",
              title: "Tap the scan button",
            },
          ],
        },
      },
    };
  },
});

export default Valora;
