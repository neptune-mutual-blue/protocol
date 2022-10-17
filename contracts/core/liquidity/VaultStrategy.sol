// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
import "./VaultLiquidity.sol";

pragma solidity ^0.8.0;

abstract contract VaultStrategy is VaultLiquidity {
  using ProtoUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using NTransferUtilV2 for IERC20;

  uint256 private _transferToStrategyEntry = 0;
  uint256 private _receiveFromStrategyEntry = 0;

  /**
   * @dev Transfers tokens to strategy contract(s).
   * Uses the hooks `preTransferToStrategy` and `postTransferToStrategy` on the vault delegate contract.
   *
   * @custom:suppress-acl This function is only callable by correct strategy contract as checked in `preTransferToStrategy` and `postTransferToStrategy`
   * @custom:suppress-reentrancy Custom reentrancy guard implemented
   * @custom:suppress-pausable
   *
   */
  function transferToStrategy(
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external override {
    require(address(token) != address(0), "Invalid token to transfer");
    require(coverKey == key, "Forbidden");
    require(strategyName > 0, "Invalid strategy");
    require(amount > 0, "Please specify amount");

    // Reentrancy check
    require(_transferToStrategyEntry == 0, "Access is denied");

    _transferToStrategyEntry = 1;

    /******************************************************************************************
      PRE
     ******************************************************************************************/
    delegate().preTransferToStrategy(msg.sender, token, coverKey, strategyName, amount);

    /******************************************************************************************
      BODY
     ******************************************************************************************/

    token.ensureTransfer(msg.sender, amount);

    /******************************************************************************************
      POST
     ******************************************************************************************/
    delegate().postTransferToStrategy(msg.sender, token, coverKey, strategyName, amount);

    emit StrategyTransfer(address(token), msg.sender, strategyName, amount);
    _transferToStrategyEntry = 0;
  }

  /**
   * @dev Receives tokens from strategy contract(s).
   * Uses the hooks `preReceiveFromStrategy` and `postReceiveFromStrategy` on the vault delegate contract.
   *
   * @custom:suppress-acl This function is only callable by correct strategy contract as checked in `preReceiveFromStrategy` and `postReceiveFromStrategy`
   * @custom:suppress-reentrancy Custom reentrancy guard implemented
   * @custom:suppress-pausable Validated in `preReceiveFromStrategy` and `postReceiveFromStrategy`
   *
   */
  function receiveFromStrategy(
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external override {
    require(coverKey == key, "Forbidden");
    require(_receiveFromStrategyEntry == 0, "Access is denied");
    require(amount > 0, "Please specify amount");

    _receiveFromStrategyEntry = 1;

    /******************************************************************************************
      PRE
     ******************************************************************************************/
    delegate().preReceiveFromStrategy(msg.sender, token, coverKey, strategyName, amount);

    /******************************************************************************************
      BODY
     ******************************************************************************************/

    token.ensureTransferFrom(msg.sender, address(this), amount);

    /******************************************************************************************
      POST
     ******************************************************************************************/
    (uint256 income, uint256 loss) = delegate().postReceiveFromStrategy(msg.sender, token, coverKey, strategyName, amount);

    emit StrategyReceipt(address(token), msg.sender, strategyName, amount, income, loss);
    _receiveFromStrategyEntry = 0;
  }
}
