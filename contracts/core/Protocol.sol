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
   * @param values[0] coverCreationFee
   * @param values[1] minCoverCreationStake
   * @param values[2] firstReportingStake
   * @param values[3] claimPeriod
   * @param values[4] reportingBurnRate
   * @param values[5] governanceReporterCommission
   * @param values[6] claimPlatformFee
   * @param values[7] claimReporterCommission
   * @param values[8] flashLoanFee
   * @param values[9] flashLoanFeeProtocol
   * @param values[10] resolutionCoolDownPeriod
   * @param values[11] state and liquidity update interval
   * @param values[12] max lending ratio
   */
  function initialize(address[] calldata addresses, uint256[] calldata values) external override nonReentrant whenNotPaused {
    // @suppress-initialization Can only be initialized by the deployer or an admin
    // @suppress-acl Can only be called by the deployer or an admin
    // @suppress-zero-value-check Some zero values are allowed
    s.mustBeProtocolMember(msg.sender);

    require(addresses[0] != address(0), "Invalid Burner");
    require(addresses[1] != address(0), "Invalid Uniswap V2 Router");
    require(addresses[2] != address(0), "Invalid Uniswap V2 Factory");
    // require(addresses[3] != address(0), "Invalid NPM"); // @note: validation below
    require(addresses[4] != address(0), "Invalid Treasury");
    // @suppress-accidental-zero @todo: allow price oracle to be zero
    // @check if uniswap v2 contracts can be zero
    require(addresses[5] != address(0), "Invalid NPM Price Oracle");

    // These checks are disabled as this function is only accessible to an admin
    // require(values[0] > 0, "Invalid cover creation fee");
    // require(values[1] > 0, "Invalid cover creation stake");
    // require(values[2] > 0, "Invalid first reporting stake");
    // require(values[3] > 0, "Invalid claim period");
    // require(values[4] > 0, "Invalid reporting burn rate");
    // require(values[5] > 0, "Invalid reporter income: NPM");
    // require(values[6] > 0, "Invalid platform fee: claims");
    // require(values[7] > 0, "Invalid reporter income: claims");
    // require(values[8] > 0, "Invalid vault fee: flashloan");
    // require(values[9] > 0, "Invalid platform fee: flashloan");
    // require(values[10] >= 24 hours, "Invalid cooldown period");
    // require(values[11] > 0, "Invalid state update interval");
    // require(values[12] > 0, "Invalid max lending ratio");

    if (initialized == 1) {
      AccessControlLibV1.mustBeAdmin(s);
      require(addresses[3] == address(0), "Can't change NPM");
    } else {
      require(addresses[3] != address(0), "Invalid NPM");

      s.setAddressByKey(ProtoUtilV1.CNS_CORE, address(this));
      s.setBoolByKeys(ProtoUtilV1.NS_CONTRACTS, address(this), true);

      s.setAddressByKey(ProtoUtilV1.CNS_NPM, addresses[3]);
    }

    // @note: burner isn't necessarily the zero address.
    // The tokens to be burned are sent to an address,
    // bridged back to the Ethereum mainnet (if on a different chain),
    // and burned on a period but random basis.
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
    s.setUintByKey(ProtoUtilV1.NS_COVER_PLATFORM_FEE, values[6]);
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

  /**
   * @dev Adds member to the protocol
   *
   * A member is a trusted EOA or a contract that was added to the protocol using `addContract`
   * function. When a contract is removed using `upgradeContract` function, the membership of previous
   * contract is also removed.
   *
   * Warning:
   *
   * This feature is only accessible to an upgrade agent.
   * Since adding member to the protocol is a highy risky activity,
   * the role `Upgrade Agent` is considered to be one of the most `Critical` roles.
   *
   * Using Tenderly War Rooms/Web3 Actions or OZ Defender, the protocol needs to be paused
   * when this function is invoked.
   *
   *
   * @param member Enter an address to add as a protocol member
   */
  function addMember(address member) external override nonReentrant whenNotPaused {
    // @suppress-address-trust-issue Can be trusted because this can only come from upgrade agents.
    s.mustNotBePaused();
    AccessControlLibV1.mustBeUpgradeAgent(s);

    AccessControlLibV1.addMemberInternal(s, member);
    emit MemberAdded(member);
  }

  /**
   * @dev Removes a member from the protocol. This function is only accessible
   * to an upgrade agent.
   *
   * @param member Enter an address to remove as a protocol member
   */
  function removeMember(address member) external override nonReentrant whenNotPaused {
    // @suppress-address-trust-issue Can be trusted because this can only come from upgrade agents.
    ProtoUtilV1.mustBeProtocolMember(s, member);
    s.mustNotBePaused();
    AccessControlLibV1.mustBeUpgradeAgent(s);

    AccessControlLibV1.removeMemberInternal(s, member);
    emit MemberRemoved(member);
  }

  /**
   * @dev Adds a contract to the protocol. See `addContractWithKey` for more info.
   */
  function addContract(bytes32 namespace, address contractAddress) external override {
    // @suppress-acl @suppress-pausable This function is just an intermediate
    addContractWithKey(namespace, 0, contractAddress);
  }

  /**
   * @dev Adds a contract to the protocol using a namespace and key.
   *
   * The contracts that are added using this function are also added as protocol members.
   * Each contract you add to the protocol needs to also specify the namespace and also
   * key if applicable. The key is useful when multiple instances of a contract can
   * be deployed. For example, multiple instances of cxTokens and Vaults can be deployed on demand.
   *
   * Tip: find out how the `getVaultFactoryContract().deploy` function is being used.
   *
   * Warning:
   *
   * This feature is only accessible to an upgrade agent.
   * Since adding member to the protocol is a highy risky activity,
   * the role `Upgrade Agent` is considered to be one of the most `Critical` roles.
   *
   * Using Tenderly War Rooms/Web3 Actions or OZ Defender, the protocol needs to be paused
   * when this function is invoked.
   *
   * @param namespace Enter a unique namespace for this contract
   * @param key Enter a key if this contract has siblings
   * @param contractAddress Enter the contract address to add.
   *
   */
  function addContractWithKey(
    bytes32 namespace,
    bytes32 key,
    address contractAddress
  ) public override nonReentrant whenNotPaused {
    // @suppress-address-trust-issue Although the `contractAddress` can't be trusted, the upgrade admin has to check the contract code manually.
    require(contractAddress != address(0), "Invalid contract");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeUpgradeAgent(s);
    address current = s.getProtocolContract(namespace);

    require(current == address(0), "Please upgrade contract");

    AccessControlLibV1.addContractInternal(s, namespace, key, contractAddress);
    emit ContractAdded(namespace, key, contractAddress);
  }

  /**
   * @dev Upgrades a contract at the given namespace. See `upgradeContractWithKey` for more info.
   */
  function upgradeContract(
    bytes32 namespace,
    address previous,
    address current
  ) external override {
    // @suppress-acl @suppress-pausable  This function is just an intermediate
    upgradeContractWithKey(namespace, 0, previous, current);
  }

  /**
   * @dev Upgrades a contract at the given namespace and key.
   *
   * The previous contract's protocol membership is revoked and
   * the current immediately starts assuming responsbility of
   * whatever the contract needs to do at the supplied namespace and key.
   *
   * Warning:
   *
   * This feature is only accessible to an upgrade agent.
   * Since adding member to the protocol is a highy risky activity,
   * the role `Upgrade Agent` is considered to be one of the most `Critical` roles.
   *
   * Using Tenderly War Rooms/Web3 Actions or OZ Defender, the protocol needs to be paused
   * when this function is invoked.
   *
   * @param namespace Enter a unique namespace for this contract
   * @param key Enter a key if this contract has siblings
   * @param previous Enter the existing contract address at this namespace and key.
   * @param current Enter the contract address which will replace the previous contract.
   */
  function upgradeContractWithKey(
    bytes32 namespace,
    bytes32 key,
    address previous,
    address current
  ) public override nonReentrant whenNotPaused {
    require(current != address(0), "Invalid contract");

    ProtoUtilV1.mustBeProtocolMember(s, previous);
    s.mustNotBePaused();
    AccessControlLibV1.mustBeUpgradeAgent(s);

    // @suppress-address-trust-issue Checked. Can only be assigned by an upgrade agent.
    AccessControlLibV1.upgradeContractInternal(s, namespace, key, previous, current);
    emit ContractUpgraded(namespace, key, previous, current);
  }

  /**
   * @dev Grants roles to the protocol.
   *
   * Individual Neptune Mutual protocol contracts inherit roles
   * defined to this contract. Meaning, the `AccessControl` logic
   * here is used everywhere else.
   *
   *
   * Warning:
   *
   * This feature is only accessible to an admin. Adding any kind of role to the protocol is immensely risky.
   *
   * Using Tenderly War Rooms/Web3 Actions or OZ Defender, the protocol needs to be paused
   * when this function is invoked.
   *
   */
  function grantRoles(AccountWithRoles[] calldata detail) external override nonReentrant whenNotPaused {
    // @suppress-zero-value-check Checked
    require(detail.length > 0, "Invalid args");
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
