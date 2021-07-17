# Reporter.sol

View Source: [contracts/core/governance/Reporter.sol](../contracts/core/governance/Reporter.sol)

**↗ Extends: [IReporter](IReporter.md), [Witness](Witness.md)**
**↘ Derived Contracts: [Governance](Governance.md)**

**Reporter**

## Functions

- [report(bytes32 key, bytes32 info, uint256 stake)](#report)
- [dispute(bytes32 key, uint256 incidentDate, bytes32 info, uint256 stake)](#dispute)
- [getReporter(bytes32 key)](#getreporter)

### report

```solidity
function report(bytes32 key, bytes32 info, uint256 stake) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| info | bytes32 |  | 
| stake | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function report(
    bytes32 key,
    bytes32 info,
    uint256 stake
  ) external override nonReentrant {
    _mustBeUnpaused();
    s.mustBeValidCover(key);

    uint256 incidentDate = block.timestamp; // solhint-disable-line
    uint256 minStake = s.getMinReportingStake();
    require(stake >= minStake, "Stake insufficient");

    // Set the reporter's account
    s.setAddressByKeys(ProtoUtilV1.NS_REPORTING_WITNESS_YES, key, super._msgSender());

    s.setUintByKeys(ProtoUtilV1.NS_REPORTING_INCIDENT_DATE, key, incidentDate);

    // Set the Resolution Timestamp
    uint256 resolutionDate = block.timestamp + s.getReportingPeriod(key); // solhint-disable-line
    s.setUintByKeys(ProtoUtilV1.NS_RESOLUTION_TS, key, resolutionDate);

    // Set the claim expiry timestamp
    uint256 claimExpiry = resolutionDate + s.getClaimPeriod(key);
    s.setUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, key, claimExpiry);

    // Update the values
    s.setUintByKeys(ProtoUtilV1.NS_REPORTING_WITNESS_YES, key, stake);
    s.setUintByKeys(ProtoUtilV1.NS_REPORTING_STAKE_OWNED_YES, key, super._msgSender(), stake);

    // Update the cover to "Incident Happened"
    s.setStatus(key, CoverUtilV1.CoverStatus.IncidentHappened);

    s.nepToken().ensureTransferFrom(super._msgSender(), address(this), stake);

    emit Reported(key, super._msgSender(), incidentDate, info, stake);
    emit Attested(key, super._msgSender(), incidentDate, stake);
  }
```
</details>

### dispute

```solidity
function dispute(bytes32 key, uint256 incidentDate, bytes32 info, uint256 stake) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| incidentDate | uint256 |  | 
| info | bytes32 |  | 
| stake | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function dispute(
    bytes32 key,
    uint256 incidentDate,
    bytes32 info,
    uint256 stake
  ) external override nonReentrant {
    _mustBeUnpaused();
    s.mustBeReporting(key);
    s.mustBeValidIncidentDate(key, incidentDate);
    s.mustBeDuringReportingPeriod(key);

    uint256 minStake = s.getMinReportingStake();
    require(stake >= minStake, "Stake insufficient");

    // Set the reporter's account
    s.setAddressByKeys(ProtoUtilV1.NS_REPORTING_WITNESS_NO, key, super._msgSender());

    // Update the values
    s.setUintByKeys(ProtoUtilV1.NS_REPORTING_WITNESS_NO, key, stake);
    s.setUintByKeys(ProtoUtilV1.NS_REPORTING_STAKE_OWNED_NO, key, super._msgSender(), stake);

    // Update the cover to "False Reporting"
    s.setStatus(key, CoverUtilV1.CoverStatus.FalseReporting);

    s.nepToken().ensureTransferFrom(super._msgSender(), address(this), stake);

    emit Disputed(key, super._msgSender(), incidentDate, info, stake);
    emit Refuted(key, super._msgSender(), incidentDate, stake);
  }
```
</details>

### getReporter

```solidity
function getReporter(bytes32 key) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReporter(bytes32 key) external view returns (address) {
    return s.getReporter(key);
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
