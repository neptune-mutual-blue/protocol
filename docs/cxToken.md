# cxToken (cxToken.sol)

View Source: [contracts/core/cxToken/cxToken.sol](../contracts/core/cxToken/cxToken.sol)

**↗ Extends: [ICxToken](ICxToken.md), [Recoverable](Recoverable.md), [ERC20](ERC20.md)**

**cxToken**

cxTokens are minted when someone purchases a cover. <br /> <br />
 When a cover incident is successfully resolved, each unit of cxTokens can be redeemed at 1:1 ratio
 of 1 cxToken = 1 DAI/BUSD/USDC (minus platform fees).

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

### 

Constructs this contract

```solidity
function (IStore store, bytes32 key, uint256 expiry) public nonpayable ERC20 Recoverable 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore | Provide the store contract instance | 
| key | bytes32 | Enter the cover key or cover this cxToken instance points to | 
| expiry | uint256 | Provide the cover expiry timestamp of this cxToken instance | 

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

Mints cxTokens when a policy is purchased.
 This feature can only be accesed by the latest policy smart contract.

```solidity
function mint(bytes32 key, address to, uint256 amount) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key for which the cxTokens are being minted | 
| to | address | Enter the address where the minted token will be sent | 
| amount | uint256 | Specify the amount of cxTokens to mint | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mint(
    bytes32 key,
    address to,
    uint256 amount
  ) external override nonReentrant {
    // @suppress-acl Can only be called by the latest policy contract
    s.mustNotBePaused();
    require(key == coverKey, "Invalid cover");
    s.callerMustBePolicyContract();

    super._mint(to, amount);
  }
```
</details>

### burn

Burns the tokens held by the sender

```solidity
function burn(uint256 amount) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| amount | uint256 | Specify the amount of tokens to burn | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function burn(uint256 amount) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible

    s.mustNotBePaused();
    super._burn(msg.sender, amount);
  }
```
</details>

## Contracts

* [AccessControl](AccessControl.md)
* [AccessControlLibV1](AccessControlLibV1.md)
* [Address](Address.md)
* [BaseLibV1](BaseLibV1.md)
* [BokkyPooBahsDateTimeLibrary](BokkyPooBahsDateTimeLibrary.md)
* [Commission](Commission.md)
* [Context](Context.md)
* [Controller](Controller.md)
* [Cover](Cover.md)
* [CoverBase](CoverBase.md)
* [CoverProvision](CoverProvision.md)
* [CoverReassurance](CoverReassurance.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [cxToken](cxToken.md)
* [cxTokenFactory](cxTokenFactory.md)
* [cxTokenFactoryLibV1](cxTokenFactoryLibV1.md)
* [Destroyable](Destroyable.md)
* [ERC165](ERC165.md)
* [ERC20](ERC20.md)
* [FakeRecoverable](FakeRecoverable.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [Finalization](Finalization.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [IAccessControl](IAccessControl.md)
* [IClaimsProcessor](IClaimsProcessor.md)
* [ICommission](ICommission.md)
* [ICover](ICover.md)
* [ICoverProvision](ICoverProvision.md)
* [ICoverReassurance](ICoverReassurance.md)
* [ICoverStake](ICoverStake.md)
* [ICxToken](ICxToken.md)
* [ICxTokenFactory](ICxTokenFactory.md)
* [IERC165](IERC165.md)
* [IERC20](IERC20.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IFinalization](IFinalization.md)
* [IGovernance](IGovernance.md)
* [IMember](IMember.md)
* [IPausable](IPausable.md)
* [IPolicy](IPolicy.md)
* [IPolicyAdmin](IPolicyAdmin.md)
* [IPriceDiscovery](IPriceDiscovery.md)
* [IProtocol](IProtocol.md)
* [IReporter](IReporter.md)
* [IResolution](IResolution.md)
* [IResolvable](IResolvable.md)
* [IStore](IStore.md)
* [IUniswapV2PairLike](IUniswapV2PairLike.md)
* [IUniswapV2RouterLike](IUniswapV2RouterLike.md)
* [IUnstakable](IUnstakable.md)
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
* [Processor](Processor.md)
* [ProtoBase](ProtoBase.md)
* [Protocol](Protocol.md)
* [ProtoUtilV1](ProtoUtilV1.md)
* [Recoverable](Recoverable.md)
* [ReentrancyGuard](ReentrancyGuard.md)
* [RegistryLibV1](RegistryLibV1.md)
* [Reporter](Reporter.md)
* [Resolution](Resolution.md)
* [Resolvable](Resolvable.md)
* [SafeERC20](SafeERC20.md)
* [SafeMath](SafeMath.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
* [Strings](Strings.md)
* [Unstakable](Unstakable.md)
* [ValidationLibV1](ValidationLibV1.md)
* [Vault](Vault.md)
* [VaultBase](VaultBase.md)
* [VaultFactory](VaultFactory.md)
* [VaultFactoryLibV1](VaultFactoryLibV1.md)
* [VaultLibV1](VaultLibV1.md)
* [Witness](Witness.md)
