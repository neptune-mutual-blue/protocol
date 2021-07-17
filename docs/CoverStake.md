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

```solidity
function (IStore store) public nonpayable Recoverable 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore | Provide the store contract instance | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(IStore store) Recoverable(store) {
    this;
  }
```
</details>

### increaseStake

Increase the stake of the given cover pool

```solidity
function increaseStake(bytes32 key, address account, uint256 amount, uint256 fee) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| account | address | Enter the account from where the NEP tokens will be transferred | 
| amount | uint256 | Enter the amount of stake | 
| fee | uint256 | Enter the fee amount. Note: do not enter the fee if you are directly calling this function. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function increaseStake(
    bytes32 key,
    address account,
    uint256 amount,
    uint256 fee
  ) external override nonReentrant {
    _mustBeUnpaused();
    s.mustBeValidCoverKey(key); // Ensures the key is valid cover
    s.mustBeExactContract(ProtoUtilV1.NS_COVER, super._msgSender()); // Ensure the caller is the latest cover contract

    require(amount >= fee, "Invalid fee");

    s.nepToken().ensureTransferFrom(account, address(this), amount);

    if (fee > 0) {
      s.nepToken().ensureTransferFrom(address(this), s.getBurnAddress(), fee);
      emit FeeBurned(key, fee);
    }

    s.addUintByKeys(ProtoUtilV1.NS_COVER_STAKE, key, amount - fee);
    s.addUintByKeys(ProtoUtilV1.NS_COVER_STAKE_OWNED, key, account, amount - fee);

    emit StakeAdded(key, amount - fee);
  }
```
</details>

### decreaseStake

Decreases the stake from the given cover pool

```solidity
function decreaseStake(bytes32 key, address account, uint256 amount) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| account | address | Enter the account to decrease the stake of | 
| amount | uint256 | Enter the amount of stake to decrease | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function decreaseStake(
    bytes32 key,
    address account,
    uint256 amount
  ) external override nonReentrant {
    _mustBeUnpaused();
    s.mustBeValidCoverKey(key); // Ensures the key is valid cover
    s.mustBeExactContract(ProtoUtilV1.NS_COVER, super._msgSender()); // Ensure the caller is the latest cover contract

    uint256 drawingPower = _getDrawingPower(key, account);
    require(drawingPower >= amount, "Exceeds your drawing power");

    s.subtractUintByKeys(ProtoUtilV1.NS_COVER_STAKE, key, amount);
    s.subtractUintByKeys(ProtoUtilV1.NS_COVER_STAKE_OWNED, key, account, amount);

    s.nepToken().ensureTransfer(account, amount);
    emit StakeRemoved(key, amount);
  }
```
</details>

### stakeOf

Gets the stake of an account for the given cover key

```solidity
function stakeOf(bytes32 key, address account) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| account | address | Specify the account to obtain the stake of | 

**Returns**

Returns the total stake of the specified account on the given cover key

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function stakeOf(bytes32 key, address account) public view override returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_STAKE_OWNED, key, account);
  }
```
</details>

### _getDrawingPower

Gets the drawing power of (the stake amount that can be withdrawn from)
 an account.

```solidity
function _getDrawingPower(bytes32 key, address account) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| account | address | Specify the account to obtain the drawing power of | 

**Returns**

Returns the drawing power of the specified account on the given cover key

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getDrawingPower(bytes32 key, address account) private view returns (uint256) {
    uint256 yourStake = stakeOf(key, account);
    bool isOwner = account == s.getCoverOwner(key);

    uint256 minStake = s.getMinCoverStake();

    return isOwner ? yourStake - minStake : yourStake;
  }
```
</details>

### version

Version number of this contract

```solidity
function version() external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function version() external pure override returns (bytes32) {
    return "v0.1";
  }
```
</details>

### getName

Name of this contract

```solidity
function getName() public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getName() public pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_COVER_STAKE;
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
