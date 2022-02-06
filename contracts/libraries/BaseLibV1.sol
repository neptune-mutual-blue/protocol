// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
/* solhint-disable ordering  */
pragma solidity 0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./ValidationLibV1.sol";
import "./AccessControlLibV1.sol";
import "../interfaces/IProtocol.sol";
import "../interfaces/IPausable.sol";

library BaseLibV1 {
  using ValidationLibV1 for IStore;

  /**
   * @dev Recover all Ether held by the contract.
   * On success, no event is emitted because the recovery feature does
   * not have any significance in the SDK or the UI.
   */
  function recoverEtherInternal(address sendTo) external {
    // slither-disable-next-line arbitrary-send
    payable(sendTo).transfer(address(this).balance);
  }

  /**
   * @dev Recover all IERC-20 compatible tokens sent to this address.
   * On success, no event is emitted because the recovery feature does
   * not have any significance in the SDK or the UI.
   * @param token IERC-20 The address of the token contract
   */
  function recoverTokenInternal(address token, address sendTo) external {
    // @suppress-address-trust-issue Although the token can't be trusted, the recovery agent has to check the token code manually.
    IERC20 erc20 = IERC20(token);

    uint256 balance = erc20.balanceOf(address(this));
    require(erc20.transfer(sendTo, balance), "Transfer failed");
  }
}
