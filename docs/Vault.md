# Cover Vault for Liquidity (Vault.sol)

View Source: [contracts/core/liquidity/Vault.sol](../contracts/core/liquidity/Vault.sol)

**↗ Extends: [VaultPod](VaultPod.md)**

**Vault**

Liquidity providers can earn fees by adding stablecoin liquidity
 to any cover contract. The cover pool is collectively owned by liquidity providers
 where fees automatically get accumulated and compounded. <br /> <br />
 **Fees** <br />
 - Cover fees paid in stablecoin get added to the liquidity pool.
 - The protocol supplies a small portion of idle assets to lending protocols (v2).
 - Flash loan interest also gets added back to the pool.
 - To protect liquidity providers from cover incidents, they can redeem upto 25% of the cover payouts through NEP provision.
 - To protect liquidity providers from cover incidents, they can redeem upto 25% of the cover payouts through `assurance token` allocation.

**Events**

```js
event LiquidityAdded(bytes32  key, uint256  amount);
event LiquidityRemoved(bytes32  key, uint256  amount);
```

## Modifiers

- [onlyFromCover](#onlyfromcover)
- [onlyValidCover](#onlyvalidcover)

### onlyFromCover

Ensures the caller to be the cover contract

```js
modifier onlyFromCover() internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### onlyValidCover

```js
modifier onlyValidCover() internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

## Functions

- [constructor(IStore store, bytes32 coverKey, IERC20 liquidityToken)](#)
- [addLiquidityInternal(bytes32 coverKey, address account, uint256 amount)](#addliquidityinternal)
- [addLiquidity(bytes32 coverKey, uint256 amount)](#addliquidity)
- [removeLiquidity(bytes32 coverKey, uint256 amount)](#removeliquidity)
- [_addLiquidity(bytes32 coverKey, address account, uint256 amount)](#_addliquidity)
- [version()](#version)
- [getName()](#getname)

### 

```js
function (IStore store, bytes32 coverKey, IERC20 liquidityToken) public nonpayable VaultPod 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore |  | 
| coverKey | bytes32 |  | 
| liquidityToken | IERC20 |  | 

### addLiquidityInternal

Adds liquidity to the specified cover contract

```js
function addLiquidityInternal(bytes32 coverKey, address account, uint256 amount) external nonpayable onlyValidCover onlyFromCover nonReentrant whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| account | address | Specify the account on behalf of which the liquidity is being added. | 
| amount | uint256 | Enter the amount of liquidity token to supply. | 

### addLiquidity

Adds liquidity to the specified cover contract

```js
function addLiquidity(bytes32 coverKey, uint256 amount) external nonpayable onlyValidCover nonReentrant whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| amount | uint256 | Enter the amount of liquidity token to supply. | 

### removeLiquidity

Removes liquidity from the specified cover contract

```js
function removeLiquidity(bytes32 coverKey, uint256 amount) external nonpayable onlyValidCover nonReentrant whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| amount | uint256 | Enter the amount of liquidity token to remove. | 

### _addLiquidity

Adds liquidity to the specified cover contract

```js
function _addLiquidity(bytes32 coverKey, address account, uint256 amount) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| account | address | Specify the account on behalf of which the liquidity is being added. | 
| amount | uint256 | Enter the amount of liquidity token to supply. | 

### version

```js
function version() external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getName

```js
function getName() public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

## Contracts

* [Address](Address.md)
* [Commission](Commission.md)
* [Context](Context.md)
* [Controller](Controller.md)
* [Cover](Cover.md)
* [CoverAssurance](CoverAssurance.md)
* [CoverBase](CoverBase.md)
* [CoverProvision](CoverProvision.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [ERC20](ERC20.md)
* [Factory](Factory.md)
* [Governance](Governance.md)
* [ICommission](ICommission.md)
* [ICover](ICover.md)
* [ICoverAssurance](ICoverAssurance.md)
* [ICoverStake](ICoverStake.md)
* [IERC20](IERC20.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IMember](IMember.md)
* [IPolicy](IPolicy.md)
* [IProtocol](IProtocol.md)
* [IStore](IStore.md)
* [IVault](IVault.md)
* [IVaultFactory](IVaultFactory.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Protocol](Protocol.md)
* [ProtoUtilV1](ProtoUtilV1.md)
* [Recoverable](Recoverable.md)
* [ReentrancyGuard](ReentrancyGuard.md)
* [SafeERC20](SafeERC20.md)
* [SafeMath](SafeMath.md)
* [Vault](Vault.md)
* [VaultFactory](VaultFactory.md)
* [VaultPod](VaultPod.md)
* [Witness](Witness.md)
