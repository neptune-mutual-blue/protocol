// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "../../interfaces/IStore.sol";
import "../../interfaces/ICoverReassurance.sol";
import "../../libraries/NTransferUtilV2.sol";
import "../Recoverable.sol";

/**
 * @title Cover Reassurance
 *
 * @dev A covered project can add reassurance fund to exhibit coverage support for their project.
 * This reduces the cover fee and increases the confidence of liquidity providers.
 * A portion of the reassurance fund is awarded to liquidity providers in the event of a cover incident.
 *
 * <br />
 *
 * - [https://docs.neptunemutual.com/sdk/cover-assurance](https://docs.neptunemutual.com/sdk/cover-assurance)
 * - [https://docs.neptunemutual.com/definitions/cover-products](https://docs.neptunemutual.com/definitions/cover-products)
 *
 */
contract CoverReassurance is ICoverReassurance, Recoverable {
  using CoverUtilV1 for IStore;
  using GovernanceUtilV1 for IStore;
  using NTransferUtilV2 for IERC20;
  using ProtoUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using RoutineInvokerLibV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;

  constructor(IStore store) Recoverable(store) {} // solhint-disable-line

  /**
   * @dev Adds reassurance to the specified cover contract
   *
   * @custom:suppress-acl Reassurance can only be added by cover owner or latest cover contract
   * @custom:suppress-malicious-erc This ERC-20 `s.getStablecoin()` is a well-known address.
   *
   * @param coverKey Enter the cover key
   * @param onBehalfOf Enter the account on behalf of which you are adding reassurance.
   * @param amount Enter the amount you would like to supply
   *
   */
  function addReassurance(
    bytes32 coverKey,
    address onBehalfOf,
    uint256 amount
  ) external override nonReentrant {
    s.mustNotBePaused();
    s.mustBeValidCoverKey(coverKey);
    s.mustBeCoverOwnerOrCoverContract(coverKey, msg.sender);

    require(amount > 0, "Provide valid amount");

    IERC20 stablecoin = IERC20(s.getStablecoin());

    s.addUintByKey(CoverUtilV1.getReassuranceKey(coverKey), amount);

    stablecoin.ensureTransferFrom(msg.sender, address(this), amount);

    // Do not update state during cover creation
    // s.updateStateAndLiquidity(coverKey);

    emit ReassuranceAdded(coverKey, onBehalfOf, amount);
  }

  /**
   * @dev Sets the reassurance weight as a percentage value.
   *
   * @custom:note About the Reassurance Weight:
   *
   * When you set a weight to reassurance fund, it used to
   * calculate the adjusted reassurance capital available for a cover pool.
   *
   * ```
   * adjusted reassurance fund = (reassurance balance * reassurancePoolWeight) / multiplier
   * ```
   *
   * Since the reassurance fund gets capitalized to its liquidity pool after an incident resolution,
   * the adjusted amount is therefore regarded as an additional capital available to a cover risks
   * for that pool. This helps lower the policy premium fees.
   *
   * @param coverKey Enter the cover key for which you want to set the weight. You can
   * provide `0x` as cover key if you want to set reassurance weight globally.
   * @param weight Enter the weight value as percentage (see ProtoUtilV1.MULTIPLIER).
   * You can't exceed 100%.
   *
   */
  function setWeight(bytes32 coverKey, uint256 weight) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);
    s.mustBeValidCoverKey(coverKey);

    require(weight > 0 && weight <= ProtoUtilV1.MULTIPLIER, "Please specify weight");

    s.setUintByKey(CoverUtilV1.getReassuranceWeightKey(coverKey), weight);

    s.updateStateAndLiquidity(coverKey);

    emit WeightSet(coverKey, weight);
  }

  /**
   * @dev Capitalizes the cover liquidity pool (or Vault) with whichever
   * is less between 25% of the suffered loss or 25% of the reassurance pool balance.
   *
   * <br /> <br />
   *
   * This function can only be invoked if the specified cover was "claimable"
   * and after "claim period" is over.
   *
   * @param coverKey Enter the cover key that has suffered capital depletion or loss.
   * @param productKey Enter the product key that has suffered capital depletion or loss.
   * @param incidentDate Enter the date of the incident report.
   *
   */
  function capitalizePool(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external override nonReentrant {
    require(incidentDate > 0, "Please specify incident date");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);
    s.mustBeValidIncidentDate(coverKey, productKey, incidentDate);
    s.mustBeAfterResolutionDeadline(coverKey, productKey);
    s.mustBeClaimable(coverKey, productKey);
    s.mustBeAfterClaimExpiry(coverKey, productKey);

    IVault vault = s.getVault(coverKey);
    IERC20 stablecoin = IERC20(s.getStablecoin());

    uint256 toTransfer = s.getReassuranceTransferrableInternal(coverKey, productKey, incidentDate);

    require(toTransfer > 0, "Nothing to capitalize");

    stablecoin.ensureTransfer(address(vault), toTransfer);
    s.subtractUintByKey(CoverUtilV1.getReassuranceKey(coverKey), toTransfer);
    s.addReassurancePayoutInternal(coverKey, productKey, incidentDate, toTransfer);

    emit PoolCapitalized(coverKey, productKey, incidentDate, toTransfer);
  }

  /**
   * @dev Gets the reassurance amount of the specified cover contract
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param coverKey Enter the cover key
   */
  function getReassurance(bytes32 coverKey) external view override returns (uint256) {
    return s.getReassuranceAmountInternal(coverKey);
  }

  /**
   * @dev Version number of this contract
   */
  function version() external pure override returns (bytes32) {
    return "v0.1";
  }

  /**
   * @dev Name of this contract
   */
  function getName() external pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_COVER_REASSURANCE;
  }
}
