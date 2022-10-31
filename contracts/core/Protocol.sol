// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./ProtoBase.sol";
import "../interfaces/IStore.sol";
import "../interfaces/IProtocol.sol";

contract Protocol is IProtocol, ProtoBase {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;

  bool public initialized = false;

  constructor(IStore store) ProtoBase(store) {} // solhint-disable-line

  /**
   * @dev Initializes the protocol once. There is only one instance of the protocol
   * that can function.
   *
   * @custom:suppress-acl Can only be called by the deployer or an admin
   * @custom:suppress-initialization Can only be initialized by the deployer or an admin
   * @custom:note Burner isn't necessarily the zero address. The tokens to be burned are sent to an address,
   * bridged back to the Ethereum mainnet (if on a different chain), and burned on a period but random basis.
   *
   */
  // solhint-disable-next-line function-max-lines
  function initialize(InitializeArgs calldata args) external override nonReentrant whenNotPaused {
    require(args.burner != address(0), "Invalid Burner");
    require(args.treasury != address(0), "Invalid Treasury");

    if (initialized == true) {
      AccessControlLibV1.mustBeAdmin(s);
      require(args.npm == address(0), "Can't change NPM");
    } else {
      s.mustBeProtocolMember(msg.sender);
      require(args.npm != address(0), "Invalid NPM");

      s.setAddressByKey(ProtoUtilV1.CNS_CORE, address(this));
      s.setBoolByKeys(ProtoUtilV1.NS_CONTRACTS, address(this), true);

      s.setAddressByKey(ProtoUtilV1.CNS_NPM, args.npm);

      s.deleteBoolByKeys(ProtoUtilV1.NS_MEMBERS, msg.sender);
      emit MemberRemoved(msg.sender);
    }

    require(args.reportingBurnRate + args.governanceReporterCommission <= ProtoUtilV1.MULTIPLIER, "Invalid gov burn/commission rate");

    s.setAddressByKey(ProtoUtilV1.CNS_BURNER, args.burner);

    s.setAddressByKey(ProtoUtilV1.CNS_UNISWAP_V2_ROUTER, args.uniswapV2RouterLike);
    s.setAddressByKey(ProtoUtilV1.CNS_UNISWAP_V2_FACTORY, args.uniswapV2FactoryLike);
    s.setAddressByKey(ProtoUtilV1.CNS_TREASURY, args.treasury);
    s.setAddressByKey(ProtoUtilV1.CNS_NPM_PRICE_ORACLE, args.priceOracle);

    s.setUintByKey(ProtoUtilV1.NS_COVER_CREATION_FEE, args.coverCreationFee);
    s.setUintByKey(ProtoUtilV1.NS_COVER_CREATION_MIN_STAKE, args.minCoverCreationStake);
    s.setUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_MIN_STAKE, args.minStakeToAddLiquidity);
    s.setUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, args.firstReportingStake);
    s.setUintByKey(ProtoUtilV1.NS_CLAIM_PERIOD, args.claimPeriod);
    s.setUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_BURN_RATE, args.reportingBurnRate);
    s.setUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTER_COMMISSION, args.governanceReporterCommission);
    s.setUintByKey(ProtoUtilV1.NS_COVER_PLATFORM_FEE, args.claimPlatformFee);
    s.setUintByKey(ProtoUtilV1.NS_CLAIM_REPORTER_COMMISSION, args.claimReporterCommission);
    s.setUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_FLASH_LOAN_FEE, args.flashLoanFee);
    s.setUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_FLASH_LOAN_FEE_PROTOCOL, args.flashLoanFeeProtocol);
    s.setUintByKey(ProtoUtilV1.NS_RESOLUTION_COOL_DOWN_PERIOD, args.resolutionCoolDownPeriod);
    s.setUintByKey(ProtoUtilV1.NS_LIQUIDITY_STATE_UPDATE_INTERVAL, args.stateUpdateInterval);
    s.setUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_MAX_LENDING_RATIO, args.maxLendingRatio);
    s.setUintByKey(ProtoUtilV1.NS_COVERAGE_LAG, 1 days);

    initialized = true;

    emit Initialized(args);
  }

  /**
   * @dev Adds member to the protocol
   *
   * A member is a trusted EOA or a contract that was added to the protocol using `addContract`
   * function. When a contract is removed using `upgradeContract` function, the membership of previous
   * contract is also removed.
   *
   * @custom:warning Warning:
   *
   * This feature is only accessible to an upgrade agent.
   * Since adding member to the protocol is a highly risky activity,
   * the role `Upgrade Agent` is considered to be one of the most `Critical` roles.
   *
   * @custom:suppress-address-trust-issue The address `member` can be trusted because this can only come from upgrade agents.
   *
   * @param member Enter an address to add as a protocol member
   */
  function addMember(address member) external override nonReentrant whenNotPaused {
    AccessControlLibV1.mustBeUpgradeAgent(s);

    AccessControlLibV1.addMemberInternal(s, member);
    emit MemberAdded(member);
  }

  /**
   * @dev Removes a member from the protocol. This function is only accessible
   * to an upgrade agent.
   *
   * @custom:suppress-address-trust-issue The address `member` can be trusted because of the ACL requirement.
   *
   * @param member Enter an address to remove as a protocol member
   */
  function removeMember(address member) external override nonReentrant whenNotPaused {
    ProtoUtilV1.mustBeProtocolMember(s, member);
    AccessControlLibV1.mustBeUpgradeAgent(s);

    AccessControlLibV1.removeMemberInternal(s, member);
    emit MemberRemoved(member);
  }

  /**
   * @dev Adds a contract to the protocol. See `addContractWithKey` for more info.
   * @custom:suppress-acl This function is just an intermediate
   * @custom:suppress-pausable This function is just an intermediate
   */
  function addContract(bytes32 namespace, address contractAddress) external override {
    addContractWithKey(namespace, ProtoUtilV1.KEY_INTENTIONALLY_EMPTY, contractAddress);
  }

  function addContracts(
    bytes32[] calldata namespaces,
    bytes32[] calldata keys,
    address[] calldata contractAddresses
  ) external override {
    require(namespaces.length > 0, "Please provide namespaces");
    require(namespaces.length == contractAddresses.length, "Invalid args");
    require(namespaces.length == keys.length, "Invalid args");

    for (uint256 i = 0; i < namespaces.length; i++) {
      addContractWithKey(namespaces[i], keys[i], contractAddresses[i]);
    }
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
   * @custom:warning Warning:
   *
   * This feature is only accessible to an upgrade agent.
   * Since adding member to the protocol is a highly risky activity,
   * the role `Upgrade Agent` is considered to be one of the most `Critical` roles.
   *
   * @custom:suppress-address-trust-issue Although the `contractAddress` can't be trusted,
   * an upgrade admin has to check the contract code manually.
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
    require(contractAddress != address(0), "Invalid contract");

    AccessControlLibV1.mustBeUpgradeAgent(s);
    address current = s.getProtocolContract(namespace);

    require(current == address(0), "Please upgrade contract");

    AccessControlLibV1.addContractInternal(s, namespace, key, contractAddress);
    emit ContractAdded(namespace, key, contractAddress);
  }

  /**
   * @dev Upgrades a contract at the given namespace. See `upgradeContractWithKey` for more info.
   *
   * @custom:suppress-acl This function is just an intermediate
   * @custom:suppress-pausable This function is just an intermediate
   *
   */
  function upgradeContract(
    bytes32 namespace,
    address previous,
    address current
  ) external override {
    upgradeContractWithKey(namespace, ProtoUtilV1.KEY_INTENTIONALLY_EMPTY, previous, current);
  }

  /**
   * @dev Upgrades a contract at the given namespace and key.
   *
   * The previous contract's protocol membership is revoked and
   * the current immediately starts assuming responsibility of
   * whatever the contract needs to do at the supplied namespace and key.
   *
   * @custom:warning Warning:
   *
   * This feature is only accessible to an upgrade agent.
   * Since adding member to the protocol is a highly risky activity,
   * the role `Upgrade Agent` is considered to be one of the most `Critical` roles.
   *
   * @custom:suppress-address-trust-issue Can only be invoked by an upgrade agent.
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
    ProtoUtilV1.mustBeExactContract(s, namespace, key, previous);
    AccessControlLibV1.mustBeUpgradeAgent(s);

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
   * @custom:warning Warning:
   * @custom:suppress-acl Can only be called by a role admin of the specified role(s)
   *
   */
  function grantRoles(AccountWithRoles[] calldata detail) external override nonReentrant whenNotPaused {
    // @suppress-zero-value-check Checked
    require(detail.length > 0, "Invalid args");

    for (uint256 i = 0; i < detail.length; i++) {
      for (uint256 j = 0; j < detail[i].roles.length; j++) {
        super.grantRole(detail[i].roles[j], detail[i].account);
      }
    }
  }

  /**
   * @dev Grants `role` to `account`.
   *
   * If `account` had not been already granted `role`, emits a {RoleGranted}
   * event.
   *
   * Requirements:
   *
   * - the caller must have ``role``'s admin role.
   * @custom:suppress-acl Check the ACL of the base function
   */
  function grantRole(bytes32 role, address account) public override(AccessControl, IAccessControl) whenNotPaused {
    super.grantRole(role, account);
  }

  /**
   * @dev Revokes `role` from `account`.
   *
   * If `account` had been granted `role`, emits a {RoleRevoked} event.
   *
   * Requirements:
   *
   * - the caller must have ``role``'s admin role.
   * @custom:suppress-acl Check the ACL of the base function
   */
  function revokeRole(bytes32 role, address account) public override(AccessControl, IAccessControl) whenNotPaused {
    super.revokeRole(role, account);
  }

  /**
   * @dev Revokes `role` from the calling account.
   *
   * Roles are often managed via {grantRole} and {revokeRole}: this function's
   * purpose is to provide a mechanism for accounts to lose their privileges
   * if they are compromised (such as when a trusted device is misplaced).
   *
   * If the calling account had been revoked `role`, emits a {RoleRevoked}
   * event.
   *
   * Requirements:
   *
   * - the caller must be `account`.
   * @custom:suppress-acl Check the ACL of the base function
   */
  function renounceRole(bytes32 role, address account) public override(AccessControl, IAccessControl) whenNotPaused {
    super.renounceRole(role, account);
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
