// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../../interfaces/IStore.sol";
import "../../interfaces/IPolicyAdmin.sol";
import "../../libraries/PolicyHelperV1.sol";
import "../../libraries/StoreKeyUtil.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/NTransferUtilV2.sol";
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
    bytes32 key,
    uint256 floor,
    uint256 ceiling
  ) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    s.setUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_FLOOR, key, floor);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_CEILING, key, ceiling);

    s.updateStateAndLiquidity(key);

    emit CoverPolicyRateSet(key, floor, ceiling);
  }

  /**
   * @dev Gets the cover policy rates for the given cover key
   */
  function getPolicyRates(bytes32 key) external view override returns (uint256 floor, uint256 ceiling) {
    return s.getPolicyRatesInternal(key);
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
