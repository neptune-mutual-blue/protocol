// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;

import "./VaultBase.sol";
import "openzeppelin-solidity/contracts/interfaces/IERC3156FlashLender.sol";

/**
 * @title With Flash Loan Contract
 * @dev WithFlashLoan contract implements `EIP-3156 Flash Loan`.
 * Using flash loans, you can borrow up to the total available amount of
 * the stablecoin liquidity available in this cover liquidity pool.
 * You need to return back the borrowed amount + fee in the same transaction.
 * The function `flashFee` enables you to check, in advance, fee that
 * you need to pay to take out the loan.
 */
abstract contract WithFlashLoan is VaultBase, IERC3156FlashLender {
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
  function flashFee(address token, uint256 amount) external view override returns (uint256) {
    return s.getFlashFeeInternal(token, amount);
  }

  /**
   * @dev The amount of currency available to be lent.
   * @param token The loan currency.
   * @return The amount of `token` that can be borrowed.
   */
  function maxFlashLoan(address token) external view override returns (uint256) {
    return s.getMaxFlashLoanInternal(token);
  }

  /**
   * @dev Initiate a flash loan.
   * @param receiver The receiver of the tokens in the loan, and the receiver of the callback.
   * @param token The loan currency.
   * @param amount The amount of tokens lent.
   * @param data Arbitrary data structure, intended to contain user-defined parameters.
   */
  function flashLoan(
    IERC3156FlashBorrower receiver,
    address token,
    uint256 amount,
    bytes calldata data
  ) external override nonReentrant returns (bool) {
    // @suppress-acl Marking this as publicly accessible
    // @suppress-address-trust-issue The instance of `token` can be trusted because we're ensuring it matches with the protocol stablecoin address.
    s.mustNotBePaused();

    uint256 fee = s.flashLoanInternal(receiver, key, token, amount, data);
    emit FlashLoanBorrowed(address(this), address(receiver), token, amount, fee);
    return true;
  }
}
