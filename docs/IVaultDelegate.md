# IVaultDelegate.sol

View Source: [contracts/interfaces/IVaultDelegate.sol](../contracts/interfaces/IVaultDelegate.sol)

**↗ Extends: [IMember](IMember.md)**
**↘ Derived Contracts: [VaultDelegateBase](VaultDelegateBase.md)**

**IVaultDelegate**

## Functions

- [preAddLiquidity(address caller, bytes32 coverKey, uint256 amount, uint256 npmStake)](#preaddliquidity)
- [postAddLiquidity(address caller, bytes32 coverKey, uint256 amount, uint256 npmStake)](#postaddliquidity)
- [accrueInterestImplementation(address caller, bytes32 coverKey)](#accrueinterestimplementation)
- [preRemoveLiquidity(address caller, bytes32 coverKey, uint256 amount, uint256 npmStake, bool exit)](#preremoveliquidity)
- [postRemoveLiquidity(address caller, bytes32 coverKey, uint256 amount, uint256 npmStake, bool exit)](#postremoveliquidity)
- [preTransferGovernance(address caller, bytes32 coverKey, address to, uint256 amount)](#pretransfergovernance)
- [postTransferGovernance(address caller, bytes32 coverKey, address to, uint256 amount)](#posttransfergovernance)
- [preTransferToStrategy(address caller, IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount)](#pretransfertostrategy)
- [postTransferToStrategy(address caller, IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount)](#posttransfertostrategy)
- [preReceiveFromStrategy(address caller, IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount)](#prereceivefromstrategy)
- [postReceiveFromStrategy(address caller, IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount)](#postreceivefromstrategy)
- [preFlashLoan(address caller, bytes32 coverKey, IERC3156FlashBorrower receiver, address token, uint256 amount, bytes data)](#preflashloan)
- [postFlashLoan(address caller, bytes32 coverKey, IERC3156FlashBorrower receiver, address token, uint256 amount, bytes data)](#postflashloan)
- [calculatePodsImplementation(bytes32 coverKey, uint256 forStablecoinUnits)](#calculatepodsimplementation)
- [calculateLiquidityImplementation(bytes32 coverKey, uint256 podsToBurn)](#calculateliquidityimplementation)
- [getInfoImplementation(bytes32 coverKey, address forAccount)](#getinfoimplementation)
- [getStablecoinBalanceOfImplementation(bytes32 coverKey)](#getstablecoinbalanceofimplementation)
- [getFlashFee(address caller, bytes32 coverKey, address token, uint256 amount)](#getflashfee)
- [getMaxFlashLoan(address caller, bytes32 coverKey, address token)](#getmaxflashloan)

### preAddLiquidity

```solidity
function preAddLiquidity(address caller, bytes32 coverKey, uint256 amount, uint256 npmStake) external nonpayable
returns(podsToMint uint256, previousNpmStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address |  | 
| coverKey | bytes32 |  | 
| amount | uint256 |  | 
| npmStake | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function preAddLiquidity(
    address caller,
    bytes32 coverKey,
    uint256 amount,
    uint256 npmStake
  ) external returns (uint256 podsToMint, uint256 previousNpmStake);
```
</details>

### postAddLiquidity

```solidity
function postAddLiquidity(address caller, bytes32 coverKey, uint256 amount, uint256 npmStake) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address |  | 
| coverKey | bytes32 |  | 
| amount | uint256 |  | 
| npmStake | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function postAddLiquidity(
    address caller,
    bytes32 coverKey,
    uint256 amount,
    uint256 npmStake
  ) external;
```
</details>

### accrueInterestImplementation

```solidity
function accrueInterestImplementation(address caller, bytes32 coverKey) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function accrueInterestImplementation(address caller, bytes32 coverKey) external;
```
</details>

### preRemoveLiquidity

```solidity
function preRemoveLiquidity(address caller, bytes32 coverKey, uint256 amount, uint256 npmStake, bool exit) external nonpayable
returns(stablecoin address, stableCoinToRelease uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address |  | 
| coverKey | bytes32 |  | 
| amount | uint256 |  | 
| npmStake | uint256 |  | 
| exit | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function preRemoveLiquidity(
    address caller,
    bytes32 coverKey,
    uint256 amount,
    uint256 npmStake,
    bool exit
  ) external returns (address stablecoin, uint256 stableCoinToRelease);
```
</details>

### postRemoveLiquidity

```solidity
function postRemoveLiquidity(address caller, bytes32 coverKey, uint256 amount, uint256 npmStake, bool exit) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address |  | 
| coverKey | bytes32 |  | 
| amount | uint256 |  | 
| npmStake | uint256 |  | 
| exit | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function postRemoveLiquidity(
    address caller,
    bytes32 coverKey,
    uint256 amount,
    uint256 npmStake,
    bool exit
  ) external;
```
</details>

### preTransferGovernance

```solidity
function preTransferGovernance(address caller, bytes32 coverKey, address to, uint256 amount) external nonpayable
returns(stablecoin address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address |  | 
| coverKey | bytes32 |  | 
| to | address |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function preTransferGovernance(
    address caller,
    bytes32 coverKey,
    address to,
    uint256 amount
  ) external returns (address stablecoin);
```
</details>

### postTransferGovernance

```solidity
function postTransferGovernance(address caller, bytes32 coverKey, address to, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address |  | 
| coverKey | bytes32 |  | 
| to | address |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function postTransferGovernance(
    address caller,
    bytes32 coverKey,
    address to,
    uint256 amount
  ) external;
```
</details>

### preTransferToStrategy

```solidity
function preTransferToStrategy(address caller, IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address |  | 
| token | IERC20 |  | 
| coverKey | bytes32 |  | 
| strategyName | bytes32 |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function preTransferToStrategy(
    address caller,
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external;
```
</details>

### postTransferToStrategy

```solidity
function postTransferToStrategy(address caller, IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address |  | 
| token | IERC20 |  | 
| coverKey | bytes32 |  | 
| strategyName | bytes32 |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function postTransferToStrategy(
    address caller,
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external;
```
</details>

### preReceiveFromStrategy

```solidity
function preReceiveFromStrategy(address caller, IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address |  | 
| token | IERC20 |  | 
| coverKey | bytes32 |  | 
| strategyName | bytes32 |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function preReceiveFromStrategy(
    address caller,
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external;
```
</details>

### postReceiveFromStrategy

```solidity
function postReceiveFromStrategy(address caller, IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount) external nonpayable
returns(income uint256, loss uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address |  | 
| token | IERC20 |  | 
| coverKey | bytes32 |  | 
| strategyName | bytes32 |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function postReceiveFromStrategy(
    address caller,
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external returns (uint256 income, uint256 loss);
```
</details>

### preFlashLoan

```solidity
function preFlashLoan(address caller, bytes32 coverKey, IERC3156FlashBorrower receiver, address token, uint256 amount, bytes data) external nonpayable
returns(stablecoin contract IERC20, fee uint256, protocolFee uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address |  | 
| coverKey | bytes32 |  | 
| receiver | IERC3156FlashBorrower |  | 
| token | address |  | 
| amount | uint256 |  | 
| data | bytes |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function preFlashLoan(
    address caller,
    bytes32 coverKey,
    IERC3156FlashBorrower receiver,
    address token,
    uint256 amount,
    bytes calldata data
  )
    external
    returns (
      IERC20 stablecoin,
      uint256 fee,
      uint256 protocolFee
    );
```
</details>

### postFlashLoan

```solidity
function postFlashLoan(address caller, bytes32 coverKey, IERC3156FlashBorrower receiver, address token, uint256 amount, bytes data) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address |  | 
| coverKey | bytes32 |  | 
| receiver | IERC3156FlashBorrower |  | 
| token | address |  | 
| amount | uint256 |  | 
| data | bytes |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function postFlashLoan(
    address caller,
    bytes32 coverKey,
    IERC3156FlashBorrower receiver,
    address token,
    uint256 amount,
    bytes calldata data
  ) external;
```
</details>

### calculatePodsImplementation

```solidity
function calculatePodsImplementation(bytes32 coverKey, uint256 forStablecoinUnits) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| forStablecoinUnits | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculatePodsImplementation(bytes32 coverKey, uint256 forStablecoinUnits) external view returns (uint256);
```
</details>

### calculateLiquidityImplementation

```solidity
function calculateLiquidityImplementation(bytes32 coverKey, uint256 podsToBurn) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| podsToBurn | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculateLiquidityImplementation(bytes32 coverKey, uint256 podsToBurn) external view returns (uint256);
```
</details>

### getInfoImplementation

```solidity
function getInfoImplementation(bytes32 coverKey, address forAccount) external view
returns(result uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| forAccount | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getInfoImplementation(bytes32 coverKey, address forAccount) external view returns (uint256[] memory result);
```
</details>

### getStablecoinBalanceOfImplementation

```solidity
function getStablecoinBalanceOfImplementation(bytes32 coverKey) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStablecoinBalanceOfImplementation(bytes32 coverKey) external view returns (uint256);
```
</details>

### getFlashFee

```solidity
function getFlashFee(address caller, bytes32 coverKey, address token, uint256 amount) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address |  | 
| coverKey | bytes32 |  | 
| token | address |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getFlashFee(
    address caller,
    bytes32 coverKey,
    address token,
    uint256 amount
  ) external view returns (uint256);
```
</details>

### getMaxFlashLoan

```solidity
function getMaxFlashLoan(address caller, bytes32 coverKey, address token) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address |  | 
| coverKey | bytes32 |  | 
| token | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getMaxFlashLoan(
    address caller,
    bytes32 coverKey,
    address token
  ) external view returns (uint256);
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
