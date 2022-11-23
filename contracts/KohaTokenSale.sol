// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Koha.sol";
import "hardhat/console.sol";

contract KohaTokenSale {
    event KohaTokenSale_Sell(address _buyer, uint _amount);

    address admin;
    Koha public kohaContract;
    uint256 public tokenPrice;
    uint256 public tokenSold;

    // modifier
    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    constructor(Koha _tokenContractAddress, uint256 _tokenPrice) {
        admin = msg.sender;
        kohaContract = _tokenContractAddress;
        tokenPrice = _tokenPrice;
    }

    // Multiply
    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _amount) public payable {
        require(msg.value == multiply(_amount, tokenPrice));
        require(kohaContract.balanceOf(address(this)) >= _amount);

        // Buy tokens from kohaContract
        require(kohaContract.transfer(msg.sender, _amount));

        // increment amount of token sold
        tokenSold += _amount;

        // Trigger Sell event
        emit KohaTokenSale_Sell(msg.sender, _amount);
    }

    // End Token Sale
    function endSale() public onlyAdmin {
        require(
            kohaContract.transfer(admin, kohaContract.balanceOf(address(this)))
        );

        // selfdestruct
        selfdestruct(payable(admin));
    }

    receive() external payable {
        console.log("----- receive:", msg.value);
    }

    fallback() external payable {
        console.log("----- fallback:", msg.value);
    }
}
