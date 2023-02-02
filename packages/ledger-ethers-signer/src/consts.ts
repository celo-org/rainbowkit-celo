export const CELO_LEDGER_APP_MIN_VERSION = '1.0.3' // Only allow versions or newer of the celo app that runs on the ledger device


export enum CeloChain {
  Mainnet = 42220,
  Alfajores = 44787,
}
// TODO this really needs to be configurable
export const config = {
  chainId: CeloChain.Mainnet
}