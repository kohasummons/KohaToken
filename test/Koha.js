const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Koha", function () {
  // Fixture
  async function deployKohaERC20TokenFixture() {
    const ONE_GWEI = 1_000_000_000;

  const lockedAmount = hre.ethers.utils.parseEther("1");


    const name = "Koha";
    const symbol = "KOHA";
    const decimals = 18;
    const standard = "KohaToken v1.0";

    const totalSupply = ONE_GWEI * 10;
    const [owner, receiver] = await ethers.getSigners();

    const Koha = await ethers.getContractFactory("Koha");
    const koha = await Koha.deploy(totalSupply);

    return {
      koha,
      name,
      symbol,
      decimals,
      standard,
      totalSupply,
      owner,
      receiver,
    };
  }

  // Deployment
  describe("Deployment", function () {
    it("Should set the right total supply", async () => {
      const { koha, totalSupply } = await loadFixture(
        deployKohaERC20TokenFixture
      );

      expect(await koha.totalSupply()).to.equal(totalSupply);
    });

    it("Should set the right symbol", async () => {
      const { koha, symbol } = await loadFixture(deployKohaERC20TokenFixture);

      expect(await koha.symbol()).to.equal(symbol);
    });

    it("Should set the right name", async () => {
      const { koha, name } = await loadFixture(deployKohaERC20TokenFixture);

      expect(await koha.name()).to.equal(name);
    });

    it("Should set the right decimals", async () => {
      const { koha, decimals } = await loadFixture(deployKohaERC20TokenFixture);

      expect(await koha.decimals()).to.equal(decimals);
    });

    it("Should set the right standard", async () => {
      const { koha, standard } = await loadFixture(deployKohaERC20TokenFixture);

      expect(await koha.standard()).to.equal(standard);
    });

    it("Should allocate total supply to owner", async () => {
      const { koha, owner, totalSupply } = await loadFixture(
        deployKohaERC20TokenFixture
      );

      expect(await koha.balanceOf(owner.address)).to.equal(totalSupply);
    });
  });

  // Transfer
  describe("Transfer", function () {
    it("Should transfer funds to reciever", async () => {
      const { koha, owner, receiver } = await loadFixture(
        deployKohaERC20TokenFixture
      );
      const tokenAmount = 100000;

      const txn = await koha.transfer(receiver.address, tokenAmount, {
        from: owner.address,
      });

      await txn.wait();

      expect(await koha.balanceOf(receiver.address)).to.equal(tokenAmount);
    });

    it("Should deduct transferred funds from sender", async () => {
      const { koha, totalSupply, owner, receiver } = await loadFixture(
        deployKohaERC20TokenFixture
      );
      const tokenAmount = 100000;

      const txn = await koha.transfer(receiver.address, tokenAmount, {
        from: owner.address,
      });

      await txn.wait();

      expect(await koha.balanceOf(owner.address)).to.equal(
        totalSupply - tokenAmount
      );
    });

    it("Should trigger the 'Transfer' event", async () => {
      const { koha, owner, receiver } = await loadFixture(
        deployKohaERC20TokenFixture
      );
      const tokenAmount = 100000;

      const txn = await koha.transfer(receiver.address, tokenAmount, {
        from: owner.address,
      });

      const receipt = await txn.wait();

      expect(receipt.events[0].event).to.equal("Transfer");
    });

    it("Event should log the account initiating the transfer", async () => {
      const { koha, owner, receiver } = await loadFixture(
        deployKohaERC20TokenFixture
      );
      const tokenAmount = 100000;

      const txn = await koha.transfer(receiver.address, tokenAmount, {
        from: owner.address,
      });

      const receipt = await txn.wait();

      expect(receipt.events[0].args["from"]).to.equal(owner.address);
    });

    it("Event should log the account receiving the transfer", async () => {
      const { koha, owner, receiver } = await loadFixture(
        deployKohaERC20TokenFixture
      );
      const tokenAmount = 100000;

      const txn = await koha.transfer(receiver.address, tokenAmount, {
        from: owner.address,
      });

      const receipt = await txn.wait();

      expect(receipt.events[0].args["to"]).to.equal(receiver.address);
    });

    it("Event should log the amount transferred", async () => {
      const { koha, owner, receiver } = await loadFixture(
        deployKohaERC20TokenFixture
      );
      const tokenAmount = 100000;

      const txn = await koha.transfer(receiver.address, tokenAmount, {
        from: owner.address,
      });

      const receipt = await txn.wait();

      expect(receipt.events[0].args["tokens"]).to.equal(tokenAmount);
    });
  });

  // Approval
  describe("Approval", function () {
    it("Should emit an event on Approval", async () => {
      const { koha, owner, receiver } = await loadFixture(
        deployKohaERC20TokenFixture
      );

      await expect(koha.approve(receiver.address, 2000))
        .to.emit(koha, "Approval")
        .withArgs(owner.address, receiver.address, 2000);
    });

    it("Should delegate funds to reciever", async()=> {
      const { koha, owner, receiver } = await loadFixture(
        deployKohaERC20TokenFixture
      );

      const txn = await koha.approve(receiver.address, 2000);
      await txn.wait();

      expect(await koha.allowance(owner.address, receiver.address)).to.equal(2000);
    })
  });
});
