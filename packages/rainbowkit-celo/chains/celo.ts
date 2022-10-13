import { Chain } from '@rainbow-me/rainbowkit';

const Celo: Chain = {
  id: 42220,
  name: 'Celo Mainnet',
  network: 'Celo Mainnet',
  iconUrl: 'https://reserve.mento.org/assets/tokens/CELO.svg',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'CELO',
    symbol: 'CELO',
  },
  rpcUrls: {
    default: 'https://forno.celo.org',
  },
  blockExplorers: {
    default: { name: 'BlockScout', url: 'https://explorer.celo.org/mainnet' },
    etherscan: { name: 'CeloScan', url: 'https://celoscan.io' },
  },
  testnet: false,
};

export default Celo;
