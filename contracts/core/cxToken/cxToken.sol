// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../../interfaces/IStore.sol";
import "../../interfaces/ICxToken.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/ValidationLibV1.sol";
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
// solhint-disable-next-line
contract cxToken is ICxToken, Recoverable, ERC20 {
  using ProtoUtilV1 for IStore;
  using ValidationLibV1 for IStore;

  bytes32 public override coverKey;
  uint256 public override expiresOn;
  bool public finalized = false;

  /**
   * @dev Constructs this contract
   * @param store Provide the store contract instance
   * @param key Enter the cover key or cover this cxToken instance points to
   * @param expiry Provide the cover expiry timestamp of this cxToken instance
   */
  constructor(
    IStore store,
    bytes32 key,
    uint256 expiry
  ) ERC20("USD Cover Token", "cUSD") Recoverable(store) {
    coverKey = key;
    expiresOn = expiry;
  }

  /**
   * @dev Mints cxTokens when a policy is purchased.
   * This feature can only be accesed by the latest policy smart contract.
   * @param key Enter the cover key for which the cxTokens are being minted
   * @param to Enter the address where the minted token will be sent
   * @param amount Specify the amount of cxTokens to mint
   */
  function mint(
    bytes32 key,
    address to,
    uint256 amount
  ) external override nonReentrant {
    // @suppress-acl Can only be called by the latest policy contract
    s.mustNotBePaused();
    require(key == coverKey, "Invalid cover");
    s.callerMustBePolicyContract();

    super._mint(to, amount);
  }

  /**
   * @dev Burns the tokens held by the sender
   * @param amount Specify the amount of tokens to burn
   */
  function burn(uint256 amount) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible

    s.mustNotBePaused();
    super._burn(msg.sender, amount);
  }
}
