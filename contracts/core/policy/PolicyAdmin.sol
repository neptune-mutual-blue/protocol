// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../../interfaces/IStore.sol";
import "../../interfaces/IMember.sol";
import "../../libraries/CoverUtilV1.sol";
import "../../libraries/StoreKeyUtil.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/NTransferUtilV2.sol";
import "../Recoverable.sol";

/**
 * @title Policy Admin Contract
 * @dev The policy admin contract enables the owner (governance)
 * to set the policy rate and fee info.
 */
contract PolicyAdmin is IMember, Recoverable {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using CoverUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using NTransferUtilV2 for IERC20;

  event PolicyRateSet(uint256 floor, uint256 ceiling);
  event CoverPolicyRateSet(bytes32 key, uint256 floor, uint256 ceiling);

  /**
   * @dev Constructs this contract
   * @param store Provide the store contract instance
   */
  constructor(IStore store) Recoverable(store) {
    this;
  }

  /**
   * @dev Sets policy rates. This feature is only accessible by owner or protocol owner.
   * @param floor The lowest cover fee rate fallback
   * @param ceiling The highest cover fee rate fallback
   */
  function setPolicyRates(uint256 floor, uint256 ceiling) external {
    _mustBeOwnerOrProtoOwner(); // Ensures that the caller is either the owner or protocol owner

    s.setUintByKey(ProtoUtilV1.NS_COVER_POLICY_RATE_FLOOR, floor);
    s.setUintByKey(ProtoUtilV1.NS_COVER_POLICY_RATE_CEILING, ceiling);

    emit PolicyRateSet(floor, ceiling);
  }

  /**
   * @dev Sets policy rates for the given cover key. This feature is only accessible by owner or protocol owner.
   * @param floor The lowest cover fee rate for this cover
   * @param ceiling The highest cover fee rate for this cover
   */
  function setPolicyRates(
    bytes32 key,
    uint256 floor,
    uint256 ceiling
  ) external {
    _mustBeOwnerOrProtoOwner(); // Ensures that the caller is either the owner or protocol owner

    s.setUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_FLOOR, key, floor);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_CEILING, key, ceiling);

    emit CoverPolicyRateSet(key, floor, ceiling);
  }

  /**
   * @dev Gets the cover policy rates for the given cover key
   */
  function getPolicyRates(bytes32 key) external view returns (uint256 floor, uint256 ceiling) {
    return s.getPolicyRates(key);
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
  function getName() public pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_POLICY;
  }
}
