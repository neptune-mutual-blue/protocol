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

```js
function calculatePods(address pod, address stablecoin, uint256 liquidityToAdd) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| pod | address |  | 
| stablecoin | address |  | 
| liquidityToAdd | uint256 |  | 

### calculateLiquidity

Calculates the amount of liquidity to transfer for the given amount of PODs to burn

```js
function calculateLiquidity(address pod, address stablecoin, uint256 podsToBurn) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| pod | address |  | 
| stablecoin | address |  | 
| podsToBurn | uint256 |  | 

### redeemPods

Internal function to redeem pods by burning. <br /> <br />
 **How Does This Work?**
 Transfer PODs --> This Contract --> Burn the PODs
 This Contract --> Transfers Your Share of Liquidity Tokens

```js
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

### addLiquidity

Adds liquidity to the specified cover contract

```js
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

### removeLiquidity

Removes liquidity from the specified cover contract

```js
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
* [IGovernance](IGovernance.md)
* [IMember](IMember.md)
* [IPausable](IPausable.md)
* [IPolicy](IPolicy.md)
* [IPolicyAdmin](IPolicyAdmin.md)
* [IPriceDiscovery](IPriceDiscovery.md)
* [IProtocol](IProtocol.md)
* [IReporter](IReporter.md)
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
