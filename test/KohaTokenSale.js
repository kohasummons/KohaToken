const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Koha Token Sale", function () {
  async function deployKohaTokenSaleFixture() {
    const ONE_GWEI = 1_000_000_000;

    const lockedAmount = hre.ethers.utils.parseEther("1");
    const tokenPrice = 1_000_00_00;

    const totalSupply = ONE_GWEI * 10;
    const [owner, receiver] = await ethers.getSigners();

    // deploy koha Token
    const Koha = await ethers.getContractFactory("Koha");
    const koha = await Koha.deploy(totalSupply);

    // deploy koha token sale
    const KohaTokenSale = await ethers.getContractFactory("KohaTokenSale");
    const kohaTokenSale = await KohaTokenSale.deploy(koha.address, tokenPrice);

    return {
      koha,
      kohaTokenSale,
      lockedAmount,
      totalSupply,
      tokenPrice,
      owner,
      receiver,
    };
  };

  describe("Deployment", async () => {
    it("Sets token price", async function () {
        const { kohaTokenSale, tokenPrice } = await loadFixture(deployKohaTokenSaleFixture);
        expect(await kohaTokenSale.tokenPrice()).to.equal(tokenPrice);
    })
  });
});
