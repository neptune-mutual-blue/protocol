// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../../interfaces/IStore.sol";
import "../../interfaces/ICxToken.sol";
import "../../libraries/GovernanceUtilV1.sol";
import "../../libraries/PolicyHelperV1.sol";
import "../Recoverable.sol";

/**
 * @title cxToken
 *
 * @dev cxTokens are minted when someone purchases a cover.
 *
 * <br /> <br />
 *
 * The cxTokens can be exchanged for a USD stablecoin at a 1:1 exchange rate
 * after a cover incident is successfully resolved (minus platform fees).
 *  <br /> <br />
 *
 * **Restrictions:**
 *
 * - cxTokens cannot be transferred from one person to another.
 * - Only claims can be submitted with cxTokens
 * - There is a lag period before your cxTokens starts its coverage.
 * cxTokens start coverage the next day (or longer) at the UTC EOD timestamp and remain valid until the expiration date.
 * - The lag configuration can be found in [ProtoUtilV1.NS_COVERAGE_LAG](ProtoUtilV1.md)
 * and [PolicyAdmin.getCoverageLag](PolicyAdmin.md#getcoveragelag) function.
 *
 */
// slither-disable-next-line naming-convention
contract cxToken is ICxToken, Recoverable, ERC20 {
  // solhint-disable-previous-line
  using ProtoUtilV1 for IStore;
  using ValidationLibV1 for IStore;
  using PolicyHelperV1 for IStore;
  using GovernanceUtilV1 for IStore;

  // slither-disable-next-line naming-convention
  bytes32 public immutable override COVER_KEY; // solhint-disable-line
  // slither-disable-next-line naming-convention
  bytes32 public immutable override PRODUCT_KEY; // solhint-disable-line
  uint256 public immutable override createdOn = block.timestamp; // solhint-disable-line
  uint256 public immutable override expiresOn;

  /**
   * @dev Constructs this contract.
   *
   * @param store Provide the store contract instance
   * @param coverKey Enter the cover key
   * @param productKey Enter the product key
   * @param tokenName Enter token name for this ERC-20 contract. The token symbol will be `cxUSD`.
   * @param expiry Provide the cover expiry timestamp
   *
   */
  constructor(
    IStore store,
    bytes32 coverKey,
    bytes32 productKey,
    string memory tokenName,
    uint256 expiry
  ) ERC20(tokenName, "cxUSD") Recoverable(store) {
    COVER_KEY = coverKey;
    PRODUCT_KEY = productKey;
    expiresOn = expiry;
  }

  /** @dev Account to coverage start date to amount mapping */
  mapping(address => mapping(uint256 => uint256)) public coverageStartsFrom;

  /**
   * @dev Returns the value of the `coverageStartsFrom` mapping.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param account Enter an account to get the `coverageStartsFrom` value.
   * @param date Enter a date. Ensure that you supply a UTC EOD value.
   *
   */
  function getCoverageStartsFrom(address account, uint256 date) external view override returns (uint256) {
    return coverageStartsFrom[account][date];
  }

  /**
   * @dev Gets sum of the lagged and, therefore, excluded policy of a given account.
   *
   * <br /><br />
   *
   * Only policies purchased within 24-48 hours (or longer depending on this cover's configuration) are valid.
   * Given the present codebase, the loop that follows may appear pointless and invalid.
   *
   * <br /><br />
   *
   * Since the protocol is upgradable but not cxTokens,
   * erroneous code could be introduced in the future,
   * which is why we go all the way until the resolution deadline.
   *
   * @param account Enter an account.
   *
   */
  function _getExcludedCoverageOf(address account) private view returns (uint256 exclusion) {
    uint256 incidentDate = s.getLatestIncidentDateInternal(COVER_KEY, PRODUCT_KEY);

    uint256 resolutionEOD = _getEOD(s.getResolutionTimestampInternal(COVER_KEY, PRODUCT_KEY));

    for (uint256 i = 0; i < 14; i++) {
      uint256 date = _getEOD(incidentDate + (i * 1 days));

      if (date > resolutionEOD) {
        break;
      }

      exclusion += coverageStartsFrom[account][date];
    }
  }

  /**
   * @dev Gets the claimable policy of an account.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param account Enter an account.
   *
   */
  function getClaimablePolicyOf(address account) external view override returns (uint256) {
    uint256 exclusion = _getExcludedCoverageOf(account);
    uint256 balance = super.balanceOf(account);

    if (exclusion > balance) {
      return 0;
    }

    return balance - exclusion;
  }

  /**
   * @dev Mints cxTokens when a policy is purchased.
   * This feature can only be accessed by the latest policy smart contract.
   *
   * @custom:suppress-acl Can only be called by the latest policy contract
   *
   * @param coverKey Enter the cover key for which the cxTokens are being minted
   * @param to Enter the address where the minted token will be sent
   * @param amount Specify the amount of cxTokens to mint
   *
   */
  function mint(
    bytes32 coverKey,
    bytes32 productKey,
    address to,
    uint256 amount
  ) external override nonReentrant {
    require(amount > 0, "Please specify amount");
    require(coverKey == COVER_KEY, "Invalid cover");
    require(productKey == PRODUCT_KEY, "Invalid product");

    s.mustNotBePaused();
    s.senderMustBePolicyContract();
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);

    uint256 effectiveFrom = _getEOD(block.timestamp + s.getCoverageLagInternal(coverKey)); // solhint-disable-line
    coverageStartsFrom[to][effectiveFrom] += amount;

    super._mint(to, amount);
  }

  /**
   * @dev Gets the EOD (End of Day) time
   */
  function _getEOD(uint256 date) private pure returns (uint256) {
    (uint256 year, uint256 month, uint256 day) = BokkyPooBahsDateTimeLibrary.timestampToDate(date);
    return BokkyPooBahsDateTimeLibrary.timestampFromDateTime(year, month, day, 23, 59, 59);
  }

  /**
   * @dev Burns the tokens held by the sender.
   *
   * @custom:suppress-acl This is a publicly accessible feature
   *
   * @param amount Specify the amount of tokens to burn
   *
   */
  function burn(uint256 amount) external override nonReentrant {
    require(amount > 0, "Please specify amount");

    s.mustNotBePaused();
    super._burn(msg.sender, amount);
  }

  /**
   * @dev Overrides Openzeppelin ERC-20 contract's `_beforeTokenTransfer` hook.
   * This is called during `transfer`, `transferFrom`, `mint`, and `burn` function invocation.
   *
   * <br /><br/>
   *
   * **cxToken Restrictions:**
   *
   * - An expired cxToken can't be transferred.
   * - cxTokens can only be transferred to the claims processor contract.
   *
   * @param from The account sending the cxTokens
   * @param to The account receiving the cxTokens
   *
   */
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256
  ) internal view override {
    // solhint-disable-next-line
    if (block.timestamp > expiresOn) {
      require(to == address(0), "Expired cxToken");
    }

    // cxTokens can only be transferred to the claims processor contract
    if (from != address(0) && to != address(0)) {
      s.mustBeExactContract(ProtoUtilV1.CNS_CLAIM_PROCESSOR, 0, to);
    }
  }
}
