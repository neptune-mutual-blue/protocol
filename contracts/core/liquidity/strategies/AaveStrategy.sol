// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;

import "../../Recoverable.sol";
import "../../../interfaces/ILendingStrategy.sol";
import "../../../interfaces/external/IAaveV2LendingPoolLike.sol";
import "../../../libraries/ProtoUtilV1.sol";
import "../../../libraries/StoreKeyUtil.sol";

contract AaveStrategy is ILendingStrategy, Recoverable {
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;
  using NTransferUtilV2 for IERC20;

  bytes32 private constant _KEY = keccak256(abi.encodePacked("lending", "strategy", "aave", "v2"));
  bytes32 public constant NS_DEPOSITS = "deposits";
  bytes32 public constant NS_WITHDRAWALS = "withdrawals";

  address public depositCertificate;
  IAaveV2LendingPoolLike public lendingPool;
  mapping(uint256 => bool) public supportedChains;

  constructor(
    IStore _s,
    IAaveV2LendingPoolLike _lendingPool,
    address _aToken
  ) Recoverable(_s) {
    depositCertificate = _aToken;
    lendingPool = _lendingPool;
  }

  function getDepositAsset() public view override returns (IERC20) {
    return IERC20(s.getStablecoin());
  }

  function getDepositCertificate() public view override returns (IERC20) {
    return IERC20(depositCertificate);
  }

  /**
   * @dev Gets info of this strategy by cover key
   * @param coverKey Enter the cover key
   * @param values[0] deposits Total amount deposited
   * @param values[1] withdrawals Total amount withdrawn
   */
  function getInfo(bytes32 coverKey) external view override returns (uint256[] memory values) {
    values = new uint256[](2);

    values[0] = s.getUintByKey(_getDepositsKey(coverKey));
    values[1] = s.getUintByKey(_getWithdrawalsKey(coverKey));
  }

  function deposit(
    bytes32 coverKey,
    uint256 amount,
    address onBehalfOf
  ) external override nonReentrant returns (uint256 certificateReceived) {
    s.mustNotBePaused();
    s.callerMustBeProtocolMember();

    IERC20 stablecoin = getDepositAsset();
    IERC20 aToken = getDepositCertificate();

    require(stablecoin.balanceOf(onBehalfOf) >= amount, "Balance insufficient");

    stablecoin.ensureTransferFrom(onBehalfOf, address(this), amount);

    lendingPool.deposit(address(getDepositAsset()), amount, address(this), 0);

    certificateReceived = aToken.balanceOf(address(this));

    aToken.ensureTransferFrom(address(this), onBehalfOf, amount);

    s.addUintByKey(_getDepositsKey(coverKey), amount);

    emit Deposited(coverKey, onBehalfOf, amount);
  }

  function withdraw(bytes32 coverKey, address sendTo) external virtual override nonReentrant returns (uint256 stablecoinWithdrawn) {
    s.mustNotBePaused();
    s.callerMustBeProtocolMember();

    IERC20 stablecoin = getDepositAsset();
    IERC20 aToken = getDepositCertificate();
    uint256 aTokenAmount = aToken.balanceOf(sendTo);

    if (aTokenAmount == 0) {
      return 0;
    }

    lendingPool.withdraw(address(stablecoin), aTokenAmount, address(this));
    stablecoinWithdrawn = stablecoin.balanceOf(address(this));

    s.addUintByKey(_getWithdrawalsKey(coverKey), stablecoinWithdrawn);

    emit Withdrawn(coverKey, sendTo, stablecoinWithdrawn);
  }

  function _getDepositsKey(bytes32 coverKey) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(_KEY, coverKey, NS_DEPOSITS));
  }

  function _getWithdrawalsKey(bytes32 coverKey) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(_KEY, coverKey, NS_WITHDRAWALS));
  }

  function getWeight() external pure override returns (uint256) {
    return 500;
  }

  function getKey() external pure override returns (bytes32) {
    return _KEY;
  }
}
