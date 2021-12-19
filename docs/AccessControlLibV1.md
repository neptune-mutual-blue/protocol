# AccessControlLibV1.sol

View Source: [contracts/libraries/AccessControlLibV1.sol](../contracts/libraries/AccessControlLibV1.sol)

**AccessControlLibV1**

## Contract Members
**Constants & Variables**

```js
bytes32 public constant NS_ROLES_ADMIN;
bytes32 public constant NS_ROLES_COVER_MANAGER;
bytes32 public constant NS_ROLES_LIQUIDITY_MANAGER;
bytes32 public constant NS_ROLES_GOVERNANCE_AGENT;
bytes32 public constant NS_ROLES_GOVERNANCE_ADMIN;
bytes32 public constant NS_ROLES_UPGRADE_AGENT;
bytes32 public constant NS_ROLES_RECOVERY_AGENT;
bytes32 public constant NS_ROLES_PAUSE_AGENT;
bytes32 public constant NS_ROLES_UNPAUSE_AGENT;

```

## Functions

- [mustBeAdmin(IStore s)](#mustbeadmin)
- [mustBeCoverManager(IStore s)](#mustbecovermanager)
- [senderMustBeWhitelisted(IStore s)](#sendermustbewhitelisted)
- [mustBeLiquidityManager(IStore s)](#mustbeliquiditymanager)
- [mustBeGovernanceAgent(IStore s)](#mustbegovernanceagent)
- [mustBeGovernanceAdmin(IStore s)](#mustbegovernanceadmin)
- [mustBeUpgradeAgent(IStore s)](#mustbeupgradeagent)
- [mustBeRecoveryAgent(IStore s)](#mustberecoveryagent)
- [mustBePauseAgent(IStore s)](#mustbepauseagent)
- [mustBeUnpauseAgent(IStore s)](#mustbeunpauseagent)
- [_mustHaveAccess(IStore s, bytes32 role)](#_musthaveaccess)
- [hasAccess(IStore s, bytes32 role, address user)](#hasaccess)

### mustBeAdmin

Reverts if the sender is not the protocol admin.

```js
function mustBeAdmin(IStore s) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### mustBeCoverManager

Reverts if the sender is not the cover manager.

```js
function mustBeCoverManager(IStore s) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### senderMustBeWhitelisted

Reverts if the sender is not the cover manager.

```js
function senderMustBeWhitelisted(IStore s) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### mustBeLiquidityManager

Reverts if the sender is not the liquidity manager.

```js
function mustBeLiquidityManager(IStore s) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### mustBeGovernanceAgent

Reverts if the sender is not a governance agent.

```js
function mustBeGovernanceAgent(IStore s) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### mustBeGovernanceAdmin

Reverts if the sender is not a governance admin.

```js
function mustBeGovernanceAdmin(IStore s) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### mustBeUpgradeAgent

Reverts if the sender is not an upgrade agent.

```js
function mustBeUpgradeAgent(IStore s) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### mustBeRecoveryAgent

Reverts if the sender is not a recovery agent.

```js
function mustBeRecoveryAgent(IStore s) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### mustBePauseAgent

Reverts if the sender is not the pause agent.

```js
function mustBePauseAgent(IStore s) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### mustBeUnpauseAgent

Reverts if the sender is not the unpause agent.

```js
function mustBeUnpauseAgent(IStore s) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

### _mustHaveAccess

Reverts if the sender does not have access to the given role.

```js
function _mustHaveAccess(IStore s, bytes32 role) private view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| role | bytes32 |  | 

### hasAccess

Checks if a given user has access to the given role

```js
function hasAccess(IStore s, bytes32 role, address user) public view
returns(bool)
```

**Returns**

Returns true if the user is a member of the specified role

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| role | bytes32 | Specify the role name | 
| user | address | Enter the user account | 

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
* [CoverAssurance](CoverAssurance.md)
* [CoverBase](CoverBase.md)
* [CoverProvision](CoverProvision.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [cToken](cToken.md)
* [cTokenFactory](cTokenFactory.md)
* [cTokenFactoryLibV1](cTokenFactoryLibV1.md)
* [Destroyable](Destroyable.md)
* [ERC165](ERC165.md)
* [ERC20](ERC20.md)
* [FakeRecoverable](FakeRecoverable.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [IAccessControl](IAccessControl.md)
* [IClaimsProcessor](IClaimsProcessor.md)
* [ICommission](ICommission.md)
* [ICover](ICover.md)
* [ICoverAssurance](ICoverAssurance.md)
* [ICoverProvision](ICoverProvision.md)
* [ICoverStake](ICoverStake.md)
* [ICToken](ICToken.md)
* [ICTokenFactory](ICTokenFactory.md)
* [IERC165](IERC165.md)
* [IERC20](IERC20.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IGovernance](IGovernance.md)
* [IMember](IMember.md)
* [IPausable](IPausable.md)
* [IPolicy](IPolicy.md)
* [IPolicyAdmin](IPolicyAdmin.md)
* [IPriceDiscovery](IPriceDiscovery.md)
* [IProtocol](IProtocol.md)
* [IReporter](IReporter.md)
* [IStore](IStore.md)
* [IUniswapV2PairLike](IUniswapV2PairLike.md)
* [IUniswapV2RouterLike](IUniswapV2RouterLike.md)
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
* [SafeERC20](SafeERC20.md)
* [SafeMath](SafeMath.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
* [Strings](Strings.md)
* [ValidationLibV1](ValidationLibV1.md)
* [Vault](Vault.md)
* [VaultBase](VaultBase.md)
* [VaultFactory](VaultFactory.md)
* [VaultFactoryLibV1](VaultFactoryLibV1.md)
* [VaultLibV1](VaultLibV1.md)
* [Witness](Witness.md)
