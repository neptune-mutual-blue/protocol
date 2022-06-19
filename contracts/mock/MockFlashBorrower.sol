// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/interfaces/IERC3156FlashLender.sol";

contract MockFlashBorrower is IERC3156FlashBorrower {
  IERC20 private _stablecoin;
  IERC3156FlashLender private _provider;
  bytes32 private _returnValue = keccak256("ERC3156FlashBorrower.onFlashLoan");
  bool private _createsApproval = true;

  constructor(IERC20 stablecoin, IERC3156FlashLender provider) {
    _stablecoin = stablecoin;
    _provider = provider;
  }

  function setStablecoin(IERC20 value) external {
    _stablecoin = value;
  }

  function setReturnValue(bytes32 value) external {
    _returnValue = value;
  }

  function setCreateApproval(bool value) external {
    _createsApproval = value;
  }

  function borrow(uint256 amount, bytes calldata data) external {
    uint256 allowance = _stablecoin.allowance(address(this), address(_provider));
    uint256 fee = _provider.flashFee(address(_stablecoin), amount);
    uint256 repayment = amount + fee;

    if (_createsApproval) {
      _stablecoin.approve(address(_provider), allowance + repayment);
    }

    _provider.flashLoan(this, address(_stablecoin), amount, data);
  }

  function onFlashLoan(
    address initiator,
    address, /*token*/
    uint256, /*amount*/
    uint256, /*fee*/
    bytes calldata /*data*/
  ) external view override returns (bytes32) {
    require(msg.sender == address(_provider), "FlashBorrower: Untrusted lender");
    require(initiator == address(this), "FlashBorrower: Untrusted loan initiator"); // solhint-disable-line
    return _returnValue;
  }
}
