// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../interfaces/IStore.sol";
import "../interfaces/IProtocol.sol";
import "../libraries/ProtoUtilV1.sol";
import "../libraries/StoreKeyUtil.sol";
import "./ProtoBase.sol";

contract Protocol is IProtocol, ProtoBase {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;

  uint256 public initialized = 0;

  constructor(IStore store) ProtoBase(store) {} // solhint-disable-line

  function initialize(
    address uniswapV2RouterLike,
    address npm,
    address treasury,
    address assuranceVault,
    uint256 coverFee,
    uint256 minStake,
    uint256 minReportingStake,
    uint256 minLiquidityPeriod,
    uint256 claimPeriod,
    uint256 burnRate,
    uint256 reporterCommission
  ) external {
    s.mustBeProtocolMember(msg.sender);

    require(initialized == 0, "Already initialized");
    require(npm != address(0), "Invalid NPM");
    require(uniswapV2RouterLike != address(0), "Invalid Router");
    require(treasury != address(0), "Invalid Treasury");
    require(assuranceVault != address(0), "Invalid Vault");

    s.setAddressByKey(ProtoUtilV1.NS_CORE, address(this));
    s.setBoolByKeys(ProtoUtilV1.NS_CONTRACTS, address(this), true);
    s.setAddressByKey(ProtoUtilV1.NS_BURNER, 0x0000000000000000000000000000000000000001);

    s.setAddressByKey(ProtoUtilV1.NS_SETUP_NPM, npm);
    s.setAddressByKey(ProtoUtilV1.NS_SETUP_UNISWAP_V2_ROUTER, uniswapV2RouterLike);
    s.setAddressByKey(ProtoUtilV1.NS_TREASURY, treasury);
    s.setAddressByKey(ProtoUtilV1.NS_ASSURANCE_VAULT, assuranceVault);

    _setCoverFees(coverFee);
    _setMinStake(minStake);
    _setMinReportingStake(minReportingStake);
    _setMinLiquidityPeriod(minLiquidityPeriod);

    _setReportingBurnRate(burnRate);
    _setReporterCommission(reporterCommission);
    _setClaimPeriod(claimPeriod);

    initialized = 1;
  }

  function setReportingBurnRate(uint256 value) public nonReentrant {
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeCoverManager(s);
    _setReportingBurnRate(value);
  }

  function setReportingCommission(uint256 value) public nonReentrant {
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeCoverManager(s);
    _setReporterCommission(value);
  }

  function setClaimPeriod(uint256 value) public nonReentrant {
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeCoverManager(s);
    _setClaimPeriod(value);
  }

  function setCoverFees(uint256 value) public nonReentrant {
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeCoverManager(s);
    _setCoverFees(value);
  }

  function setMinStake(uint256 value) public nonReentrant {
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeCoverManager(s);

    _setMinStake(value);
  }

  function setMinReportingStake(uint256 value) public nonReentrant {
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeCoverManager(s);
    _setMinReportingStake(value);
  }

  function setMinLiquidityPeriod(uint256 value) public nonReentrant {
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeLiquidityManager(s);

    _setMinLiquidityPeriod(value);
  }

  function _setReportingBurnRate(uint256 value) private {
    uint256 previous = s.getUintByKey(ProtoUtilV1.NS_REPORTING_BURN_RATE);
    s.setUintByKey(ProtoUtilV1.NS_REPORTING_BURN_RATE, value);

    emit ReportingBurnRateSet(previous, value);
  }

  function _setReporterCommission(uint256 value) private {
    uint256 previous = s.getUintByKey(ProtoUtilV1.NS_REPORTER_COMMISSION);
    s.setUintByKey(ProtoUtilV1.NS_REPORTER_COMMISSION, value);

    emit ReporterCommissionSet(previous, value);
  }

  function _setClaimPeriod(uint256 value) private {
    uint256 previous = s.getUintByKey(ProtoUtilV1.NS_SETUP_CLAIM_PERIOD);
    s.setUintByKey(ProtoUtilV1.NS_SETUP_CLAIM_PERIOD, value);

    emit ClaimPeriodSet(previous, value);
  }

  function _setCoverFees(uint256 value) private {
    uint256 previous = s.getUintByKey(ProtoUtilV1.NS_SETUP_COVER_FEE);
    s.setUintByKey(ProtoUtilV1.NS_SETUP_COVER_FEE, value);

    emit CoverFeeSet(previous, value);
  }

  function _setMinStake(uint256 value) private {
    uint256 previous = s.getUintByKey(ProtoUtilV1.NS_SETUP_MIN_STAKE);
    s.setUintByKey(ProtoUtilV1.NS_SETUP_MIN_STAKE, value);

    emit MinStakeSet(previous, value);
  }

  function _setMinReportingStake(uint256 value) private {
    uint256 previous = s.getUintByKey(ProtoUtilV1.NS_SETUP_FIRST_REPORTING_STAKE);
    s.setUintByKey(ProtoUtilV1.NS_SETUP_FIRST_REPORTING_STAKE, value);

    emit MinReportingStakeSet(previous, value);
  }

  function _setMinLiquidityPeriod(uint256 value) private {
    uint256 previous = s.getUintByKey(ProtoUtilV1.NS_SETUP_MIN_LIQ_PERIOD);
    s.setUintByKey(ProtoUtilV1.NS_SETUP_MIN_LIQ_PERIOD, value);

    emit MinLiquidityPeriodSet(previous, value);
  }

  function upgradeContract(
    bytes32 namespace,
    address previous,
    address current
  ) external override {
    ProtoUtilV1.mustBeProtocolMember(s, previous);
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeUpgradeAgent(s);

    s.upgradeContract(namespace, previous, current);
    emit ContractUpgraded(namespace, previous, current);
  }

  function addContract(bytes32 namespace, address contractAddress) external override {
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeUpgradeAgent(s);

    s.addContract(namespace, contractAddress);
    emit ContractAdded(namespace, contractAddress);
  }

  function removeMember(address member) external override {
    ProtoUtilV1.mustBeProtocolMember(s, member);
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeUpgradeAgent(s);

    s.removeMember(member);
    emit MemberRemoved(member);
  }

  function addMember(address member) external override {
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeUpgradeAgent(s);

    s.addMember(member);
    emit MemberAdded(member);
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
    return "Neptune Mutual Protocol";
  }
}
