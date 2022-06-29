// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;

import "./VaultDelegateBase.sol";

/**
 * @title With Flash Loan Delegate Contract
 *
 * @dev VaultDelegateWithFlashLoan contract implements `EIP-3156 Flash Loan`.
 */
abstract contract VaultDelegateWithFlashLoan is VaultDelegateBase {
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;
  using VaultLibV1 for IStore;
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

  /**
   * @dev This hook runs before `flashLoan` implementation on vault(s)
   *
   * Note:
   *
   * - msg.sender must be the correct vault contract
   * - Cover status should be normal
   *
   * @param coverKey Enter the cover key
   * @param token Enter the token you want to borrow
   * @param amount Enter the flash loan amount to receive
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
    // @suppress-acl This function is only accessible to the vault contract
    // @suppress-acl No need to define ACL as this function is only accessible to associated vault contract of the coverKey
    s.mustNotBePaused();
    s.mustEnsureAllProductsAreNormal(coverKey);
    s.senderMustBeVaultContract(coverKey);

    stablecoin = IERC20(s.getStablecoin());

    // require(address(stablecoin) == token, "Unknown token"); <-- already checked in `getFlashFeesInternal`
    // require(amount > 0, "Loan too small"); <-- already checked in `getFlashFeesInternal`

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_HAS_FLASH_LOAN, coverKey, true);

    (fee, protocolFee) = s.getFlashFeesInternal(coverKey, token, amount);

    require(fee > 0, "Loan too small");
    require(protocolFee > 0, "Loan too small");
  }

  /**
   * @dev This hook runs after `flashLoan` implementation on vault(s)
   *
   * Note:
   *
   * - msg.sender must be the correct vault contract
   * - Cover status should be normal
   *
   * @param coverKey Enter the cover key
   */
  function postFlashLoan(
    address, /*caller*/
    bytes32 coverKey,
    IERC3156FlashBorrower, /*receiver*/
    address, /*token*/
    uint256, /*amount*/
    bytes calldata /*data*/
  ) external override {
    // @suppress-acl This function is only accessible to the vault contract
    // @suppress-zero-value-check The `amount` value isn't used and therefore not checked
    s.mustNotBePaused();
    s.senderMustBeVaultContract(coverKey);
    s.mustEnsureAllProductsAreNormal(coverKey);

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_HAS_FLASH_LOAN, coverKey, false);
    s.updateStateAndLiquidity(coverKey);
  }
}
