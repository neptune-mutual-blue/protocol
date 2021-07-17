# Witness.sol

View Source: [contracts/core/governance/Witness.sol](../contracts/core/governance/Witness.sol)

**↗ Extends: [Recoverable](Recoverable.md), [IWitness](IWitness.md)**
**↘ Derived Contracts: [Reporter](Reporter.md)**

**Witness**

## Functions

- [attest(bytes32 key, uint256 incidentDate, uint256 stake)](#attest)
- [refute(bytes32 key, uint256 incidentDate, uint256 stake)](#refute)

### attest

```solidity
function attest(bytes32 key, uint256 incidentDate, uint256 stake) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| incidentDate | uint256 |  | 
| stake | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function attest(
    bytes32 key,
    uint256 incidentDate,
    uint256 stake
  ) external override nonReentrant {
    _mustBeUnpaused();
    s.mustBeReportingOrDisputed(key);
    s.mustBeValidIncidentDate(key, incidentDate);
    s.mustBeDuringReportingPeriod(key);

    require(stake >= 0, "Enter a stake");

    // Update the values
    s.addUintByKeys(ProtoUtilV1.NS_REPORTING_WITNESS_YES, key, stake);
    s.addUintByKeys(ProtoUtilV1.NS_REPORTING_STAKE_OWNED_YES, key, super._msgSender(), stake);

    s.nepToken().ensureTransferFrom(super._msgSender(), address(this), stake);

    emit Attested(key, super._msgSender(), incidentDate, stake);
  }
```
</details>

### refute

```solidity
function refute(bytes32 key, uint256 incidentDate, uint256 stake) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| incidentDate | uint256 |  | 
| stake | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function refute(
    bytes32 key,
    uint256 incidentDate,
    uint256 stake
  ) external override nonReentrant {
    _mustBeUnpaused();
    s.mustBeReportingOrDisputed(key);
    s.mustBeValidIncidentDate(key, incidentDate);
    s.mustBeDuringReportingPeriod(key);

    require(stake >= 0, "Enter a stake");

    // Update the values
    s.addUintByKeys(ProtoUtilV1.NS_REPORTING_WITNESS_NO, key, stake);
    s.addUintByKeys(ProtoUtilV1.NS_REPORTING_STAKE_OWNED_NO, key, super._msgSender(), stake);

    s.nepToken().ensureTransferFrom(super._msgSender(), address(this), stake);

    emit Refuted(key, super._msgSender(), incidentDate, stake);
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
