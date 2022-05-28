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
  using RegistryLibV1 for IStore;
  using ProtoUtilV1 for IStore;
  using ValidationLibV1 for IStore;
  using StoreKeyUtil for IStore;

  uint256 public initialized = 0;

  constructor(IStore store) ProtoBase(store) {} // solhint-disable-line

  /**
   * @dev Initializes the protocol
   * @param addresses[0] burner
   * @param addresses[1] uniswapV2RouterLike
   * @param addresses[2] uniswapV2FactoryLike
   * @param addresses[3] npm
   * @param addresses[4] treasury
   * @param addresses[5] npm price oracle
   * @param values[0] coverCreationFees
   * @param values[1] minCoverCreationStake
   * @param values[2] firstReportingStake
   * @param values[3] claimPeriod
   * @param values[4] burnRate
   * @param values[5] governanceReporterCommission
   * @param values[6] claimPlatformFee
   * @param values[7] claimReporterCommission
   * @param values[8] flashLoanFee
   * @param values[9] flashLoanFeeProtocol
   * @param values[10] resolutionCoolDownPeriod
   * @param values[11] state and liquidity update interval
   * @param values[12] max lending ratio
   */
  function initialize(address[] memory addresses, uint256[] memory values) external override nonReentrant whenNotPaused {
    // @suppress-initialization Can only be initialized by the deployer or an admin
    // @suppress-acl Can only be called by the deployer or an admin
    s.mustBeProtocolMember(msg.sender);

    if (initialized == 1) {
      AccessControlLibV1.mustBeAdmin(s);
      require(addresses[3] == address(0), "Can't change NPM");
    } else {
      require(addresses[3] != address(0), "Invalid NPM");

      s.setAddressByKey(ProtoUtilV1.CNS_CORE, address(this));
      s.setBoolByKeys(ProtoUtilV1.NS_CONTRACTS, address(this), true);

      s.setAddressByKey(ProtoUtilV1.CNS_NPM, addresses[3]);
    }

    require(addresses[0] != address(0), "Invalid Burner");
    require(addresses[1] != address(0), "Invalid Uniswap V2 Router");
    require(addresses[2] != address(0), "Invalid Uniswap V2 Factory");
    require(addresses[4] != address(0), "Invalid Treasury");
    require(addresses[5] != address(0), "Invalid NPM Price Oracle");

    s.setAddressByKey(ProtoUtilV1.CNS_BURNER, addresses[0]);

    s.setAddressByKey(ProtoUtilV1.CNS_UNISWAP_V2_ROUTER, addresses[1]);
    s.setAddressByKey(ProtoUtilV1.CNS_UNISWAP_V2_FACTORY, addresses[2]);
    s.setAddressByKey(ProtoUtilV1.CNS_TREASURY, addresses[4]);
    s.setAddressByKey(ProtoUtilV1.CNS_NPM_PRICE_ORACLE, addresses[5]);

    s.setUintByKey(ProtoUtilV1.NS_COVER_CREATION_FEE, values[0]);
    s.setUintByKey(ProtoUtilV1.NS_COVER_CREATION_MIN_STAKE, values[1]);
    s.setUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, values[2]);
    s.setUintByKey(ProtoUtilV1.NS_CLAIM_PERIOD, values[3]);
    s.setUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_BURN_RATE, values[4]);
    s.setUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTER_COMMISSION, values[5]);
    s.setUintByKey(ProtoUtilV1.NS_CLAIM_PLATFORM_FEE, values[6]);
    s.setUintByKey(ProtoUtilV1.NS_CLAIM_REPORTER_COMMISSION, values[7]);
    s.setUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_FLASH_LOAN_FEE, values[8]);
    s.setUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_FLASH_LOAN_FEE_PROTOCOL, values[9]);
    s.setUintByKey(ProtoUtilV1.NS_RESOLUTION_COOL_DOWN_PERIOD, values[10]);
    s.setUintByKey(ProtoUtilV1.NS_LIQUIDITY_STATE_UPDATE_INTERVAL, values[11]);
    s.setUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_MAX_LENDING_RATIO, values[12]);
    s.setUintByKey(ProtoUtilV1.NS_COVERAGE_LAG, 1 days);

    initialized = 1;
    emit Initialized(addresses, values);
  }

  function upgradeContract(
    bytes32 namespace,
    address previous,
    address current
  ) external override {
    upgradeContractWithKey(namespace, 0, previous, current);
  }

  function upgradeContractWithKey(
    bytes32 namespace,
    bytes32 key,
    address previous,
    address current
  ) public override nonReentrant {
    ProtoUtilV1.mustBeProtocolMember(s, previous);
    s.mustNotBePaused();
    AccessControlLibV1.mustBeUpgradeAgent(s);

    // @suppress-address-trust-issue Checked. Can only be assigned by an upgrade agent.
    AccessControlLibV1.upgradeContractInternal(s, namespace, key, previous, current);
    emit ContractUpgraded(namespace, key, previous, current);
  }

  function addContract(bytes32 namespace, address contractAddress) external override {
    addContractWithKey(namespace, 0, contractAddress);
  }

  function addContractWithKey(
    bytes32 namespace,
    bytes32 key,
    address contractAddress
  ) public override nonReentrant {
    // @suppress-address-trust-issue Although the `contractAddress` can't be trusted, the upgrade admin has to check the contract code manually.
    s.mustNotBePaused();
    AccessControlLibV1.mustBeUpgradeAgent(s);
    address current = s.getProtocolContract(namespace);

    require(current == address(0), "Please upgrade contract");

    AccessControlLibV1.addContractInternal(s, namespace, key, contractAddress);
    emit ContractAdded(namespace, key, contractAddress);
  }

  function removeMember(address member) external override nonReentrant {
    // @suppress-address-trust-issue Can be trusted because this can only come from upgrade agents.
    ProtoUtilV1.mustBeProtocolMember(s, member);
    s.mustNotBePaused();
    AccessControlLibV1.mustBeUpgradeAgent(s);

    AccessControlLibV1.removeMemberInternal(s, member);
    emit MemberRemoved(member);
  }

  function addMember(address member) external override nonReentrant {
    // @suppress-address-trust-issue Can be trusted because this can only come from upgrade agents.
    s.mustNotBePaused();
    AccessControlLibV1.mustBeUpgradeAgent(s);

    AccessControlLibV1.addMemberInternal(s, member);
    emit MemberAdded(member);
  }

  function grantRoles(AccountWithRoles[] memory detail) external override nonReentrant {
    AccessControlLibV1.mustBeAdmin(s);

    for (uint256 i = 0; i < detail.length; i++) {
      for (uint256 j = 0; j < detail[i].roles.length; j++) {
        _grantRole(detail[i].roles[j], detail[i].account);
      }
    }
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
    return ProtoUtilV1.CNAME_PROTOCOL;
  }
}
