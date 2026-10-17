// Reads from RWA Chain with no key: head block, and WETH through Multicall3.
//   npm run read                  (testnet)
//   NETWORK=mainnet npm run read
//   COUNTER=0x... npm run read    also reads a deployed Counter
import { createPublicClient, erc20Abi, http, type Address } from 'viem'
import { rwaChain, rwaChainSepolia } from './chains.ts'
import { counterAbi } from './counter.ts'

const chain = process.env.NETWORK === 'mainnet' ? rwaChain : rwaChainSepolia
const client = createPublicClient({ chain, transport: http() })

const weth = '0x4200000000000000000000000000000000000006'
const [symbol, supply] = await client.multicall({
  contracts: [
    { address: weth, abi: erc20Abi, functionName: 'symbol' },
    { address: weth, abi: erc20Abi, functionName: 'totalSupply' },
  ],
  allowFailure: false,
})
console.log(`${chain.name} block ${await client.getBlockNumber()}, ${symbol} supply ${supply}`)

if (process.env.COUNTER) {
  const n = await client.readContract({ address: process.env.COUNTER as Address, abi: counterAbi, functionName: 'number' })
  console.log(`Counter ${process.env.COUNTER} number = ${n}`)
}
