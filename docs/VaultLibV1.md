# VaultLibV1.sol

View Source: [contracts/libraries/VaultLibV1.sol](../contracts/libraries/VaultLibV1.sol)

**VaultLibV1**

## Functions

- [calculatePodsInternal(address pod, address stablecoin, uint256 liquidityToAdd)](#calculatepodsinternal)
- [calculateLiquidityInternal(IStore s, bytes32 coverKey, address pod, address stablecoin, uint256 podsToBurn)](#calculateliquidityinternal)
- [getInfoInternal(IStore s, bytes32 coverKey, address pod, address stablecoin, address you)](#getinfointernal)
- [getLendingTotal(IStore s, bytes32 coverKey)](#getlendingtotal)
- [addLiquidityInternal(IStore s, bytes32 coverKey, address pod, address stablecoin, address account, uint256 amount, bool initialLiquidity)](#addliquidityinternal)
- [removeLiquidityInternal(IStore s, bytes32 coverKey, address pod, uint256 podsToRedeem)](#removeliquidityinternal)
- [getFlashFeeInternal(IStore s, address token, uint256 amount)](#getflashfeeinternal)
- [getProtocolFlashLoanFee(IStore s)](#getprotocolflashloanfee)
- [getMaxFlashLoanInternal(IStore s, address token)](#getmaxflashloaninternal)

### calculatePodsInternal

Calculates the amount of PODS to mint for the given amount of liquidity to transfer

```solidity
function calculatePodsInternal(address pod, address stablecoin, uint256 liquidityToAdd) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| pod | address |  | 
| stablecoin | address |  | 
| liquidityToAdd | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculatePodsInternal(
    address pod,
    address stablecoin,
    uint256 liquidityToAdd
  ) public view returns (uint256) {
    uint256 balance = IERC20(stablecoin).balanceOf(address(this));
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
 todo Need to revisit this later and fix the following issue
 https://github.com/neptune-mutual/protocol/issues/23
 As it seems, the function `calculateLiquidityInternal` does not consider that
 the balance of the-then vault may not or most likely will not be accurate.
 Or that the protocol could have lent out some portion of the liquidity to one
 or several external protocols to maximize rewards given to the liquidity providers.
 # Proposal 1: By Tracking Liquidity Lent Out
 It’s easy to keep track of how much liquidity was lent elsewhere and
 add that amount to come up with the total liquidity of the vault at any time.
 This solution allows liquidity providers to view their final balance and redeem
 their PODs anytime and receive withdrawals.
 **The Problems of This Approach**
 Imagine an external lending protocol we sent liquidity to is attacked and exploited
 and became unable to pay back the amount with interest. This situation, if it arises,
 suggests a design flaw. As liquidity providers can receive their share of
 the liquidity and rewards without bearing any loss, many will jump in
 to withdraw immediately.
 If this happens and most likely will, the liquidity providers who kept their liquidity
 longer in the protocol will now collectively bear the loss. Then again, `tracking liquidity`
 becomes much more complex because we not only need to track the balance of
 the-then vault contract but several other things like `external lendings`
 and `lending defaults.`
 # Proposal 2: By Creating a `Withdrawal Window`
 The Vault contract can lend out liquidity to external lending protocols to maximize reward
 regularly. But it also MUST WITHDRAW PERIODICALLY to receive back the loaned amount
 with interest. In other words, the Vault contract continuously supplies
 available liquidity to lending protocols and withdraws during a fixed interval.
 For example, supply during `180-day lending period` and allow withdrawals
 during `7-day withdrawal period`.
 This proposal solves the issue of `Proposal 1` as the protocol treats every
 liquidity provider the same. The providers will be able to withdraw their
 proportional share of liquidity during the `withdrawal period` without
 getting any additional benefit or alone suffering financial loss
 based on how quick or late they were to withdraw.
 Another advantage of this proposal is that the issue reported
 is no longer a bug but a feature.
 **The Problems of This Approach**
 The problem with this approach is the fixed period when liquidity providers
 can withdraw. If LPs do not redeem their liquidity during the `withdrawal period,`
 they will have to wait for another cycle until the `lending period` is over.
 This solution would not be a problem for liquidity providers with a
 long-term mindset who understand the risks of `risk pooling.` A short-term-focused
 liquidity provider would want to see a `90-day` or shorter lending duration
 that enables them to pool liquidity in and out periodically based on their preference.

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
nction calculateLiquidityInternal(
    IStore s,
    bytes32 coverKey,
    address pod,
    address stablecoin,
    uint256 podsToBurn
  ) public view returns (uint256) {
    /***************************************************************************
    @todo Need to revisit this later and fix the following issue
    https://github.com/neptune-mutual/protocol/issues/23
    ***************************************************************************/
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
nction getInfoInternal(
    IStore s,
    bytes32 coverKey,
    address pod,
    address stablecoin,
    address you
  ) external view returns (uint256[] memory values) {
    values = new uint256[](10);

    values[0] = IERC20(pod).totalSupply(); // Total PODs in existence
    values[1] = IERC20(stablecoin).balanceOf(address(this)); // Stablecoins in the pool
    values[2] = getLendingTotal(s, coverKey); //  Stablecoins lent outside of the protocol
    values[3] = s.getReassuranceAmountInternal(coverKey); // Total reassurance for this cover
    values[4] = s.getMinLiquidityPeriod(); // Lockup period
    values[5] = IERC20(pod).balanceOf(you); // Your POD Balance
    values[6] = s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_ADDED, coverKey, you); // Sum of your deposits (in stablecoin)
    values[7] = s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_REMOVED, coverKey, you); // Sum of your withdrawals  (in stablecoin)
    values[8] = calculateLiquidityInternal(s, coverKey, pod, stablecoin, values[1]); //  My share of the liquidity pool (in stablecoin)
    values[9] = s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, coverKey, you); // My liquidity release date
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
nction getLendingTotal(IStore s, bytes32 coverKey) public view returns (uint256) {
    // @todo Update `NS_COVER_STABLECOIN_LENT_TOTAL` when building lending
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_STABLECOIN_LENT_TOTAL, coverKey);
  }

```
</details>

### addLiquidityInternal

Adds liquidity to the specified cover contract

```solidity
function addLiquidityInternal(IStore s, bytes32 coverKey, address pod, address stablecoin, address account, uint256 amount, bool initialLiquidity) external nonpayable
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
| initialLiquidity | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
nction addLiquidityInternal(
    IStore s,
    bytes32 coverKey,
    address pod,
    address stablecoin,
    address account,
    uint256 amount,
    bool initialLiquidity
  ) external returns (uint256) {
    // @suppress-address-trust-issue The address `stablecoin` can be trusted here because we are ensuring it matches with the protocol stablecoin address.
    // @suppress-address-trust-issue The address `account` can be trusted here because we are not treating it as a contract (even it were).
    require(account != address(0), "Invalid account");
    require(stablecoin == s.getStablecoin(), "Vault migration required");

    // Update values
    s.addUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY, coverKey, amount); // Total liquidity
    s.addUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_ADDED, coverKey, account, amount); // Your liquidity

    uint256 minLiquidityPeriod = s.getMinLiquidityPeriod();
    s.setUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, coverKey, account, block.timestamp + minLiquidityPeriod); // solhint-disable-line

    uint256 podsToMint = calculatePodsInternal(pod, stablecoin, amount);

    if (initialLiquidity == false) {
      // First deposit the tokens
      IERC20(stablecoin).ensureTransferFrom(account, address(this), amount);
    }

    return podsToMint;
  }

```
</details>

### removeLiquidityInternal

Removes liquidity from the specified cover contract

```solidity
function removeLiquidityInternal(IStore s, bytes32 coverKey, address pod, uint256 podsToRedeem) external nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 | Enter the cover key | 
| pod | address | sToRedeem Enter the amount of liquidity token to remove. | 
| podsToRedeem | uint256 | Enter the amount of liquidity token to remove. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
nction removeLiquidityInternal(
    IStore s,
    bytes32 coverKey,
    address pod,
    uint256 podsToRedeem
  ) external returns (uint256) {
    // @suppress-address-trust-issue The address `pod` although can only come from VaultBase, we still need to ensure if it is a protocol member.
    s.mustBeValidCover(coverKey);
    s.mustBeProtocolMember(pod);

    address stablecoin = s.getStablecoin();

    uint256 available = s.getPolicyContract().getCoverable(coverKey);
    uint256 releaseAmount = calculateLiquidityInternal(s, coverKey, pod, stablecoin, podsToRedeem);

    /*
     * You need to wait for the policy term to expire before you can withdraw
     * your liquidity.
     */
    require(available >= releaseAmount, "Insufficient balance"); // Insufficient balance. Please wait for the policy to expire.
    require(s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, coverKey, msg.sender) > 0, "Invalid request");
    require(block.timestamp > s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, coverKey, msg.sender), "Withdrawal too early"); // solhint-disable-line

    // Update values
    s.subtractUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY, coverKey, releaseAmount);
    s.subtractUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_REMOVED, coverKey, msg.sender, releaseAmount);

    IERC20(pod).ensureTransferFrom(msg.sender, address(this), podsToRedeem);
    IERC20(stablecoin).ensureTransfer(msg.sender, releaseAmount);

    return releaseAmount;
  }

```
</details>

### getFlashFeeInternal

The fee to be charged for a given loan.

```solidity
function getFlashFeeInternal(IStore s, address token, uint256 amount) external view
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
nction getFlashFeeInternal(
    IStore s,
    address token,
    uint256 amount
  ) external view returns (uint256 fee, uint256 protocolFee) {
    address stablecoin = s.getStablecoin();

    /*
    https://eips.ethereum.org/EIPS/eip-3156

    The flashFee function MUST return the fee charged for a loan of amount token.
    If the token is not supported flashFee MUST revert.
    */
    require(stablecoin == token, "Unsupported token");

    uint256 rate = s.getUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_FLASH_LOAN_FEE);
    uint256 protocolRate = s.getUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_FLASH_LOAN_FEE_PROTOCOL);

    fee = (amount * rate) / ProtoUtilV1.PERCENTAGE_DIVISOR;
    protocolFee = (fee * protocolRate) / ProtoUtilV1.PERCENTAGE_DIVISOR;
  }

```
</details>

### getProtocolFlashLoanFee

```solidity
function getProtocolFlashLoanFee(IStore s) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
nction getProtocolFlashLoanFee(IStore s) external view returns (uint256) {
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
nction getMaxFlashLoanInternal(IStore s, address token) external view returns (uint256) {
    address stablecoin = s.getStablecoin();

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
* [IUniswapV2FactoryLike](IUniswapV2FactoryLike.md)
* [IUniswapV2PairLike](IUniswapV2PairLike.md)
* [IUniswapV2RouterLike](IUniswapV2RouterLike.md)
* [IUnstakable](IUnstakable.md)
* [IVault](IVault.md)
* [IVaultFactory](IVaultFactory.md)
* [IWitness](IWitness.md)
* [MaliciousToken](MaliciousToken.md)
* [Migrations](Migrations.md)
* [MockCxToken](MockCxToken.md)
* [MockCxTokenPolicy](MockCxTokenPolicy.md)
* [MockCxTokenStore](MockCxTokenStore.md)
* [MockProcessorStore](MockProcessorStore.md)
* [MockProtocol](MockProtocol.md)
* [MockStore](MockStore.md)
* [MockVault](MockVault.md)
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
