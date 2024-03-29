# Neptune Mutual Protocol Security

## Bug Bounty Program (Protocol)

Will be made public upon the conclusion of our first round of protocol audit.

## Bug Bounty Program (Web App)

Will be announced upon the conclusion of our internal security investigation and penetration test by a third party.

## Walker

```
yarn build:clean
yarn walk
```

The walker script analyzes all smart contracts, validates, and reports the following issues:

- Functions not implementing `acl`
- Function not implementing `non reentrancy`
- Function not detecting or working with the `pausable` state
- Untrusted address arguments being used
- Untrusted ERC20 arguments being used
- An initialization without `acl`
- An incomplete function with `revert("Not implemented")` statement.
- All revert statements are logged
- Potentially incorrect usage of substraction. Subtractions may (and most likely can) lead to integer underflow issues (example, when withdrawals are greater than deposits). All subtractions are logged.
- Todo statements.

## Documentation

```
yarn gendoc
```

[Creates Documentation](blob/develop/docs/CoverBase.md)

## Access Control

**Permission**

The deployer receives the greatest level of access automatically. Subsequent access is granted based on the protocol's operational team's authority and technical expertise.

- Assign roles to multiple trusted authorities which must be
  - distributed (not necessarily decentralized)
  - hardware-based EOA (not multi-sig contracts)
- Upon completion of the above ☝️, transfer ownership to a different cold storage wallet

Take note that the protocol's access control policy is subject to change at our discretion.

### Access Levels

**Low**

A low-access level role can create very little impact on our smart contracts. An attacker obtaining this level of access will not be able to compromise the system, but may nevertheless create an inconvenience.

**Moderate**

A moderate-access level role, if compromised, may modify many protocol configuration settings. This level of access, even in the event of compromise, should only affect modified configurations.

**High**

A role with a high level of access, if compromised, will be able to attack the protocol and drain funds while affecting only the extent of acquired access.

**Critical**

Critical access level roles can not only attack the protocol, they can also change the underlying logic of one or more protocol members.

| Role                       | Level    | Description                                                                                                                                                                                                                                                      |
| -------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NS_ROLES_ADMIN             | Critical | Same as DEFAULT_ADMIN role.                                                                                                                                                                                                                                      |
| NS_ROLES_COVER_MANAGER     | Moderate | Cover managers can set cover configuration parameters.                                                                                                                                                                                                           |
| NS_ROLES_LIQUIDITY_MANAGER | Moderate | Liquidity managers can configure liquidity pool configuration.                                                                                                                                                                                                   |
| NS_ROLES_GOVERNANCE_AGENT  | High     | A governance agent can resolve and finalize covers undergoing reporting .                                                                                                                                                                                        |
| NS_ROLES_GOVERNANCE_ADMIN  | Critical | Governance admin can perform emergency resolution.                                                                                                                                                                                                               |
| NS_ROLES_UPGRADE_AGENT     | Critical | Upgrade agents are allowed to upgrade the protocol.                                                                                                                                                                                                              |
| NS_ROLES_RECOVERY_AGENT    | Critical | Recovery agents [may be recover accidentally-sent ERC-20 tokens and Ether](https://docs.neptunemutual.com/usage/recovering-cryptocurrencies) from smart contracts. Reach out to us on our [Telegram Chat](https://t.me/neptunemutualchat) to recover your funds. |
| NS_ROLES_PAUSE_AGENT       | Low      | Pause Agents can pause the protocol.                                                                                                                                                                                                                             |
| NS_ROLES_UNPAUSE_AGENT     | Critical | Unpause Agents can unpause the protocol.                                                                                                                                                                                                                         |


### NS_ROLES_ADMIN

* setupRole
* initialize (Protocol)

### NS_ROLES_COVER_MANAGER

* setClaimPeriod
* setBlacklist
* setFirstReportingStake
* setReportingBurnRate
* setReporterCommission
* updateCover
* updateProduct
* disablePolicy
* updateCoverCreatorWhitelist
* initialize (Cover)
* setCoverCreationFee
* setMinCoverCreationStake
* setMinStakeToAddLiquidity
* setPolicyRatesByKey
* setCoverageLag


### NS_ROLES_LIQUIDITY_MANAGER

* accrueInterestImplementation
* setWeight (Reassurance)
* capitalizePool (Reassurance)
* addStrategies
* setLiquidityStateUpdateInterval
* disableStrategy
* deleteStrategy
* setRiskPoolingPeriods
* setMaxLendingRatio
* setup (Bond Pool)
* addOrEditPool (Staking Pools)
* closePool (Staking Pools)


### NS_ROLES_GOVERNANCE_AGENT

* finalize
* resolve

### NS_ROLES_GOVERNANCE_ADMIN

* emergencyResolve
* configureCoolDownPeriod
* closeReport

### NS_ROLES_UPGRADE_AGENT

* addMember
* removeMember
* addContractWithKey
* upgradeContractWithKey

### NS_ROLES_RECOVERY_AGENT

* recoverEther
* recoverToken


## Solidity Rules

[SWC Registry](https://swcregistry.io/)

# Gas Optimization

Please note that we value simplicity, safety, and a good developer experience over gas optimization. We want to make our codebase simpler or easier to understand, rather than using a few tips to save gas. If something is easy to understand, easy to maintain, and functions as intended, it does not need to be optimized.

## Do Not Trust ERC-20 Contract Addresses

Do not trust ERC-20 addresses that are supplied by users. Verify your intended use and be sure to validate all ERC-20 operations.

```solidity
using NTransferUtilV2 for IERC20;

function claim(address cxToken, bytes32 key, bytes32 incidentDate, uint256 amount) {
  // ...
  // @suppress-malicious-erc20 The ERC-20 operation on the address `cxToken`
  // is validated using the `NTransferUtilV2` library
  IERC20(**cxToken**).ensureTransferFrom(msg.sender, address(this), amount);
  // validate ☝️ `cxToken` address
}
```

Document the usage of ERC-20 operation using `@suppress-malicious-erc20` comment decorator. When you document how you are using ERC-20 feature inside a code block, the `walk` script then marks your usage as checked and therefore does not produce any warning.

Ensure that you use `ensureTransfer` and `ensureTransferFrom` of `NTransferUtilV2` library instead of directly calling `transfer` and `transferFrom` on an ERC-20 contract.

## Do Not Trust User-Supplied Addresses

The function `initialize` accepts an argument value `liquidityToken` which is stored as an address, to be used later.

```solidity
/**
 * @dev Initializes this contract
 * @param liquidityToken Provide the address of the token this cover will be quoted against.
 * @param liquidityName Enter a description or ENS name of your liquidity token.
 *
 */
function initialize(address liquidityToken, bytes32 liquidityName)
  external
  override
  nonReentrant
{
  // ...
  s.setAddressByKey(ProtoUtilV1.CNS_COVER_STABLECOIN, liquidityToken);
  s.setBytes32ByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_NAME, liquidityName);

  emit CoverInitialized(liquidityToken, liquidityName);
}

```

Note that the `liquidityToken` although being an address type will later be used as an ERC-20 contract inside other functions. More often than not, addresses are boxed as contracts or interfaces. It is, therefore, extremely crucial for a developer to be very intentional about saving addresses into the state. Use the comment decorator `@suppress-address-trust-issue` and explain how exactly do you intend to use an address variable inside a function and elsewhere.

**Revise the above to:**

```solidity
/**
 * @dev Initializes this contract
 * @param liquidityToken Provide the address of the token this cover will be quoted against.
 * @param liquidityName Enter a description or ENS name of your liquidity token.
 *
 */
function initialize(address liquidityToken, bytes32 liquidityName)
  external
  override
  nonReentrant
{
  // ...
  // @suppress-address-trust-issue The `liquidityToken` value can be trusted
  // because only a cover manager can access this function.

  // @note: also ensured that each ERC-20 instance of `liquidityToken`
  // being used elsewhere uses `NTransferUtilV2` library features.

  s.setAddressByKey(ProtoUtilV1.CNS_COVER_STABLECOIN, liquidityToken);
  s.setBytes32ByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_NAME, liquidityName);

  emit CoverInitialized(liquidityToken, liquidityName);
}

```

## Access Control

Any publicy-accessible function that changes the state must have access control logic. If access control is not required, use the comment decorator `@suppress-acl` to explain it's not needed.

```solidity
function addCover(bytes32 key) external override nonReentrant {
  // @suppress-acl Marking this as publicly accessible
  s.mustNotBePaused();
  s.senderMustBeWhitelisted();
  // ...
}

```

## Non Reentrancy

Please note that (nearly) all of the Neptune Mutual contracts are dependent on (or indirectly call) an (or the the-then) implementation of an `IProtocol` contract. Although it is highly unlikely that an IProtocol will `re-enter` into contract calls today, it is best to always use `nonReentrant` modifier provided by Open Zeppelin for future cases because of upgradeable nature of the Neptune Mutual protocol. While it may be a bit expensive gas wise, **any publicy-accessible function that changes the state must have the `nonReentrancy` modifier**.

```solidity
function addCover(bytes32 key) external override nonReentrant { // ...}

```

## Pausability

Any publicy-accessible function that changes the state must have `pausable` logic. If pausable is not required, use the comment decorator `@suppress-pausable` to suppress it.

```solidity
function addCover(bytes32 key) external override nonReentrant {
  s.mustNotBePaused();
  // ...
}

```

## Initialization

All initialize either must have an access control logic or should explain why that is not needed using the comment decorator `@suppress-initialization`.

```solidity
function initialize(address[] memory addresses, uint256[] memory values)
  external
  override
  nonReentrant
{
  // @suppress-initialization Can only be initialized once by the deployer
  s.mustBeProtocolMember(msg.sender);

  // ...
}

```

## Incorrect Subtraction

Check out the following code:

```solidity
function getAmountInAave(address dai) external view returns (uint256) {
  uint256 deposits = _getAaveDeposits(dai);
  uint256 withdrawals = _getAaveWithdrawals(dai);

  return deposits - withdrawals;
}

```

At first glance, the above function looks correct. **But, wouldn't withdrawals be greater than deposits (because of interest earnings)?** Change the implementation to avoid using subtraction:

```solidity
function getAmountsInAave(address dai)
  external
  view
  returns (uint256 deposits, uint256 withdrawals)
{
  deposits = _getAaveDeposits(dai);
  withdrawals = _getAaveWithdrawals(dai);
}

```

If you still need to subtract, always document your usage of subtraction using `@suppress-subtraction` comment decorator and explain why it would not underflow (or revert).

## [List of Events & Associated Risk Level](events.md)

## Other

- `yarn test` - runs solidity tests
- `yarn stories` - runs solidity behavior-driven tests or stories
- `yarn coverage` - runs tests and produces a coverage report
- `yarn slither` - runs the slither static code analysis tool
- `yarn deploy` - deploys the protocol to the hardhat network
- `yarn deploy:kovan` - deploys the protocol to the Kovan test network
