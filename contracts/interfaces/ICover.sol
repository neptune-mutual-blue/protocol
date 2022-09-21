// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./IMember.sol";

interface ICover is IMember {

  /*
   * coverKey Enter a unique key for this cover
   * info IPFS hash. Check out the [documentation](https://docs.neptunemutual.com/sdk/managing-covers) for more info.
   * tokenName Enter the token name of the POD contract that will be deployed.
   * tokenSymbol Enter the token symbol of the POD contract that will be deployed.
   * supportsProducts Indicates that this cover supports product(s)
   * requiresWhitelist Signifies if this cover only enables whitelisted addresses to purchase policies.
   * stakeWithFee Enter the total NPM amount (stake + fee) to transfer to this contract.
   * initialReassuranceAmount **Optional.** Enter the initial amount of
   * reassurance tokens you'd like to add to this pool.
   * minStakeToReport A cover creator can override default min NPM stake to avoid spam reports
   * reportingPeriod The period during when reporting happens.
   * cooldownperiod Enter the cooldown period for governance.
   * claimPeriod Enter the claim period.
   * floor Enter the policy floor rate.
   * ceiling Enter the policy ceiling rate.
   * reassuranceRate Enter the reassurance rate.
   * leverageFactor Leverage Factor
   */
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

  /*
   * coverKey Enter a cover key
   * productKey Enter the product key
   * info IPFS hash. Check out the [documentation](https://docs.neptunemutual.com/sdk/managing-covers) for more info.
   * requiresWhitelist Enter true if you want to maintain a whitelist and restrict non-whitelisted users to purchase policies.
   * Product status
   * Enter the capital efficiency ratio in percentage value (Check ProtoUtilV1.MULTIPLIER for division)
   *
   */
  struct AddProductArgs {
    bytes32 coverKey;
    bytes32 productKey;
    string info;
    bool requiresWhitelist;
    uint256 productStatus;
    uint256 efficiency;
  }

  /*
   * coverKey Enter the cover key
   * productKey Enter the product key
   * info Enter a new IPFS URL to update
   * Product status
   * Enter the capital efficiency ratio in percentage value (Check ProtoUtilV1.MULTIPLIER for division)
   *
   */
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
  event VaultDeployed(bytes32 indexed coverKey, address vault);

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

  function addProduct(AddProductArgs calldata args) external;

  function updateProduct(UpdateProductArgs calldata args) external;

  /**
   * @dev Updates the cover contract.
   * This feature is accessible only to the cover owner or protocol owner (governance).
   *
   * @param coverKey Enter the cover key
   * @param info Enter a new IPFS hash to update
   */
  function updateCover(bytes32 coverKey, string calldata info) external;

  function updateCoverCreatorWhitelist(address account, bool whitelisted) external;

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
