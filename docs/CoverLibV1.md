# CoverLibV1.sol

View Source: [contracts/libraries/CoverLibV1.sol](../contracts/libraries/CoverLibV1.sol)

**CoverLibV1**

**Events**

```js
event CoverUserWhitelistUpdated(bytes32 indexed coverKey, address  account, bool  status);
```

## Functions

- [getCoverInfo(IStore s, bytes32 coverKey)](#getcoverinfo)
- [initializeCoverInternal(IStore s, address liquidityToken, bytes32 liquidityName)](#initializecoverinternal)
- [addCoverInternal(IStore s, bytes32 coverKey, bytes32 info, address reassuranceToken, bool requiresWhitelist, uint256[] values)](#addcoverinternal)
- [_addCover(IStore s, bytes32 coverKey, bytes32 info, address reassuranceToken, bool requiresWhitelist, uint256[] values, uint256 fee)](#_addcover)
- [deployVaultInternal(IStore s, bytes32 coverKey)](#deployvaultinternal)
- [_validateAndGetFee(IStore s, bytes32 coverKey, bytes32 info, uint256 stakeWithFee)](#_validateandgetfee)
- [updateCoverInternal(IStore s, bytes32 coverKey, bytes32 info)](#updatecoverinternal)
- [stopCoverInternal(IStore s, bytes32 coverKey)](#stopcoverinternal)
- [updateCoverCreatorWhitelistInternal(IStore s, address account, bool status)](#updatecovercreatorwhitelistinternal)
- [_updateCoverUserWhitelistInternal(IStore s, bytes32 coverKey, address account, bool status)](#_updatecoveruserwhitelistinternal)
- [updateCoverUsersWhitelistInternal(IStore s, bytes32 coverKey, address[] accounts, bool[] statuses)](#updatecoveruserswhitelistinternal)
- [setCoverFeesInternal(IStore s, uint256 value)](#setcoverfeesinternal)
- [setMinCoverCreationStakeInternal(IStore s, uint256 value)](#setmincovercreationstakeinternal)
- [setMinStakeToAddLiquidityInternal(IStore s, uint256 value)](#setminstaketoaddliquidityinternal)

### getCoverInfo

```solidity
function getCoverInfo(IStore s, bytes32 coverKey) external view
returns(owner address, info bytes32, values uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverInfo(IStore s, bytes32 coverKey)
    external
    view
    returns (
      address owner,
      bytes32 info,
      uint256[] memory values
    )
  {
    info = s.getBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, coverKey);
    owner = s.getAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, coverKey);

    values = new uint256[](5);

    values[0] = s.getUintByKeys(ProtoUtilV1.NS_COVER_FEE_EARNING, coverKey);
    values[1] = s.getStake(coverKey);
    values[2] = s.getStablecoinOwnedByVaultInternal(coverKey);
    values[3] = s.getActiveLiquidityUnderProtection(coverKey);
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
    // @suppress-initialization Can only be initialized once by a cover manager. Check caller.
    // @suppress-address-trust-issue liquidityToken This instance of liquidityToken can be trusted because of the ACL requirement. Check caller.
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
function addCoverInternal(IStore s, bytes32 coverKey, bytes32 info, address reassuranceToken, bool requiresWhitelist, uint256[] values) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore | Provide store instance | 
| coverKey | bytes32 | Enter a unique key for this cover | 
| info | bytes32 | IPFS info of the cover contract | 
| reassuranceToken | address | **Optional.** Token added as an reassurance of this cover. <br /><br />  Reassurance tokens can be added by a project to demonstrate coverage support  for their own project. This helps bring the cover fee down and enhances  liquidity provider confidence. Along with the NPM tokens, the reassurance tokens are rewarded  as a support to the liquidity providers when a cover incident occurs. | 
| requiresWhitelist | bool |  | 
| values | uint256[] | [0] stakeWithFee Enter the total NPM amount (stake + fee) to transfer to this contract. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addCoverInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 info,
    address reassuranceToken,
    bool requiresWhitelist,
    uint256[] memory values
  ) external {
    // @suppress-address-trust-issue The reassuranceToken can only be the stablecoin supported by the protocol for this version. Check caller.

    // First validate the information entered
    (uint256 fee, ) = _validateAndGetFee(s, coverKey, info, values[0]);

    // Set the basic cover info
    _addCover(s, coverKey, info, reassuranceToken, requiresWhitelist, values, fee);

    // Stake the supplied NPM tokens and burn the fees
    s.getStakingContract().increaseStake(coverKey, msg.sender, values[0], fee);

    // Add cover reassurance
    if (values[1] > 0) {
      s.getReassuranceContract().addReassurance(coverKey, msg.sender, values[1]);
    }
  }
```
</details>

### _addCover

```solidity
function _addCover(IStore s, bytes32 coverKey, bytes32 info, address reassuranceToken, bool requiresWhitelist, uint256[] values, uint256 fee) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| info | bytes32 |  | 
| reassuranceToken | address |  | 
| requiresWhitelist | bool |  | 
| values | uint256[] |  | 
| fee | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _addCover(
    IStore s,
    bytes32 coverKey,
    bytes32 info,
    address reassuranceToken,
    bool requiresWhitelist,
    uint256[] memory values,
    uint256 fee
  ) private {
    require(coverKey > 0, "Invalid cover key");
    require(info > 0, "Invalid info");
    require(values[2] > 0, "Invalid min reporting stake");
    require(values[3] > 0, "Invalid reporting period");
    require(values[4] > 0, "Invalid cooldown period");
    require(values[5] > 0, "Invalid claim period");
    require(values[6] > 0, "Invalid floor rate");
    require(values[7] > 0, "Invalid ceiling rate");
    require(values[8] > 0, "Invalid reassurance rate");

    s.setBoolByKeys(ProtoUtilV1.NS_COVER, coverKey, true);

    s.setStatusInternal(coverKey, 0, CoverUtilV1.CoverStatus.Stopped);

    s.setAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, coverKey, msg.sender);
    s.setBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, coverKey, info);
    s.setAddressByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_TOKEN, coverKey, reassuranceToken);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_WEIGHT, coverKey, ProtoUtilV1.MULTIPLIER); // 100% weight because it's a stablecoin
    s.setBoolByKeys(ProtoUtilV1.NS_COVER_REQUIRES_WHITELIST, coverKey, requiresWhitelist);

    // Set the fee charged during cover creation
    s.setUintByKeys(ProtoUtilV1.NS_COVER_FEE_EARNING, coverKey, fee);

    s.setUintByKeys(ProtoUtilV1.NS_COVER_CREATION_DATE, coverKey, block.timestamp); // solhint-disable-line
    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, coverKey, values[2]);
    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_PERIOD, coverKey, values[3]);
    s.setUintByKeys(ProtoUtilV1.NS_RESOLUTION_COOL_DOWN_PERIOD, coverKey, values[4]);
    s.setUintByKeys(ProtoUtilV1.NS_CLAIM_PERIOD, coverKey, values[5]);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_FLOOR, coverKey, values[6]);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_CEILING, coverKey, values[7]);
    s.setUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_RATE, coverKey, values[8]);
  }
```
</details>

### deployVaultInternal

```solidity
function deployVaultInternal(IStore s, bytes32 coverKey) external nonpayable
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deployVaultInternal(IStore s, bytes32 coverKey) external returns (address) {
    address vault = s.getProtocolContract(ProtoUtilV1.CNS_COVER_VAULT, coverKey);
    require(vault == address(0), "Vault already deployed");

    s.setStatusInternal(coverKey, 0, CoverUtilV1.CoverStatus.Normal);

    // Deploy cover liquidity contract
    address deployed = s.getVaultFactoryContract().deploy(coverKey);

    s.getProtocol().addContractWithKey(ProtoUtilV1.CNS_COVER_VAULT, coverKey, address(deployed));
    return deployed;
  }
```
</details>

### _validateAndGetFee

Validation checks before adding a new cover

```solidity
function _validateAndGetFee(IStore s, bytes32 coverKey, bytes32 info, uint256 stakeWithFee) private view
returns(fee uint256, minCoverCreationStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| info | bytes32 |  | 
| stakeWithFee | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _validateAndGetFee(
    IStore s,
    bytes32 coverKey,
    bytes32 info,
    uint256 stakeWithFee
  ) private view returns (uint256 fee, uint256 minCoverCreationStake) {
    require(info > 0, "Invalid info");
    (fee, minCoverCreationStake, ) = s.getCoverCreationFeeInfo();

    uint256 minStake = fee + minCoverCreationStake;

    require(stakeWithFee > minStake, "NPM Insufficient");
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, coverKey) == false, "Already exists");
  }
```
</details>

### updateCoverInternal

```solidity
function updateCoverInternal(IStore s, bytes32 coverKey, bytes32 info) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| info | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateCoverInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 info
  ) external {
    s.setBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, coverKey, info);
  }
```
</details>

### stopCoverInternal

```solidity
function stopCoverInternal(IStore s, bytes32 coverKey) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function stopCoverInternal(IStore s, bytes32 coverKey) external {
    s.setStatusInternal(coverKey, 0, CoverUtilV1.CoverStatus.Stopped);
  }
```
</details>

### updateCoverCreatorWhitelistInternal

```solidity
function updateCoverCreatorWhitelistInternal(IStore s, address account, bool status) external nonpayable
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
function updateCoverCreatorWhitelistInternal(
    IStore s,
    address account,
    bool status
  ) external {
    s.setAddressBooleanByKey(ProtoUtilV1.NS_COVER_CREATOR_WHITELIST, account, status);
  }
```
</details>

### _updateCoverUserWhitelistInternal

```solidity
function _updateCoverUserWhitelistInternal(IStore s, bytes32 coverKey, address account, bool status) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| account | address |  | 
| status | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _updateCoverUserWhitelistInternal(
    IStore s,
    bytes32 coverKey,
    address account,
    bool status
  ) private {
    s.setAddressBooleanByKeys(ProtoUtilV1.NS_COVER_USER_WHITELIST, coverKey, account, status);
    emit CoverUserWhitelistUpdated(coverKey, account, status);
  }
```
</details>

### updateCoverUsersWhitelistInternal

```solidity
function updateCoverUsersWhitelistInternal(IStore s, bytes32 coverKey, address[] accounts, bool[] statuses) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| s | IStore |  | 
| coverKey | bytes32 |  | 
| accounts | address[] |  | 
| statuses | bool[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateCoverUsersWhitelistInternal(
    IStore s,
    bytes32 coverKey,
    address[] memory accounts,
    bool[] memory statuses
  ) external {
    require(accounts.length == statuses.length, "Inconsistent array sizes");

    for (uint256 i = 0; i < accounts.length; i++) {
      _updateCoverUserWhitelistInternal(s, coverKey, accounts[i], statuses[i]);
    }
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
* [console](console.md)
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
* [IPriceDiscovery](IPriceDiscovery.md)
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
* [NPMDistributor](NPMDistributor.md)
* [NTransferUtilV2](NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](NTransferUtilV2Intermediate.md)
* [Ownable](Ownable.md)
* [Pausable](Pausable.md)
* [Policy](Policy.md)
* [PolicyAdmin](PolicyAdmin.md)
* [PolicyHelperV1](PolicyHelperV1.md)
* [PoorMansERC20](PoorMansERC20.md)
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
