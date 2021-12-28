# Neptune Mutual Governance: Resolvable Contract (Resolvable.sol)

View Source: [contracts/core/governance/resolution/Resolvable.sol](../contracts/core/governance/resolution/Resolvable.sol)

**↗ Extends: [Finalization](Finalization.md), [IResolvable](IResolvable.md)**
**↘ Derived Contracts: [Unstakable](Unstakable.md)**

**Resolvable**

Enables governance agents to resolve a contract undergoing reporting.
 Provides a cool-down period of 24-hours during when governance admins
 can perform emergency resolution to defend against governance attacks.

## Functions

- [resolve(bytes32 key, uint256 incidentDate)](#resolve)
- [emergencyResolve(bytes32 key, uint256 incidentDate, bool decision)](#emergencyresolve)
- [_resolve(bytes32 key, uint256 incidentDate, bool decision, bool emergency)](#_resolve)

### resolve

```solidity
function resolve(bytes32 key, uint256 incidentDate) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function resolve(bytes32 key, uint256 incidentDate) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeGovernanceAgent(s);
    s.mustBeReportingOrDisputed(key);
    s.mustBeValidIncidentDate(key, incidentDate);
    s.mustBeAfterReportingPeriod(key);

    bool decision = s.getCoverStatus(key) == CoverUtilV1.CoverStatus.IncidentHappened;

    _resolve(key, incidentDate, decision, false);
  }
```
</details>

### emergencyResolve

```solidity
function emergencyResolve(bytes32 key, uint256 incidentDate, bool decision) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| incidentDate | uint256 |  | 
| decision | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function emergencyResolve(
    bytes32 key,
    uint256 incidentDate,
    bool decision
  ) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeGovernanceAdmin(s);
    s.mustBeValidIncidentDate(key, incidentDate);
    s.mustBeAfterReportingPeriod(key);

    _resolve(key, incidentDate, decision, true);
  }
```
</details>

### _resolve

```solidity
function _resolve(bytes32 key, uint256 incidentDate, bool decision, bool emergency) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| incidentDate | uint256 |  | 
| decision | bool |  | 
| emergency | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _resolve(
    bytes32 key,
    uint256 incidentDate,
    bool decision,
    bool emergency
  ) private {
    if (decision == false) {
      _finalize(key, incidentDate);
      return;
    }

    uint256 claimBeginsFrom = block.timestamp + 24 hours; // solhint-disable-line
    uint256 claimExpiresAt = claimBeginsFrom + s.getClaimPeriod();

    s.setUintByKeys(ProtoUtilV1.NS_CLAIM_BEGIN_TS, key, claimBeginsFrom);
    s.setUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, key, claimExpiresAt);

    s.setStatus(key, CoverUtilV1.CoverStatus.Claimable);

    emit Resolved(key, incidentDate, decision, emergency);
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
