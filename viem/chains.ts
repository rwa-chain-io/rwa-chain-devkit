// RWA Chain definitions for viem, in the shape of viem's own OP Stack chains
// (see viem/chains zora.ts). The portal, L1StandardBridge and
// DisputeGameFactory entries, keyed by the L1 chain id, are what viem's
// op-stack actions (getWithdrawalStatus, proveWithdrawal, finalizeWithdrawal)
// look up.
import { defineChain } from 'viem'
import { chainConfig } from 'viem/op-stack'

export const rwaChain = defineChain({
  ...chainConfig,
  id: 7741,
  name: 'RWA Chain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.rwa-chain.io'], webSocket: ['wss://ws.rwa-chain.io'] },
  },
  blockExplorers: {
    default: {
      name: 'RWA Chain Explorer',
      url: 'https://explorer.rwa-chain.io',
      apiUrl: 'https://explorer.rwa-chain.io/api',
    },
  },
  contracts: {
    ...chainConfig.contracts,
    disputeGameFactory: { 8453: { address: '0x99d4d6b9fabc9c3a4c5e370263b49c9cf9eb6dff' } },
    portal: { 8453: { address: '0x63832e6a88feb9fa0af1b9c67bbcef9fe6a41cae' } },
    l1StandardBridge: { 8453: { address: '0x1bf527a4298e51051fa1a8db7c18c32827fa50d2' } },
    multicall3: { address: '0xcA11bde05977b3631167028862bE2a173976CA11', blockCreated: 0 },
  },
  sourceId: 8453, // Base
})

export const rwaChainSepolia = defineChain({
  ...chainConfig,
  id: 77410,
  name: 'RWA Chain Sepolia',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://sepolia-rpc.rwa-chain.io'],
      webSocket: ['wss://sepolia-ws.rwa-chain.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'RWA Chain Sepolia Explorer',
      url: 'https://sepolia-explorer.rwa-chain.io',
      apiUrl: 'https://sepolia-explorer.rwa-chain.io/api',
    },
  },
  contracts: {
    ...chainConfig.contracts,
    disputeGameFactory: { 84532: { address: '0x6feb86b00a9e8c550770ea663a67c40851e90448' } },
    portal: { 84532: { address: '0x4c7d4bf40d7f86bdfd4ef00065571dbc2349a448' } },
    l1StandardBridge: { 84532: { address: '0xb389ae59ad2dfd21781aa2cc8a456e029f78ab54' } },
    multicall3: { address: '0xcA11bde05977b3631167028862bE2a173976CA11', blockCreated: 0 },
  },
  sourceId: 84532, // Base Sepolia
  testnet: true,
})
