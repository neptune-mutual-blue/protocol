# AccessControl.sol

View Source: [openzeppelin-solidity/contracts/access/AccessControl.sol](../openzeppelin-solidity/contracts/access/AccessControl.sol)

**↗ Extends: [Context](Context.md), [IAccessControl](IAccessControl.md), [ERC165](ERC165.md)**
**↘ Derived Contracts: [ProtoBase](ProtoBase.md)**

**AccessControl**

Contract module that allows children to implement role-based access
 control mechanisms. This is a lightweight version that doesn't allow enumerating role
 members except through off-chain means by accessing the contract event logs. Some
 applications may benefit from on-chain enumerability, for those cases see
 {AccessControlEnumerable}.
 Roles are referred to by their `bytes32` identifier. These should be exposed
 in the external API and be unique. The best way to achieve this is by
 using `public constant` hash digests:
 ```
 bytes32 public constant MY_ROLE = keccak256("MY_ROLE");
 ```
 Roles can be used to represent a set of permissions. To restrict access to a
 function call, use {hasRole}:
 ```
 function foo() public {
     require(hasRole(MY_ROLE, msg.sender));
     ...
 }
 ```
 Roles can be granted and revoked dynamically via the {grantRole} and
 {revokeRole} functions. Each role has an associated admin role, and only
 accounts that have a role's admin role can call {grantRole} and {revokeRole}.
 By default, the admin role for all roles is `DEFAULT_ADMIN_ROLE`, which means
 that only accounts with this role will be able to grant or revoke other
 roles. More complex role relationships can be created by using
 {_setRoleAdmin}.
 WARNING: The `DEFAULT_ADMIN_ROLE` is also its own admin: it has permission to
 grant and revoke this role. Extra precautions should be taken to secure
 accounts that have been granted it.

## Structs
### RoleData

```js
struct RoleData {
 mapping(address => bool) members,
 bytes32 adminRole
}
```

## Contract Members
**Constants & Variables**

```js
//private members
mapping(bytes32 => struct AccessControl.RoleData) private _roles;

//public members
bytes32 public constant DEFAULT_ADMIN_ROLE;

```

## Modifiers

- [onlyRole](#onlyrole)

### onlyRole

Modifier that checks that an account has a specific role. Reverts
 with a standardized message including the required role.
 The format of the revert reason is given by the following regular expression:
  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
 _Available since v4.1._

```js
modifier onlyRole(bytes32 role) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| role | bytes32 |  | 

## Functions

- [supportsInterface(bytes4 interfaceId)](#supportsinterface)
- [hasRole(bytes32 role, address account)](#hasrole)
- [_checkRole(bytes32 role, address account)](#_checkrole)
- [getRoleAdmin(bytes32 role)](#getroleadmin)
- [grantRole(bytes32 role, address account)](#grantrole)
- [revokeRole(bytes32 role, address account)](#revokerole)
- [renounceRole(bytes32 role, address account)](#renouncerole)
- [_setupRole(bytes32 role, address account)](#_setuprole)
- [_setRoleAdmin(bytes32 role, bytes32 adminRole)](#_setroleadmin)
- [_grantRole(bytes32 role, address account)](#_grantrole)
- [_revokeRole(bytes32 role, address account)](#_revokerole)

### supportsInterface

See {IERC165-supportsInterface}.

```js
function supportsInterface(bytes4 interfaceId) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| interfaceId | bytes4 |  | 

### hasRole

Returns `true` if `account` has been granted `role`.

```js
function hasRole(bytes32 role, address account) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| role | bytes32 |  | 
| account | address |  | 

### _checkRole

Revert with a standard message if `account` is missing `role`.
 The format of the revert reason is given by the following regular expression:
  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/

```js
function _checkRole(bytes32 role, address account) internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| role | bytes32 |  | 
| account | address |  | 

### getRoleAdmin

Returns the admin role that controls `role`. See {grantRole} and
 {revokeRole}.
 To change a role's admin, use {_setRoleAdmin}.

```js
function getRoleAdmin(bytes32 role) public view
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| role | bytes32 |  | 

### grantRole

Grants `role` to `account`.
 If `account` had not been already granted `role`, emits a {RoleGranted}
 event.
 Requirements:
 - the caller must have ``role``'s admin role.

```js
function grantRole(bytes32 role, address account) public nonpayable onlyRole 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| role | bytes32 |  | 
| account | address |  | 

### revokeRole

Revokes `role` from `account`.
 If `account` had been granted `role`, emits a {RoleRevoked} event.
 Requirements:
 - the caller must have ``role``'s admin role.

```js
function revokeRole(bytes32 role, address account) public nonpayable onlyRole 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| role | bytes32 |  | 
| account | address |  | 

### renounceRole

Revokes `role` from the calling account.
 Roles are often managed via {grantRole} and {revokeRole}: this function's
 purpose is to provide a mechanism for accounts to lose their privileges
 if they are compromised (such as when a trusted device is misplaced).
 If the calling account had been granted `role`, emits a {RoleRevoked}
 event.
 Requirements:
 - the caller must be `account`.

```js
function renounceRole(bytes32 role, address account) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| role | bytes32 |  | 
| account | address |  | 

### _setupRole

Grants `role` to `account`.
 If `account` had not been already granted `role`, emits a {RoleGranted}
 event. Note that unlike {grantRole}, this function doesn't perform any
 checks on the calling account.
 [WARNING]
 ====
 This function should only be called from the constructor when setting
 up the initial roles for the system.
 Using this function in any other way is effectively circumventing the admin
 system imposed by {AccessControl}.
 ====

```js
function _setupRole(bytes32 role, address account) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| role | bytes32 |  | 
| account | address |  | 

### _setRoleAdmin

Sets `adminRole` as ``role``'s admin role.
 Emits a {RoleAdminChanged} event.

```js
function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| role | bytes32 |  | 
| adminRole | bytes32 |  | 

### _grantRole

```js
function _grantRole(bytes32 role, address account) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| role | bytes32 |  | 
| account | address |  | 

### _revokeRole

```js
function _revokeRole(bytes32 role, address account) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| role | bytes32 |  | 
| account | address |  | 

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
