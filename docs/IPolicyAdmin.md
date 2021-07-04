# IPolicyAdmin.sol

View Source: [contracts/interfaces/IPolicyAdmin.sol](../contracts/interfaces/IPolicyAdmin.sol)

**↗ Extends: [IMember](IMember.md)**
**↘ Derived Contracts: [PolicyAdmin](PolicyAdmin.md)**

**IPolicyAdmin**

**Events**

```js
event PolicyRateSet(uint256  floor, uint256  ceiling);
event CoverPolicyRateSet(bytes32  key, uint256  floor, uint256  ceiling);
```

## Functions

- [setPolicyRates(uint256 floor, uint256 ceiling)](#setpolicyrates)
- [setPolicyRatesByKey(bytes32 key, uint256 floor, uint256 ceiling)](#setpolicyratesbykey)
- [getPolicyRates(bytes32 key)](#getpolicyrates)

### setPolicyRates

Sets policy rates. This feature is only accessible by owner or protocol owner.

```js
function setPolicyRates(uint256 floor, uint256 ceiling) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| floor | uint256 | The lowest cover fee rate fallback | 
| ceiling | uint256 | The highest cover fee rate fallback | 

### setPolicyRatesByKey

Sets policy rates for the given cover key. This feature is only accessible by owner or protocol owner.

```js
function setPolicyRatesByKey(bytes32 key, uint256 floor, uint256 ceiling) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| floor | uint256 | The lowest cover fee rate for this cover | 
| ceiling | uint256 | The highest cover fee rate for this cover | 

### getPolicyRates

Gets the cover policy rates for the given cover key

```js
function getPolicyRates(bytes32 key) external view
returns(floor uint256, ceiling uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

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
