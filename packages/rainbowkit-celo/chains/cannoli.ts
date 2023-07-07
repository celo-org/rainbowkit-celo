import { Chain } from "@rainbow-me/rainbowkit";
import  {celoCannoli } from "viem/chains";

const Cannoli: Chain = {
  ...celoCannoli,
  iconUrl: "https://rainbowkit-with-celo.vercel.app/icons/cannoli.svg",
  iconBackground: "#FCF6F1",
};

export default Cannoli;
