# BondPoolLibV1.sol

View Source: [contracts/libraries/BondPoolLibV1.sol](../contracts/libraries/BondPoolLibV1.sol)

**BondPoolLibV1**

## Contract Members
**Constants & Variables**

```js
bytes32 public constant NS_BOND_TO_CLAIM;
bytes32 public constant NS_BOND_CONTRIBUTION;
bytes32 public constant NS_BOND_LP_TOKEN;
bytes32 public constant NS_LQ_TREASURY;
bytes32 public constant NS_BOND_DISCOUNT_RATE;
bytes32 public constant NS_BOND_MAX_UNIT;
bytes32 public constant NS_BOND_VESTING_TERM;
bytes32 public constant NS_BOND_UNLOCK_DATE;
bytes32 public constant NS_BOND_TOTAL_NPM_ALLOCATED;
bytes32 public constant NS_BOND_TOTAL_NPM_DISTRIBUTED;

```

## Functions

- [calculateTokensForLpInternal(IStore s, uint256 lpTokens)](#calculatetokensforlpinternal)
- [getBondPoolInfoInternal(IStore s, address you)](#getbondpoolinfointernal)
- [_getLpTokenAddress(IStore s)](#_getlptokenaddress)
- [_getYourBondContribution(IStore s, address you)](#_getyourbondcontribution)
- [_getYourBondClaimable(IStore s, address you)](#_getyourbondclaimable)
- [_getYourBondUnlockDate(IStore s, address you)](#_getyourbondunlockdate)
- [_getDiscountRate(IStore s)](#_getdiscountrate)
- [_getVestingTerm(IStore s)](#_getvestingterm)
- [_getMaxBondInUnit(IStore s)](#_getmaxbondinunit)
- [_getTotalNpmAllocated(IStore s)](#_gettotalnpmallocated)
- [_getTotalNpmDistributed(IStore s)](#_gettotalnpmdistributed)
- [createBondInternal(IStore s, uint256 lpTokens, uint256 minNpmDesired)](#createbondinternal)
- [claimBondInternal(IStore s)](#claimbondinternal)
- [setupBondPoolInternal(IStore s, address[] addresses, uint256[] values)](#setupbondpoolinternal)

### calculateTokensForLpInternal

```solidity
function calculateTokensForLpInternal(IStore s, uint256 lpTokens) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| lpTokens | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculateTokensForLpInternal(IStore s, uint256 lpTokens) public view returns (uint256) {
    IUniswapV2PairLike pair = IUniswapV2PairLike(_getLpTokenAddress(s));
    uint256 dollarValue = s.getPairLiquidityInStablecoin(pair, lpTokens);

    uint256 npmPrice = s.getNpmPriceInternal(1 ether);
    uint256 discount = _getDiscountRate(s);
    uint256 discountedNpmPrice = (npmPrice * (ProtoUtilV1.MULTIPLIER - discount)) / ProtoUtilV1.MULTIPLIER;

    uint256 npmForContribution = (dollarValue * 1 ether) / discountedNpmPrice;

    return npmForContribution;
  }
```
</details>

### getBondPoolInfoInternal

Gets the bond pool information

```solidity
function getBondPoolInfoInternal(IStore s, address you) external view
returns(addresses address[], values uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Provide a store instance | 
| you | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBondPoolInfoInternal(IStore s, address you) external view returns (address[] memory addresses, uint256[] memory values) {
    addresses = new address[](1);
    values = new uint256[](10);

    addresses[0] = _getLpTokenAddress(s);

    values[0] = s.getNpmPriceInternal(1 ether); // marketPrice
    values[1] = _getDiscountRate(s); // discountRate
    values[2] = _getVestingTerm(s); // vestingTerm
    values[3] = _getMaxBondInUnit(s); // maxBond
    values[4] = _getTotalNpmAllocated(s); // totalNpmAllocated
    values[5] = _getTotalNpmDistributed(s); // totalNpmDistributed
    values[6] = IERC20(s.npmToken()).balanceOf(address(this)); // npmAvailable

    values[7] = _getYourBondContribution(s, you); // bondContribution --> total lp tokens contributed by you
    values[8] = _getYourBondClaimable(s, you); // claimable --> your total claimable NPM tokens at the end of the vesting period or "unlock date"
    values[9] = _getYourBondUnlockDate(s, you); // unlockDate --> your vesting period end or "unlock date"
  }
```
</details>

### _getLpTokenAddress

```solidity
function _getLpTokenAddress(IStore s) private view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getLpTokenAddress(IStore s) private view returns (address) {
    return s.getAddressByKey(BondPoolLibV1.NS_BOND_LP_TOKEN);
  }
```
</details>

### _getYourBondContribution

```solidity
function _getYourBondContribution(IStore s, address you) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| you | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getYourBondContribution(IStore s, address you) private view returns (uint256) {
    return s.getUintByKey(keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_CONTRIBUTION, you)));
  }
```
</details>

### _getYourBondClaimable

```solidity
function _getYourBondClaimable(IStore s, address you) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| you | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getYourBondClaimable(IStore s, address you) private view returns (uint256) {
    return s.getUintByKey(keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_TO_CLAIM, you)));
  }
```
</details>

### _getYourBondUnlockDate

```solidity
function _getYourBondUnlockDate(IStore s, address you) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| you | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getYourBondUnlockDate(IStore s, address you) private view returns (uint256) {
    return s.getUintByKey(keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_UNLOCK_DATE, you)));
  }
```
</details>

### _getDiscountRate

```solidity
function _getDiscountRate(IStore s) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getDiscountRate(IStore s) private view returns (uint256) {
    return s.getUintByKey(NS_BOND_DISCOUNT_RATE);
  }
```
</details>

### _getVestingTerm

```solidity
function _getVestingTerm(IStore s) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getVestingTerm(IStore s) private view returns (uint256) {
    return s.getUintByKey(NS_BOND_VESTING_TERM);
  }
```
</details>

### _getMaxBondInUnit

```solidity
function _getMaxBondInUnit(IStore s) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getMaxBondInUnit(IStore s) private view returns (uint256) {
    return s.getUintByKey(NS_BOND_MAX_UNIT);
  }
```
</details>

### _getTotalNpmAllocated

```solidity
function _getTotalNpmAllocated(IStore s) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getTotalNpmAllocated(IStore s) private view returns (uint256) {
    return s.getUintByKey(NS_BOND_TOTAL_NPM_ALLOCATED);
  }
```
</details>

### _getTotalNpmDistributed

```solidity
function _getTotalNpmDistributed(IStore s) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getTotalNpmDistributed(IStore s) private view returns (uint256) {
    return s.getUintByKey(NS_BOND_TOTAL_NPM_DISTRIBUTED);
  }
```
</details>

### createBondInternal

```solidity
function createBondInternal(IStore s, uint256 lpTokens, uint256 minNpmDesired) external nonpayable
returns(values uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| lpTokens | uint256 |  | 
| minNpmDesired | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function createBondInternal(
    IStore s,
    uint256 lpTokens,
    uint256 minNpmDesired
  ) external returns (uint256[] memory values) {
    s.mustNotBePaused();

    values = new uint256[](2);
    values[0] = calculateTokensForLpInternal(s, lpTokens); // npmToVest

    require(minNpmDesired > 0, "Invalid value: `minNpmDesired`");
    require(values[0] >= minNpmDesired, "Min bond `minNpmDesired` failed");

    // Pull the tokens from the requester's account
    IERC20(s.getAddressByKey(BondPoolLibV1.NS_BOND_LP_TOKEN)).ensureTransferFrom(msg.sender, s.getAddressByKey(BondPoolLibV1.NS_LQ_TREASURY), lpTokens);

    // To claim later
    bytes32 k = keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_TO_CLAIM, msg.sender));
    s.addUintByKey(k, values[0]);

    // Amount contributed
    k = keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_CONTRIBUTION, msg.sender));
    s.addUintByKey(k, lpTokens);

    // unlock date
    values[1] = block.timestamp + _getVestingTerm(s); // solhint-disable-line

    // Unlock date
    k = keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_UNLOCK_DATE, msg.sender));
    s.setUintByKey(k, values[1]);
  }
```
</details>

### claimBondInternal

```solidity
function claimBondInternal(IStore s) external nonpayable
returns(values uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function claimBondInternal(IStore s) external returns (uint256[] memory values) {
    s.mustNotBePaused();

    values = new uint256[](1);

    values[0] = _getYourBondClaimable(s, msg.sender); // npmToTransfer

    // Clear the claim amount
    s.setUintByKey(keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_TO_CLAIM, msg.sender)), 0);

    uint256 unlocksOn = _getYourBondUnlockDate(s, msg.sender);

    // Clear the unlock date
    s.setUintByKey(keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_UNLOCK_DATE, msg.sender)), 0);

    require(block.timestamp >= unlocksOn, "Still vesting"); // solhint-disable-line
    require(values[0] > 0, "Nothing to claim");

    s.addUintByKey(BondPoolLibV1.NS_BOND_TOTAL_NPM_DISTRIBUTED, values[0]);
    IERC20(s.npmToken()).ensureTransfer(msg.sender, values[0]);
  }
```
</details>

### setupBondPoolInternal

Sets up the bond pool

```solidity
function setupBondPoolInternal(IStore s, address[] addresses, uint256[] values) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Provide an instance of the store | 
| addresses | address[] | [0] - LP Token Address | 
| values | uint256[] | [0] - Bond Discount Rate | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setupBondPoolInternal(
    IStore s,
    address[] memory addresses,
    uint256[] memory values
  ) external {
    if (addresses[0] != address(0)) {
      s.setAddressByKey(BondPoolLibV1.NS_BOND_LP_TOKEN, addresses[0]);
    }

    if (addresses[1] != address(0)) {
      s.setAddressByKey(BondPoolLibV1.NS_LQ_TREASURY, addresses[1]);
    }

    if (values[0] > 0) {
      s.setUintByKey(BondPoolLibV1.NS_BOND_DISCOUNT_RATE, values[0]);
    }

    if (values[1] > 0) {
      s.setUintByKey(BondPoolLibV1.NS_BOND_MAX_UNIT, values[1]);
    }

    if (values[2] > 0) {
      s.setUintByKey(BondPoolLibV1.NS_BOND_VESTING_TERM, values[2]);
    }

    if (values[3] > 0) {
      IERC20(s.npmToken()).ensureTransferFrom(msg.sender, address(this), values[3]);
      s.addUintByKey(BondPoolLibV1.NS_BOND_TOTAL_NPM_ALLOCATED, values[3]);
    }
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
