# Neptune Mutual Covers

![Decentralized Autonomous Cover Organization](./files/dao.png)

## Contract Creators

Anyone who has NEP tokens can create a cover contract. To avoid spam, questionable, and confusing cover contracts, a creator has to burn 1000 NEP tokens. Additionally, the contract creator also needs to stake 4000 NEP tokens or more. The higher the sake, the more visibility the contract gets if there are multiple cover contracts with the same name or similar terms.

### Rewards

The contract creator will earn a steady income of 1% of all cover fees paid by the users. Initial contract creators will also earn additional 1% of the cover fees in NEP.


**About Reporting Questionable or Invalid Contracts**

The governance system allows NEP holders to vote to invalidate and remove any cover contract.

- The staked NEP tokens of the contract creator will be burned.
- The users having non-expired covers can withdraw their cover fee.
- The liquidity providers can withdraw their staked NEP tokens, stable-coins, and cover fees.

## Liquidity Providers

The liquidity providers can evaluate a cover contract and ensure that it is up to their satisfaction. One can then provide liquidity in BUSD or other supported cryptocurrency. A liquidity provider needs to also stake 250 NEP or higher.

### Farming Strategy

To maximize return on investment, 25% of the idle/uncovered assets in the liquidity pool is supplied to Venus Protocol for lending. The interest received on loan is capitalized back into the liquidity pool, shared amongst all liquidity providers. The platform will deduct 2% of the profit generated to purchase (and burn) NEP tokens from decentralized exchange(s).

> This feature will be available starting from the Neptune Mutual Protocol v2.

### Cover Fees

The liquidity providers collectively earn cover fees paid by the platform users. Initial liquidity provider will receive additional 10% rewards in NEP tokens.





[comment]: #solidoc (Start)
# Cover Contract (Cover.sol)

View Source: [contracts/core/lifecycle/Cover.sol](/contracts/core/lifecycle/Cover.sol)

**↗ Extends: [CoverBase](docs/CoverBase.md)**

**Cover**

The cover contract facilitates you create and update covers

## Functions

- [constructor(IStore store)](#)
- [updateCover(bytes32 key, bytes32 info)](#updatecover)
- [addCover(bytes32 key, bytes32 info, uint256 stakeWithFee, address assuranceToken, uint256 initialAssuranceAmount, uint256 initialLiquidity)](#addcover)
- [_addCover(bytes32 key, bytes32 info, uint256 fee, address assuranceToken)](#_addcover)
- [_validateAndGetFee(bytes32 key, bytes32 info, uint256 stakeWithFee)](#_validateandgetfee)

### 

Constructs this contract

```js
function (IStore store) public nonpayable CoverBase 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore | Enter the store | 

### updateCover

Updates the cover contract.
 This feature is accessible only to the cover owner or protocol owner (governance).

```js
function updateCover(bytes32 key, bytes32 info) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| info | bytes32 | Enter a new IPFS URL to update | 

### addCover

Adds a new coverage pool or cover contract.
 To add a new cover, you need to pay cover creation fee
 and stake minimum amount of NEP in the Vault. <br /> <br />
 Through the governance portal, projects will be able redeem
 the full cover fee at a later date. <br /> <br />
 **Apply for Fee Redemption** <br />
 https://docs.neptunemutual.com/covers/cover-fee-redemption <br /><br />
 As the cover creator, you will earn a portion of all cover fees
 generated in this pool. <br /> <br />
 Read the documentation to learn more about the fees: <br />
 https://docs.neptunemutual.com/covers/contract-creators

```js
function addCover(bytes32 key, bytes32 info, uint256 stakeWithFee, address assuranceToken, uint256 initialAssuranceAmount, uint256 initialLiquidity) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter a unique key for this cover | 
| info | bytes32 | IPFS info of the cover contract | 
| stakeWithFee | uint256 | Enter the total NEP amount (stake + fee) to transfer to this contract. | 
| assuranceToken | address | **Optional.** Token added as an assurance of this cover. <br /><br />  Assurance tokens can be added by a project to demonstrate coverage support  for their own project. This helps bring the cover fee down and enhances  liquidity provider confidence. Along with the NEP tokens, the assurance tokens are rewarded  as a support to the liquidity providers when a cover incident occurs. | 
| initialAssuranceAmount | uint256 | **Optional.** Enter the initial amount of  assurance tokens you'd like to add to this pool. | 
| initialLiquidity | uint256 | **Optional.** Enter the initial stablecoin liquidity for this cover. | 

### _addCover

```js
function _addCover(bytes32 key, bytes32 info, uint256 fee, address assuranceToken) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter a unique key for this cover | 
| info | bytes32 | IPFS info of the cover contract | 
| fee | uint256 | Fee paid to create this cover | 
| assuranceToken | address | **Optional.** Token added as an assurance of this cover. | 

### _validateAndGetFee

Validation checks before adding a new cover

```js
function _validateAndGetFee(bytes32 key, bytes32 info, uint256 stakeWithFee) private view
returns(uint256)
```

**Returns**

Returns fee required to create a new cover

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| info | bytes32 |  | 
| stakeWithFee | uint256 |  | 

## Contracts

* [Address](docs/Address.md)
* [BokkyPooBahsDateTimeLibrary](docs/BokkyPooBahsDateTimeLibrary.md)
* [Commission](docs/Commission.md)
* [Context](docs/Context.md)
* [Controller](docs/Controller.md)
* [Cover](docs/Cover.md)
* [CoverAssurance](docs/CoverAssurance.md)
* [CoverBase](docs/CoverBase.md)
* [CoverProvision](docs/CoverProvision.md)
* [CoverStake](docs/CoverStake.md)
* [CoverUtilV1](docs/CoverUtilV1.md)
* [cToken](docs/cToken.md)
* [cTokenFactory](docs/cTokenFactory.md)
* [Destroyable](docs/Destroyable.md)
* [ERC20](docs/ERC20.md)
* [FakeStore](docs/FakeStore.md)
* [FakeToken](docs/FakeToken.md)
* [Governance](docs/Governance.md)
* [ICommission](docs/ICommission.md)
* [ICover](docs/ICover.md)
* [ICoverAssurance](docs/ICoverAssurance.md)
* [ICoverProvision](docs/ICoverProvision.md)
* [ICoverStake](docs/ICoverStake.md)
* [ICToken](docs/ICToken.md)
* [ICTokenFactory](docs/ICTokenFactory.md)
* [IERC20](docs/IERC20.md)
* [IERC20Metadata](docs/IERC20Metadata.md)
* [IMember](docs/IMember.md)
* [IPolicy](docs/IPolicy.md)
* [IPolicyAdmin](docs/IPolicyAdmin.md)
* [IPriceDiscovery](docs/IPriceDiscovery.md)
* [IProtocol](docs/IProtocol.md)
* [IStore](docs/IStore.md)
* [IVault](docs/IVault.md)
* [IVaultFactory](docs/IVaultFactory.md)
* [MaliciousToken](docs/MaliciousToken.md)
* [Migrations](docs/Migrations.md)
* [NTransferUtilV2](docs/NTransferUtilV2.md)
* [NTransferUtilV2Intermediate](docs/NTransferUtilV2Intermediate.md)
* [Ownable](docs/Ownable.md)
* [Pausable](docs/Pausable.md)
* [Policy](docs/Policy.md)
* [PolicyAdmin](docs/PolicyAdmin.md)
* [PolicyManager](docs/PolicyManager.md)
* [PriceDiscovery](docs/PriceDiscovery.md)
* [Protocol](docs/Protocol.md)
* [ProtoUtilV1](docs/ProtoUtilV1.md)
* [Recoverable](docs/Recoverable.md)
* [ReentrancyGuard](docs/ReentrancyGuard.md)
* [SafeERC20](docs/SafeERC20.md)
* [SafeMath](docs/SafeMath.md)
* [Store](docs/Store.md)
* [StoreBase](docs/StoreBase.md)
* [StoreKeyUtil](docs/StoreKeyUtil.md)
* [Vault](docs/Vault.md)
* [VaultFactory](docs/VaultFactory.md)
* [VaultPod](docs/VaultPod.md)
* [Witness](docs/Witness.md)

[comment]: #solidoc (End)