// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../interfaces/IStore.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./ProtoUtilV1.sol";
import "./StoreKeyUtil.sol";
import "./RegistryLibV1.sol";

library CoverUtilV1 {
  using RegistryLibV1 for IStore;
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;

  enum CoverStatus {
    Normal,
    Stopped,
    IncidentHappened,
    FalseReporting,
    Claimable
  }

  function getCoverOwner(IStore s, bytes32 key) external view returns (address) {
    return _getCoverOwner(s, key);
  }

  function _getCoverOwner(IStore s, bytes32 key) private view returns (address) {
    return s.getAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, key);
  }

  function getCoverFee(IStore s) external view returns (uint256 fee, uint256 minStake) {
    fee = s.getUintByKey(ProtoUtilV1.NS_COVER_CREATION_FEE);
    minStake = s.getUintByKey(ProtoUtilV1.NS_COVER_CREATION_MIN_STAKE);
  }

  function getMinCoverStake(IStore s) external view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_COVER_CREATION_MIN_STAKE);
  }

  function getMinLiquidityPeriod(IStore s) external view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_MIN_PERIOD);
  }

  function getClaimPeriod(IStore s) external view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_CLAIM_PERIOD);
  }

  /**
   * @dev Gets the current status of a given cover
   *
   * 0 - normal
   * 1 - stopped, can not purchase covers or add liquidity
   * 2 - reporting, incident happened
   * 3 - reporting, false reporting
   * 4 - claimable, claims accepted for payout
   *
   */
  function getCoverStatus(IStore s, bytes32 key) public view returns (CoverStatus) {
    return CoverStatus(getStatus(s, key));
  }

  function getStatus(IStore s, bytes32 key) public view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_STATUS, key);
  }

  /**
   * @dev Todo: Returns the values of the given cover key
   * @param _values[0] The total amount in the cover pool
   * @param _values[1] The total commitment amount
   * @param _values[2] The total amount of NPM provision
   * @param _values[3] NPM price
   * @param _values[4] The total amount of reassurance tokens
   * @param _values[5] Reassurance token price
   * @param _values[6] Reassurance pool weight
   */
  function getCoverPoolSummary(IStore s, bytes32 key) external view returns (uint256[] memory _values) {
    require(getCoverStatus(s, key) == CoverStatus.Normal, "Invalid cover");
    IPriceDiscovery discovery = s.getPriceDiscoveryContract();

    _values = new uint256[](7);

    _values[0] = s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY, key);
    _values[1] = s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_COMMITTED, key); // <-- Todo: liquidity commitment should expire as policies expire
    _values[2] = s.getUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key);
    _values[3] = discovery.getTokenPriceInStableCoin(address(s.npmToken()), 1 ether);
    _values[4] = s.getUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE, key);
    _values[5] = discovery.getTokenPriceInStableCoin(address(s.getAddressByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_TOKEN, key)), 1 ether);
    _values[6] = s.getUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_WEIGHT, key);
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

  function getLiquidity(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY, key);
  }

  function getStake(IStore s, bytes32 key) external view returns (uint256) {
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

    values[0] = s.getUintByKeys(ProtoUtilV1.NS_COVER_FEE_EARNING, key);
    values[1] = s.getUintByKeys(ProtoUtilV1.NS_COVER_STAKE, key);
    values[2] = s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY, key);
    values[3] = s.getUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key);

    values[4] = _getClaimable(s, key);
  }

  /**
   * @dev Sets the current status of a given cover
   *
   * 0 - normal
   * 1 - stopped, can not purchase covers or add liquidity
   * 2 - reporting, incident happened
   * 3 - reporting, false reporting
   * 4 - claimable, claims accepted for payout
   *
   */
  function setStatus(
    IStore s,
    bytes32 key,
    CoverStatus status
  ) external {
    s.setUintByKeys(ProtoUtilV1.NS_COVER_STATUS, key, uint256(status));
  }

  function _getClaimable(IStore s, bytes32 key) private view returns (uint256) {
    // Todo: deduct the expired cover amounts
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_CLAIMABLE, key);
  }
}
