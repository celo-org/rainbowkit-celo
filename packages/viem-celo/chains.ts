import { celo as celo_, celoAlfajores  as celoAlfajores_, celoCannoli as celoCannoli_ } from "viem/chains";
import { defineChain } from "viem";
import { serializeTransaction } from "./serializeTransaction";

export const celo = defineChain({...celo_, serializers: {transaction:serializeTransaction}})

export const celoAlfajores = defineChain({...celoAlfajores_, serializers: {transaction:serializeTransaction}})

export const celoCannoli = defineChain({...celoCannoli_, serializers: {transaction:serializeTransaction}})