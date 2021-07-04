// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "./IMember.sol";

interface ICover is IMember {
  event CoverCreated(bytes32 key, bytes32 info, uint256 stakeWithFee, uint256 liquidity);
  event CoverUpdated(bytes32 key, bytes32 info);

  /**
   * @dev Initializes this contract
   * @param liquidityToken Provide the address of the token this cover will be quoted against.
   * @param liquidityName Enter a description or ENS name of your liquidity token.
   *
   */
  function initialize(address liquidityToken, bytes32 liquidityName) external;

  /**
   * @dev Adds a new coverage pool or cover contract.
   * To add a new cover, you need to pay cover creation fee
   * and stake minimum amount of NEP in the Vault. <br /> <br />
   *
   * Through the governance portal, projects will be able redeem
   * the full cover fee at a later date. <br /> <br />
   *
   * **Apply for Fee Redemption** <br />
   * https://docs.neptunemutual.com/covers/cover-fee-redemption <br /><br />
   *
   * As the cover creator, you will earn a portion of all cover fees
   * generated in this pool. <br /> <br />
   *
   * Read the documentation to learn more about the fees: <br />
   * https://docs.neptunemutual.com/covers/contract-creators
   *
   * @param key Enter a unique key for this cover
   * @param info IPFS info of the cover contract
   * @param assuranceToken **Optional.** Token added as an assurance of this cover. <br /><br />
   *
   * Assurance tokens can be added by a project to demonstrate coverage support
   * for their own project. This helps bring the cover fee down and enhances
   * liquidity provider confidence. Along with the NEP tokens, the assurance tokens are rewarded
   * as a support to the liquidity providers when a cover incident occurs.
   * @param initialAssuranceAmount **Optional.** Enter the initial amount of
   * assurance tokens you'd like to add to this pool.
   * @param stakeWithFee Enter the total NEP amount (stake + fee) to transfer to this contract.
   * @param initialLiquidity **Optional.** Enter the initial stablecoin liquidity for this cover.
   */
  function addCover(
    bytes32 key,
    bytes32 info,
    uint256 stakeWithFee,
    address assuranceToken,
    uint256 initialAssuranceAmount,
    uint256 initialLiquidity
  ) external;

  /**
   * @dev Updates the cover contract.
   * This feature is accessible only to the cover owner or protocol owner (governance).
   *
   * @param key Enter the cover key
   * @param info Enter a new IPFS URL to update
   */
  function updateCover(bytes32 key, bytes32 info) external;

  /**
   * @dev Get info of a cover contract by key
   * @param key Enter the cover key
   * @param coverOwner Returns the address of the cover creator
   * @param info Gets the IPFS hash of the cover info
   * @param values Array of uint256 values. See `CoverUtilV1.getCoverInfo`.
   */
  function getCover(bytes32 key)
    external
    view
    returns (
      address coverOwner,
      bytes32 info,
      uint256[] memory values
    );
}
