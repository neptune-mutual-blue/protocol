# NTransferUtilV2.sol

View Source: [libraries/NTransferUtilV2.sol](../libraries/NTransferUtilV2.sol)

**NTransferUtilV2**

## Functions

- [ensureTransfer(IERC20 malicious, address recipient, uint256 amount)](#ensuretransfer)
- [ensureTransferFrom(IERC20 malicious, address sender, address recipient, uint256 amount)](#ensuretransferfrom)

### ensureTransfer

```js
function ensureTransfer(IERC20 malicious, address recipient, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| malicious | IERC20 |  | 
| recipient | address |  | 
| amount | uint256 |  | 

### ensureTransferFrom

```js
function ensureTransferFrom(IERC20 malicious, address sender, address recipient, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| malicious | IERC20 |  | 
| sender | address |  | 
| recipient | address |  | 
| amount | uint256 |  | 

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
