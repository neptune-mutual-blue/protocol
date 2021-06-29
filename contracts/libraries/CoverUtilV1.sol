// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../interfaces/IStore.sol";
import "../interfaces/IPolicy.sol";
import "../interfaces/ICoverStake.sol";
import "../interfaces/ICTokenFactory.sol";
import "../interfaces/ICoverAssurance.sol";
import "../interfaces/IVault.sol";
import "../interfaces/IVaultFactory.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./ProtoUtilV1.sol";
import "./StoreKeyUtil.sol";

library CoverUtilV1 {
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;

  /**
   * @dev Reverts if the key does not resolve in a valid cover contract.
   * @param key Enter the cover key to check
   */
  function mustBeValidCover(IStore s, bytes32 key) external view {
    require(_getStatus(s, key) != 1, "Cover on Maintenance");
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, key), "Cover does not exist");
  }

  /**
   * @dev Reverts if the sender is not the cover owner or owner
   * @param key Enter the cover key to check
   * @param sender The `msg.sender` value
   * @param owner Enter the owner address
   */
  function mustBeCoverOwner(
    IStore s,
    bytes32 key,
    address sender,
    address owner
  ) external view {
    bool isCoverOwner = _getCoverOwner(s, key) == sender;
    bool isOwner = sender == owner;

    require(isOwner || isCoverOwner, "Forbidden");
  }

  function getCoverOwner(IStore s, bytes32 key) external view returns (address) {
    return _getCoverOwner(s, key);
  }

  /**
   * @dev Gets the current status of the protocol
   *
   * 0 - normal
   * 1 - stopped, can not purchase covers or add liquidity
   * 2 - reporting, incident happened
   * 3 - reporting, false reporting
   * 4 - claimable, claims accepted for payout
   *
   */
  function getStatus(IStore s, bytes32 key) external view returns (uint256) {
    return _getStatus(s, key);
  }

  /**
   * @dev Todo: Returns the values of the given cover key
   * @param _values[0] The total amount in the cover pool
   * @param _values[1] The total commitment amount
   * @param _values[2] The total amount of NEP provision
   * @param _values[3] NEP price
   * @param _values[4] The total amount of assurance tokens
   * @param _values[5] Assurance token price
   * @param _values[6] Assurance pool weight
   */
  function getCoverPoolSummary(IStore s, bytes32 key) external view returns (uint256[] memory _values) {
    require(_getStatus(s, key) != 1, "Invalid cover");

    _values = new uint256[](7);
    revert("Not implemented");
  }

  function getPolicyRates(IStore s, bytes32 key) external view returns (uint256 floor, uint256 ceiling) {
    floor = s.getUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_FLOOR, key);
    ceiling = s.getUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_CEILING, key);

    if (floor == 0) {
      // Fallback to default values
      floor = s.getUintByKey(ProtoUtilV1.NS_COVER_POLICY_RATE_FLOOR);
      ceiling = s.getUintByKey(ProtoUtilV1.NS_COVER_POLICY_RATE_CEILING);
    }
  }

  function getLiquidity(IStore s, bytes32 key) public view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY, key);
  }

  function getStake(IStore s, bytes32 key) public view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_STAKE, key);
  }

  function getClaimable(IStore s, bytes32 key) external view returns (uint256) {
    return _getClaimable(s, key);
  }

  function getCoverInfo(IStore s, bytes32 key)
    external
    view
    returns (
      address owner,
      bytes32 info,
      uint256[] memory values
    )
  {
    info = s.getBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, key);
    owner = s.getAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, key);

    values = new uint256[](5);

    values[0] = s.getUintByKeys(ProtoUtilV1.NS_COVER_FEE, key);
    values[1] = s.getUintByKeys(ProtoUtilV1.NS_COVER_STAKE, key);
    values[2] = s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY, key);
    values[3] = s.getUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key);

    values[4] = _getClaimable(s, key);
  }

  function getStakingContract(IStore s) public view returns (ICoverStake) {
    return ICoverStake(ProtoUtilV1.getContract(s, ProtoUtilV1.CNAME_COVER_STAKE));
  }

  function getCTokenFactory(IStore s) public view returns (ICTokenFactory) {
    return ICTokenFactory(ProtoUtilV1.getContract(s, ProtoUtilV1.CNAME_CTOKEN_FACTORY));
  }

  function getPolicyContract(IStore s) public view returns (IPolicy) {
    return IPolicy(ProtoUtilV1.getContract(s, ProtoUtilV1.CNAME_POLICY));
  }

  function getAssuranceContract(IStore s) public view returns (ICoverAssurance) {
    return ICoverAssurance(ProtoUtilV1.getContract(s, ProtoUtilV1.CNAME_COVER_ASSURANCE));
  }

  function getVault(IStore s, bytes32 key) public view returns (IVault) {
    address vault = s.getAddressByKeys(ProtoUtilV1.NS_COVER_VAULT, key);
    return IVault(vault);
  }

  function getVaultFactoryContract(IStore s) public view returns (IVaultFactory) {
    address factory = ProtoUtilV1.getContract(s, ProtoUtilV1.CNAME_VAULT_FACTORY);
    return IVaultFactory(factory);
  }

  function _getCoverOwner(IStore s, bytes32 key) private view returns (address) {
    return s.getAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, key);
  }

  function _getClaimable(IStore s, bytes32 key) private view returns (uint256) {
    // Todo: deduct the expired cover amounts
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_CLAIMABLE, key);
  }

  function _getStatus(IStore s, bytes32 key) private view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_STATUS, key);
  }
}
