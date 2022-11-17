// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Koha {
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(
        address indexed tokenOwner,
        address indexed spender,
        uint tokens
    );

    string public constant name = "Koha";
    string public constant symbol = "KOHA";
    uint8 public constant decimals = 18;
    string public standard = "KohaToken v1.0";
    uint256 public totalSupply;

    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowed;

    // constructor
    constructor(uint256 _total) {
        totalSupply = _total;
        balances[msg.sender] = totalSupply;
    }

    function balanceOf(address _tokenOwner) public view returns (uint) {
        return balances[_tokenOwner];
    }

    function transfer(address _receiver, uint _value) public returns (bool) {
        require(_value <= balances[msg.sender]);
        balances[msg.sender] -= _value;
        balances[_receiver] += _value;
        emit Transfer(msg.sender, _receiver, _value);
        return true;
    }

    function approve(address _delegate, uint _value) public returns (bool) {
        allowed[msg.sender][_delegate] = _value;
        emit Approval(msg.sender, _delegate, _value);
        return true;
    }

    function allowance(address _owner, address _delegate)
        public
        view
        returns (uint)
    {
        return allowed[_owner][_delegate];
    }

    function transferFrom(
        address _from,
        address _to,
        uint _value
    ) public returns (bool) {
        require(_value <= balances[msg.sender]);
        require(_value <= allowed[_from][msg.sender]);
        balances[msg.sender] -= _value;
        allowed[_from][msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}
