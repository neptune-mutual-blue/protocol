// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;

contract PoorMansERC20 {
  event Transfer(address indexed _from, address indexed _to, uint256 _value);
  event Approval(address indexed _owner, address indexed _spender, uint256 _value);

  string public name;
  string public symbol;
  uint8 public immutable decimals;
  uint256 public immutable totalSupply;

  mapping(address => uint256) public balances;
  mapping(address => mapping(address => uint256)) public allowed;

  constructor(
    string memory _name,
    string memory _symbol,
    uint256 _supply
  ) {
    name = _name;
    _symbol = symbol;
    decimals = 18;

    balances[msg.sender] = _supply;
    totalSupply = _supply;

    emit Transfer(address(0), msg.sender, _supply);
  }

  function transfer(address _to, uint256 _value) external returns (bool) {
    if (balances[msg.sender] >= _value && _value > 0) {
      balances[msg.sender] -= _value;
      balances[_to] += _value;
      Transfer(msg.sender, _to, _value);
    }
  }

  function transferFrom(
    address _from,
    address _to,
    uint256 _value
  ) external returns (bool) {
    if (balances[_from] >= _value && allowed[_from][msg.sender] >= _value && _value > 0) {
      balances[_to] += _value;
      balances[_from] -= _value;
      allowed[_from][msg.sender] -= _value;
      Transfer(_from, _to, _value);
    }
  }

  function balanceOf(address _owner) external view returns (uint256 balance) {
    return balances[_owner];
  }

  function approve(address _spender, uint256 _value) external returns (bool) {
    allowed[msg.sender][_spender] = _value;
    Approval(msg.sender, _spender, _value);
  }

  function allowance(address _owner, address _spender) external view returns (uint256 remaining) {
    return allowed[_owner][_spender];
  }
}
