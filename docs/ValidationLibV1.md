# ValidationLibV1.sol

View Source: [contracts/libraries/ValidationLibV1.sol](../contracts/libraries/ValidationLibV1.sol)

**ValidationLibV1**

## Functions

- [mustNotBePaused(IStore s)](#mustnotbepaused)
- [mustEnsureAllProductsAreNormal(IStore s, bytes32 coverKey)](#mustensureallproductsarenormal)
- [mustHaveNormalProductStatus(IStore s, bytes32 coverKey, bytes32 productKey)](#musthavenormalproductstatus)
- [mustBeValidCoverKey(IStore s, bytes32 coverKey)](#mustbevalidcoverkey)
- [mustSupportProducts(IStore s, bytes32 coverKey)](#mustsupportproducts)
- [mustBeValidProduct(IStore s, bytes32 coverKey, bytes32 productKey)](#mustbevalidproduct)
- [mustBeActiveProduct(IStore s, bytes32 coverKey, bytes32 productKey)](#mustbeactiveproduct)
- [mustBeCoverOwner(IStore s, bytes32 coverKey, address sender)](#mustbecoverowner)
- [mustBeCoverOwnerOrCoverContract(IStore s, bytes32 coverKey, address sender)](#mustbecoverownerorcovercontract)
- [senderMustBeCoverOwnerOrAdmin(IStore s, bytes32 coverKey)](#sendermustbecoverowneroradmin)
- [senderMustBePolicyContract(IStore s)](#sendermustbepolicycontract)
- [senderMustBePolicyManagerContract(IStore s)](#sendermustbepolicymanagercontract)
- [senderMustBeCoverContract(IStore s)](#sendermustbecovercontract)
- [senderMustBeVaultContract(IStore s, bytes32 coverKey)](#sendermustbevaultcontract)
- [senderMustBeGovernanceContract(IStore s)](#sendermustbegovernancecontract)
- [senderMustBeClaimsProcessorContract(IStore s)](#sendermustbeclaimsprocessorcontract)
- [callerMustBeClaimsProcessorContract(IStore s, address caller)](#callermustbeclaimsprocessorcontract)
- [senderMustBeStrategyContract(IStore s)](#sendermustbestrategycontract)
- [callerMustBeStrategyContract(IStore s, address caller)](#callermustbestrategycontract)
- [callerMustBeSpecificStrategyContract(IStore s, address caller, bytes32 strategyName)](#callermustbespecificstrategycontract)
- [_getIsActiveStrategyKey(address strategyAddress)](#_getisactivestrategykey)
- [_getIsDisabledStrategyKey(address strategyAddress)](#_getisdisabledstrategykey)
- [senderMustBeProtocolMember(IStore s)](#sendermustbeprotocolmember)
- [mustBeReporting(IStore s, bytes32 coverKey, bytes32 productKey)](#mustbereporting)
- [mustBeDisputed(IStore s, bytes32 coverKey, bytes32 productKey)](#mustbedisputed)
- [mustBeClaimable(IStore s, bytes32 coverKey, bytes32 productKey)](#mustbeclaimable)
- [mustBeClaimingOrDisputed(IStore s, bytes32 coverKey, bytes32 productKey)](#mustbeclaimingordisputed)
- [mustBeReportingOrDisputed(IStore s, bytes32 coverKey, bytes32 productKey)](#mustbereportingordisputed)
- [mustBeBeforeResolutionDeadline(IStore s, bytes32 coverKey, bytes32 productKey)](#mustbebeforeresolutiondeadline)
- [mustNotHaveResolutionDeadline(IStore s, bytes32 coverKey, bytes32 productKey)](#mustnothaveresolutiondeadline)
- [mustBeAfterResolutionDeadline(IStore s, bytes32 coverKey, bytes32 productKey)](#mustbeafterresolutiondeadline)
- [mustBeAfterFinalization(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#mustbeafterfinalization)
- [mustBeValidIncidentDate(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#mustbevalidincidentdate)
- [mustHaveDispute(IStore s, bytes32 coverKey, bytes32 productKey)](#musthavedispute)
- [mustNotHaveDispute(IStore s, bytes32 coverKey, bytes32 productKey)](#mustnothavedispute)
- [mustBeDuringReportingPeriod(IStore s, bytes32 coverKey, bytes32 productKey)](#mustbeduringreportingperiod)
- [mustBeAfterReportingPeriod(IStore s, bytes32 coverKey, bytes32 productKey)](#mustbeafterreportingperiod)
- [mustBeValidCxToken(IStore s, bytes32 coverKey, bytes32 productKey, address cxToken, uint256 incidentDate)](#mustbevalidcxtoken)
- [mustBeValidClaim(IStore s, address account, bytes32 coverKey, bytes32 productKey, address cxToken, uint256 incidentDate, uint256 amount)](#mustbevalidclaim)
- [mustNotHaveUnstaken(IStore s, address account, bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#mustnothaveunstaken)
- [validateUnstakeWithoutClaim(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#validateunstakewithoutclaim)
- [validateUnstakeWithClaim(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate)](#validateunstakewithclaim)
- [mustBeDuringClaimPeriod(IStore s, bytes32 coverKey, bytes32 productKey)](#mustbeduringclaimperiod)
- [mustBeAfterClaimExpiry(IStore s, bytes32 coverKey, bytes32 productKey)](#mustbeafterclaimexpiry)
- [senderMustBeWhitelistedCoverCreator(IStore s)](#sendermustbewhitelistedcovercreator)
- [senderMustBeWhitelistedIfRequired(IStore s, bytes32 coverKey, bytes32 productKey, address sender)](#sendermustbewhitelistedifrequired)
- [mustBeSupportedProductOrEmpty(IStore s, bytes32 coverKey, bytes32 productKey)](#mustbesupportedproductorempty)
- [mustNotHavePolicyDisabled(IStore s, bytes32 coverKey, bytes32 productKey)](#mustnothavepolicydisabled)
- [mustNotExceedStablecoinThreshold(IStore s, uint256 amount)](#mustnotexceedstablecointhreshold)
- [mustNotExceedProposalThreshold(IStore s, uint256 amount)](#mustnotexceedproposalthreshold)

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

### mustEnsureAllProductsAreNormal

Reverts if the cover or any of the cover's product is not normal.

```solidity
function mustEnsureAllProductsAreNormal(IStore s, bytes32 coverKey) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 | Enter the cover key to check | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustEnsureAllProductsAreNormal(IStore s, bytes32 coverKey) external view {
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, coverKey), "Cover does not exist");
    require(s.isCoverNormalInternal(coverKey) == true, "Status not normal");
  }
```
</details>

### mustHaveNormalProductStatus

Reverts if the key does not resolve in a valid cover contract
 or if the cover is under governance.

```solidity
function mustHaveNormalProductStatus(IStore s, bytes32 coverKey, bytes32 productKey) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 | Enter the cover key to check | 
| productKey | bytes32 | Enter the product key to check | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustHaveNormalProductStatus(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, coverKey), "Cover does not exist");
    require(s.getProductStatusInternal(coverKey, productKey) == CoverUtilV1.ProductStatus.Normal, "Status not normal");
  }
```
</details>

### mustBeValidCoverKey

Reverts if the key does not resolve in a valid cover contract.

```solidity
function mustBeValidCoverKey(IStore s, bytes32 coverKey) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 | Enter the cover key to check | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeValidCoverKey(IStore s, bytes32 coverKey) external view {
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, coverKey), "Cover does not exist");
  }
```
</details>

### mustSupportProducts

Reverts if the cover does not support creating products.

```solidity
function mustSupportProducts(IStore s, bytes32 coverKey) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 | Enter the cover key to check | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustSupportProducts(IStore s, bytes32 coverKey) external view {
    require(s.supportsProductsInternal(coverKey), "Does not have products");
  }
```
</details>

### mustBeValidProduct

Reverts if the key does not resolve in a valid product of a cover contract.

```solidity
function mustBeValidProduct(IStore s, bytes32 coverKey, bytes32 productKey) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 | Enter the cover key to check | 
| productKey | bytes32 | Enter the cover key to check | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeValidProduct(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) public view {
    require(s.isValidProductInternal(coverKey, productKey), "Product does not exist");
  }
```
</details>

### mustBeActiveProduct

Reverts if the key resolves in an expired product.

```solidity
function mustBeActiveProduct(IStore s, bytes32 coverKey, bytes32 productKey) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 | Enter the cover key to check | 
| productKey | bytes32 | Enter the cover key to check | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeActiveProduct(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) public view {
    require(s.isActiveProductInternal(coverKey, productKey), "Product retired or deleted");
  }
```
</details>

### mustBeCoverOwner

Reverts if the sender is not the cover owner

```solidity
function mustBeCoverOwner(IStore s, bytes32 coverKey, address sender) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | ender The `msg.sender` value | 
| coverKey | bytes32 | Enter the cover key to check | 
| sender | address | The `msg.sender` value | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeCoverOwner(
    IStore s,
    bytes32 coverKey,
    address sender
  ) public view {
    bool isCoverOwner = s.getCoverOwner(coverKey) == sender;
    require(isCoverOwner, "Forbidden");
  }
```
</details>

### mustBeCoverOwnerOrCoverContract

Reverts if the sender is not the cover owner or the cover contract

```solidity
function mustBeCoverOwnerOrCoverContract(IStore s, bytes32 coverKey, address sender) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | ender The `msg.sender` value | 
| coverKey | bytes32 | Enter the cover key to check | 
| sender | address | The `msg.sender` value | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeCoverOwnerOrCoverContract(
    IStore s,
    bytes32 coverKey,
    address sender
  ) external view {
    bool isCoverOwner = s.getCoverOwner(coverKey) == sender;
    bool isCoverContract = address(s.getCoverContract()) == sender;

    require(isCoverOwner || isCoverContract, "Forbidden");
  }
```
</details>

### senderMustBeCoverOwnerOrAdmin

```solidity
function senderMustBeCoverOwnerOrAdmin(IStore s, bytes32 coverKey) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function senderMustBeCoverOwnerOrAdmin(IStore s, bytes32 coverKey) external view {
    if (AccessControlLibV1.hasAccess(s, AccessControlLibV1.NS_ROLES_ADMIN, msg.sender) == false) {
      mustBeCoverOwner(s, coverKey, msg.sender);
    }
  }
```
</details>

### senderMustBePolicyContract

```solidity
function senderMustBePolicyContract(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function senderMustBePolicyContract(IStore s) external view {
    s.senderMustBeExactContract(ProtoUtilV1.CNS_COVER_POLICY);
  }
```
</details>

### senderMustBePolicyManagerContract

```solidity
function senderMustBePolicyManagerContract(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function senderMustBePolicyManagerContract(IStore s) external view {
    s.senderMustBeExactContract(ProtoUtilV1.CNS_COVER_POLICY_MANAGER);
  }
```
</details>

### senderMustBeCoverContract

```solidity
function senderMustBeCoverContract(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function senderMustBeCoverContract(IStore s) external view {
    s.senderMustBeExactContract(ProtoUtilV1.CNS_COVER);
  }
```
</details>

### senderMustBeVaultContract

```solidity
function senderMustBeVaultContract(IStore s, bytes32 coverKey) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function senderMustBeVaultContract(IStore s, bytes32 coverKey) external view {
    address vault = s.getVaultAddress(coverKey);
    require(msg.sender == vault, "Forbidden");
  }
```
</details>

### senderMustBeGovernanceContract

```solidity
function senderMustBeGovernanceContract(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function senderMustBeGovernanceContract(IStore s) external view {
    s.senderMustBeExactContract(ProtoUtilV1.CNS_GOVERNANCE);
  }
```
</details>

### senderMustBeClaimsProcessorContract

```solidity
function senderMustBeClaimsProcessorContract(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function senderMustBeClaimsProcessorContract(IStore s) external view {
    s.senderMustBeExactContract(ProtoUtilV1.CNS_CLAIM_PROCESSOR);
  }
```
</details>

### callerMustBeClaimsProcessorContract

```solidity
function callerMustBeClaimsProcessorContract(IStore s, address caller) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| caller | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function callerMustBeClaimsProcessorContract(IStore s, address caller) external view {
    s.callerMustBeExactContract(ProtoUtilV1.CNS_CLAIM_PROCESSOR, caller);
  }
```
</details>

### senderMustBeStrategyContract

```solidity
function senderMustBeStrategyContract(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function senderMustBeStrategyContract(IStore s) external view {
    bool senderIsStrategyContract = s.getBoolByKey(_getIsActiveStrategyKey(msg.sender));
    require(senderIsStrategyContract == true, "Not a strategy contract");
  }
```
</details>

### callerMustBeStrategyContract

```solidity
function callerMustBeStrategyContract(IStore s, address caller) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| caller | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function callerMustBeStrategyContract(IStore s, address caller) public view {
    bool isActive = s.getBoolByKey(_getIsActiveStrategyKey(caller));
    bool wasDisabled = s.getBoolByKey(_getIsDisabledStrategyKey(caller));

    require(isActive == true || wasDisabled == true, "Not a strategy contract");
  }
```
</details>

### callerMustBeSpecificStrategyContract

```solidity
function callerMustBeSpecificStrategyContract(IStore s, address caller, bytes32 strategyName) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| caller | address |  | 
| strategyName | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function callerMustBeSpecificStrategyContract(
    IStore s,
    address caller,
    bytes32 strategyName
  ) external view {
    callerMustBeStrategyContract(s, caller);
    require(IMember(caller).getName() == strategyName, "Access denied");
  }
```
</details>

### _getIsActiveStrategyKey

Hash key of the "active strategy flag".
 Warning: this function does not validate the input arguments.

```solidity
function _getIsActiveStrategyKey(address strategyAddress) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| strategyAddress | address | Enter a strategy address | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getIsActiveStrategyKey(address strategyAddress) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LENDING_STRATEGY_ACTIVE, strategyAddress));
  }
```
</details>

### _getIsDisabledStrategyKey

Hash key of the "disabled strategy flag".
 Warning: this function does not validate the input arguments.

```solidity
function _getIsDisabledStrategyKey(address strategyAddress) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| strategyAddress | address | Enter a strategy address | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getIsDisabledStrategyKey(address strategyAddress) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LENDING_STRATEGY_DISABLED, strategyAddress));
  }
```
</details>

### senderMustBeProtocolMember

```solidity
function senderMustBeProtocolMember(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function senderMustBeProtocolMember(IStore s) external view {
    require(s.isProtocolMember(msg.sender), "Forbidden");
  }
```
</details>

### mustBeReporting

```solidity
function mustBeReporting(IStore s, bytes32 coverKey, bytes32 productKey) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeReporting(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    require(s.getProductStatusInternal(coverKey, productKey) == CoverUtilV1.ProductStatus.IncidentHappened, "Not reporting");
  }
```
</details>

### mustBeDisputed

```solidity
function mustBeDisputed(IStore s, bytes32 coverKey, bytes32 productKey) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeDisputed(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    require(s.getProductStatusInternal(coverKey, productKey) == CoverUtilV1.ProductStatus.FalseReporting, "Not disputed");
  }
```
</details>

### mustBeClaimable

```solidity
function mustBeClaimable(IStore s, bytes32 coverKey, bytes32 productKey) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeClaimable(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) public view {
    require(s.getProductStatusInternal(coverKey, productKey) == CoverUtilV1.ProductStatus.Claimable, "Not claimable");
  }
```
</details>

### mustBeClaimingOrDisputed

```solidity
function mustBeClaimingOrDisputed(IStore s, bytes32 coverKey, bytes32 productKey) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeClaimingOrDisputed(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    CoverUtilV1.ProductStatus status = s.getProductStatusInternal(coverKey, productKey);

    bool claiming = status == CoverUtilV1.ProductStatus.Claimable;
    bool falseReporting = status == CoverUtilV1.ProductStatus.FalseReporting;

    require(claiming || falseReporting, "Not claimable nor disputed");
  }
```
</details>

### mustBeReportingOrDisputed

```solidity
function mustBeReportingOrDisputed(IStore s, bytes32 coverKey, bytes32 productKey) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeReportingOrDisputed(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    CoverUtilV1.ProductStatus status = s.getProductStatusInternal(coverKey, productKey);
    bool incidentHappened = status == CoverUtilV1.ProductStatus.IncidentHappened;
    bool falseReporting = status == CoverUtilV1.ProductStatus.FalseReporting;

    require(incidentHappened || falseReporting, "Not reported nor disputed");
  }
```
</details>

### mustBeBeforeResolutionDeadline

```solidity
function mustBeBeforeResolutionDeadline(IStore s, bytes32 coverKey, bytes32 productKey) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeBeforeResolutionDeadline(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    uint256 deadline = s.getResolutionDeadlineInternal(coverKey, productKey);

    if (deadline > 0) {
      require(block.timestamp < deadline, "Emergency resolution deadline over"); // solhint-disable-line
    }
  }
```
</details>

### mustNotHaveResolutionDeadline

```solidity
function mustNotHaveResolutionDeadline(IStore s, bytes32 coverKey, bytes32 productKey) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustNotHaveResolutionDeadline(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    uint256 deadline = s.getResolutionDeadlineInternal(coverKey, productKey);
    require(deadline == 0, "Resolution already has deadline");
  }
```
</details>

### mustBeAfterResolutionDeadline

```solidity
function mustBeAfterResolutionDeadline(IStore s, bytes32 coverKey, bytes32 productKey) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeAfterResolutionDeadline(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) public view {
    uint256 deadline = s.getResolutionDeadlineInternal(coverKey, productKey);
    require(deadline > 0 && block.timestamp >= deadline, "Still unresolved"); // solhint-disable-line
  }
```
</details>

### mustBeAfterFinalization

```solidity
function mustBeAfterFinalization(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeAfterFinalization(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) public view {
    require(s.getBoolByKey(GovernanceUtilV1.getHasFinalizedKeyInternal(coverKey, productKey, incidentDate)), "Incident not finalized");
  }
```
</details>

### mustBeValidIncidentDate

```solidity
function mustBeValidIncidentDate(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeValidIncidentDate(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) public view {
    require(s.getActiveIncidentDateInternal(coverKey, productKey) == incidentDate, "Invalid incident date");
  }
```
</details>

### mustHaveDispute

```solidity
function mustHaveDispute(IStore s, bytes32 coverKey, bytes32 productKey) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustHaveDispute(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    bool hasDispute = s.getBoolByKey(GovernanceUtilV1.getHasDisputeKeyInternal(coverKey, productKey));
    require(hasDispute == true, "Not disputed");
  }
```
</details>

### mustNotHaveDispute

```solidity
function mustNotHaveDispute(IStore s, bytes32 coverKey, bytes32 productKey) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustNotHaveDispute(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    bool hasDispute = s.getBoolByKey(GovernanceUtilV1.getHasDisputeKeyInternal(coverKey, productKey));
    require(hasDispute == false, "Already disputed");
  }
```
</details>

### mustBeDuringReportingPeriod

```solidity
function mustBeDuringReportingPeriod(IStore s, bytes32 coverKey, bytes32 productKey) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeDuringReportingPeriod(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    require(s.getResolutionTimestampInternal(coverKey, productKey) >= block.timestamp, "Reporting window closed"); // solhint-disable-line
  }
```
</details>

### mustBeAfterReportingPeriod

```solidity
function mustBeAfterReportingPeriod(IStore s, bytes32 coverKey, bytes32 productKey) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeAfterReportingPeriod(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) public view {
    require(block.timestamp > s.getResolutionTimestampInternal(coverKey, productKey), "Reporting still active"); // solhint-disable-line
  }
```
</details>

### mustBeValidCxToken

```solidity
function mustBeValidCxToken(IStore s, bytes32 coverKey, bytes32 productKey, address cxToken, uint256 incidentDate) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| cxToken | address |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeValidCxToken(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    address cxToken,
    uint256 incidentDate
  ) public view {
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER_CXTOKEN, cxToken) == true, "Unknown cxToken");

    bytes32 COVER_KEY = ICxToken(cxToken).COVER_KEY(); // solhint-disable-line
    bytes32 PRODUCT_KEY = ICxToken(cxToken).PRODUCT_KEY(); // solhint-disable-line

    require(coverKey == COVER_KEY && productKey == PRODUCT_KEY, "Invalid cxToken");

    uint256 expires = ICxToken(cxToken).expiresOn();
    require(expires > incidentDate, "Invalid or expired cxToken");
  }
```
</details>

### mustBeValidClaim

```solidity
function mustBeValidClaim(IStore s, address account, bytes32 coverKey, bytes32 productKey, address cxToken, uint256 incidentDate, uint256 amount) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| account | address |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| cxToken | address |  | 
| incidentDate | uint256 |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeValidClaim(
    IStore s,
    address account,
    bytes32 coverKey,
    bytes32 productKey,
    address cxToken,
    uint256 incidentDate,
    uint256 amount
  ) external view {
    mustBeSupportedProductOrEmpty(s, coverKey, productKey);
    mustBeValidCxToken(s, coverKey, productKey, cxToken, incidentDate);
    mustBeClaimable(s, coverKey, productKey);
    mustBeValidIncidentDate(s, coverKey, productKey, incidentDate);
    mustBeDuringClaimPeriod(s, coverKey, productKey);
    require(ICxToken(cxToken).getClaimablePolicyOf(account) >= amount, "Claim exceeds your coverage");
  }
```
</details>

### mustNotHaveUnstaken

```solidity
function mustNotHaveUnstaken(IStore s, address account, bytes32 coverKey, bytes32 productKey, uint256 incidentDate) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| account | address |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustNotHaveUnstaken(
    IStore s,
    address account,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) public view {
    uint256 withdrawal = s.getReportingUnstakenAmountInternal(account, coverKey, productKey, incidentDate);
    require(withdrawal == 0, "Already unstaken");
  }
```
</details>

### validateUnstakeWithoutClaim

Validates your `unstakeWithoutClaim` arguments

```solidity
function validateUnstakeWithoutClaim(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function validateUnstakeWithoutClaim(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external view {
    mustNotBePaused(s);
    mustBeSupportedProductOrEmpty(s, coverKey, productKey);
    mustNotHaveUnstaken(s, msg.sender, coverKey, productKey, incidentDate);
    mustBeAfterFinalization(s, coverKey, productKey, incidentDate);
  }
```
</details>

### validateUnstakeWithClaim

Validates your `unstakeWithClaim` arguments

```solidity
function validateUnstakeWithClaim(IStore s, bytes32 coverKey, bytes32 productKey, uint256 incidentDate) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function validateUnstakeWithClaim(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external view {
    mustNotBePaused(s);
    mustBeSupportedProductOrEmpty(s, coverKey, productKey);
    mustNotHaveUnstaken(s, msg.sender, coverKey, productKey, incidentDate);

    // If this reporting gets finalized, incident date will become invalid
    // meaning this execution will revert thereby restricting late comers
    // to access this feature. But they can still access `unstake` feature
    // to withdraw their stake.
    mustBeValidIncidentDate(s, coverKey, productKey, incidentDate);

    // Before the deadline, emergency resolution can still happen
    // that may have an impact on the final decision. We, therefore, have to wait.
    mustBeAfterResolutionDeadline(s, coverKey, productKey);
  }
```
</details>

### mustBeDuringClaimPeriod

```solidity
function mustBeDuringClaimPeriod(IStore s, bytes32 coverKey, bytes32 productKey) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeDuringClaimPeriod(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) public view {
    uint256 beginsFrom = s.getUintByKeys(ProtoUtilV1.NS_CLAIM_BEGIN_TS, coverKey, productKey);
    uint256 expiresAt = s.getUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, coverKey, productKey);

    require(beginsFrom > 0, "Invalid claim begin date");
    require(expiresAt > beginsFrom, "Invalid claim period");

    require(block.timestamp >= beginsFrom, "Claim period hasn't begun"); // solhint-disable-line
    require(block.timestamp <= expiresAt, "Claim period has expired"); // solhint-disable-line
  }
```
</details>

### mustBeAfterClaimExpiry

```solidity
function mustBeAfterClaimExpiry(IStore s, bytes32 coverKey, bytes32 productKey) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeAfterClaimExpiry(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    require(block.timestamp > s.getUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, coverKey, productKey), "Claim still active"); // solhint-disable-line
  }
```
</details>

### senderMustBeWhitelistedCoverCreator

Reverts if the sender is not whitelisted cover creator.

```solidity
function senderMustBeWhitelistedCoverCreator(IStore s) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function senderMustBeWhitelistedCoverCreator(IStore s) external view {
    require(s.getAddressBooleanByKey(ProtoUtilV1.NS_COVER_CREATOR_WHITELIST, msg.sender), "Not whitelisted");
  }
```
</details>

### senderMustBeWhitelistedIfRequired

```solidity
function senderMustBeWhitelistedIfRequired(IStore s, bytes32 coverKey, bytes32 productKey, address sender) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 
| sender | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function senderMustBeWhitelistedIfRequired(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    address sender
  ) external view {
    bool supportsProducts = s.supportsProductsInternal(coverKey);
    bool required = supportsProducts ? s.checkIfProductRequiresWhitelist(coverKey, productKey) : s.checkIfRequiresWhitelist(coverKey);

    if (required == false) {
      return;
    }

    require(s.getAddressBooleanByKeys(ProtoUtilV1.NS_COVER_USER_WHITELIST, coverKey, productKey, sender), "You are not whitelisted");
  }
```
</details>

### mustBeSupportedProductOrEmpty

```solidity
function mustBeSupportedProductOrEmpty(IStore s, bytes32 coverKey, bytes32 productKey) public view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeSupportedProductOrEmpty(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) public view {
    bool hasProducts = s.supportsProductsInternal(coverKey);

    hasProducts ? require(productKey > 0, "Specify a product") : require(productKey == 0, "Invalid product");

    if (hasProducts) {
      mustBeValidProduct(s, coverKey, productKey);
      mustBeActiveProduct(s, coverKey, productKey);
    }
  }
```
</details>

### mustNotHavePolicyDisabled

```solidity
function mustNotHavePolicyDisabled(IStore s, bytes32 coverKey, bytes32 productKey) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| productKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustNotHavePolicyDisabled(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    require(!s.isPolicyDisabledInternal(coverKey, productKey), "Policy purchase disabled");
  }
```
</details>

### mustNotExceedStablecoinThreshold

```solidity
function mustNotExceedStablecoinThreshold(IStore s, uint256 amount) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustNotExceedStablecoinThreshold(IStore s, uint256 amount) external view {
    uint256 stablecoinPrecision = s.getStablecoinPrecision();
    require(amount <= ProtoUtilV1.MAX_LIQUIDITY * stablecoinPrecision, "Please specify a smaller amount");
  }
```
</details>

### mustNotExceedProposalThreshold

```solidity
function mustNotExceedProposalThreshold(IStore s, uint256 amount) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustNotExceedProposalThreshold(IStore s, uint256 amount) external view {
    uint256 stablecoinPrecision = s.getStablecoinPrecision();
    require(amount <= ProtoUtilV1.MAX_PROPOSAL_AMOUNT * stablecoinPrecision, "Please specify a smaller amount");
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
* [FakePriceOracle](FakePriceOracle.md)
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
* [INeptuneRouterV1](INeptuneRouterV1.md)
* [InvalidStrategy](InvalidStrategy.md)
* [IPausable](IPausable.md)
* [IPolicy](IPolicy.md)
* [IPolicyAdmin](IPolicyAdmin.md)
* [IPriceOracle](IPriceOracle.md)
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
* [MockLiquidityEngineUser](MockLiquidityEngineUser.md)
* [MockProcessorStore](MockProcessorStore.md)
* [MockProcessorStoreLib](MockProcessorStoreLib.md)
* [MockProtocol](MockProtocol.md)
* [MockRegistryClient](MockRegistryClient.md)
* [MockStore](MockStore.md)
* [MockStoreKeyUtilUser](MockStoreKeyUtilUser.md)
* [MockValidationLibUser](MockValidationLibUser.md)
* [MockVault](MockVault.md)
* [MockVaultLibUser](MockVaultLibUser.md)
* [NeptuneRouterV1](NeptuneRouterV1.md)
* [NPM](NPM.md)
* [NpmDistributor](NpmDistributor.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](NTransferUtilV2Intermediate.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Policy](Policy.md)
* [PolicyAdmin](PolicyAdmin.md)
* [PolicyHelperV1](PolicyHelperV1.md)
* [PoorMansERC20](PoorMansERC20.md)
* [POT](POT.md)
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
