# ValidationLibV1.sol

View Source: [contracts/libraries/ValidationLibV1.sol](../contracts/libraries/ValidationLibV1.sol)

**ValidationLibV1**

## Functions

- [mustNotBePaused(IStore s)](#mustnotbepaused)
- [mustBeValidCover(IStore s, bytes32 key)](#mustbevalidcover)
- [mustBeValidCoverKey(IStore s, bytes32 key)](#mustbevalidcoverkey)
- [mustBeCoverOwner(IStore s, bytes32 key, address sender)](#mustbecoverowner)
- [callerMustBePolicyContract(IStore s)](#callermustbepolicycontract)
- [callerMustBePolicyManagerContract(IStore s)](#callermustbepolicymanagercontract)
- [callerMustBeCoverContract(IStore s)](#callermustbecovercontract)
- [callerMustBeGovernanceContract(IStore s)](#callermustbegovernancecontract)
- [callerMustBeClaimsProcessorContract(IStore s)](#callermustbeclaimsprocessorcontract)
- [mustBeReporting(IStore s, bytes32 key)](#mustbereporting)
- [mustBeDisputed(IStore s, bytes32 key)](#mustbedisputed)
- [mustBeClaimable(IStore s, bytes32 key)](#mustbeclaimable)
- [mustBeClaimingOrDisputed(IStore s, bytes32 key)](#mustbeclaimingordisputed)
- [mustBeReportingOrDisputed(IStore s, bytes32 key)](#mustbereportingordisputed)
- [mustBeValidIncidentDate(IStore s, bytes32 key, uint256 incidentDate)](#mustbevalidincidentdate)
- [mustNotHaveDispute(IStore s, bytes32 key)](#mustnothavedispute)
- [mustBeDuringReportingPeriod(IStore s, bytes32 key)](#mustbeduringreportingperiod)
- [mustBeAfterReportingPeriod(IStore s, bytes32 key)](#mustbeafterreportingperiod)
- [mustBeValidCxToken(IStore s, bytes32 key, address cxToken, uint256 incidentDate)](#mustbevalidcxtoken)
- [mustBeValidClaim(IStore s, bytes32 key, address cxToken, uint256 incidentDate)](#mustbevalidclaim)
- [mustNotHaveUnstaken(IStore s, address account, bytes32 key, uint256 incidentDate)](#mustnothaveunstaken)
- [validateUnstakeAfterClaimPeriod(IStore s, bytes32 key, uint256 incidentDate)](#validateunstakeafterclaimperiod)
- [validateUnstakeWithClaim(IStore s, bytes32 key, uint256 incidentDate)](#validateunstakewithclaim)
- [mustBeDuringClaimPeriod(IStore s, bytes32 key)](#mustbeduringclaimperiod)
- [mustBeAfterClaimExpiry(IStore s, bytes32 key)](#mustbeafterclaimexpiry)

### mustNotBePaused

Reverts if the protocol is paused

```solidity
function mustNotBePaused(IStore s) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustNotBePaused(IStore s) public view {
    address protocol = s.getProtocolAddress();
    require(IPausable(protocol).paused() == false, "Protocol is paused");
  }
```
</details>

### mustBeValidCover

Reverts if the key does not resolve in a valid cover contract
 or if the cover is under governance.

```solidity
function mustBeValidCover(IStore s, bytes32 key) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 | Enter the cover key to check | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeValidCover(IStore s, bytes32 key) external view {
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, key), "Cover does not exist");
    require(s.getCoverStatus(key) == CoverUtilV1.CoverStatus.Normal, "Actively Reporting");
  }
```
</details>

### mustBeValidCoverKey

Reverts if the key does not resolve in a valid cover contract.

```solidity
function mustBeValidCoverKey(IStore s, bytes32 key) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 | Enter the cover key to check | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeValidCoverKey(IStore s, bytes32 key) external view {
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, key), "Cover does not exist");
  }
```
</details>

### mustBeCoverOwner

Reverts if the sender is not the cover owner

```solidity
function mustBeCoverOwner(IStore s, bytes32 key, address sender) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | ender The `msg.sender` value | 
| key | bytes32 | Enter the cover key to check | 
| sender | address | The `msg.sender` value | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeCoverOwner(
    IStore s,
    bytes32 key,
    address sender
  ) external view {
    bool isCoverOwner = s.getCoverOwner(key) == sender;
    require(isCoverOwner, "Forbidden");
  }
```
</details>

### callerMustBePolicyContract

```solidity
function callerMustBePolicyContract(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function callerMustBePolicyContract(IStore s) external view {
    s.callerMustBeExactContract(ProtoUtilV1.CNS_COVER_POLICY);
  }
```
</details>

### callerMustBePolicyManagerContract

```solidity
function callerMustBePolicyManagerContract(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function callerMustBePolicyManagerContract(IStore s) external view {
    s.callerMustBeExactContract(ProtoUtilV1.CNS_COVER_POLICY_MANAGER);
  }
```
</details>

### callerMustBeCoverContract

```solidity
function callerMustBeCoverContract(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function callerMustBeCoverContract(IStore s) external view {
    s.callerMustBeExactContract(ProtoUtilV1.CNS_COVER);
  }
```
</details>

### callerMustBeGovernanceContract

```solidity
function callerMustBeGovernanceContract(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function callerMustBeGovernanceContract(IStore s) external view {
    s.callerMustBeExactContract(ProtoUtilV1.CNS_GOVERNANCE);
  }
```
</details>

### callerMustBeClaimsProcessorContract

```solidity
function callerMustBeClaimsProcessorContract(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function callerMustBeClaimsProcessorContract(IStore s) external view {
    s.callerMustBeExactContract(ProtoUtilV1.CNS_CLAIM_PROCESSOR);
  }
```
</details>

### mustBeReporting

```solidity
function mustBeReporting(IStore s, bytes32 key) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeReporting(IStore s, bytes32 key) external view {
    require(s.getCoverStatus(key) == CoverUtilV1.CoverStatus.IncidentHappened, "Not reporting");
  }
```
</details>

### mustBeDisputed

```solidity
function mustBeDisputed(IStore s, bytes32 key) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeDisputed(IStore s, bytes32 key) external view {
    require(s.getCoverStatus(key) == CoverUtilV1.CoverStatus.FalseReporting, "Not disputed");
  }
```
</details>

### mustBeClaimable

```solidity
function mustBeClaimable(IStore s, bytes32 key) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeClaimable(IStore s, bytes32 key) public view {
    require(s.getCoverStatus(key) == CoverUtilV1.CoverStatus.Claimable, "Not claimable");
  }
```
</details>

### mustBeClaimingOrDisputed

```solidity
function mustBeClaimingOrDisputed(IStore s, bytes32 key) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeClaimingOrDisputed(IStore s, bytes32 key) external view {
    CoverUtilV1.CoverStatus status = s.getCoverStatus(key);

    bool claiming = status == CoverUtilV1.CoverStatus.Claimable;
    bool falseReporting = status == CoverUtilV1.CoverStatus.FalseReporting;

    require(claiming || falseReporting, "Not reported nor disputed");
  }
```
</details>

### mustBeReportingOrDisputed

```solidity
function mustBeReportingOrDisputed(IStore s, bytes32 key) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeReportingOrDisputed(IStore s, bytes32 key) external view {
    CoverUtilV1.CoverStatus status = s.getCoverStatus(key);
    bool incidentHappened = status == CoverUtilV1.CoverStatus.IncidentHappened;
    bool falseReporting = status == CoverUtilV1.CoverStatus.FalseReporting;

    require(incidentHappened || falseReporting, "Not reported nor disputed");
  }
```
</details>

### mustBeValidIncidentDate

```solidity
function mustBeValidIncidentDate(IStore s, bytes32 key, uint256 incidentDate) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeValidIncidentDate(
    IStore s,
    bytes32 key,
    uint256 incidentDate
  ) public view {
    require(s.getLatestIncidentDate(key) == incidentDate, "Invalid incident date");
  }
```
</details>

### mustNotHaveDispute

```solidity
function mustNotHaveDispute(IStore s, bytes32 key) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustNotHaveDispute(IStore s, bytes32 key) external view {
    address reporter = s.getAddressByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_NO, key);
    require(reporter == address(0), "Already disputed");
  }
```
</details>

### mustBeDuringReportingPeriod

```solidity
function mustBeDuringReportingPeriod(IStore s, bytes32 key) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeDuringReportingPeriod(IStore s, bytes32 key) external view {
    require(s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_RESOLUTION_TS, key) >= block.timestamp, "Reporting window closed"); // solhint-disable-line
  }
```
</details>

### mustBeAfterReportingPeriod

```solidity
function mustBeAfterReportingPeriod(IStore s, bytes32 key) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeAfterReportingPeriod(IStore s, bytes32 key) public view {
    require(block.timestamp > s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_RESOLUTION_TS, key), "Reporting still active"); // solhint-disable-line
  }
```
</details>

### mustBeValidCxToken

```solidity
function mustBeValidCxToken(IStore s, bytes32 key, address cxToken, uint256 incidentDate) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| cxToken | address |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeValidCxToken(
    IStore s,
    bytes32 key,
    address cxToken,
    uint256 incidentDate
  ) public view {
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER_CXTOKEN, cxToken) == true, "Unknown cxToken");

    bytes32 coverKey = ICxToken(cxToken).coverKey();
    require(coverKey == key, "Invalid cxToken");

    uint256 expires = ICxToken(cxToken).expiresOn();
    require(expires > incidentDate, "Invalid or expired cxToken");
  }
```
</details>

### mustBeValidClaim

```solidity
function mustBeValidClaim(IStore s, bytes32 key, address cxToken, uint256 incidentDate) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| cxToken | address |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeValidClaim(
    IStore s,
    bytes32 key,
    address cxToken,
    uint256 incidentDate
  ) external view {
    s.mustBeProtocolMember(cxToken);
    mustBeValidCxToken(s, key, cxToken, incidentDate);
    mustBeClaimable(s, key);
    mustBeValidIncidentDate(s, key, incidentDate);
    mustBeDuringClaimPeriod(s, key);
  }
```
</details>

### mustNotHaveUnstaken

```solidity
function mustNotHaveUnstaken(IStore s, address account, bytes32 key, uint256 incidentDate) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| account | address |  | 
| key | bytes32 |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustNotHaveUnstaken(
    IStore s,
    address account,
    bytes32 key,
    uint256 incidentDate
  ) public view {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_TS, key, incidentDate, account));
    uint256 withdrawal = s.getUintByKey(k);

    require(withdrawal == 0, "Already unstaken");
  }
```
</details>

### validateUnstakeAfterClaimPeriod

```solidity
function validateUnstakeAfterClaimPeriod(IStore s, bytes32 key, uint256 incidentDate) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function validateUnstakeAfterClaimPeriod(
    IStore s,
    bytes32 key,
    uint256 incidentDate
  ) external view {
    mustNotBePaused(s);
    mustNotHaveUnstaken(s, msg.sender, key, incidentDate);
  }
```
</details>

### validateUnstakeWithClaim

```solidity
function validateUnstakeWithClaim(IStore s, bytes32 key, uint256 incidentDate) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function validateUnstakeWithClaim(
    IStore s,
    bytes32 key,
    uint256 incidentDate
  ) external view {
    mustNotBePaused(s);
    mustNotHaveUnstaken(s, msg.sender, key, incidentDate);
    mustBeValidIncidentDate(s, key, incidentDate);

    bool incidentHappened = s.getCoverStatus(key) == CoverUtilV1.CoverStatus.IncidentHappened;

    if (incidentHappened) {
      // Incident occurred. Must unstake with claim during the claim period.
      mustBeDuringClaimPeriod(s, key);
      return;
    }

    // Incident did not occur.
    mustBeAfterReportingPeriod(s, key);
  }
```
</details>

### mustBeDuringClaimPeriod

```solidity
function mustBeDuringClaimPeriod(IStore s, bytes32 key) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeDuringClaimPeriod(IStore s, bytes32 key) public view {
    uint256 beginsFrom = s.getUintByKeys(ProtoUtilV1.NS_CLAIM_BEGIN_TS, key);
    require(block.timestamp >= beginsFrom, "Claim period hasn't begun"); // solhint-disable-line

    uint256 expiresAt = s.getUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, key);
    require(block.timestamp <= expiresAt, "Claim period has expired"); // solhint-disable-line
  }
```
</details>

### mustBeAfterClaimExpiry

```solidity
function mustBeAfterClaimExpiry(IStore s, bytes32 key) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeAfterClaimExpiry(IStore s, bytes32 key) external view {
    require(block.timestamp > s.getUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, key), "Claim still active"); // solhint-disable-line
  }
```
</details>

## Contracts

* [AccessControl](AccessControl.md)
* [AccessControlLibV1](AccessControlLibV1.md)
* [Address](Address.md)
* [BaseLibV1](BaseLibV1.md)
* [BokkyPooBahsDateTimeLibrary](BokkyPooBahsDateTimeLibrary.md)
* [BondPool](BondPool.md)
* [BondPoolBase](BondPoolBase.md)
* [BondPoolLibV1](BondPoolLibV1.md)
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
* [FakeUniswapPair](FakeUniswapPair.md)
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [Finalization](Finalization.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [IAccessControl](IAccessControl.md)
* [IBondPool](IBondPool.md)
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
* [IERC3156FlashBorrower](IERC3156FlashBorrower.md)
* [IERC3156FlashLender](IERC3156FlashLender.md)
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
* [IStakingPools](IStakingPools.md)
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
* [StakingPoolBase](StakingPoolBase.md)
* [StakingPoolInfo](StakingPoolInfo.md)
* [StakingPoolLibV1](StakingPoolLibV1.md)
* [StakingPoolReward](StakingPoolReward.md)
* [StakingPools](StakingPools.md)
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
* [WithFlashLoan](WithFlashLoan.md)
* [Witness](Witness.md)
