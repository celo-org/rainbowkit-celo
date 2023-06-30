import { NextPage } from "next"
import { useCallback, useState } from "react"
import { useMemo } from "react"
import { celoAlfajores } from 'viem/chains'
import { useContractRead, useContractWrite, useWalletClient } from 'wagmi'
import {privateKeyToAccount } from 'viem/accounts'
import { Hex, SendTransactionParameters, WriteContractParameters,  createWalletClient,  defineChain, http } from 'viem'
import SyntaxHighlighter from "react-syntax-highlighter";
import {stableTokenABI, registryABI} from "@celo/abis/types/wagmi"
// only needed until serializer PR is merged into viem
import {serializeTransaction} from '../serializeTransaction'
const celoWithSerializer = defineChain(celoAlfajores, {formatters: celoAlfajores.formatters, serializers: {transaction: serializeTransaction}})

const useRegistry = (name: string) =>  useContractRead({
  abi: registryABI,
  address: '0x000000000000000000000000000000000000ce10',
  functionName: 'getAddressForString',
  args: [name]
})

const FeeCurrency: NextPage = () => {

  const [sendTransactionHash, setSendTransactionHash] = useState('')

  const CUSD_ADDRESS = useRegistry('StableToken')

  const pk = process.env.NEXT_PUBLIC_PK

  const account = useMemo(() => pk && privateKeyToAccount(pk as Hex), [pk])

  const localAccountClient = useMemo(() => {
    if (!account) return undefined
    console.info('account addr', account.address)
    return createWalletClient({
      account,
      // @ts-ignore
      chain: celoWithSerializer,
      transport: http()
    })
  },[account])


  const sendTransaction = useCallback(async (tx: Omit<SendTransactionParameters<typeof celoAlfajores>, 'account'>) => {
    if (!localAccountClient) return
    debugger
    // @ts-expect-error
    const hash = await localAccountClient.sendTransaction(tx)
    setSendTransactionHash(hash);

  }, [localAccountClient])

  const payWithStableTokenCode = `
      sendTransaction({
        feeCurrency: CUSD_ADDRESS,
        value: BigInt(100000000000000000),
        to: '0x22579CA45eE22E2E16dDF72D955D6cf4c767B0eF',
      })
  `

  const payWithStableToken = useCallback(() => {
      return sendTransaction({
        feeCurrency: CUSD_ADDRESS.data,
        value: BigInt(100000000000000000),
        to: '0x22579CA45eE22E2E16dDF72D955D6cf4c767B0eF',
      })
  }, [sendTransaction, CUSD_ADDRESS.data])


  // localAccountClient.writeContract({
  //   account: '0x00000',
  //   abi: stableTokenABI,
  //   address: '0x00000',
  //   functionName: 'transfer',
  //   args: ['0x00000', BigInt(0)],
  //   feeCurrency: '0x00000',
  // })

  const client = useWalletClient({chainId:celoAlfajores.id})

  const contractParams: WriteContractParameters<typeof stableTokenABI, 'transfer', typeof celoAlfajores> = {
    account: '0x00000',
    abi: stableTokenABI,
    address: '0x00000',
    functionName: 'transfer',
    args: ['0x00000', BigInt(0)],
    feeCurrency: '0x00000',
  }


  const sendViaRPC = useCallback(() => {
    return client.data?.sendTransaction({
      // @ts-ignore
        from: client.data?.account.address,
        feeCurrency: CUSD_ADDRESS.data,
        maxFeePerGas: BigInt(700000),
        maxPriorityFeePerGas: BigInt(700000),
        value: BigInt(100000000000000000),
        to: '0x22579CA45eE22E2E16dDF72D955D6cf4c767B0eF',
      })
  }, [CUSD_ADDRESS.data, client.data])


  return <>
    <h1>Fee Currency Demo</h1>
    <div>
      <h2>Send Transaction</h2>
      <button onClick={payWithStableToken}>Send</button>
      <button onClick={sendViaRPC}>Send MM</button>
      <SyntaxHighlighter language="typescript">{payWithStableTokenCode}</SyntaxHighlighter>
      <h3>Transaction Hash</h3>
      <SyntaxHighlighter language="typescript">{sendTransactionHash}</SyntaxHighlighter>
    </div>
    {/* <div>
      <h2>ContractWrite</h2>
      <SyntaxHighlighter language="typescript">{code}</SyntaxHighlighter>
      <button></button>
      <h3>Transaction Hash</h3>
      <SyntaxHighlighter language="typescript">{code}</SyntaxHighlighter>
    </div> */}
  </>
}

export default FeeCurrency