import { WalletConnectConnector } from "wagmi/dist/connectors/walletConnect"

export async function getUri(connector: WalletConnectConnector): Promise<string> {
  const provider = await connector.getProvider()
  return new Promise((resolve, reject) => {
    provider.on('display_uri', (uri) => {
      return resolve(uri)
    })
  })
}
