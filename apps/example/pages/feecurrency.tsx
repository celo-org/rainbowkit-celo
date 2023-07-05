import { NextPage } from "next"
import { useCallback, useState } from "react"
import { useMemo } from "react"
import { celoAlfajores } from 'viem/chains'
import { useContractRead, useWalletClient } from 'wagmi'
import {privateKeyToAccount } from 'viem/accounts'
import { Hex, SendTransactionParameters, WriteContractParameters,  createWalletClient,  defineChain, http } from 'viem'
import SyntaxHighlighter from "react-syntax-highlighter";
import {stableTokenABI, registryABI} from "@celo/abis/types/wagmi"
import styles from "../styles/FeeCurrency.module.css";

const useRegistry = (name: string) =>  useContractRead({
  abi: registryABI,
  address: '0x000000000000000000000000000000000000ce10',
  functionName: 'getAddressForString',
  args: [name]
})

const FeeCurrency: NextPage = () => {

  const [sendTransactionHash, setSendTransactionHash] = useState('')
  const [started, setStarted] = useState(false)

  const cUSDAddress = useRegistry('StableToken')

  const pk = process.env.NEXT_PUBLIC_PK

  const account = useMemo(() => pk && privateKeyToAccount(pk as Hex), [pk])

  const localAccountClient = useMemo(() => {
    if (!account) return undefined
    return createWalletClient({
      account,
      chain: celoAlfajores,
      transport: http()
    })
  },[account])


  const sendTransaction = useCallback(async (tx: Omit<SendTransactionParameters<typeof celoAlfajores>, 'account'>) => {
    if (!localAccountClient) return
    setStarted(true)
    // @ts-expect-error bigint | undefined not assignable to bigint
    const hash = await localAccountClient.sendTransaction(tx)
    setSendTransactionHash(hash);

  }, [localAccountClient])

  const payWithStableToken = useCallback(() => {
      return sendTransaction({
        feeCurrency: cUSDAddress.data,
        value: BigInt(100000000),
        to: '0x22579CA45eE22E2E16dDF72D955D6cf4c767B0eF',
      })
  }, [sendTransaction, cUSDAddress.data])


  return <div className={styles.main}>
    <h1>Viem Fee Currency Demo</h1>
    <div>
      <h2>Signing With Viem WalletClient</h2>
      <p>Using Viem it is eay to build a Wallet that supports Celo's pay for gas with certain erc20 tokens feature. Simply import the `celo` chain from `viem/chains`. Formatters and the Transaction Serializer are included by default. Setup your viem Client with private key and when ready to send the transaction include the feeCurrency field with token address. </p>
      <h3>Example and Demo</h3>

      <SyntaxHighlighter language="typescript">
  {
  `
  import { celo } from 'viem/chains'
  import { createWalletClient, privateKeyToAccount } from 'viem'

  const account = privateKeyToAccount(PRIVATE_KEY)

  // ALFAJORES ADDRESS: Celo Mainnet can be fetched from the registry
  const cUSDAddress = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1'

  const localAccountClient = createWalletClient({
    account,
    chain: celo,
  })

  const sendTransaction = (tx: SendTransactionParameters<typeof celo>) => {
    return localAccountClient.sendTransaction(tx)
  }

  const hash = await sendTransaction({
    feeCurrency: cUSDAddress,
    value: BigInt(100000000),
    to: '0x22579CA45eE22E2E16dDF72D955D6cf4c767B0eF',
  })
  `
  }
      </SyntaxHighlighter>
      <button onClick={payWithStableToken}>Sign Send Transaction with Local Wallet</button>
      <h4>Transaction Info</h4>
      {started && !sendTransactionHash && <p>Transaction Sending</p>}
      {sendTransactionHash && <a href={`https://alfajores.celoscan.io/tx/${sendTransactionHash}`}>View on CeloCan</a>}
    </div>
    {/* <button onClick={sendViaRPC}>Send MM</button> */}
    {/* <div>
      <h2>ContractWrite</h2>
      <SyntaxHighlighter language="typescript">{code}</SyntaxHighlighter>
      <button></button>
      <h3>Transaction Hash</h3>
      <SyntaxHighlighter language="typescript">{code}</SyntaxHighlighter>
    </div> */}
  </div>
}

export default FeeCurrency

 // const sendViaRPC = useCallback(() => {
  //   return client.data?.sendTransaction({
  //     // @ts-ignore
  //       from: client.data?.account.address,
  //       feeCurrency: CUSD_ADDRESS.data,
  //       maxFeePerGas: BigInt(700000),
  //       maxPriorityFeePerGas: BigInt(700000),
  //       value: BigInt(100000000000000000),
  //       to: '0x22579CA45eE22E2E16dDF72D955D6cf4c767B0eF',
  //     })
  // }, [CUSD_ADDRESS.data, client.data])

  // const client = useWalletClient({chainId:celoAlfajores.id})

  // const contractParams: WriteContractParameters<typeof stableTokenABI, 'transfer', typeof celoAlfajores> = {
  //   account: '0x00000',
  //   abi: stableTokenABI,
  //   address: '0x00000',
  //   functionName: 'transfer',
  //   args: ['0x00000', BigInt(0)],
  //   feeCurrency: '0x00000',
  // }

    // localAccountClient.writeContract({
  //   account: '0x00000',
  //   abi: stableTokenABI,
  //   address: '0x00000',
  //   functionName: 'transfer',
  //   args: ['0x00000', BigInt(0)],
  //   feeCurrency: '0x00000',
  // })