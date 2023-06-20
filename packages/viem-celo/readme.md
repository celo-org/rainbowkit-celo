
# Viem Celo Expansion Pack

The @celo/viem-celo expansion pack provides functions that bring celo specific features to Viem.

While **Viem supports celo out of the box**, including the formatting of celo's CIP42 transactions. Signing CIP42 requires using a custom serializer. You will only need this if you are building a wallet / have access to privatekey/mneumonic.

## Account

```ts
import { createWalletClient, http } from 'viem'
// import chain from the celo viem pack so that serializer is included
import { celo } from "@celo/viem-pack"

const account = privateKeyToAccount(privateKey)

const client = createWalletClient({
  account,
  chain: celo,
  transport: http()
})

// because you passed celo chain to the client send Transaction now accepts feeCurrency as a property
client.sendTransaction({
  to: '0x...'
  ....typicalTXProperties,
  feeCurrency: CUSD_ADDRESS
})

```

## Sending Transactions with feeCurrency in a dapp


```ts

  client.request({
    to: '0x...'
    ....typicalTXProperties,
    feeCurrency: CUSD_ADDRESS
  })
```


## Using the useFeeCurrency hook

```

