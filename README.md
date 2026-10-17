# RWA Chain developer kit

Everything needed to deploy and verify contracts on RWA Chain, an OP Stack
rollup that settles on Base. Gas is ETH. Every OP Stack fork through Isthmus is
active from genesis, so compile with EVM version `prague`.

[`networks.json`](networks.json) holds every value below in one machine-readable
file, and [`scripts/check-networks.mjs`](scripts/check-networks.mjs) checks it
against the live chains.

## Networks

| | Mainnet | Testnet |
|---|---|---|
| Chain id | 7741 (`0x1e3d`) | 77410 (`0x12e62`) |
| Settles on | Base (8453) | Base Sepolia (84532) |
| RPC | https://rpc.rwa-chain.io | https://sepolia-rpc.rwa-chain.io |
| WebSocket | wss://ws.rwa-chain.io | wss://sepolia-ws.rwa-chain.io |
| Explorer (Blockscout) | https://explorer.rwa-chain.io | https://sepolia-explorer.rwa-chain.io |
| Verifier URL | https://explorer.rwa-chain.io/api/ | https://sepolia-explorer.rwa-chain.io/api/ |
| Faucet | — | https://testnet.rwa-chain.io/explorer/faucet |
| Bridge | https://rwa-chain.io/explorer/bridge | https://testnet.rwa-chain.io/explorer/bridge |

To add a network to MetaMask, use the button on https://rwa-chain.io or
https://testnet.rwa-chain.io, or enter the chain id, RPC, currency `ETH` and
explorer from the table. Blockscout verification needs no API key.

## Quickstart

Start on the testnet: get ETH from the faucet, then pick a tool. Each folder
deploys the same `Counter` contract and verifies it on Blockscout.

### Foundry ([`foundry/`](foundry))

```sh
git clone --recurse-submodules <this repo> && cd rwa-chain-devkit/foundry
forge test
forge script script/Deploy.s.sol --rpc-url rwa_testnet --private-key $PRIVATE_KEY --broadcast \
  --verify --verifier blockscout --verifier-url https://sepolia-explorer.rwa-chain.io/api/
```

A single contract without a script:

```sh
forge create src/Counter.sol:Counter --rpc-url rwa_testnet --private-key $PRIVATE_KEY --broadcast \
  --verify --verifier blockscout --verifier-url https://sepolia-explorer.rwa-chain.io/api/
```

Keep `--broadcast` (without it forge only simulates), and keep the trailing
slash on the verifier URL. If the contract takes constructor arguments, put
`--constructor-args ...` last. For mainnet use `--rpc-url rwa` and
`https://explorer.rwa-chain.io/api/`.

### Hardhat 3 ([`hardhat/`](hardhat))

```sh
cd hardhat && npm install
PRIVATE_KEY=0x... npm run deploy:testnet
```

[`hardhat.config.ts`](hardhat/hardhat.config.ts) declares both networks and a
`chainDescriptors` entry per chain that points `hardhat-verify` at our
Blockscout. To verify a contract deployed some other way:
`npx hardhat verify blockscout --network rwaTestnet <address> [constructor args]`
(with `PRIVATE_KEY` set, since the network config reads it).

### viem ([`viem/`](viem))

[`chains.ts`](viem/chains.ts) defines `rwaChain` and `rwaChainSepolia` with the
OP Stack contracts on Base, so viem's op-stack actions (deposits,
`getWithdrawalStatus`, `proveWithdrawal`, `finalizeWithdrawal`) work. Copy it
into your project until the chains ship in viem itself. wagmi takes the same
objects: `createConfig({ chains: [rwaChain], ... })`.

```sh
cd viem && npm install
npm run read                                  # no key needed
PRIVATE_KEY=0x... COUNTER=0x... npm run write # calls Counter.increment()
```

### Remix

See [`docs/remix.md`](docs/remix.md).

## Contracts already on chain

Present on both chains from genesis (checked by `scripts/check-networks.mjs`).
Do not redeploy them.

| Contract | Address |
|---|---|
| Multicall3 | `0xcA11bde05977b3631167028862bE2a173976CA11` |
| CREATE2 deployer (Arachnid) | `0x4e59b44847b379578588920cA78FbF26c0B4956C` |
| Safe singleton factory | `0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7` |
| Create2Deployer | `0x13b0D85CcB8bf860b6b79AF3029fCA081AE9beF2` |
| CreateX | `0xba5Ed099633D3B313e4D5F7bdc1305d3c28ba5Ed` |
| Permit2 | `0x000000000022D473030F116dDEE9F6B43aC78BA3` |
| ERC-4337 EntryPoint v0.7 | `0x0000000071727De22E5E9d8BAf0edAc6f37da032` |
| ERC-4337 EntryPoint v0.6 | `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789` |
| WETH9 | `0x4200000000000000000000000000000000000006` |
| Safe v1.3.0 | `0x69f4D1788e39c87893C980c06EdF4b7f686e2938` |
| SafeL2 v1.3.0 | `0xfb1bffC9d739B8D520DaF37dF666da4C687191EA` |
| MultiSend v1.3.0 | `0x998739BFdAAdde7C933B942a68053933098f9EDa` |
| MultiSendCallOnly v1.3.0 | `0xA1dabEF33b3B82c7814B6D82A79e50F4AC44102B` |
| L2StandardBridge | `0x4200000000000000000000000000000000000010` |
| L2ToL1MessagePasser | `0x4200000000000000000000000000000000000016` |

The L1 contracts (OptimismPortal, L1StandardBridge, DisputeGameFactory and
others) for both chains are in [`networks.json`](networks.json).

## Good to know

- **Withdrawals to Base take about 7 days**: a withdrawal can be proven once
  the next output proposal covers its block (proposals come every 6 hours),
  then finalized after the 3.5-day dispute window plus the 3.5-day finality
  delay. Deposits arrive in a few minutes.
- `debug_*` and `trace_*` RPC methods are not served by the public endpoints.
- Fault proofs are permissioned (game type 1, PermissionedDisputeGame).

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every pull
request: `forge fmt --check`, `forge build`, `forge test`, the Hardhat build,
the viem typecheck and the networks check. Every Monday (and on manual
dispatch) it also deploys `Counter` to the testnet with Foundry and Hardhat,
verifies both on Blockscout and calls it with viem. That job needs a
`DEPLOYER_KEY` repository secret: a throwaway key funded from the testnet
faucet. Mainnet never runs in CI.

## License

[MIT](LICENSE)
