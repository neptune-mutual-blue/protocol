# Policy Contract (Policy.sol)

View Source: [contracts/core/policy/Policy.sol](../contracts/core/policy/Policy.sol)

**↗ Extends: [IPolicy](IPolicy.md), [Recoverable](Recoverable.md)**

**Policy**

The policy contract enables you to a purchase cover

## Functions

- [constructor(IStore store)](#)
- [purchaseCover(bytes32 key, uint256 coverDuration, uint256 amountToCover)](#purchasecover)
- [getCToken(bytes32 key, uint256 coverDuration)](#getctoken)
- [getCTokenByExpiryDate(bytes32 key, uint256 expiryDate)](#getctokenbyexpirydate)
- [_getCTokenOrDeploy(bytes32 key, uint256 coverDuration)](#_getctokenordeploy)
- [getExpiryDate(uint256 today, uint256 coverDuration)](#getexpirydate)
- [getCommitment(bytes32 )](#getcommitment)
- [getCoverable(bytes32 )](#getcoverable)
- [_getCoverFeeRate(uint256 floor, uint256 ceiling, uint256 coverRatio)](#_getcoverfeerate)
- [getCoverFee(bytes32 key, uint256 coverDuration, uint256 amountToCover)](#getcoverfee)
- [_getCoverFee(bytes32 key, uint256 coverDuration, uint256 amountToCover)](#_getcoverfee)
- [getCoverPoolSummary(bytes32 key)](#getcoverpoolsummary)
- [getHarmonicMean(uint256 x, uint256 y, uint256 z)](#getharmonicmean)
- [version()](#version)
- [getName()](#getname)

### 

```js
function (IStore store) public nonpayable Recoverable 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore |  | 

### purchaseCover

Purchase cover for the specified amount. <br /> <br />
 When you purchase covers, you recieve equal amount of cTokens back.
 You need the cTokens to claim the cover when resolution occurs.
 Each unit of cTokens are fully redeemable at 1:1 ratio to the given
 stablecoins (like wxDai, DAI, USDC, or BUSD) based on the chain.

```js
function purchaseCover(bytes32 key, uint256 coverDuration, uint256 amountToCover) external nonpayable nonReentrant 
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key you wish to purchase the policy for | 
| coverDuration | uint256 | Enter the number of months to cover. Accepted values: 1-3. | 
| amountToCover | uint256 | Enter the amount of the stablecoin `liquidityToken` to cover. | 

### getCToken

```js
function getCToken(bytes32 key, uint256 coverDuration) public view
returns(cToken address, expiryDate uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| coverDuration | uint256 |  | 

### getCTokenByExpiryDate

```js
function getCTokenByExpiryDate(bytes32 key, uint256 expiryDate) external view
returns(cToken address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| expiryDate | uint256 |  | 

### _getCTokenOrDeploy

Gets the instance of cToken or deploys a new one based on the cover expiry timestamp

```js
function _getCTokenOrDeploy(bytes32 key, uint256 coverDuration) private nonpayable
returns(contract ICToken)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| coverDuration | uint256 | Enter the number of months to cover. Accepted values: 1-3. | 

### getExpiryDate

Gets the expiry date based on cover duration

```js
function getExpiryDate(uint256 today, uint256 coverDuration) public pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| today | uint256 | Enter the current timestamp | 
| coverDuration | uint256 | Enter the number of months to cover. Accepted values: 1-3. | 

### getCommitment

```js
function getCommitment(bytes32 ) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
|  | bytes32 |  | 

### getCoverable

```js
function getCoverable(bytes32 ) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
|  | bytes32 |  | 

### _getCoverFeeRate

Gets the harmonic mean rate of the given ratios. Stops/truncates at min/max values.

```js
function _getCoverFeeRate(uint256 floor, uint256 ceiling, uint256 coverRatio) private pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| floor | uint256 | The lowest cover fee rate | 
| ceiling | uint256 | The highest cover fee rate | 
| coverRatio | uint256 | Enter the ratio of the cover vs liquidity | 

### getCoverFee

Gets the cover fee info for the given cover key, duration, and amount

```js
function getCoverFee(bytes32 key, uint256 coverDuration, uint256 amountToCover) external view
returns(fee uint256, utilizationRatio uint256, totalAvailableLiquidity uint256, coverRatio uint256, floor uint256, ceiling uint256, rate uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| coverDuration | uint256 | Enter the number of months to cover. Accepted values: 1-3. | 
| amountToCover | uint256 | Enter the amount of the stablecoin `liquidityToken` to cover. | 

### _getCoverFee

Gets the cover fee info for the given cover key, duration, and amount

```js
function _getCoverFee(bytes32 key, uint256 coverDuration, uint256 amountToCover) private view
returns(fee uint256, utilizationRatio uint256, totalAvailableLiquidity uint256, coverRatio uint256, floor uint256, ceiling uint256, rate uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| coverDuration | uint256 | Enter the number of months to cover. Accepted values: 1-3. | 
| amountToCover | uint256 | Enter the amount of the stablecoin `liquidityToken` to cover. | 

### getCoverPoolSummary

Returns the values of the given cover key

```js
function getCoverPoolSummary(bytes32 key) external view
returns(_values uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

### getHarmonicMean

Returns the harmonic mean of the supplied values.

```js
function getHarmonicMean(uint256 x, uint256 y, uint256 z) public pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| x | uint256 |  | 
| y | uint256 |  | 
| z | uint256 |  | 

### version

Version number of this contract

```js
function version() external pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getName

Name of this contract

```js
function getName() public pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

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
* [CoverAssurance](CoverAssurance.md)
* [CoverBase](CoverBase.md)
* [CoverProvision](CoverProvision.md)
* [CoverStake](CoverStake.md)
* [CoverUtilV1](CoverUtilV1.md)
* [cToken](cToken.md)
* [cTokenFactory](cTokenFactory.md)
* [cTokenFactoryLibV1](cTokenFactoryLibV1.md)
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
* [ICoverAssurance](ICoverAssurance.md)
* [ICoverProvision](ICoverProvision.md)
* [ICoverStake](ICoverStake.md)
* [ICToken](ICToken.md)
* [ICTokenFactory](ICTokenFactory.md)
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
* [IStore](IStore.md)
* [IUniswapV2PairLike](IUniswapV2PairLike.md)
* [IUniswapV2RouterLike](IUniswapV2RouterLike.md)
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
* [SafeERC20](SafeERC20.md)
* [SafeMath](SafeMath.md)
* [Store](Store.md)
* [StoreBase](StoreBase.md)
* [StoreKeyUtil](StoreKeyUtil.md)
* [Strings](Strings.md)
* [ValidationLibV1](ValidationLibV1.md)
* [Vault](Vault.md)
* [VaultBase](VaultBase.md)
* [VaultFactory](VaultFactory.md)
* [VaultFactoryLibV1](VaultFactoryLibV1.md)
* [VaultLibV1](VaultLibV1.md)
* [Witness](Witness.md)
