// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../../interfaces/IStore.sol";
import "../../interfaces/ICoverReassurance.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/CoverUtilV1.sol";
import "../../libraries/ValidationLibV1.sol";
import "../../libraries/StoreKeyUtil.sol";
import "../../libraries/NTransferUtilV2.sol";
import "../../libraries/GovernanceUtilV1.sol";
import "../Recoverable.sol";

/**
 * @title Cover Reassurance
 * @dev Reassurance tokens can be added by a covered project to demonstrate coverage support
 * for their project. This helps bring the cover fee down and enhances
 * liquidity provider confidence. Along with the NPM tokens, the reassurance tokens are rewarded
 * as a support to the liquidity providers when a cover incident occurs.
 */
contract CoverReassurance is ICoverReassurance, Recoverable {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using NTransferUtilV2 for IERC20;
  using CoverUtilV1 for IStore;
  using ValidationLibV1 for IStore;
  using RegistryLibV1 for IStore;
  using RoutineInvokerLibV1 for IStore;
  using GovernanceUtilV1 for IStore;

  constructor(IStore store) Recoverable(store) {} // solhint-disable-line

  /**
   * @dev Adds reassurance to the specified cover contract
   * @param coverKey Enter the cover key
   * @param amount Enter the amount you would like to supply
   */
  function addReassurance(
    bytes32 coverKey,
    address account,
    uint256 amount
  ) external override nonReentrant {
    // @suppress-acl Reassurance can only be added by cover owner or latest cover contract
    s.mustNotBePaused();
    s.mustBeValidCoverKey(coverKey);
    s.mustBeCoverOwnerOrCoverContract(coverKey, msg.sender);

    require(amount > 0, "Provide valid amount");

    // @suppress-malicious-erc20 This ERC-20 is a well-known address. Can only be set internally.
    IERC20 reassuranceToken = IERC20(s.getStablecoin());

    s.addUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE, coverKey, amount);

    reassuranceToken.ensureTransferFrom(account, address(this), amount);

    s.updateStateAndLiquidity(coverKey);

    emit ReassuranceAdded(coverKey, amount);
  }

  function setWeight(bytes32 coverKey, uint256 weight) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);
    s.mustBeValidCoverKey(coverKey);

    require(weight > 0, "Please specify weight");

    s.setUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_WEIGHT, coverKey, weight);

    s.updateStateAndLiquidity(coverKey);

    emit WeightSet(coverKey, weight);
  }

  function capitalizePool(bytes32 coverKey, uint256 incidentDate) external override nonReentrant {
    require(incidentDate > 0, "Please specify incident date");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);

    s.mustBeValidIncidentDate(coverKey, incidentDate);
    s.mustBeAfterResolutionDeadline(coverKey);
    s.mustBeClaimable(coverKey);
    s.mustBeAfterClaimExpiry(coverKey);

    IVault vault = s.getVault(coverKey);
    IERC20 stablecoin = IERC20(s.getStablecoin());

    uint256 toTransfer = s.getReassuranceTransferrableInternal(coverKey, incidentDate);

    require(toTransfer > 0, "Nothing to capitalize");

    stablecoin.ensureTransfer(address(vault), toTransfer);
    s.subtractUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE, coverKey, toTransfer);
    s.addReassurancePayoutInternal(coverKey, incidentDate, toTransfer);
  }

  /**
   * @dev Gets the reassurance amount of the specified cover contract
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
