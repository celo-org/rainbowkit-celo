import {
  Chain,
  getWalletConnectConnector,
  Wallet,
} from "@rainbow-me/rainbowkit";
import { Alfajores, Baklava, Celo } from "@celo/rainbowkit-celo/chains";

export interface CeloDanceOptions {
  chains: Chain[];
}

export const CeloDance = ({
  chains = [Alfajores, Baklava, Celo],
}: CeloDanceOptions): Wallet => ({
  id: "celo-dance",
  name: "Celo Dance",
  iconUrl:
    "https://registry.walletconnect.com/api/v1/logo/md/9b9be9e11e15dfc7e6914449c78c345a60a3a5a8ec5855df5517eb76c56b6018",
  iconBackground: "#FFF",
  downloadUrls: {
    android: "https://play.google.com/store/apps/details?id=cn.app.celo.dance",
    ios: "https://apps.apple.com/hk/app/celodance/id1563256439",
  },
  createConnector: () => {
    const connector = getWalletConnectConnector({
      chains,
    });
    async function getUri() {
      const { uri } = (await connector.getProvider()).connector;
      return uri;
    }

    return {
      connector,
      mobile: {
        getUri
      },
      qrCode: {
        getUri,
        instructions: {
          learnMoreUrl: "https://celo.dance/",
          steps: [
            {
              description:
                "Let The Money Dance. Send, Vote And Earn Celo Assets, Make it Mobile",
              step: "install",
              title: "Open Celo Dance",
            },
            {
              description:
                "You can copy the QR Code URL in the connect section of Celo Wallet",
              step: "scan",
              title: "Copy the QR Code URL",
            },
          ],
        },
      },
    };
  },
});

export default CeloDance;
