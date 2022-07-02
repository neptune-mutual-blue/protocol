// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "../../interfaces/IStore.sol";
import "../../interfaces/ICover.sol";
import "../../libraries/CoverLibV1.sol";
import "../../libraries/StoreKeyUtil.sol";
import "../Recoverable.sol";

/**
 * @title Base Cover Contract
 *
 */
abstract contract CoverBase is ICover, Recoverable {
  using CoverLibV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;

  /**
   * @dev Constructs this smart contract
   * @param store Provide the address of an eternal storage contract to use.
   * This contract must be a member of the Protocol for write access to the storage
   *
   */
  constructor(IStore store) Recoverable(store) {} // solhint-disable-line

  /**
   * @dev Initializes this contract
   *
   * @custom:warning Warning:
   *
   * This is a one-time setup. The stablecoin contract address can't be updated once set.
   *
   * @custom:suppress-address-trust-issue This instance of stablecoin can be trusted because of the ACL requirement.
   * @custom:suppress-initialization Can only be initialized once by a cover manager
   *
   * @param stablecoin Provide the address of the token this cover will be quoted against.
   * @param friendlyName Enter a description or ENS name of your liquidity token.
   *
   */
  function initialize(address stablecoin, bytes32 friendlyName) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    require(s.getAddressByKey(ProtoUtilV1.CNS_COVER_STABLECOIN) == address(0), "Already initialized");

    s.initializeCoverInternal(stablecoin, friendlyName);
    emit CoverInitialized(stablecoin, friendlyName);
  }

  /**
   * @dev Sets the cover creation fee
   *
   * @param value Enter the cover creation fee in NPM token units
   */
  function setCoverCreationFee(uint256 value) external override nonReentrant {
    require(value > 0, "Please specify value");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    uint256 previous = s.setCoverCreationFeeInternal(value);
    emit CoverCreationFeeSet(previous, value);
  }

  /**
   * @dev Sets minimum stake to create a new cover
   *
   * @param value Enter the minimum cover creation stake in NPM token units
   */
  function setMinCoverCreationStake(uint256 value) external override nonReentrant {
    require(value > 0, "Please specify value");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    uint256 previous = s.setMinCoverCreationStakeInternal(value);
    emit MinCoverCreationStakeSet(previous, value);
  }

  /**
   * @dev Sets minimum stake to add liquidity
   *
   * @custom:note Please note that liquidity providers can remove 100% stake
   * and exit their NPM stake position whenever they want to, provided they do it during
   * a "withdrawal window".
   *
   * @param value Enter the minimum stake to add liquidity.
   */
  function setMinStakeToAddLiquidity(uint256 value) external override nonReentrant {
    require(value > 0, "Please specify value");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    uint256 previous = s.setMinStakeToAddLiquidityInternal(value);
    emit MinStakeToAddLiquiditySet(previous, value);
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
    return ProtoUtilV1.CNAME_COVER;
  }
}
