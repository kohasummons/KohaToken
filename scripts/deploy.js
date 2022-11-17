const hre = require("hardhat");

async function main() {
  const totalSupply = hre.ethers.utils.parseEther("1000");

  const Koha = await ethers.getContractFactory("Koha");
  const koha = await Koha.deploy(totalSupply);

  await koha.deployed();

  console.log(
    `Koha ERC20Token with total supply ${totalSupply} deployed to ${koha.address} on Mumbai`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
