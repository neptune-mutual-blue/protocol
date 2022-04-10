# IVault.sol

View Source: [contracts/interfaces/IVault.sol](../contracts/interfaces/IVault.sol)

**↗ Extends: [IMember](IMember.md), [IERC20](IERC20.md)**
**↘ Derived Contracts: [VaultBase](VaultBase.md)**

**IVault**

**Events**

```js
event GovernanceTransfer(address indexed to, uint256  amount);
event StrategyTransfer(address indexed token, address indexed strategy, bytes32 indexed name, uint256  amount);
event StrategyReceipt(address indexed token, address indexed strategy, bytes32 indexed name, uint256  amount, uint256  income, uint256  loss);
event PodsIssued(address indexed account, uint256  issued, uint256  liquidityAdded, bytes32 indexed referralCode);
event PodsRedeemed(address indexed account, uint256  redeemed, uint256  liquidityReleased);
event FlashLoanBorrowed(address indexed lender, address indexed borrower, address indexed stablecoin, uint256  amount, uint256  fee);
event NPMStaken(address indexed account, uint256  amount);
event NPMUnstaken(address indexed account, uint256  amount);
event InterestAccrued(bytes32 indexed key);
event Entered(bytes32 indexed key, address indexed account);
event Exited(bytes32 indexed key, address indexed account);
```

## Functions

- [key()](#key)
- [sc()](#sc)
- [addLiquidity(bytes32 coverKey, uint256 amount, uint256 npmStake, bytes32 referralCode)](#addliquidity)
- [accrueInterest()](#accrueinterest)
- [removeLiquidity(bytes32 coverKey, uint256 amount, uint256 npmStake, bool exit)](#removeliquidity)
- [transferGovernance(bytes32 coverKey, address to, uint256 amount)](#transfergovernance)
- [transferToStrategy(IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount)](#transfertostrategy)
- [receiveFromStrategy(IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount)](#receivefromstrategy)
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

### sc

```solidity
function sc() external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function sc() external view returns (address);
```
</details>

### addLiquidity

Adds liquidity to the specified cover contract

```solidity
function addLiquidity(bytes32 coverKey, uint256 amount, uint256 npmStake, bytes32 referralCode) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| amount | uint256 | Enter the amount of liquidity token to supply. | 
| npmStake | uint256 | Enter the amount of NPM token to stake. Will be locked for a minimum window of one withdrawal period. | 
| referralCode | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addLiquidity(
    bytes32 coverKey,
    uint256 amount,
    uint256 npmStake,
    bytes32 referralCode
  ) external;
```
</details>

### accrueInterest

```solidity
function accrueInterest() external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function accrueInterest() external;
```
</details>

### removeLiquidity

Removes liquidity from the specified cover contract

```solidity
function removeLiquidity(bytes32 coverKey, uint256 amount, uint256 npmStake, bool exit) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| amount | uint256 | Enter the amount of liquidity token to remove. | 
| npmStake | uint256 | Enter the amount of NPM stake to remove. | 
| exit | bool | Indicates NPM stake exit. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeLiquidity(
    bytes32 coverKey,
    uint256 amount,
    uint256 npmStake,
    bool exit
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
* [console](console.md)
* [Context](Context.md)
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
* [MockCxToken](MockCxToken.md)
* [MockCxTokenPolicy](MockCxTokenPolicy.md)
* [MockCxTokenStore](MockCxTokenStore.md)
* [MockFlashBorrower](MockFlashBorrower.md)
* [MockProcessorStore](MockProcessorStore.md)
* [MockProcessorStoreLib](MockProcessorStoreLib.md)
* [MockProtocol](MockProtocol.md)
* [MockRegistryClient](MockRegistryClient.md)
* [MockStore](MockStore.md)
* [MockVault](MockVault.md)
* [NPM](NPM.md)
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
