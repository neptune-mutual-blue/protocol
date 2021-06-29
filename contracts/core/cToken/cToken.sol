// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../../interfaces/IStore.sol";
import "../../interfaces/ICToken.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/NTransferUtilV2.sol";
import "../Recoverable.sol";

/**
 * @title cToken
 * @dev cTokens are minted when someone purchases a cover. <br /> <br />
 *
 * When a cover incident is successfully resolved, each unit of cTokens can be redeemed at 1:1 ratio
 * of 1 cToken = 1 DAI/BUSD/USDC.
 *
 */
// solhint-disable-next-line
contract cToken is ICToken, Recoverable, ERC20 {
  using ProtoUtilV1 for IStore;
  using NTransferUtilV2 for IERC20;

  bytes32 public override coverKey;
  uint256 public override expiresOn;
  bool public finalized = false;

  event Finalized(uint256 amount);

  /**
   * @dev Constructs this contract
   * @param store Provide the store contract instance
   * @param key Enter the cover key or cover this cToken instance points to
   * @param expiry Provide the cover expiry timestamp of this cToken instance
   */
  constructor(
    IStore store,
    bytes32 key,
    uint256 expiry
  ) ERC20("NEP cTokens", "cNEP") Recoverable(store) {
    coverKey = key;
    expiresOn = expiry;
  }

  /**
   * @dev Mints cTokens when a policy is purchased.
   * This feature can only be accesed by the latest policy smart contract.
   * @param key Enter the cover key for which the cTokens are being minted
   * @param to Enter the address where the minted token will be sent
   * @param amount Specify the amount of cTokens to mint
   */
  function mint(
    bytes32 key,
    address to,
    uint256 amount
  ) external override {
    require(key == coverKey, "Invalid cover");
    s.mustBeExactContract(ProtoUtilV1.CNAME_POLICY, super._msgSender()); // Ensure the caller is the latest policy contract

    super._mint(to, amount);
  }

  /**
   * @dev Burns the tokens held by the sender
   * @param amount Specify the amount of tokens to burn
   */
  function burn(uint256 amount) external {
    super._burn(super._msgSender(), amount);
  }

  /**
   * @dev Todo: Finializes the cToken contract.
   * During this step, the policy fee paid by the users
   * will be transferred to the Cover Vault contract.
   */
  function finalize() external override {
    s.mustBeExactContract(ProtoUtilV1.CNAME_POLICY_MANAGER, super._msgSender()); // Ensure the caller is the latest policy manager contract
    require(block.timestamp >= expiresOn, "Wait until expiry"); // solhint-disable-line

    IERC20 liquidity = IERC20(s.getLiquidityToken());
    uint256 balance = liquidity.balanceOf(address(this));

    liquidity.ensureTransfer(super._msgSender(), balance);

    finalized = true;

    emit Finalized(balance);
  }
}
