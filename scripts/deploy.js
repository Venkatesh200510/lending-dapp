const hre = require("hardhat");

async function main() {
  const Lending = await hre.ethers.getContractFactory("Lending");
  const lending = await Lending.deploy();

  await lending.deployed();

  console.log("Contract deployed to:", lending.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});