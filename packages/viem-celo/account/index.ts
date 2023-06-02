import { CustomSource, signMessage, signTypedData, toAccount } from 'viem/accounts'
import { signTransaction } from './signTransaction'
import { getAddress } from 'viem'

/*
 * Creates a local account with the same capabilities as a normal viem local account
 * as well as the ability to sign CIP42 transactions
 */
export function createCeloAccount(privateKey: `0x${string}`) {
  const celoAccountSource: CustomSource = {
    address: getAddress(privateKey),
    signMessage: async ({message}) => {
      return signMessage({message, privateKey})
    },
    signTypedData: async (typedData) => {
      return signTypedData({privateKey, ...typedData})
    },
    signTransaction: async (transaction) => {
      return signTransaction({privateKey, transaction})
    }
  }

  return toAccount(celoAccountSource)
}

