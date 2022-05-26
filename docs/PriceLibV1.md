# PriceLibV1.sol

View Source: [contracts/libraries/PriceLibV1.sol](../contracts/libraries/PriceLibV1.sol)

**PriceLibV1**

## Functions

- [setTokenPriceInStablecoinInternal(IStore s, address token)](#settokenpriceinstablecoininternal)
- [setTokenPriceInternal(IStore s, address token, address stablecoin)](#settokenpriceinternal)
- [getLastKnownPairInfoInternal(IStore s, IUniswapV2PairLike pair)](#getlastknownpairinfointernal)
- [_setTokenPrice(IStore s, address token, address stablecoin, IUniswapV2PairLike pair)](#_settokenprice)
- [getPairLiquidityInStablecoin(IStore s, IUniswapV2PairLike pair, uint256 lpTokens)](#getpairliquidityinstablecoin)
- [getLastUpdateOnInternal(IStore s, bytes32 coverKey)](#getlastupdateoninternal)
- [setLastUpdateOn(IStore s, bytes32 coverKey)](#setlastupdateon)
- [getLastUpdateKey(bytes32 coverKey)](#getlastupdatekey)
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

    (uint112 reserve0, uint112 reserve1, ) = pair.getReserves();

    s.setUintByKey(_getReserve0Key(pair), reserve0);
    s.setUintByKey(_getReserve1Key(pair), reserve1);
    s.setUintByKey(_getPairTotalSupplyKey(pair), pair.totalSupply());
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

    require(supply > 0, "Invalid pair or price not updated"); // solhint-disable-line

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
function getLastUpdateOnInternal(IStore s, bytes32 coverKey) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLastUpdateOnInternal(IStore s, bytes32 coverKey) external view returns (uint256) {
    bytes32 key = getLastUpdateKey(coverKey);
    return s.getUintByKey(key);
  }
```
</details>

### setLastUpdateOn

```solidity
function setLastUpdateOn(IStore s, bytes32 coverKey) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setLastUpdateOn(IStore s, bytes32 coverKey) external {
    bytes32 key = getLastUpdateKey(coverKey);
    s.setUintByKey(key, block.timestamp); // solhint-disable-line
  }
```
</details>

### getLastUpdateKey

```solidity
function getLastUpdateKey(bytes32 coverKey) public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLastUpdateKey(bytes32 coverKey) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LAST_LIQUIDITY_STATE_UPDATE, coverKey));
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
    IUniswapV2RouterLike router = IUniswapV2RouterLike(s.getUniswapV2Router());

    uint256[] memory values = getLastKnownPairInfoInternal(s, pair);
    uint256 reserve0 = values[0];
    uint256 reserve1 = values[1];

    if (pair.token0() == stablecoin) {
      return router.getAmountIn(multiplier, reserve0, reserve1);
    }

    return router.getAmountIn(multiplier, reserve1, reserve0);
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
* [IPriceDiscovery](IPriceDiscovery.md)
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
* [NPMDistributor](NPMDistributor.md)
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
