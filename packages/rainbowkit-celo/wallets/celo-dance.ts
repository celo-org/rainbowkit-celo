import {
  Chain,
  getWalletConnectConnector,
  Wallet,
} from "@rainbow-me/rainbowkit";
import { Alfajores, Baklava, Mainnet } from "../chains";

export interface CeloDanceOptions {
  chains: Chain[];
}

export const CeloDance = ({
  chains = [Alfajores, Baklava, Mainnet],
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
    return {
      connector,
      mobile: {
        getUri: async () => {
          const { uri } = (await connector.getProvider()).connector;
          return uri;
        },
      },
      qrCode: {
        getUri: async () => (await connector.getProvider()).connector.uri,
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
