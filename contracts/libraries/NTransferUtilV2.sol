/* solhint-disable */

// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/utils/SafeERC20.sol";

library NTransferUtilV2 {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  function ensureTransfer(
    IERC20 malicious,
    address recipient,
    uint256 amount
  ) external {
    require(recipient != address(0), "Invalid recipient");
    require(amount > 0, "Invalid transfer amount");

    uint256 pre = malicious.balanceOf(recipient);
    malicious.safeTransfer(recipient, amount);

    uint256 post = malicious.balanceOf(recipient);

    // slither-disable-next-line incorrect-equality
    require(post.sub(pre) == amount, "Invalid transfer");
  }

  function ensureTransferFrom(
    IERC20 malicious,
    address sender,
    address recipient,
    uint256 amount
  ) external {
    require(recipient != address(0), "Invalid recipient");
    require(amount > 0, "Invalid transfer amount");

    uint256 pre = malicious.balanceOf(recipient);
    malicious.safeTransferFrom(sender, recipient, amount);
    uint256 post = malicious.balanceOf(recipient);

    // slither-disable-next-line incorrect-equality
    require(post.sub(pre) == amount, "Invalid transfer");
  }
}
