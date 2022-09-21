# VaultLibV1.sol

View Source: [\contracts\libraries\VaultLibV1.sol](..\contracts\libraries\VaultLibV1.sol)

**VaultLibV1**

## Contract Members
**Constants & Variables**

```js
uint256 public constant WITHDRAWAL_HEIGHT_OFFSET;

```

## Functions

- [calculatePodsInternal(IStore s, bytes32 coverKey, address pod, uint256 liquidityToAdd)](#calculatepodsinternal)
- [calculateLiquidityInternal(IStore s, bytes32 coverKey, address pod, uint256 podsToBurn)](#calculateliquidityinternal)
- [getInfoInternal(IStore s, bytes32 coverKey, address pod, address you)](#getinfointernal)
- [preAddLiquidityInternal(IStore s, bytes32 coverKey, address pod, address account, uint256 amount, uint256 npmStakeToAdd)](#preaddliquidityinternal)
- [_updateLastBlock(IStore s, bytes32 coverKey)](#_updatelastblock)
- [_updateNpmStake(IStore s, bytes32 coverKey, address account, uint256 amount)](#_updatenpmstake)
- [_getMyNpmStake(IStore s, bytes32 coverKey, address account)](#_getmynpmstake)
- [getCoverNpmStake(IStore s, bytes32 coverKey, address account)](#getcovernpmstake)
- [mustHaveNoBalanceInStrategies(IStore s, bytes32 coverKey, address stablecoin)](#musthavenobalanceinstrategies)
- [mustMaintainBlockHeightOffset(IStore s, bytes32 coverKey)](#mustmaintainblockheightoffset)
- [preRemoveLiquidityInternal(IStore s, bytes32 coverKey, address pod, address account, uint256 podsToRedeem, uint256 npmStakeToRemove, bool exit)](#preremoveliquidityinternal)
- [_unStakeNpm(IStore s, address account, bytes32 coverKey, uint256 amount, bool exit)](#_unstakenpm)
- [_redeemPodCalculation(IStore s, bytes32 coverKey, address pod, uint256 podsToRedeem)](#_redeempodcalculation)
- [accrueInterestInternal(IStore s, bytes32 coverKey)](#accrueinterestinternal)
- [mustBeAccrued(IStore s, bytes32 coverKey)](#mustbeaccrued)
- [getFlashFeesInternal(IStore s, bytes32 coverKey, address token, uint256 amount)](#getflashfeesinternal)
- [getFlashFeeInternal(IStore s, bytes32 coverKey, address token, uint256 amount)](#getflashfeeinternal)
- [_getFlashLoanFeeRateInternal(IStore s)](#_getflashloanfeerateinternal)
- [_getProtocolFlashLoanFeeRateInternal(IStore s)](#_getprotocolflashloanfeerateinternal)
- [getMaxFlashLoanInternal(IStore s, bytes32 coverKey, address token)](#getmaxflashloaninternal)

### calculatePodsInternal

Calculates the amount of PODS to mint for the given amount of liquidity to transfer

```solidity
function calculatePodsInternal(IStore s, bytes32 coverKey, address pod, uint256 liquidityToAdd) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| pod | address |  | 
| liquidityToAdd | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculatePodsInternal(

    IStore s,

    bytes32 coverKey,

    address pod,

    uint256 liquidityToAdd

  ) public view returns (uint256) {

    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER_HAS_FLASH_LOAN, coverKey) == false, "On flash loan, please try again");

    uint256 balance = s.getStablecoinOwnedByVaultInternal(coverKey);

    uint256 podSupply = IERC20(pod).totalSupply();

    uint256 stablecoinPrecision = s.getStablecoinPrecision();

    // This smart contract contains stablecoins without liquidity provider contribution.

    // This can happen if someone wants to create a nuisance by sending stablecoin

    // to this contract immediately after deployment.

    if (podSupply == 0 && balance > 0) {

      revert("Liquidity/POD mismatch");

    }

    if (balance > 0) {

      return (podSupply * liquidityToAdd) / balance;

    }

    return (liquidityToAdd * ProtoUtilV1.POD_PRECISION) / stablecoinPrecision;

  }
```
</details>

### calculateLiquidityInternal

Calculates the amount of liquidity to transfer for the given amount of PODs to burn.
 The Vault contract lends out liquidity to external protocols to maximize reward
 regularly. But it also withdraws periodically to receive back the loaned amount
 with interest. In other words, the Vault contract continuously supplies
 available liquidity to lending protocols and withdraws during a fixed interval.
 For example, supply during `180-day lending period` and allow withdrawals
 during `7-day withdrawal period`.

```solidity
function calculateLiquidityInternal(IStore s, bytes32 coverKey, address pod, uint256 podsToBurn) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| pod | address |  | 
| podsToBurn | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculateLiquidityInternal(

    IStore s,

    bytes32 coverKey,

    address pod,

    uint256 podsToBurn

  ) public view returns (uint256) {

    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER_HAS_FLASH_LOAN, coverKey) == false, "On flash loan, please try again");

    uint256 balance = s.getStablecoinOwnedByVaultInternal(coverKey);

    uint256 podSupply = IERC20(pod).totalSupply();

    return (balance * podsToBurn) / podSupply;

  }
```
</details>

### getInfoInternal

Gets information of a given vault by the cover key

```solidity
function getInfoInternal(IStore s, bytes32 coverKey, address pod, address you) external view
returns(info struct IVault.VaultInfoType)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Provide a store instance | 
| coverKey | bytes32 | Specify cover key to obtain the info of. | 
| pod | address | Provide the address of the POD | 
| you | address | The address for which the info will be customized | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getInfoInternal(

    IStore s,

    bytes32 coverKey,

    address pod,

    address you

  ) external view returns (IVault.VaultInfoType memory info) {

    info.totalPods = IERC20(pod).totalSupply(); // Total PODs in existence

    info.balance = s.getStablecoinOwnedByVaultInternal(coverKey); // Stablecoins held in the vault

    info.extendedBalance = s.getAmountInStrategies(coverKey, s.getStablecoin()); //  Stablecoins lent outside of the protocol

    info.totalReassurance = s.getReassuranceAmountInternal(coverKey); // Total reassurance for this cover

    info.myPodBalance = IERC20(pod).balanceOf(you); // Your POD Balance

    info.myShare = calculateLiquidityInternal(s, coverKey, pod, info.myPodBalance); //  My share of the liquidity pool (in stablecoin)

    info.withdrawalOpen = s.getUintByKey(RoutineInvokerLibV1.getNextWithdrawalStartKey(coverKey)); // The timestamp when withdrawals are opened

    info.withdrawalClose = s.getUintByKey(RoutineInvokerLibV1.getNextWithdrawalEndKey(coverKey)); // The timestamp when withdrawals are closed again

  }
```
</details>

### preAddLiquidityInternal

Called before adding liquidity to the specified cover contract

```solidity
function preAddLiquidityInternal(IStore s, bytes32 coverKey, address pod, address account, uint256 amount, uint256 npmStakeToAdd) external nonpayable
returns(podsToMint uint256, myPreviousStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 | Enter the cover key | 
| pod | address |  | 
| account | address | Specify the account on behalf of which the liquidity is being added. | 
| amount | uint256 | Enter the amount of liquidity token to supply. | 
| npmStakeToAdd | uint256 | Enter the amount of NPM token to stake. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function preAddLiquidityInternal(

    IStore s,

    bytes32 coverKey,

    address pod,

    address account,

    uint256 amount,

    uint256 npmStakeToAdd

  ) external returns (uint256 podsToMint, uint256 myPreviousStake) {

    require(account != address(0), "Invalid account");

    // Update values

    myPreviousStake = _updateNpmStake(s, coverKey, account, npmStakeToAdd);

    podsToMint = calculatePodsInternal(s, coverKey, pod, amount);

    _updateLastBlock(s, coverKey);

  }
```
</details>

### _updateLastBlock

```solidity
function _updateLastBlock(IStore s, bytes32 coverKey) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _updateLastBlock(IStore s, bytes32 coverKey) private {

    s.setUintByKey(CoverUtilV1.getLastDepositHeightKey(coverKey), block.number);

  }
```
</details>

### _updateNpmStake

```solidity
function _updateNpmStake(IStore s, bytes32 coverKey, address account, uint256 amount) private nonpayable
returns(myPreviousStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| account | address |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _updateNpmStake(

    IStore s,

    bytes32 coverKey,

    address account,

    uint256 amount

  ) private returns (uint256 myPreviousStake) {

    myPreviousStake = _getMyNpmStake(s, coverKey, account);

    require(amount + myPreviousStake >= s.getMinStakeToAddLiquidity(), "Insufficient stake");

    if (amount > 0) {

      s.addUintByKey(CoverUtilV1.getCoverLiquidityStakeKey(coverKey), amount); // Total stake

      s.addUintByKey(CoverUtilV1.getCoverLiquidityStakeIndividualKey(coverKey, account), amount); // Your stake

    }

  }
```
</details>

### _getMyNpmStake

```solidity
function _getMyNpmStake(IStore s, bytes32 coverKey, address account) private view
returns(myStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getMyNpmStake(

    IStore s,

    bytes32 coverKey,

    address account

  ) private view returns (uint256 myStake) {

    (, myStake) = getCoverNpmStake(s, coverKey, account);

  }
```
</details>

### getCoverNpmStake

```solidity
function getCoverNpmStake(IStore s, bytes32 coverKey, address account) public view
returns(totalStake uint256, myStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverNpmStake(

    IStore s,

    bytes32 coverKey,

    address account

  ) public view returns (uint256 totalStake, uint256 myStake) {

    totalStake = s.getUintByKey(CoverUtilV1.getCoverLiquidityStakeKey(coverKey));

    myStake = s.getUintByKey(CoverUtilV1.getCoverLiquidityStakeIndividualKey(coverKey, account));

  }
```
</details>

### mustHaveNoBalanceInStrategies

```solidity
function mustHaveNoBalanceInStrategies(IStore s, bytes32 coverKey, address stablecoin) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| stablecoin | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustHaveNoBalanceInStrategies(

    IStore s,

    bytes32 coverKey,

    address stablecoin

  ) external view {

    require(s.getAmountInStrategies(coverKey, stablecoin) == 0, "Strategy balance is not zero");

  }
```
</details>

### mustMaintainBlockHeightOffset

```solidity
function mustMaintainBlockHeightOffset(IStore s, bytes32 coverKey) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustMaintainBlockHeightOffset(IStore s, bytes32 coverKey) external view {

    uint256 lastDeposit = s.getUintByKey(CoverUtilV1.getLastDepositHeightKey(coverKey));

    require(block.number > lastDeposit + WITHDRAWAL_HEIGHT_OFFSET, "Please wait a few blocks");

  }
```
</details>

### preRemoveLiquidityInternal

Removes liquidity from the specified cover contract

```solidity
function preRemoveLiquidityInternal(IStore s, bytes32 coverKey, address pod, address account, uint256 podsToRedeem, uint256 npmStakeToRemove, bool exit) external nonpayable
returns(stablecoin address, releaseAmount uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 | Enter the cover key | 
| pod | address | sToRedeem Enter the amount of liquidity token to remove. | 
| account | address |  | 
| podsToRedeem | uint256 | Enter the amount of liquidity token to remove. | 
| npmStakeToRemove | uint256 |  | 
| exit | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function preRemoveLiquidityInternal(

    IStore s,

    bytes32 coverKey,

    address pod,

    address account,

    uint256 podsToRedeem,

    uint256 npmStakeToRemove,

    bool exit

  ) external returns (address stablecoin, uint256 releaseAmount) {

    stablecoin = s.getStablecoin();

    // Redeem the PODs and receive DAI

    releaseAmount = _redeemPodCalculation(s, coverKey, pod, podsToRedeem);

    ValidationLibV1.mustNotExceedStablecoinThreshold(s, releaseAmount);

    GovernanceUtilV1.mustNotExceedNpmThreshold(npmStakeToRemove);

    // Unstake NPM tokens

    if (npmStakeToRemove > 0) {

      _unStakeNpm(s, account, coverKey, npmStakeToRemove, exit);

    }

  }
```
</details>

### _unStakeNpm

```solidity
function _unStakeNpm(IStore s, address account, bytes32 coverKey, uint256 amount, bool exit) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| account | address |  | 
| coverKey | bytes32 |  | 
| amount | uint256 |  | 
| exit | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _unStakeNpm(

    IStore s,

    address account,

    bytes32 coverKey,

    uint256 amount,

    bool exit

  ) private {

    uint256 remainingStake = _getMyNpmStake(s, coverKey, account);

    uint256 minStakeToMaintain = s.getMinStakeToAddLiquidity();

    if (exit) {

      require(remainingStake == amount, "Invalid NPM stake to exit");

    } else {

      require(remainingStake - amount >= minStakeToMaintain, "Can't go below min stake");

    }

    s.subtractUintByKey(CoverUtilV1.getCoverLiquidityStakeKey(coverKey), amount); // Total stake

    s.subtractUintByKey(CoverUtilV1.getCoverLiquidityStakeIndividualKey(coverKey, account), amount); // Your stake

  }
```
</details>

### _redeemPodCalculation

```solidity
function _redeemPodCalculation(IStore s, bytes32 coverKey, address pod, uint256 podsToRedeem) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| pod | address |  | 
| podsToRedeem | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _redeemPodCalculation(

    IStore s,

    bytes32 coverKey,

    address pod,

    uint256 podsToRedeem

  ) private view returns (uint256) {

    if (podsToRedeem == 0) {

      return 0;

    }

    s.mustBeProtocolMember(pod);

    uint256 precision = s.getStablecoinPrecision();

    uint256 balance = s.getStablecoinOwnedByVaultInternal(coverKey);

    uint256 commitment = s.getTotalLiquidityUnderProtection(coverKey, precision);

    uint256 available = balance - commitment;

    uint256 releaseAmount = calculateLiquidityInternal(s, coverKey, pod, podsToRedeem);

    // You may need to wait till active policies expire

    require(available >= releaseAmount, "Insufficient balance. Lower the amount or wait till policy expiry."); // solhint-disable-line

    return releaseAmount;

  }
```
</details>

### accrueInterestInternal

```solidity
function accrueInterestInternal(IStore s, bytes32 coverKey) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function accrueInterestInternal(IStore s, bytes32 coverKey) external {

    (bool isWithdrawalPeriod, , , , ) = s.getWithdrawalInfoInternal(coverKey);

    require(isWithdrawalPeriod == true, "Withdrawal hasn't yet begun");

    s.updateStateAndLiquidity(coverKey);

    s.setAccrualCompleteInternal(coverKey, true);

  }
```
</details>

### mustBeAccrued

```solidity
function mustBeAccrued(IStore s, bytes32 coverKey) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mustBeAccrued(IStore s, bytes32 coverKey) external view {

    require(s.isAccrualCompleteInternal(coverKey) == true, "Wait for accrual");

  }
```
</details>

### getFlashFeesInternal

The fee to be charged for a given loan.

```solidity
function getFlashFeesInternal(IStore s, bytes32 coverKey, address token, uint256 amount) public view
returns(fee uint256, protocolFee uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Provide an instance of the store | 
| coverKey | bytes32 |  | 
| token | address | The loan currency. | 
| amount | uint256 | The amount of tokens lent. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getFlashFeesInternal(

    IStore s,

    bytes32 coverKey,

    address token,

    uint256 amount

  ) public view returns (uint256 fee, uint256 protocolFee) {

    address stablecoin = s.getStablecoin();

    require(stablecoin != address(0), "Cover liquidity uninitialized");

    /*

    https://eips.ethereum.org/EIPS/eip-3156

    The flashFee function MUST return the fee charged for a loan of amount token.

    If the token is not supported flashFee MUST revert.

    */

    require(stablecoin == token, "Unsupported token");

    require(IERC20(stablecoin).balanceOf(s.getVaultAddress(coverKey)) >= amount, "Amount insufficient");

    uint256 rate = _getFlashLoanFeeRateInternal(s);

    uint256 protocolRate = _getProtocolFlashLoanFeeRateInternal(s);

    fee = (amount * rate) / ProtoUtilV1.MULTIPLIER;

    protocolFee = (fee * protocolRate) / ProtoUtilV1.MULTIPLIER;

  }
```
</details>

### getFlashFeeInternal

```solidity
function getFlashFeeInternal(IStore s, bytes32 coverKey, address token, uint256 amount) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| token | address |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getFlashFeeInternal(

    IStore s,

    bytes32 coverKey,

    address token,

    uint256 amount

  ) external view returns (uint256) {

    (uint256 fee, ) = getFlashFeesInternal(s, coverKey, token, amount);

    return fee;

  }
```
</details>

### _getFlashLoanFeeRateInternal

```solidity
function _getFlashLoanFeeRateInternal(IStore s) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getFlashLoanFeeRateInternal(IStore s) private view returns (uint256) {

    return s.getUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_FLASH_LOAN_FEE);

  }
```
</details>

### _getProtocolFlashLoanFeeRateInternal

```solidity
function _getProtocolFlashLoanFeeRateInternal(IStore s) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getProtocolFlashLoanFeeRateInternal(IStore s) private view returns (uint256) {

    return s.getUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_FLASH_LOAN_FEE_PROTOCOL);

  }
```
</details>

### getMaxFlashLoanInternal

The amount of currency available to be lent.

```solidity
function getMaxFlashLoanInternal(IStore s, bytes32 coverKey, address token) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| token | address | The loan currency. | 

**Returns**

The amount of `token` that can be borrowed.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getMaxFlashLoanInternal(

    IStore s,

    bytes32 coverKey,

    address token

  ) external view returns (uint256) {

    address stablecoin = s.getStablecoin();

    require(stablecoin != address(0), "Cover liquidity uninitialized");

    if (stablecoin == token) {

      return IERC20(stablecoin).balanceOf(s.getVaultAddress(coverKey));

    }

    /*

    https://eips.ethereum.org/EIPS/eip-3156

    The maxFlashLoan function MUST return the maximum loan possible for token.

    If a token is not currently supported maxFlashLoan MUST return 0, instead of reverting.    

    */

    return 0;

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
