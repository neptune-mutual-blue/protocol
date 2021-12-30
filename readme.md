## Neptune Mutual Cover

![Protocol](./files/protocol.png)

Anyone who has NPM tokens can create a cover contract. To avoid spam, questionable, and confusing cover contracts, a creator has to burn 1000 NPM tokens. Additionally, the contract creator also needs to stake 4000 NPM tokens or more. The higher the sake, the more visibility the contract gets if there are multiple cover contracts with the same name or similar terms.

[Read More](https://docs.neptunemutual.com/sdk/quickstart)

[comment]: #solidoc Start
# Cover Contract (Cover.sol)

View Source: [contracts/core/lifecycle/Cover.sol](/contracts/core/lifecycle/Cover.sol)

**↗ Extends: [CoverBase](docs/CoverBase.md)**

**Cover**

The cover contract facilitates you create and update covers

## Functions

- [constructor(IStore store)](#)
- [updateCover(bytes32 key, bytes32 info)](#updatecover)
- [addCover(bytes32 key, bytes32 info, uint256 minStakeToReport, uint256 reportingPeriod, uint256 stakeWithFee, address reassuranceToken, uint256 initialReassuranceAmount, uint256 initialLiquidity)](#addcover)
- [_addCover(bytes32 key, bytes32 info, uint256 minStakeToReport, uint256 reportingPeriod, uint256 fee, address reassuranceToken)](#_addcover)
- [_validateAndGetFee(bytes32 key, bytes32 info, uint256 stakeWithFee)](#_validateandgetfee)
- [updateWhitelist(address account, bool status)](#updatewhitelist)
- [checkIfWhitelisted(address account)](#checkifwhitelisted)

### 

Constructs this contract

```solidity
function (IStore store) public nonpayable CoverBase 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| store | IStore | Enter the store | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
constructor(IStore store) CoverBase(store) {}
```
</details>

### updateCover

Updates the cover contract.
 This feature is accessible only to the cover owner or protocol owner (governance).

```solidity
function updateCover(bytes32 key, bytes32 info) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter the cover key | 
| info | bytes32 | Enter a new IPFS URL to update | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateCover(bytes32 key, bytes32 info) external override nonReentrant {
    s.mustNotBePaused();
    s.mustBeValidCover(key);

    if (AccessControlLibV1.hasAccess(s, AccessControlLibV1.NS_ROLES_ADMIN, msg.sender) == false) {
      s.mustBeCoverOwner(key, msg.sender);
    }

    require(s.getBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, key) != info, "Duplicate content");

    s.setBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, key, info);
    emit CoverUpdated(key, info);
  }
```
</details>

### addCover

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
function addCover(bytes32 key, bytes32 info, uint256 minStakeToReport, uint256 reportingPeriod, uint256 stakeWithFee, address reassuranceToken, uint256 initialReassuranceAmount, uint256 initialLiquidity) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter a unique key for this cover | 
| info | bytes32 | IPFS info of the cover contract | 
| minStakeToReport | uint256 | A cover creator can override default min NPM stake to avoid spam reports | 
| reportingPeriod | uint256 | The period during when reporting happens. | 
| stakeWithFee | uint256 | Enter the total NPM amount (stake + fee) to transfer to this contract. | 
| reassuranceToken | address | **Optional.** Token added as an reassurance of this cover. <br /><br />  Reassurance tokens can be added by a project to demonstrate coverage support  for their own project. This helps bring the cover fee down and enhances  liquidity provider confidence. Along with the NPM tokens, the reassurance tokens are rewarded  as a support to the liquidity providers when a cover incident occurs. | 
| initialReassuranceAmount | uint256 | **Optional.** Enter the initial amount of  reassurance tokens you'd like to add to this pool. | 
| initialLiquidity | uint256 | **Optional.** Enter the initial stablecoin liquidity for this cover. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addCover(
    bytes32 key,
    bytes32 info,
    uint256 minStakeToReport,
    uint256 reportingPeriod,
    uint256 stakeWithFee,
    address reassuranceToken,
    uint256 initialReassuranceAmount,
    uint256 initialLiquidity
  ) external override nonReentrant {
    // @suppress-acl Can only be called by a whitelisted address
    // @suppress-acl Marking this as publicly accessible
    s.mustNotBePaused();
    s.senderMustBeWhitelisted();

    require(minStakeToReport >= s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE), "Min NPM stake too low");
    require(reassuranceToken == s.getStablecoin(), "Invalid reassurance token");
    require(reportingPeriod >= 7 days, "Insufficient reporting period");

    // First validate the information entered
    uint256 fee = _validateAndGetFee(key, info, stakeWithFee);

    // Set the basic cover info
    _addCover(key, info, minStakeToReport, reportingPeriod, fee, reassuranceToken);

    // Stake the supplied NPM tokens and burn the fees
    s.getStakingContract().increaseStake(key, msg.sender, stakeWithFee, fee);

    // Add cover reassurance
    if (initialReassuranceAmount > 0) {
      s.getReassuranceContract().addReassurance(key, msg.sender, initialReassuranceAmount);
    }

    // Add initial liquidity
    if (initialLiquidity > 0) {
      IVault vault = s.getVault(key);

      s.getVault(key).addLiquidityInternal(key, msg.sender, initialLiquidity);

      // Transfer liquidity only after minting the pods
      IERC20(s.getStablecoin()).ensureTransferFrom(msg.sender, address(vault), initialLiquidity);
    }

    emit CoverCreated(key, info, stakeWithFee, initialLiquidity);
  }
```
</details>

### _addCover

```solidity
function _addCover(bytes32 key, bytes32 info, uint256 minStakeToReport, uint256 reportingPeriod, uint256 fee, address reassuranceToken) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 | Enter a unique key for this cover | 
| info | bytes32 | IPFS info of the cover contract | 
| minStakeToReport | uint256 |  | 
| reportingPeriod | uint256 | The period during when reporting happens. | 
| fee | uint256 | Fee paid to create this cover | 
| reassuranceToken | address | **Optional.** Token added as an reassurance of this cover. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _addCover(
    bytes32 key,
    bytes32 info,
    uint256 minStakeToReport,
    uint256 reportingPeriod,
    uint256 fee,
    address reassuranceToken
  ) private {
    // Add a new cover
    s.setBoolByKeys(ProtoUtilV1.NS_COVER, key, true);

    // Set cover owner
    s.setAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, key, msg.sender);

    // Set cover info
    s.setBytes32ByKeys(ProtoUtilV1.NS_COVER_INFO, key, info);
    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_PERIOD, key, reportingPeriod);
    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, key, minStakeToReport);

    // Set reassurance token
    s.setAddressByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_TOKEN, key, reassuranceToken);

    // s.setUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_WEIGHT, key, 500000000 gwei); // Default 50% weight
    s.setUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_WEIGHT, key, 1 ether); // 100% weight because it's a stablecoin

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
function _validateAndGetFee(bytes32 key, bytes32 info, uint256 stakeWithFee) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| key | bytes32 |  | 
| info | bytes32 |  | 
| stakeWithFee | uint256 |  | 

**Returns**

Returns fee required to create a new cover

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _validateAndGetFee(
    bytes32 key,
    bytes32 info,
    uint256 stakeWithFee
  ) private view returns (uint256) {
    require(info > 0, "Invalid info");
    (uint256 fee, uint256 minStake) = s.getCoverFee();

    require(stakeWithFee > fee + minStake, "NPM Insufficient");
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, key) == false, "Already exists");

    return fee;
  }
```
</details>

### updateWhitelist

```solidity
function updateWhitelist(address account, bool status) external nonpayable nonReentrant 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| account | address |  | 
| status | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateWhitelist(address account, bool status) external override nonReentrant {
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeCoverManager(s);

    s.setAddressBooleanByKey(ProtoUtilV1.NS_COVER_WHITELIST, account, status);

    emit WhitelistUpdated(account, status);
  }
```
</details>

### checkIfWhitelisted

```solidity
function checkIfWhitelisted(address account) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| account | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function checkIfWhitelisted(address account) external view override returns (bool) {
    return s.getAddressBooleanByKey(ProtoUtilV1.NS_COVER_WHITELIST, account);
  }
```
</details>

## Contracts

* [AccessControl](docs/AccessControl.md)
* [AccessControlLibV1](docs/AccessControlLibV1.md)
* [Address](docs/Address.md)
* [BaseLibV1](docs/BaseLibV1.md)
* [BokkyPooBahsDateTimeLibrary](docs/BokkyPooBahsDateTimeLibrary.md)
* [Context](docs/Context.md)
* [Controller](docs/Controller.md)
* [Cover](docs/Cover.md)
* [CoverBase](docs/CoverBase.md)
* [CoverProvision](docs/CoverProvision.md)
* [CoverReassurance](docs/CoverReassurance.md)
* [CoverStake](docs/CoverStake.md)
* [CoverUtilV1](docs/CoverUtilV1.md)
* [cxToken](docs/cxToken.md)
* [cxTokenFactory](docs/cxTokenFactory.md)
* [cxTokenFactoryLibV1](docs/cxTokenFactoryLibV1.md)
* [Destroyable](docs/Destroyable.md)
* [ERC165](docs/ERC165.md)
* [ERC20](docs/ERC20.md)
* [FakeRecoverable](docs/FakeRecoverable.md)
* [FakeStore](docs/FakeStore.md)
* [FakeToken](docs/FakeToken.md)
* [FakeUniswapV2RouterLike](docs/FakeUniswapV2RouterLike.md)
* [Finalization](docs/Finalization.md)
* [Governance](docs/Governance.md)
* [GovernanceUtilV1](docs/GovernanceUtilV1.md)
* [IAccessControl](docs/IAccessControl.md)
* [IClaimsProcessor](docs/IClaimsProcessor.md)
* [ICommission](docs/ICommission.md)
* [ICover](docs/ICover.md)
* [ICoverProvision](docs/ICoverProvision.md)
* [ICoverReassurance](docs/ICoverReassurance.md)
* [ICoverStake](docs/ICoverStake.md)
* [ICxToken](docs/ICxToken.md)
* [ICxTokenFactory](docs/ICxTokenFactory.md)
* [IERC165](docs/IERC165.md)
* [IERC20](docs/IERC20.md)
* [IERC20Metadata](docs/IERC20Metadata.md)
* [IFinalization](docs/IFinalization.md)
* [IGovernance](docs/IGovernance.md)
* [IMember](docs/IMember.md)
* [IPausable](docs/IPausable.md)
* [IPolicy](docs/IPolicy.md)
* [IPolicyAdmin](docs/IPolicyAdmin.md)
* [IPriceDiscovery](docs/IPriceDiscovery.md)
* [IProtocol](docs/IProtocol.md)
* [IReporter](docs/IReporter.md)
* [IResolution](docs/IResolution.md)
* [IResolvable](docs/IResolvable.md)
* [IStore](docs/IStore.md)
* [IUniswapV2PairLike](docs/IUniswapV2PairLike.md)
* [IUniswapV2RouterLike](docs/IUniswapV2RouterLike.md)
* [IUnstakable](docs/IUnstakable.md)
* [IVault](docs/IVault.md)
* [IVaultFactory](docs/IVaultFactory.md)
* [IWitness](docs/IWitness.md)
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
* [Processor](docs/Processor.md)
* [ProtoBase](docs/ProtoBase.md)
* [Protocol](docs/Protocol.md)
* [ProtoUtilV1](docs/ProtoUtilV1.md)
* [Recoverable](docs/Recoverable.md)
* [ReentrancyGuard](docs/ReentrancyGuard.md)
* [RegistryLibV1](docs/RegistryLibV1.md)
* [Reporter](docs/Reporter.md)
* [Resolution](docs/Resolution.md)
* [Resolvable](docs/Resolvable.md)
* [SafeERC20](docs/SafeERC20.md)
* [SafeMath](docs/SafeMath.md)
* [Store](docs/Store.md)
* [StoreBase](docs/StoreBase.md)
* [StoreKeyUtil](docs/StoreKeyUtil.md)
* [Strings](docs/Strings.md)
* [Unstakable](docs/Unstakable.md)
* [ValidationLibV1](docs/ValidationLibV1.md)
* [Vault](docs/Vault.md)
* [VaultBase](docs/VaultBase.md)
* [VaultFactory](docs/VaultFactory.md)
* [VaultFactoryLibV1](docs/VaultFactoryLibV1.md)
* [VaultLibV1](docs/VaultLibV1.md)
* [Witness](docs/Witness.md)

[comment]: #solidoc End
