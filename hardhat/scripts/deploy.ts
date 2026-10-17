// Deploys Counter and verifies it on the network's Blockscout.
//   npx hardhat run --build-profile production scripts/deploy.ts --network rwaTestnet
import hre from "hardhat";
import { verifyContract } from "@nomicfoundation/hardhat-verify/verify";

const { viem } = await hre.network.create();
const counter = await viem.deployContract("Counter");
console.log("Counter deployed at", counter.address);

// Blockscout indexes the new contract a few seconds after the receipt;
// verifying before that fails with "does not contain a contract".
for (let attempt = 1; ; attempt++) {
  try {
    await verifyContract({ address: counter.address, provider: "blockscout" }, hre);
    break;
  } catch (e) {
    if (attempt === 6) throw e;
    console.log(`verify attempt ${attempt} failed, retrying in 10 s`);
    await new Promise((r) => setTimeout(r, 10_000));
  }
}
