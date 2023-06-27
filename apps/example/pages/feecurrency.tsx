import { NextPage } from "next"
import { useCallback } from "react"
import {mainnet } from 'viem/chains'
import { celo } from "@celo/viem-tools/chains";
import { useWalletClient } from 'wagmi'

import { createWalletClient, http } from 'viem'



export const FeeCurrency: NextPage = () => {

  const walletClient = createWalletClient({chain: mainnet, transport: http()})

  walletClient.sendTransaction({feeCurrency:
    '0x00000',
    wrong: true, invalid: '1',
    account: '0x00000',
    chainId: celo.id, nonce: 0,
    to: '0x00000',
    value: '0x00000'
  })


  const client = useWalletClient({chainId:celo.id})

  useCallback(() => {
    client.data?.sendTransaction<typeof celo>({chain: celo, feeCurrency: '0x00000', foo: 'bar'})
  }, [client])

  return <>

  </>
}