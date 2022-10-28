// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "./VaultDelegateBase.sol";

/**
 * Important: This contract is not intended to be accessed
 * by anyone/anything except individual vault contracts.
 *
 * @title With Flash Loan Delegate Contract
 *
 * @dev This contract implements [EIP-3156 Flash Loan](https://eips.ethereum.org/EIPS/eip-3156).
 *
 */
abstract contract VaultDelegateWithFlashLoan is VaultDelegateBase {
  using ProtoUtilV1 for IStore;
  using RoutineInvokerLibV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;
  using VaultLibV1 for IStore;

  /**
   * @dev The fee to be charged for a given loan.
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param token The loan currency.
   * @param amount The amount of tokens lent.
   * @return The amount of `token` to be charged for the loan, on top of the returned principal.
   *
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
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param token The loan currency.
   * @return The amount of `token` that can be borrowed.
   *
   */
  function getMaxFlashLoan(
    address, /*caller*/
    bytes32 coverKey,
    address token
  ) external view override returns (uint256) {
    s.senderMustBeVaultContract(coverKey);
    return s.getMaxFlashLoanInternal(coverKey, token);
  }

  /**
   * @dev This hook runs before `flashLoan` implementation on vault(s)
   *
   * @custom:suppress-acl This function is only accessible to the vault contract
   * @custom:note Please note the following:
   *
   * - msg.sender must be the correct vault contract
   * - Cover status should be normal
   *
   * @param coverKey Enter the cover key
   * @param token Enter the token you want to borrow
   * @param amount Enter the flash loan amount to receive
   *
   */
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
    s.mustEnsureAllProductsAreNormal(coverKey);
    s.senderMustBeVaultContract(coverKey);

    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER_HAS_FLASH_LOAN, coverKey) == false, "On flash loan, please try again");
    s.setBoolByKeys(ProtoUtilV1.NS_COVER_HAS_FLASH_LOAN, coverKey, true);

    stablecoin = IERC20(s.getStablecoinAddressInternal());

    // require(address(stablecoin) == token, "Unknown token"); <-- already checked in `getFlashFeesInternal`
    // require(amount > 0, "Loan too small"); <-- already checked in `getFlashFeesInternal`

    (fee, protocolFee) = s.getFlashFeesInternal(coverKey, token, amount);

    require(fee > 0, "Loan too small");
    require(protocolFee > 0, "Loan too small");
  }

  /**
   * @dev This hook runs after `flashLoan` implementation on vault(s)
   *
   * @custom:suppress-acl This function is only accessible to the vault contract
   * @custom:note Please note the following:
   *
   * - msg.sender must be the correct vault contract
   * - Cover status should be normal
   *
   * @param coverKey Enter the cover key
   *
   */
  function postFlashLoan(
    address, /*caller*/
    bytes32 coverKey,
    IERC3156FlashBorrower, /*receiver*/
    address, /*token*/
    uint256, /*amount*/
    bytes calldata /*data*/
  ) external override {
    // @suppress-zero-value-check The `amount` value isn't used and therefore not checked
    s.mustNotBePaused();
    s.senderMustBeVaultContract(coverKey);
    s.mustEnsureAllProductsAreNormal(coverKey);

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_HAS_FLASH_LOAN, coverKey, false);
    s.updateStateAndLiquidityInternal(coverKey);
  }
}
