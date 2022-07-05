// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./WithRecovery.sol";
import "./WithPausability.sol";

contract NPM is WithPausability, WithRecovery, ERC20 {
  uint256 private constant _CAP = 1_000_000_000 ether;
  uint256 private _issued = 0;

  event Minted(bytes32 indexed key, address indexed account, uint256 amount);

  constructor(
    address timelockOrOwner,
    string memory tokenName,
    string memory tokenSymbol
  ) Ownable() Pausable() ERC20(tokenName, tokenSymbol) {
    require(timelockOrOwner != address(0), "Invalid owner");
    require(bytes(tokenName).length > 0, "Invalid token name");
    require(bytes(tokenSymbol).length > 0, "Invalid token symbol");

    super._transferOwnership(timelockOrOwner);
  }

  // slither-disable-next-line dead-code
  function _beforeTokenTransfer(
    address,
    address,
    uint256
  ) internal view virtual override whenNotPaused {} // solhint-disable-line

  function issueMany(
    bytes32 key,
    address[] calldata receivers,
    uint256[] calldata amounts
  ) external onlyOwner whenNotPaused {
    require(receivers.length > 0, "No receiver");
    require(receivers.length == amounts.length, "Invalid args");

    _issued += _sumOf(amounts);
    require(_issued <= _CAP, "Cap exceeded");

    for (uint256 i = 0; i < receivers.length; i++) {
      _issue(key, receivers[i], amounts[i]);
    }
  }

  function transferMany(address[] calldata receivers, uint256[] calldata amounts) external onlyOwner whenNotPaused {
    require(receivers.length > 0, "No receiver");
    require(receivers.length == amounts.length, "Invalid args");

    for (uint256 i = 0; i < receivers.length; i++) {
      super.transfer(receivers[i], amounts[i]);
    }
  }

  function _issue(
    bytes32 key,
    address mintTo,
    uint256 amount
  ) private {
    require(amount > 0, "Invalid amount");

    super._mint(mintTo, amount);
    emit Minted(key, mintTo, amount);
  }

  function _sumOf(uint256[] calldata amounts) private pure returns (uint256 total) {
    for (uint256 i = 0; i < amounts.length; i++) {
      total += amounts[i];
    }
  }
}
