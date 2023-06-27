import { NextPage } from "next"
import { useCallback } from "react"
import { celo } from 'viem/chains'
import { useSendTransaction, useWalletClient } from 'wagmi'

import { SendTransactionParameters, createWalletClient, http } from 'viem'



export const FeeCurrency: NextPage = () => {

  const walletClient = createWalletClient({chain: celo, transport: http()})

  walletClient.sendTransaction({
    feeCurrency: '0x00000',
    account: '0x00000',
    nonce: 0,
    to: '0x00000'
  })

  const client = useWalletClient({chainId:celo.id})

  const tx: SendTransactionParameters<typeof celo> = {
    account: '0x00000',
    feeCurrency: "0x1929393yu2u73732",
    to: '0x20bh12'
  }

  useCallback(() => {

    client.data?.sendTransaction(tx)
  }, [client, tx])



  return <>

  </>
}