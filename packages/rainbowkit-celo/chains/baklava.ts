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
    default: { name: 'Celo Explorer', url: 'https://explorer.celo.org/baklava' },
    etherscan: { name: 'Celo Explorer', url: 'https://explorer.celo.org/baklava' },
  },
  multicall: {
    address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    blockCreated: 13112599
  },
  testnet: true,
};

export default Baklava;
