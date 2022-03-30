// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./WithRecovery.sol";
import "./WithPausability.sol";

contract NPM is WithPausability, WithRecovery, ERC20 {
  using SafeERC20 for IERC20;

  uint256 private constant _CAP = 1_000_000_000 ether;
  uint256 private _issued = 0;

  event Minted(bytes32 indexed key, address indexed account, uint256 amount);

  constructor(address timelockOrOwner) Ownable() Pausable() ERC20("Neptune Mutual Token", "NPM") {
    super._transferOwnership(timelockOrOwner);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal override whenNotPaused {
    // solhint-disable-previous-line
  }

  function issue(
    bytes32 key,
    address mintTo,
    uint256 amount
  ) external onlyOwner whenNotPaused {
    super._mint(mintTo, amount);
    _issued += amount;

    require(_issued <= _CAP, "Error: can't exceed cap");

    emit Minted(key, mintTo, amount);
  }
}
