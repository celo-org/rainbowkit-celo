import { Chain, Wallet } from "@rainbow-me/rainbowkit";
import { InjectedConnector } from "wagmi/connectors/injected";
import {
  MiniContractKit,
  newKit,
  newKitFromWeb3,
} from "@celo/contractkit/lib/mini-kit";

import { Baklava } from "../chains";

export interface ValoraOptions {
  chains: Chain[];
}

export const CeloExtension = ({
  chains = [Baklava],
}: ValoraOptions): Wallet => {
  const isCeloWalletInjected =
    typeof window !== "undefined" && typeof window.celo !== "undefined";

  return {
    id: "celo-extension",
    name: "Celo Extension",
    iconUrl:
      "https://registry.walletconnect.com/api/v1/logo/md/36d854b702817e228d5c853c528d7bdb46f4bb041d255f67b82eb47111e5676b",
    iconBackground: "#FFF",
    downloadUrls: {
      browserExtension:
        "https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh?hl=en",
    },

    installed: isCeloWalletInjected,
    createConnector: () => {
      //   if (typeof window !== "undefined" && !isCeloWalletInjected) {
      //     throw new Error("Couldn't initialize CeloWallet connector");
      //   }

      const connector = new InjectedConnector({
        options: {
          name: "Celo Extension Wallet",
        },
        chains,
      });

      return {
        connector,
      };
    },
  };
};

export default CeloExtension;
