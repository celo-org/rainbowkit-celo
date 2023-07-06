import {
  Chain,
  getWalletConnectConnector,
  Wallet,
} from "@rainbow-me/rainbowkit";

import {
  Alfajores,
  Baklava,
  Celo,
  Cannoli,
} from "@celo/rainbowkit-celo/chains";
import { getWalletConnectUri } from "@celo/rainbowkit-celo/utils/getWalletConnectUri";

// rainbowkit utils has it but doesn't export it :/
function isAndroid(): boolean {
  return (
    typeof navigator !== "undefined" && /android/i.test(navigator.userAgent)
  );
}

export interface ValoraOptions {
  chains: Chain[];
  projectId: string;
}

export const Valora = ({
  chains = [Alfajores, Baklava, Celo, Cannoli],
  projectId,
}: ValoraOptions): Wallet => ({
  id: "valora",
  name: "Valora",
  iconUrl:
    "https://registry.walletconnect.com/api/v1/logo/md/d01c7758d741b363e637a817a09bcf579feae4db9f5bb16f599fdd1f66e2f974",
  iconBackground: "#FFF",
  downloadUrls: {
    android: "https://play.google.com/store/apps/details?id=co.clabs.valora",
    ios: "https://apps.apple.com/app/id1520414263?mt=8",
    qrCode: "https://valoraapp.com/",
  },
  // @ts-expect-error
  createConnector: () => {
    const connector = getWalletConnectConnector({
      version: "2",
      chains,
      projectId,
    });
    return {
      connector,
      mobile: {
        getUri: async () => {
          // @ts-expect-error
          const uri = await getWalletConnectUri(connector, "2");
          return isAndroid()
            ? uri
            : // ideally this would use the WalletConnect registry, but this will do for now
              `celo://wallet/wc?uri=${encodeURIComponent(uri)}`;
        },
      },
      qrCode: {
        // @ts-expect-error
        getUri: () => getWalletConnectUri(connector, "2"),
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
