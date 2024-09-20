
# Migrating away from rainbowkit-celo

## sunset

This Project is sunset.

Since viem + wagmi + rainbowkit now have first class support for celo we recommend just importing directly from rainbowkit and wagmi.

## chains

```
- import { Alfajores, Celo } from "@celo/rainbowkit-celo/chains"
+ import {celo, celoAlfajores} from "wagmi/chains"

```

## wallets

* Othello (formerly celo wallet) has dropped support for wallet connect
* Celo Terminal --> use the default Wallet Connect Connector
* Valora --> `import { valoraWallet } from '@rainbow-me/rainbowkit/wallets';`

## further reading

see celo docs for a pretty decent [rainbkowkit setup](https://docs.celo.org/developer/rainbowkit-celo)