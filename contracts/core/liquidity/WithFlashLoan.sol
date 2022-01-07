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
  using ValidationLibV1 for IStore;
  using VaultLibV1 for IStore;
  using NTransferUtilV2 for IERC20;

  /**
   * @dev The fee to be charged for a given loan.
   * @param token The loan currency.
   * @param amount The amount of tokens lent.
   * @return The amount of `token` to be charged for the loan, on top of the returned principal.
   */
  function flashFee(address token, uint256 amount) external view override returns (uint256) {
    (uint256 fee, ) = s.getFlashFeeInternal(token, amount);
    return fee;
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
    // @suppress-address-trust-issue The instance of `token` can be trusted because we're ensuring it matches with the protocol stablecoin address.
    IERC20 stablecoin = IERC20(s.getStablecoin());
    (uint256 fee, uint256 protocolFee) = s.getFlashFeeInternal(token, amount);
    uint256 previousBalance = stablecoin.balanceOf(address(this));

    s.mustNotBePaused();

    require(address(stablecoin) == token, "Unknown token");
    require(amount > 0, "Loan too small");
    require(fee > 0, "Fee too little");
    require(previousBalance >= amount, "Balance insufficient");

    stablecoin.ensureTransfer(address(receiver), amount);
    require(receiver.onFlashLoan(msg.sender, token, amount, fee, data) == keccak256("ERC3156FlashBorrower.onFlashLoan"), "IERC3156: Callback failed");
    stablecoin.ensureTransferFrom(address(receiver), address(this), amount + fee);
    stablecoin.ensureTransfer(s.getTreasury(), protocolFee);

    uint256 finalBalance = stablecoin.balanceOf(address(this));
    require(finalBalance >= previousBalance + fee, "Access is denied");

    emit FlashLoanBorrowed(address(this), address(receiver), token, amount, fee);
    return true;
  }
}
