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

## Functions

- [constructor(IStore store, bytes32 coverKey, IERC20 liquidityToken)](#)
- [addLiquidityInternal(bytes32 coverKey, address account, uint256 amount)](#addliquidityinternal)
- [addLiquidity(bytes32 coverKey, uint256 amount)](#addliquidity)
- [removeLiquidity(bytes32 coverKey, uint256 amount)](#removeliquidity)
- [_addLiquidity(bytes32 coverKey, address account, uint256 amount, bool initialLiquidity)](#_addliquidity)
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
function addLiquidityInternal(bytes32 coverKey, address account, uint256 amount) external nonpayable nonReentrant 
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
function addLiquidity(bytes32 coverKey, uint256 amount) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| amount | uint256 | Enter the amount of liquidity token to supply. | 

### removeLiquidity

Removes liquidity from the specified cover contract

```js
function removeLiquidity(bytes32 coverKey, uint256 amount) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| amount | uint256 | Enter the amount of liquidity token to remove. | 

### _addLiquidity

Adds liquidity to the specified cover contract

```js
function _addLiquidity(bytes32 coverKey, address account, uint256 amount, bool initialLiquidity) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| account | address | Specify the account on behalf of which the liquidity is being added. | 
| amount | uint256 | Enter the amount of liquidity token to supply. | 
| initialLiquidity | bool |  | 

### version

Version number of this contract

```js
function version() external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getName

Name of this contract

```js
function getName() public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

## Contracts

* [Address](Address.md)
* [BokkyPooBahsDateTimeLibrary](BokkyPooBahsDateTimeLibrary.md)
* [Commission](Commission.md)
* [Context](Context.md)
* [Controller](Controller.md)
* [Cover](Cover.md)
* [CoverAssurance](CoverAssurance.md)
* [CoverBase](CoverBase.md)
* [CoverProvision](CoverProvision.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [cToken](cToken.md)
* [cTokenFactory](cTokenFactory.md)
* [Destroyable](Destroyable.md)
* [ERC20](ERC20.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [Governance](Governance.md)
* [ICommission](ICommission.md)
* [ICover](ICover.md)
* [ICoverAssurance](ICoverAssurance.md)
* [ICoverProvision](ICoverProvision.md)
* [ICoverStake](ICoverStake.md)
* [ICToken](ICToken.md)
* [ICTokenFactory](ICTokenFactory.md)
* [IERC20](IERC20.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IMember](IMember.md)
* [IPolicy](IPolicy.md)
* [IPolicyAdmin](IPolicyAdmin.md)
* [IPriceDiscovery](IPriceDiscovery.md)
* [IProtocol](IProtocol.md)
* [IStore](IStore.md)
* [IVault](IVault.md)
* [IVaultFactory](IVaultFactory.md)
* [MaliciousToken](MaliciousToken.md)
* [Migrations](Migrations.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](NTransferUtilV2Intermediate.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Policy](Policy.md)
* [PolicyAdmin](PolicyAdmin.md)
* [PolicyManager](PolicyManager.md)
* [PriceDiscovery](PriceDiscovery.md)
* [Protocol](Protocol.md)
* [ProtoUtilV1](ProtoUtilV1.md)
* [Recoverable](Recoverable.md)
* [ReentrancyGuard](ReentrancyGuard.md)
* [SafeERC20](SafeERC20.md)
* [SafeMath](SafeMath.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
* [Vault](Vault.md)
* [VaultFactory](VaultFactory.md)
* [VaultPod](VaultPod.md)
* [Witness](Witness.md)
