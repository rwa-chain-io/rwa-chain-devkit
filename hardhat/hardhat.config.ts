import { configVariable, defineConfig } from "hardhat/config";
import hardhatViem from "@nomicfoundation/hardhat-viem";
import hardhatVerify from "@nomicfoundation/hardhat-verify";

export default defineConfig({
  plugins: [hardhatViem, hardhatVerify],
  // RWA Chain runs every OP Stack fork through Isthmus from genesis. Set the
  // EVM version on both profiles: "production" (used by deploy and verify)
  // does not inherit settings from "default".
  solidity: {
    profiles: {
      default: { version: "0.8.28", settings: { evmVersion: "prague" } },
      production: {
        version: "0.8.28",
        settings: { evmVersion: "prague", optimizer: { enabled: true, runs: 200 } },
      },
    },
  },
  networks: {
    rwa: {
      type: "http",
      chainType: "op",
      url: "https://rpc.rwa-chain.io",
      accounts: [configVariable("PRIVATE_KEY")],
    },
    rwaTestnet: {
      type: "http",
      chainType: "op",
      url: "https://sepolia-rpc.rwa-chain.io",
      accounts: [configVariable("PRIVATE_KEY")],
    },
  },
  // Hardhat does not know these chains; this tells hardhat-verify where their
  // Blockscout lives. Blockscout needs no API key.
  chainDescriptors: {
    7741: {
      name: "RWA Chain",
      chainType: "op",
      blockExplorers: {
        blockscout: {
          url: "https://explorer.rwa-chain.io",
          apiUrl: "https://explorer.rwa-chain.io/api",
        },
      },
    },
    77410: {
      name: "RWA Chain Sepolia",
      chainType: "op",
      blockExplorers: {
        blockscout: {
          url: "https://sepolia-explorer.rwa-chain.io",
          apiUrl: "https://sepolia-explorer.rwa-chain.io/api",
        },
      },
    },
  },
  verify: { etherscan: { enabled: false } },
});
