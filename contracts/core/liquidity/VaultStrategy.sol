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

  function transferToStrategy(
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external override {
    // @suppress-acl This function is only callable by correct strategy contract as checked in `preTransferToStrategy` and `postTransferToStrategy`
    // @suppress-pausable Validated in `preTransferToStrategy` and `postTransferToStrategy`
    // @suppress-reentrancy Custom reentrancy guard implemented
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
    delgate().preTransferToStrategy(msg.sender, token, coverKey, strategyName, amount);

    /******************************************************************************************
      BODY
     ******************************************************************************************/

    token.ensureTransfer(msg.sender, amount);

    /******************************************************************************************
      POST
     ******************************************************************************************/
    delgate().postTransferToStrategy(msg.sender, token, coverKey, strategyName, amount);

    emit StrategyTransfer(address(token), msg.sender, strategyName, amount);
    _transferToStrategyEntry = 0;
  }

  function receiveFromStrategy(
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external override {
    // @suppress-acl This function is only callable by correct strategy contract as checked in `preReceiveFromStrategy` and `postReceiveFromStrategy`
    // @suppress-pausable Validated in `preReceiveFromStrategy` and `postReceiveFromStrategy`
    // @suppress-reentrancy Custom reentrancy guard implemented
    require(coverKey == key, "Forbidden");
    require(_receiveFromStrategyEntry == 0, "Access is denied");
    require(amount > 0, "Please specify amount");

    _receiveFromStrategyEntry = 1;

    /******************************************************************************************
      PRE
     ******************************************************************************************/
    delgate().preReceiveFromStrategy(msg.sender, token, coverKey, strategyName, amount);

    /******************************************************************************************
      BODY
     ******************************************************************************************/

    token.ensureTransferFrom(msg.sender, address(this), amount);

    /******************************************************************************************
      POST
     ******************************************************************************************/
    (uint256 income, uint256 loss) = delgate().postReceiveFromStrategy(msg.sender, token, coverKey, strategyName, amount);

    emit StrategyReceipt(address(token), msg.sender, strategyName, amount, income, loss);
    _receiveFromStrategyEntry = 0;
  }
}
