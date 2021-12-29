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
- [addContract(bytes32 namespace, address contractAddress)](#addcontract)
- [removeMember(address member)](#removemember)
- [addMember(address member)](#addmember)
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
function initialize(address[] addresses, uint256[] values) external nonpayable whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| addresses | address[] | [0] burner | 
| values | uint256[] | [0] coverCreationFees | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function initialize(address[] memory addresses, uint256[] memory values) external override whenNotPaused {
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
```
</details>

### upgradeContract

```solidity
function upgradeContract(bytes32 namespace, address previous, address current) external nonpayable nonReentrant 
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
  ) external override nonReentrant {
    ProtoUtilV1.mustBeProtocolMember(s, previous);
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeUpgradeAgent(s);

    s.upgradeContract(namespace, previous, current);
    emit ContractUpgraded(namespace, previous, current);
  }
```
</details>

### addContract

```solidity
function addContract(bytes32 namespace, address contractAddress) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| namespace | bytes32 |  | 
| contractAddress | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addContract(bytes32 namespace, address contractAddress) external override nonReentrant {
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeUpgradeAgent(s);

    s.addContract(namespace, contractAddress);
    emit ContractAdded(namespace, contractAddress);
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
    ProtoUtilV1.mustBeProtocolMember(s, member);
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeUpgradeAgent(s);

    s.removeMember(member);
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
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeUpgradeAgent(s);

    s.addMember(member);
    emit MemberAdded(member);
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
function getName() public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getName() public pure override returns (bytes32) {
    return "Neptune Mutual Protocol";
  }
```
</details>

## Contracts

* [AccessControl](AccessControl.md)
* [AccessControlLibV1](AccessControlLibV1.md)
* [Address](Address.md)
* [BaseLibV1](BaseLibV1.md)
* [BokkyPooBahsDateTimeLibrary](BokkyPooBahsDateTimeLibrary.md)
* [Commission](Commission.md)
* [Context](Context.md)
* [Controller](Controller.md)
* [Cover](Cover.md)
* [CoverBase](CoverBase.md)
* [CoverProvision](CoverProvision.md)
* [CoverReassurance](CoverReassurance.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [cxToken](cxToken.md)
* [cxTokenFactory](cxTokenFactory.md)
* [cxTokenFactoryLibV1](cxTokenFactoryLibV1.md)
* [Destroyable](Destroyable.md)
* [ERC165](ERC165.md)
* [ERC20](ERC20.md)
* [FakeRecoverable](FakeRecoverable.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [Finalization](Finalization.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [IAccessControl](IAccessControl.md)
* [IClaimsProcessor](IClaimsProcessor.md)
* [ICommission](ICommission.md)
* [ICover](ICover.md)
* [ICoverProvision](ICoverProvision.md)
* [ICoverReassurance](ICoverReassurance.md)
* [ICoverStake](ICoverStake.md)
* [ICxToken](ICxToken.md)
* [ICxTokenFactory](ICxTokenFactory.md)
* [IERC165](IERC165.md)
* [IERC20](IERC20.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IFinalization](IFinalization.md)
* [IGovernance](IGovernance.md)
* [IMember](IMember.md)
* [IPausable](IPausable.md)
* [IPolicy](IPolicy.md)
* [IPolicyAdmin](IPolicyAdmin.md)
* [IPriceDiscovery](IPriceDiscovery.md)
* [IProtocol](IProtocol.md)
* [IReporter](IReporter.md)
* [IResolution](IResolution.md)
* [IResolvable](IResolvable.md)
* [IStore](IStore.md)
* [IUniswapV2PairLike](IUniswapV2PairLike.md)
* [IUniswapV2RouterLike](IUniswapV2RouterLike.md)
* [IUnstakable](IUnstakable.md)
* [IVault](IVault.md)
* [IVaultFactory](IVaultFactory.md)
* [IWitness](IWitness.md)
* [MaliciousToken](MaliciousToken.md)
* [Migrations](Migrations.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](NTransferUtilV2Intermediate.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Policy](Policy.md)
* [PolicyAdmin](PolicyAdmin.md)
* [PolicyManager](PolicyManager.md)
* [PriceDiscovery](PriceDiscovery.md)
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
* [SafeERC20](SafeERC20.md)
* [SafeMath](SafeMath.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
* [Strings](Strings.md)
* [Unstakable](Unstakable.md)
* [ValidationLibV1](ValidationLibV1.md)
* [Vault](Vault.md)
* [VaultBase](VaultBase.md)
* [VaultFactory](VaultFactory.md)
* [VaultFactoryLibV1](VaultFactoryLibV1.md)
* [VaultLibV1](VaultLibV1.md)
* [Witness](Witness.md)
