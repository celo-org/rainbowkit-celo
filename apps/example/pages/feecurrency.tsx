import { NextPage } from "next"
import { useCallback, useState } from "react"
import { useMemo } from "react"
import { celoAlfajores } from 'viem/chains'
import { useAccount, useContractRead, useWalletClient, usePublicClient } from 'wagmi'
import {privateKeyToAccount } from 'viem/accounts'
import {  Hex, SendTransactionParameters,  createWalletClient, http } from 'viem'
import SyntaxHighlighter from "react-syntax-highlighter";
import {registryABI} from "@celo/abis/types/wagmi"
import styles from "../styles/FeeCurrency.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit"

const useRegistry = (name: string) =>  useContractRead({
  abi: registryABI,
  address: '0x000000000000000000000000000000000000ce10',
  functionName: 'getAddressForString',
  args: [name]
})

function useTransactionState() {
  const [sendTransactionHash, setSendTransactionHash] = useState('')
  const [started, setStarted] = useState(false)
  return {sendTransactionHash, setSendTransactionHash, started, setStarted}
}

const WithLocalWallet = () => {

  const {sendTransactionHash, setSendTransactionHash, started, setStarted} = useTransactionState()

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

  }, [localAccountClient, setStarted, setSendTransactionHash])

  const payWithStableToken = useCallback(() => {
      return sendTransaction({
        feeCurrency: cUSDAddress.data,
        value: BigInt(100000000),
        to: '0x22579CA45eE22E2E16dDF72D955D6cf4c767B0eF',
      })
  }, [sendTransaction, cUSDAddress.data])


  return (
    <section>
      <h2>Signing With Viem WalletClient</h2>
      <p>Using Viem it is eay to build a Wallet that supports the celo feature pay for gas with certain erc20 token. Simply import the `celo` chain from `viem/chains`. Formatters and the Transaction Serializer are included by default. Setup your viem Client with private key and when ready to send the transaction include the feeCurrency field with token address. </p>
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
    <>
    <h4>Transaction Info</h4>
    <TXDetails hash={sendTransactionHash} started={started}/>
    </>
  </section>
  )
}


const FeeCurrency: NextPage = () => {
  return <div className={styles.main}>
    <h1>Celo Fee Currency With Viem</h1>
    <WithLocalWallet/>
    <OverTheWire/>
  </div>
}

export default FeeCurrency



function OverTheWire() {
    const {sendTransactionHash, setSendTransactionHash, started, setStarted} = useTransactionState()

    const { connector } = useAccount()

    const cUSDAddress = useRegistry('StableToken')

    const client = useWalletClient({chainId:celoAlfajores.id})
    const publicClient = usePublicClient()

    const sendToRemoteWallet = useCallback(async() => {
      // @ts-ignore
      if (connector?.checkForGasSnap) {
        // @ts-ignore
        connector.checkForGasSnap()
      }

      setStarted(true)

      const tx = {
        account: client.data?.account!,
        feeCurrency: cUSDAddress.data,
        maxFeePerGas: BigInt(700000),
        maxPriorityFeePerGas: BigInt(700000),
        value: BigInt(100000000000000000),
        to: '0x22579CA45eE22E2E16dDF72D955D6cf4c767B0eF',
      } as SendTransactionParameters<typeof celoAlfajores>

      const gas = await publicClient.estimateGas(tx)
      const hash = await client.data?.sendTransaction({...tx, gas})
      console.log("tx",hash)
      setSendTransactionHash(hash!)
    }, [connector, setStarted, client.data, cUSDAddress.data, publicClient, setSendTransactionHash])


    const code = `sendTransaction({
        account: client.data.account,
        feeCurrency: cUSDAddress.data,
        maxFeePerGas: BigInt(700000),
        maxPriorityFeePerGas: BigInt(700000),
        value: BigInt(100000000000000000),
        to: '0x22579CA45eE22E2E16dDF72D955D6cf4c767B0eF',
      } as SendTransactionParameters<typeof celoAlfajores>)`



  return <section>
      <h2>Signing With a Remote Wallet</h2>
      <ConnectButton />
      <p>If You have a wallet that supports serializing feeCurrency you can use viem to send the transaction to that wallet for signing.</p>
      <h3>Example and Demo</h3>
      <SyntaxHighlighter language="typescript">
        {code}
      </SyntaxHighlighter>
      <button onClick={sendToRemoteWallet}>Send Transaction to Remote Wallet</button>
      <TXDetails started={started} txHash={sendTransactionHash}/>
  </section>
}



function TXDetails({started, txHash}:{txHash:string, started: boolean}) {
  return <>
    <h4>Transaction Info</h4>
    {started && !txHash && <p>Transaction Sending</p>}
    {txHash && <a href={`https://alfajores.celoscan.io/tx/${txHash}`}>View on CeloCan</a>}
  </>
}


