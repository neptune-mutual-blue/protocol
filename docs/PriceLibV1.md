# PriceLibV1.sol

View Source: [contracts/libraries/PriceLibV1.sol](../contracts/libraries/PriceLibV1.sol)

**PriceLibV1**

## Contract Members
**Constants & Variables**

```js
uint256 public constant UPDATE_INTERVAL;

```

## Functions

- [setTokenPriceInStablecoinInternal(IStore s, address token)](#settokenpriceinstablecoininternal)
- [setTokenPriceInternal(IStore s, address token, address stablecoin)](#settokenpriceinternal)
- [getLastKnownPairInfoInternal(IStore s, IUniswapV2PairLike pair)](#getlastknownpairinfointernal)
- [_setTokenPrice(IStore s, address token, address stablecoin, IUniswapV2PairLike pair)](#_settokenprice)
- [getPairLiquidityInStablecoin(IStore s, IUniswapV2PairLike pair, uint256 lpTokens)](#getpairliquidityinstablecoin)
- [getLastUpdateOnInternal(IStore s, address token, address liquidityToken)](#getlastupdateoninternal)
- [_setLastUpdateOn(IStore s, address token, address liquidityToken)](#_setlastupdateon)
- [_getLastUpdateKey(address token0, address token1)](#_getlastupdatekey)
- [getPriceInternal(IStore s, address token, address stablecoin, uint256 multiplier)](#getpriceinternal)
- [getNpmPriceInternal(IStore s, uint256 multiplier)](#getnpmpriceinternal)
- [_getReserve0Key(IUniswapV2PairLike pair)](#_getreserve0key)
- [_getReserve1Key(IUniswapV2PairLike pair)](#_getreserve1key)
- [_getPairTotalSupplyKey(IUniswapV2PairLike pair)](#_getpairtotalsupplykey)
- [_getPair(IStore s, address token, address stablecoin)](#_getpair)

### setTokenPriceInStablecoinInternal

```solidity
function setTokenPriceInStablecoinInternal(IStore s, address token) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| token | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setTokenPriceInStablecoinInternal(IStore s, address token) internal {
    if (token == address(0)) {
      return;
    }

    address stablecoin = s.getStablecoin();
    setTokenPriceInternal(s, token, stablecoin);
  }
```
</details>

### setTokenPriceInternal

```solidity
function setTokenPriceInternal(IStore s, address token, address stablecoin) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| token | address |  | 
| stablecoin | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setTokenPriceInternal(
    IStore s,
    address token,
    address stablecoin
  ) internal {
    IUniswapV2PairLike pair = _getPair(s, token, stablecoin);
    _setTokenPrice(s, token, stablecoin, pair);
  }
```
</details>

### getLastKnownPairInfoInternal

Returns the last persisted pair info

```solidity
function getLastKnownPairInfoInternal(IStore s, IUniswapV2PairLike pair) public view
returns(values uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Provide store instance | 
| pair | IUniswapV2PairLike | Provide pair instance | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLastKnownPairInfoInternal(IStore s, IUniswapV2PairLike pair) public view returns (uint256[] memory values) {
    values = new uint256[](3);

    values[0] = s.getUintByKey(_getReserve0Key(pair));
    values[1] = s.getUintByKey(_getReserve1Key(pair));
    values[2] = s.getUintByKey(_getPairTotalSupplyKey(pair));
  }
```
</details>

### _setTokenPrice

```solidity
function _setTokenPrice(IStore s, address token, address stablecoin, IUniswapV2PairLike pair) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| token | address |  | 
| stablecoin | address |  | 
| pair | IUniswapV2PairLike |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _setTokenPrice(
    IStore s,
    address token,
    address stablecoin,
    IUniswapV2PairLike pair
  ) private {
    if (token == stablecoin) {
      return;
    }

    // solhint-disable-next-line
    if (getLastUpdateOnInternal(s, token, stablecoin) + UPDATE_INTERVAL > block.timestamp) {
      return;
    }

    (uint112 reserve0, uint112 reserve1, ) = pair.getReserves();

    s.setUintByKey(_getReserve0Key(pair), reserve0);
    s.setUintByKey(_getReserve1Key(pair), reserve1);
    s.setUintByKey(_getPairTotalSupplyKey(pair), pair.totalSupply());

    _setLastUpdateOn(s, token, stablecoin);
  }
```
</details>

### getPairLiquidityInStablecoin

```solidity
function getPairLiquidityInStablecoin(IStore s, IUniswapV2PairLike pair, uint256 lpTokens) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| pair | IUniswapV2PairLike |  | 
| lpTokens | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getPairLiquidityInStablecoin(
    IStore s,
    IUniswapV2PairLike pair,
    uint256 lpTokens
  ) external view returns (uint256) {
    uint256[] memory values = getLastKnownPairInfoInternal(s, pair);
    uint256 reserve0 = values[0];
    uint256 reserve1 = values[1];
    uint256 supply = values[2];

    address stablecoin = s.getStablecoin();

    if (pair.token0() == stablecoin) {
      return (2 * reserve0 * lpTokens) / supply;
    }

    return (2 * reserve1 * lpTokens) / supply;
  }
```
</details>

### getLastUpdateOnInternal

```solidity
function getLastUpdateOnInternal(IStore s, address token, address liquidityToken) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| token | address |  | 
| liquidityToken | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLastUpdateOnInternal(
    IStore s,
    address token,
    address liquidityToken
  ) public view returns (uint256) {
    bytes32 key = _getLastUpdateKey(token, liquidityToken);
    return s.getUintByKey(key);
  }
```
</details>

### _setLastUpdateOn

```solidity
function _setLastUpdateOn(IStore s, address token, address liquidityToken) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| token | address |  | 
| liquidityToken | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _setLastUpdateOn(
    IStore s,
    address token,
    address liquidityToken
  ) private {
    bytes32 key = _getLastUpdateKey(token, liquidityToken);
    s.setUintByKey(key, block.timestamp);
  }
```
</details>

### _getLastUpdateKey

```solidity
function _getLastUpdateKey(address token0, address token1) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| token0 | address |  | 
| token1 | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getLastUpdateKey(address token0, address token1) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_TOKEN_PRICE_LAST_UPDATE, token0, token1));
  }
```
</details>

### getPriceInternal

```solidity
function getPriceInternal(IStore s, address token, address stablecoin, uint256 multiplier) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| token | address |  | 
| stablecoin | address |  | 
| multiplier | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getPriceInternal(
    IStore s,
    address token,
    address stablecoin,
    uint256 multiplier
  ) public view returns (uint256) {
    IUniswapV2PairLike pair = _getPair(s, token, stablecoin);

    (uint256 reserve0, uint256 reserve1, ) = pair.getReserves();

    uint256 unitValue = (reserve0 * multiplier) / reserve1;

    if (pair.token1() == stablecoin) {
      unitValue = (reserve1 * multiplier) / reserve0;
    }

    return unitValue;
  }
```
</details>

### getNpmPriceInternal

```solidity
function getNpmPriceInternal(IStore s, uint256 multiplier) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| multiplier | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getNpmPriceInternal(IStore s, uint256 multiplier) external view returns (uint256) {
    return getPriceInternal(s, s.getNpmTokenAddress(), s.getStablecoin(), multiplier);
  }
```
</details>

### _getReserve0Key

```solidity
function _getReserve0Key(IUniswapV2PairLike pair) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| pair | IUniswapV2PairLike |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getReserve0Key(IUniswapV2PairLike pair) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LP_RESERVE0, pair));
  }
```
</details>

### _getReserve1Key

```solidity
function _getReserve1Key(IUniswapV2PairLike pair) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| pair | IUniswapV2PairLike |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getReserve1Key(IUniswapV2PairLike pair) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LP_RESERVE1, pair));
  }
```
</details>

### _getPairTotalSupplyKey

```solidity
function _getPairTotalSupplyKey(IUniswapV2PairLike pair) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| pair | IUniswapV2PairLike |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getPairTotalSupplyKey(IUniswapV2PairLike pair) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LP_TOTAL_SUPPLY, pair));
  }
```
</details>

### _getPair

```solidity
function _getPair(IStore s, address token, address stablecoin) private view
returns(contract IUniswapV2PairLike)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| token | address |  | 
| stablecoin | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getPair(
    IStore s,
    address token,
    address stablecoin
  ) private view returns (IUniswapV2PairLike) {
    IUniswapV2FactoryLike factory = IUniswapV2FactoryLike(s.getUniswapV2Factory());
    IUniswapV2PairLike pair = IUniswapV2PairLike(factory.getPair(token, stablecoin));

    return pair;
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
