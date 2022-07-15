/* solhint-disable */

// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/utils/SafeERC20.sol";

library NTransferUtilV2 {
  using SafeERC20 for IERC20;

  /**
   *
   * @dev Ensures approval of ERC20-like token
   * @custom:suppress-malicious-erc The address `malicious` can't be trusted and therefore we are ensuring that it does not act funny.
   * @custom:suppress-address-trust-issue The address `malicious` can't be trusted and therefore we are ensuring that it does not act funny.
   *
   */
  function ensureApproval(
    IERC20 malicious,
    address spender,
    uint256 amount
  ) external {
    require(address(malicious) != address(0), "Invalid token address");
    require(spender != address(0), "Invalid spender");
    require(amount > 0, "Invalid transfer amount");

    malicious.safeIncreaseAllowance(spender, amount);
  }

  /**
   * @dev Ensures transfer of ERC20-like token
   *
   * @custom:suppress-malicious-erc The address `malicious` can't be trusted and therefore we are ensuring that it does not act funny.
   * @custom:suppress-address-trust-issue The address `malicious` can't be trusted and therefore we are ensuring that it does not act funny.
   * The address `recipient` can be trusted as we're not treating (or calling) it as a contract.
   *
   */
  function ensureTransfer(
    IERC20 malicious,
    address recipient,
    uint256 amount
  ) external {
    require(address(malicious) != address(0), "Invalid token address");
    require(recipient != address(0), "Spender can't be zero");
    require(amount > 0, "Invalid transfer amount");

    uint256 balanceBeforeTransfer = malicious.balanceOf(recipient);
    malicious.safeTransfer(recipient, amount);
    uint256 balanceAfterTransfer = malicious.balanceOf(recipient);

    // @suppress-subtraction
    uint256 actualTransferAmount = balanceAfterTransfer - balanceBeforeTransfer;

    require(actualTransferAmount == amount, "Invalid transfer");
  }

  /**
   * @dev Ensures transferFrom of ERC20-like token
   *
   * @custom:suppress-malicious-erc The address `malicious` can't be trusted and therefore we are ensuring that it does not act funny.
   * @custom:suppress-address-trust-issue The address `malicious` can't be trusted and therefore we are ensuring that it does not act funny.
   * The address `recipient` can be trusted as we're not treating (or calling) it as a contract.
   *
   */
  function ensureTransferFrom(
    IERC20 malicious,
    address sender,
    address recipient,
    uint256 amount
  ) external {
    require(address(malicious) != address(0), "Invalid token address");
    require(sender != address(0), "Invalid sender");
    require(recipient != address(0), "Invalid recipient");
    require(amount > 0, "Invalid transfer amount");

    uint256 balanceBeforeTransfer = malicious.balanceOf(recipient);
    malicious.safeTransferFrom(sender, recipient, amount);
    uint256 balanceAfterTransfer = malicious.balanceOf(recipient);

    // @suppress-subtraction
    uint256 actualTransferAmount = balanceAfterTransfer - balanceBeforeTransfer;

    require(actualTransferAmount == amount, "Invalid transfer");
  }
}
