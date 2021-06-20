# ICoverStake.sol

View Source: [interfaces/ICoverStake.sol](../interfaces/ICoverStake.sol)

**↗ Extends: [IMember](IMember.md)**
**↘ Derived Contracts: [CoverStake](CoverStake.md)**

**ICoverStake**

## Functions

- [decreaseStake(bytes32 key, address account, uint256 amount)](#decreasestake)
- [increaseStake(bytes32 key, address account, uint256 amount)](#increasestake)
- [stakeOf(bytes32 key, address account)](#stakeof)

### decreaseStake

```js
function decreaseStake(bytes32 key, address account, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| account | address |  | 
| amount | uint256 |  | 

### increaseStake

```js
function increaseStake(bytes32 key, address account, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| account | address |  | 
| amount | uint256 |  | 

### stakeOf

```js
function stakeOf(bytes32 key, address account) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| account | address |  | 

## Contracts

* [Address](Address.md)
* [Context](Context.md)
* [Cover](Cover.md)
* [CoverLiquidity](CoverLiquidity.md)
* [CoverProvision](CoverProvision.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [ICover](ICover.md)
* [ICoverLiquidity](ICoverLiquidity.md)
* [ICoverStake](ICoverStake.md)
* [IERC20](IERC20.md)
* [IMember](IMember.md)
* [IProtocol](IProtocol.md)
* [IStore](IStore.md)
* [IVault](IVault.md)
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
