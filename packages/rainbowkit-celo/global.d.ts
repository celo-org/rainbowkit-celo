declare global {
  interface Window {
    ethereum?: Ethereum;
    celo?: AbstractProvider & {
      on?: (...args: unknown[]) => void;
      removeListener?: (...args: unknown[]) => void;
      autoRefreshOnNetworkChange?: boolean;
      enable: () => Promise<void>;
    };
    web3?: unknown;
  }
}
