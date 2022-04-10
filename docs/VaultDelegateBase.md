# Vault POD (Proof of Deposit) (VaultDelegateBase.sol)

View Source: [contracts/core/delegates/VaultDelegateBase.sol](../contracts/core/delegates/VaultDelegateBase.sol)

**↗ Extends: [IVaultDelegate](IVaultDelegate.md), [Recoverable](Recoverable.md)**
**↘ Derived Contracts: [VaultDelegateWithFlashLoan](VaultDelegateWithFlashLoan.md)**

**VaultDelegateBase**

The VaultPod has `_mintPods` and `_redeemPods` features which enables
 POD minting and burning on demand. <br /> <br />
 **How Does This Work?**
 When you add liquidity to the Vault,
 PODs are minted representing your proportional share of the pool.
 Similarly, when you redeem your PODs, you get your proportional
 share of the Vault liquidity back, burning the PODs.

## Functions

- [constructor(IStore store)](#)
- [preTransferGovernance(address caller, bytes32 coverKey, address , uint256 )](#pretransfergovernance)
- [postTransferGovernance(address , bytes32 coverKey, address , uint256 )](#posttransfergovernance)
- [preTransferToStrategy(address caller, IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount)](#pretransfertostrategy)
- [postTransferToStrategy(address , IERC20 , bytes32 coverKey, bytes32 , uint256 )](#posttransfertostrategy)
- [preReceiveFromStrategy(address caller, IERC20 , bytes32 coverKey, bytes32 strategyName, uint256 )](#prereceivefromstrategy)
- [postReceiveFromStrategy(address caller, IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount)](#postreceivefromstrategy)
- [preAddLiquidity(address caller, bytes32 coverKey, uint256 amount, uint256 npmStakeToAdd)](#preaddliquidity)
- [postAddLiquidity(address , bytes32 coverKey, uint256 , uint256 )](#postaddliquidity)
- [accrueInterestImplementation(address caller, bytes32 coverKey)](#accrueinterestimplementation)
- [preRemoveLiquidity(address caller, bytes32 coverKey, uint256 podsToRedeem, uint256 npmStakeToRemove, bool exit)](#preremoveliquidity)
- [postRemoveLiquidity(address , bytes32 coverKey, uint256 , uint256 , bool )](#postremoveliquidity)
- [calculatePodsImplementation(bytes32 coverKey, uint256 forStablecoinUnits)](#calculatepodsimplementation)
- [calculateLiquidityImplementation(bytes32 coverKey, uint256 podsToBurn)](#calculateliquidityimplementation)
- [getStablecoinBalanceOfImplementation(bytes32 coverKey)](#getstablecoinbalanceofimplementation)
- [getInfoImplementation(bytes32 coverKey, address you)](#getinfoimplementation)
- [version()](#version)
- [getName()](#getname)

### 

Constructs this contract

```solidity
function (IStore store) internal nonpayable Recoverable 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore | Provide the store contract instance | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(IStore store) Recoverable(store) {}
```
</details>

### preTransferGovernance

```solidity
function preTransferGovernance(address caller, bytes32 coverKey, address , uint256 ) external nonpayable nonReentrant 
returns(stablecoin address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address |  | 
| coverKey | bytes32 |  | 
|  | address |  | 
|  | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function preTransferGovernance(
    address caller,
    bytes32 coverKey,
    address, /*to*/
    uint256 /*amount*/
  ) external override nonReentrant returns (address stablecoin) {
    s.mustNotBePaused();
    s.senderMustBeVaultContract(coverKey);
    s.callerMustBeClaimsProcessorContract(caller);

    stablecoin = s.getStablecoin();
  }
```
</details>

### postTransferGovernance

```solidity
function postTransferGovernance(address , bytes32 coverKey, address , uint256 ) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
|  | address |  | 
| coverKey | bytes32 |  | 
|  | address |  | 
|  | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function postTransferGovernance(
    address, /*caller*/
    bytes32 coverKey,
    address, /*to*/
    uint256 /*amount*/
  ) external view override {
    s.senderMustBeVaultContract(coverKey);
    // @suppress-reentrancy The `postTransferGovernance` hook is executed under the same context of `preTransferGovernance`.
    // @note: do not update state and liquidity since `transferGovernance` is an internal contract-only function
  }
```
</details>

### preTransferToStrategy

```solidity
function preTransferToStrategy(address caller, IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount) external nonpayable nonReentrant 
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
  ) external override nonReentrant {
    s.mustNotBePaused();
    s.senderMustBeVaultContract(coverKey);
    s.callerMustBeSpecificStrategyContract(caller, strategyName);

    s.preTransferToStrategyInternal(token, coverKey, strategyName, amount);
  }
```
</details>

### postTransferToStrategy

```solidity
function postTransferToStrategy(address , IERC20 , bytes32 coverKey, bytes32 , uint256 ) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
|  | address |  | 
|  | IERC20 |  | 
| coverKey | bytes32 |  | 
|  | bytes32 |  | 
|  | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function postTransferToStrategy(
    address, /*caller*/
    IERC20, /*token*/
    bytes32 coverKey,
    bytes32, /*strategyName*/
    uint256 /*amount*/
  ) external view override {
    s.senderMustBeVaultContract(coverKey);
    // @suppress-reentrancy The `postTransferToStrategy` hook is executed under the same context of `preTransferToStrategy`.
    // @note: do not update state and liquidity since `transferToStrategy` itself is a part of the state update
  }
```
</details>

### preReceiveFromStrategy

```solidity
function preReceiveFromStrategy(address caller, IERC20 , bytes32 coverKey, bytes32 strategyName, uint256 ) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address |  | 
|  | IERC20 |  | 
| coverKey | bytes32 |  | 
| strategyName | bytes32 |  | 
|  | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function preReceiveFromStrategy(
    address caller,
    IERC20, /*token*/
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 /*amount*/
  ) external override nonReentrant {
    s.mustNotBePaused();
    s.senderMustBeVaultContract(coverKey);
    s.callerMustBeSpecificStrategyContract(caller, strategyName);
  }
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
  ) external override returns (uint256 income, uint256 loss) {
    s.mustNotBePaused();
    s.senderMustBeVaultContract(coverKey);
    s.callerMustBeStrategyContract(caller);

    (income, loss) = s.postReceiveFromStrategyInternal(token, coverKey, strategyName, amount);
    // @suppress-reentrancy The `postReceiveFromStrategy` hook is executed under the same context of `preReceiveFromStrategy`.
    // @note: do not update state and liquidity since `receiveFromStrategy` itself is a part of the state update
  }
```
</details>

### preAddLiquidity

Adds liquidity to the specified cover contract

```solidity
function preAddLiquidity(address caller, bytes32 coverKey, uint256 amount, uint256 npmStakeToAdd) external nonpayable nonReentrant 
returns(podsToMint uint256, previousNpmStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address |  | 
| coverKey | bytes32 | Enter the cover key | 
| amount | uint256 | Enter the amount of liquidity token to supply. | 
| npmStakeToAdd | uint256 | Enter the amount of NPM token to stake. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function preAddLiquidity(
    address caller,
    bytes32 coverKey,
    uint256 amount,
    uint256 npmStakeToAdd
  ) external override nonReentrant returns (uint256 podsToMint, uint256 previousNpmStake) {
    s.mustNotBePaused();
    s.senderMustBeVaultContract(coverKey);
    s.mustHaveNormalCoverStatus(coverKey);

    address pod = msg.sender;
    (podsToMint, previousNpmStake) = s.preAddLiquidityInternal(coverKey, pod, caller, amount, npmStakeToAdd);
  }
```
</details>

### postAddLiquidity

```solidity
function postAddLiquidity(address , bytes32 coverKey, uint256 , uint256 ) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
|  | address |  | 
| coverKey | bytes32 |  | 
|  | uint256 |  | 
|  | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function postAddLiquidity(
    address, /*caller*/
    bytes32 coverKey,
    uint256, /*amount*/
    uint256 /*npmStakeToAdd*/
  ) external override {
    s.senderMustBeVaultContract(coverKey);
    s.updateStateAndLiquidity(coverKey);

    // @suppress-reentrancy The `postAddLiquidity` hook is executed under the same context of `preAddLiquidity`.
  }
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
function accrueInterestImplementation(address caller, bytes32 coverKey) external override {
    s.mustNotBePaused();
    s.senderMustBeVaultContract(coverKey);
    AccessControlLibV1.callerMustBeLiquidityManager(s, caller);

    s.accrueInterestInternal(coverKey);
  }
```
</details>

### preRemoveLiquidity

Removes liquidity from the specified cover contract

```solidity
function preRemoveLiquidity(address caller, bytes32 coverKey, uint256 podsToRedeem, uint256 npmStakeToRemove, bool exit) external nonpayable nonReentrant 
returns(stablecoin address, stablecoinToRelease uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address |  | 
| coverKey | bytes32 | Enter the cover key | 
| podsToRedeem | uint256 | Enter the amount of pods to redeem | 
| npmStakeToRemove | uint256 | Enter the amount of NPM stake to remove. | 
| exit | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function preRemoveLiquidity(
    address caller,
    bytes32 coverKey,
    uint256 podsToRedeem,
    uint256 npmStakeToRemove,
    bool exit
  ) external override nonReentrant returns (address stablecoin, uint256 stablecoinToRelease) {
    s.mustNotBePaused();
    s.senderMustBeVaultContract(coverKey);
    s.mustHaveNormalCoverStatus(coverKey);
    s.mustBeDuringWithdrawalPeriod(coverKey);
    s.mustHaveNoBalanceInStrategies(coverKey, stablecoin);
    s.mustBeAccrued(coverKey);

    address pod = msg.sender; // The sender is vault contract
    return s.preRemoveLiquidityInternal(coverKey, pod, caller, podsToRedeem, npmStakeToRemove, exit);
  }
```
</details>

### postRemoveLiquidity

```solidity
function postRemoveLiquidity(address , bytes32 coverKey, uint256 , uint256 , bool ) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
|  | address |  | 
| coverKey | bytes32 |  | 
|  | uint256 |  | 
|  | uint256 |  | 
|  | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function postRemoveLiquidity(
    address, /*caller*/
    bytes32 coverKey,
    uint256, /*podsToRedeem*/
    uint256, /*npmStakeToRemove*/
    bool /*exit*/
  ) external override {
    s.senderMustBeVaultContract(coverKey);
    s.updateStateAndLiquidity(coverKey);

    // @suppress-reentrancy The `postRemoveLiquidity` hook is executed under the same context of `preRemoveLiquidity`.
  }
```
</details>

### calculatePodsImplementation

Calculates the amount of PODS to mint for the given amount of liquidity to transfer

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
function calculatePodsImplementation(bytes32 coverKey, uint256 forStablecoinUnits) external view override returns (uint256) {
    s.senderMustBeVaultContract(coverKey);

    address pod = msg.sender;

    return s.calculatePodsInternal(coverKey, pod, forStablecoinUnits);
  }
```
</details>

### calculateLiquidityImplementation

Calculates the amount of stablecoins to withdraw for the given amount of PODs to redeem

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
function calculateLiquidityImplementation(bytes32 coverKey, uint256 podsToBurn) external view override returns (uint256) {
    s.senderMustBeVaultContract(coverKey);
    address pod = msg.sender;
    return s.calculateLiquidityInternal(coverKey, pod, podsToBurn);
  }
```
</details>

### getStablecoinBalanceOfImplementation

Returns the stablecoin balance of this vault
 This also includes amounts lent out in lending strategies

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
function getStablecoinBalanceOfImplementation(bytes32 coverKey) external view override returns (uint256) {
    s.senderMustBeVaultContract(coverKey);
    return s.getStablecoinOwnedByVaultInternal(coverKey);
  }
```
</details>

### getInfoImplementation

Gets information of a given vault by the cover key

```solidity
function getInfoImplementation(bytes32 coverKey, address you) external view
returns(values uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| you | address | The address for which the info will be customized | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getInfoImplementation(bytes32 coverKey, address you) external view override returns (uint256[] memory values) {
    s.senderMustBeVaultContract(coverKey);
    address pod = msg.sender;
    return s.getInfoInternal(coverKey, pod, you);
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
    return ProtoUtilV1.CNAME_VAULT_DELEGATE;
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
