# Vault Delegate Base Contract (VaultDelegateBase.sol)

View Source: [contracts/core/delegates/VaultDelegateBase.sol](../contracts/core/delegates/VaultDelegateBase.sol)

**↗ Extends: [IVaultDelegate](IVaultDelegate.md), [Recoverable](Recoverable.md)**
**↘ Derived Contracts: [VaultDelegateWithFlashLoan](VaultDelegateWithFlashLoan.md)**

**VaultDelegateBase**

The vault delegate base contract includes pre and post hooks.
 The hooks are accessible only to vault contracts.

## Functions

- [constructor(IStore store)](#)
- [preTransferGovernance(address caller, bytes32 coverKey, address , uint256 )](#pretransfergovernance)
- [postTransferGovernance(address caller, bytes32 coverKey, address , uint256 )](#posttransfergovernance)
- [preTransferToStrategy(address caller, IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount)](#pretransfertostrategy)
- [postTransferToStrategy(address caller, IERC20 , bytes32 coverKey, bytes32 strategyName, uint256 )](#posttransfertostrategy)
- [preReceiveFromStrategy(address caller, IERC20 , bytes32 coverKey, bytes32 strategyName, uint256 )](#prereceivefromstrategy)
- [postReceiveFromStrategy(address caller, IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount)](#postreceivefromstrategy)
- [preAddLiquidity(address caller, bytes32 coverKey, uint256 amount, uint256 npmStakeToAdd)](#preaddliquidity)
- [postAddLiquidity(address , bytes32 coverKey, uint256 , uint256 )](#postaddliquidity)
- [accrueInterestImplementation(address caller, bytes32 coverKey)](#accrueinterestimplementation)
- [preRemoveLiquidity(address caller, bytes32 coverKey, uint256 podsToRedeem, uint256 npmStakeToRemove, bool exit)](#preremoveliquidity)
- [postRemoveLiquidity(address , bytes32 coverKey, uint256 , uint256 , bool )](#postremoveliquidity)
- [calculatePodsImplementation(bytes32 coverKey, uint256 stablecoinIn)](#calculatepodsimplementation)
- [calculateLiquidityImplementation(bytes32 coverKey, uint256 podsToBurn)](#calculateliquidityimplementation)
- [getStablecoinBalanceOfImplementation(bytes32 coverKey)](#getstablecoinbalanceofimplementation)
- [getInfoImplementation(bytes32 coverKey, address you)](#getinfoimplementation)
- [version()](#version)
- [getName()](#getname)

### 

Constructs this contract

```solidity
function (IStore store) internal nonpayable Recoverable 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore | Provide the store contract instance | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(IStore store) Recoverable(store) {}
```
</details>

### preTransferGovernance

This hook runs before `transferGovernance` implementation on vault(s).

```solidity
function preTransferGovernance(address caller, bytes32 coverKey, address , uint256 ) external nonpayable nonReentrant 
returns(stablecoin address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address | Enter your msg.sender value. | 
| coverKey | bytes32 | Provide your vault's cover key. | 
|  | address | caller Enter your msg.sender value. | 
|  | uint256 | caller Enter your msg.sender value. | 

**Returns**

stablecoin Returns address of the protocol stablecoin if the hook validation passes.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function preTransferGovernance(
    address caller,
    bytes32 coverKey,
    address, /*to*/
    uint256 /*amount*/
  ) external override nonReentrant returns (address stablecoin) {
    // @suppress-zero-value-check This function does not transfer any values
    s.mustNotBePaused();
    s.mustBeProtocolMember(caller);
    s.mustBeProtocolMember(msg.sender);
    s.senderMustBeVaultContract(coverKey);
    s.callerMustBeClaimsProcessorContract(caller);

    stablecoin = s.getStablecoin();
  }
```
</details>

### postTransferGovernance

This hook runs after `transferGovernance` implementation on vault(s)
 and performs cleanup and/or validation if needed.

```solidity
function postTransferGovernance(address caller, bytes32 coverKey, address , uint256 ) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address | Enter your msg.sender value. | 
| coverKey | bytes32 | Provide your vault's cover key. | 
|  | address | caller Enter your msg.sender value. | 
|  | uint256 | caller Enter your msg.sender value. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function postTransferGovernance(
    address caller,
    bytes32 coverKey,
    address, /*to*/
    uint256 /*amount*/
  ) external view override {
    s.mustNotBePaused();
    s.mustBeProtocolMember(caller);
    s.mustBeProtocolMember(msg.sender);
    s.senderMustBeVaultContract(coverKey);
    s.callerMustBeClaimsProcessorContract(caller);
  }
```
</details>

### preTransferToStrategy

This hook runs before `transferToStrategy` implementation on vault(s)

```solidity
function preTransferToStrategy(address caller, IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address | Enter your msg.sender value | 
| token | IERC20 | Provide the ERC20 token you'd like to transfer to the given strategy | 
| coverKey | bytes32 | Provide your vault's cover key | 
| strategyName | bytes32 | Enter the strategy name | 
| amount | uint256 | Enter the amount to transfer | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function preTransferToStrategy(
    address caller,
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external override nonReentrant {
    // @suppress-zero-value-check Checked
    s.mustNotBePaused();
    s.mustBeProtocolMember(caller);
    s.mustBeProtocolMember(msg.sender);
    s.senderMustBeVaultContract(coverKey);
    s.callerMustBeSpecificStrategyContract(caller, strategyName);

    s.preTransferToStrategyInternal(token, coverKey, strategyName, amount);
  }
```
</details>

### postTransferToStrategy

This hook runs after `transferToStrategy` implementation on vault(s)
 and performs cleanup and/or validation if needed.

```solidity
function postTransferToStrategy(address caller, IERC20 , bytes32 coverKey, bytes32 strategyName, uint256 ) external view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address | Enter your msg.sender value | 
|  | IERC20 | caller Enter your msg.sender value | 
| coverKey | bytes32 | Enter the coverKey | 
| strategyName | bytes32 | Enter the strategy name | 
|  | uint256 | caller Enter your msg.sender value | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function postTransferToStrategy(
    address caller,
    IERC20, /*token*/
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 /*amount*/
  ) external view override {
    s.mustNotBePaused();
    s.mustBeProtocolMember(caller);
    s.mustBeProtocolMember(msg.sender);
    s.senderMustBeVaultContract(coverKey);
    s.callerMustBeSpecificStrategyContract(caller, strategyName);
  }
```
</details>

### preReceiveFromStrategy

This hook runs before `receiveFromStrategy` implementation on vault(s)

```solidity
function preReceiveFromStrategy(address caller, IERC20 , bytes32 coverKey, bytes32 strategyName, uint256 ) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address | Enter your msg.sender value | 
|  | IERC20 | caller Enter your msg.sender value | 
| coverKey | bytes32 | Provide your vault's cover key | 
| strategyName | bytes32 | Enter the strategy name | 
|  | uint256 | caller Enter your msg.sender value | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function preReceiveFromStrategy(
    address caller,
    IERC20, /*token*/
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 /*amount*/
  ) external override nonReentrant {
    // @suppress-zero-value-check This function does not transfer any tokens
    s.mustNotBePaused();
    s.mustBeProtocolMember(caller);
    s.mustBeProtocolMember(msg.sender);
    s.senderMustBeVaultContract(coverKey);
    s.callerMustBeSpecificStrategyContract(caller, strategyName);
  }
```
</details>

### postReceiveFromStrategy

This hook runs after `receiveFromStrategy` implementation on vault(s)
 and performs cleanup and/or validation if needed.

```solidity
function postReceiveFromStrategy(address caller, IERC20 token, bytes32 coverKey, bytes32 strategyName, uint256 amount) external nonpayable
returns(income uint256, loss uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address | Enter your msg.sender value | 
| token | IERC20 | Enter the token your vault received from strategy | 
| coverKey | bytes32 | Enter the coverKey | 
| strategyName | bytes32 | Enter the strategy name | 
| amount | uint256 | Enter the amount received | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function postReceiveFromStrategy(
    address caller,
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external override returns (uint256 income, uint256 loss) {
    // @suppress-zero-value-check This call does not perform any transfers
    s.mustNotBePaused();
    s.mustBeProtocolMember(caller);
    s.mustBeProtocolMember(msg.sender);
    s.senderMustBeVaultContract(coverKey);
    s.callerMustBeSpecificStrategyContract(caller, strategyName);

    (income, loss) = s.postReceiveFromStrategyInternal(token, coverKey, strategyName, amount);
  }
```
</details>

### preAddLiquidity

This hook runs before `addLiquidity` implementation on vault(s)

```solidity
function preAddLiquidity(address caller, bytes32 coverKey, uint256 amount, uint256 npmStakeToAdd) external nonpayable nonReentrant 
returns(podsToMint uint256, previousNpmStake uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address |  | 
| coverKey | bytes32 | Enter the cover key | 
| amount | uint256 | Enter the amount of liquidity token to supply. | 
| npmStakeToAdd | uint256 | Enter the amount of NPM token to stake. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function preAddLiquidity(
    address caller,
    bytes32 coverKey,
    uint256 amount,
    uint256 npmStakeToAdd
  ) external override nonReentrant returns (uint256 podsToMint, uint256 previousNpmStake) {
    // @suppress-zero-value-check This call does not transfer any tokens
    s.mustNotBePaused();
    s.mustBeProtocolMember(msg.sender);
    s.senderMustBeVaultContract(coverKey);
    s.mustEnsureAllProductsAreNormal(coverKey);

    ValidationLibV1.mustNotExceedStablecoinThreshold(s, amount);
    GovernanceUtilV1.mustNotExceedNpmThreshold(amount);

    address pod = msg.sender;
    (podsToMint, previousNpmStake) = s.preAddLiquidityInternal(coverKey, pod, caller, amount, npmStakeToAdd);
  }
```
</details>

### postAddLiquidity

This hook runs after `addLiquidity` implementation on vault(s)
 and performs cleanup and/or validation if needed.

```solidity
function postAddLiquidity(address , bytes32 coverKey, uint256 , uint256 ) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
|  | address | coverKey Enter the coverKey | 
| coverKey | bytes32 | Enter the coverKey | 
|  | uint256 | coverKey Enter the coverKey | 
|  | uint256 | coverKey Enter the coverKey | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function postAddLiquidity(
    address, /*caller*/
    bytes32 coverKey,
    uint256, /*amount*/
    uint256 /*npmStakeToAdd*/
  ) external override {
    // @suppress-zero-value-check This function does not transfer any tokens
    s.mustNotBePaused();
    s.mustBeProtocolMember(msg.sender);
    s.senderMustBeVaultContract(coverKey);
    s.mustEnsureAllProductsAreNormal(coverKey);
    s.updateStateAndLiquidity(coverKey);
  }
```
</details>

### accrueInterestImplementation

This implemention enables liquidity manages to
 accrue interests on a vault before withdrawals are allowed.

```solidity
function accrueInterestImplementation(address caller, bytes32 coverKey) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address | Enter your msg.sender value | 
| coverKey | bytes32 | Provide your vault's cover key | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function accrueInterestImplementation(address caller, bytes32 coverKey) external override {
    s.mustNotBePaused();
    s.senderMustBeVaultContract(coverKey);
    AccessControlLibV1.callerMustBeLiquidityManager(s, caller);

    s.accrueInterestInternal(coverKey);
  }
```
</details>

### preRemoveLiquidity

This hook runs before `removeLiquidity` implementation on vault(s)

```solidity
function preRemoveLiquidity(address caller, bytes32 coverKey, uint256 podsToRedeem, uint256 npmStakeToRemove, bool exit) external nonpayable nonReentrant 
returns(stablecoin address, stablecoinToRelease uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| caller | address | Enter your msg.sender value | 
| coverKey | bytes32 | Enter the cover key | 
| podsToRedeem | uint256 | Enter the amount of pods to redeem | 
| npmStakeToRemove | uint256 | Enter the amount of NPM stake to remove. | 
| exit | bool | If this is set to true, LPs can remove their entire NPM stake during a withdrawal period. No restriction. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function preRemoveLiquidity(
    address caller,
    bytes32 coverKey,
    uint256 podsToRedeem,
    uint256 npmStakeToRemove,
    bool exit
  ) external override nonReentrant returns (address stablecoin, uint256 stablecoinToRelease) {
    // @suppress-zero-value-check This call does not transfer any tokens
    s.mustNotBePaused();
    s.mustBeProtocolMember(msg.sender);
    s.senderMustBeVaultContract(coverKey);
    s.mustMaintainBlockHeightOffset(coverKey);
    s.mustEnsureAllProductsAreNormal(coverKey);
    s.mustBeDuringWithdrawalPeriod(coverKey);
    s.mustHaveNoBalanceInStrategies(coverKey, stablecoin);
    s.mustBeAccrued(coverKey);

    address pod = msg.sender; // The sender is vault contract
    return s.preRemoveLiquidityInternal(coverKey, pod, caller, podsToRedeem, npmStakeToRemove, exit);
  }
```
</details>

### postRemoveLiquidity

This hook runs after `removeLiquidity` implementation on vault(s)
 and performs cleanup and/or validation if needed.

```solidity
function postRemoveLiquidity(address , bytes32 coverKey, uint256 , uint256 , bool ) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
|  | address | coverKey Enter the coverKey | 
| coverKey | bytes32 | Enter the coverKey | 
|  | uint256 | coverKey Enter the coverKey | 
|  | uint256 | coverKey Enter the coverKey | 
|  | bool | coverKey Enter the coverKey | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function postRemoveLiquidity(
    address, /*caller*/
    bytes32 coverKey,
    uint256, /*podsToRedeem*/
    uint256, /*npmStakeToRemove*/
    bool /*exit*/
  ) external override {
    // @suppress-zero-value-check The uint values are not used and therefore not checked
    s.mustNotBePaused();
    s.mustBeProtocolMember(msg.sender);
    s.senderMustBeVaultContract(coverKey);
    s.updateStateAndLiquidity(coverKey);
  }
```
</details>

### calculatePodsImplementation

Calculates the amount of PODs to mint for the given amount of stablecoin

```solidity
function calculatePodsImplementation(bytes32 coverKey, uint256 stablecoinIn) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover for which you want to calculate PODs | 
| stablecoinIn | uint256 | Enter the amount in the stablecoin units | 

**Returns**

Returns the units of PODs to be minted if this stablecoin liquidity was supplied.
 Be warned that this value may change based on the cover vault's usage.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculatePodsImplementation(bytes32 coverKey, uint256 stablecoinIn) external view override returns (uint256) {
    s.senderMustBeVaultContract(coverKey);

    address pod = msg.sender;

    return s.calculatePodsInternal(coverKey, pod, stablecoinIn);
  }
```
</details>

### calculateLiquidityImplementation

Calculates the amount of stablecoin units to receive for the given amount of PODs to redeem

```solidity
function calculateLiquidityImplementation(bytes32 coverKey, uint256 podsToBurn) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover for which you want to calculate PODs | 
| podsToBurn | uint256 | Enter the amount in the POD units to redeem | 

**Returns**

Returns the units of stablecoins to redeem if the specified PODs were burned.
 Be warned that this value may change based on the cover's vault usage.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculateLiquidityImplementation(bytes32 coverKey, uint256 podsToBurn) external view override returns (uint256) {
    s.senderMustBeVaultContract(coverKey);
    address pod = msg.sender;
    return s.calculateLiquidityInternal(coverKey, pod, podsToBurn);
  }
```
</details>

### getStablecoinBalanceOfImplementation

Returns the stablecoin balance of this vault
 This also includes amounts lent out in lending strategies by this vault
 Warning: this function does not validate the cover key supplied.

```solidity
function getStablecoinBalanceOfImplementation(bytes32 coverKey) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Enter the cover for which you want to get the stablecoin balance | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getStablecoinBalanceOfImplementation(bytes32 coverKey) external view override returns (uint256) {
    s.senderMustBeVaultContract(coverKey);
    return s.getStablecoinOwnedByVaultInternal(coverKey);
  }
```
</details>

### getInfoImplementation

Gets information of a given vault by the cover key
 Warning: this function does not validate the cover key and account supplied.

```solidity
function getInfoImplementation(bytes32 coverKey, address you) external view
returns(values uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| coverKey | bytes32 | Specify cover key to obtain the info of | 
| you | address | The address for which the info will be customized | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getInfoImplementation(bytes32 coverKey, address you) external view override returns (uint256[] memory values) {
    s.senderMustBeVaultContract(coverKey);
    address pod = msg.sender;
    return s.getInfoInternal(coverKey, pod, you);
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
function getName() external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getName() external pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_VAULT_DELEGATE;
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
