import { serializeTransaction as viemSerializeTransaction, Hex, Signature, TransactionSerializableBase, AccessList, FeeValuesEIP1559, InvalidChainIdError, isAddress, BaseError, FeeCapTooHighError, InvalidAddressError, TipAboveFeeCapError, toHex, toRlp, trim, concatHex, TransactionSerializable, Address } from "viem"

export type TransactionSerializableCIP42<
  TQuantity = bigint,
  TIndex = number,
> = TransactionSerializableBase<TQuantity, TIndex> &
  Partial<FeeValuesEIP1559<TQuantity>> & {
    accessList?: AccessList
    chainId: number
    type?: 'cip42'
    feeCurrency?: Address
    gatewayFeeRecipient?: Address,
    gatewayFee?: TQuantity,
    yParity?: number
  }

  type SerializedCIP42TransactionReturnType = `0x7c${string}`

export function serializeTransaction(tx: TransactionSerializable & TransactionSerializableCIP42, signature?: Signature): Promise<SerializedCIP42TransactionReturnType> {
  // handle celo's feeCurrency Transactions
  if (couldBeCIP42(tx)) {
    return serializeCIP42Transaction(tx, signature)
  }
  // handle rest of tx types
  return viemSerializeTransaction(tx, signature)
}

// There shall be a typed transaction with the code 0x7c that has the following format:
// 0x7c || rlp([chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, feecurrency, gatewayFeeRecipient, gatewayfee, destination, amount, data, access_list, signature_y_parity, signature_r, signature_s]).
// This will be in addition to the type 0x02 transaction as specified in EIP-1559.
async function serializeCIP42Transaction(transaction: TransactionSerializableCIP42, signature?: Signature): Promise<SerializedCIP42TransactionReturnType>  {
  assertTransactionCIP42(transaction)
  const {
    chainId,
    gas,
    nonce,
    to,
    value,
    maxFeePerGas,
    maxPriorityFeePerGas,
    accessList,
    feeCurrency,
    gatewayFeeRecipient,
    gatewayFee,
    data,
  } = transaction


  const serializedTransaction = [
    toHex(chainId),
    nonce ? toHex(nonce) : '0x',
    maxPriorityFeePerGas ? toHex(maxPriorityFeePerGas) : '0x',
    maxFeePerGas ? toHex(maxFeePerGas) : '0x',
    gas ? toHex(gas) : '0x',
    feeCurrency ?? '0x',
    gatewayFeeRecipient ?? '0x',
    gatewayFee ? toHex(gatewayFee) : '0x',
    to ?? '0x',
    value ? toHex(value) : '0x',
    data ?? '0x',
    serializeAccessList(accessList),
  ]

  if (signature) {
    serializedTransaction.push(
      signature.v === 27n ? '0x' : toHex(1), // yParity
      trim(signature.r),
      trim(signature.s),
    )
  }

  return concatHex([
    '0x7c',
    toRlp(serializedTransaction),
  ]) as SerializedCIP42TransactionReturnType
}

// process as CIP42 if any of these fields are present realistically gatewayfee is not used but is part of spec
function couldBeCIP42(tx: TransactionSerializable & TransactionSerializableCIP42) {
  if (tx.type === 'cip42' || tx.feeCurrency || tx.gatewayFee || tx.gatewayFeeRecipient) {
    return true
  }
  return false
}

function assertTransactionCIP42(
  transaction: TransactionSerializableCIP42,
) {
  const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to, feeCurrency, gatewayFee, gatewayFeeRecipient } =
    transaction
  // TODO  should this throw for any chain id not one of celo's chains or is that to restrictive?
  if (chainId <= 0) throw new InvalidChainIdError({ chainId })
  if (to && !isAddress(to)) throw new InvalidAddressError({ address: to })
  if (gasPrice)
    throw new BaseError(
      '`gasPrice` is not a valid CIP-42 Transaction attribute.',
    )
  if (maxFeePerGas && maxFeePerGas > 2n ** 256n - 1n)
    throw new FeeCapTooHighError({ maxFeePerGas })
  if (
    maxPriorityFeePerGas &&
    maxFeePerGas &&
    maxPriorityFeePerGas > maxFeePerGas
  )
    throw new TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas })

  if ((gatewayFee && !gatewayFeeRecipient) || (gatewayFeeRecipient && !gatewayFee)) {
    throw new BaseError('`gatewayFee` and `gatewayFeeRecipient` must be provided together.')
  }

  if (!feeCurrency) {
    throw new BaseError('`feeCurrency` is required for CIP-42 transactions.')
  }
}




// TODO ask viem team if these can be exported / copied from https://github.com/wagmi-dev/viem/blob/840d3d7411a33ad02c71bd180b53244df91cd779/src/utils/transaction/serializeTransaction.ts
type RecursiveArray<T> = T | RecursiveArray<T>[]
class InvalidStorageKeySizeError extends BaseError {
  override name = 'InvalidStorageKeySizeError'

  constructor({ storageKey }: { storageKey: Hex }) {
    super(
      `Size for storage key "${storageKey}" is invalid. Expected 32 bytes. Got ${Math.floor(
        (storageKey.length - 2) / 2,
      )} bytes.`,
    )
  }
}
function serializeAccessList(accessList?: AccessList): RecursiveArray<Hex> {
  if (!accessList || accessList.length === 0) return []

  const serializedAccessList: RecursiveArray<Hex> = []
  for (let i = 0; i < accessList.length; i++) {
    const { address, storageKeys } = accessList[i]

    for (let j = 0; j < storageKeys.length; j++) {
      if (storageKeys[j].length - 2 !== 64) {
        throw new InvalidStorageKeySizeError({ storageKey: storageKeys[j] })
      }
    }

    if (!isAddress(address)) {
      throw new InvalidAddressError({ address })
    }

    serializedAccessList.push([address, storageKeys])
  }
  return serializedAccessList
}