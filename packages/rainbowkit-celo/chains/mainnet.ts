import { Chain } from '@rainbow-me/rainbowkit';

const Mainnet: Chain = {
  id: 42220,
  name: 'Mainnet',
  network: 'Mainnet',
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
    default: { name: 'Block Scout', url: 'https://explorer.celo.org' },
    etherscan: { name: 'Block Scout', url: 'https://explorer.celo.org' },
  },
  testnet: false,
};

export default Mainnet;
