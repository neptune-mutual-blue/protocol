# ReentrancyGuard.sol

View Source: [openzeppelin-solidity/contracts/security/ReentrancyGuard.sol](../openzeppelin-solidity/contracts/security/ReentrancyGuard.sol)

**↘ Derived Contracts: [Recoverable](Recoverable.md)**

**ReentrancyGuard**

Contract module that helps prevent reentrant calls to a function.
 Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 available, which can be applied to functions to make sure there are no nested
 (reentrant) calls to them.
 Note that because there is a single `nonReentrant` guard, functions marked as
 `nonReentrant` may not call one another. This can be worked around by making
 those functions `private`, and then adding `external` `nonReentrant` entry
 points to them.
 TIP: If you would like to learn more about reentrancy and alternative ways
 to protect against it, check out our blog post
 https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].

## Contract Members
**Constants & Variables**

```js
uint256 private constant _NOT_ENTERED;
uint256 private constant _ENTERED;
uint256 private _status;

```

## Modifiers

- [nonReentrant](#nonreentrant)

### nonReentrant

Prevents a contract from calling itself, directly or indirectly.
 Calling a `nonReentrant` function from another `nonReentrant`
 function is not supported. It is possible to prevent this from happening
 by making the `nonReentrant` function external, and make it call a
 `private` function that does the actual work.

```js
modifier nonReentrant() internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

## Functions

- [constructor()](#)

### 

```js
function () internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

## Contracts

* [Address](Address.md)
* [Commission](Commission.md)
* [Context](Context.md)
* [Cover](Cover.md)
* [CoverAssurance](CoverAssurance.md)
* [CoverLiquidity](CoverLiquidity.md)
* [CoverProvision](CoverProvision.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [ICommission](ICommission.md)
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
