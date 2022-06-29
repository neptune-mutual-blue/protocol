# FakeUniswapV2RouterLike.sol

View Source: [contracts/fakes/FakeUniswapV2RouterLike.sol](../contracts/fakes/FakeUniswapV2RouterLike.sol)

**↗ Extends: [IUniswapV2RouterLike](IUniswapV2RouterLike.md)**

**FakeUniswapV2RouterLike**

## Contract Members
**Constants & Variables**

```js
address public tokenA;
address public tokenB;

```

## Functions

- [factory()](#factory)
- [getAmountOut(uint256 amountIn, uint256 , uint256 )](#getamountout)
- [getAmountIn(uint256 amountOut, uint256 , uint256 )](#getamountin)
- [getAmountsOut(uint256 multiplier, address[] )](#getamountsout)
- [quote(uint256 amountA, uint256 , uint256 )](#quote)
- [getAmountsIn(uint256 multiplier, address[] )](#getamountsin)
- [addLiquidity(address _tokenA, address _tokenB, uint256 _amountADesired, uint256 _amountBDesired, uint256 , uint256 , address , uint256 )](#addliquidity)

### factory

```solidity
function factory() external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function factory() external view override returns (address) {
    return address(this);
  }
```
</details>

### getAmountOut

```solidity
function getAmountOut(uint256 amountIn, uint256 , uint256 ) external pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| amountIn | uint256 |  | 
|  | uint256 |  | 
|  | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAmountOut(
    uint256 amountIn,
    uint256,
    uint256
  ) external pure override returns (uint256) {
    return amountIn * 2;
  }
```
</details>

### getAmountIn

```solidity
function getAmountIn(uint256 amountOut, uint256 , uint256 ) external pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| amountOut | uint256 |  | 
|  | uint256 |  | 
|  | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAmountIn(
    uint256 amountOut,
    uint256,
    uint256
  ) external pure override returns (uint256) {
    return amountOut * 2;
  }
```
</details>

### getAmountsOut

```solidity
function getAmountsOut(uint256 multiplier, address[] ) external pure
returns(uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| multiplier | uint256 |  | 
|  | address[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAmountsOut(uint256 multiplier, address[] calldata) external pure override returns (uint256[] memory) {
    uint256[] memory amounts = new uint256[](2);

    amounts[0] = multiplier;
    amounts[1] = multiplier;

    return amounts;
  }
```
</details>

### quote

```solidity
function quote(uint256 amountA, uint256 , uint256 ) public pure
returns(amountB uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| amountA | uint256 |  | 
|  | uint256 |  | 
|  | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function quote(
    uint256 amountA,
    uint256,
    uint256
  ) public pure virtual override returns (uint256 amountB) {
    return amountA;
  }
```
</details>

### getAmountsIn

```solidity
function getAmountsIn(uint256 multiplier, address[] ) external pure
returns(uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| multiplier | uint256 |  | 
|  | address[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAmountsIn(uint256 multiplier, address[] calldata) external pure override returns (uint256[] memory) {
    uint256[] memory amounts = new uint256[](2);

    amounts[0] = multiplier;
    amounts[1] = multiplier;

    return amounts;
  }
```
</details>

### addLiquidity

```solidity
function addLiquidity(address _tokenA, address _tokenB, uint256 _amountADesired, uint256 _amountBDesired, uint256 , uint256 , address , uint256 ) external nonpayable
returns(amountA uint256, amountB uint256, liquidity uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _tokenA | address |  | 
| _tokenB | address |  | 
| _amountADesired | uint256 |  | 
| _amountBDesired | uint256 |  | 
|  | uint256 |  | 
|  | uint256 |  | 
|  | address |  | 
|  | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addLiquidity(
    address _tokenA,
    address _tokenB,
    uint256 _amountADesired,
    uint256 _amountBDesired,
    uint256,
    uint256,
    address,
    uint256
  )
    external
    override
    returns (
      uint256 amountA,
      uint256 amountB,
      uint256 liquidity
    )
  {
    tokenA = _tokenA;
    tokenB = _tokenB;

    amountA = _amountADesired;
    amountB = _amountBDesired;
    liquidity = 1;
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
