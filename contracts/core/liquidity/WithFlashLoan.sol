// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/interfaces/IERC3156FlashLender.sol";
import "./VaultStrategy.sol";

abstract contract WithFlashLoan is VaultStrategy, IERC3156FlashLender {
  using ProtoUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using NTransferUtilV2 for IERC20;

  /**
   * Flash loan feature
   *
   * @custom:suppress-acl This is a publicly accessible feature
   * @custom:suppress-malicious-erc This ERC-20 `s.getStablecoin()` is a well-known address.
   * @custom:suppress-pausable
   * @custom:suppress-address-trust-issue The address `stablecoin` can't be manipulated via user input.
   *
   */
  function flashLoan(
    IERC3156FlashBorrower receiver,
    address token,
    uint256 amount,
    bytes calldata data
  ) external override nonReentrant returns (bool) {
    require(amount > 0, "Please specify amount");

    /******************************************************************************************
      PRE
     ******************************************************************************************/
    (IERC20 stablecoin, uint256 fee, uint256 protocolFee) = delgate().preFlashLoan(msg.sender, key, receiver, token, amount, data);

    /******************************************************************************************
      BODY
     ******************************************************************************************/
    uint256 previousBalance = stablecoin.balanceOf(address(this));
    // require(previousBalance >= amount, "Balance insufficient"); <-- already checked in `preFlashLoan` --> `getFlashFeesInternal`

    stablecoin.ensureTransfer(address(receiver), amount);
    require(receiver.onFlashLoan(msg.sender, token, amount, fee, data) == keccak256("ERC3156FlashBorrower.onFlashLoan"), "IERC3156: Callback failed");
    stablecoin.ensureTransferFrom(address(receiver), address(this), amount + fee);

    uint256 finalBalance = stablecoin.balanceOf(address(this));
    require(finalBalance >= previousBalance + fee, "Access is denied");

    // Transfer protocol fee to the treasury
    stablecoin.ensureTransfer(s.getTreasury(), protocolFee);

    /******************************************************************************************
      POST
     ******************************************************************************************/

    delgate().postFlashLoan(msg.sender, key, receiver, token, amount, data);

    emit FlashLoanBorrowed(address(this), address(receiver), token, amount, fee);

    return true;
  }

  function flashFee(address token, uint256 amount) external view override returns (uint256) {
    return delgate().getFlashFee(msg.sender, key, token, amount);
  }

  function maxFlashLoan(address token) external view override returns (uint256) {
    return delgate().getMaxFlashLoan(msg.sender, key, token);
  }
}
