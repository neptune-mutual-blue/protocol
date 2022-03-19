| Contract               | Events                       | Roles                             |
| ---------------------- | ---------------------------- | --------------------------------- |
| IBondPool.json         | BondClaimed                  | Any                               |
| IBondPool.json         | BondCreated                  | Any                               |
| IBondPool.json         | BondPoolSetup                | NS_ROLES_ADMIN                    |
| IClaimsProcessor.json  | ClaimPeriodSet               | NS_ROLES_COVER_MANAGER            |
| IClaimsProcessor.json  | Claimed                      | Any                               |
| ICover.json            | CoverCreated                 | Any (Whitelisted)                 |
| ICover.json            | CoverCreatorWhitelistUpdated | NS_ROLES_COVER_MANAGER            |
| ICover.json            | CoverFeeSet                  | NS_ROLES_COVER_MANAGER            |
| ICover.json            | CoverInitialized             | NS_ROLES_COVER_MANAGER            |
| ICover.json            | CoverStopped                 | NS_ROLES_GOVERNANCE_ADMIN         |
| ICover.json            | CoverUpdated                 | Cover Owner or NS_ROLES_ADMIN     |
| ICover.json            | CoverUserWhitelistUpdated    | Cover Owner or NS_ROLES_ADMIN     |
| ICover.json            | MinCoverCreationStakeSet     | NS_ROLES_COVER_MANAGER            |
| ICover.json            | MinStakeToAddLiquiditySet    | NS_ROLES_COVER_MANAGER            |
| ICover.json            | VaultDeployed                | Cover Owner or NS_ROLES_ADMIN     |
| ICoverProvision.json   | ProvisionDecreased           | NS_ROLES_LIQUIDITY_MANAGER        |
| ICoverProvision.json   | ProvisionIncreased           | NS_ROLES_LIQUIDITY_MANAGER        |
| ICoverReassurance.json | ReassuranceAdded             | Cover Owner or CNS_COVER          |
| ICoverStake.json       | FeeBurned                    | CNS_COVER                         |
| ICoverStake.json       | StakeAdded                   | CNS_COVER                         |
| ICoverStake.json       | StakeRemoved                 | CNS_COVER                         |
| ICxTokenFactory.json   | CxTokenDeployed              | CNS_COVER_POLICY                  |
| IFinalization.json     | Finalized                    | NS_ROLES_GOVERNANCE_AGENT         |
| IGovernance.json       | Attested                     | Any                               |
| IGovernance.json       | Disputed                     | Any                               |
| IGovernance.json       | FirstReportingStakeSet       | NS_ROLES_COVER_MANAGER            |
| IGovernance.json       | Refuted                      | Any                               |
| IGovernance.json       | Reported                     | Any                               |
| IGovernance.json       | ReporterCommissionSet        | NS_ROLES_COVER_MANAGER            |
| IGovernance.json       | ReportingBurnRateSet         | NS_ROLES_COVER_MANAGER            |
| ILendingStrategy.json  | Deposited                    | Protocol Contracts                |
| ILendingStrategy.json  | Drained                      | Protocol Contracts                |
| ILendingStrategy.json  | Withdrawn                    | Protocol Contracts                |
| ILiquidityEngine.json  | StrategyAdded                | NS_ROLES_LIQUIDITY_MANAGER        |
| ILiquidityEngine.json  | StrategyDisabled             | NS_ROLES_LIQUIDITY_MANAGER        |
| IPolicy.json           | CoverPurchased               | Any                               |
| IPolicyAdmin.json      | CoverPolicyRateSet           | NS_ROLES_COVER_MANAGER            |
| IPolicyAdmin.json      | PolicyRateSet                | NS_ROLES_COVER_MANAGER            |
| IProtocol.json         | ContractAdded                | NS_ROLES_UPGRADE_AGENT            |
| IProtocol.json         | ContractUpgraded             | NS_ROLES_UPGRADE_AGENT            |
| IProtocol.json         | Initialized                  | Protocol Member or NS_ROLES_ADMIN |
| IProtocol.json         | MemberAdded                  | NS_ROLES_UPGRADE_AGENT            |
| IProtocol.json         | MemberRemoved                | NS_ROLES_UPGRADE_AGENT            |
| IResolution.json       | CooldownPeriodConfigured     | NS_ROLES_GOVERNANCE_ADMIN         |
| IResolution.json       | GovernanceBurned             | Reporters                         |
| IResolution.json       | ReporterRewardDistributed    | Reporters                         |
| IResolution.json       | Resolved                     | NS_ROLES_GOVERNANCE_AGENT         |
| IResolution.json       | Unstaken                     | Reporters                         |
| IStakingPools.json     | Deposited                    | Any                               |
| IStakingPools.json     | PoolClosed                   | NS_ROLES_ADMIN                    |
| IStakingPools.json     | PoolUpdated                  | NS_ROLES_ADMIN                    |
| IStakingPools.json     | RewardsWithdrawn             | Any                               |
| IStakingPools.json     | Withdrawn                    | Any                               |
| IVault.json            | FlashLoanBorrowed            | Any                               |
| IVault.json            | GovernanceTransfer           | CNS_CLAIM_PROCESSOR               |
| IVault.json            | PodsIssued                   | Any                               |
| IVault.json            | PodsRedeemed                 | Any                               |
| IVault.json            | StrategyReceipt              | NS_LENDING_STRATEGY_ACTIVE        |
| IVault.json            | StrategyTransfer             | NS_LENDING_STRATEGY_ACTIVE        |
| IVault.json            | InterestAccrued              | NS_ROLES_LIQUIDITY_MANAGER        |
