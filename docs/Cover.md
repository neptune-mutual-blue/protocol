# Cover Contract (Cover.sol)

View Source: [contracts/core/lifecycle/Cover.sol](../contracts/core/lifecycle/Cover.sol)

**↗ Extends: [CoverBase](CoverBase.md)**

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

* [AccessControl](AccessControl.md)
* [AccessControlLibV1](AccessControlLibV1.md)
* [Address](Address.md)
* [BaseLibV1](BaseLibV1.md)
* [BokkyPooBahsDateTimeLibrary](BokkyPooBahsDateTimeLibrary.md)
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
