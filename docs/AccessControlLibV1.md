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
- [mustBeLiquidityManager(IStore s)](#mustbeliquiditymanager)
- [mustBeGovernanceAgent(IStore s)](#mustbegovernanceagent)
- [mustBeGovernanceAdmin(IStore s)](#mustbegovernanceadmin)
- [mustBeUpgradeAgent(IStore s)](#mustbeupgradeagent)
- [mustBeRecoveryAgent(IStore s)](#mustberecoveryagent)
- [mustBePauseAgent(IStore s)](#mustbepauseagent)
- [mustBeUnpauseAgent(IStore s)](#mustbeunpauseagent)
- [callerMustBeAdmin(IStore s, address caller)](#callermustbeadmin)
- [callerMustBeCoverManager(IStore s, address caller)](#callermustbecovermanager)
- [callerMustBeLiquidityManager(IStore s, address caller)](#callermustbeliquiditymanager)
- [callerMustBeGovernanceAgent(IStore s, address caller)](#callermustbegovernanceagent)
- [callerMustBeGovernanceAdmin(IStore s, address caller)](#callermustbegovernanceadmin)
- [callerMustBeUpgradeAgent(IStore s, address caller)](#callermustbeupgradeagent)
- [callerMustBeRecoveryAgent(IStore s, address caller)](#callermustberecoveryagent)
- [callerMustBePauseAgent(IStore s, address caller)](#callermustbepauseagent)
- [callerMustBeUnpauseAgent(IStore s, address caller)](#callermustbeunpauseagent)
- [_mustHaveAccess(IStore s, bytes32 role, address caller)](#_musthaveaccess)
- [hasAccess(IStore s, bytes32 role, address user)](#hasaccess)
- [addContractInternal(IStore s, bytes32 namespace, bytes32 key, address contractAddress)](#addcontractinternal)
- [_addContract(IStore s, bytes32 namespace, bytes32 key, address contractAddress)](#_addcontract)
- [_deleteContract(IStore s, bytes32 namespace, bytes32 key, address contractAddress)](#_deletecontract)
- [upgradeContractInternal(IStore s, bytes32 namespace, bytes32 key, address previous, address current)](#upgradecontractinternal)
- [addMemberInternal(IStore s, address member)](#addmemberinternal)
- [removeMemberInternal(IStore s, address member)](#removememberinternal)
- [_addMember(IStore s, address member)](#_addmember)
- [_removeMember(IStore s, address member)](#_removemember)

### mustBeAdmin

Reverts if the sender is not the protocol admin.

```solidity
function mustBeAdmin(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeAdmin(IStore s) external view {
    _mustHaveAccess(s, NS_ROLES_ADMIN, msg.sender);
  }
```
</details>

### mustBeCoverManager

Reverts if the sender is not the cover manager.

```solidity
function mustBeCoverManager(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeCoverManager(IStore s) external view {
    _mustHaveAccess(s, NS_ROLES_COVER_MANAGER, msg.sender);
  }
```
</details>

### mustBeLiquidityManager

Reverts if the sender is not the liquidity manager.

```solidity
function mustBeLiquidityManager(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeLiquidityManager(IStore s) external view {
    _mustHaveAccess(s, NS_ROLES_LIQUIDITY_MANAGER, msg.sender);
  }
```
</details>

### mustBeGovernanceAgent

Reverts if the sender is not a governance agent.

```solidity
function mustBeGovernanceAgent(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeGovernanceAgent(IStore s) external view {
    _mustHaveAccess(s, NS_ROLES_GOVERNANCE_AGENT, msg.sender);
  }
```
</details>

### mustBeGovernanceAdmin

Reverts if the sender is not a governance admin.

```solidity
function mustBeGovernanceAdmin(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeGovernanceAdmin(IStore s) external view {
    _mustHaveAccess(s, NS_ROLES_GOVERNANCE_ADMIN, msg.sender);
  }
```
</details>

### mustBeUpgradeAgent

Reverts if the sender is not an upgrade agent.

```solidity
function mustBeUpgradeAgent(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeUpgradeAgent(IStore s) external view {
    _mustHaveAccess(s, NS_ROLES_UPGRADE_AGENT, msg.sender);
  }
```
</details>

### mustBeRecoveryAgent

Reverts if the sender is not a recovery agent.

```solidity
function mustBeRecoveryAgent(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeRecoveryAgent(IStore s) external view {
    _mustHaveAccess(s, NS_ROLES_RECOVERY_AGENT, msg.sender);
  }
```
</details>

### mustBePauseAgent

Reverts if the sender is not the pause agent.

```solidity
function mustBePauseAgent(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBePauseAgent(IStore s) external view {
    _mustHaveAccess(s, NS_ROLES_PAUSE_AGENT, msg.sender);
  }
```
</details>

### mustBeUnpauseAgent

Reverts if the sender is not the unpause agent.

```solidity
function mustBeUnpauseAgent(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeUnpauseAgent(IStore s) external view {
    _mustHaveAccess(s, NS_ROLES_UNPAUSE_AGENT, msg.sender);
  }
```
</details>

### callerMustBeAdmin

Reverts if the sender is not the protocol admin.

```solidity
function callerMustBeAdmin(IStore s, address caller) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| caller | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function callerMustBeAdmin(IStore s, address caller) external view {
    _mustHaveAccess(s, NS_ROLES_ADMIN, caller);
  }
```
</details>

### callerMustBeCoverManager

Reverts if the sender is not the cover manager.

```solidity
function callerMustBeCoverManager(IStore s, address caller) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| caller | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function callerMustBeCoverManager(IStore s, address caller) external view {
    _mustHaveAccess(s, NS_ROLES_COVER_MANAGER, caller);
  }
```
</details>

### callerMustBeLiquidityManager

Reverts if the sender is not the liquidity manager.

```solidity
function callerMustBeLiquidityManager(IStore s, address caller) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| caller | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function callerMustBeLiquidityManager(IStore s, address caller) external view {
    _mustHaveAccess(s, NS_ROLES_LIQUIDITY_MANAGER, caller);
  }
```
</details>

### callerMustBeGovernanceAgent

Reverts if the sender is not a governance agent.

```solidity
function callerMustBeGovernanceAgent(IStore s, address caller) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| caller | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function callerMustBeGovernanceAgent(IStore s, address caller) external view {
    _mustHaveAccess(s, NS_ROLES_GOVERNANCE_AGENT, caller);
  }
```
</details>

### callerMustBeGovernanceAdmin

Reverts if the sender is not a governance admin.

```solidity
function callerMustBeGovernanceAdmin(IStore s, address caller) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| caller | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function callerMustBeGovernanceAdmin(IStore s, address caller) external view {
    _mustHaveAccess(s, NS_ROLES_GOVERNANCE_ADMIN, caller);
  }
```
</details>

### callerMustBeUpgradeAgent

Reverts if the sender is not an upgrade agent.

```solidity
function callerMustBeUpgradeAgent(IStore s, address caller) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| caller | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function callerMustBeUpgradeAgent(IStore s, address caller) public view {
    _mustHaveAccess(s, NS_ROLES_UPGRADE_AGENT, caller);
  }
```
</details>

### callerMustBeRecoveryAgent

Reverts if the sender is not a recovery agent.

```solidity
function callerMustBeRecoveryAgent(IStore s, address caller) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| caller | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function callerMustBeRecoveryAgent(IStore s, address caller) external view {
    _mustHaveAccess(s, NS_ROLES_RECOVERY_AGENT, caller);
  }
```
</details>

### callerMustBePauseAgent

Reverts if the sender is not the pause agent.

```solidity
function callerMustBePauseAgent(IStore s, address caller) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| caller | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function callerMustBePauseAgent(IStore s, address caller) external view {
    _mustHaveAccess(s, NS_ROLES_PAUSE_AGENT, caller);
  }
```
</details>

### callerMustBeUnpauseAgent

Reverts if the sender is not the unpause agent.

```solidity
function callerMustBeUnpauseAgent(IStore s, address caller) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| caller | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function callerMustBeUnpauseAgent(IStore s, address caller) external view {
    _mustHaveAccess(s, NS_ROLES_UNPAUSE_AGENT, caller);
  }
```
</details>

### _mustHaveAccess

Reverts if the sender does not have access to the given role.

```solidity
function _mustHaveAccess(IStore s, bytes32 role, address caller) private view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| role | bytes32 |  | 
| caller | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _mustHaveAccess(
    IStore s,
    bytes32 role,
    address caller
  ) private view {
    require(hasAccess(s, role, caller), "Forbidden");
  }
```
</details>

### hasAccess

Checks if a given user has access to the given role

```solidity
function hasAccess(IStore s, bytes32 role, address user) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| role | bytes32 | Specify the role name | 
| user | address | Enter the user account | 

**Returns**

Returns true if the user is a member of the specified role

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function hasAccess(
    IStore s,
    bytes32 role,
    address user
  ) public view returns (bool) {
    address protocol = s.getProtocolAddress();

    // The protocol is not deployed yet. Therefore, no role to check
    if (protocol == address(0)) {
      return false;
    }

    // You must have the same role in the protocol contract if you're don't have this role here
    return IAccessControl(protocol).hasRole(role, user);
  }
```
</details>

### addContractInternal

```solidity
function addContractInternal(IStore s, bytes32 namespace, bytes32 key, address contractAddress) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| namespace | bytes32 |  | 
| key | bytes32 |  | 
| contractAddress | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addContractInternal(
    IStore s,
    bytes32 namespace,
    bytes32 key,
    address contractAddress
  ) external {
    // Not only the msg.sender needs to be an upgrade agent
    // but the contract using this library (and this function)
    // must also be an upgrade agent
    callerMustBeUpgradeAgent(s, address(this));

    // @suppress-address-trust-issue This feature can only be accessed internally within the protocol.
    _addContract(s, namespace, key, contractAddress);
  }
```
</details>

### _addContract

```solidity
function _addContract(IStore s, bytes32 namespace, bytes32 key, address contractAddress) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| namespace | bytes32 |  | 
| key | bytes32 |  | 
| contractAddress | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _addContract(
    IStore s,
    bytes32 namespace,
    bytes32 key,
    address contractAddress
  ) private {
    if (key > 0) {
      s.setAddressByKeys(ProtoUtilV1.NS_CONTRACTS, namespace, key, contractAddress);
    } else {
      s.setAddressByKeys(ProtoUtilV1.NS_CONTRACTS, namespace, contractAddress);
    }
    _addMember(s, contractAddress);
  }
```
</details>

### _deleteContract

```solidity
function _deleteContract(IStore s, bytes32 namespace, bytes32 key, address contractAddress) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| namespace | bytes32 |  | 
| key | bytes32 |  | 
| contractAddress | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _deleteContract(
    IStore s,
    bytes32 namespace,
    bytes32 key,
    address contractAddress
  ) private {
    if (key > 0) {
      s.deleteAddressByKeys(ProtoUtilV1.NS_CONTRACTS, namespace, key);
    } else {
      s.deleteAddressByKeys(ProtoUtilV1.NS_CONTRACTS, namespace);
    }
    _removeMember(s, contractAddress);
  }
```
</details>

### upgradeContractInternal

```solidity
function upgradeContractInternal(IStore s, bytes32 namespace, bytes32 key, address previous, address current) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| namespace | bytes32 |  | 
| key | bytes32 |  | 
| previous | address |  | 
| current | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function upgradeContractInternal(
    IStore s,
    bytes32 namespace,
    bytes32 key,
    address previous,
    address current
  ) external {
    // Not only the msg.sender needs to be an upgrade agent
    // but the contract using this library (and this function)
    // must also be an upgrade agent
    callerMustBeUpgradeAgent(s, address(this));

    // @suppress-address-trust-issue This feature can only be accessed internally within the protocol.
    bool isMember = s.isProtocolMember(previous);
    require(isMember, "Not a protocol member");

    _deleteContract(s, namespace, key, previous);
    _addContract(s, namespace, key, current);
  }
```
</details>

### addMemberInternal

```solidity
function addMemberInternal(IStore s, address member) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| member | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addMemberInternal(IStore s, address member) external {
    // Not only the msg.sender needs to be an upgrade agent
    // but the contract using this library (and this function)
    // must also be an upgrade agent
    callerMustBeUpgradeAgent(s, address(this));

    // @suppress-address-trust-issue This feature can only be accessed internally within the protocol.
    _addMember(s, member);
  }
```
</details>

### removeMemberInternal

```solidity
function removeMemberInternal(IStore s, address member) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| member | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeMemberInternal(IStore s, address member) external {
    // Not only the msg.sender needs to be an upgrade agent
    // but the contract using this library (and this function)
    // must also be an upgrade agent
    callerMustBeUpgradeAgent(s, address(this));

    // @suppress-address-trust-issue This feature can only be accessed internally within the protocol.
    _removeMember(s, member);
  }
```
</details>

### _addMember

```solidity
function _addMember(IStore s, address member) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| member | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _addMember(IStore s, address member) private {
    require(s.getBoolByKeys(ProtoUtilV1.NS_MEMBERS, member) == false, "Already exists");
    s.setBoolByKeys(ProtoUtilV1.NS_MEMBERS, member, true);
  }
```
</details>

### _removeMember

```solidity
function _removeMember(IStore s, address member) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| member | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _removeMember(IStore s, address member) private {
    s.deleteBoolByKeys(ProtoUtilV1.NS_MEMBERS, member);
  }
```
</details>

## Contracts

* [AaveStrategy](AaveStrategy.md)
* [AccessControl](AccessControl.md)
* [AccessControlLibV1](AccessControlLibV1.md)
* [Address](Address.md)
* [BaseLibV1](BaseLibV1.md)
* [BokkyPooBahsDateTimeLibrary](BokkyPooBahsDateTimeLibrary.md)
* [BondPool](BondPool.md)
* [BondPoolBase](BondPoolBase.md)
* [BondPoolLibV1](BondPoolLibV1.md)
* [CompoundStrategy](CompoundStrategy.md)
* [console](console.md)
* [Context](Context.md)
* [Cover](Cover.md)
* [CoverBase](CoverBase.md)
* [CoverLibV1](CoverLibV1.md)
* [CoverReassurance](CoverReassurance.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [cxToken](cxToken.md)
* [cxTokenFactory](cxTokenFactory.md)
* [cxTokenFactoryLibV1](cxTokenFactoryLibV1.md)
* [Delayable](Delayable.md)
* [Destroyable](Destroyable.md)
* [ERC165](ERC165.md)
* [ERC20](ERC20.md)
* [FakeAaveLendingPool](FakeAaveLendingPool.md)
* [FakeCompoundDaiDelegator](FakeCompoundDaiDelegator.md)
* [FakeRecoverable](FakeRecoverable.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [FakeUniswapPair](FakeUniswapPair.md)
* [FakeUniswapV2FactoryLike](FakeUniswapV2FactoryLike.md)
* [FakeUniswapV2PairLike](FakeUniswapV2PairLike.md)
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [FaultyAaveLendingPool](FaultyAaveLendingPool.md)
* [FaultyCompoundDaiDelegator](FaultyCompoundDaiDelegator.md)
* [Finalization](Finalization.md)
* [ForceEther](ForceEther.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [IAaveV2LendingPoolLike](IAaveV2LendingPoolLike.md)
* [IAccessControl](IAccessControl.md)
* [IBondPool](IBondPool.md)
* [IClaimsProcessor](IClaimsProcessor.md)
* [ICompoundERC20DelegatorLike](ICompoundERC20DelegatorLike.md)
* [ICover](ICover.md)
* [ICoverReassurance](ICoverReassurance.md)
* [ICoverStake](ICoverStake.md)
* [ICxToken](ICxToken.md)
* [ICxTokenFactory](ICxTokenFactory.md)
* [IERC165](IERC165.md)
* [IERC20](IERC20.md)
* [IERC20Detailed](IERC20Detailed.md)
* [IERC20Metadata](IERC20Metadata.md)
* [IERC3156FlashBorrower](IERC3156FlashBorrower.md)
* [IERC3156FlashLender](IERC3156FlashLender.md)
* [IFinalization](IFinalization.md)
* [IGovernance](IGovernance.md)
* [ILendingStrategy](ILendingStrategy.md)
* [ILiquidityEngine](ILiquidityEngine.md)
* [IMember](IMember.md)
* [InvalidStrategy](InvalidStrategy.md)
* [IPausable](IPausable.md)
* [IPolicy](IPolicy.md)
* [IPolicyAdmin](IPolicyAdmin.md)
* [IPriceDiscovery](IPriceDiscovery.md)
* [IProtocol](IProtocol.md)
* [IRecoverable](IRecoverable.md)
* [IReporter](IReporter.md)
* [IResolution](IResolution.md)
* [IResolvable](IResolvable.md)
* [IStakingPools](IStakingPools.md)
* [IStore](IStore.md)
* [IStoreLike](IStoreLike.md)
* [IUniswapV2FactoryLike](IUniswapV2FactoryLike.md)
* [IUniswapV2PairLike](IUniswapV2PairLike.md)
* [IUniswapV2RouterLike](IUniswapV2RouterLike.md)
* [IUnstakable](IUnstakable.md)
* [IVault](IVault.md)
* [IVaultDelegate](IVaultDelegate.md)
* [IVaultFactory](IVaultFactory.md)
* [IWitness](IWitness.md)
* [LiquidityEngine](LiquidityEngine.md)
* [MaliciousToken](MaliciousToken.md)
* [MockAccessControlUser](MockAccessControlUser.md)
* [MockCoverUtilUser](MockCoverUtilUser.md)
* [MockCxToken](MockCxToken.md)
* [MockCxTokenPolicy](MockCxTokenPolicy.md)
* [MockCxTokenStore](MockCxTokenStore.md)
* [MockFlashBorrower](MockFlashBorrower.md)
* [MockProcessorStore](MockProcessorStore.md)
* [MockProcessorStoreLib](MockProcessorStoreLib.md)
* [MockProtocol](MockProtocol.md)
* [MockRegistryClient](MockRegistryClient.md)
* [MockStore](MockStore.md)
* [MockStoreKeyUtilUser](MockStoreKeyUtilUser.md)
* [MockValidationLibUser](MockValidationLibUser.md)
* [MockVault](MockVault.md)
* [MockVaultLibUser](MockVaultLibUser.md)
* [NPM](NPM.md)
* [NPMDistributor](NPMDistributor.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](NTransferUtilV2Intermediate.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Policy](Policy.md)
* [PolicyAdmin](PolicyAdmin.md)
* [PolicyHelperV1](PolicyHelperV1.md)
* [PoorMansERC20](PoorMansERC20.md)
* [PriceDiscovery](PriceDiscovery.md)
* [PriceLibV1](PriceLibV1.md)
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
* [RoutineInvokerLibV1](RoutineInvokerLibV1.md)
* [SafeERC20](SafeERC20.md)
* [StakingPoolBase](StakingPoolBase.md)
* [StakingPoolCoreLibV1](StakingPoolCoreLibV1.md)
* [StakingPoolInfo](StakingPoolInfo.md)
* [StakingPoolLibV1](StakingPoolLibV1.md)
* [StakingPoolReward](StakingPoolReward.md)
* [StakingPools](StakingPools.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
* [StrategyLibV1](StrategyLibV1.md)
* [Strings](Strings.md)
* [TimelockController](TimelockController.md)
* [Unstakable](Unstakable.md)
* [ValidationLibV1](ValidationLibV1.md)
* [Vault](Vault.md)
* [VaultBase](VaultBase.md)
* [VaultDelegate](VaultDelegate.md)
* [VaultDelegateBase](VaultDelegateBase.md)
* [VaultDelegateWithFlashLoan](VaultDelegateWithFlashLoan.md)
* [VaultFactory](VaultFactory.md)
* [VaultFactoryLibV1](VaultFactoryLibV1.md)
* [VaultLibV1](VaultLibV1.md)
* [VaultLiquidity](VaultLiquidity.md)
* [VaultStrategy](VaultStrategy.md)
* [WithFlashLoan](WithFlashLoan.md)
* [WithPausability](WithPausability.md)
* [WithRecovery](WithRecovery.md)
* [Witness](Witness.md)
