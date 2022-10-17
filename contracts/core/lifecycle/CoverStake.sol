// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "../../interfaces/ICoverStake.sol";
import "../../libraries/NTransferUtilV2.sol";
import "../Recoverable.sol";

/**
 * @title Cover Stake
 * @dev When you create a new cover, you have to specify the amount of
 * NPM tokens you wish to stake as a cover creator.
 *
 * <br /> <br />
 *
 * To demonstrate support for a cover pool, anyone can add and remove
 * NPM stakes (minimum required). The higher the sake, the more visibility
 * the contract gets if there are multiple cover contracts with the same name
 * or similar terms. Even when there are no duplicate contract, a higher stake
 * would normally imply a better cover pool commitment.
 *
 */
contract CoverStake is ICoverStake, Recoverable {
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using CoverUtilV1 for IStore;
  using ValidationLibV1 for IStore;
  using NTransferUtilV2 for IERC20;
  using RoutineInvokerLibV1 for IStore;

  /**
   * @dev Constructs this contract
   * @param store Provide the store contract instance
   */
  constructor(IStore store) Recoverable(store) {} // solhint-disable-line

  /**
   * @dev Increase the stake of the given cover pool
   *
   * @custom:suppress-acl Can only be accessed by the latest cover contract
   *
   * @param coverKey Enter the cover key
   * @param account Enter the account from where the NPM tokens will be transferred
   * @param amount Enter the amount of stake
   * @param fee Enter the fee amount. Note: do not enter the fee if you are directly calling this function.
   *
   */
  function increaseStake(
    bytes32 coverKey,
    address account,
    uint256 amount,
    uint256 fee
  ) external override nonReentrant {
    s.mustNotBePaused();
    s.mustBeValidCoverKey(coverKey);
    s.senderMustBeCoverContract();

    require(amount >= fee, "Invalid fee");

    s.npmToken().ensureTransferFrom(msg.sender, address(this), amount);

    if (fee > 0) {
      s.npmToken().ensureTransfer(s.getBurnAddress(), fee);
      emit FeeBurned(coverKey, fee);
    }

    // @suppress-subtraction Checked usage. Fee is always less than amount
    // if we reach this far.
    s.addUintByKeys(ProtoUtilV1.NS_COVER_STAKE, coverKey, amount - fee);
    s.addUintByKeys(ProtoUtilV1.NS_COVER_STAKE_OWNED, coverKey, account, amount - fee);

    emit StakeAdded(coverKey, account, amount - fee);
  }

  /**
   * @dev Decreases the stake from the given cover pool.
   * A cover creator can withdraw their full stake after 365 days
   *
   * @custom:suppress-acl This is a publicly accessible feature
   *
   * @param coverKey Enter the cover key
   * @param amount Enter the amount of stake to decrease
   *
   */
  function decreaseStake(bytes32 coverKey, uint256 amount) external override nonReentrant {
    s.mustNotBePaused();
    s.mustBeValidCoverKey(coverKey);
    s.mustEnsureAllProductsAreNormal(coverKey);

    uint256 drawingPower = _getDrawingPower(coverKey, msg.sender);
    require(amount > 0, "Please specify amount");
    require(drawingPower >= amount, "Exceeds your drawing power");

    // @suppress-subtraction
    s.subtractUintByKeys(ProtoUtilV1.NS_COVER_STAKE, coverKey, amount);
    s.subtractUintByKeys(ProtoUtilV1.NS_COVER_STAKE_OWNED, coverKey, msg.sender, amount);

    s.npmToken().ensureTransfer(msg.sender, amount);

    s.updateStateAndLiquidity(coverKey);

    emit StakeRemoved(coverKey, msg.sender, amount);
  }

  /**
   * @dev Gets the stake of an account for the given cover key
   * @param coverKey Enter the cover key
   * @param account Specify the account to obtain the stake of
   * @return Returns the total stake of the specified account on the given cover key
   *
   */
  function stakeOf(bytes32 coverKey, address account) public view override returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_STAKE_OWNED, coverKey, account);
  }

  /**
   * @dev Gets the drawing power of (the stake amount that can be withdrawn from)
   * an account.
   * @param coverKey Enter the cover key
   * @param account Specify the account to obtain the drawing power of
   * @return Returns the drawing power of the specified account on the given cover key
   *
   */
  function _getDrawingPower(bytes32 coverKey, address account) private view returns (uint256) {
    uint256 createdAt = s.getCoverCreationDate(coverKey);
    uint256 yourStake = stakeOf(coverKey, account);
    bool isOwner = account == s.getCoverOwner(coverKey);

    uint256 minStakeRequired = block.timestamp > createdAt + 365 days ? 0 : s.getMinCoverCreationStake(); // solhint-disable-line

    return isOwner ? yourStake - minStakeRequired : yourStake;
  }

  /**
   * @dev Version number of this contract
   */
  function version() external pure override returns (bytes32) {
    return "v0.1";
  }

  /**
   * @dev Name of this contract
   */
  function getName() external pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_COVER_STAKE;
  }
}
