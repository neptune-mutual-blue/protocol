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

  /**
   * @dev Initializes the protocol
   * @param addresses[0] burner
   * @param addresses[1] uniswapV2RouterLike
   * @param addresses[2] npm
   * @param addresses[3] treasury
   * @param addresses[4] reassuranceVault
   * @param values[0] coverCreationFees
   * @param values[1] minCoverCreationStake
   * @param values[2] firstReportingStake
   * @param values[3] minLiquidityPeriod
   * @param values[4] claimPeriod
   * @param values[5] burnRate
   * @param values[6] governanceReporterCommission
   * @param values[7] claimPlatformFee
   * @param values[8] claimReporterCommission
   */
  function initialize(address[] memory addresses, uint256[] memory values) external override whenNotPaused {
    // @suppress-reentrancy Can only be initialized once and only by a protocol member
    // @suppress-acl Can only be called once by the deployer
    s.mustBeProtocolMember(msg.sender);

    require(initialized == 0, "Already initialized");
    initialized = 1;

    require(addresses[0] != address(0), "Invalid Burner");
    require(addresses[1] != address(0), "Invalid Router");
    require(addresses[2] != address(0), "Invalid NPM");
    require(addresses[3] != address(0), "Invalid Treasury");
    require(addresses[4] != address(0), "Invalid Vault");

    s.setAddressByKey(ProtoUtilV1.CNS_CORE, address(this));
    s.setBoolByKeys(ProtoUtilV1.NS_CONTRACTS, address(this), true);
    s.setAddressByKey(ProtoUtilV1.CNS_BURNER, addresses[0]);

    s.setAddressByKey(ProtoUtilV1.CNS_UNISWAP_V2_ROUTER, addresses[1]);
    s.setAddressByKey(ProtoUtilV1.CNS_NPM, addresses[2]);
    s.setAddressByKey(ProtoUtilV1.CNS_TREASURY, addresses[3]);
    s.setAddressByKey(ProtoUtilV1.CNS_REASSURANCE_VAULT, addresses[4]);

    s.setUintByKey(ProtoUtilV1.NS_COVER_CREATION_FEE, values[0]);
    s.setUintByKey(ProtoUtilV1.NS_COVER_CREATION_MIN_STAKE, values[1]);
    s.setUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, values[2]);
    s.setUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_MIN_PERIOD, values[3]);
    s.setUintByKey(ProtoUtilV1.NS_CLAIM_PERIOD, values[4]);
    s.setUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_BURN_RATE, values[5]);
    s.setUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTER_COMMISSION, values[6]);
    s.setUintByKey(ProtoUtilV1.NS_CLAIM_PLATFORM_FEE, values[7]);
    s.setUintByKey(ProtoUtilV1.NS_CLAIM_REPORTER_COMMISSION, values[8]);

    emit Initialized(addresses, values);
  }

  function upgradeContract(
    bytes32 namespace,
    address previous,
    address current
  ) external override nonReentrant {
    ProtoUtilV1.mustBeProtocolMember(s, previous);
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeUpgradeAgent(s);

    // @suppress-address-trust-issue Checked
    s.upgradeContract(namespace, previous, current);
    emit ContractUpgraded(namespace, previous, current);
  }

  function addContract(bytes32 namespace, address contractAddress) external override nonReentrant {
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeUpgradeAgent(s);

    s.addContract(namespace, contractAddress);
    emit ContractAdded(namespace, contractAddress);
  }

  function removeMember(address member) external override nonReentrant {
    ProtoUtilV1.mustBeProtocolMember(s, member);
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeUpgradeAgent(s);

    s.removeMember(member);
    emit MemberRemoved(member);
  }

  function addMember(address member) external override nonReentrant {
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
  function getName() external pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_POLICY_MANAGER;
  }
}
