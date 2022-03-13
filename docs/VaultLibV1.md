# VaultLibV1.sol

View Source: [contracts/libraries/VaultLibV1.sol](../contracts/libraries/VaultLibV1.sol)

**VaultLibV1**

## Functions

- [calculatePodsInternal(IStore s, bytes32 coverKey, address pod, uint256 liquidityToAdd)](#calculatepodsinternal)
- [calculateLiquidityInternal(IStore s, bytes32 coverKey, address pod, address stablecoin, uint256 podsToBurn)](#calculateliquidityinternal)
- [getInfoInternal(IStore s, bytes32 coverKey, address pod, address stablecoin, address you)](#getinfointernal)
- [_getCoverLiquidityAddedInternal(IStore s, bytes32 coverKey, address you)](#_getcoverliquidityaddedinternal)
- [_getCoverLiquidityRemovedInternal(IStore s, bytes32 coverKey, address you)](#_getcoverliquidityremovedinternal)
- [getLendingTotal(IStore s, bytes32 coverKey)](#getlendingtotal)
- [addLiquidityInternal(IStore s, bytes32 coverKey, address pod, address stablecoin, address account, uint256 amount, uint256 npmStakeToAdd)](#addliquidityinternal)
- [_updateNpmStake(IStore s, bytes32 coverKey, address account, uint256 amount)](#_updatenpmstake)
- [_updateCoverLiquidity(IStore s, bytes32 coverKey, address account, uint256 amount)](#_updatecoverliquidity)
- [_getMyNpmStake(IStore s, bytes32 coverKey, address account)](#_getmynpmstake)
- [getCoverNpmStake(IStore s, bytes32 coverKey, address account)](#getcovernpmstake)
- [removeLiquidityInternal(IStore s, bytes32 coverKey, address pod, uint256 podsToRedeem, uint256 npmStakeToRemove, bool exit)](#removeliquidityinternal)
- [_unStakeNpm(IStore s, bytes32 coverKey, uint256 amount, bool exit)](#_unstakenpm)
- [_redeemPods(IStore s, bytes32 coverKey, address pod, uint256 podsToRedeem)](#_redeempods)
- [getFlashFeesInternal(IStore s, address token, uint256 amount)](#getflashfeesinternal)
- [getFlashFeeInternal(IStore s, address token, uint256 amount)](#getflashfeeinternal)
- [_getFlashLoanFeeRateInternal(IStore s)](#_getflashloanfeerateinternal)
- [_getProtocolFlashLoanFeeRateInternal(IStore s)](#_getprotocolflashloanfeerateinternal)
- [getMaxFlashLoanInternal(IStore s, address token)](#getmaxflashloaninternal)
- [getPodTokenNameInternal(bytes32 coverKey)](#getpodtokennameinternal)
- [transferToStrategyInternal(IStore s, IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount)](#transfertostrategyinternal)
- [_addToStrategyOut(IStore s, bytes32 coverKey, IERC20 token, uint256 amountToAdd)](#_addtostrategyout)
- [_clearStrategyOut(IStore s, bytes32 coverKey, IERC20 token)](#_clearstrategyout)
- [_addToSpecificStrategyOut(IStore s, bytes32 coverKey, bytes32 strategyName, IERC20 token, uint256 amountToAdd)](#_addtospecificstrategyout)
- [_clearSpecificStrategyOut(IStore s, bytes32 coverKey, bytes32 strategyName, IERC20 token)](#_clearspecificstrategyout)
- [_getStrategyOutKey(bytes32 coverKey, IERC20 token)](#_getstrategyoutkey)
- [_getSpecificStrategyOutKey(bytes32 coverKey, bytes32 strategyName, IERC20 token)](#_getspecificstrategyoutkey)
- [receiveFromStrategyInternal(IStore s, IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount)](#receivefromstrategyinternal)
- [getAmountInStrategies(IStore s, bytes32 coverKey, IERC20 token)](#getamountinstrategies)
- [getAmountInStrategy(IStore s, bytes32 coverKey, bytes32 strategyName, IERC20 token)](#getamountinstrategy)
- [getStablecoinBalanceOfInternal(IStore s, bytes32 coverKey)](#getstablecoinbalanceofinternal)
- [flashLoanInternal(IStore s, IERC3156FlashBorrower receiver, bytes32 key, address token, uint256 amount, bytes data)](#flashloaninternal)

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
    uint256 balance = getStablecoinBalanceOfInternal(s, coverKey);
    uint256 podSupply = IERC20(pod).totalSupply();

    // This smart contract contains stablecoins without liquidity provider contribution
    if (podSupply == 0 && balance > 0) {
      revert("Liquidity/POD mismatch");
    }

    if (balance > 0) {
      return (IERC20(pod).totalSupply() * liquidityToAdd) / balance;
    }

    return liquidityToAdd;
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
function calculateLiquidityInternal(IStore s, bytes32 coverKey, address pod, address stablecoin, uint256 podsToBurn) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| pod | address |  | 
| stablecoin | address |  | 
| podsToBurn | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculateLiquidityInternal(
    IStore s,
    bytes32 coverKey,
    address pod,
    address stablecoin,
    uint256 podsToBurn
  ) public view returns (uint256) {
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER_HAS_FLASH_LOAN, coverKey) == false, "On flash loan, please try again");

    uint256 contractStablecoinBalance = IERC20(stablecoin).balanceOf(address(this));
    return (contractStablecoinBalance * podsToBurn) / IERC20(pod).totalSupply();
  }
```
</details>

### getInfoInternal

Gets information of a given vault by the cover key

```solidity
function getInfoInternal(IStore s, bytes32 coverKey, address pod, address stablecoin, address you) external view
returns(values uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Provide a store instance | 
| coverKey | bytes32 | Specify cover key to obtain the info of. | 
| pod | address | Provide the address of the POD | 
| stablecoin | address | Provide the address of the Vault stablecoin | 
| you | address | The address for which the info will be customized | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getInfoInternal(
    IStore s,
    bytes32 coverKey,
    address pod,
    address stablecoin,
    address you
  ) external view returns (uint256[] memory values) {
    values = new uint256[](11);

    values[0] = IERC20(pod).totalSupply(); // Total PODs in existence
    values[1] = getStablecoinBalanceOfInternal(s, coverKey);
    values[2] = getLendingTotal(s, coverKey); //  Stablecoins lent outside of the protocol
    values[3] = s.getReassuranceAmountInternal(coverKey); // Total reassurance for this cover
    values[4] = IERC20(pod).balanceOf(you); // Your POD Balance
    values[5] = _getCoverLiquidityAddedInternal(s, coverKey, you); // Sum of your deposits (in stablecoin)
    values[6] = _getCoverLiquidityRemovedInternal(s, coverKey, you); // Sum of your withdrawals  (in stablecoin)
    values[7] = calculateLiquidityInternal(s, coverKey, pod, stablecoin, values[5]); //  My share of the liquidity pool (in stablecoin)
    values[8] = s.getUintByKey(RoutineInvokerLibV1.getNextWithdrawalStartKey(coverKey));
    values[9] = s.getUintByKey(RoutineInvokerLibV1.getNextWithdrawalEndKey(coverKey));
  }
```
</details>

### _getCoverLiquidityAddedInternal

```solidity
function _getCoverLiquidityAddedInternal(IStore s, bytes32 coverKey, address you) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| you | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getCoverLiquidityAddedInternal(
    IStore s,
    bytes32 coverKey,
    address you
  ) private view returns (uint256) {
    return s.getUintByKey(CoverUtilV1.getCoverLiquidityAddedKey(coverKey, you));
  }
```
</details>

### _getCoverLiquidityRemovedInternal

```solidity
function _getCoverLiquidityRemovedInternal(IStore s, bytes32 coverKey, address you) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| you | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getCoverLiquidityRemovedInternal(
    IStore s,
    bytes32 coverKey,
    address you
  ) private view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_REMOVED, coverKey, you);
  }
```
</details>

### getLendingTotal

```solidity
function getLendingTotal(IStore s, bytes32 coverKey) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLendingTotal(IStore s, bytes32 coverKey) public view returns (uint256) {
    return s.getUintByKey(CoverUtilV1.getCoverTotalLentKey(coverKey));
  }
```
</details>

### addLiquidityInternal

Adds liquidity to the specified cover contract

```solidity
function addLiquidityInternal(IStore s, bytes32 coverKey, address pod, address stablecoin, address account, uint256 amount, uint256 npmStakeToAdd) external nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 | Enter the cover key | 
| pod | address |  | 
| stablecoin | address |  | 
| account | address | Specify the account on behalf of which the liquidity is being added. | 
| amount | uint256 | Enter the amount of liquidity token to supply. | 
| npmStakeToAdd | uint256 | Enter the amount of NPM token to stake. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addLiquidityInternal(
    IStore s,
    bytes32 coverKey,
    address pod,
    address stablecoin,
    address account,
    uint256 amount,
    uint256 npmStakeToAdd
  ) external returns (uint256) {
    // @suppress-address-trust-issue, @suppress-malicious-erc20 The address `stablecoin` can be trusted here because we are ensuring it matches with the protocol stablecoin address.
    // @suppress-address-trust-issue The address `account` can be trusted here because we are not treating it as a contract (even it were).
    require(account != address(0), "Invalid account");
    require(stablecoin == s.getStablecoin(), "Vault migration required");

    // Update values
    _updateNpmStake(s, coverKey, account, npmStakeToAdd);
    _updateCoverLiquidity(s, coverKey, account, amount);

    uint256 podsToMint = calculatePodsInternal(s, coverKey, pod, amount);

    IERC20(stablecoin).ensureTransferFrom(account, address(this), amount);
    IERC20(s.getNpmTokenAddress()).ensureTransferFrom(account, address(this), npmStakeToAdd);

    return podsToMint;
  }
```
</details>

### _updateNpmStake

```solidity
function _updateNpmStake(IStore s, bytes32 coverKey, address account, uint256 amount) private nonpayable
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
  ) private {
    uint256 myPreviousStake = _getMyNpmStake(s, coverKey, account);
    require(amount + myPreviousStake >= s.getMinStakeToAddLiquidity(), "Insufficient stake");

    if (amount > 0) {
      s.addUintByKey(CoverUtilV1.getCoverLiquidityStakeKey(coverKey), amount); // Total stake
      s.addUintByKey(CoverUtilV1.getCoverLiquidityStakeIndividualKey(coverKey, account), amount); // Your stake
    }
  }
```
</details>

### _updateCoverLiquidity

```solidity
function _updateCoverLiquidity(IStore s, bytes32 coverKey, address account, uint256 amount) private nonpayable
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
function _updateCoverLiquidity(
    IStore s,
    bytes32 coverKey,
    address account,
    uint256 amount
  ) private {
    s.addUintByKey(CoverUtilV1.getCoverLiquidityKey(coverKey), amount); // Total liquidity
    s.addUintByKey(CoverUtilV1.getCoverLiquidityAddedKey(coverKey, account), amount); // Your liquidity
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

### removeLiquidityInternal

Removes liquidity from the specified cover contract

```solidity
function removeLiquidityInternal(IStore s, bytes32 coverKey, address pod, uint256 podsToRedeem, uint256 npmStakeToRemove, bool exit) external nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 | Enter the cover key | 
| pod | address | sToRedeem Enter the amount of liquidity token to remove. | 
| podsToRedeem | uint256 | Enter the amount of liquidity token to remove. | 
| npmStakeToRemove | uint256 |  | 
| exit | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeLiquidityInternal(
    IStore s,
    bytes32 coverKey,
    address pod,
    uint256 podsToRedeem,
    uint256 npmStakeToRemove,
    bool exit
  ) external returns (uint256) {
    // @suppress-address-trust-issue, @suppress-malicious-erc20 The address `pod` although can only
    // come from VaultBase, we still need to ensure if it is a protocol member.
    // Check `_redeemPods` for more info.
    s.mustHaveNormalCoverStatus(coverKey);
    s.mustBeDuringWithdrawalPeriod(coverKey);

    // Redeem the PODs and receive DAI
    uint256 releaseAmount = _redeemPods(s, coverKey, pod, podsToRedeem);

    // Unstake NPM tokens
    if (npmStakeToRemove > 0) {
      _unStakeNpm(s, coverKey, npmStakeToRemove, exit);
      IERC20(s.getNpmTokenAddress()).ensureTransfer(msg.sender, npmStakeToRemove);
    }

    s.updateStateAndLiquidity(coverKey);
    return releaseAmount;
  }
```
</details>

### _unStakeNpm

```solidity
function _unStakeNpm(IStore s, bytes32 coverKey, uint256 amount, bool exit) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| amount | uint256 |  | 
| exit | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _unStakeNpm(
    IStore s,
    bytes32 coverKey,
    uint256 amount,
    bool exit
  ) private {
    uint256 remainingStake = _getMyNpmStake(s, coverKey, msg.sender);
    uint256 minStakeToMaintain = exit ? 0 : s.getMinStakeToAddLiquidity();

    require(remainingStake - amount >= minStakeToMaintain, "Can't go below min stake");

    s.subtractUintByKey(CoverUtilV1.getCoverLiquidityStakeKey(coverKey), amount); // Total stake
    s.subtractUintByKey(CoverUtilV1.getCoverLiquidityStakeIndividualKey(coverKey, msg.sender), amount); // Your stake
  }
```
</details>

### _redeemPods

```solidity
function _redeemPods(IStore s, bytes32 coverKey, address pod, uint256 podsToRedeem) private nonpayable
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
function _redeemPods(
    IStore s,
    bytes32 coverKey,
    address pod,
    uint256 podsToRedeem
  ) private returns (uint256) {
    if (podsToRedeem == 0) {
      return 0;
    }

    s.mustBeProtocolMember(pod);
    address stablecoin = s.getStablecoin();

    uint256 available = s.getStablecoinBalanceOfCoverPoolInternal(coverKey);
    uint256 releaseAmount = calculateLiquidityInternal(s, coverKey, pod, stablecoin, podsToRedeem);

    // You may need to wait till active policies expire
    require(available >= releaseAmount, "Insufficient balance, wait till policy expiry."); // solhint-disable-line

    // Update values
    s.subtractUintByKey(CoverUtilV1.getCoverLiquidityKey(coverKey), releaseAmount);
    s.addUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_REMOVED, coverKey, msg.sender, releaseAmount);

    IERC20(pod).ensureTransferFrom(msg.sender, address(this), podsToRedeem);
    IERC20(stablecoin).ensureTransfer(msg.sender, releaseAmount);

    return releaseAmount;
  }
```
</details>

### getFlashFeesInternal

The fee to be charged for a given loan.

```solidity
function getFlashFeesInternal(IStore s, address token, uint256 amount) public view
returns(fee uint256, protocolFee uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Provide an instance of the store | 
| token | address | The loan currency. | 
| amount | uint256 | The amount of tokens lent. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getFlashFeesInternal(
    IStore s,
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

    uint256 rate = _getFlashLoanFeeRateInternal(s);
    uint256 protocolRate = _getProtocolFlashLoanFeeRateInternal(s);

    fee = (amount * rate) / ProtoUtilV1.MULTIPLIER;
    protocolFee = (fee * protocolRate) / ProtoUtilV1.MULTIPLIER;
  }
```
</details>

### getFlashFeeInternal

```solidity
function getFlashFeeInternal(IStore s, address token, uint256 amount) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| token | address |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getFlashFeeInternal(
    IStore s,
    address token,
    uint256 amount
  ) external view returns (uint256) {
    (uint256 fee, ) = getFlashFeesInternal(s, token, amount);
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
function getMaxFlashLoanInternal(IStore s, address token) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| token | address | The loan currency. | 

**Returns**

The amount of `token` that can be borrowed.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getMaxFlashLoanInternal(IStore s, address token) external view returns (uint256) {
    address stablecoin = s.getStablecoin();
    require(stablecoin != address(0), "Cover liquidity uninitialized");

    if (stablecoin == token) {
      return IERC20(stablecoin).balanceOf(address(this));
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

### getPodTokenNameInternal

```solidity
function getPodTokenNameInternal(bytes32 coverKey) external pure
returns(string)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getPodTokenNameInternal(bytes32 coverKey) external pure returns (string memory) {
    return string(abi.encodePacked(string(abi.encodePacked(coverKey)), "-pod"));
  }
```
</details>

### transferToStrategyInternal

```solidity
function transferToStrategyInternal(IStore s, IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| token | IERC20 |  | 
| coverKey | bytes32 |  | 
| strategyName | bytes32 |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function transferToStrategyInternal(
    IStore s,
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external {
    // @suppress-malicious-erc20 @note: token should be checked on the calling contract
    token.ensureTransfer(msg.sender, amount);

    _addToStrategyOut(s, coverKey, token, amount);
    _addToSpecificStrategyOut(s, coverKey, strategyName, token, amount);
  }
```
</details>

### _addToStrategyOut

```solidity
function _addToStrategyOut(IStore s, bytes32 coverKey, IERC20 token, uint256 amountToAdd) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| token | IERC20 |  | 
| amountToAdd | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _addToStrategyOut(
    IStore s,
    bytes32 coverKey,
    IERC20 token,
    uint256 amountToAdd
  ) private {
    bytes32 k = _getStrategyOutKey(coverKey, token);
    s.addUintByKey(k, amountToAdd);
  }
```
</details>

### _clearStrategyOut

```solidity
function _clearStrategyOut(IStore s, bytes32 coverKey, IERC20 token) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| token | IERC20 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _clearStrategyOut(
    IStore s,
    bytes32 coverKey,
    IERC20 token
  ) private {
    bytes32 k = _getStrategyOutKey(coverKey, token);
    s.deleteUintByKey(k);
  }
```
</details>

### _addToSpecificStrategyOut

```solidity
function _addToSpecificStrategyOut(IStore s, bytes32 coverKey, bytes32 strategyName, IERC20 token, uint256 amountToAdd) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| strategyName | bytes32 |  | 
| token | IERC20 |  | 
| amountToAdd | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _addToSpecificStrategyOut(
    IStore s,
    bytes32 coverKey,
    bytes32 strategyName,
    IERC20 token,
    uint256 amountToAdd
  ) private {
    bytes32 k = _getSpecificStrategyOutKey(coverKey, strategyName, token);
    s.addUintByKey(k, amountToAdd);
  }
```
</details>

### _clearSpecificStrategyOut

```solidity
function _clearSpecificStrategyOut(IStore s, bytes32 coverKey, bytes32 strategyName, IERC20 token) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| strategyName | bytes32 |  | 
| token | IERC20 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _clearSpecificStrategyOut(
    IStore s,
    bytes32 coverKey,
    bytes32 strategyName,
    IERC20 token
  ) private {
    bytes32 k = _getSpecificStrategyOutKey(coverKey, strategyName, token);
    s.deleteUintByKey(k);
  }
```
</details>

### _getStrategyOutKey

```solidity
function _getStrategyOutKey(bytes32 coverKey, IERC20 token) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| token | IERC20 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getStrategyOutKey(bytes32 coverKey, IERC20 token) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_VAULT_STRATEGY_OUT, coverKey, token));
  }
```
</details>

### _getSpecificStrategyOutKey

```solidity
function _getSpecificStrategyOutKey(bytes32 coverKey, bytes32 strategyName, IERC20 token) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 |  | 
| strategyName | bytes32 |  | 
| token | IERC20 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _getSpecificStrategyOutKey(
    bytes32 coverKey,
    bytes32 strategyName,
    IERC20 token
  ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_VAULT_STRATEGY_OUT, coverKey, strategyName, token));
  }
```
</details>

### receiveFromStrategyInternal

```solidity
function receiveFromStrategyInternal(IStore s, IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| token | IERC20 |  | 
| coverKey | bytes32 |  | 
| strategyName | bytes32 |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function receiveFromStrategyInternal(
    IStore s,
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external {
    // @suppress-malicious-erc20 token should be checked on the calling contract
    token.ensureTransferFrom(msg.sender, address(this), amount);

    _clearStrategyOut(s, coverKey, token);
    _clearSpecificStrategyOut(s, coverKey, strategyName, token);
  }
```
</details>

### getAmountInStrategies

```solidity
function getAmountInStrategies(IStore s, bytes32 coverKey, IERC20 token) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| token | IERC20 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAmountInStrategies(
    IStore s,
    bytes32 coverKey,
    IERC20 token
  ) public view returns (uint256) {
    bytes32 k = _getStrategyOutKey(coverKey, token);
    return s.getUintByKey(k);
  }
```
</details>

### getAmountInStrategy

```solidity
function getAmountInStrategy(IStore s, bytes32 coverKey, bytes32 strategyName, IERC20 token) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| strategyName | bytes32 |  | 
| token | IERC20 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAmountInStrategy(
    IStore s,
    bytes32 coverKey,
    bytes32 strategyName,
    IERC20 token
  ) external view returns (uint256) {
    bytes32 k = _getSpecificStrategyOutKey(coverKey, strategyName, token);
    return s.getUintByKey(k);
  }
```
</details>

### getStablecoinBalanceOfInternal

```solidity
function getStablecoinBalanceOfInternal(IStore s, bytes32 coverKey) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStablecoinBalanceOfInternal(IStore s, bytes32 coverKey) public view returns (uint256) {
    IERC20 stablecoin = IERC20(s.getStablecoin());

    uint256 balance = stablecoin.balanceOf(address(this));
    uint256 inStrategies = getAmountInStrategies(s, coverKey, stablecoin);

    return balance + inStrategies;
  }
```
</details>

### flashLoanInternal

Initiate a flash loan.

```solidity
function flashLoanInternal(IStore s, IERC3156FlashBorrower receiver, bytes32 key, address token, uint256 amount, bytes data) external nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| receiver | IERC3156FlashBorrower | The receiver of the tokens in the loan, and the receiver of the callback. | 
| key | bytes32 |  | 
| token | address | The loan currency. | 
| amount | uint256 | The amount of tokens lent. | 
| data | bytes | Arbitrary data structure, intended to contain user-defined parameters. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function flashLoanInternal(
    IStore s,
    IERC3156FlashBorrower receiver,
    bytes32 key,
    address token,
    uint256 amount,
    bytes calldata data
  ) external returns (uint256) {
    // @suppress-address-trust-issue, @suppress-malicious-erc20 `stablecoin` can't be manipulated via user input.
    IERC20 stablecoin = IERC20(s.getStablecoin());
    (uint256 fee, uint256 protocolFee) = getFlashFeesInternal(s, token, amount);
    uint256 previousBalance = stablecoin.balanceOf(address(this));

    require(address(stablecoin) == token, "Unknown token");
    require(amount > 0, "Loan too small");
    require(fee > 0, "Fee too little");
    require(previousBalance >= amount, "Balance insufficient");

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_HAS_FLASH_LOAN, key, true);

    stablecoin.ensureTransfer(address(receiver), amount);
    require(receiver.onFlashLoan(msg.sender, token, amount, fee, data) == keccak256("ERC3156FlashBorrower.onFlashLoan"), "IERC3156: Callback failed");
    stablecoin.ensureTransferFrom(address(receiver), address(this), amount + fee);
    stablecoin.ensureTransfer(s.getTreasury(), protocolFee);

    uint256 finalBalance = stablecoin.balanceOf(address(this));
    require(finalBalance >= previousBalance + fee, "Access is denied");

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_HAS_FLASH_LOAN, key, false);

    s.updateStateAndLiquidity(key);

    return fee;
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
* [ILiquidityEngine](ILiquidityEngine.md)
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
