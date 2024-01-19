import { NextPage } from "next"
import Head from "next/head"
import { useCallback, useState } from "react"
import { useMemo } from "react"
import { celoAlfajores } from 'viem/chains'
import { useContractRead, useWalletClient, usePublicClient, useChainId } from 'wagmi'
import {privateKeyToAccount } from 'viem/accounts'
import { Hex, SendTransactionParameters,  createWalletClient, http } from 'viem'
import SyntaxHighlighter from "react-syntax-highlighter";
import {registryABI} from "@celo/abis"
import styles from "../styles/FeeCurrency.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit"

const useRegistry = (name: string, chainId?: number) =>  useContractRead({
  abi: registryABI,
  chainId,
  address: '0x000000000000000000000000000000000000ce10',
  functionName: 'getAddressForString',
  args: [name]
})

function useTransactionState() {
  const [sendTransactionHash, setSendTransactionHash] = useState('')
  const [started, setStarted] = useState(false)
  return {sendTransactionHash, setSendTransactionHash, started, setStarted}
}

const FeeCurrency: NextPage = () => {

  return <>
    <Head>
      <title>Using Fee Currency with Viem</title>
      <meta name="description" content="RainbowKit with Celo" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <div className={styles.main}>
      <h1>Celo Fee Currency With Viem</h1>
      <WithLocalWallet/>
      <OverTheWire/>
    </div>
  </>
}

export default FeeCurrency;

const WithLocalWallet = () => {

  const {sendTransactionHash, setSendTransactionHash, started, setStarted} = useTransactionState()

  const cUSDAddress = useRegistry('StableToken', celoAlfajores.id)

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
    const hash = await localAccountClient.sendTransaction(tx as SendTransactionParameters<typeof celoAlfajores>)
    setSendTransactionHash(hash);

  }, [localAccountClient, setStarted, setSendTransactionHash])

  const payWithStableToken = useCallback(() => {
      return sendTransaction({
        feeCurrency: cUSDAddress.data,
        value: BigInt(100000000),
        to: '0x22579CA45eE22E2E16dDF72D955D6cf4c767B0eF',
      })
  }, [sendTransaction, cUSDAddress.data])


  return (
    <section className={styles.section}>
      <h2>Signing With Viem WalletClient</h2>
      <p>With Viem&apos;s built in Celo transaction serializer and Celo block/transaction
        formatters it is easy to build a wallet that supports Celo&apos;s ability to pay
        gas fees with various erc20 tokens. Simply, <strong>import a Celo chain from `viem/chain``
        and pass it to Viem&apos;s `createWalletClient`.</strong> Once the client is created you
        can <strong>add the feeCurrency field to your transaction</strong> with the address of
        the token you want to use for gas.
      </p>
      <h3>Example and Demo</h3>


      <SyntaxHighlighter language="typescript">
  {
  `
  import { celo } from 'viem/chains'
  import { createWalletClient, privateKeyToAccount, type SendTransactionParameters, http } from 'viem'

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
    <>
    <h4>Transaction Info</h4>
    {started && !sendTransactionHash && <p>Transaction Sending</p>}
    {sendTransactionHash && <a href={`https://alfajores.celoscan.io/tx/${sendTransactionHash}`}>View on CeloCan</a>}
    </>
  </section>
  )
}

function OverTheWire() {
    const {sendTransactionHash, setSendTransactionHash, started, setStarted} = useTransactionState()

    const cUSDAddress = useRegistry('StableToken')

    const client = useWalletClient()
    const publicClient = usePublicClient()

    const sendToRemoteWallet = useCallback(async() => {
      setStarted(true)

      const tx: SendTransactionParameters<typeof celoAlfajores> = {
        account: client.data?.account!,
        feeCurrency: cUSDAddress.data,
        maxFeePerGas: BigInt(700000),
        maxPriorityFeePerGas: BigInt(700000),
        value: BigInt(100000000000000000),
        to: '0x22579CA45eE22E2E16dDF72D955D6cf4c767B0eF',
      }
      try {
        const gas = await publicClient.estimateGas(tx)
        const hash = await client.data?.sendTransaction({...tx, gas})
        console.log("tx",hash)
        setSendTransactionHash(hash!)
        if (!hash) return
        const receipt = await publicClient.waitForTransactionReceipt({hash})
        console.log("receipt", receipt)
      } catch (e) {
        setStarted(false)
        console.error(e)
      }
    }, [publicClient, cUSDAddress.data, client.data, setSendTransactionHash, setStarted])


    const code = `
    import { useWalletClient, usePublicClient } from 'wagmi'
    import { type SendTransactionParameters } from 'viem'

    const client = useWalletClient({chainId:celoAlfajores.id})
    const publicClient = usePublicClient()

    const tx: SendTransactionParameters<typeof celoAlfajores> = {
        account: client.data?.account!,
        feeCurrency: cUSDAddress.data,
        maxFeePerGas: BigInt(700000),
        maxPriorityFeePerGas: BigInt(700000),
        value: BigInt(100000000000000000),
        to: '0x22579CA45eE22E2E16dDF72D955D6cf4c767B0eF',
      }

      const gas = await publicClient.estimateGas(tx)
      const hash = await client.data?.sendTransaction({...tx, gas})
      const receipt = await publicClient.waitForTransactionReceipt({hash})
    `



  return <section className={styles.section}>
      <h2>Signing With WalletConnect Wallet</h2>
      <ConnectButton />
      <p>If you have a wallet that supports serializing feeCurrency you can use viem to send the transaction to that wallet for signing.</p>
      <h3>Example and Demo</h3>
      <SyntaxHighlighter language="typescript">
        {code}
      </SyntaxHighlighter>
      <button onClick={sendToRemoteWallet}>Send Transaction to Remote Wallet</button>
      <TXDetails started={started} txHash={sendTransactionHash}/>
  </section>
}



function TXDetails({started, txHash}:{txHash:string, started: boolean}) {
  const chainID = useChainId()
  return <>
    <h4>Transaction Info</h4>
    {started && !txHash && <p>Transaction Sending</p>}
    {txHash && <a href={`https://${chainID === celoAlfajores.id ? "alfajores." : ""}celoscan.io/tx/${txHash}`}>View on CeloCan</a>}
  </>
}


