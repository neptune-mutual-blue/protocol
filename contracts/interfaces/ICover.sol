// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./IMember.sol";

interface ICover is IMember {
  struct AddCoverArgs {
    bytes32 coverKey;
    string info;
    string tokenName;
    string tokenSymbol;
    bool supportsProducts;
    bool requiresWhitelist;
    uint256 stakeWithFee;
    uint256 initialReassuranceAmount;
    uint256 minStakeToReport;
    uint256 reportingPeriod;
    uint256 cooldownPeriod;
    uint256 claimPeriod;
    uint256 floor;
    uint256 ceiling;
    uint256 reassuranceRate;
    uint256 leverageFactor;
  }

  struct AddProductArgs {
    bytes32 coverKey;
    bytes32 productKey;
    string info;
    bool requiresWhitelist;
    uint256 productStatus;
    uint256 efficiency;
  }

  struct UpdateProductArgs {
    bytes32 coverKey;
    bytes32 productKey;
    string info;
    uint256 productStatus;
    uint256 efficiency;
  }

  event CoverCreated(bytes32 indexed coverKey, string info, string tokenName, string tokenSymbol, bool indexed supportsProducts, bool indexed requiresWhitelist);
  event ProductCreated(bytes32 indexed coverKey, bytes32 productKey, string info);
  event CoverUpdated(bytes32 indexed coverKey, string info);
  event ProductUpdated(bytes32 indexed coverKey, bytes32 productKey, string info);
  event ProductStateUpdated(bytes32 indexed coverKey, bytes32 indexed productKey, address indexed updatedBy, bool status, string reason);

  event CoverCreatorWhitelistUpdated(address account, bool status);
  event CoverUserWhitelistUpdated(bytes32 indexed coverKey, bytes32 indexed productKey, address indexed account, bool status);
  event CoverCreationFeeSet(uint256 previous, uint256 current);
  event MinCoverCreationStakeSet(uint256 previous, uint256 current);
  event MinStakeToAddLiquiditySet(uint256 previous, uint256 current);
  event CoverInitialized(address indexed stablecoin, bytes32 withName);

  /**
   * @dev Initializes this contract
   * @param stablecoin Provide the address of the token this cover will be quoted against.
   * @param friendlyName Enter a description or ENS name of your liquidity token.
   *
   */
  function initialize(address stablecoin, bytes32 friendlyName) external;

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
   */
  function addCover(AddCoverArgs calldata args) external returns (address);

  function addCovers(AddCoverArgs[] calldata args) external returns (address[] memory vaults);

  function addProduct(AddProductArgs calldata args) external;

  function addProducts(AddProductArgs[] calldata args) external;

  function updateProduct(UpdateProductArgs calldata args) external;

  /**
   * @dev Updates the cover contract.
   * This feature is accessible only to the cover owner or protocol owner (governance).
   *
   * @param coverKey Enter the cover key
   * @param info Enter a new IPFS hash to update
   */
  function updateCover(bytes32 coverKey, string calldata info) external;

  function updateCoverCreatorWhitelist(address[] calldata account, bool[] calldata whitelisted) external;

  function updateCoverUsersWhitelist(
    bytes32 coverKey,
    bytes32 productKey,
    address[] calldata accounts,
    bool[] calldata statuses
  ) external;

  function disablePolicy(
    bytes32 coverKey,
    bytes32 productKey,
    bool status,
    string calldata reason
  ) external;

  function checkIfWhitelistedCoverCreator(address account) external view returns (bool);

  function checkIfWhitelistedUser(
    bytes32 coverKey,
    bytes32 productKey,
    address account
  ) external view returns (bool);

  function setCoverCreationFee(uint256 value) external;

  function setMinCoverCreationStake(uint256 value) external;

  function setMinStakeToAddLiquidity(uint256 value) external;
}
