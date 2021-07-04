# cToken (cToken.sol)

View Source: [contracts/core/cToken/cToken.sol](../contracts/core/cToken/cToken.sol)

**↗ Extends: [ICToken](ICToken.md), [Recoverable](Recoverable.md), [ERC20](ERC20.md)**

**cToken**

cTokens are minted when someone purchases a cover. <br /> <br />
 When a cover incident is successfully resolved, each unit of cTokens can be redeemed at 1:1 ratio
 of 1 cToken = 1 DAI/BUSD/USDC.

## Contract Members
**Constants & Variables**

```js
bytes32 public coverKey;
uint256 public expiresOn;
bool public finalized;

```

## Functions

- [constructor(IStore store, bytes32 key, uint256 expiry)](#)
- [mint(bytes32 key, address to, uint256 amount)](#mint)
- [burn(uint256 amount)](#burn)
- [finalize()](#finalize)

### 

Constructs this contract

```js
function (IStore store, bytes32 key, uint256 expiry) public nonpayable ERC20 Recoverable 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore | Provide the store contract instance | 
| key | bytes32 | Enter the cover key or cover this cToken instance points to | 
| expiry | uint256 | Provide the cover expiry timestamp of this cToken instance | 

### mint

Mints cTokens when a policy is purchased.
 This feature can only be accesed by the latest policy smart contract.

```js
function mint(bytes32 key, address to, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key for which the cTokens are being minted | 
| to | address | Enter the address where the minted token will be sent | 
| amount | uint256 | Specify the amount of cTokens to mint | 

### burn

Burns the tokens held by the sender

```js
function burn(uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| amount | uint256 | Specify the amount of tokens to burn | 

### finalize

Todo: Finializes the cToken contract.
 During this step, the policy fee paid by the users
 will be transferred to the Cover Vault contract.

```js
function finalize() external nonpayable
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
