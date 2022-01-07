# StakingPoolBase.sol

View Source: [contracts/pool/Staking/StakingPoolBase.sol](../contracts/pool/Staking/StakingPoolBase.sol)

**↗ Extends: [IStakingPools](IStakingPools.md), [Recoverable](Recoverable.md)**
**↘ Derived Contracts: [StakingPoolReward](StakingPoolReward.md)**

**StakingPoolBase**

## Functions

- [constructor(IStore s)](#)
- [addOrEditPool(bytes32 key, string name, enum IStakingPools.StakingPoolType poolType, address[] addresses, uint256[] values)](#addoreditpool)
- [validateAddOrEditPool(bytes32 key, string name, address[] addresses, uint256[] values)](#validateaddoreditpool)
- [closePool(bytes32 key)](#closepool)
- [version()](#version)
- [getName()](#getname)

### 

```solidity
function (IStore s) internal nonpayable Recoverable 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(IStore s) Recoverable(s) {}
```
</details>

### addOrEditPool

Adds or edits the pool by key

```solidity
function addOrEditPool(bytes32 key, string name, enum IStakingPools.StakingPoolType poolType, address[] addresses, uint256[] values) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the key of the pool you want to create or edit | 
| name | string | Enter a name for this pool | 
| poolType | enum IStakingPools.StakingPoolType | Specify the pool type: TokenStaking or PODStaking | 
| addresses | address[] | [0] stakingToken The token which is staked in this pool | 
| values | uint256[] | [0] stakingTarget Specify the target amount in the staking token. You can not exceed the target. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addOrEditPool(
    bytes32 key,
    string memory name,
    StakingPoolType poolType,
    address[] memory addresses,
    uint256[] memory values
  ) external override nonReentrant {
    s.mustNotBePaused();
    s.mustBeAdmin();

    s.addOrEditPoolInternal(key, name, addresses, values);
    emit PoolUpdated(key, name, poolType, addresses[0], addresses[1], addresses[2], addresses[3], values[5], values[1], values[3], values[2]);
  }
```
</details>

### validateAddOrEditPool

```solidity
function validateAddOrEditPool(bytes32 key, string name, address[] addresses, uint256[] values) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| name | string |  | 
| addresses | address[] |  | 
| values | uint256[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function validateAddOrEditPool(
    bytes32 key,
    string memory name,
    address[] memory addresses,
    uint256[] memory values
  ) external view override returns (bool) {
    return s.validateAddOrEditPoolInternal(key, name, addresses, values);
  }
```
</details>

### closePool

```solidity
function closePool(bytes32 key) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function closePool(bytes32 key) external override nonReentrant {
    s.mustNotBePaused();
    s.mustBeAdmin();

    s.setBoolByKeys(StakingPoolLibV1.NS_POOL, key, false);

    emit PoolClosed(key, s.getStringByKeys(StakingPoolLibV1.NS_POOL, key));
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
    return ProtoUtilV1.CNAME_BOND_POOL;
  }
```
</details>

## Contracts

* [AccessControl](AccessControl.md)
* [AccessControlLibV1](AccessControlLibV1.md)
* [Address](Address.md)
* [BaseLibV1](BaseLibV1.md)
* [BokkyPooBahsDateTimeLibrary](BokkyPooBahsDateTimeLibrary.md)
* [BondPool](BondPool.md)
* [BondPoolBase](BondPoolBase.md)
* [BondPoolLibV1](BondPoolLibV1.md)
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
* [FakeUniswapPair](FakeUniswapPair.md)
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [Finalization](Finalization.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [IAccessControl](IAccessControl.md)
* [IBondPool](IBondPool.md)
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
* [IERC3156FlashBorrower](IERC3156FlashBorrower.md)
* [IERC3156FlashLender](IERC3156FlashLender.md)
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
* [IStakingPools](IStakingPools.md)
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
* [StakingPoolBase](StakingPoolBase.md)
* [StakingPoolInfo](StakingPoolInfo.md)
* [StakingPoolLibV1](StakingPoolLibV1.md)
* [StakingPoolReward](StakingPoolReward.md)
* [StakingPools](StakingPools.md)
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
* [WithFlashLoan](WithFlashLoan.md)
* [Witness](Witness.md)
