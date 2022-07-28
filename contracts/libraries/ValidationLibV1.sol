// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
/* solhint-disable ordering  */
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/access/IAccessControl.sol";
import "./ProtoUtilV1.sol";
import "./StoreKeyUtil.sol";
import "./RegistryLibV1.sol";
import "./CoverUtilV1.sol";
import "./GovernanceUtilV1.sol";
import "./AccessControlLibV1.sol";
import "../interfaces/IStore.sol";
import "../interfaces/IPausable.sol";
import "../interfaces/ICxToken.sol";

library ValidationLibV1 {
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using CoverUtilV1 for IStore;
  using GovernanceUtilV1 for IStore;
  using RegistryLibV1 for IStore;

  /**
   * @dev Reverts if the protocol is paused
   */
  function mustNotBePaused(IStore s) public view {
    address protocol = s.getProtocolAddress();
    require(IPausable(protocol).paused() == false, "Protocol is paused");
  }

  /**
   * @dev Reverts if the cover or any of the cover's product is not normal.
   * @param s Specify store instance
   * @param coverKey Enter the cover key to check
   */
  function mustEnsureAllProductsAreNormal(IStore s, bytes32 coverKey) external view {
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, coverKey), "Cover does not exist");
    require(s.isCoverNormalInternal(coverKey) == true, "Status not normal");
  }

  /**
   * @dev Reverts if the key does not resolve in a valid cover contract
   * or if the cover is under governance.
   * @param s Specify store instance
   * @param coverKey Enter the cover key to check
   * @param productKey Enter the product key to check
   */
  function mustHaveNormalProductStatus(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, coverKey), "Cover does not exist");
    require(s.getProductStatusInternal(coverKey, productKey) == CoverUtilV1.ProductStatus.Normal, "Status not normal");
  }

  /**
   * @dev Reverts if the key does not resolve in a valid cover contract.
   * @param s Specify store instance
   * @param coverKey Enter the cover key to check
   */
  function mustBeValidCoverKey(IStore s, bytes32 coverKey) external view {
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER, coverKey), "Cover does not exist");
  }

  /**
   * @dev Reverts if the cover does not support creating products.
   * @param s Specify store instance
   * @param coverKey Enter the cover key to check
   */
  function mustSupportProducts(IStore s, bytes32 coverKey) external view {
    require(s.supportsProductsInternal(coverKey), "Does not have products");
  }

  /**
   * @dev Reverts if the key does not resolve in a valid product of a cover contract.
   * @param s Specify store instance
   * @param coverKey Enter the cover key to check
   * @param productKey Enter the cover key to check
   */
  function mustBeValidProduct(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) public view {
    require(s.isValidProductInternal(coverKey, productKey), "Product does not exist");
  }

  /**
   * @dev Reverts if the key resolves in an expired product.
   * @param s Specify store instance
   * @param coverKey Enter the cover key to check
   * @param productKey Enter the cover key to check
   */
  function mustBeActiveProduct(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) public view {
    require(s.isActiveProductInternal(coverKey, productKey), "Product retired or deleted");
  }

  /**
   * @param s Specify store instance
   * @dev Reverts if the sender is not the cover owner
   * @param coverKey Enter the cover key to check
   * @param sender The `msg.sender` value
   */
  function mustBeCoverOwner(
    IStore s,
    bytes32 coverKey,
    address sender
  ) public view {
    bool isCoverOwner = s.getCoverOwner(coverKey) == sender;
    require(isCoverOwner, "Forbidden");
  }

  /**
   * @dev Reverts if the sender is not the cover owner or the cover contract
   * @param s Specify store instance
   * @param coverKey Enter the cover key to check
   * @param sender The `msg.sender` value
   */
  function mustBeCoverOwnerOrCoverContract(
    IStore s,
    bytes32 coverKey,
    address sender
  ) external view {
    bool isCoverOwner = s.getCoverOwner(coverKey) == sender;
    bool isCoverContract = address(s.getCoverContract()) == sender;

    require(isCoverOwner || isCoverContract, "Forbidden");
  }

  function senderMustBeCoverOwnerOrAdmin(IStore s, bytes32 coverKey) external view {
    if (AccessControlLibV1.hasAccess(s, AccessControlLibV1.NS_ROLES_ADMIN, msg.sender) == false) {
      mustBeCoverOwner(s, coverKey, msg.sender);
    }
  }

  function senderMustBePolicyContract(IStore s) external view {
    s.senderMustBeExactContract(ProtoUtilV1.CNS_COVER_POLICY);
  }

  function senderMustBePolicyManagerContract(IStore s) external view {
    s.senderMustBeExactContract(ProtoUtilV1.CNS_COVER_POLICY_MANAGER);
  }

  function senderMustBeCoverContract(IStore s) external view {
    s.senderMustBeExactContract(ProtoUtilV1.CNS_COVER);
  }

  function senderMustBeVaultContract(IStore s, bytes32 coverKey) external view {
    address vault = s.getVaultAddress(coverKey);
    require(msg.sender == vault, "Forbidden");
  }

  function senderMustBeGovernanceContract(IStore s) external view {
    s.senderMustBeExactContract(ProtoUtilV1.CNS_GOVERNANCE);
  }

  function senderMustBeClaimsProcessorContract(IStore s) external view {
    s.senderMustBeExactContract(ProtoUtilV1.CNS_CLAIM_PROCESSOR);
  }

  function callerMustBeClaimsProcessorContract(IStore s, address caller) external view {
    s.callerMustBeExactContract(ProtoUtilV1.CNS_CLAIM_PROCESSOR, caller);
  }

  function senderMustBeStrategyContract(IStore s) external view {
    bool senderIsStrategyContract = s.getBoolByKey(_getIsActiveStrategyKey(msg.sender));
    require(senderIsStrategyContract == true, "Not a strategy contract");
  }

  function callerMustBeStrategyContract(IStore s, address caller) public view {
    bool isActive = s.getBoolByKey(_getIsActiveStrategyKey(caller));
    bool wasDisabled = s.getBoolByKey(_getIsDisabledStrategyKey(caller));

    require(isActive == true || wasDisabled == true, "Not a strategy contract");
  }

  function callerMustBeSpecificStrategyContract(
    IStore s,
    address caller,
    bytes32 strategyName
  ) external view {
    callerMustBeStrategyContract(s, caller);
    require(IMember(caller).getName() == strategyName, "Access denied");
  }

  /**
   * @dev Hash key of the "active strategy flag".
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param strategyAddress Enter a strategy address
   *
   */
  function _getIsActiveStrategyKey(address strategyAddress) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LENDING_STRATEGY_ACTIVE, strategyAddress));
  }

  /**
   * @dev Hash key of the "disabled strategy flag".
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param strategyAddress Enter a strategy address
   *
   */
  function _getIsDisabledStrategyKey(address strategyAddress) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LENDING_STRATEGY_DISABLED, strategyAddress));
  }

  function senderMustBeProtocolMember(IStore s) external view {
    require(s.isProtocolMember(msg.sender), "Forbidden");
  }

  function mustBeReporting(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    require(s.getProductStatusInternal(coverKey, productKey) == CoverUtilV1.ProductStatus.IncidentHappened, "Not reporting");
  }

  function mustBeDisputed(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    require(s.getProductStatusInternal(coverKey, productKey) == CoverUtilV1.ProductStatus.FalseReporting, "Not disputed");
  }

  function mustBeClaimable(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) public view {
    require(s.getProductStatusInternal(coverKey, productKey) == CoverUtilV1.ProductStatus.Claimable, "Not claimable");
  }

  function mustBeClaimingOrDisputed(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    CoverUtilV1.ProductStatus status = s.getProductStatusInternal(coverKey, productKey);

    bool claiming = status == CoverUtilV1.ProductStatus.Claimable;
    bool falseReporting = status == CoverUtilV1.ProductStatus.FalseReporting;

    require(claiming || falseReporting, "Not claimable nor disputed");
  }

  function mustBeReportingOrDisputed(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    CoverUtilV1.ProductStatus status = s.getProductStatusInternal(coverKey, productKey);
    bool incidentHappened = status == CoverUtilV1.ProductStatus.IncidentHappened;
    bool falseReporting = status == CoverUtilV1.ProductStatus.FalseReporting;

    require(incidentHappened || falseReporting, "Not reported nor disputed");
  }

  function mustBeBeforeResolutionDeadline(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    uint256 deadline = s.getResolutionDeadlineInternal(coverKey, productKey);

    if (deadline > 0) {
      require(block.timestamp < deadline, "Emergency resolution deadline over"); // solhint-disable-line
    }
  }

  function mustNotHaveResolutionDeadline(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    uint256 deadline = s.getResolutionDeadlineInternal(coverKey, productKey);
    require(deadline == 0, "Resolution already has deadline");
  }

  function mustBeAfterResolutionDeadline(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) public view {
    uint256 deadline = s.getResolutionDeadlineInternal(coverKey, productKey);
    require(deadline > 0 && block.timestamp > deadline, "Still unresolved"); // solhint-disable-line
  }

  function mustBeValidIncidentDate(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) public view {
    require(s.getActiveIncidentDateInternal(coverKey, productKey) == incidentDate, "Invalid incident date");
  }

  function mustHaveDispute(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    bool hasDispute = s.getBoolByKey(GovernanceUtilV1.getHasDisputeKeyInternal(coverKey, productKey));
    require(hasDispute == true, "Not disputed");
  }

  function mustNotHaveDispute(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    bool hasDispute = s.getBoolByKey(GovernanceUtilV1.getHasDisputeKeyInternal(coverKey, productKey));
    require(hasDispute == false, "Already disputed");
  }

  function mustBeDuringReportingPeriod(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    require(s.getResolutionTimestampInternal(coverKey, productKey) >= block.timestamp, "Reporting window closed"); // solhint-disable-line
  }

  function mustBeAfterReportingPeriod(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) public view {
    require(block.timestamp > s.getResolutionTimestampInternal(coverKey, productKey), "Reporting still active"); // solhint-disable-line
  }

  function mustBeValidCxToken(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    address cxToken,
    uint256 incidentDate
  ) public view {
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER_CXTOKEN, cxToken) == true, "Unknown cxToken");

    bytes32 COVER_KEY = ICxToken(cxToken).COVER_KEY(); // solhint-disable-line
    bytes32 PRODUCT_KEY = ICxToken(cxToken).PRODUCT_KEY(); // solhint-disable-line

    require(coverKey == COVER_KEY && productKey == PRODUCT_KEY, "Invalid cxToken");

    uint256 expires = ICxToken(cxToken).expiresOn();
    require(expires > incidentDate, "Invalid or expired cxToken");
  }

  function mustBeValidClaim(
    IStore s,
    address account,
    bytes32 coverKey,
    bytes32 productKey,
    address cxToken,
    uint256 incidentDate,
    uint256 amount
  ) external view {
    mustBeSupportedProductOrEmpty(s, coverKey, productKey);
    mustBeValidCxToken(s, coverKey, productKey, cxToken, incidentDate);
    mustBeClaimable(s, coverKey, productKey);
    mustBeValidIncidentDate(s, coverKey, productKey, incidentDate);
    mustBeDuringClaimPeriod(s, coverKey, productKey);
    require(ICxToken(cxToken).getClaimablePolicyOf(account) >= amount, "Claim exceeds your coverage");
  }

  function mustNotHaveUnstaken(
    IStore s,
    address account,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) public view {
    uint256 withdrawal = s.getReportingUnstakenAmountInternal(account, coverKey, productKey, incidentDate);
    require(withdrawal == 0, "Already unstaken");
  }

  /**
   * @dev Validates your `unstakeWithoutClaim` arguments
   *
   * @custom:note This function is not intended be used and does not produce correct result
   * during a claim period. Please use `validateUnstakeWithClaim` if you are accessing
   * this function during claim period.
   */
  function validateUnstakeWithoutClaim(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external view {
    mustNotBePaused(s);
    mustBeSupportedProductOrEmpty(s, coverKey, productKey);
    mustNotHaveUnstaken(s, msg.sender, coverKey, productKey, incidentDate);
    mustBeAfterReportingPeriod(s, coverKey, productKey);

    // Before the deadline, emergency resolution can still happen
    // that may have an impact on the final decision. We, therefore, have to wait.
    mustBeAfterResolutionDeadline(s, coverKey, productKey);
  }

  /**
   * @dev Validates your `unstakeWithClaim` arguments
   *
   * @custom:note This function is only intended be used during a claim period.
   * Please use `validateUnstakeWithoutClaim` if you are accessing
   * this function after claim period expiry.
   */
  function validateUnstakeWithClaim(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external view {
    mustNotBePaused(s);
    mustBeSupportedProductOrEmpty(s, coverKey, productKey);
    mustNotHaveUnstaken(s, msg.sender, coverKey, productKey, incidentDate);
    mustBeAfterReportingPeriod(s, coverKey, productKey);

    // If this reporting gets finalized, incident date will become invalid
    // meaning this execution will revert thereby restricting late comers
    // to access this feature. But they can still access `unstake` feature
    // to withdraw their stake.
    mustBeValidIncidentDate(s, coverKey, productKey, incidentDate);

    // Before the deadline, emergency resolution can still happen
    // that may have an impact on the final decision. We, therefore, have to wait.
    mustBeAfterResolutionDeadline(s, coverKey, productKey);

    bool incidentHappened = s.getProductStatusOfInternal(coverKey, productKey, incidentDate) == CoverUtilV1.ProductStatus.Claimable;

    if (incidentHappened) {
      // Incident occurred. Must unstake with claim during the claim period.
      mustBeDuringClaimPeriod(s, coverKey, productKey);
      return;
    }
  }

  function mustBeDuringClaimPeriod(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) public view {
    uint256 beginsFrom = s.getUintByKeys(ProtoUtilV1.NS_CLAIM_BEGIN_TS, coverKey, productKey);
    uint256 expiresAt = s.getUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, coverKey, productKey);

    require(beginsFrom > 0, "Invalid claim begin date");
    require(expiresAt > beginsFrom, "Invalid claim period");

    require(block.timestamp >= beginsFrom, "Claim period hasn't begun"); // solhint-disable-line
    require(block.timestamp <= expiresAt, "Claim period has expired"); // solhint-disable-line
  }

  function mustBeAfterClaimExpiry(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    require(block.timestamp > s.getUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, coverKey, productKey), "Claim still active"); // solhint-disable-line
  }

  /**
   * @dev Reverts if the sender is not whitelisted cover creator.
   */
  function senderMustBeWhitelistedCoverCreator(IStore s) external view {
    require(s.getAddressBooleanByKey(ProtoUtilV1.NS_COVER_CREATOR_WHITELIST, msg.sender), "Not whitelisted");
  }

  function senderMustBeWhitelistedIfRequired(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    address sender
  ) external view {
    bool supportsProducts = s.supportsProductsInternal(coverKey);
    bool required = supportsProducts ? s.checkIfProductRequiresWhitelist(coverKey, productKey) : s.checkIfRequiresWhitelist(coverKey);

    if (required == false) {
      return;
    }

    require(s.getAddressBooleanByKeys(ProtoUtilV1.NS_COVER_USER_WHITELIST, coverKey, productKey, sender), "You are not whitelisted");
  }

  function mustBeSupportedProductOrEmpty(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) public view {
    bool hasProducts = s.supportsProductsInternal(coverKey);

    hasProducts ? require(productKey > 0, "Specify a product") : require(productKey == 0, "Invalid product");

    if (hasProducts) {
      mustBeValidProduct(s, coverKey, productKey);
      mustBeActiveProduct(s, coverKey, productKey);
    }
  }

  function mustNotHavePolicyDisabled(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view {
    require(!s.isPolicyDisabledInternal(coverKey, productKey), "Policy purchase disabled");
  }

  function mustNotExceedStablecoinThreshold(IStore s, uint256 amount) external view {
    uint256 stablecoinPrecision = s.getStablecoinPrecision();
    require(amount <= ProtoUtilV1.MAX_LIQUIDITY * stablecoinPrecision, "Please specify a smaller amount");
  }

  function mustNotExceedProposalThreshold(IStore s, uint256 amount) external view {
    uint256 stablecoinPrecision = s.getStablecoinPrecision();
    require(amount <= ProtoUtilV1.MAX_PROPOSAL_AMOUNT * stablecoinPrecision, "Please specify a smaller amount");
  }
}
