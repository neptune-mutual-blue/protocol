// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../../interfaces/IStore.sol";
import "../../interfaces/ICxToken.sol";
import "../../libraries/GovernanceUtilV1.sol";
import "../../libraries/PolicyHelperV1.sol";
import "../../libraries/NTransferUtilV2.sol";
import "../Recoverable.sol";

/**
 * @title cxToken
 * @dev cxTokens are minted when someone purchases a cover. <br /> <br />
 *
 * When a cover incident is successfully resolved, each unit of cxTokens can be redeemed at 1:1 ratio
 * of 1 cxToken = 1 DAI/BUSD/USDC (minus platform fees).
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

  function _getTokenName(bytes32 coverKey, bytes32 productKey) private pure returns (string memory) {
    if (productKey > 0) {
      return string(abi.encodePacked(string(abi.encodePacked(coverKey)), "-", string(abi.encodePacked(productKey)), "-cxtoken"));
    }

    return string(abi.encodePacked(string(abi.encodePacked(coverKey)), "-cxtoken"));
  }

  /**
   * @dev Constructs this contract
   * @param store Provide the store contract instance
   * @param coverKey Enter the cover key or cover this cxToken instance points to
   * @param expiry Provide the cover expiry timestamp of this cxToken instance
   */
  constructor(
    IStore store,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 expiry
  ) ERC20(_getTokenName(coverKey, productKey), "cxUSD") Recoverable(store) {
    COVER_KEY = coverKey;
    PRODUCT_KEY = productKey;
    expiresOn = expiry;
  }

  // account --> coverage start date --> amount
  mapping(address => mapping(uint256 => uint256)) public coverageStartsFrom;

  /**
   * @dev Returns the value of the `coverageStartsFrom` mapping.
   * @param account Enter an account to get the `coverageStartsFrom` value
   * @param date Enter a date. Ensure that you supply a UTC EOD value.
   */
  function getCoverageStartsFrom(address account, uint256 date) external view override returns (uint256) {
    return coverageStartsFrom[account][date];
  }

  /**
   * @dev Gets sum of the lagged and hence excluded policy of a given account.
   * @param account Enter an account.
   */
  function _getExcludedCoverageOf(address account) private view returns (uint256 exclusion) {
    uint256 incidentDate = s.getLatestIncidentDateInternal(COVER_KEY, PRODUCT_KEY);

    // Only the policies purchased before 24-48 hours (based on configuration) are considered valid.
    // Given the current codebase, the following loop looks redundant.
    // The reason why we go all the way till the resolution deadline
    // is because since the protocol is upgradable, erroneous code can be introduced in the future.
    for (uint256 i = 0; i < 14; i++) {
      uint256 date = _getEOD(incidentDate + (i * 1 days));

      if (date > _getEOD(s.getResolutionTimestampInternal(COVER_KEY, PRODUCT_KEY))) {
        break;
      }

      exclusion += coverageStartsFrom[account][date];
    }
  }

  /**
   * @dev Gets the claimable policy of an account.
   * @param account Enter an account.
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
   * @param coverKey Enter the cover key for which the cxTokens are being minted
   * @param to Enter the address where the minted token will be sent
   * @param amount Specify the amount of cxTokens to mint
   */
  function mint(
    bytes32 coverKey,
    bytes32 productKey,
    address to,
    uint256 amount
  ) external override nonReentrant {
    // @suppress-acl Can only be called by the latest policy contract
    s.mustNotBePaused();

    require(amount > 0, "Please specify amount");
    require(coverKey == COVER_KEY, "Invalid cover");
    require(productKey == PRODUCT_KEY, "Invalid product");

    s.mustBeSupportedProductOrEmpty(coverKey, productKey);
    s.senderMustBePolicyContract();

    uint256 effectiveFrom = _getEOD(block.timestamp + s.getCoverageLagInternal(coverKey)); // solhint-disable-line
    coverageStartsFrom[to][effectiveFrom] += amount;

    super._mint(to, amount);
  }

  /**
   * @dev Gets the end of day time
   */
  function _getEOD(uint256 date) private pure returns (uint256) {
    (uint256 year, uint256 month, uint256 day) = BokkyPooBahsDateTimeLibrary.timestampToDate(date);
    return BokkyPooBahsDateTimeLibrary.timestampFromDateTime(year, month, day, 23, 59, 59);
  }

  /**
   * @dev Burns the tokens held by the sender
   * @param amount Specify the amount of tokens to burn
   */
  function burn(uint256 amount) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible
    require(amount > 0, "Please specify amount");

    s.mustNotBePaused();
    super._burn(msg.sender, amount);
  }

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
      s.mustBeExactContract(ProtoUtilV1.CNS_CLAIM_PROCESSOR, to);
    }
  }
}
