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
- [updateStateAndLiquidity(IStore s, bytes32 key, address token)](#updatestateandliquidity)
- [_invoke(IStore s, bytes32 key, address token)](#_invoke)
- [_executeIsWithdrawalPeriod(IStore s, bytes32 coverKey)](#_executeiswithdrawalperiod)
- [_getNextWithdrawalStartKey(bytes32 coverKey)](#_getnextwithdrawalstartkey)
- [_getNextWithdrawalEndKey(bytes32 coverKey)](#_getnextwithdrawalendkey)
- [_executeAndGetAction(IStore s, ILendingStrategy , bytes32 coverKey)](#_executeandgetaction)
- [_canDeposit(IStore s, ILendingStrategy strategy, uint256 totalStrategies, bytes32 key)](#_candeposit)
- [_getTotalInDeposits(IStore s, ILendingStrategy strategy, bytes32 key)](#_gettotalindeposits)
- [_invokeAssetManagement(IStore s, bytes32 key)](#_invokeassetmanagement)
- [_executeStrategy(IStore s, ILendingStrategy strategy, uint256 totalStrategies, address vault, bytes32 key)](#_executestrategy)
- [_setDeposit(IStore s, bytes32 key, ILendingStrategy strategy, uint256 amount)](#_setdeposit)
- [_clearDeposits(IStore s, bytes32 key, ILendingStrategy strategy, uint256 withdrawn)](#_cleardeposits)
- [_getStrategyDepositKey(bytes32 key, ILendingStrategy strategy)](#_getstrategydepositkey)
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

### updateStateAndLiquidity

```solidity
function updateStateAndLiquidity(IStore s, bytes32 key, address token) external nonpayable
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
function updateStateAndLiquidity(
    IStore s,
    bytes32 key,
    address token
  ) external {
    _invoke(s, key, token);
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
    _updateKnownTokenPrices(s, token);

    if (key > 0) {
      _invokeAssetManagement(s, key);
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
    (uint256 lendingPeriod, uint256 withdrawalWindow) = s.getLendingPeriodsInternal(coverKey);

    // Without a lending period and withdrawal window, deposit is not possible
    if (lendingPeriod == 0 || withdrawalWindow == 0) {
      return true;
    }

    // Get the withdrawal period of this cover liquidity
    uint256 start = s.getUintByKey(_getNextWithdrawalStartKey(coverKey));
    uint256 end = s.getUintByKey(_getNextWithdrawalEndKey(coverKey));

    // solhint-disable-next-line
    if (block.timestamp >= start && block.timestamp <= end) {
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

      s.setUintByKey(_getNextWithdrawalStartKey(coverKey), start);
      s.setUintByKey(_getNextWithdrawalEndKey(coverKey), end);
    }

    return false;
  }
```
</details>

### _getNextWithdrawalStartKey

```solidity
function _getNextWithdrawalStartKey(bytes32 coverKey) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getNextWithdrawalStartKey(bytes32 coverKey) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LENDING_STRATEGY_WITHDRAWAL_START, coverKey));
  }
```
</details>

### _getNextWithdrawalEndKey

```solidity
function _getNextWithdrawalEndKey(bytes32 coverKey) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getNextWithdrawalEndKey(bytes32 coverKey) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LENDING_STRATEGY_WITHDRAWAL_END, coverKey));
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
      s.setUintByKey(_getNextWithdrawalStartKey(coverKey), 0);
      s.setUintByKey(_getNextWithdrawalEndKey(coverKey), 0);

      return Action.Withdraw;
    }

    if (_executeIsWithdrawalPeriod(s, coverKey)) {
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

    uint256 maximumAllowed = (stablecoin.balanceOf(vault) * StrategyLibV1.MAX_LENDING_RATIO) / ProtoUtilV1.MULTIPLIER;
    uint256 allocation = maximumAllowed / totalStrategies;
    uint256 weight = strategy.getWeight();
    uint256 canDeposit = (allocation * weight) / ProtoUtilV1.MULTIPLIER;
    uint256 alreadyDeposited = _getTotalInDeposits(s, strategy, key);

    if (alreadyDeposited >= canDeposit) {
      return 0;
    }

    return canDeposit - alreadyDeposited;
  }
```
</details>

### _getTotalInDeposits

```solidity
function _getTotalInDeposits(IStore s, ILendingStrategy strategy, bytes32 key) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| strategy | ILendingStrategy |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getTotalInDeposits(
    IStore s,
    ILendingStrategy strategy,
    bytes32 key
  ) private view returns (uint256) {
    bytes32 k = _getStrategyDepositKey(key, strategy);
    return s.getUintByKey(k);
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
      uint256 stablecoinWithdrawn = _withdrawAllFromStrategy(strategy, vault, key);
      _clearDeposits(s, key, strategy, stablecoinWithdrawn);
    } else {
      _depositToStrategy(strategy, key, canDeposit);
      _setDeposit(s, key, strategy, canDeposit);
    }
  }
```
</details>

### _setDeposit

```solidity
function _setDeposit(IStore s, bytes32 key, ILendingStrategy strategy, uint256 amount) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| strategy | ILendingStrategy |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _setDeposit(
    IStore s,
    bytes32 key,
    ILendingStrategy strategy,
    uint256 amount
  ) private {
    bytes32 k = _getStrategyDepositKey(key, strategy);
    s.addUintByKey(k, amount);
    s.addUintByKey(CoverUtilV1.getCoverTotalLentKey(key), amount);
  }
```
</details>

### _clearDeposits

```solidity
function _clearDeposits(IStore s, bytes32 key, ILendingStrategy strategy, uint256 withdrawn) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| strategy | ILendingStrategy |  | 
| withdrawn | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _clearDeposits(
    IStore s,
    bytes32 key,
    ILendingStrategy strategy,
    uint256 withdrawn
  ) private {
    uint256 deposited = _getTotalInDeposits(s, strategy, key);
    uint256 difference = 0;

    if (deposited >= withdrawn) {
      difference = deposited - withdrawn;
      s.subtractUint(CoverUtilV1.getCoverLiquidityKey(key), difference);
    } else {
      difference = withdrawn - deposited;
      s.addUint(CoverUtilV1.getCoverLiquidityKey(key), difference);
    }

    bytes32 k = _getStrategyDepositKey(key, strategy);
    s.deleteUintByKey(k);

    s.subtractUintByKey(CoverUtilV1.getCoverTotalLentKey(key), deposited);
  }
```
</details>

### _getStrategyDepositKey

```solidity
function _getStrategyDepositKey(bytes32 key, ILendingStrategy strategy) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| strategy | ILendingStrategy |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getStrategyDepositKey(bytes32 key, ILendingStrategy strategy) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LENDING_STRATEGY_DEPOSITS, key, strategy.getKey()));
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
