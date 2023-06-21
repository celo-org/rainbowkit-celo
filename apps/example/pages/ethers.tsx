import type { NextPage } from "next"
import { useCallback, useEffect, useState } from "react"
import Head from "next/head"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useEthersSigner, useEthersProvider } from '../utils/use-ethers'
import styles from "../styles/Home.module.css"
import { utils } from "ethers"

const Ethers: NextPage = () => {
  const [balance, setBalance] = useState<string | null>(null)
  const signer = useEthersSigner()
  const provider = useEthersProvider()

  const sign = useCallback(async () => {
    if (!signer) return
    const message = "Hello World"
    signer.signMessage(message)
  }, [signer])
  const getBalance = useCallback(async () => {
    if (!provider) return
    const bigBalance = await provider.getBalance('0xf194afdf50b03e69bd7d057c1aa9e10c9954e4c9')
  console.log(bigBalance)
    setBalance(utils.formatEther(bigBalance))
  }, [provider])
  return (
    <>
      <Head>
        <title>Celo Config for RainbowKit</title>
        <meta name="description" content="RainbowKit with Celo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h2 className={styles.title}>Celo 🌈 RainbowKit</h2>
        <ConnectButton />
        {signer && <button onClick={sign}>Test Ethers Signer</button>}
        {provider && <button onClick={getBalance}>Test Ethers Provider</button>}
        {balance && <p>{balance}</p>}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/celo-org/rainbowkit-celo"
          target="_blank"
          rel="noopener noreferrer"
          title="Code"
        >
          💾
        </a>
      </footer>
    </>
  )
}

export default Ethers
