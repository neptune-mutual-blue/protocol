# Protocol.sol

View Source: [contracts/core/Protocol.sol](../contracts/core/Protocol.sol)

**↗ Extends: [IProtocol](IProtocol.md), [ProtoBase](ProtoBase.md)**

**Protocol**

## Contract Members
**Constants & Variables**

```js
uint256 public initialized;

```

## Functions

- [constructor(IStore store)](#)
- [initialize(address uniswapV2RouterLike, address npm, address treasury, address reassuranceVault, uint256 coverFee, uint256 minStake, uint256 minReportingStake, uint256 minLiquidityPeriod, uint256 claimPeriod, uint256 burnRate, uint256 reporterCommission)](#initialize)
- [setReportingBurnRate(uint256 value)](#setreportingburnrate)
- [setReportingCommission(uint256 value)](#setreportingcommission)
- [setClaimPeriod(uint256 value)](#setclaimperiod)
- [setCoverFees(uint256 value)](#setcoverfees)
- [setMinStake(uint256 value)](#setminstake)
- [setMinReportingStake(uint256 value)](#setminreportingstake)
- [setMinLiquidityPeriod(uint256 value)](#setminliquidityperiod)
- [_setReportingBurnRate(uint256 value)](#_setreportingburnrate)
- [_setReporterCommission(uint256 value)](#_setreportercommission)
- [_setClaimPeriod(uint256 value)](#_setclaimperiod)
- [_setCoverFees(uint256 value)](#_setcoverfees)
- [_setMinStake(uint256 value)](#_setminstake)
- [_setMinReportingStake(uint256 value)](#_setminreportingstake)
- [_setMinLiquidityPeriod(uint256 value)](#_setminliquidityperiod)
- [upgradeContract(bytes32 namespace, address previous, address current)](#upgradecontract)
- [addContract(bytes32 namespace, address contractAddress)](#addcontract)
- [removeMember(address member)](#removemember)
- [addMember(address member)](#addmember)
- [version()](#version)
- [getName()](#getname)

### 

```solidity
function (IStore store) public nonpayable ProtoBase 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(IStore store) ProtoBase(store) {}
```
</details>

### initialize

```solidity
function initialize(address uniswapV2RouterLike, address npm, address treasury, address reassuranceVault, uint256 coverFee, uint256 minStake, uint256 minReportingStake, uint256 minLiquidityPeriod, uint256 claimPeriod, uint256 burnRate, uint256 reporterCommission) external nonpayable nonReentrant whenNotPaused 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| uniswapV2RouterLike | address |  | 
| npm | address |  | 
| treasury | address |  | 
| reassuranceVault | address |  | 
| coverFee | uint256 |  | 
| minStake | uint256 |  | 
| minReportingStake | uint256 |  | 
| minLiquidityPeriod | uint256 |  | 
| claimPeriod | uint256 |  | 
| burnRate | uint256 |  | 
| reporterCommission | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function initialize(
    address uniswapV2RouterLike,
    address npm,
    address treasury,
    address reassuranceVault,
    uint256 coverFee,
    uint256 minStake,
    uint256 minReportingStake,
    uint256 minLiquidityPeriod,
    uint256 claimPeriod,
    uint256 burnRate,
    uint256 reporterCommission
  ) external nonReentrant whenNotPaused {
    // @supress-acl Can only be called once by the deployer
    s.mustBeProtocolMember(msg.sender);

    require(initialized == 0, "Already initialized");
    require(npm != address(0), "Invalid NPM");
    require(uniswapV2RouterLike != address(0), "Invalid Router");
    require(treasury != address(0), "Invalid Treasury");
    require(reassuranceVault != address(0), "Invalid Vault");

    s.setAddressByKey(ProtoUtilV1.NS_CORE, address(this));
    s.setBoolByKeys(ProtoUtilV1.NS_CONTRACTS, address(this), true);
    s.setAddressByKey(ProtoUtilV1.NS_BURNER, 0x0000000000000000000000000000000000000001);

    s.setAddressByKey(ProtoUtilV1.NS_SETUP_NPM, npm);
    s.setAddressByKey(ProtoUtilV1.NS_SETUP_UNISWAP_V2_ROUTER, uniswapV2RouterLike);
    s.setAddressByKey(ProtoUtilV1.NS_TREASURY, treasury);
    s.setAddressByKey(ProtoUtilV1.NS_REASSURANCE_VAULT, reassuranceVault);

    _setCoverFees(coverFee);
    _setMinStake(minStake);
    _setMinReportingStake(minReportingStake);
    _setMinLiquidityPeriod(minLiquidityPeriod);

    _setReportingBurnRate(burnRate);
    _setReporterCommission(reporterCommission);
    _setClaimPeriod(claimPeriod);

    initialized = 1;
  }
```
</details>

### setReportingBurnRate

```solidity
function setReportingBurnRate(uint256 value) public nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setReportingBurnRate(uint256 value) public nonReentrant {
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeCoverManager(s);
    _setReportingBurnRate(value);
  }
```
</details>

### setReportingCommission

```solidity
function setReportingCommission(uint256 value) public nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setReportingCommission(uint256 value) public nonReentrant {
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeCoverManager(s);
    _setReporterCommission(value);
  }
```
</details>

### setClaimPeriod

```solidity
function setClaimPeriod(uint256 value) public nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setClaimPeriod(uint256 value) public nonReentrant {
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeCoverManager(s);
    _setClaimPeriod(value);
  }
```
</details>

### setCoverFees

```solidity
function setCoverFees(uint256 value) public nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setCoverFees(uint256 value) public nonReentrant {
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeCoverManager(s);
    _setCoverFees(value);
  }
```
</details>

### setMinStake

```solidity
function setMinStake(uint256 value) public nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setMinStake(uint256 value) public nonReentrant {
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeCoverManager(s);

    _setMinStake(value);
  }
```
</details>

### setMinReportingStake

```solidity
function setMinReportingStake(uint256 value) public nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setMinReportingStake(uint256 value) public nonReentrant {
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeCoverManager(s);
    _setMinReportingStake(value);
  }
```
</details>

### setMinLiquidityPeriod

```solidity
function setMinLiquidityPeriod(uint256 value) public nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setMinLiquidityPeriod(uint256 value) public nonReentrant {
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeLiquidityManager(s);

    _setMinLiquidityPeriod(value);
  }
```
</details>

### _setReportingBurnRate

```solidity
function _setReportingBurnRate(uint256 value) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _setReportingBurnRate(uint256 value) private {
    uint256 previous = s.getUintByKey(ProtoUtilV1.NS_REPORTING_BURN_RATE);
    s.setUintByKey(ProtoUtilV1.NS_REPORTING_BURN_RATE, value);

    emit ReportingBurnRateSet(previous, value);
  }
```
</details>

### _setReporterCommission

```solidity
function _setReporterCommission(uint256 value) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _setReporterCommission(uint256 value) private {
    uint256 previous = s.getUintByKey(ProtoUtilV1.NS_REPORTER_COMMISSION);
    s.setUintByKey(ProtoUtilV1.NS_REPORTER_COMMISSION, value);

    emit ReporterCommissionSet(previous, value);
  }
```
</details>

### _setClaimPeriod

```solidity
function _setClaimPeriod(uint256 value) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _setClaimPeriod(uint256 value) private {
    uint256 previous = s.getUintByKey(ProtoUtilV1.NS_SETUP_CLAIM_PERIOD);
    s.setUintByKey(ProtoUtilV1.NS_SETUP_CLAIM_PERIOD, value);

    emit ClaimPeriodSet(previous, value);
  }
```
</details>

### _setCoverFees

```solidity
function _setCoverFees(uint256 value) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _setCoverFees(uint256 value) private {
    uint256 previous = s.getUintByKey(ProtoUtilV1.NS_SETUP_COVER_FEE);
    s.setUintByKey(ProtoUtilV1.NS_SETUP_COVER_FEE, value);

    emit CoverFeeSet(previous, value);
  }
```
</details>

### _setMinStake

```solidity
function _setMinStake(uint256 value) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _setMinStake(uint256 value) private {
    uint256 previous = s.getUintByKey(ProtoUtilV1.NS_SETUP_MIN_STAKE);
    s.setUintByKey(ProtoUtilV1.NS_SETUP_MIN_STAKE, value);

    emit MinStakeSet(previous, value);
  }
```
</details>

### _setMinReportingStake

```solidity
function _setMinReportingStake(uint256 value) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _setMinReportingStake(uint256 value) private {
    uint256 previous = s.getUintByKey(ProtoUtilV1.NS_SETUP_FIRST_REPORTING_STAKE);
    s.setUintByKey(ProtoUtilV1.NS_SETUP_FIRST_REPORTING_STAKE, value);

    emit MinReportingStakeSet(previous, value);
  }
```
</details>

### _setMinLiquidityPeriod

```solidity
function _setMinLiquidityPeriod(uint256 value) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _setMinLiquidityPeriod(uint256 value) private {
    uint256 previous = s.getUintByKey(ProtoUtilV1.NS_SETUP_MIN_LIQ_PERIOD);
    s.setUintByKey(ProtoUtilV1.NS_SETUP_MIN_LIQ_PERIOD, value);

    emit MinLiquidityPeriodSet(previous, value);
  }
```
</details>

### upgradeContract

```solidity
function upgradeContract(bytes32 namespace, address previous, address current) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| namespace | bytes32 |  | 
| previous | address |  | 
| current | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function upgradeContract(
    bytes32 namespace,
    address previous,
    address current
  ) external override nonReentrant {
    ProtoUtilV1.mustBeProtocolMember(s, previous);
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeUpgradeAgent(s);

    s.upgradeContract(namespace, previous, current);
    emit ContractUpgraded(namespace, previous, current);
  }
```
</details>

### addContract

```solidity
function addContract(bytes32 namespace, address contractAddress) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| namespace | bytes32 |  | 
| contractAddress | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addContract(bytes32 namespace, address contractAddress) external override nonReentrant {
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeUpgradeAgent(s);

    s.addContract(namespace, contractAddress);
    emit ContractAdded(namespace, contractAddress);
  }
```
</details>

### removeMember

```solidity
function removeMember(address member) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| member | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeMember(address member) external override nonReentrant {
    ProtoUtilV1.mustBeProtocolMember(s, member);
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeUpgradeAgent(s);

    s.removeMember(member);
    emit MemberRemoved(member);
  }
```
</details>

### addMember

```solidity
function addMember(address member) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| member | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addMember(address member) external override nonReentrant {
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeUpgradeAgent(s);

    s.addMember(member);
    emit MemberAdded(member);
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
    return "Neptune Mutual Protocol";
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
