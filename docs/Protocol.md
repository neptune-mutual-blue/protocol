# Protocol.sol

View Source: [\contracts\core\Protocol.sol](..\contracts\core\Protocol.sol)

**↗ Extends: [IProtocol](IProtocol.md), [ProtoBase](ProtoBase.md)**

**Protocol**

## Contract Members
**Constants & Variables**

```js
bool public initialized;

```

## Functions

- [constructor(IStore store)](#)
- [initialize(struct IProtocol.InitializeArgs args)](#initialize)
- [addMember(address member)](#addmember)
- [removeMember(address member)](#removemember)
- [addContract(bytes32 namespace, address contractAddress)](#addcontract)
- [addContractWithKey(bytes32 namespace, bytes32 key, address contractAddress)](#addcontractwithkey)
- [upgradeContract(bytes32 namespace, address previous, address current)](#upgradecontract)
- [upgradeContractWithKey(bytes32 namespace, bytes32 key, address previous, address current)](#upgradecontractwithkey)
- [grantRole(bytes32 role, address account)](#grantrole)
- [grantRoles(struct IProtocol.AccountWithRoles[] detail)](#grantroles)
- [version()](#version)
- [getName()](#getname)

### 

```solidity
function (IStore store) public nonpayable ProtoBase 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(IStore store) ProtoBase(store) {}
```
</details>

### initialize

Initializes the protocol once. There is only one instance of the protocol
 that can function.

```solidity
function initialize(struct IProtocol.InitializeArgs args) external nonpayable nonReentrant whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| args | struct IProtocol.InitializeArgs |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
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

    s.setAddressByKey(ProtoUtilV1.CNS_BURNER, args.burner);

    s.setAddressByKey(ProtoUtilV1.CNS_UNISWAP_V2_ROUTER, args.uniswapV2RouterLike);

    s.setAddressByKey(ProtoUtilV1.CNS_UNISWAP_V2_FACTORY, args.uniswapV2FactoryLike);

    s.setAddressByKey(ProtoUtilV1.CNS_TREASURY, args.treasury);

    s.setAddressByKey(ProtoUtilV1.CNS_NPM_PRICE_ORACLE, args.priceOracle);

    s.setUintByKey(ProtoUtilV1.NS_COVER_CREATION_FEE, args.coverCreationFee);

    s.setUintByKey(ProtoUtilV1.NS_COVER_CREATION_MIN_STAKE, args.minCoverCreationStake);

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
```
</details>

### addMember

Adds member to the protocol
 A member is a trusted EOA or a contract that was added to the protocol using `addContract`
 function. When a contract is removed using `upgradeContract` function, the membership of previous
 contract is also removed.

```solidity
function addMember(address member) external nonpayable nonReentrant whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| member | address | Enter an address to add as a protocol member | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addMember(address member) external override nonReentrant whenNotPaused {

    AccessControlLibV1.mustBeUpgradeAgent(s);

    AccessControlLibV1.addMemberInternal(s, member);

    emit MemberAdded(member);

  }
```
</details>

### removeMember

Removes a member from the protocol. This function is only accessible
 to an upgrade agent.

```solidity
function removeMember(address member) external nonpayable nonReentrant whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| member | address | Enter an address to remove as a protocol member | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeMember(address member) external override nonReentrant whenNotPaused {

    ProtoUtilV1.mustBeProtocolMember(s, member);

    AccessControlLibV1.mustBeUpgradeAgent(s);

    AccessControlLibV1.removeMemberInternal(s, member);

    emit MemberRemoved(member);

  }
```
</details>

### addContract

Adds a contract to the protocol. See `addContractWithKey` for more info.

```solidity
function addContract(bytes32 namespace, address contractAddress) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| namespace | bytes32 |  | 
| contractAddress | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addContract(bytes32 namespace, address contractAddress) external override {

    addContractWithKey(namespace, ProtoUtilV1.KEY_INTENTIONALLY_EMPTY, contractAddress);

  }
```
</details>

### addContractWithKey

Adds a contract to the protocol using a namespace and key.
 The contracts that are added using this function are also added as protocol members.
 Each contract you add to the protocol needs to also specify the namespace and also
 key if applicable. The key is useful when multiple instances of a contract can
 be deployed. For example, multiple instances of cxTokens and Vaults can be deployed on demand.
 Tip: find out how the `getVaultFactoryContract().deploy` function is being used.

```solidity
function addContractWithKey(bytes32 namespace, bytes32 key, address contractAddress) public nonpayable nonReentrant whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| namespace | bytes32 | Enter a unique namespace for this contract | 
| key | bytes32 | Enter a key if this contract has siblings | 
| contractAddress | address | Enter the contract address to add. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
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
```
</details>

### upgradeContract

Upgrades a contract at the given namespace. See `upgradeContractWithKey` for more info.

```solidity
function upgradeContract(bytes32 namespace, address previous, address current) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| namespace | bytes32 |  | 
| previous | address |  | 
| current | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function upgradeContract(

    bytes32 namespace,

    address previous,

    address current

  ) external override {

    upgradeContractWithKey(namespace, ProtoUtilV1.KEY_INTENTIONALLY_EMPTY, previous, current);

  }
```
</details>

### upgradeContractWithKey

Upgrades a contract at the given namespace and key.
 The previous contract's protocol membership is revoked and
 the current immediately starts assuming responsbility of
 whatever the contract needs to do at the supplied namespace and key.

```solidity
function upgradeContractWithKey(bytes32 namespace, bytes32 key, address previous, address current) public nonpayable nonReentrant whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| namespace | bytes32 | Enter a unique namespace for this contract | 
| key | bytes32 | Enter a key if this contract has siblings | 
| previous | address | Enter the existing contract address at this namespace and key. | 
| current | address | Enter the contract address which will replace the previous contract. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
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
```
</details>

### grantRole

Grants `role` to `account`.
 If `account` had not been already granted `role`, emits a {RoleGranted}
 event.
 Requirements:
 - the caller must have ``role``'s admin role.

```solidity
function grantRole(bytes32 role, address account) public nonpayable whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| role | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function grantRole(bytes32 role, address account) public override(AccessControl, IAccessControl) whenNotPaused {

    super.grantRole(role, account);

  }
```
</details>

### grantRoles

Grants roles to the protocol.
 Individual Neptune Mutual protocol contracts inherit roles
 defined to this contract. Meaning, the `AccessControl` logic
 here is used everywhere else.

```solidity
function grantRoles(struct IProtocol.AccountWithRoles[] detail) external nonpayable nonReentrant whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| detail | struct IProtocol.AccountWithRoles[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
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
```
</details>

### version

Version number of this contract

```solidity
function version() external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function version() external pure override returns (bytes32) {

    return "v0.1";

  }
```
</details>

### getName

Name of this contract

```solidity
function getName() external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getName() external pure override returns (bytes32) {

    return ProtoUtilV1.CNAME_PROTOCOL;

  }
```
</details>

## Contracts

* [AaveStrategy](AaveStrategy.md)
* [AccessControl](AccessControl.md)
* [AccessControlLibV1](AccessControlLibV1.md)
* [Address](Address.md)
* [BaseLibV1](BaseLibV1.md)
* [BokkyPooBahsDateTimeLibrary](BokkyPooBahsDateTimeLibrary.md)
* [BondPool](BondPool.md)
* [BondPoolBase](BondPoolBase.md)
* [BondPoolLibV1](BondPoolLibV1.md)
* [CompoundStrategy](CompoundStrategy.md)
* [Context](Context.md)
* [Cover](Cover.md)
* [CoverBase](CoverBase.md)
* [CoverLibV1](CoverLibV1.md)
* [CoverReassurance](CoverReassurance.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [cxToken](cxToken.md)
* [cxTokenFactory](cxTokenFactory.md)
* [cxTokenFactoryLibV1](cxTokenFactoryLibV1.md)
* [Delayable](Delayable.md)
* [Destroyable](Destroyable.md)
* [ERC165](ERC165.md)
* [ERC20](ERC20.md)
* [FakeAaveLendingPool](FakeAaveLendingPool.md)
* [FakeCompoundDaiDelegator](FakeCompoundDaiDelegator.md)
* [FakePriceOracle](FakePriceOracle.md)
* [FakeRecoverable](FakeRecoverable.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [FakeUniswapPair](FakeUniswapPair.md)
* [FakeUniswapV2FactoryLike](FakeUniswapV2FactoryLike.md)
* [FakeUniswapV2PairLike](FakeUniswapV2PairLike.md)
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [FaultyAaveLendingPool](FaultyAaveLendingPool.md)
* [FaultyCompoundDaiDelegator](FaultyCompoundDaiDelegator.md)
* [Finalization](Finalization.md)
* [ForceEther](ForceEther.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [IAaveV2LendingPoolLike](IAaveV2LendingPoolLike.md)
* [IAccessControl](IAccessControl.md)
* [IBondPool](IBondPool.md)
* [IClaimsProcessor](IClaimsProcessor.md)
* [ICompoundERC20DelegatorLike](ICompoundERC20DelegatorLike.md)
* [ICover](ICover.md)
* [ICoverReassurance](ICoverReassurance.md)
* [ICoverStake](ICoverStake.md)
* [ICxToken](ICxToken.md)
* [ICxTokenFactory](ICxTokenFactory.md)
* [IERC165](IERC165.md)
* [IERC20](IERC20.md)
* [IERC20Detailed](IERC20Detailed.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IERC3156FlashBorrower](IERC3156FlashBorrower.md)
* [IERC3156FlashLender](IERC3156FlashLender.md)
* [IFinalization](IFinalization.md)
* [IGovernance](IGovernance.md)
* [ILendingStrategy](ILendingStrategy.md)
* [ILiquidityEngine](ILiquidityEngine.md)
* [IMember](IMember.md)
* [InvalidStrategy](InvalidStrategy.md)
* [IPausable](IPausable.md)
* [IPolicy](IPolicy.md)
* [IPolicyAdmin](IPolicyAdmin.md)
* [IPriceOracle](IPriceOracle.md)
* [IProtocol](IProtocol.md)
* [IRecoverable](IRecoverable.md)
* [IReporter](IReporter.md)
* [IResolution](IResolution.md)
* [IResolvable](IResolvable.md)
* [IStakingPools](IStakingPools.md)
* [IStore](IStore.md)
* [IStoreLike](IStoreLike.md)
* [IUniswapV2FactoryLike](IUniswapV2FactoryLike.md)
* [IUniswapV2PairLike](IUniswapV2PairLike.md)
* [IUniswapV2RouterLike](IUniswapV2RouterLike.md)
* [IUnstakable](IUnstakable.md)
* [IVault](IVault.md)
* [IVaultDelegate](IVaultDelegate.md)
* [IVaultFactory](IVaultFactory.md)
* [IWitness](IWitness.md)
* [LiquidityEngine](LiquidityEngine.md)
* [MaliciousToken](MaliciousToken.md)
* [MockAccessControlUser](MockAccessControlUser.md)
* [MockCoverUtilUser](MockCoverUtilUser.md)
* [MockCxToken](MockCxToken.md)
* [MockCxTokenPolicy](MockCxTokenPolicy.md)
* [MockCxTokenStore](MockCxTokenStore.md)
* [MockFlashBorrower](MockFlashBorrower.md)
* [MockLiquidityEngineUser](MockLiquidityEngineUser.md)
* [MockProcessorStore](MockProcessorStore.md)
* [MockProcessorStoreLib](MockProcessorStoreLib.md)
* [MockProtocol](MockProtocol.md)
* [MockRegistryClient](MockRegistryClient.md)
* [MockStore](MockStore.md)
* [MockStoreKeyUtilUser](MockStoreKeyUtilUser.md)
* [MockValidationLibUser](MockValidationLibUser.md)
* [MockVault](MockVault.md)
* [MockVaultLibUser](MockVaultLibUser.md)
* [NPM](NPM.md)
* [NpmDistributor](NpmDistributor.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](NTransferUtilV2Intermediate.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Policy](Policy.md)
* [PolicyAdmin](PolicyAdmin.md)
* [PolicyHelperV1](PolicyHelperV1.md)
* [PoorMansERC20](PoorMansERC20.md)
* [POT](POT.md)
* [PriceLibV1](PriceLibV1.md)
* [Processor](Processor.md)
* [ProtoBase](ProtoBase.md)
* [Protocol](Protocol.md)
* [ProtoUtilV1](ProtoUtilV1.md)
* [Recoverable](Recoverable.md)
* [ReentrancyGuard](ReentrancyGuard.md)
* [RegistryLibV1](RegistryLibV1.md)
* [Reporter](Reporter.md)
* [Resolution](Resolution.md)
* [Resolvable](Resolvable.md)
* [RoutineInvokerLibV1](RoutineInvokerLibV1.md)
* [SafeERC20](SafeERC20.md)
* [StakingPoolBase](StakingPoolBase.md)
* [StakingPoolCoreLibV1](StakingPoolCoreLibV1.md)
* [StakingPoolInfo](StakingPoolInfo.md)
* [StakingPoolLibV1](StakingPoolLibV1.md)
* [StakingPoolReward](StakingPoolReward.md)
* [StakingPools](StakingPools.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
* [StrategyLibV1](StrategyLibV1.md)
* [Strings](Strings.md)
* [TimelockController](TimelockController.md)
* [Unstakable](Unstakable.md)
* [ValidationLibV1](ValidationLibV1.md)
* [Vault](Vault.md)
* [VaultBase](VaultBase.md)
* [VaultDelegate](VaultDelegate.md)
* [VaultDelegateBase](VaultDelegateBase.md)
* [VaultDelegateWithFlashLoan](VaultDelegateWithFlashLoan.md)
* [VaultFactory](VaultFactory.md)
* [VaultFactoryLibV1](VaultFactoryLibV1.md)
* [VaultLibV1](VaultLibV1.md)
* [VaultLiquidity](VaultLiquidity.md)
* [VaultStrategy](VaultStrategy.md)
* [WithFlashLoan](WithFlashLoan.md)
* [WithPausability](WithPausability.md)
* [WithRecovery](WithRecovery.md)
* [Witness](Witness.md)
