// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
import "./VaultBase.sol";

pragma solidity ^0.8.0;

abstract contract VaultLiquidity is VaultBase {
  using ProtoUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using NTransferUtilV2 for IERC20;

  /**
   * @dev Transfers stablecoins to claims processor contracts for claims payout.
   * Uses the hooks `preTransferGovernance` and `postTransferGovernance` on the vault delegate contract.
   *
   * @custom:suppress-acl This function is only callable by the claims processor as checked in `preTransferGovernance` and `postTransferGovernace`
   * @custom:suppress-pausable
   *
   */
  function transferGovernance(
    bytes32 coverKey,
    address to,
    uint256 amount
  ) external override nonReentrant {
    require(coverKey == key, "Forbidden");
    require(amount > 0, "Please specify amount");

    /******************************************************************************************
      PRE
     ******************************************************************************************/
    address stablecoin = delegate().preTransferGovernance(msg.sender, coverKey, to, amount);

    /******************************************************************************************
      BODY
     ******************************************************************************************/

    IERC20(stablecoin).ensureTransfer(to, amount);

    /******************************************************************************************
      POST
     ******************************************************************************************/
    delegate().postTransferGovernance(msg.sender, coverKey, to, amount);
    emit GovernanceTransfer(to, amount);
  }

  /**
   * @dev Adds liquidity to the specified cover contract.
   * Uses the hooks `preAddLiquidity` and `postAddLiquidity` on the vault delegate contract.
   *
   * @custom:suppress-acl This is a publicly accessible feature
   * @custom:suppress-pausable
   *
   *
   */
  function addLiquidity(AddLiquidityArgs calldata args) external override nonReentrant {
    require(args.coverKey == key, "Forbidden");
    require(args.amount > 0, "Please specify amount");

    /******************************************************************************************
      PRE
     ******************************************************************************************/

    (uint256 podsToMint, uint256 previousNpmStake) = delegate().preAddLiquidity(msg.sender, args.coverKey, args.amount, args.npmStakeToAdd);

    require(podsToMint > 0, "Can't determine PODs");

    /******************************************************************************************
      BODY
     ******************************************************************************************/

    IERC20(sc).ensureTransferFrom(msg.sender, address(this), args.amount);

    if (args.npmStakeToAdd > 0) {
      IERC20(s.getNpmTokenAddressInternal()).ensureTransferFrom(msg.sender, address(this), args.npmStakeToAdd);
    }

    super._mint(msg.sender, podsToMint);

    /******************************************************************************************
      POST
     ******************************************************************************************/

    delegate().postAddLiquidity(msg.sender, args.coverKey, args.amount, args.npmStakeToAdd);

    emit PodsIssued(msg.sender, podsToMint, args.amount, args.referralCode);

    if (previousNpmStake == 0) {
      emit Entered(args.coverKey, msg.sender);
    }

    emit NpmStaken(msg.sender, args.npmStakeToAdd);
  }

  /**
   * @dev Removes liquidity from the specified cover contract
   * Uses the hooks `preRemoveLiquidity` and `postRemoveLiquidity` on the vault delegate contract.
   *
   * @custom:suppress-acl This is a publicly accessible feature
   * @custom:suppress-pausable
   *
   * @param coverKey Enter the cover key
   * @param podsToRedeem Enter the amount of pods to redeem
   * @param npmStakeToRemove Enter the amount of NPM stake to remove.
   */
  function removeLiquidity(
    bytes32 coverKey,
    uint256 podsToRedeem,
    uint256 npmStakeToRemove,
    bool exit
  ) external override nonReentrant {
    require(coverKey == key, "Forbidden");
    require(podsToRedeem > 0 || npmStakeToRemove > 0, "Please specify amount");

    /******************************************************************************************
      PRE
     ******************************************************************************************/
    (address stablecoin, uint256 stablecoinToRelease) = delegate().preRemoveLiquidity(msg.sender, coverKey, podsToRedeem, npmStakeToRemove, exit);

    /******************************************************************************************
      BODY
     ******************************************************************************************/
    if (podsToRedeem > 0) {
      IERC20(address(this)).ensureTransferFrom(msg.sender, address(this), podsToRedeem);
      IERC20(stablecoin).ensureTransfer(msg.sender, stablecoinToRelease);
    }

    super._burn(address(this), podsToRedeem);

    // Unstake NPM tokens
    if (npmStakeToRemove > 0) {
      IERC20(s.getNpmTokenAddressInternal()).ensureTransfer(msg.sender, npmStakeToRemove);
    }

    /******************************************************************************************
      POST
     ******************************************************************************************/
    delegate().postRemoveLiquidity(msg.sender, coverKey, podsToRedeem, npmStakeToRemove, exit);

    emit PodsRedeemed(msg.sender, podsToRedeem, stablecoinToRelease);

    if (exit) {
      emit Exited(coverKey, msg.sender);
    }

    if (npmStakeToRemove > 0) {
      emit NpmUnstaken(msg.sender, npmStakeToRemove);
    }
  }

  /**
   * @dev Calculates the amount of PODS to mint for the given amount of liquidity to transfer
   */
  function calculatePods(uint256 forStablecoinUnits) external view override returns (uint256) {
    return delegate().calculatePodsImplementation(key, forStablecoinUnits);
  }

  /**
   * @dev Calculates the amount of stablecoins to withdraw for the given amount of PODs to redeem
   */
  function calculateLiquidity(uint256 podsToBurn) external view override returns (uint256) {
    return delegate().calculateLiquidityImplementation(key, podsToBurn);
  }

  /**
   * @dev Returns the stablecoin balance of this vault
   * This also includes amounts lent out in lending strategies
   */
  function getStablecoinBalanceOf() external view override returns (uint256) {
    return delegate().getStablecoinBalanceOfImplementation(key);
  }

  /**
   * @dev Accrues interests from external strategies
   *
   * @custom:suppress-acl This is a publicly accessible feature
   * @custom:suppress-pausable Validated in `accrueInterestImplementation`
   *
   */
  function accrueInterest() external override nonReentrant {
    delegate().accrueInterestImplementation(msg.sender, key);
    emit InterestAccrued(key);
  }
}
