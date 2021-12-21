# VaultLibV1.sol

View Source: [contracts/libraries/VaultLibV1.sol](../contracts/libraries/VaultLibV1.sol)

**VaultLibV1**

## Functions

- [calculatePods(address pod, address stablecoin, uint256 liquidityToAdd)](#calculatepods)
- [calculateLiquidity(address pod, address stablecoin, uint256 podsToBurn)](#calculateliquidity)
- [redeemPods(address pod, address stablecoin, address account, uint256 podsToBurn)](#redeempods)
- [addLiquidity(IStore s, bytes32 coverKey, address pod, address stablecoin, address account, uint256 amount, bool initialLiquidity)](#addliquidity)
- [removeLiquidity(IStore s, bytes32 coverKey, address pod, address stablecoin, uint256 podsToRedeem)](#removeliquidity)

### calculatePods

Calculates the amount of PODS to mint for the given amount of liquidity to transfer

```solidity
function calculatePods(address pod, address stablecoin, uint256 liquidityToAdd) public view
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
function calculatePods(
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

    if (balance == 0) {
      return liquidityToAdd;
    }

    return (IERC20(pod).totalSupply() * liquidityToAdd) / balance;
  }
```
</details>

### calculateLiquidity

Calculates the amount of liquidity to transfer for the given amount of PODs to burn

```solidity
function calculateLiquidity(address pod, address stablecoin, uint256 podsToBurn) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| pod | address |  | 
| stablecoin | address |  | 
| podsToBurn | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculateLiquidity(
    address pod,
    address stablecoin,
    uint256 podsToBurn
  ) public view returns (uint256) {
    uint256 balance = IERC20(stablecoin).balanceOf(address(this));
    return (balance * podsToBurn) / IERC20(pod).totalSupply();
  }
```
</details>

### redeemPods

Internal function to redeem pods by burning. <br /> <br />
 **How Does This Work?**
 Transfer PODs --> This Contract --> Burn the PODs
 This Contract --> Transfers Your Share of Liquidity Tokens

```solidity
function redeemPods(address pod, address stablecoin, address account, uint256 podsToBurn) public nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| pod | address | sToBurn Enter the amount of PODs to burn | 
| stablecoin | address |  | 
| account | address | Specify the address to burn the PODs from | 
| podsToBurn | uint256 | Enter the amount of PODs to burn | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function redeemPods(
    address pod,
    address stablecoin,
    address account,
    uint256 podsToBurn
  ) public returns (uint256) {
    uint256 amount = calculateLiquidity(pod, stablecoin, podsToBurn);

    IERC20(pod).transferFrom(account, address(this), podsToBurn);
    IERC20(stablecoin).ensureTransfer(account, amount);

    return amount;
  }
```
</details>

### addLiquidity

Adds liquidity to the specified cover contract

```solidity
function addLiquidity(IStore s, bytes32 coverKey, address pod, address stablecoin, address account, uint256 amount, bool initialLiquidity) public nonpayable
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
function addLiquidity(
    IStore s,
    bytes32 coverKey,
    address pod,
    address stablecoin,
    address account,
    uint256 amount,
    bool initialLiquidity
  ) public returns (uint256) {
    require(account != address(0), "Invalid account");

    address liquidityToken = s.getLiquidityToken();
    require(stablecoin == liquidityToken, "Vault migration required");

    // Update values
    s.addUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY, coverKey, amount);

    uint256 minLiquidityPeriod = s.getMinLiquidityPeriod();
    s.setUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, coverKey, account, block.timestamp + minLiquidityPeriod); // solhint-disable-line

    uint256 podsToMint = calculatePods(pod, stablecoin, amount);

    if (initialLiquidity == false) {
      // First deposit the tokens
      IERC20(stablecoin).ensureTransferFrom(account, address(this), amount);
    }

    return podsToMint;
  }
```
</details>

### removeLiquidity

Removes liquidity from the specified cover contract

```solidity
function removeLiquidity(IStore s, bytes32 coverKey, address pod, address stablecoin, uint256 podsToRedeem) public nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 | Enter the cover key | 
| pod | address | sToRedeem Enter the amount of liquidity token to remove. | 
| stablecoin | address |  | 
| podsToRedeem | uint256 | Enter the amount of liquidity token to remove. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeLiquidity(
    IStore s,
    bytes32 coverKey,
    address pod,
    address stablecoin,
    uint256 podsToRedeem
  ) public returns (uint256) {
    s.mustBeValidCover(coverKey);

    uint256 available = s.getPolicyContract().getCoverable(coverKey);
    uint256 releaseAmount = calculateLiquidity(pod, stablecoin, podsToRedeem);

    /*
     * You need to wait for the policy term to expire before you can withdraw
     * your liquidity.
     */
    require(available >= releaseAmount, "Insufficient balance"); // Insufficient balance. Please wait for the policy to expire.
    require(s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, coverKey, msg.sender) > 0, "Invalid request");
    require(block.timestamp > s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, coverKey, msg.sender), "Withdrawal too early"); // solhint-disable-line

    // Update values
    s.subtractUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY, coverKey, releaseAmount);

    IERC20(pod).transferFrom(msg.sender, address(this), podsToRedeem);
    IERC20(stablecoin).ensureTransfer(msg.sender, releaseAmount);

    return releaseAmount;
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
