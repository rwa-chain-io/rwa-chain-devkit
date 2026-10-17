# Remix on RWA Chain

Remix needs no setup beyond a wallet on the right network. Use the testnet
(77410) first; testnet ETH comes from https://testnet.rwa-chain.io/explorer/faucet.

## 1. Connect

1. Add the network to your wallet: open https://testnet.rwa-chain.io and press
   "Add testnet to wallet", or enter it by hand:

   | | Testnet | Mainnet |
   |---|---|---|
   | Chain id | 77410 | 7741 |
   | RPC | https://sepolia-rpc.rwa-chain.io | https://rpc.rwa-chain.io |
   | Currency | ETH | ETH |
   | Explorer | https://sepolia-explorer.rwa-chain.io | https://explorer.rwa-chain.io |

2. In Remix, **Deploy & run transactions** → Environment → **Injected Provider**.
   Remix shows `Custom (77410) network`. Without a browser wallet you can pick
   **Custom - External Http Provider** and enter the RPC URL instead, but then
   Remix cannot sign, so use a wallet for deployments.

## 2. Compile

**Solidity compiler** → Advanced configurations → EVM version **prague**
(RWA Chain runs every OP Stack fork through Isthmus). The samples in this repo
use solc 0.8.28. Note the compiler version, optimizer setting and runs:
verification needs the same values.

## 3. Deploy

Pick the contract, fill the constructor arguments, press **Deploy** and
confirm in the wallet. Blocks come every second.

## 4. Verify on Blockscout

Either way below works; neither needs an API key.

**From Remix.** Open the **Contract Verification** plugin, choose the chain
and the contract, tick **Blockscout** and submit. If your Remix version does
not list RWA Chain under Blockscout yet, open the plugin's Settings, select
chain 77410 (or 7741) and set the Blockscout URL to
`https://sepolia-explorer.rwa-chain.io` (or `https://explorer.rwa-chain.io`).

**On the explorer.** Open the contract address on the explorer → **Contract**
→ **Verify & publish**. Choose *Solidity (Single file)* and paste the source
(right-click the file in Remix → **Flatten** if it imports others), or choose
*Solidity (Standard JSON input)* and upload the input JSON from Remix's
compilation details. Set the same compiler version, optimizer, runs and EVM
version (`prague`) you compiled with.
