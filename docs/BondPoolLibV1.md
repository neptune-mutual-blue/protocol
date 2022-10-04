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
- [_getNpmBalance(IStore s)](#_getnpmbalance)
- [_getBondCommitment(IStore s)](#_getbondcommitment)
- [claimBondInternal(IStore s)](#claimbondinternal)
- [setupBondPoolInternal(IStore s, struct IBondPool.SetupBondPoolArgs args)](#setupbondpoolinternal)

### calculateTokensForLpInternal

Calculates the discounted NPM token to be given
 for the NPM/Stablecoin Uniswap v2 LP token units.

```solidity
function calculateTokensForLpInternal(IStore s, uint256 lpTokens) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| lpTokens | uint256 | Enter the NPM/Stablecoin Uniswap v2 LP token units | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculateTokensForLpInternal(IStore s, uint256 lpTokens) public view returns (uint256) {
    uint256 dollarValue = s.convertNpmLpUnitsToStabelcoin(lpTokens);

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
returns(info struct IBondPool.BondPoolInfoType)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Provide a store instance | 
| you | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getBondPoolInfoInternal(IStore s, address you) external view returns (IBondPool.BondPoolInfoType memory info) {
    info.lpToken = _getLpTokenAddress(s);

    info.marketPrice = s.getNpmPriceInternal(1 ether);
    info.discountRate = _getDiscountRate(s);
    info.vestingTerm = _getVestingTerm(s);
    info.maxBond = _getMaxBondInUnit(s);
    info.totalNpmAllocated = _getTotalNpmAllocated(s);
    info.totalNpmDistributed = _getTotalNpmDistributed(s);
    info.npmAvailable = IERC20(s.npmToken()).balanceOf(address(this));

    info.bondContribution = _getYourBondContribution(s, you); // total lp tokens contributed by you
    info.claimable = _getYourBondClaimable(s, you); // your total claimable NPM tokens at the end of the vesting period or "unlock date"
    info.unlockDate = _getYourBondUnlockDate(s, you); // your vesting period end or "unlock date"
  }
```
</details>

### _getLpTokenAddress

Gets the NPM/Stablecoin Uniswap v2 LP token address

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

Gets your unsettled bond contribution amount.

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

Gets your claimable discounted NPM bond amount.

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

Returns the date when your discounted NPM token bond is unlocked
 for claim.

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

Returns the NPM token bond discount rate

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

Returns the bond vesting term

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

Returns the maximum NPM token units that can be bonded at a time

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

Returns the total NPM tokens allocated for the bond

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

Returns the total bonded NPM tokens distributed till date.

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

Create a new NPM/DAI LP token bond

```solidity
function createBondInternal(IStore s, uint256 lpTokens, uint256 minNpmDesired) external nonpayable
returns(npmToVest uint256, unlockDate uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 
| lpTokens | uint256 | Enter the total units of NPM/DAI Uniswap v2 tokens to be bonded | 
| minNpmDesired | uint256 | Enter the minimum NPM tokens you desire for the given LP tokens.  This transaction will revert if the final NPM bond is less than your specified value. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function createBondInternal(
    IStore s,
    uint256 lpTokens,
    uint256 minNpmDesired
  ) external returns (uint256 npmToVest, uint256 unlockDate) {
    s.mustNotBePaused();

    npmToVest = calculateTokensForLpInternal(s, lpTokens);

    require(npmToVest <= _getMaxBondInUnit(s), "Bond too big");
    require(npmToVest >= minNpmDesired, "Min bond `minNpmDesired` failed");
    require(_getNpmBalance(s) >= npmToVest + _getBondCommitment(s), "NPM balance insufficient to bond");

    // Pull the tokens from the requester's account
    IERC20(s.getAddressByKey(BondPoolLibV1.NS_BOND_LP_TOKEN)).ensureTransferFrom(msg.sender, s.getAddressByKey(BondPoolLibV1.NS_LQ_TREASURY), lpTokens);

    // Commitment: Total NPM to reserve for bond claims
    s.addUintByKey(BondPoolLibV1.NS_BOND_TO_CLAIM, npmToVest);

    // Your bond to claim later
    bytes32 k = keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_TO_CLAIM, msg.sender));
    s.addUintByKey(k, npmToVest);

    // Amount contributed
    k = keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_CONTRIBUTION, msg.sender));
    s.addUintByKey(k, lpTokens);

    // unlock date
    unlockDate = block.timestamp + _getVestingTerm(s); // solhint-disable-line

    // Unlock date
    k = keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_UNLOCK_DATE, msg.sender));
    s.setUintByKey(k, unlockDate);
  }
```
</details>

### _getNpmBalance

Gets the NPM token balance of this contract.
 Please also see `_getBondCommitment` to check
 the total NPM tokens already allocated to the bonders
 to be claimed later.

```solidity
function _getNpmBalance(IStore s) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Specify store instance | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getNpmBalance(IStore s) private view returns (uint256) {
    return IERC20(s.npmToken()).balanceOf(address(this));
  }
```
</details>

### _getBondCommitment

Returns the bond commitment amount.

```solidity
function _getBondCommitment(IStore s) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getBondCommitment(IStore s) private view returns (uint256) {
    return s.getUintByKey(BondPoolLibV1.NS_BOND_TO_CLAIM);
  }
```
</details>

### claimBondInternal

Enables the caller to claim their bond after the lockup period.

```solidity
function claimBondInternal(IStore s) external nonpayable
returns(npmToTransfer uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function claimBondInternal(IStore s) external returns (uint256 npmToTransfer) {
    s.mustNotBePaused();

    npmToTransfer = _getYourBondClaimable(s, msg.sender); // npmToTransfer

    // Commitment: Reduce NPM reserved for claims
    s.subtractUintByKey(BondPoolLibV1.NS_BOND_TO_CLAIM, npmToTransfer);

    // Clear the claim amount
    s.deleteUintByKey(keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_TO_CLAIM, msg.sender)));

    uint256 unlocksOn = _getYourBondUnlockDate(s, msg.sender);

    // Clear the unlock date
    s.deleteUintByKey(keccak256(abi.encodePacked(BondPoolLibV1.NS_BOND_UNLOCK_DATE, msg.sender)));

    require(block.timestamp >= unlocksOn, "Still vesting"); // solhint-disable-line
    require(npmToTransfer > 0, "Nothing to claim");

    s.addUintByKey(BondPoolLibV1.NS_BOND_TOTAL_NPM_DISTRIBUTED, npmToTransfer);
    IERC20(s.npmToken()).ensureTransfer(msg.sender, npmToTransfer);
  }
```
</details>

### setupBondPoolInternal

Sets up the bond pool

```solidity
function setupBondPoolInternal(IStore s, struct IBondPool.SetupBondPoolArgs args) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| args | struct IBondPool.SetupBondPoolArgs |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setupBondPoolInternal(IStore s, IBondPool.SetupBondPoolArgs calldata args) external {
    if (args.lpToken != address(0)) {
      s.setAddressByKey(BondPoolLibV1.NS_BOND_LP_TOKEN, args.lpToken);
    }

    if (args.treasury != address(0)) {
      s.setAddressByKey(BondPoolLibV1.NS_LQ_TREASURY, args.treasury);
    }

    if (args.bondDiscountRate > 0) {
      s.setUintByKey(BondPoolLibV1.NS_BOND_DISCOUNT_RATE, args.bondDiscountRate);
    }

    if (args.maxBondAmount > 0) {
      s.setUintByKey(BondPoolLibV1.NS_BOND_MAX_UNIT, args.maxBondAmount);
    }

    if (args.vestingTerm > 0) {
      s.setUintByKey(BondPoolLibV1.NS_BOND_VESTING_TERM, args.vestingTerm);
    }

    if (args.npmToTopUpNow > 0) {
      IERC20(s.npmToken()).ensureTransferFrom(msg.sender, address(this), args.npmToTopUpNow);
      s.addUintByKey(BondPoolLibV1.NS_BOND_TOTAL_NPM_ALLOCATED, args.npmToTopUpNow);
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
