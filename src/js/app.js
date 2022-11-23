import { ethers } from "ethers";

// Dom elemenst
const buyBtn = getById("buyToken");
const connectWalletBtn = getById("connectWallet");
const addKohaToWalletBtn = getById("addKohaBtn");
const addPolygonBtn = getById("addPolygonBtn");
const getMaticBtn = getById("getMaticBtn");

const state = {
  ethereum: null,
  hasMetamask: false,
  contract: null,
  provider: null,
  tokenPrice: 10000000,
  tokenSold: 0,
  contracts: {
    kohaTokenSale: {
      address: "0x7e17696dFB87903e9bf1d7dfD6c067490b2c26aB",
      abi: kohaTokenSaleAbi,
      contract: null,
      balance: 0,
    },
    kohaToken: {
      address: "0xbdDBECBAaF13d4111b69b3a5d305d060F87ef88B",
      abi: kohaTokenAbi,
      contract: null,
    },
  },
  loading: true,
  user: {
    address: null,
    balance: 0,
  },
};

buyBtn.onclick = (e) => {
  e.preventDefault();
  try {
    const amountRequested = Number(getById("amountOfToken").value);
    if (amountRequested == 0) return;

    console.log(`Buy: ${amountRequested} KOHA`);
    buyTokens(amountRequested);
  } catch (error) {
    console.log(error);
  }
};

connectWalletBtn.onclick = (e) => {
  e.preventDefault();
  try {
    connectWallet();
  } catch (error) {
    console.log(error);
  }
};

addKohaToWalletBtn.onclick = async () => {
  try {
    const wasAdded = await ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: state.contracts.kohaToken.address,
          symbol: "KOHA",
          decimals: 18,
        },
      },
    });

    if (wasAdded) console.log("Koha Token Added to Wallet");
  } catch (error) {
    console.error(error);
  }
};

addPolygonBtn.onclick = async () => {
  const params = {
    chainId: "0x13881",
    chainName: "Polygon Mumbai",
    rpcUrls: ["https://polygon-mumbai.g.alchemy.com/v2/i0JIYxK_EGtBX5aGG1apX4KuoH7j_7dq"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com"],
    nativeCurrency: {
      symbol: "MATIC",
      decimals: 18,
    },
  };

  try {
    await state.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x13881" }],
    });
    console.log("Switched Successfully!");
  } catch (error) {
    await state.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [params],
    });
    console.log("Switched Successfully!");
  }
};

getMaticBtn.onclick = () => {
  window.open("https://matic.supply","_blank");
};

const initWeb3 = async () => {
  try {
    if (window.ethereum) {
      state.ethereum = window.ethereum;
      state.hasMetamask = true;
      state.provider = new ethers.providers.Web3Provider(state.ethereum);

      await initContracts();

      state.tokenSold =
        await state.contracts.kohaTokenSale.contract.tokenSold();
      getById("amountSold").innerText = state.tokenSold.toString();
    }
  } catch (error) {
    console.error(error);
  }
};

const initContracts = async () => {
  const KohaTokenSale = new ethers.Contract(
    state.contracts.kohaTokenSale?.address,
    state.contracts.kohaTokenSale?.abi,
    state.provider
  );

  const KohaToken = new ethers.Contract(
    state.contracts.kohaToken?.address,
    state.contracts.kohaToken?.abi,
    state.provider
  );

  KohaTokenSale.on("KohaTokenSale_Sell", async (who, amount, event) => {
    state.user.balance = await getTokenBalanceOf(state.user.address);
    getById("userBalance").innerText = state.user.balance;

    state.tokenSold = await state.contracts.kohaTokenSale.contract.tokenSold();
    getById("amountSold").innerText = state.tokenSold.toString();

    getById("spinner").classList.remove("show");
  });

  state.contracts.kohaTokenSale.contract = KohaTokenSale;
  state.contracts.kohaToken.contract = KohaToken;
};

const connectWallet = async () => {
  const accounts = await state.ethereum.request({
    method: "eth_requestAccounts",
  });

  state.user.address = accounts[0];

  state.user.balance = await getTokenBalanceOf(state.user.address);

  getById("userBalance").innerText = ethers.utils.formatEther(
    state.user.balance
  );

  setTimeout(() => {
    connectWalletBtn.innerHTML = clipAddress(state.user.address);
    connectWalletBtn.setAttribute("disabled", "true");
  }, 2000);
};

async function getTokenBalanceOf(address) {
  const { contract } = state.contracts.kohaToken;

  const balance = await contract.balanceOf(address);
  // return ethers.utils.formatEther(balance);

  return balance;
}

async function buyTokens(amount) {
  getById("spinner").classList.add("show");
  buyBtn.setAttribute("disabled", "true");
  const { contract } = state.contracts.kohaTokenSale;
  const signer = state.provider.getSigner();

  const contractWithSigner = contract.connect(signer);
  const { user, tokenPrice } = state;

  const amountInWei = amount * tokenPrice;

  try {
    const txn = await contractWithSigner.buyTokens(
      ethers.utils.formatUnits(amount, "wei"),
      {
        from: user?.address,
        value: amountInWei,
      }
    );

    await txn.wait();

    buyBtn.removeAttribute("disabled");
  } catch (error) {
    console.log(error);
  }
}

initWeb3();
