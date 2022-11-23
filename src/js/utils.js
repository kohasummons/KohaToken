// Dom utils
const getById = (elementId) => {
  return document.getElementById(elementId.toString());
};

// Transform utils
function clipAddress(address) {
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
}

const kohaTokenSaleAbi = [
  "constructor(address _tokenContractAddress, uint256 _tokenPrice)",
  "event KohaTokenSale_Sell(address _buyer, uint256 _amount)",
  "function buyTokens(uint256 _amount) payable",
  "function endSale()",
  "function kohaContract() view returns (address)",
  "function tokenPrice() view returns (uint256)",
  "function tokenSold() view returns (uint256)",
];

const kohaTokenAbi = [
  "constructor(uint256 _total)",
  "event Approval(address indexed tokenOwner, address indexed spender, uint256 tokens)",
  "event Transfer(address indexed from, address indexed to, uint256 tokens)",
  "function allowance(address _owner, address _delegate) view returns (uint256)",
  "function allowed(address, address) view returns (uint256)",
  "function approve(address _delegate, uint256 _value) returns (bool)",
  "function balanceOf(address _tokenOwner) view returns (uint256)",
  "function balances(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function name() view returns (string)",
  "function standard() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function transfer(address _receiver, uint256 _value) returns (bool)",
  "function transferFrom(address _from, address _to, uint256 _value) returns (bool)",
];
