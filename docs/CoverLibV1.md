# CoverLibV1.sol

View Source: [contracts/libraries/CoverLibV1.sol](../contracts/libraries/CoverLibV1.sol)

**CoverLibV1**

## Functions

- [getCoverInfo(IStore s, bytes32 key)](#getcoverinfo)
- [initializeCoverInternal(IStore s, address liquidityToken, bytes32 liquidityName)](#initializecoverinternal)
- [addCoverInternal(IStore s, bytes32 key, bytes32 info, address reassuranceToken, uint256[] values)](#addcoverinternal)
- [_addCover(IStore s, bytes32 key, bytes32 info, address reassuranceToken, uint256[] values, uint256 fee)](#_addcover)
- [_validateAndGetFee(IStore s, bytes32 key, bytes32 info, uint256 stakeWithFee, uint256 initialLiquidity)](#_validateandgetfee)
- [updateCoverInternal(IStore s, bytes32 key, bytes32 info)](#updatecoverinternal)
- [stopCoverInternal(IStore s, bytes32 key)](#stopcoverinternal)
- [updateWhitelistInternal(IStore s, address account, bool status)](#updatewhitelistinternal)
- [setCoverFeesInternal(IStore s, uint256 value)](#setcoverfeesinternal)
- [setMinCoverCreationStakeInternal(IStore s, uint256 value)](#setmincovercreationstakeinternal)
- [setMinStakeToAddLiquidityInternal(IStore s, uint256 value)](#setminstaketoaddliquidityinternal)
- [increaseProvisionInternal(IStore s, bytes32 key, uint256 amount)](#increaseprovisioninternal)
- [decreaseProvisionInternal(IStore s, bytes32 key, uint256 amount)](#decreaseprovisioninternal)

### getCoverInfo

```solidity
function getCoverInfo(IStore s, bytes32 key) external view
returns(owner address, info bytes32, values uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverInfo(IStore s, bytes32 key)
    external
    view
    returns (
      address owner,
      bytes32 info,
      uint256[] memory values
    )
  {
    info = s.getBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, key);
    owner = s.getAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, key);

    values = new uint256[](5);

    values[0] = s.getUintByKeys(ProtoUtilV1.NS_COVER_FEE_EARNING, key);
    values[1] = s.getUintByKeys(ProtoUtilV1.NS_COVER_STAKE, key);
    values[2] = s.getCoverPoolLiquidity(key);
    values[3] = s.getUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key);

    values[4] = s.getCoverLiquidityCommitted(key);
  }
```
</details>

### initializeCoverInternal

```solidity
function initializeCoverInternal(IStore s, address liquidityToken, bytes32 liquidityName) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| liquidityToken | address |  | 
| liquidityName | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function initializeCoverInternal(
    IStore s,
    address liquidityToken,
    bytes32 liquidityName
  ) external {
    s.setAddressByKey(ProtoUtilV1.CNS_COVER_STABLECOIN, liquidityToken);
    s.setBytes32ByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_NAME, liquidityName);

    s.updateStateAndLiquidity(0);
  }
```
</details>

### addCoverInternal

Adds a new coverage pool or cover contract.
 To add a new cover, you need to pay cover creation fee
 and stake minimum amount of NPM in the Vault. <br /> <br />
 Through the governance portal, projects will be able redeem
 the full cover fee at a later date. <br /> <br />
 **Apply for Fee Redemption** <br />
 https://docs.neptunemutual.com/covers/cover-fee-redemption <br /><br />
 As the cover creator, you will earn a portion of all cover fees
 generated in this pool. <br /> <br />
 Read the documentation to learn more about the fees: <br />
 https://docs.neptunemutual.com/covers/contract-creators

```solidity
function addCoverInternal(IStore s, bytes32 key, bytes32 info, address reassuranceToken, uint256[] values) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Provide store instance | 
| key | bytes32 | Enter a unique key for this cover | 
| info | bytes32 | IPFS info of the cover contract | 
| reassuranceToken | address | **Optional.** Token added as an reassurance of this cover. <br /><br />  Reassurance tokens can be added by a project to demonstrate coverage support  for their own project. This helps bring the cover fee down and enhances  liquidity provider confidence. Along with the NPM tokens, the reassurance tokens are rewarded  as a support to the liquidity providers when a cover incident occurs. | 
| values | uint256[] | [0] minStakeToReport A cover creator can override default min NPM stake to avoid spam reports | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addCoverInternal(
    IStore s,
    bytes32 key,
    bytes32 info,
    address reassuranceToken,
    uint256[] memory values
  ) external {
    // First validate the information entered
    (uint256 fee, , uint256 minStakeToAddLiquidity) = _validateAndGetFee(s, key, info, values[2], values[4]);

    // Set the basic cover info
    _addCover(s, key, info, reassuranceToken, values, fee);

    // Stake the supplied NPM tokens and burn the fees
    s.getStakingContract().increaseStake(key, msg.sender, values[2], fee);

    // Add cover reassurance
    if (values[3] > 0) {
      s.getReassuranceContract().addReassurance(key, msg.sender, values[3]);
    }

    // Add initial liquidity
    if (values[4] > 0) {
      IVault vault = s.getVault(key);

      s.getVault(key).addLiquidityInternalOnly(key, msg.sender, values[4], minStakeToAddLiquidity);

      // Transfer liquidity only after minting the pods
      // @suppress-malicious-erc20 This ERC-20 is a well-known address. Can only be set internally.
      IERC20(s.getStablecoin()).ensureTransferFrom(msg.sender, address(vault), values[4]);
    }

    s.updateStateAndLiquidity(key);
  }
```
</details>

### _addCover

```solidity
function _addCover(IStore s, bytes32 key, bytes32 info, address reassuranceToken, uint256[] values, uint256 fee) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| info | bytes32 |  | 
| reassuranceToken | address |  | 
| values | uint256[] |  | 
| fee | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _addCover(
    IStore s,
    bytes32 key,
    bytes32 info,
    address reassuranceToken,
    uint256[] memory values,
    uint256 fee
  ) private {
    // Add a new cover
    s.setBoolByKeys(ProtoUtilV1.NS_COVER, key, true);

    // Set cover owner
    s.setAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, key, msg.sender);

    // Set cover info
    s.setBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, key, info);
    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_PERIOD, key, values[1]);
    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, key, values[0]);

    // Set reassurance token
    s.setAddressByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_TOKEN, key, reassuranceToken);

    s.setUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_WEIGHT, key, ProtoUtilV1.MULTIPLIER); // 100% weight because it's a stablecoin

    // Set the fee charged during cover creation
    s.setUintByKeys(ProtoUtilV1.NS_COVER_FEE_EARNING, key, fee);

    // Deploy cover liquidity contract
    address deployed = s.getVaultFactoryContract().deploy(s, key);

    s.setAddressByKeys(ProtoUtilV1.NS_CONTRACTS, ProtoUtilV1.CNS_COVER_VAULT, key, deployed);
    s.setBoolByKeys(ProtoUtilV1.NS_MEMBERS, deployed, true);
  }
```
</details>

### _validateAndGetFee

Validation checks before adding a new cover

```solidity
function _validateAndGetFee(IStore s, bytes32 key, bytes32 info, uint256 stakeWithFee, uint256 initialLiquidity) private view
returns(fee uint256, minCoverCreationStake uint256, minStakeToAddLiquidity uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| info | bytes32 |  | 
| stakeWithFee | uint256 |  | 
| initialLiquidity | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _validateAndGetFee(
    IStore s,
    bytes32 key,
    bytes32 info,
    uint256 stakeWithFee,
    uint256 initialLiquidity
  )
    private
    view
    returns (
      uint256 fee,
      uint256 minCoverCreationStake,
      uint256 minStakeToAddLiquidity
    )
  {
    require(info > 0, "Invalid info");
    (fee, minCoverCreationStake, minStakeToAddLiquidity) = s.getCoverFee();

    uint256 minStake = fee + minCoverCreationStake;

    if (initialLiquidity > 0) {
      minStake += minStakeToAddLiquidity;
    }

    require(stakeWithFee > minStake, "NPM Insufficient");
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, key) == false, "Already exists");
  }
```
</details>

### updateCoverInternal

```solidity
function updateCoverInternal(IStore s, bytes32 key, bytes32 info) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| info | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateCoverInternal(
    IStore s,
    bytes32 key,
    bytes32 info
  ) external {
    s.setBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, key, info);
  }
```
</details>

### stopCoverInternal

```solidity
function stopCoverInternal(IStore s, bytes32 key) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function stopCoverInternal(IStore s, bytes32 key) external {
    s.setStatus(key, CoverUtilV1.CoverStatus.Stopped);
  }
```
</details>

### updateWhitelistInternal

```solidity
function updateWhitelistInternal(IStore s, address account, bool status) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| account | address |  | 
| status | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateWhitelistInternal(
    IStore s,
    address account,
    bool status
  ) external {
    s.setAddressBooleanByKey(ProtoUtilV1.NS_COVER_WHITELIST, account, status);
  }
```
</details>

### setCoverFeesInternal

```solidity
function setCoverFeesInternal(IStore s, uint256 value) external nonpayable
returns(previous uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setCoverFeesInternal(IStore s, uint256 value) external returns (uint256 previous) {
    previous = s.getUintByKey(ProtoUtilV1.NS_COVER_CREATION_FEE);
    s.setUintByKey(ProtoUtilV1.NS_COVER_CREATION_FEE, value);

    s.updateStateAndLiquidity(0);
  }
```
</details>

### setMinCoverCreationStakeInternal

```solidity
function setMinCoverCreationStakeInternal(IStore s, uint256 value) external nonpayable
returns(previous uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setMinCoverCreationStakeInternal(IStore s, uint256 value) external returns (uint256 previous) {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    previous = s.getMinCoverCreationStake();
    s.setUintByKey(ProtoUtilV1.NS_COVER_CREATION_MIN_STAKE, value);

    s.updateStateAndLiquidity(0);
  }
```
</details>

### setMinStakeToAddLiquidityInternal

```solidity
function setMinStakeToAddLiquidityInternal(IStore s, uint256 value) external nonpayable
returns(previous uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setMinStakeToAddLiquidityInternal(IStore s, uint256 value) external returns (uint256 previous) {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    previous = s.getMinStakeToAddLiquidity();
    s.setUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_MIN_STAKE, value);

    s.updateStateAndLiquidity(0);
  }
```
</details>

### increaseProvisionInternal

```solidity
function increaseProvisionInternal(IStore s, bytes32 key, uint256 amount) external nonpayable
returns(provision uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function increaseProvisionInternal(
    IStore s,
    bytes32 key,
    uint256 amount
  ) external returns (uint256 provision) {
    provision = s.getUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key);

    s.addUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key, amount);

    s.npmToken().ensureTransferFrom(msg.sender, address(this), amount);

    s.updateStateAndLiquidity(key);
  }
```
</details>

### decreaseProvisionInternal

```solidity
function decreaseProvisionInternal(IStore s, bytes32 key, uint256 amount) external nonpayable
returns(provision uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| key | bytes32 |  | 
| amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function decreaseProvisionInternal(
    IStore s,
    bytes32 key,
    uint256 amount
  ) external returns (uint256 provision) {
    provision = s.getUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key);

    require(provision >= amount, "Exceeds Balance"); // Exceeds balance
    s.subtractUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key, amount);

    s.npmToken().ensureTransfer(msg.sender, amount);

    s.updateStateAndLiquidity(key);
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
