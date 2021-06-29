# Cover Stake (CoverStake.sol)

View Source: [contracts/core/lifecycle/CoverStake.sol](../contracts/core/lifecycle/CoverStake.sol)

**↗ Extends: [ICoverStake](ICoverStake.md), [Recoverable](Recoverable.md)**

**CoverStake**

When you create a new cover, you have to specify the amount of
 NEP tokens you wish to stake as a cover creator. <br /> <br />
 To demonstrate support for a cover pool, anyone can add and remove
 NEP stakes (minimum required). The higher the sake, the more visibility
 the contract gets if there are multiple cover contracts with the same name
 or similar terms. Even when there are no duplicate contract, a higher stake
 would normally imply a better cover pool commitment.

**Events**

```js
event StakeAdded(bytes32  key, uint256  amount);
event StakeRemoved(bytes32  key, uint256  amount);
event FeeBurned(bytes32  key, uint256  amount);
```

## Functions

- [constructor(IStore store)](#)
- [increaseStake(bytes32 key, address account, uint256 amount, uint256 fee)](#increasestake)
- [decreaseStake(bytes32 key, address account, uint256 amount)](#decreasestake)
- [stakeOf(bytes32 key, address account)](#stakeof)
- [_getDrawingPower(bytes32 key, address account)](#_getdrawingpower)
- [version()](#version)
- [getName()](#getname)

### 

Constructs this contract

```js
function (IStore store) public nonpayable Recoverable 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore | Provide the store contract instance | 

### increaseStake

Increase the stake of the given cover pool

```js
function increaseStake(bytes32 key, address account, uint256 amount, uint256 fee) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| account | address | Enter the account from where the NEP tokens will be transferred | 
| amount | uint256 | Enter the amount of stake | 
| fee | uint256 | Enter the fee amount. Note: do not enter the fee if you are directly calling this function. | 

### decreaseStake

Decreases the stake from the given cover pool

```js
function decreaseStake(bytes32 key, address account, uint256 amount) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| account | address | Enter the account to decrease the stake of | 
| amount | uint256 | Enter the amount of stake to decrease | 

### stakeOf

Gets the stake of an account for the given cover key

```js
function stakeOf(bytes32 key, address account) public view
returns(uint256)
```

**Returns**

Returns the total stake of the specified account on the given cover key

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| account | address | Specify the account to obtain the stake of | 

### _getDrawingPower

Gets the drawing power of (the stake amount that can be withdrawn from)
 an account.

```js
function _getDrawingPower(bytes32 key, address account) private view
returns(uint256)
```

**Returns**

Returns the drawing power of the specified account on the given cover key

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| account | address | Specify the account to obtain the drawing power of | 

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
* [ICoverStake](ICoverStake.md)
* [ICToken](ICToken.md)
* [ICTokenFactory](ICTokenFactory.md)
* [IERC20](IERC20.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IMember](IMember.md)
* [IPolicy](IPolicy.md)
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
