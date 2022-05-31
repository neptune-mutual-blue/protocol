// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "./IMember.sol";

interface ICover is IMember {
  event CoverCreated(bytes32 indexed coverKey, bytes32 info);
  event ProductCreated(bytes32 indexed coverKey, bytes32 productKey, bytes32 info, bool requiresWhitelist, uint256[] values);
  event CoverUpdated(bytes32 indexed coverKey, bytes32 info);
  event ProductUpdated(bytes32 indexed coverKey, bytes32 productKey, bytes32 info, uint256[] values);
  event CoverStopped(bytes32 indexed coverKey, bytes32 indexed productKey, address indexed stoppedBy, string reason);
  event VaultDeployed(bytes32 indexed coverKey, address vault);

  event CoverCreatorWhitelistUpdated(address account, bool status);
  event CoverUserWhitelistUpdated(bytes32 indexed coverKey, address account, bool status);
  event CoverFeeSet(uint256 previous, uint256 current);
  event MinCoverCreationStakeSet(uint256 previous, uint256 current);
  event MinStakeToAddLiquiditySet(uint256 previous, uint256 current);
  event CoverInitialized(address indexed stablecoin, bytes32 withName);

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
   * and stake minimum amount of NPM in the Vault. <br /> <br />
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
   * @param coverKey Enter a unique key for this cover
   * @param info IPFS info of the cover contract
   * @param reassuranceToken **Optional.** Token added as an reassurance of this cover. <br /><br />
   *
   * Reassurance tokens can be added by a project to demonstrate coverage support
   * for their own project. This helps bring the cover fee down and enhances
   * liquidity provider confidence. Along with the NPM tokens, the reassurance tokens are rewarded
   * as a support to the liquidity providers when a cover incident occurs.
   * @param values[0] stakeWithFee Enter the total NPM amount (stake + fee) to transfer to this contract.
   * @param values[1] initialReassuranceAmount **Optional.** Enter the initial amount of
   * @param values[2] minStakeToReport A cover creator can override default min NPM stake to avoid spam reports
   * @param values[3] reportingPeriod The period during when reporting happens.
   * reassurance tokens you'd like to add to this pool.
   * @param values[4] cooldownperiod Enter the cooldown period for governance.
   * @param values[5] claimPeriod Enter the claim period.
   * @param values[6] floor Enter the policy floor rate.
   * @param values[7] ceiling Enter the policy ceiling rate.
   */
  function addCover(
    bytes32 coverKey,
    bool supportsProducts,
    bytes32 info,
    address reassuranceToken,
    uint256[] memory values
  ) external;

  function deployVault(bytes32 coverKey) external returns (address);

  function addProduct(
    bytes32 coverKey,
    bytes32 productKey,
    bytes32 info,
    bool requiresWhitelist,
    uint256[] memory values
  ) external;

  function updateProduct(
    bytes32 coverKey,
    bytes32 productKey,
    bytes32 info,
    uint256[] memory values
  ) external;

  /**
   * @dev Updates the cover contract.
   * This feature is accessible only to the cover owner or protocol owner (governance).
   *
   * @param coverKey Enter the cover key
   * @param info Enter a new IPFS URL to update
   */
  function updateCover(bytes32 coverKey, bytes32 info) external;

  function updateCoverCreatorWhitelist(address account, bool whitelisted) external;

  function updateCoverUsersWhitelist(
    bytes32 coverKey,
    bytes32 productKey,
    address[] memory accounts,
    bool[] memory statuses
  ) external;

  /**
   * @dev Get info of a cover contract by key
   * @param coverKey Enter the cover key
   * @param coverOwner Returns the address of the cover creator
   * @param info Gets the IPFS hash of the cover info
   * @param values Array of uint256 values. See `CoverUtilV1.getCoverInfo`.
   */
  function getCover(bytes32 coverKey, bytes32 productKey)
    external
    view
    returns (
      address coverOwner,
      bytes32 info,
      uint256[] memory values
    );

  function stopCover(
    bytes32 coverKey,
    bytes32 productKey,
    string memory reason
  ) external;

  function checkIfWhitelistedCoverCreator(address account) external view returns (bool);

  function checkIfWhitelistedUser(
    bytes32 coverKey,
    bytes32 productKey,
    address account
  ) external view returns (bool);

  function setCoverFees(uint256 value) external;

  function setMinCoverCreationStake(uint256 value) external;

  function setMinStakeToAddLiquidity(uint256 value) external;
}
