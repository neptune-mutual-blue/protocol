// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./IMember.sol";

interface ICover is IMember {

  struct AddCoverArgs {
    bytes32 coverKey; //coverKey Enter a unique key for this cover
    string info; //info IPFS hash. Check out the [documentation](https://docs.neptunemutual.com/sdk/managing-covers) for more info.
    string tokenName; //tokenName Enter the token name of the POD contract that will be deployed.
    string tokenSymbol; //tokenSymbol Enter the token symbol of the POD contract that will be deployed.
    bool supportsProducts; //supportsProducts Indicates that this cover supports product(s)
    bool requiresWhitelist; //requiresWhitelist Signifies if this cover only enables whitelisted addresses to purchase policies.
    uint256 stakeWithFee;  //stakeWithFee Enter the total NPM amount (stake + fee) to transfer to this contract.
    uint256 initialReassuranceAmount; //initialReassuranceAmount **Optional.** Enter the initial amount of
    uint256 minStakeToReport; //minStakeToReport A cover creator can override default min NPM stake to avoid spam reports
    uint256 reportingPeriod; //reportingPeriod The period during when reporting happens.
    uint256 cooldownPeriod; //cooldownperiod Enter the cooldown period for governance.
    uint256 claimPeriod; //claimPeriod Enter the claim period.
    uint256 floor; //floor Enter the policy floor rate.
    uint256 ceiling; //ceiling Enter the policy ceiling rate.
    uint256 reassuranceRate; //reassuranceRate Enter the reassurance rate.
    uint256 leverageFactor; //leverageFactor Leverage Factor
  }

  struct AddProductArgs {
    bytes32 coverKey; //coverKey Enter a cover key
    bytes32 productKey; //productKey Enter the product key
    string info; //info IPFS hash. Check out the [documentation](https://docs.neptunemutual.com/sdk/managing-covers) for more info.
    bool requiresWhitelist; //requiresWhitelist Enter true if you want to maintain a whitelist and restrict non-whitelisted users to purchase policies.
    uint256 productStatus; //Product status
    uint256 efficiency; //Enter the capital efficiency ratio in percentage value (Check ProtoUtilV1.MULTIPLIER for division)
  }

  struct UpdateProductArgs {
    bytes32 coverKey; //coverKey Enter the cover key
    bytes32 productKey; //productKey Enter the product key
    string info; //info Enter a new IPFS URL to update
    uint256 productStatus; //Product status
    uint256 efficiency; //Enter the capital efficiency ratio in percentage value (Check ProtoUtilV1.MULTIPLIER for division)
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
