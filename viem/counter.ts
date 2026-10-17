// ABI of the Counter sample in foundry/ and hardhat/.
export const counterAbi = [
  { type: 'function', name: 'number', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'increment', stateMutability: 'nonpayable', inputs: [], outputs: [] },
] as const
