// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;

import "./VaultDelegateBase.sol";

/**
 * @title With Flash Loan Contract
 * @dev WithFlashLoan contract implements `EIP-3156 Flash Loan`.
 * Using flash loans, you can borrow up to the total available amount of
 * the stablecoin liquidity available in this cover liquidity pool.
 * You need to return back the borrowed amount + fee in the same transaction.
 * The function `flashFee` enables you to check, in advance, fee that
 * you need to pay to take out the loan.
 */
abstract contract VaultDelegateWithFlashLoan is VaultDelegateBase {
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;
  using VaultLibV1 for IStore;
  using NTransferUtilV2 for IERC20;
  using RoutineInvokerLibV1 for IStore;

  /**
   * @dev The fee to be charged for a given loan.
   * @param token The loan currency.
   * @param amount The amount of tokens lent.
   * @return The amount of `token` to be charged for the loan, on top of the returned principal.
   */
  function getFlashFee(
    address, /*caller*/
    bytes32 coverKey,
    address token,
    uint256 amount
  ) external view override returns (uint256) {
    s.senderMustBeVaultContract(coverKey);
    return s.getFlashFeeInternal(coverKey, token, amount);
  }

  /**
   * @dev The amount of currency available to be lent.
   * @param token The loan currency.
   * @return The amount of `token` that can be borrowed.
   */
  function getMaxFlashLoan(
    address, /*caller*/
    bytes32 coverKey,
    address token
  ) external view override returns (uint256) {
    s.senderMustBeVaultContract(coverKey);
    return s.getMaxFlashLoanInternal(coverKey, token);
  }

  function preFlashLoan(
    address, /*caller*/
    bytes32 coverKey,
    IERC3156FlashBorrower, /*receiver*/
    address token,
    uint256 amount,
    bytes calldata /*data*/
  )
    external
    override
    returns (
      IERC20 stablecoin,
      uint256 fee,
      uint256 protocolFee
    )
  {
    s.mustNotBePaused();
    s.mustHaveNormalCoverStatus(coverKey);
    s.senderMustBeVaultContract(coverKey);

    stablecoin = IERC20(s.getStablecoin());

    require(address(stablecoin) == token, "Unknown token");
    require(amount > 0, "Loan too small");
    require(fee > 0, "Fee too little");

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_HAS_FLASH_LOAN, coverKey, true);

    (fee, protocolFee) = s.getFlashFeesInternal(coverKey, token, amount);
  }

  function postFlashLoan(
    address, /*caller*/
    bytes32 coverKey,
    IERC3156FlashBorrower, /*receiver*/
    address, /*token*/
    uint256, /*amount*/
    bytes calldata /*data*/
  ) external override {
    s.senderMustBeVaultContract(coverKey);

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_HAS_FLASH_LOAN, coverKey, false);
    s.updateStateAndLiquidity(coverKey);
  }
}
