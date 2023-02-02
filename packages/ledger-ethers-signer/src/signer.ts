import 'src/polyfills/buffer' // Must be the first import
import { CeloTransactionRequest, serializeCeloTransaction } from '@celo-tools/celo-ethers-wrapper'
import { TransportError, TransportStatusError } from '@ledgerhq/errors'
import { BigNumber, providers, Signer, utils } from 'ethers'
import { CeloLedgerApp } from './CeloLedgerApp.js'
import { getLedgerTransport } from './ledgerTransport.js'
import { getTokenData } from './tokenData.js'
import { areAddressesEqual, ensureLeading0x, trimLeading0x } from './utils/addresses.js'
import { sleep } from './utils/time.js'
import { config, CELO_LEDGER_APP_MIN_VERSION } from './consts.js'

// Based on https://github.com/celo-tools/celo-web-wallet/blob/master/src/features/ledger/LedgerSigner.ts
export class LedgerSigner extends Signer {
  address: Address | undefined

  constructor(readonly provider: providers.Provider, readonly path: string) {
    super()
  }

  async init() {
    if (this.address) throw new Error('Ledger Signer already initialized')

    await this.validateCeloAppVersion()

    const account = await this.perform((celoApp) => celoApp.getAddress(this.path))
    this.address = utils.getAddress(account.address)
  }

  private async validateCeloAppVersion() {
    let appConfiguration
    try {
      appConfiguration = await this.perform((celoApp) => celoApp.getAppConfiguration())
      if (!appConfiguration) throw new Error('Unable to retrieve Ledger app configuration')
      if (!appConfiguration.version) throw new Error('Ledger app config missing version info')
    } catch (error) {
      // The getAppConfiguration has been flaky since the latest Ledger firmware update
      // To prevent valid app configs from being blocked, this will fail open for now
      console.error('Unable to get ledger app config. Sometimes flaky, swallowing error.', error)
      return
    }

    const version: string = appConfiguration.version
    const versionSegments = version.split('.').map((s) => parseInt(s))
    const minVersionSegments = CELO_LEDGER_APP_MIN_VERSION.split('.').map((s) => parseInt(s))

    if (versionSegments.length !== 3) throw new Error('Invalid Ledger app version segments')
    if (versionSegments[0] !== minVersionSegments[0])
      throw new Error(`Unsupported Ledger app major version, must be ${minVersionSegments[0]}`)
    if (versionSegments[1] < minVersionSegments[1] || versionSegments[2] < minVersionSegments[2])
      throw new Error(
        `Unsupported Ledger app version, must be at least ${CELO_LEDGER_APP_MIN_VERSION}`
      )

    if (!appConfiguration?.arbitraryDataEnabled)
      throw new Error(
        'Ledger does not allow contract data. Required for safe token transfers. Enable it from the ledger app settings.'
      )
  }

  async populateTransaction(transaction: utils.Deferrable<CeloTransactionRequest>): Promise<any> {
    const tx: any = await utils.resolveProperties(transaction)

    if (!tx.to || !tx.gasPrice || !tx.gasLimit) {
      console.error('To, gasPrice, and gasLimit fields all mandatory', tx)
      throw new Error('Tx is missing mandatory fields')
    }

    if (tx.nonce == null) {
      const nonce = await this.getTransactionCount('pending')
      tx.nonce = BigNumber.from(nonce).toNumber()
    }

    if (tx.chainId == null) {
      tx.chainId = config.chainId
    } else if (tx.chainId !== config.chainId) {
      throw new Error('Chain Id mismatch')
    }

    return tx
  }

  private async perform<T = any>(callback: (celoApp: CeloLedgerApp) => Promise<T>): Promise<T> {
    const transport = await getLedgerTransport()
    try {
      const celoApp = new CeloLedgerApp(transport)

      // Try up to 3 times over 3 seconds
      for (let i = 0; i < 3; i++) {
        try {
          const result = await callback(celoApp)
          return result
        } catch (error: any) {
          if (error instanceof TransportError) {
            console.error('Ledger TransportError', error.name, error.id, error.message)
            if (error.id === 'TransportLocked') {
              // Device is locked up, possibly from another use. Wait then try again
              await sleep(1000)
              continue
            } else {
              throw new Error(`Ledger transport issue: ${error.message || 'unknown error'}`)
            }
          }

          if (error instanceof TransportStatusError) {
            console.error(
              'Ledger TransportStatusError',
              error.statusCode,
              error.statusText,
              error.message
            )
            throw new Error(error.message || 'Ledger responded with failure')
          }

          console.error('Unknown ledger error', error)
          break
        }
      }

      throw new Error('Ledger action failed, please check connection')
    } finally {
      await transport
        .close()
        .catch((error: any) => console.error('Suppressing error during transport close', error))
    }
  }

  async getAddress(): Promise<string> {
    if (!this.address) throw new Error('LedgerSigner must be initiated before getting address')
    return this.address
  }

  async signMessage(message: utils.Bytes | string): Promise<string> {
    if (typeof message === 'string') {
      message = utils.toUtf8Bytes(message)
    }

    // Ledger expects hex without leading 0x
    const messageHex = trimLeading0x(utils.hexlify(message))

    const sig = await this.perform((celoApp) => celoApp.signPersonalMessage(this.path, messageHex))
    sig.r = ensureLeading0x(sig.r)
    sig.s = ensureLeading0x(sig.s)
    return utils.joinSignature(sig)
  }

  async signTransaction(transaction: CeloTransactionRequest): Promise<string> {
    const tx = await this.populateTransaction(transaction)

    if (tx.from != null) {
      if (utils.getAddress(tx.from) !== this.address) {
        throw new Error('Transaction from address mismatch')
      }
      delete tx.from
    }

    // Provide ERC20 info for known tokens
    const toTokenInfo = getTokenData(transaction.to)
    const feeTokenInfo = getTokenData(transaction.feeCurrency)
    if (toTokenInfo) {
      await this.perform((celoApp) => celoApp.provideERC20TokenInformation(toTokenInfo))
    }
    if (
      feeTokenInfo &&
      (!toTokenInfo ||
        !areAddressesEqual(toTokenInfo.contractAddress, feeTokenInfo.contractAddress))
    ) {
      await this.perform((celoApp) => celoApp.provideERC20TokenInformation(feeTokenInfo))
    }

    // Ledger expects hex without leading 0x
    const unsignedTx = trimLeading0x(serializeCeloTransaction(tx))
    const sig = await this.perform((celoApp) => celoApp.signTransaction(this.path, unsignedTx))

    return serializeCeloTransaction(tx, {
      v: BigNumber.from(ensureLeading0x(sig.v)).toNumber(),
      r: ensureLeading0x(sig.r),
      s: ensureLeading0x(sig.s),
    })
  }

  // Override just for type fix
  sendTransaction(
    transaction: utils.Deferrable<CeloTransactionRequest>
  ): Promise<providers.TransactionResponse> {
    return super.sendTransaction(transaction)
  }

  connect(): Signer {
    throw new Error('Connect method unimplemented on LedgerSigner')
  }
}