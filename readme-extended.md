# Bug Bounty Program

To be annouced soon.

# Scripts

**Walker: yarn walker**

Lists all smart contract functions that update the state; warns if you did not implement "Access Control" or "Pausable" functionality. Helpful to quickly scan all functions that are publicly accessible.

**Doc Generator: yarn gendoc**

Produces documentation using `truffle compiler`

# Protocol

## Access Control

| Role                       | Level    | Description                                                                                |
| -------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| NS_ROLES_ADMIN             | Critical | Same as DEFAULT_ADMIN role                                                                 |
| NS_ROLES_COVER_MANAGER     | Moderate | Cover managers can set cover configuration parameters.                                     |
| NS_ROLES_LIQUIDITY_MANAGER | Moderate | Liquidity managers can configure liquidity pool configuration                              |
| NS_ROLES_GOVERNANCE_AGENT  | High     | A governance agent can resolve and finalize covers undergoing reporting                    |
| NS_ROLES_GOVERNANCE_ADMIN  | Critical | Governance admin can perform emergency resolution.                                         |
| NS_ROLES_UPGRADE_AGENT     | Critical | Upgrade agents are allowed to upgrade the protocol                                         |
| NS_ROLES_RECOVERY_AGENT    | Highest  | Recovery agents can recover accidentally-sent ERC-20 tokens and Ether from smart contracts |
| NS_ROLES_PAUSE_AGENT       | Low      | Pause Agents can pause the protocol                                                        |
| NS_ROLES_UNPAUSE_AGENT     | Critical | Unpause Agents can unpause the protocol                                                    |

---

# Application Security

# Supply-Chain Attack

Supply chain attack is a technique used by malicious actors to exploit applications via the dependency tree. A seasoned software developer like you needs to think about security during all times. It is, therefore, extremely important to first understand numerous tactics employed by exploiters to be able to defend such attacks and harden your application.

## Attack Tactics

**Via Gaining Trust**

This example touches on a fictitious attacker who investigates popular packages and libraries to evaluate if there is any project that needs volunteers and if they can contribute as an open source developer.

Before the real attack begins, the attacker offers to become a contributor of a project. The intention of the attacker is to first gain trust of the `package admin` or owner before they actually perform the real attack. Based on how popular a project is and how motivated an attacker is, the attacker can invest months or even years to become a nice and friendly guy who is perceived as someone who "cares about the project" and the community.

The final goal of the attacker is to convince the package admin, who may have day job or other things to do, to receive write access to the `supply chain`. There can be other numerous reason whereby admins and/or maintainers of open source projects change.

**Via Offering Money**

There are some stories whereby people have obtained ownership of open source projects by offering money to the previous developer.

**Via Forking**

A clever attacker can fork a popular open source project and implement a few `most requested features` and invite community to use their version instead of the original one. This may attract ample amount of followers, especially the ones who have had requested those features for ages. This technique helps the attacker to gain follower-ship and increase community size quickly by implementing those features that were requested by the most influential people of the original project's community.

**Other Methods**

Numerous other tactics can be employed to infect a project with malicious code. One of them includes walking down into the dependency tree. Implying, even if an attacker is not able to obtain write access on a project they wanted to infect initially, they may be successful on attacking one of the dependencies used by the project in question, thereby still being able to achieve the same result one way or the other.

## Consequence of Supply Chain Attack

An example of supply chain for javascript (and solidity) programming language is `Node Package Manager` or `NPM`. Once an attacker gains write access or becomes able to publish new package version, they can then inject malicious code into new releases. All dependent projects which upgrade to the latest version are the ones which get exploited first.

**What Could Be the Damages?**

Use your imagination. Sky's the limit.

- **Backend**. Create an encrypted (or plain-text, who cares?) payload of all environment and global variables and constants of the running application. Send that as an email, upload it to a file server, etc. → Poorly-written applications will happily expose database passwords, API keys, and everything that should not be in .
- **Frontend + Backend**. Initialize a crypto miner instance and consume computing resources, of the browser or in the cloud. → If the app is running under an automatically scaling config, the crypto mining script will motivate the cloud provider to spin up additional servers "on demand". Now, don't ask why your previous AWS invoice was in millions.
- **Frontend**. Use pattern matching and/or other advanced techniques to replace all receiving or beneficiary (ERC-20 approval) addresses to the attacker's wallet. → Application users will deposit ERC-20 tokens to attacker's wallet instead of the smart contracts that were originally meant to receive the tokens.

[Attack Scenarios](https://www.notion.so/629784ed8bf8431d9c5e0e8aa270a811)

[Recent Incidents](https://www.notion.so/2d942fe0d5444cf78b931ff2fb17afd5)

# License

This repository is available under Business Source License 1.1
