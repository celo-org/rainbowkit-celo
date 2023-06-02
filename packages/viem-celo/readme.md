
# Viem Celo Expansion Pack

The @celo/viem-celo expansion pack provides functions that bring celo specific features to Viem.

While **Viem supports celo out of the box**, including the formatting of celo's CIP42 transactions. Signing CIP42 requires using a custom serializer. You will only need this if you are building a wallet / have access to privatekey/mneumonic.

## Account

In Viem a [Local Account](/linktiviemdocs) is one where the privatekey/mneumonic is locally available for signing. If you are building a wallet and want to sign transactions with alternative gas fee currencies you can import the `createCeloAccount` function and pass the result to you viem config like so.

```ts
import { createWalletClient, http } from 'viem'
import { createCeloAccount } from "@celo/viem-pack"
// the celo chain for viem contains custom formatters for celo transactions and blocks.
import { celo } from "viem/chains"

const account = createCeloAccount(privateKey)

const client = createWalletClient({
  account,
  chain: celo,
  transport: http()
})

```
