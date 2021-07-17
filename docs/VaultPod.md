# Vault POD (Proof of Deposit) (VaultPod.sol)

View Source: [contracts/core/liquidity/VaultPod.sol](../contracts/core/liquidity/VaultPod.sol)

**↗ Extends: [IVault](IVault.md), [Recoverable](Recoverable.md), [ERC20](ERC20.md)**
**↘ Derived Contracts: [Vault](Vault.md)**

**VaultPod**

The VaultPod has `_mintPods` and `_redeemPods` features which enables
 POD minting and burning on demand. <br /> <br />
 **How Does This Work?**
 When you add liquidity to the Vault,
 PODs are minted representing your proportional share of the pool.
 Similarly, when you redeem your PODs, you get your proportional
 share of the Vault liquidity back, burning the PODs.

## Contract Members
**Constants & Variables**

```js
bytes32 public key;
address public lqt;

```

## Functions

- [constructor(IStore store, bytes32 coverKey, IERC20 liquidityToken)](#)
- [_mintPods(address account, uint256 liquidityToAdd, bool initialLiquidity)](#_mintpods)
- [_redeemPods(address account, uint256 podsToBurn)](#_redeempods)
- [_calculateLiquidity(uint256 podsToBurn)](#_calculateliquidity)
- [_calculatePods(uint256 liquidityToAdd)](#_calculatepods)

### 

Constructs this contract

```solidity
function (IStore store, bytes32 coverKey, IERC20 liquidityToken) internal nonpayable ERC20 Recoverable 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore | Provide the store contract instance | 
| coverKey | bytes32 | Enter the cover key or cover this contract is related to | 
| liquidityToken | IERC20 | Provide the liquidity token instance for this Vault | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(
    IStore store,
    bytes32 coverKey,
    IERC20 liquidityToken
  ) ERC20("Proof of Deposits", "PODs") Recoverable(store) {
    key = coverKey;
    lqt = address(liquidityToken);
  }
```
</details>

### _mintPods

Internal function to mint pods by transferring liquidity. <br /> <br />
 **How Does This Work?**
 You --> Liquidity Tokens --> This Contract
 This Contract --> PODS --> You

```solidity
function _mintPods(address account, uint256 liquidityToAdd, bool initialLiquidity) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| account | address | Specify the address to send the minted PODs to | 
| liquidityToAdd | uint256 | Enter the amount of liquidity to add | 
| initialLiquidity | bool | Indicate if this the first liquidity being added to the POD.  Note: The cover contract transfers the liquidity only after the `Vault` contract is deployed.  This argument should be used with caution. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _mintPods(
    address account,
    uint256 liquidityToAdd,
    bool initialLiquidity
  ) internal {
    uint256 pods = _calculatePods(liquidityToAdd);

    if (initialLiquidity == false) {
      // First deposit the tokens
      IERC20(lqt).ensureTransferFrom(account, address(this), liquidityToAdd);
    }

    super._mint(account, pods);

    emit PodsMinted(account, pods, address(this), liquidityToAdd);
  }
```
</details>

### _redeemPods

Internal function to redeem pods by burning. <br /> <br />
 **How Does This Work?**
 You --> PODs --> This Contract --> Burn
 This Contract --> Your Share of Liquidity Tokens --> You

```solidity
function _redeemPods(address account, uint256 podsToBurn) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| account | address | Specify the address to burn the PODs from | 
| podsToBurn | uint256 | Enter the amount of PODs to burn | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _redeemPods(address account, uint256 podsToBurn) internal {
    uint256 amount = _calculateLiquidity(podsToBurn);

    super.transferFrom(account, address(this), podsToBurn);
    super._burn(address(this), podsToBurn);

    IERC20(lqt).ensureTransfer(account, amount);
  }
```
</details>

### _calculateLiquidity

Calculates the amount of liquidity to transfer for the given amount of PODs to burn

```solidity
function _calculateLiquidity(uint256 podsToBurn) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| podsToBurn | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _calculateLiquidity(uint256 podsToBurn) private view returns (uint256) {
    uint256 balance = IERC20(lqt).balanceOf(address(this));
    return (balance * podsToBurn) / super.totalSupply();
  }
```
</details>

### _calculatePods

Calculates the amount of PODS to mint for the given amount of liquidity to transfer

```solidity
function _calculatePods(uint256 liquidityToAdd) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| liquidityToAdd | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _calculatePods(uint256 liquidityToAdd) private view returns (uint256) {
    uint256 balance = IERC20(lqt).balanceOf(address(this));

    if (balance == 0) {
      return liquidityToAdd;
    }

    return (super.totalSupply() * liquidityToAdd) / balance;
  }
```
</details>

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
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [ICommission](ICommission.md)
* [ICover](ICover.md)
* [ICoverAssurance](ICoverAssurance.md)
* [ICoverProvision](ICoverProvision.md)
* [ICoverStake](ICoverStake.md)
* [ICToken](ICToken.md)
* [ICTokenFactory](ICTokenFactory.md)
* [IERC20](IERC20.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IGovernance](IGovernance.md)
* [IMember](IMember.md)
* [IPolicy](IPolicy.md)
* [IPolicyAdmin](IPolicyAdmin.md)
* [IPriceDiscovery](IPriceDiscovery.md)
* [IProtocol](IProtocol.md)
* [IReporter](IReporter.md)
* [IStore](IStore.md)
* [IVault](IVault.md)
* [IVaultFactory](IVaultFactory.md)
* [IWitness](IWitness.md)
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
* [Reporter](Reporter.md)
* [SafeERC20](SafeERC20.md)
* [SafeMath](SafeMath.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
* [Vault](Vault.md)
* [VaultFactory](VaultFactory.md)
* [VaultPod](VaultPod.md)
* [Witness](Witness.md)
