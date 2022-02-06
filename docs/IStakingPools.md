# IStakingPools.sol

View Source: [contracts/interfaces/IStakingPools.sol](../contracts/interfaces/IStakingPools.sol)

**↗ Extends: [IMember](IMember.md)**
**↘ Derived Contracts: [StakingPoolBase](StakingPoolBase.md)**

**IStakingPools**

**Enums**
### StakingPoolType

```js
enum StakingPoolType {
 TokenStaking,
 PODStaking
}
```

**Events**

```js
event PoolUpdated(bytes32 indexed key, string  name, enum IStakingPools.StakingPoolType  poolType, address indexed stakingToken, address  uniStakingTokenDollarPair, address indexed rewardToken, address  uniRewardTokenDollarPair, uint256  rewardTokenDeposit, uint256  maxStake, uint256  rewardPerBlock, uint256  lockupPeriodInBlocks, uint256  platformFee);
event PoolClosed(bytes32 indexed key, string  name);
event Deposited(bytes32 indexed key, address indexed account, address indexed token, uint256  amount);
event Withdrawn(bytes32 indexed key, address indexed account, address indexed token, uint256  amount);
event RewardsWithdrawn(bytes32 indexed key, address indexed account, address indexed token, uint256  rewards, uint256  platformFee);
```

## Functions

- [addOrEditPool(bytes32 key, string name, enum IStakingPools.StakingPoolType poolType, address[] addresses, uint256[] values)](#addoreditpool)
- [closePool(bytes32 key)](#closepool)
- [validateAddOrEditPool(bytes32 key, string name, address[] addresses, uint256[] values)](#validateaddoreditpool)
- [deposit(bytes32 key, uint256 amount)](#deposit)
- [withdraw(bytes32 key, uint256 amount)](#withdraw)
- [withdrawRewards(bytes32 key)](#withdrawrewards)
- [calculateRewards(bytes32 key, address account)](#calculaterewards)
- [getInfo(bytes32 key, address you)](#getinfo)

### addOrEditPool

Adds or edits the pool by key

```solidity
function addOrEditPool(bytes32 key, string name, enum IStakingPools.StakingPoolType poolType, address[] addresses, uint256[] values) external nonpayable
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
  ) external;
```
</details>

### closePool

```solidity
function closePool(bytes32 key) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function closePool(bytes32 key) external;
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
  ) external view returns (bool);
```
</details>

### deposit

```solidity
function deposit(bytes32 key, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deposit(bytes32 key, uint256 amount) external;
```
</details>

### withdraw

```solidity
function withdraw(bytes32 key, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function withdraw(bytes32 key, uint256 amount) external;
```
</details>

### withdrawRewards

```solidity
function withdrawRewards(bytes32 key) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function withdrawRewards(bytes32 key) external;
```
</details>

### calculateRewards

```solidity
function calculateRewards(bytes32 key, address account) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculateRewards(bytes32 key, address account) external view returns (uint256);
```
</details>

### getInfo

Gets the info of a given staking pool by key

```solidity
function getInfo(bytes32 key, address you) external view
returns(name string, addresses address[], values uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Provide the staking pool key to fetch info for | 
| you | address | Specify the address to customize the info for | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getInfo(bytes32 key, address you)
    external
    view
    returns (
      string memory name,
      address[] memory addresses,
      uint256[] memory values
    );
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
* [Controller](Controller.md)
* [Cover](Cover.md)
* [CoverBase](CoverBase.md)
* [CoverLibV1](CoverLibV1.md)
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
* [FakeAaveLendingPool](FakeAaveLendingPool.md)
* [FakeCompoundERC20Delegator](FakeCompoundERC20Delegator.md)
* [FakeRecoverable](FakeRecoverable.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [FakeUniswapPair](FakeUniswapPair.md)
* [FakeUniswapV2FactoryLike](FakeUniswapV2FactoryLike.md)
* [FakeUniswapV2PairLike](FakeUniswapV2PairLike.md)
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [Finalization](Finalization.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [IAaveV2LendingPoolLike](IAaveV2LendingPoolLike.md)
* [IAccessControl](IAccessControl.md)
* [IBondPool](IBondPool.md)
* [IClaimsProcessor](IClaimsProcessor.md)
* [ICommission](ICommission.md)
* [ICompoundERC20DelegatorLike](ICompoundERC20DelegatorLike.md)
* [ICover](ICover.md)
* [ICoverProvision](ICoverProvision.md)
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
* [IMember](IMember.md)
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
* [IUniswapV2FactoryLike](IUniswapV2FactoryLike.md)
* [IUniswapV2PairLike](IUniswapV2PairLike.md)
* [IUniswapV2RouterLike](IUniswapV2RouterLike.md)
* [IUnstakable](IUnstakable.md)
* [IVault](IVault.md)
* [IVaultFactory](IVaultFactory.md)
* [IWitness](IWitness.md)
* [LiquidityEngine](LiquidityEngine.md)
* [MaliciousToken](MaliciousToken.md)
* [Migrations](Migrations.md)
* [MockCxToken](MockCxToken.md)
* [MockCxTokenPolicy](MockCxTokenPolicy.md)
* [MockCxTokenStore](MockCxTokenStore.md)
* [MockProcessorStore](MockProcessorStore.md)
* [MockProcessorStoreLib](MockProcessorStoreLib.md)
* [MockProtocol](MockProtocol.md)
* [MockStore](MockStore.md)
* [MockVault](MockVault.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](NTransferUtilV2Intermediate.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Policy](Policy.md)
* [PolicyAdmin](PolicyAdmin.md)
* [PolicyHelperV1](PolicyHelperV1.md)
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
* [Unstakable](Unstakable.md)
* [ValidationLibV1](ValidationLibV1.md)
* [Vault](Vault.md)
* [VaultBase](VaultBase.md)
* [VaultFactory](VaultFactory.md)
* [VaultFactoryLibV1](VaultFactoryLibV1.md)
* [VaultLibV1](VaultLibV1.md)
* [WithFlashLoan](WithFlashLoan.md)
* [Witness](Witness.md)
