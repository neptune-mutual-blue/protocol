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

```solidity
function (IStore store, bytes32 key, uint256 expiry) public nonpayable ERC20 Recoverable 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore | Provide the store contract instance | 
| key | bytes32 | Enter the cover key or cover this cToken instance points to | 
| expiry | uint256 | Provide the cover expiry timestamp of this cToken instance | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(
    IStore store,
    bytes32 key,
    uint256 expiry
  ) ERC20("USD Cover Token", "cUSD") Recoverable(store) {
    coverKey = key;
    expiresOn = expiry;
  }
```
</details>

### mint

Mints cTokens when a policy is purchased.
 This feature can only be accesed by the latest policy smart contract.

```solidity
function mint(bytes32 key, address to, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key for which the cTokens are being minted | 
| to | address | Enter the address where the minted token will be sent | 
| amount | uint256 | Specify the amount of cTokens to mint | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mint(
    bytes32 key,
    address to,
    uint256 amount
  ) external override {
    require(key == coverKey, "Invalid cover");
    s.mustBeExactContract(ProtoUtilV1.NS_COVER_POLICY, super._msgSender()); // Ensure the caller is the latest policy contract

    super._mint(to, amount);
  }
```
</details>

### burn

Burns the tokens held by the sender

```solidity
function burn(uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| amount | uint256 | Specify the amount of tokens to burn | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function burn(uint256 amount) external override {
    super._burn(super._msgSender(), amount);
  }
```
</details>

### finalize

Todo: Finializes the cToken contract.
 During this step, the policy fee paid by the users
 will be transferred to the Cover Vault contract.

```solidity
function finalize() external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function finalize() external override {
    s.mustBeExactContract(ProtoUtilV1.NS_COVER_POLICY_MANAGER, super._msgSender()); // Ensure the caller is the latest policy manager contract
    require(block.timestamp >= expiresOn, "Wait until expiry"); // solhint-disable-line

    IERC20 liquidity = IERC20(s.getLiquidityToken());
    uint256 balance = liquidity.balanceOf(address(this));

    liquidity.ensureTransfer(super._msgSender(), balance);

    finalized = true;

    emit Finalized(balance);
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
