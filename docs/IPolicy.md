# IPolicy.sol

View Source: [contracts/interfaces/IPolicy.sol](../contracts/interfaces/IPolicy.sol)

**↗ Extends: [IMember](IMember.md)**
**↘ Derived Contracts: [Policy](Policy.md)**

**IPolicy**

## Functions

- [purchaseCover(bytes32 key, uint256 coverDuration, uint256 amountToCover)](#purchasecover)
- [getCoverFee(bytes32 key, uint256 coverDuration, uint256 amountToCover)](#getcoverfee)
- [getCoverPoolSummary(bytes32 key)](#getcoverpoolsummary)
- [getCxToken(bytes32 key, uint256 coverDuration)](#getcxtoken)
- [getCxTokenByExpiryDate(bytes32 key, uint256 expiryDate)](#getcxtokenbyexpirydate)
- [getCommitment(bytes32 key)](#getcommitment)
- [getCoverable(bytes32 key)](#getcoverable)
- [getExpiryDate(uint256 today, uint256 coverDuration)](#getexpirydate)

### purchaseCover

Purchase cover for the specified amount. <br /> <br />
 When you purchase covers, you recieve equal amount of cxTokens back.
 You need the cxTokens to claim the cover when resolution occurs.
 Each unit of cxTokens are fully redeemable at 1:1 ratio to the given
 stablecoins (like wxDai, DAI, USDC, or BUSD) based on the chain.

```solidity
function purchaseCover(bytes32 key, uint256 coverDuration, uint256 amountToCover) external nonpayable
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key you wish to purchase the policy for | 
| coverDuration | uint256 | Enter the number of months to cover. Accepted values: 1-3. | 
| amountToCover | uint256 | Enter the amount of the stablecoin `liquidityToken` to cover. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function purchaseCover(
    bytes32 key,
    uint256 coverDuration,
    uint256 amountToCover
  ) external returns (address);
```
</details>

### getCoverFee

Gets the cover fee info for the given cover key, duration, and amount

```solidity
function getCoverFee(bytes32 key, uint256 coverDuration, uint256 amountToCover) external view
returns(fee uint256, utilizationRatio uint256, totalAvailableLiquidity uint256, coverRatio uint256, floor uint256, ceiling uint256, rate uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| coverDuration | uint256 | Enter the number of months to cover. Accepted values: 1-3. | 
| amountToCover | uint256 | Enter the amount of the stablecoin `liquidityToken` to cover. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverFee(
    bytes32 key,
    uint256 coverDuration,
    uint256 amountToCover
  )
    external
    view
    returns (
      uint256 fee,
      uint256 utilizationRatio,
      uint256 totalAvailableLiquidity,
      uint256 coverRatio,
      uint256 floor,
      uint256 ceiling,
      uint256 rate
    );
```
</details>

### getCoverPoolSummary

Returns the values of the given cover key

```solidity
function getCoverPoolSummary(bytes32 key) external view
returns(_values uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverPoolSummary(bytes32 key) external view returns (uint256[] memory _values);
```
</details>

### getCxToken

```solidity
function getCxToken(bytes32 key, uint256 coverDuration) external view
returns(cxToken address, expiryDate uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| coverDuration | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCxToken(bytes32 key, uint256 coverDuration) external view returns (address cxToken, uint256 expiryDate);
```
</details>

### getCxTokenByExpiryDate

```solidity
function getCxTokenByExpiryDate(bytes32 key, uint256 expiryDate) external view
returns(cxToken address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| expiryDate | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCxTokenByExpiryDate(bytes32 key, uint256 expiryDate) external view returns (address cxToken);
```
</details>

### getCommitment

```solidity
function getCommitment(bytes32 key) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCommitment(bytes32 key) external view returns (uint256);
```
</details>

### getCoverable

```solidity
function getCoverable(bytes32 key) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCoverable(bytes32 key) external view returns (uint256);
```
</details>

### getExpiryDate

Gets the expiry date based on cover duration

```solidity
function getExpiryDate(uint256 today, uint256 coverDuration) external pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| today | uint256 | Enter the current timestamp | 
| coverDuration | uint256 | Enter the number of months to cover. Accepted values: 1-3. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getExpiryDate(uint256 today, uint256 coverDuration) external pure returns (uint256);
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
