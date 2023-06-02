import { Address, CustomSource, getTransactionType, keccak256, TransactionSerializable } from "viem"
import { serializeTransaction } from "./serializeTransaction"

// TODO ask viem team if the following types can be exported from viem
export type SignTransactionArgs<
  TTransactionSerializable extends TransactionSerializable = TransactionSerializable,
> = {
  privateKey: Hex
  transaction: TTransactionSerializable
}
export type SignTransactionReturnType<
  TTransactionSerializable extends TransactionSerializable = TransactionSerializable,
  TTransactionType extends TransactionType = GetTransactionType<TTransactionSerializable>,
> = TransactionSerialized<TTransactionType>



export async function signTransaction<
  TTransactionSerializable extends TransactionSerializable,
>({
  privateKey,
  transaction,
}: SignTransactionArgs<TTransactionSerializable>): Promise<
  SignTransactionReturnType<TTransactionSerializable>
> {
  const step1 = await serializeTransaction(transaction)

  const signature = await sign({
    hash: keccak256(step1),
    privateKey,
  })
  return serializeTransaction(transaction, signature)
}