import { Chain } from '@rainbow-me/rainbowkit';

const Baklava: Chain = {
  id: 62320,
  name: 'Baklava',
  network: 'Baklava Testnet',
  iconUrl: 'https://reserve.mento.org/assets/tokens/CELO.svg',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'CELO',
    symbol: 'B-CELO',
  },
  rpcUrls: {
    default: 'https://baklava-forno.celo-testnet.org',
  },
  blockExplorers: {
    default: { name: 'BlockScout', url: 'https://explorer.celo.org/baklava' },
    etherscan: { name: 'BlockScout', url: 'https://explorer.celo.org/baklava' },
  },
  testnet: true,
};

export default Baklava;
