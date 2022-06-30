// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../../interfaces/IStore.sol";
import "../../interfaces/IPolicyAdmin.sol";
import "../../libraries/PolicyHelperV1.sol";
import "../../libraries/StoreKeyUtil.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../Recoverable.sol";

/**
 * @title Policy Admin Contract
 * @dev The policy admin contract enables the owner (governance)
 * to set the policy rate and fee info.
 */
contract PolicyAdmin is IPolicyAdmin, Recoverable {
  using ProtoUtilV1 for bytes;
  using PolicyHelperV1 for IStore;
  using ProtoUtilV1 for IStore;
  using ValidationLibV1 for IStore;
  using CoverUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using NTransferUtilV2 for IERC20;
  using RoutineInvokerLibV1 for IStore;

  /**
   * @dev Constructs this contract
   * @param store Provide the store contract instance
   */
  constructor(IStore store) Recoverable(store) {} // solhint-disable-line

  /**
   * @dev Sets policy rates. This feature is only accessible by cover manager.
   * @param floor The lowest cover fee rate fallback
   * @param ceiling The highest cover fee rate fallback
   */
  function setPolicyRates(uint256 floor, uint256 ceiling) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    require(floor > 0, "Please specify floor");
    require(ceiling > floor, "Invalid ceiling");

    s.setUintByKey(ProtoUtilV1.NS_COVER_POLICY_RATE_FLOOR, floor);
    s.setUintByKey(ProtoUtilV1.NS_COVER_POLICY_RATE_CEILING, ceiling);

    s.updateStateAndLiquidity(0);

    emit PolicyRateSet(floor, ceiling);
  }

  /**
   * @dev Sets policy rates for the given cover key. This feature is only accessible by cover manager.
   * @param floor The lowest cover fee rate for this cover
   * @param ceiling The highest cover fee rate for this cover
   */
  function setPolicyRatesByKey(
    bytes32 coverKey,
    uint256 floor,
    uint256 ceiling
  ) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);
    s.mustBeValidCoverKey(coverKey);

    require(floor > 0, "Please specify floor");
    require(ceiling > 0, "Invalid ceiling");

    s.setUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_FLOOR, coverKey, floor);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_CEILING, coverKey, ceiling);

    s.updateStateAndLiquidity(coverKey);

    emit CoverPolicyRateSet(coverKey, floor, ceiling);
  }

  /**
   * @dev The coverage of a policy begins at the EOD timestamp
   * of the policy purchase date plus the coverage lag.
   *
   * Coverage lag is a specified time period that can be set globally
   * or on a per-cover basis to delay the start of coverage.
   *
   * This allows us to defend against time-based opportunistic attacks,
   * which occur when an attacker purchases coverage after
   * an incident has occurred but before the incident has been reported.
   */
  function setCoverageLag(bytes32 coverKey, uint256 window) external override {
    require(window >= 1 days, "Enter at least 1 day");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    if (coverKey > 0) {
      s.mustBeValidCoverKey(coverKey);
      s.setUintByKeys(ProtoUtilV1.NS_COVERAGE_LAG, coverKey, window);

      emit CoverageLagSet(coverKey, window);
      return;
    }

    s.setUintByKey(ProtoUtilV1.NS_COVERAGE_LAG, window);
    emit CoverageLagSet(coverKey, window);
  }

  /**
   * @dev Gets the cover policy rates for the given cover key
   */
  function getPolicyRates(bytes32 coverKey) external view override returns (uint256 floor, uint256 ceiling) {
    return s.getPolicyRatesInternal(coverKey);
  }

  /**
   * @dev Gets the policy lag for the given cover key
   */
  function getCoverageLag(bytes32 coverKey) external view override returns (uint256) {
    return s.getCoverageLagInternal(coverKey);
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
    return ProtoUtilV1.CNAME_POLICY_ADMIN;
  }
}
