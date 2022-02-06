// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../../interfaces/IStore.sol";
import "../../interfaces/ICover.sol";
import "../../libraries/CoverLibV1.sol";
import "../../libraries/StoreKeyUtil.sol";
import "../Recoverable.sol";

/**
 * @title Base Cover Contract
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
   * @param liquidityToken Provide the address of the token this cover will be quoted against.
   * @param liquidityName Enter a description or ENS name of your liquidity token.
   *
   */
  function initialize(address liquidityToken, bytes32 liquidityName) external override nonReentrant {
    // @suppress-initialization Can only be initialized once by a cover manager
    // @suppress-address-trust-issue liquidityToken This instance of liquidityToken can be trusted because of the ACL requirement.

    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    require(s.getAddressByKey(ProtoUtilV1.CNS_COVER_STABLECOIN) == address(0), "Already initialized");

    s.initializeCoverInternal(liquidityToken, liquidityName);
    emit CoverInitialized(liquidityToken, liquidityName);
  }

  function setCoverFees(uint256 value) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    uint256 previous = s.setCoverFeesInternal(value);
    emit CoverFeeSet(previous, value);
  }

  function setMinCoverCreationStake(uint256 value) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    uint256 previous = s.setMinCoverCreationStakeInternal(value);
    emit MinCoverCreationStakeSet(previous, value);
  }

  function setMinStakeToAddLiquidity(uint256 value) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    uint256 previous = s.setMinStakeToAddLiquidityInternal(value);
    emit MinStakeToAddLiquiditySet(previous, value);
  }

  /**
   * @dev Get more information about this cover contract
   * @param key Enter the cover key
   * @param coverOwner Returns the address of the cover creator or owner
   * @param info Gets the IPFS hash of the cover info
   * @param values Array of uint256 values
   */
  function getCover(bytes32 key)
    external
    view
    override
    returns (
      address coverOwner,
      bytes32 info,
      uint256[] memory values
    )
  {
    return s.getCoverInfo(key);
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
