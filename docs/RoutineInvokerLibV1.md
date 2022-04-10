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

- [updateStateAndLiquidity(IStore s, bytes32 key)](#updatestateandliquidity)
- [_invoke(IStore s, bytes32 key, address token)](#_invoke)
- [_getUpdateInterval(IStore s)](#_getupdateinterval)
- [getWithdrawalInfoInternal(IStore s, bytes32 coverKey)](#getwithdrawalinfointernal)
- [_executeIsWithdrawalPeriod(IStore s, bytes32 coverKey)](#_executeiswithdrawalperiod)
- [isAccrualCompleteInternal(IStore s, bytes32 coverKey)](#isaccrualcompleteinternal)
- [setAccrualCompleteInternal(IStore s, bytes32 coverKey, bool flag)](#setaccrualcompleteinternal)
- [getAccrualInvocationKey(bytes32 coverKey)](#getaccrualinvocationkey)
- [getNextWithdrawalStartKey(bytes32 coverKey)](#getnextwithdrawalstartkey)
- [getNextWithdrawalEndKey(bytes32 coverKey)](#getnextwithdrawalendkey)
- [mustBeDuringWithdrawalPeriod(IStore s, bytes32 coverKey)](#mustbeduringwithdrawalperiod)
- [_executeAndGetAction(IStore s, ILendingStrategy , bytes32 coverKey)](#_executeandgetaction)
- [_canDeposit(IStore s, ILendingStrategy strategy, uint256 totalStrategies, bytes32 key)](#_candeposit)
- [_invokeAssetManagement(IStore s, bytes32 key)](#_invokeassetmanagement)
- [_executeStrategy(IStore s, ILendingStrategy strategy, uint256 totalStrategies, address vault, bytes32 key)](#_executestrategy)
- [_depositToStrategy(ILendingStrategy strategy, bytes32 key, uint256 amount)](#_deposittostrategy)
- [_withdrawAllFromStrategy(ILendingStrategy strategy, address vault, bytes32 key)](#_withdrawallfromstrategy)
- [_withdrawFromDisabled(IStore s, bytes32 key, address onBehalfOf)](#_withdrawfromdisabled)
- [_updateKnownTokenPrices(IStore s, address token)](#_updateknowntokenprices)

### updateStateAndLiquidity

```solidity
function updateStateAndLiquidity(IStore s, bytes32 key) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateStateAndLiquidity(IStore s, bytes32 key) external {
    _invoke(s, key, address(0));
  }
```
</details>

### _invoke

```solidity
function _invoke(IStore s, bytes32 key, address token) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| token | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _invoke(
    IStore s,
    bytes32 key,
    address token
  ) private {
    // solhint-disable-next-line
    if (s.getLastUpdateOnInternal() + _getUpdateInterval(s) > block.timestamp) {
      return;
    }

    _updateKnownTokenPrices(s, token);

    if (key > 0) {
      _invokeAssetManagement(s, key);
    }

    s.setLastUpdateOn();
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
    (lendingPeriod, withdrawalWindow) = s.getLendingPeriodsInternal(coverKey);

    // Get the withdrawal period of this cover liquidity
    start = s.getUintByKey(getNextWithdrawalStartKey(coverKey));
    end = s.getUintByKey(getNextWithdrawalEndKey(coverKey));

    // solhint-disable-next-line
    if (block.timestamp >= start && block.timestamp <= end) {
      isWithdrawalPeriod = true;
    }
  }
```
</details>

### _executeIsWithdrawalPeriod

```solidity
function _executeIsWithdrawalPeriod(IStore s, bytes32 coverKey) private nonpayable
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
function _executeIsWithdrawalPeriod(IStore s, bytes32 coverKey) private returns (bool) {
    (bool isWithdrawalPeriod, uint256 lendingPeriod, uint256 withdrawalWindow, uint256 start, uint256 end) = getWithdrawalInfoInternal(s, coverKey);

    // Without a lending period and withdrawal window, deposit is not possible
    if (lendingPeriod == 0 || withdrawalWindow == 0) {
      return true;
    }

    if (isWithdrawalPeriod) {
      return true;
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

      s.setUintByKey(getNextWithdrawalStartKey(coverKey), start);
      s.setUintByKey(getNextWithdrawalEndKey(coverKey), end);
      setAccrualCompleteInternal(s, coverKey, false);
    }

    return false;
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
    return s.getBoolByKey(getAccrualInvocationKey(coverKey));
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
    s.setBoolByKey(getAccrualInvocationKey(coverKey), flag);
  }
```
</details>

### getAccrualInvocationKey

```solidity
function getAccrualInvocationKey(bytes32 coverKey) public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAccrualInvocationKey(bytes32 coverKey) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_ACCRUAL_INVOCATION, coverKey));
  }
```
</details>

### getNextWithdrawalStartKey

```solidity
function getNextWithdrawalStartKey(bytes32 coverKey) public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getNextWithdrawalStartKey(bytes32 coverKey) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LENDING_STRATEGY_WITHDRAWAL_START, coverKey));
  }
```
</details>

### getNextWithdrawalEndKey

```solidity
function getNextWithdrawalEndKey(bytes32 coverKey) public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getNextWithdrawalEndKey(bytes32 coverKey) public pure returns (bytes32) {
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
    uint256 start = s.getUintByKey(getNextWithdrawalStartKey(coverKey));
    uint256 end = s.getUintByKey(getNextWithdrawalEndKey(coverKey));

    require(block.timestamp >= start, "Withdrawal period has not started");
    require(block.timestamp < end, "Withdrawal period has already ended");
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
    CoverUtilV1.CoverStatus status = s.getCoverStatus(coverKey);

    if (status != CoverUtilV1.CoverStatus.Normal) {
      // Reset the withdrawal window
      s.setUintByKey(getNextWithdrawalStartKey(coverKey), 0);
      s.setUintByKey(getNextWithdrawalEndKey(coverKey), 0);

      return Action.Withdraw;
    }

    if (_executeIsWithdrawalPeriod(s, coverKey) == true) {
      return Action.Withdraw;
    }

    return Action.Deposit;
  }
```
</details>

### _canDeposit

```solidity
function _canDeposit(IStore s, ILendingStrategy strategy, uint256 totalStrategies, bytes32 key) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| strategy | ILendingStrategy |  | 
| totalStrategies | uint256 |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _canDeposit(
    IStore s,
    ILendingStrategy strategy,
    uint256 totalStrategies,
    bytes32 key
  ) private view returns (uint256) {
    address vault = s.getVaultAddress(key);
    IERC20 stablecoin = IERC20(s.getStablecoin());

    uint256 maximumAllowed = (stablecoin.balanceOf(vault) * s.getMaxLendingRatioInternal()) / ProtoUtilV1.MULTIPLIER;
    uint256 allocation = maximumAllowed / totalStrategies;
    uint256 weight = strategy.getWeight();
    uint256 canDeposit = (allocation * weight) / ProtoUtilV1.MULTIPLIER;
    uint256 alreadyDeposited = s.getAmountInStrategy(key, strategy.getName(), address(stablecoin));

    if (alreadyDeposited >= canDeposit) {
      return 0;
    }

    return canDeposit - alreadyDeposited;
  }
```
</details>

### _invokeAssetManagement

```solidity
function _invokeAssetManagement(IStore s, bytes32 key) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _invokeAssetManagement(IStore s, bytes32 key) private {
    address vault = s.getVaultAddress(key);
    _withdrawFromDisabled(s, key, vault);

    address[] memory strategies = s.getActiveStrategiesInternal();

    for (uint256 i = 0; i < strategies.length; i++) {
      ILendingStrategy strategy = ILendingStrategy(strategies[i]);
      _executeStrategy(s, strategy, strategies.length, vault, key);
    }
  }
```
</details>

### _executeStrategy

```solidity
function _executeStrategy(IStore s, ILendingStrategy strategy, uint256 totalStrategies, address vault, bytes32 key) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| strategy | ILendingStrategy |  | 
| totalStrategies | uint256 |  | 
| vault | address |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _executeStrategy(
    IStore s,
    ILendingStrategy strategy,
    uint256 totalStrategies,
    address vault,
    bytes32 key
  ) private {
    uint256 canDeposit = _canDeposit(s, strategy, totalStrategies, key);
    uint256 balance = IERC20(s.getStablecoin()).balanceOf(vault);

    if (canDeposit > balance) {
      canDeposit = balance;
    }

    Action action = _executeAndGetAction(s, strategy, key);

    if (action == Action.Deposit && canDeposit == 0) {
      return;
    }

    if (action == Action.Withdraw) {
      _withdrawAllFromStrategy(strategy, vault, key);
    } else {
      _depositToStrategy(strategy, key, canDeposit);
    }
  }
```
</details>

### _depositToStrategy

```solidity
function _depositToStrategy(ILendingStrategy strategy, bytes32 key, uint256 amount) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| strategy | ILendingStrategy |  | 
| key | bytes32 |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _depositToStrategy(
    ILendingStrategy strategy,
    bytes32 key,
    uint256 amount
  ) private {
    strategy.deposit(key, amount);
  }
```
</details>

### _withdrawAllFromStrategy

```solidity
function _withdrawAllFromStrategy(ILendingStrategy strategy, address vault, bytes32 key) private nonpayable
returns(stablecoinWithdrawn uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| strategy | ILendingStrategy |  | 
| vault | address |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _withdrawAllFromStrategy(
    ILendingStrategy strategy,
    address vault,
    bytes32 key
  ) private returns (uint256 stablecoinWithdrawn) {
    uint256 balance = IERC20(strategy.getDepositCertificate()).balanceOf(vault);

    if (balance > 0) {
      stablecoinWithdrawn = strategy.withdraw(key);
    }
  }
```
</details>

### _withdrawFromDisabled

```solidity
function _withdrawFromDisabled(IStore s, bytes32 key, address onBehalfOf) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| onBehalfOf | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _withdrawFromDisabled(
    IStore s,
    bytes32 key,
    address onBehalfOf
  ) private {
    address[] memory strategies = s.getDisabledStrategiesInternal();

    for (uint256 i = 0; i < strategies.length; i++) {
      ILendingStrategy strategy = ILendingStrategy(strategies[i]);
      uint256 balance = IERC20(strategy.getDepositCertificate()).balanceOf(onBehalfOf);

      if (balance > 0) {
        strategy.withdraw(key);
      }
    }
  }
```
</details>

### _updateKnownTokenPrices

```solidity
function _updateKnownTokenPrices(IStore s, address token) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| token | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _updateKnownTokenPrices(IStore s, address token) private {
    address npm = s.getNpmTokenAddress();

    if (token != address(0) && token != npm) {
      PriceLibV1.setTokenPriceInStablecoinInternal(s, token);
    }

    PriceLibV1.setTokenPriceInStablecoinInternal(s, npm);
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
