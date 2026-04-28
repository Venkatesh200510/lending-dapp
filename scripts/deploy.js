const hre = require("hardhat");

async function main() {
  const P2PLending = await hre.ethers.getContractFactory("P2PLending");
  const lending = await P2PLending.deploy();

  await lending.waitForDeployment();

  console.log("Contract deployed to:", await lending.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});