import {
  Chain,
  getWalletConnectConnector,
  Wallet,
} from "@rainbow-me/rainbowkit";
import { Alfajores, Baklava, Celo } from "@celo/rainbowkit-celo/chains";
import { getUri } from "./getUri"
interface CeloTerminalOptions {
  chains: Chain[];
  projectId: string;
}

export const CeloTerminal = ({
  chains = [Alfajores, Baklava, Celo],
  projectId,
}: CeloTerminalOptions): Wallet => ({
  id: "celo-terminal",
  name: "Celo Terminal",
  iconUrl:
    "https://registry.walletconnect.com/api/v1/logo/md/8f8506b7f191a8ab95a8295fc8ca147aa152b1358bee4283d6ad2468d97e0ca4",
  iconBackground: "#FFF",
  createConnector: () => {
    const connector = getWalletConnectConnector({
      chains,
      projectId,
    });

    return {
      connector,
      desktop: {
        getUri: async () => {
          const uri = await getUri(connector)
          // Note: This doesn't work. I'll try to have a PR to add deeplinking to CeloTerminal - Nicolas
          return `https://celoterminal.com/wc?uri=${encodeURIComponent(uri)}`;
        },
      },
    };
  },
});

export default CeloTerminal;
