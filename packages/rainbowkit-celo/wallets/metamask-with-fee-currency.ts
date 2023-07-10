import { getWalletConnectConnector } from '@rainbow-me/rainbowkit'
import { MetaMaskConnector } from '@wagmi/connectors/metaMask'
import {createWalletClient, type EIP1193RequestFn, createTransport, type TransportConfig, type CustomTransport, type CustomTransportConfig } from 'viem'
import { getWalletConnectUri } from '../utils/getWalletConnectUri'
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets'
import type { MetaMaskConnectorOptions } from '@wagmi/core/connectors/metaMask';
import type {Chain, Wallet} from "@rainbow-me/rainbowkit"

export interface MetaMaskWalletOptions {
    projectId: string;
    chains: Chain[];
    walletConnectVersion?: '2';
    walletConnectOptions?: Parameters<typeof getWalletConnectConnector>[0]['options'];
}


const snapId = 'npm:@celo/gas-snap'

import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window{
    ethereum?: MetaMaskInpageProvider | any
  }
}

type EthereumProvider = { request: TransportConfig['request'] }

class MetaMaskConnectorPlus extends MetaMaskConnector  {

  hasGasSnap: boolean = false

  async checkForGasSnap() {
    if (this.hasGasSnap) {
      return true
    }
    const provider = await this.getProvider()
    debugger
    const result: any = await provider?.request({
      // @ts-expect-error  -- viem doesn't know this method
      method: 'wallet_requestSnaps',
      // @ts-expect-error
      params: {[snapId]: {}},
    });
    console.info('wallet_requestSnaps', result)
    if (result) {
      this.hasGasSnap = true
    }
    return !!result
  }
  // @ts-ignore
  async getWalletClient({ chainId }: { chainId?: number } = {}) {
    const [provider, account] = await Promise.all([
      this.getProvider(),
      this.getAccount(),
    ])
    const chain = this.chains.find((x) => x.id === chainId)
    if (!provider) throw new Error('provider is required.')

    await this.checkForGasSnap()

    return createWalletClient({
      account,
      chain,
      transport: custom(provider,  {}, this.checkForGasSnap.bind(this)),
    })
  }
}

function custom<TProvider extends EthereumProvider>(
  provider: TProvider,
  config: CustomTransportConfig = {},
  checkForGasSnap: () => Promise<boolean>,
): CustomTransport {
  const { key = 'custom', name = 'Custom Provider', retryDelay } = config
  return ({ retryCount: defaultRetryCount }) =>
    createTransport({
      key,
      name,
      // @ts-expect-error
      request:  async (args) => {
        const hasGasSnap = await checkForGasSnap()
        debugger
        if (hasGasSnap && args.method === 'eth_sendTransaction' && Array.isArray(args.params)) {
          const tx = args.params[0]
          console.info('tx', tx)
          return provider.request({
            method: 'wallet_invokeSnap',
            params: {
              snapId: snapId,
              request: {
                method: 'celo_sendTransaction',
                params: {
                  tx
                },
              },
            },
          }) as ReturnType<TransportConfig['request']>
        }
        return provider.request(args) as ReturnType<TransportConfig['request']>
      },
      retryCount: config.retryCount ?? defaultRetryCount,
      retryDelay,
      type: 'custom',
    })
}


export const metaMaskWalletPlus = ({
  chains,
  projectId,
  walletConnectVersion = '2',
  ...options
}: MetaMaskWalletOptions & MetaMaskConnectorOptions): Wallet => {
  const providers = typeof window !== 'undefined' && window.ethereum?.providers;

  // Not using the explicit isMetaMask fn to check for MetaMask
  // so that users can continue to use the MetaMask button
  // to interact with wallets compatible with window.ethereum.
  // The connector's getProvider will instead favor the real MetaMask
  // in window.providers scenarios with multiple wallets injected.
  const isMetaMaskInjected =
    typeof window !== 'undefined' &&
    typeof window.ethereum !== 'undefined' &&
    (window.ethereum.providers?.some(isMetaMask) || window.ethereum.isMetaMask);
  const shouldUseWalletConnect = !isMetaMaskInjected;



  const wallet = metaMaskWallet({chains, projectId, ...options})


  return {
    ...wallet,
    // @ts-expect-error
    createConnector: () => {
      const connector = shouldUseWalletConnect
        ? getWalletConnectConnector({
            version: '2',
            projectId,
            chains,
            options: options.walletConnectOptions
          })
        : new MetaMaskConnectorPlus({
            chains,
            options: {
              // @ts-expect-error
              getProvider: () =>
                providers
                  ? providers.find(isMetaMask)
                  : typeof window !== 'undefined'
                  ? window.ethereum
                  : undefined,
              ...options,
            },
          });

      const getUri = async () => {
        // @ts-expect-error
        const uri = await getWalletConnectUri(connector, 2);
        return isAndroid()
          ? uri
          : isIOS()
          ? // currently broken in MetaMask v6.5.0 https://github.com/MetaMask/metamask-mobile/issues/6457
            `metamask:///wc?uri=${encodeURIComponent(uri)}`
          : `https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`;
      };

      return {
        connector,
        mobile: {
          getUri: shouldUseWalletConnect ? getUri : undefined,
        },
        qrCode: shouldUseWalletConnect
          ? {
              getUri,
              instructions: {
                learnMoreUrl: 'https://metamask.io/faqs/',
                steps: [
                  {
                    description:
                      'We recommend putting MetaMask on your home screen for quicker access.',
                    step: 'install',
                    title: 'Open the MetaMask app',
                  },
                  {
                    description:
                      'Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.',
                    step: 'create',
                    title: 'Create or Import a Wallet',
                  },
                  {
                    description:
                      'After you scan, a connection prompt will appear for you to connect your wallet.',
                    step: 'scan',
                    title: 'Tap the scan button',
                  },
                ],
              },
            }
          : undefined,
        extension: {
          instructions: {
            learnMoreUrl: 'https://metamask.io/faqs/',
            steps: [
              {
                description:
                  'We recommend pinning MetaMask to your taskbar for quicker access to your wallet.',
                step: 'install',
                title: 'Install the MetaMask extension',
              },
              {
                description:
                  'Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.',
                step: 'create',
                title: 'Create or Import a Wallet',
              },
              {
                description:
                  'Once you set up your wallet, click below to refresh the browser and load up the extension.',
                step: 'refresh',
                title: 'Refresh your browser',
              },
            ],
          },
        },
      };
    },
  };
};

// https://github.com/rainbow-me/rainbowkit/blob/main/site/lib/isMobile.ts
export function isAndroid(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    /Android\s([0-9.]+)/.test(navigator.userAgent) // Source: https://github.com/DamonOehlman/detect-browser/blob/master/src/index.ts
  );
}

export function isIOS(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    /Version\/([0-9._]+).*Mobile.*Safari.*/.test(navigator.userAgent) // Source: https://github.com/DamonOehlman/detect-browser/blob/master/src/index.ts
  );
}

// https://github.com/rainbow-me/rainbowkit/blob/main/packages/rainbowkit/src/wallets/walletConnectors/metaMaskWallet/metaMaskWallet.ts
function isMetaMask(ethereum?: typeof window['ethereum']): boolean {
  // Logic borrowed from wagmi's MetaMaskConnector
  // https://github.com/wagmi-dev/references/blob/main/packages/connectors/src/metaMask.ts
  if (!ethereum?.isMetaMask) return false;
  // Brave tries to make itself look like MetaMask
  // Could also try RPC `web3_clientVersion` if following is unreliable
  if (ethereum.isBraveWallet && !ethereum._events && !ethereum._state)
    return false;
  if (ethereum.isApexWallet) return false;
  if (ethereum.isAvalanche) return false;
  if (ethereum.isBackpack) return false;
  if (ethereum.isBifrost) return false;
  if (ethereum.isBitKeep) return false;
  if (ethereum.isBitski) return false;
  if (ethereum.isBlockWallet) return false;
  if (ethereum.isCoinbaseWallet) return false;
  if (ethereum.isDawn) return false;
  if (ethereum.isEnkrypt) return false;
  if (ethereum.isExodus) return false;
  if (ethereum.isFrame) return false;
  if (ethereum.isFrontier) return false;
  if (ethereum.isGamestop) return false;
  if (ethereum.isHyperPay) return false;
  if (ethereum.isImToken) return false;
  if (ethereum.isKuCoinWallet) return false;
  if (ethereum.isMathWallet) return false;
  if (ethereum.isOkxWallet || ethereum.isOKExWallet) return false;
  if (ethereum.isOneInchIOSWallet || ethereum.isOneInchAndroidWallet)
    return false;
  if (ethereum.isOpera) return false;
  if (ethereum.isPhantom) return false;
  if (ethereum.isPortal) return false;
  if (ethereum.isRabby) return false;
  if (ethereum.isRainbow) return false;
  if (ethereum.isStatus) return false;
  if (ethereum.isTally) return false;
  if (ethereum.isTokenPocket) return false;
  if (ethereum.isTokenary) return false;
  if (ethereum.isTrust || ethereum.isTrustWallet) return false;
  if (ethereum.isXDEFI) return false;
  if (ethereum.isZerion) return false;
  return true;
}