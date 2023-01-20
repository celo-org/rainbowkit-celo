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
    default: {
        http: ['https://alfajores-forno.celo-testnet.org']
      },
  },
  blockExplorers: {
    default: { name: 'Celo Explorer', url: 'https://explorer.celo.org/alfajores' },
    etherscan: { name: 'CeloScan', url: 'https://alfajores.celoscan.io/' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 14569001
    }
  },
  testnet: true,
};

export default Alfajores;
