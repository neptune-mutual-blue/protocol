# StrategyLibV1.sol

View Source: [contracts/libraries/StrategyLibV1.sol](../contracts/libraries/StrategyLibV1.sol)

**StrategyLibV1**

**Events**

```js
event StrategyAdded(address indexed strategy);
```

## Functions

- [_deleteStrategy(IStore s, address toFind)](#_deletestrategy)
- [_getIsActiveStrategyKey(address strategyAddress)](#_getisactivestrategykey)
- [disableStrategyInternal(IStore s, address toFind)](#disablestrategyinternal)
- [addStrategiesInternal(IStore s, address[] strategies)](#addstrategiesinternal)
- [getLendingPeriodsInternal(IStore s, bytes32 coverKey)](#getlendingperiodsinternal)
- [setLendingPeriodsInternal(IStore s, bytes32 coverKey, uint256 lendingPeriod, uint256 withdrawalWindow)](#setlendingperiodsinternal)
- [getLendingPeriodKey(bytes32 coverKey, bool ignoreMissingKey)](#getlendingperiodkey)
- [getWithdrawalWindowKey(bytes32 coverKey, bool ignoreMissingKey)](#getwithdrawalwindowkey)
- [_addStrategy(IStore s, address deployedOn)](#_addstrategy)
- [getDisabledStrategiesInternal(IStore s)](#getdisabledstrategiesinternal)
- [getActiveStrategiesInternal(IStore s)](#getactivestrategiesinternal)
- [getStrategyOutKey(bytes32 coverKey, address token)](#getstrategyoutkey)
- [getSpecificStrategyOutKey(bytes32 coverKey, bytes32 strategyName, address token)](#getspecificstrategyoutkey)
- [getAmountInStrategies(IStore s, bytes32 coverKey, address token)](#getamountinstrategies)
- [getAmountInStrategy(IStore s, bytes32 coverKey, bytes32 strategyName, address token)](#getamountinstrategy)
- [transferToStrategyInternal(IStore s, IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount)](#transfertostrategyinternal)
- [receiveFromStrategyInternal(IStore s, IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 toReceive)](#receivefromstrategyinternal)
- [_addToStrategyOut(IStore s, bytes32 coverKey, address token, uint256 amountToAdd)](#_addtostrategyout)
- [_reduceStrategyOut(IStore s, bytes32 coverKey, address token, uint256 amount)](#_reducestrategyout)
- [_addToSpecificStrategyOut(IStore s, bytes32 coverKey, bytes32 strategyName, address token, uint256 amountToAdd)](#_addtospecificstrategyout)
- [_clearSpecificStrategyOut(IStore s, bytes32 coverKey, bytes32 strategyName, address token)](#_clearspecificstrategyout)
- [_logIncomes(IStore s, bytes32 coverKey, bytes32 strategyName, uint256 income, uint256 loss)](#_logincomes)

### _deleteStrategy

```solidity
function _deleteStrategy(IStore s, address toFind) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| toFind | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _deleteStrategy(IStore s, address toFind) private {
    bytes32 key = ProtoUtilV1.NS_LENDING_STRATEGY_ACTIVE;

    uint256 pos = s.getAddressArrayItemPosition(key, toFind);
    require(pos > 1, "Invalid strategy");

    s.deleteAddressArrayItem(key, toFind);
    s.setBoolByKey(_getIsActiveStrategyKey(toFind), false);
  }
```
</details>

### _getIsActiveStrategyKey

```solidity
function _getIsActiveStrategyKey(address strategyAddress) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| strategyAddress | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getIsActiveStrategyKey(address strategyAddress) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LENDING_STRATEGY_ACTIVE, strategyAddress));
  }
```
</details>

### disableStrategyInternal

```solidity
function disableStrategyInternal(IStore s, address toFind) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| toFind | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function disableStrategyInternal(IStore s, address toFind) external {
    // @suppress-address-trust-issue Check caller.
    _deleteStrategy(s, toFind);

    s.setAddressArrayByKey(ProtoUtilV1.NS_LENDING_STRATEGY_DISABLED, toFind);
  }
```
</details>

### addStrategiesInternal

```solidity
function addStrategiesInternal(IStore s, address[] strategies) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| strategies | address[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addStrategiesInternal(IStore s, address[] memory strategies) external {
    for (uint256 i = 0; i < strategies.length; i++) {
      address strategy = strategies[i];
      _addStrategy(s, strategy);
    }
  }
```
</details>

### getLendingPeriodsInternal

```solidity
function getLendingPeriodsInternal(IStore s, bytes32 coverKey) external view
returns(lendingPeriod uint256, withdrawalWindow uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLendingPeriodsInternal(IStore s, bytes32 coverKey) external view returns (uint256 lendingPeriod, uint256 withdrawalWindow) {
    lendingPeriod = s.getUintByKey(getLendingPeriodKey(coverKey, true));
    withdrawalWindow = s.getUintByKey(getWithdrawalWindowKey(coverKey, true));

    if (lendingPeriod == 0) {
      lendingPeriod = s.getUintByKey(getLendingPeriodKey(0, true));
      withdrawalWindow = s.getUintByKey(getWithdrawalWindowKey(0, true));
    }
  }
```
</details>

### setLendingPeriodsInternal

```solidity
function setLendingPeriodsInternal(IStore s, bytes32 coverKey, uint256 lendingPeriod, uint256 withdrawalWindow) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| lendingPeriod | uint256 |  | 
| withdrawalWindow | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setLendingPeriodsInternal(
    IStore s,
    bytes32 coverKey,
    uint256 lendingPeriod,
    uint256 withdrawalWindow
  ) external {
    s.setUintByKey(getLendingPeriodKey(coverKey, true), lendingPeriod);
    s.setUintByKey(getWithdrawalWindowKey(coverKey, true), withdrawalWindow);
  }
```
</details>

### getLendingPeriodKey

```solidity
function getLendingPeriodKey(bytes32 coverKey, bool ignoreMissingKey) public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| ignoreMissingKey | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLendingPeriodKey(bytes32 coverKey, bool ignoreMissingKey) public pure returns (bytes32) {
    if (ignoreMissingKey == false) {
      require(coverKey > 0, "Invalid Cover Key");
    }

    if (coverKey > 0) {
      return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_LIQUIDITY_LENDING_PERIOD, coverKey));
    }

    return ProtoUtilV1.NS_COVER_LIQUIDITY_LENDING_PERIOD;
  }
```
</details>

### getWithdrawalWindowKey

```solidity
function getWithdrawalWindowKey(bytes32 coverKey, bool ignoreMissingKey) public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| ignoreMissingKey | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getWithdrawalWindowKey(bytes32 coverKey, bool ignoreMissingKey) public pure returns (bytes32) {
    if (ignoreMissingKey == false) {
      require(coverKey > 0, "Invalid Cover Key");
    }

    if (coverKey > 0) {
      return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_LIQUIDITY_WITHDRAWAL_WINDOW, coverKey));
    }

    return ProtoUtilV1.NS_COVER_LIQUIDITY_WITHDRAWAL_WINDOW;
  }
```
</details>

### _addStrategy

```solidity
function _addStrategy(IStore s, address deployedOn) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| deployedOn | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _addStrategy(IStore s, address deployedOn) private {
    ILendingStrategy strategy = ILendingStrategy(deployedOn);
    require(strategy.getWeight() <= ProtoUtilV1.MULTIPLIER, "Weight too much");

    s.setBoolByKey(_getIsActiveStrategyKey(deployedOn), true);
    s.setAddressArrayByKey(ProtoUtilV1.NS_LENDING_STRATEGY_ACTIVE, deployedOn);
    emit StrategyAdded(deployedOn);
  }
```
</details>

### getDisabledStrategiesInternal

```solidity
function getDisabledStrategiesInternal(IStore s) external view
returns(strategies address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getDisabledStrategiesInternal(IStore s) external view returns (address[] memory strategies) {
    return s.getAddressArrayByKey(ProtoUtilV1.NS_LENDING_STRATEGY_DISABLED);
  }
```
</details>

### getActiveStrategiesInternal

```solidity
function getActiveStrategiesInternal(IStore s) external view
returns(strategies address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getActiveStrategiesInternal(IStore s) external view returns (address[] memory strategies) {
    return s.getAddressArrayByKey(ProtoUtilV1.NS_LENDING_STRATEGY_ACTIVE);
  }
```
</details>

### getStrategyOutKey

```solidity
function getStrategyOutKey(bytes32 coverKey, address token) public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| token | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStrategyOutKey(bytes32 coverKey, address token) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_VAULT_STRATEGY_OUT, coverKey, token));
  }
```
</details>

### getSpecificStrategyOutKey

```solidity
function getSpecificStrategyOutKey(bytes32 coverKey, bytes32 strategyName, address token) public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| strategyName | bytes32 |  | 
| token | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getSpecificStrategyOutKey(
    bytes32 coverKey,
    bytes32 strategyName,
    address token
  ) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_VAULT_STRATEGY_OUT, coverKey, strategyName, token));
  }
```
</details>

### getAmountInStrategies

```solidity
function getAmountInStrategies(IStore s, bytes32 coverKey, address token) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| token | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAmountInStrategies(
    IStore s,
    bytes32 coverKey,
    address token
  ) external view returns (uint256) {
    bytes32 k = getStrategyOutKey(coverKey, token);
    return s.getUintByKey(k);
  }
```
</details>

### getAmountInStrategy

```solidity
function getAmountInStrategy(IStore s, bytes32 coverKey, bytes32 strategyName, address token) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| strategyName | bytes32 |  | 
| token | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAmountInStrategy(
    IStore s,
    bytes32 coverKey,
    bytes32 strategyName,
    address token
  ) public view returns (uint256) {
    bytes32 k = getSpecificStrategyOutKey(coverKey, strategyName, token);
    return s.getUintByKey(k);
  }
```
</details>

### transferToStrategyInternal

```solidity
function transferToStrategyInternal(IStore s, IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| token | IERC20 |  | 
| coverKey | bytes32 |  | 
| strategyName | bytes32 |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function transferToStrategyInternal(
    IStore s,
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external {
    // @suppress-malicious-erc20 @note: token should be checked on the calling contract
    token.ensureTransfer(msg.sender, amount);
    bool isStablecoin = s.getStablecoin() == address(token) ? true : false;

    if (isStablecoin == false) {
      return;
    }

    _addToStrategyOut(s, coverKey, address(token), amount);
    _addToSpecificStrategyOut(s, coverKey, strategyName, address(token), amount);
  }
```
</details>

### receiveFromStrategyInternal

```solidity
function receiveFromStrategyInternal(IStore s, IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 toReceive) external nonpayable
returns(income uint256, loss uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| token | IERC20 |  | 
| coverKey | bytes32 |  | 
| strategyName | bytes32 |  | 
| toReceive | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function receiveFromStrategyInternal(
    IStore s,
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 toReceive
  ) external returns (uint256 income, uint256 loss) {
    // @suppress-malicious-erc20 token should be checked on the calling contract
    token.ensureTransferFrom(msg.sender, address(this), toReceive);
    bool isStablecoin = s.getStablecoin() == address(token) ? true : false;

    if (isStablecoin == false) {
      return (income, loss);
    }

    uint256 amountInThisStrategy = getAmountInStrategy(s, coverKey, strategyName, address(token));

    income = toReceive > amountInThisStrategy ? toReceive - amountInThisStrategy : 0;
    loss = toReceive < amountInThisStrategy ? amountInThisStrategy - toReceive : 0;

    _reduceStrategyOut(s, coverKey, address(token), amountInThisStrategy);
    _clearSpecificStrategyOut(s, coverKey, strategyName, address(token));

    _logIncomes(s, coverKey, strategyName, income, loss);
  }
```
</details>

### _addToStrategyOut

```solidity
function _addToStrategyOut(IStore s, bytes32 coverKey, address token, uint256 amountToAdd) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| token | address |  | 
| amountToAdd | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _addToStrategyOut(
    IStore s,
    bytes32 coverKey,
    address token,
    uint256 amountToAdd
  ) private {
    bytes32 k = getStrategyOutKey(coverKey, token);
    s.addUintByKey(k, amountToAdd);
  }
```
</details>

### _reduceStrategyOut

```solidity
function _reduceStrategyOut(IStore s, bytes32 coverKey, address token, uint256 amount) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| token | address |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _reduceStrategyOut(
    IStore s,
    bytes32 coverKey,
    address token,
    uint256 amount
  ) private {
    bytes32 k = getStrategyOutKey(coverKey, token);
    s.subtractUintByKey(k, amount);
  }
```
</details>

### _addToSpecificStrategyOut

```solidity
function _addToSpecificStrategyOut(IStore s, bytes32 coverKey, bytes32 strategyName, address token, uint256 amountToAdd) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| strategyName | bytes32 |  | 
| token | address |  | 
| amountToAdd | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _addToSpecificStrategyOut(
    IStore s,
    bytes32 coverKey,
    bytes32 strategyName,
    address token,
    uint256 amountToAdd
  ) private {
    bytes32 k = getSpecificStrategyOutKey(coverKey, strategyName, token);
    s.addUintByKey(k, amountToAdd);
  }
```
</details>

### _clearSpecificStrategyOut

```solidity
function _clearSpecificStrategyOut(IStore s, bytes32 coverKey, bytes32 strategyName, address token) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| strategyName | bytes32 |  | 
| token | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _clearSpecificStrategyOut(
    IStore s,
    bytes32 coverKey,
    bytes32 strategyName,
    address token
  ) private {
    bytes32 k = getSpecificStrategyOutKey(coverKey, strategyName, token);
    s.deleteUintByKey(k);
  }
```
</details>

### _logIncomes

```solidity
function _logIncomes(IStore s, bytes32 coverKey, bytes32 strategyName, uint256 income, uint256 loss) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| strategyName | bytes32 |  | 
| income | uint256 |  | 
| loss | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _logIncomes(
    IStore s,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 income,
    uint256 loss
  ) private {
    // Overall Income
    s.addUintByKey(ProtoUtilV1.NS_VAULT_LENDING_INCOMES, income);

    // By Cover
    s.addUintByKey(keccak256(abi.encodePacked(ProtoUtilV1.NS_VAULT_LENDING_INCOMES, coverKey)), income);

    // By Cover on This Strategy
    s.addUintByKey(keccak256(abi.encodePacked(ProtoUtilV1.NS_VAULT_LENDING_INCOMES, coverKey, strategyName)), income);

    // Overall Loss
    s.addUintByKey(ProtoUtilV1.NS_VAULT_LENDING_LOSSES, loss);

    // By Cover
    s.addUintByKey(keccak256(abi.encodePacked(ProtoUtilV1.NS_VAULT_LENDING_LOSSES, coverKey)), loss);

    // By Cover on This Strategy
    s.addUintByKey(keccak256(abi.encodePacked(ProtoUtilV1.NS_VAULT_LENDING_LOSSES, coverKey, strategyName)), loss);
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
* [ILiquidityEngine](ILiquidityEngine.md)
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
