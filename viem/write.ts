// Sends a transaction on the RWA Chain testnet: Counter.increment().
//   PRIVATE_KEY=0x... COUNTER=0x... npm run write
import { createPublicClient, createWalletClient, http, type Address, type Hex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { rwaChainSepolia as chain } from './chains.ts'
import { counterAbi } from './counter.ts'

const { PRIVATE_KEY, COUNTER } = process.env
if (!PRIVATE_KEY || !COUNTER) throw new Error('set PRIVATE_KEY and COUNTER')
const address = COUNTER as Address

const account = privateKeyToAccount(PRIVATE_KEY as Hex)
const wallet = createWalletClient({ account, chain, transport: http() })
const client = createPublicClient({ chain, transport: http() })

const before = await client.readContract({ address, abi: counterAbi, functionName: 'number' })
const hash = await wallet.writeContract({ address, abi: counterAbi, functionName: 'increment' })
const receipt = await client.waitForTransactionReceipt({ hash })
const after = await client.readContract({ address, abi: counterAbi, functionName: 'number', blockNumber: receipt.blockNumber })
console.log(`increment ${hash} in block ${receipt.blockNumber}: ${before} -> ${after}`)
if (receipt.status !== 'success' || after !== before + 1n) process.exit(1)
