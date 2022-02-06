# IVault.sol

View Source: [contracts/interfaces/IVault.sol](../contracts/interfaces/IVault.sol)

**↗ Extends: [IMember](IMember.md), [IERC20](IERC20.md)**
**↘ Derived Contracts: [VaultBase](VaultBase.md)**

**IVault**

**Events**

```js
event GovernanceTransfer(address indexed to, uint256  amount);
event StrategyTransfer(address indexed token, address indexed strategy, bytes32 indexed name, uint256  amount);
event StrategyReceipt(address indexed token, address indexed strategy, bytes32 indexed name, uint256  amount);
event PodsIssued(address indexed account, uint256  issued, uint256  liquidityAdded);
event PodsRedeemed(address indexed account, uint256  redeemed, uint256  liquidityReleased);
event MinLiquidityPeriodSet(uint256  previous, uint256  current);
event FlashLoanBorrowed(address indexed lender, address indexed borrower, address indexed stablecoin, uint256  amount, uint256  fee);
```

## Functions

- [key()](#key)
- [lqt()](#lqt)
- [addLiquidityInternalOnly(bytes32 coverKey, address account, uint256 amount, uint256 npmStake)](#addliquidityinternalonly)
- [addLiquidity(bytes32 coverKey, uint256 amount, uint256 npmStake)](#addliquidity)
- [removeLiquidity(bytes32 coverKey, uint256 amount, uint256 npmStake)](#removeliquidity)
- [transferGovernance(bytes32 coverKey, address to, uint256 amount)](#transfergovernance)
- [transferToStrategy(IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount)](#transfertostrategy)
- [receiveFromStrategy(IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount)](#receivefromstrategy)
- [setMinLiquidityPeriod(uint256 value)](#setminliquidityperiod)
- [calculatePods(uint256 forStablecoinUnits)](#calculatepods)
- [calculateLiquidity(uint256 podsToBurn)](#calculateliquidity)
- [getInfo(address forAccount)](#getinfo)
- [getStablecoinBalanceOf()](#getstablecoinbalanceof)

### key

```solidity
function key() external view
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function key() external view returns (bytes32);
```
</details>

### lqt

```solidity
function lqt() external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function lqt() external view returns (address);
```
</details>

### addLiquidityInternalOnly

Adds liquidity to the specified cover contract

```solidity
function addLiquidityInternalOnly(bytes32 coverKey, address account, uint256 amount, uint256 npmStake) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| account | address | Specify the account on behalf of which the liquidity is being added. | 
| amount | uint256 | Enter the amount of liquidity token to supply. | 
| npmStake | uint256 | Enter the amount of NPM token to stake. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addLiquidityInternalOnly(
    bytes32 coverKey,
    address account,
    uint256 amount,
    uint256 npmStake
  ) external;
```
</details>

### addLiquidity

Adds liquidity to the specified cover contract

```solidity
function addLiquidity(bytes32 coverKey, uint256 amount, uint256 npmStake) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| amount | uint256 | Enter the amount of liquidity token to supply. | 
| npmStake | uint256 | Enter the amount of NPM token to stake. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addLiquidity(
    bytes32 coverKey,
    uint256 amount,
    uint256 npmStake
  ) external;
```
</details>

### removeLiquidity

Removes liquidity from the specified cover contract

```solidity
function removeLiquidity(bytes32 coverKey, uint256 amount, uint256 npmStake) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| amount | uint256 | Enter the amount of liquidity token to remove. | 
| npmStake | uint256 | Enter the amount of NPM stake to remove. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeLiquidity(
    bytes32 coverKey,
    uint256 amount,
    uint256 npmStake
  ) external;
```
</details>

### transferGovernance

Transfers liquidity to governance contract.

```solidity
function transferGovernance(bytes32 coverKey, address to, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| to | address | Enter the destination account | 
| amount | uint256 | Enter the amount of liquidity token to transfer. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function transferGovernance(
    bytes32 coverKey,
    address to,
    uint256 amount
  ) external;
```
</details>

### transferToStrategy

Transfers liquidity to strategy contract.

```solidity
function transferToStrategy(IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| token | IERC20 |  | 
| coverKey | bytes32 | Enter the cover key | 
| strategyName | bytes32 | Enter the strategy's name | 
| amount | uint256 | Enter the amount of liquidity token to transfer. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function transferToStrategy(
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external;
```
</details>

### receiveFromStrategy

Receives from strategy contract.

```solidity
function receiveFromStrategy(IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| token | IERC20 |  | 
| coverKey | bytes32 | Enter the cover key | 
| strategyName | bytes32 | Enter the strategy's name | 
| amount | uint256 | Enter the amount of liquidity token to transfer. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function receiveFromStrategy(
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external;
```
</details>

### setMinLiquidityPeriod

```solidity
function setMinLiquidityPeriod(uint256 value) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setMinLiquidityPeriod(uint256 value) external;
```
</details>

### calculatePods

```solidity
function calculatePods(uint256 forStablecoinUnits) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| forStablecoinUnits | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculatePods(uint256 forStablecoinUnits) external view returns (uint256);
```
</details>

### calculateLiquidity

```solidity
function calculateLiquidity(uint256 podsToBurn) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| podsToBurn | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculateLiquidity(uint256 podsToBurn) external view returns (uint256);
```
</details>

### getInfo

```solidity
function getInfo(address forAccount) external view
returns(result uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| forAccount | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getInfo(address forAccount) external view returns (uint256[] memory result);
```
</details>

### getStablecoinBalanceOf

Returns the stablecoin balance of this vault
 This also includes amounts lent out in lending strategies

```solidity
function getStablecoinBalanceOf() external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStablecoinBalanceOf() external view returns (uint256);
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
