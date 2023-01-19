import { Chain } from '@rainbow-me/rainbowkit';

const Celo: Chain = {
  id: 42220,
  name: 'Celo Mainnet',
  network: 'Celo Mainnet',
  iconUrl: 'https://rainbowkit-with-celo.vercel.app/icons/celo.svg',
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
    default: { name: 'Celo Explorer', url: 'https://explorer.celo.org/mainnet' },
    etherscan: { name: 'CeloScan', url: 'https://celoscan.io' },
  },
  multicall: {
    address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    blockCreated: 13112599
  },
  testnet: false,
};

export default Celo;
