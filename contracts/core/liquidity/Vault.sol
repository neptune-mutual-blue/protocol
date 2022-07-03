// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/interfaces/IERC3156FlashLender.sol";
import "./WithFlashLoan.sol";

pragma solidity ^0.8.0;

/**
 * @title Vault Contract
 *
 * @dev When a cover is created, a corresponding liquidity pool is also constituted.
 * An instance of this contract represents the liquidity pool of a cover.
 * The vaults are denominated in a single stablecoin and may be less susceptible
 * to underwriting risks associated with cryptocurrency price volatility.
 *
 * <br /> <br />
 *
 * When requested by the Cover Contract, the VaultFactory contract deploys a vault.
 * Per cover, only one vault is permitted. Since the vault contract is not upgradable,
 * some of the validation logic of it is outsourced to the VaultDelegate contract.
 *
 * <br /> <br />
 *
 * The vault contract is also an ERC-20 token, commonly known as POD (or Proof of Deposit).
 * As there is always on-chain stablecoin liquidity available for withdrawal,
 * PODs are fully redeemable and also income or loss bearing certificates
 *  (loss if the cover had an event that resulted in a claims payout).
 *
 * Unlike [cxTokens](cxToken.md), PODs can be freely transferred, staked,
 * and exchanged on secondary marketplaces.
 *
 * <br /> <br />
 *
 * **Disclaimer:**
 * <br /> <br />
 *
 * **The protocol does not provide any warranty, guarantee, or endorsement
 * for the peg of this stablecoin or any other stablecoin we may use on a different chain.**
 *
 * <br /> <br />
 *
 * Both risk poolers (underwriters) and policyholders
 * must agree to utilize the same stablecoin to interfact with the protocol.
 *
 * Note that the Neptune Mutual protocol only covers risks related to smart contracts and,
 * to a certain extent, frontend attacks. We don't cover risks arising from
 * teams losing private keys because of gross misconduct or negligence.
 * We don't cover people who put their money at risk in trading activities
 * like margin calls, leverage trading, or liquidation.
 * We don't cover 51% attack or any other type of consensus attack.
 * We don't cover bridge hacks and a [whole variety of other exclusions](https://docs.neptunemutual.com/usage/standard-exclusions).
 *
 */
contract Vault is WithFlashLoan {
  using ProtoUtilV1 for IStore;
  using RegistryLibV1 for IStore;

  /**
   * @dev Contructs this contract
   *
   * @param store Provide store instance
   * @param coverKey Provide a cover key that doesn't have a vault deployed
   * @param tokenName Enter the token name of the POD. Example: `Uniswap nDAI` or `Uniswap nUSDC`
   * @param tokenSymbol Enter the token symbol of the POD. Example: UNI-NDAI or `UNI-NUSDC`.
   * @param stablecoin Provide an instance of the stablecoin this vault supports.
   *
   */
  constructor(
    IStore store,
    bytes32 coverKey,
    string memory tokenName,
    string memory tokenSymbol,
    IERC20 stablecoin
  ) VaultBase(store, coverKey, tokenName, tokenSymbol, stablecoin) {} // solhint-disable-line

  /**
   * @dev Gets information of a given vault by the cover key
   *
   * @param you The address for which the info will be customized
   * @param values[0] totalPods --> Total PODs in existence
   * @param values[1] balance --> Stablecoins held in the vault
   * @param values[2] extendedBalance --> Stablecoins lent outside of the protocol
   * @param values[3] totalReassurance -- > Total reassurance for this cover
   * @param values[4] myPodBalance --> Your POD Balance
   * @param values[5] myShare --> My share of the liquidity pool (in stablecoin)
   * @param values[6] withdrawalOpen --> The timestamp when withdrawals are opened
   * @param values[7] withdrawalClose --> The timestamp when withdrawals are closed again
   *
   */
  function getInfo(address you) external view override returns (uint256[] memory values) {
    return delgate().getInfoImplementation(key, you);
  }

  /**
   * @dev Version number of this contract
   */
  function version() external pure override returns (bytes32) {
    return "v0.1";
  }

  /**
   * @dev Name of this contract
   */
  function getName() external pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_LIQUIDITY_VAULT;
  }
}
