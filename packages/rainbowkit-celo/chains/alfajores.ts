import { Chain } from '@rainbow-me/rainbowkit';

const Alfajores: Chain = {
  id: 44787,
  name: 'Alfajores',
  network: 'Alfajores Testnet',
  iconUrl: 'https://reserve.mento.org/assets/tokens/CELO.svg',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'CELO',
    symbol: 'A-CELO',
  },
  rpcUrls: {
    default: 'https://alfajores-forno.celo-testnet.org',
  },
  blockExplorers: {
    default: { name: 'Block Scout', url: 'https://alfajores-blockscout.celo-testnet.org' },
    etherscan: { name: 'Block Scout', url: 'https://alfajores-blockscout.celo-testnet.org' },
  },
  testnet: true,
};

export default Alfajores;
