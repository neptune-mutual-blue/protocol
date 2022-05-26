# Protocol.sol

View Source: [contracts/core/Protocol.sol](../contracts/core/Protocol.sol)

**↗ Extends: [IProtocol](IProtocol.md), [ProtoBase](ProtoBase.md)**

**Protocol**

## Contract Members
**Constants & Variables**

```js
uint256 public initialized;

```

## Functions

- [constructor(IStore store)](#)
- [initialize(address[] addresses, uint256[] values)](#initialize)
- [upgradeContract(bytes32 namespace, address previous, address current)](#upgradecontract)
- [upgradeContractWithKey(bytes32 namespace, bytes32 key, address previous, address current)](#upgradecontractwithkey)
- [addContract(bytes32 namespace, address contractAddress)](#addcontract)
- [addContractWithKey(bytes32 namespace, bytes32 key, address contractAddress)](#addcontractwithkey)
- [removeMember(address member)](#removemember)
- [addMember(address member)](#addmember)
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

Initializes the protocol

```solidity
function initialize(address[] addresses, uint256[] values) external nonpayable nonReentrant whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| addresses | address[] | [0] burner | 
| values | uint256[] | [0] coverCreationFees | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
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

    s.setAddressByKey(ProtoUtilV1.CNS_BURNER, addresses[0]);

    s.setAddressByKey(ProtoUtilV1.CNS_UNISWAP_V2_ROUTER, addresses[1]);
    s.setAddressByKey(ProtoUtilV1.CNS_UNISWAP_V2_FACTORY, addresses[2]);
    s.setAddressByKey(ProtoUtilV1.CNS_TREASURY, addresses[4]);

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
```
</details>

### upgradeContract

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
    upgradeContractWithKey(namespace, 0, previous, current);
  }
```
</details>

### upgradeContractWithKey

```solidity
function upgradeContractWithKey(bytes32 namespace, bytes32 key, address previous, address current) public nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| namespace | bytes32 |  | 
| key | bytes32 |  | 
| previous | address |  | 
| current | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
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
```
</details>

### addContract

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
    addContractWithKey(namespace, 0, contractAddress);
  }
```
</details>

### addContractWithKey

```solidity
function addContractWithKey(bytes32 namespace, bytes32 key, address contractAddress) public nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| namespace | bytes32 |  | 
| key | bytes32 |  | 
| contractAddress | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
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
```
</details>

### removeMember

```solidity
function removeMember(address member) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| member | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeMember(address member) external override nonReentrant {
    // @suppress-address-trust-issue Can be trusted because this can only come from upgrade agents.
    ProtoUtilV1.mustBeProtocolMember(s, member);
    s.mustNotBePaused();
    AccessControlLibV1.mustBeUpgradeAgent(s);

    AccessControlLibV1.removeMemberInternal(s, member);
    emit MemberRemoved(member);
  }
```
</details>

### addMember

```solidity
function addMember(address member) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| member | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addMember(address member) external override nonReentrant {
    // @suppress-address-trust-issue Can be trusted because this can only come from upgrade agents.
    s.mustNotBePaused();
    AccessControlLibV1.mustBeUpgradeAgent(s);

    AccessControlLibV1.addMemberInternal(s, member);
    emit MemberAdded(member);
  }
```
</details>

### grantRoles

```solidity
function grantRoles(struct IProtocol.AccountWithRoles[] detail) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| detail | struct IProtocol.AccountWithRoles[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function grantRoles(AccountWithRoles[] memory detail) external override nonReentrant {
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
* [console](console.md)
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
* [IPriceDiscovery](IPriceDiscovery.md)
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
* [NPMDistributor](NPMDistributor.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](NTransferUtilV2Intermediate.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Policy](Policy.md)
* [PolicyAdmin](PolicyAdmin.md)
* [PolicyHelperV1](PolicyHelperV1.md)
* [PoorMansERC20](PoorMansERC20.md)
* [PriceDiscovery](PriceDiscovery.md)
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
