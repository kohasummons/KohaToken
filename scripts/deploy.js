const hre = require("hardhat");

async function main() {
  const totalSupply = hre.ethers.utils.parseEther("1000");
  const tokenPrice = 1_000_00_00;
  const tokenSaleInitialBalance = hre.ethers.utils.parseEther("600");
  const [owner] = await ethers.getSigners();

  const Koha = await ethers.getContractFactory("Koha");
  const koha = await Koha.deploy(totalSupply);
  await koha.deployed();
  
  const KohaTokenSale = await ethers.getContractFactory("KohaTokenSale");
  const kohaTokenSale = await KohaTokenSale.deploy(koha.address, tokenPrice);
  await kohaTokenSale.deployed();

  // Fund tokensale
  const txn = await koha.transfer(kohaTokenSale.address, tokenSaleInitialBalance, {
    from: owner.address,
  });
  await txn.wait();

  console.log(
    `Koha ERC20Token deployed to ${koha.address} on Mumbai`
  );
  console.log('');
  console.log(
    `KohaTokenSale - ${kohaTokenSale.address}`
  );

  console.log(await koha.totalSupply());
  console.log(await koha.balanceOf(kohaTokenSale.address));
  console.log(await koha.balanceOf(owner.address));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
