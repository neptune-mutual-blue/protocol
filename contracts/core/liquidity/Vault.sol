// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/interfaces/IERC3156FlashLender.sol";
import "./WithFlashLoan.sol";

pragma solidity 0.8.0;

contract Vault is WithFlashLoan {
  using ProtoUtilV1 for IStore;
  using RegistryLibV1 for IStore;

  constructor(
    IStore store,
    bytes32 coverKey,
    string memory tokenName,
    string memory tokenSymbol,
    IERC20 liquidityToken
  ) VaultBase(store, coverKey, tokenName, tokenSymbol, liquidityToken) {} // solhint-disable-line

  /**
   * @dev For further details, check delegate contract's documentation.
   */
  function getInfo(address you) external view override returns (uint256[] memory values) {
    return delgate().getInfoImplementation(key, you);
  }

  function version() external pure override returns (bytes32) {
    return "v0.1";
  }

  function getName() external pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_LIQUIDITY_VAULT;
  }
}
