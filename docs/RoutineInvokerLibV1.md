# RoutineInvokerLibV1.sol

View Source: [contracts/libraries/RoutineInvokerLibV1.sol](../contracts/libraries/RoutineInvokerLibV1.sol)

**RoutineInvokerLibV1**

**Enums**
### Action

```js
enum Action {
 Deposit,
 Withdraw
}
```

## Functions

- [updateStateAndLiquidityInternal(IStore s, bytes32 coverKey)](#updatestateandliquidityinternal)
- [_invoke(IStore s, bytes32 coverKey)](#_invoke)
- [_getUpdateInterval(IStore s)](#_getupdateinterval)
- [getWithdrawalInfoInternal(IStore s, bytes32 coverKey)](#getwithdrawalinfointernal)
- [_isWithdrawalPeriod(IStore s, bytes32 coverKey)](#_iswithdrawalperiod)
- [_updateWithdrawalPeriod(IStore s, bytes32 coverKey)](#_updatewithdrawalperiod)
- [isAccrualCompleteInternal(IStore s, bytes32 coverKey)](#isaccrualcompleteinternal)
- [setAccrualCompleteInternal(IStore s, bytes32 coverKey, bool flag)](#setaccrualcompleteinternal)
- [getAccrualInvocationKeyInternal(bytes32 coverKey)](#getaccrualinvocationkeyinternal)
- [getNextWithdrawalStartKeyInternal(bytes32 coverKey)](#getnextwithdrawalstartkeyinternal)
- [getNextWithdrawalEndKeyInternal(bytes32 coverKey)](#getnextwithdrawalendkeyinternal)
- [mustBeDuringWithdrawalPeriod(IStore s, bytes32 coverKey)](#mustbeduringwithdrawalperiod)
- [_executeAndGetAction(IStore s, ILendingStrategy , bytes32 coverKey)](#_executeandgetaction)
- [_canDeposit(IStore s, ILendingStrategy strategy, uint256 totalStrategies, bytes32 coverKey)](#_candeposit)
- [_invokeAssetManagement(IStore s, bytes32 coverKey)](#_invokeassetmanagement)
- [_executeStrategy(IStore s, ILendingStrategy strategy, uint256 totalStrategies, address vault, bytes32 coverKey)](#_executestrategy)
- [_depositToStrategy(ILendingStrategy strategy, bytes32 coverKey, uint256 amount)](#_deposittostrategy)
- [_withdrawAllFromStrategy(ILendingStrategy strategy, address vault, bytes32 coverKey)](#_withdrawallfromstrategy)
- [_withdrawFromDisabled(IStore s, bytes32 coverKey, address onBehalfOf)](#_withdrawfromdisabled)

### updateStateAndLiquidityInternal

```solidity
function updateStateAndLiquidityInternal(IStore s, bytes32 coverKey) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateStateAndLiquidityInternal(IStore s, bytes32 coverKey) external {
    _invoke(s, coverKey);
  }
```
</details>

### _invoke

```solidity
function _invoke(IStore s, bytes32 coverKey) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _invoke(IStore s, bytes32 coverKey) private {
    // solhint-disable-next-line
    if (s.getLastUpdatedOnInternal(coverKey) + _getUpdateInterval(s) > block.timestamp) {
      return;
    }

    PriceLibV1.setNpmPrice(s);

    if (coverKey > 0) {
      _updateWithdrawalPeriod(s, coverKey);
      _invokeAssetManagement(s, coverKey);
      s.setLastUpdatedOnInternal(coverKey);
    }
  }
```
</details>

### _getUpdateInterval

```solidity
function _getUpdateInterval(IStore s) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getUpdateInterval(IStore s) private view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_LIQUIDITY_STATE_UPDATE_INTERVAL);
  }
```
</details>

### getWithdrawalInfoInternal

```solidity
function getWithdrawalInfoInternal(IStore s, bytes32 coverKey) public view
returns(isWithdrawalPeriod bool, lendingPeriod uint256, withdrawalWindow uint256, start uint256, end uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getWithdrawalInfoInternal(IStore s, bytes32 coverKey)
    public
    view
    returns (
      bool isWithdrawalPeriod,
      uint256 lendingPeriod,
      uint256 withdrawalWindow,
      uint256 start,
      uint256 end
    )
  {
    (lendingPeriod, withdrawalWindow) = s.getRiskPoolingPeriodsInternal(coverKey);

    // Get the withdrawal period of this cover liquidity
    start = s.getUintByKey(getNextWithdrawalStartKeyInternal(coverKey));
    end = s.getUintByKey(getNextWithdrawalEndKeyInternal(coverKey));

    // solhint-disable-next-line
    if (block.timestamp >= start && block.timestamp <= end) {
      isWithdrawalPeriod = true;
    }
  }
```
</details>

### _isWithdrawalPeriod

```solidity
function _isWithdrawalPeriod(IStore s, bytes32 coverKey) private view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _isWithdrawalPeriod(IStore s, bytes32 coverKey) private view returns (bool) {
    (bool isWithdrawalPeriod, , , , ) = getWithdrawalInfoInternal(s, coverKey);
    return isWithdrawalPeriod;
  }
```
</details>

### _updateWithdrawalPeriod

```solidity
function _updateWithdrawalPeriod(IStore s, bytes32 coverKey) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _updateWithdrawalPeriod(IStore s, bytes32 coverKey) private {
    (, uint256 lendingPeriod, uint256 withdrawalWindow, uint256 start, uint256 end) = getWithdrawalInfoInternal(s, coverKey);

    // Without a lending period and withdrawal window, nothing can be updated
    if (lendingPeriod == 0 || withdrawalWindow == 0) {
      return;
    }

    // The withdrawal period is now over.
    // Deposits can be performed again.
    // Set the next withdrawal cycle
    if (block.timestamp > end) {
      // solhint-disable-previous-line

      // Next Withdrawal Cycle

      // Withdrawals can start after the lending period
      start = block.timestamp + lendingPeriod; // solhint-disable
      // Withdrawals can be performed until the end of the next withdrawal cycle
      end = start + withdrawalWindow;

      s.setUintByKey(getNextWithdrawalStartKeyInternal(coverKey), start);
      s.setUintByKey(getNextWithdrawalEndKeyInternal(coverKey), end);
      setAccrualCompleteInternal(s, coverKey, false);
    }
  }
```
</details>

### isAccrualCompleteInternal

```solidity
function isAccrualCompleteInternal(IStore s, bytes32 coverKey) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isAccrualCompleteInternal(IStore s, bytes32 coverKey) external view returns (bool) {
    return s.getBoolByKey(getAccrualInvocationKeyInternal(coverKey));
  }
```
</details>

### setAccrualCompleteInternal

```solidity
function setAccrualCompleteInternal(IStore s, bytes32 coverKey, bool flag) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| flag | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setAccrualCompleteInternal(
    IStore s,
    bytes32 coverKey,
    bool flag
  ) public {
    s.setBoolByKey(getAccrualInvocationKeyInternal(coverKey), flag);
  }
```
</details>

### getAccrualInvocationKeyInternal

Hash key of the "accrual invocation status" for the given cover.
 Warning: this function does not validate the cover key supplied.

```solidity
function getAccrualInvocationKeyInternal(bytes32 coverKey) public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAccrualInvocationKeyInternal(bytes32 coverKey) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_ACCRUAL_INVOCATION, coverKey));
  }
```
</details>

### getNextWithdrawalStartKeyInternal

Hash key of the "next withdrawal start date" for the given cover.
 Warning: this function does not validate the cover key supplied.

```solidity
function getNextWithdrawalStartKeyInternal(bytes32 coverKey) public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getNextWithdrawalStartKeyInternal(bytes32 coverKey) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LENDING_STRATEGY_WITHDRAWAL_START, coverKey));
  }
```
</details>

### getNextWithdrawalEndKeyInternal

Hash key of the "next withdrawal end date" for the given cover.
 Warning: this function does not validate the cover key supplied.

```solidity
function getNextWithdrawalEndKeyInternal(bytes32 coverKey) public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getNextWithdrawalEndKeyInternal(bytes32 coverKey) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LENDING_STRATEGY_WITHDRAWAL_END, coverKey));
  }
```
</details>

### mustBeDuringWithdrawalPeriod

```solidity
function mustBeDuringWithdrawalPeriod(IStore s, bytes32 coverKey) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeDuringWithdrawalPeriod(IStore s, bytes32 coverKey) external view {
    // Get the withdrawal period of this cover liquidity
    uint256 start = s.getUintByKey(getNextWithdrawalStartKeyInternal(coverKey));
    uint256 end = s.getUintByKey(getNextWithdrawalEndKeyInternal(coverKey));

    require(start > 0 && block.timestamp >= start, "Withdrawal period has not started");
    require(end > 0 && block.timestamp <= end, "Withdrawal period has already ended");
  }
```
</details>

### _executeAndGetAction

```solidity
function _executeAndGetAction(IStore s, ILendingStrategy , bytes32 coverKey) private nonpayable
returns(enum RoutineInvokerLibV1.Action)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
|  | ILendingStrategy |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _executeAndGetAction(
    IStore s,
    ILendingStrategy,
    bytes32 coverKey
  ) private returns (Action) {
    // If the cover is undergoing reporting, withdraw everything
    bool isNormal = s.isCoverNormalInternal(coverKey);

    if (isNormal != true) {
      // Reset the withdrawal window
      s.setUintByKey(getNextWithdrawalStartKeyInternal(coverKey), 0);
      s.setUintByKey(getNextWithdrawalEndKeyInternal(coverKey), 0);

      return Action.Withdraw;
    }

    if (_isWithdrawalPeriod(s, coverKey) == true) {
      return Action.Withdraw;
    }

    return Action.Deposit;
  }
```
</details>

### _canDeposit

```solidity
function _canDeposit(IStore s, ILendingStrategy strategy, uint256 totalStrategies, bytes32 coverKey) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| strategy | ILendingStrategy |  | 
| totalStrategies | uint256 |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _canDeposit(
    IStore s,
    ILendingStrategy strategy,
    uint256 totalStrategies,
    bytes32 coverKey
  ) private view returns (uint256) {
    IERC20 stablecoin = IERC20(s.getStablecoinAddressInternal());

    uint256 totalBalance = s.getStablecoinOwnedByVaultInternal(coverKey);
    uint256 maximumAllowed = (totalBalance * s.getMaxLendingRatioInternal()) / ProtoUtilV1.MULTIPLIER;
    uint256 allocation = maximumAllowed / totalStrategies;
    uint256 weight = strategy.getWeight();
    uint256 canDeposit = (allocation * weight) / ProtoUtilV1.MULTIPLIER;
    uint256 alreadyDeposited = s.getAmountInStrategyInternal(coverKey, strategy.getName(), address(stablecoin));

    if (alreadyDeposited >= canDeposit) {
      return 0;
    }

    return canDeposit - alreadyDeposited;
  }
```
</details>

### _invokeAssetManagement

```solidity
function _invokeAssetManagement(IStore s, bytes32 coverKey) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _invokeAssetManagement(IStore s, bytes32 coverKey) private {
    address vault = s.getVaultAddress(coverKey);
    _withdrawFromDisabled(s, coverKey, vault);

    address[] memory strategies = s.getActiveStrategiesInternal();

    for (uint256 i = 0; i < strategies.length; i++) {
      ILendingStrategy strategy = ILendingStrategy(strategies[i]);
      _executeStrategy(s, strategy, strategies.length, vault, coverKey);
    }
  }
```
</details>

### _executeStrategy

```solidity
function _executeStrategy(IStore s, ILendingStrategy strategy, uint256 totalStrategies, address vault, bytes32 coverKey) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| strategy | ILendingStrategy |  | 
| totalStrategies | uint256 |  | 
| vault | address |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _executeStrategy(
    IStore s,
    ILendingStrategy strategy,
    uint256 totalStrategies,
    address vault,
    bytes32 coverKey
  ) private {
    uint256 canDeposit = _canDeposit(s, strategy, totalStrategies, coverKey);
    uint256 balance = IERC20(s.getStablecoinAddressInternal()).balanceOf(vault);

    if (canDeposit > balance) {
      canDeposit = balance;
    }

    Action action = _executeAndGetAction(s, strategy, coverKey);

    if (action == Action.Deposit && canDeposit == 0) {
      return;
    }

    if (action == Action.Withdraw) {
      _withdrawAllFromStrategy(strategy, vault, coverKey);
      return;
    }

    _depositToStrategy(strategy, coverKey, canDeposit);
  }
```
</details>

### _depositToStrategy

```solidity
function _depositToStrategy(ILendingStrategy strategy, bytes32 coverKey, uint256 amount) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| strategy | ILendingStrategy |  | 
| coverKey | bytes32 |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _depositToStrategy(
    ILendingStrategy strategy,
    bytes32 coverKey,
    uint256 amount
  ) private {
    strategy.deposit(coverKey, amount);
  }
```
</details>

### _withdrawAllFromStrategy

```solidity
function _withdrawAllFromStrategy(ILendingStrategy strategy, address vault, bytes32 coverKey) private nonpayable
returns(stablecoinWithdrawn uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| strategy | ILendingStrategy |  | 
| vault | address |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _withdrawAllFromStrategy(
    ILendingStrategy strategy,
    address vault,
    bytes32 coverKey
  ) private returns (uint256 stablecoinWithdrawn) {
    uint256 balance = IERC20(strategy.getDepositCertificate()).balanceOf(vault);

    if (balance > 0) {
      stablecoinWithdrawn = strategy.withdraw(coverKey);
    }
  }
```
</details>

### _withdrawFromDisabled

```solidity
function _withdrawFromDisabled(IStore s, bytes32 coverKey, address onBehalfOf) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| onBehalfOf | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _withdrawFromDisabled(
    IStore s,
    bytes32 coverKey,
    address onBehalfOf
  ) private {
    address[] memory strategies = s.getDisabledStrategiesInternal();

    for (uint256 i = 0; i < strategies.length; i++) {
      ILendingStrategy strategy = ILendingStrategy(strategies[i]);
      uint256 balance = IERC20(strategy.getDepositCertificate()).balanceOf(onBehalfOf);

      if (balance > 0) {
        strategy.withdraw(coverKey);
      }
    }
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
* [INeptuneRouterV1](INeptuneRouterV1.md)
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
* [NeptuneRouterV1](NeptuneRouterV1.md)
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
