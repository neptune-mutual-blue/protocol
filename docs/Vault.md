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
- [transferGovernance(bytes32 coverKey, address to, uint256 amount)](#transfergovernance)
- [addLiquidity(bytes32 coverKey, uint256 amount)](#addliquidity)
- [removeLiquidity(bytes32 coverKey, uint256 amount)](#removeliquidity)
- [_addLiquidity(bytes32 coverKey, address account, uint256 amount, bool initialLiquidity)](#_addliquidity)
- [version()](#version)
- [getName()](#getname)

### 

```solidity
function (IStore store, bytes32 coverKey, IERC20 liquidityToken) public nonpayable VaultPod 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore |  | 
| coverKey | bytes32 |  | 
| liquidityToken | IERC20 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(
    IStore store,
    bytes32 coverKey,
    IERC20 liquidityToken
  ) VaultPod(store, coverKey, liquidityToken) {
    this;
  }
```
</details>

### addLiquidityInternal

Adds liquidity to the specified cover contract

```solidity
function addLiquidityInternal(bytes32 coverKey, address account, uint256 amount) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| account | address | Specify the account on behalf of which the liquidity is being added. | 
| amount | uint256 | Enter the amount of liquidity token to supply. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addLiquidityInternal(
    bytes32 coverKey,
    address account,
    uint256 amount
  ) external override nonReentrant {
    _mustBeUnpaused();
    s.mustBeValidCover(key); // Ensures the key is valid cover
    s.mustBeExactContract(ProtoUtilV1.NS_COVER, super._msgSender()); // Ensure the caller is the latest cover contract

    _addLiquidity(coverKey, account, amount, true);
  }
```
</details>

### transferGovernance

```solidity
function transferGovernance(bytes32 coverKey, address to, uint256 amount) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| to | address |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function transferGovernance(
    bytes32 coverKey,
    address to,
    uint256 amount
  ) external override nonReentrant {
    _mustBeUnpaused();
    s.mustBeValidCover(key); // Ensures the key is valid cover
    s.mustBeExactContract(ProtoUtilV1.NS_GOVERNANCE, super._msgSender()); // Ensure the caller is the latest governance contract

    IERC20(lqt).ensureTransfer(to, amount);
    emit GovernanceTransfer(coverKey, to, amount);
  }
```
</details>

### addLiquidity

Adds liquidity to the specified cover contract

```solidity
function addLiquidity(bytes32 coverKey, uint256 amount) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| amount | uint256 | Enter the amount of liquidity token to supply. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addLiquidity(bytes32 coverKey, uint256 amount) external override nonReentrant {
    _mustBeUnpaused();
    s.mustBeValidCover(key); // Ensures the key is valid cover

    _addLiquidity(coverKey, super._msgSender(), amount, false);
  }
```
</details>

### removeLiquidity

Removes liquidity from the specified cover contract

```solidity
function removeLiquidity(bytes32 coverKey, uint256 amount) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| amount | uint256 | Enter the amount of liquidity token to remove. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeLiquidity(bytes32 coverKey, uint256 amount) external override nonReentrant {
    _mustBeUnpaused();

    s.mustBeValidCover(key); // Ensures the key is valid cover
    require(coverKey == key, "Forbidden");

    uint256 available = s.getPolicyContract().getCoverable(key);

    /*
     * You need to wait for the policy term to expire before you can withdraw
     * your liquidity.
     */
    require(available >= amount, "Insufficient balance"); // Insufficient balance. Please wait for the policy to expire.
    require(s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, key, super._msgSender()) > 0, "Invalid request");
    require(block.timestamp > s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, key, super._msgSender()), "Withdrawal too early"); // solhint-disable-line

    // Update values
    s.subtractUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY, key, amount);

    /***
     * Send liquidity tokens back
     */

    super._redeemPods(super._msgSender(), amount);
    emit LiquidityRemoved(key, amount);
  }
```
</details>

### _addLiquidity

Adds liquidity to the specified cover contract

```solidity
function _addLiquidity(bytes32 coverKey, address account, uint256 amount, bool initialLiquidity) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover key | 
| account | address | Specify the account on behalf of which the liquidity is being added. | 
| amount | uint256 | Enter the amount of liquidity token to supply. | 
| initialLiquidity | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _addLiquidity(
    bytes32 coverKey,
    address account,
    uint256 amount,
    bool initialLiquidity
  ) private {
    require(coverKey == key, "Forbidden");
    require(account != address(0), "Invalid account");

    address liquidityToken = s.getLiquidityToken();
    require(lqt == liquidityToken, "Vault migration required");

    // Update values
    s.addUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY, key, amount);

    uint256 minLiquidityPeriod = s.getMinLiquidityPeriod();
    s.setUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, key, account, block.timestamp + minLiquidityPeriod); // solhint-disable-line

    super._mintPods(account, amount, initialLiquidity);

    emit LiquidityAdded(key, amount);
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
    return ProtoUtilV1.CNAME_LIQUIDITY_VAULT;
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
