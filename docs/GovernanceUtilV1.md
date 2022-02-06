# GovernanceUtilV1.sol

View Source: [contracts/libraries/GovernanceUtilV1.sol](../contracts/libraries/GovernanceUtilV1.sol)

**GovernanceUtilV1**

## Functions

- [getReportingPeriod(IStore s, bytes32 key)](#getreportingperiod)
- [getReportingBurnRate(IStore s)](#getreportingburnrate)
- [getGovernanceReporterCommission(IStore s)](#getgovernancereportercommission)
- [getClaimPlatformFee(IStore s)](#getclaimplatformfee)
- [getClaimReporterCommission(IStore s)](#getclaimreportercommission)
- [getMinReportingStake(IStore s, bytes32 key)](#getminreportingstake)
- [getLatestIncidentDate(IStore s, bytes32 key)](#getlatestincidentdate)
- [getResolutionTimestamp(IStore s, bytes32 key)](#getresolutiontimestamp)
- [getReporter(IStore s, bytes32 key, uint256 incidentDate)](#getreporter)
- [getStakes(IStore s, bytes32 key, uint256 incidentDate)](#getstakes)
- [getResolutionInfoFor(IStore s, address account, bytes32 key, uint256 incidentDate)](#getresolutioninfofor)
- [getUnstakeInfoForInternal(IStore s, address account, bytes32 key, uint256 incidentDate)](#getunstakeinfoforinternal)
- [updateUnstakeDetails(IStore s, address account, bytes32 key, uint256 incidentDate, uint256 originalStake, uint256 reward, uint256 burned, uint256 reporterFee)](#updateunstakedetails)
- [getStakesOf(IStore s, address account, bytes32 key, uint256 incidentDate)](#getstakesof)
- [updateCoverStatus(IStore s, bytes32 key, uint256 incidentDate)](#updatecoverstatus)
- [addAttestation(IStore s, bytes32 key, address who, uint256 incidentDate, uint256 stake)](#addattestation)
- [getAttestation(IStore s, bytes32 key, address who, uint256 incidentDate)](#getattestation)
- [addDispute(IStore s, bytes32 key, address who, uint256 incidentDate, uint256 stake)](#adddispute)
- [getDispute(IStore s, bytes32 key, address who, uint256 incidentDate)](#getdispute)
- [_getLatestIncidentDate(IStore s, bytes32 key)](#_getlatestincidentdate)

### getReportingPeriod

```solidity
function getReportingPeriod(IStore s, bytes32 key) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReportingPeriod(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_PERIOD, key);
  }
```
</details>

### getReportingBurnRate

```solidity
function getReportingBurnRate(IStore s) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReportingBurnRate(IStore s) public view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_BURN_RATE);
  }
```
</details>

### getGovernanceReporterCommission

```solidity
function getGovernanceReporterCommission(IStore s) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getGovernanceReporterCommission(IStore s) public view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTER_COMMISSION);
  }
```
</details>

### getClaimPlatformFee

```solidity
function getClaimPlatformFee(IStore s) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getClaimPlatformFee(IStore s) external view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_CLAIM_PLATFORM_FEE);
  }
```
</details>

### getClaimReporterCommission

```solidity
function getClaimReporterCommission(IStore s) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getClaimReporterCommission(IStore s) external view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_CLAIM_REPORTER_COMMISSION);
  }
```
</details>

### getMinReportingStake

```solidity
function getMinReportingStake(IStore s, bytes32 key) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getMinReportingStake(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, key);
  }
```
</details>

### getLatestIncidentDate

```solidity
function getLatestIncidentDate(IStore s, bytes32 key) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLatestIncidentDate(IStore s, bytes32 key) external view returns (uint256) {
    return _getLatestIncidentDate(s, key);
  }
```
</details>

### getResolutionTimestamp

```solidity
function getResolutionTimestamp(IStore s, bytes32 key) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getResolutionTimestamp(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_RESOLUTION_TS, key);
  }
```
</details>

### getReporter

```solidity
function getReporter(IStore s, bytes32 key, uint256 incidentDate) external view
returns(address)
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
function getReporter(
    IStore s,
    bytes32 key,
    uint256 incidentDate
  ) external view returns (address) {
    (uint256 yes, uint256 no) = getStakes(s, key, incidentDate);

    bytes32 prefix = yes >= no ? ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_YES : ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_NO;
    return s.getAddressByKeys(prefix, key);
  }
```
</details>

### getStakes

```solidity
function getStakes(IStore s, bytes32 key, uint256 incidentDate) public view
returns(yes uint256, no uint256)
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
function getStakes(
    IStore s,
    bytes32 key,
    uint256 incidentDate
  ) public view returns (uint256 yes, uint256 no) {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_YES, key, incidentDate));
    yes = s.getUintByKey(k);

    k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_NO, key, incidentDate));
    no = s.getUintByKey(k);
  }
```
</details>

### getResolutionInfoFor

```solidity
function getResolutionInfoFor(IStore s, address account, bytes32 key, uint256 incidentDate) public view
returns(totalStakeInWinningCamp uint256, totalStakeInLosingCamp uint256, myStakeInWinningCamp uint256)
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
function getResolutionInfoFor(
    IStore s,
    address account,
    bytes32 key,
    uint256 incidentDate
  )
    public
    view
    returns (
      uint256 totalStakeInWinningCamp,
      uint256 totalStakeInLosingCamp,
      uint256 myStakeInWinningCamp
    )
  {
    (uint256 yes, uint256 no) = getStakes(s, key, incidentDate);
    (uint256 myYes, uint256 myNo) = getStakesOf(s, account, key, incidentDate);

    totalStakeInWinningCamp = yes > no ? yes : no;
    totalStakeInLosingCamp = yes > no ? no : yes;
    myStakeInWinningCamp = yes > no ? myYes : myNo;
  }
```
</details>

### getUnstakeInfoForInternal

```solidity
function getUnstakeInfoForInternal(IStore s, address account, bytes32 key, uint256 incidentDate) external view
returns(totalStakeInWinningCamp uint256, totalStakeInLosingCamp uint256, myStakeInWinningCamp uint256, toBurn uint256, toReporter uint256, myReward uint256)
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
function getUnstakeInfoForInternal(
    IStore s,
    address account,
    bytes32 key,
    uint256 incidentDate
  )
    external
    view
    returns (
      uint256 totalStakeInWinningCamp,
      uint256 totalStakeInLosingCamp,
      uint256 myStakeInWinningCamp,
      uint256 toBurn,
      uint256 toReporter,
      uint256 myReward
    )
  {
    (totalStakeInWinningCamp, totalStakeInLosingCamp, myStakeInWinningCamp) = getResolutionInfoFor(s, account, key, incidentDate);

    require(myStakeInWinningCamp > 0, "Nothing to unstake");

    uint256 rewardRatio = (myStakeInWinningCamp * 1 ether) / totalStakeInWinningCamp;
    // slither-disable-next-line divide-before-multiply
    uint256 reward = (totalStakeInLosingCamp * rewardRatio) / 1 ether;

    toBurn = (reward * getReportingBurnRate(s)) / ProtoUtilV1.MULTIPLIER;
    toReporter = (reward * getGovernanceReporterCommission(s)) / ProtoUtilV1.MULTIPLIER;
    myReward = reward - toBurn - toReporter;
  }
```
</details>

### updateUnstakeDetails

```solidity
function updateUnstakeDetails(IStore s, address account, bytes32 key, uint256 incidentDate, uint256 originalStake, uint256 reward, uint256 burned, uint256 reporterFee) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| account | address |  | 
| key | bytes32 |  | 
| incidentDate | uint256 |  | 
| originalStake | uint256 |  | 
| reward | uint256 |  | 
| burned | uint256 |  | 
| reporterFee | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateUnstakeDetails(
    IStore s,
    address account,
    bytes32 key,
    uint256 incidentDate,
    uint256 originalStake,
    uint256 reward,
    uint256 burned,
    uint256 reporterFee
  ) external {
    // Unstake timestamp of the account
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_TS, key, incidentDate, account));
    s.setUintByKey(k, block.timestamp); // solhint-disable-line

    // Last unstake timestamp
    k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_TS, key, incidentDate));
    s.setUintByKey(k, block.timestamp); // solhint-disable-line

    // ---------------------------------------------------------------------

    // Amount unstaken by the account
    k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKEN, key, incidentDate, account));
    s.setUintByKey(k, originalStake);

    // Amount unstaken by everyone
    k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKEN, key, incidentDate));
    s.addUintByKey(k, originalStake);

    // ---------------------------------------------------------------------

    if (reward > 0) {
      // Reward received by the account
      k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_REWARD, key, incidentDate, account));
      s.setUintByKey(k, reward);

      // Total reward received
      k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_REWARD, key, incidentDate));
      s.addUintByKey(k, reward);
    }

    // ---------------------------------------------------------------------

    if (burned > 0) {
      // Total burned
      k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_BURNED, key, incidentDate));
      s.addUintByKey(k, burned);
    }

    if (reporterFee > 0) {
      // Total fee paid to the final reporter
      k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_UNSTAKE_REPORTER_FEE, key, incidentDate));
      s.addUintByKey(k, reporterFee);
    }
  }
```
</details>

### getStakesOf

```solidity
function getStakesOf(IStore s, address account, bytes32 key, uint256 incidentDate) public view
returns(yes uint256, no uint256)
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
function getStakesOf(
    IStore s,
    address account,
    bytes32 key,
    uint256 incidentDate
  ) public view returns (uint256 yes, uint256 no) {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_STAKE_OWNED_NO, key, incidentDate, account));
    no = s.getUintByKey(k);

    k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_STAKE_OWNED_YES, key, incidentDate, account));
    yes = s.getUintByKey(k);
  }
```
</details>

### updateCoverStatus

```solidity
function updateCoverStatus(IStore s, bytes32 key, uint256 incidentDate) public nonpayable
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
function updateCoverStatus(
    IStore s,
    bytes32 key,
    uint256 incidentDate
  ) public {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_YES, key, incidentDate));
    uint256 yes = s.getUintByKey(k);

    k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_NO, key, incidentDate));
    uint256 no = s.getUintByKey(k);

    if (no > yes) {
      s.setStatus(key, CoverUtilV1.CoverStatus.FalseReporting);
      return;
    }

    s.setStatus(key, CoverUtilV1.CoverStatus.IncidentHappened);
  }
```
</details>

### addAttestation

```solidity
function addAttestation(IStore s, bytes32 key, address who, uint256 incidentDate, uint256 stake) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| who | address |  | 
| incidentDate | uint256 |  | 
| stake | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addAttestation(
    IStore s,
    bytes32 key,
    address who,
    uint256 incidentDate,
    uint256 stake
  ) external {
    // @suppress-address-trust-issue The address `who` can be trusted here because we are not performing any direct calls to it.
    // Add individual stake of the reporter
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_STAKE_OWNED_YES, key, incidentDate, who));
    s.addUintByKey(k, stake);

    // All "incident happened" camp witnesses combined
    k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_YES, key, incidentDate));
    uint256 currentStake = s.getUintByKey(k);

    // No has reported yet, this is the first report
    if (currentStake == 0) {
      s.setAddressByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_YES, key, msg.sender);
    }

    s.addUintByKey(k, stake);
    updateCoverStatus(s, key, incidentDate);

    s.updateStateAndLiquidity(key);
  }
```
</details>

### getAttestation

```solidity
function getAttestation(IStore s, bytes32 key, address who, uint256 incidentDate) external view
returns(myStake uint256, totalStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| who | address |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAttestation(
    IStore s,
    bytes32 key,
    address who,
    uint256 incidentDate
  ) external view returns (uint256 myStake, uint256 totalStake) {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_STAKE_OWNED_YES, key, incidentDate, who));
    myStake = s.getUintByKey(k);

    k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_YES, key, incidentDate));
    totalStake = s.getUintByKey(k);
  }
```
</details>

### addDispute

```solidity
function addDispute(IStore s, bytes32 key, address who, uint256 incidentDate, uint256 stake) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| who | address |  | 
| incidentDate | uint256 |  | 
| stake | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addDispute(
    IStore s,
    bytes32 key,
    address who,
    uint256 incidentDate,
    uint256 stake
  ) external {
    // @suppress-address-trust-issue The address `who` can be trusted here because we are not performing any direct calls to it.

    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_STAKE_OWNED_NO, key, incidentDate, who));
    s.addUintByKey(k, stake);

    k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_NO, key, incidentDate));
    uint256 currentStake = s.getUintByKey(k);

    if (currentStake == 0) {
      // The first reporter who disputed
      s.setAddressByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_NO, key, msg.sender);
    }

    s.addUintByKey(k, stake);

    updateCoverStatus(s, key, incidentDate);

    s.updateStateAndLiquidity(key);
  }
```
</details>

### getDispute

```solidity
function getDispute(IStore s, bytes32 key, address who, uint256 incidentDate) external view
returns(myStake uint256, totalStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| who | address |  | 
| incidentDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getDispute(
    IStore s,
    bytes32 key,
    address who,
    uint256 incidentDate
  ) external view returns (uint256 myStake, uint256 totalStake) {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_STAKE_OWNED_NO, key, incidentDate, who));
    myStake = s.getUintByKey(k);

    k = keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_NO, key, incidentDate));
    totalStake = s.getUintByKey(k);
  }
```
</details>

### _getLatestIncidentDate

```solidity
function _getLatestIncidentDate(IStore s, bytes32 key) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getLatestIncidentDate(IStore s, bytes32 key) private view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_INCIDENT_DATE, key);
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
* [Controller](Controller.md)
* [Cover](Cover.md)
* [CoverBase](CoverBase.md)
* [CoverLibV1](CoverLibV1.md)
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
* [FakeAaveLendingPool](FakeAaveLendingPool.md)
* [FakeCompoundERC20Delegator](FakeCompoundERC20Delegator.md)
* [FakeRecoverable](FakeRecoverable.md)
* [FakeStore](FakeStore.md)
* [FakeToken](FakeToken.md)
* [FakeUniswapPair](FakeUniswapPair.md)
* [FakeUniswapV2FactoryLike](FakeUniswapV2FactoryLike.md)
* [FakeUniswapV2PairLike](FakeUniswapV2PairLike.md)
* [FakeUniswapV2RouterLike](FakeUniswapV2RouterLike.md)
* [Finalization](Finalization.md)
* [Governance](Governance.md)
* [GovernanceUtilV1](GovernanceUtilV1.md)
* [IAaveV2LendingPoolLike](IAaveV2LendingPoolLike.md)
* [IAccessControl](IAccessControl.md)
* [IBondPool](IBondPool.md)
* [IClaimsProcessor](IClaimsProcessor.md)
* [ICommission](ICommission.md)
* [ICompoundERC20DelegatorLike](ICompoundERC20DelegatorLike.md)
* [ICover](ICover.md)
* [ICoverProvision](ICoverProvision.md)
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
* [IMember](IMember.md)
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
* [IUniswapV2FactoryLike](IUniswapV2FactoryLike.md)
* [IUniswapV2PairLike](IUniswapV2PairLike.md)
* [IUniswapV2RouterLike](IUniswapV2RouterLike.md)
* [IUnstakable](IUnstakable.md)
* [IVault](IVault.md)
* [IVaultFactory](IVaultFactory.md)
* [IWitness](IWitness.md)
* [LiquidityEngine](LiquidityEngine.md)
* [MaliciousToken](MaliciousToken.md)
* [Migrations](Migrations.md)
* [MockCxToken](MockCxToken.md)
* [MockCxTokenPolicy](MockCxTokenPolicy.md)
* [MockCxTokenStore](MockCxTokenStore.md)
* [MockProcessorStore](MockProcessorStore.md)
* [MockProcessorStoreLib](MockProcessorStoreLib.md)
* [MockProtocol](MockProtocol.md)
* [MockStore](MockStore.md)
* [MockVault](MockVault.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](NTransferUtilV2Intermediate.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Policy](Policy.md)
* [PolicyAdmin](PolicyAdmin.md)
* [PolicyHelperV1](PolicyHelperV1.md)
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
* [Unstakable](Unstakable.md)
* [ValidationLibV1](ValidationLibV1.md)
* [Vault](Vault.md)
* [VaultBase](VaultBase.md)
* [VaultFactory](VaultFactory.md)
* [VaultFactoryLibV1](VaultFactoryLibV1.md)
* [VaultLibV1](VaultLibV1.md)
* [WithFlashLoan](WithFlashLoan.md)
* [Witness](Witness.md)
