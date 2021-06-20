// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../../interfaces/IStore.sol";
import "../../interfaces/ICover.sol";
import "../../interfaces/ICoverStake.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/CoverUtilV1.sol";
import "../../libraries/NTransferUtilV2.sol";
import "../Recoverable.sol";
import "../../interfaces/ICoverStake.sol";
import "../../interfaces/ICoverLiquidity.sol";

contract Cover is ICover, Recoverable {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using CoverUtilV1 for IStore;
  using NTransferUtilV2 for IERC20;

  IStore public s;
  ICoverStake public staking;

  event CoverCreated(bytes32 key, bytes32 info, uint256 stakeWithFee, uint256 liquidity);

  constructor(
    IStore store,
    address liquidity,
    string memory liquidityName
  ) {
    s = store;

    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER_LIQUIDITY_TOKEN).toKeccak256();
    s.setAddress(k, liquidity);

    k = abi.encodePacked(ProtoUtilV1.KP_COVER_LIQUIDITY_NAME).toKeccak256();
    s.setString(k, liquidityName);
  }

  /**
   * @dev Adds a new cover contract
   * @param key Enter a unique key for this cover
   * @param info IPFS info of the cover contract
   * @param stakeWithFee Enter the total NEP amount (stake + fee) to transfer to this contract.
   * @param liquidity Optional. Enter the initial stablecoin liquidity for this cover.
   */
  function addCover(
    bytes32 key,
    bytes32 info,
    uint256 stakeWithFee,
    uint256 liquidity
  ) external nonReentrant {
    IProtocol proto = s.getProtocol();
    uint256 fee = proto.getCoverFee();
    uint256 minStake = proto.getMinCoverStake();

    require(stakeWithFee > fee + minStake, "NEP Insufficient"); // Insufficient NEP supplied

    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER, key).toKeccak256();
    require(s.getBool(k) == false, "Already exists"); // Cover already exists

    // Add a new cover
    s.setBool(k, true);

    // Cover owner
    k = abi.encodePacked(ProtoUtilV1.KP_COVER_OWNER, key).toKeccak256();
    s.setAddress(k, super._msgSender());

    k = abi.encodePacked(ProtoUtilV1.KP_COVER_INFO, key).toKeccak256();
    s.setBytes32(k, info);

    k = abi.encodePacked(ProtoUtilV1.KP_COVER_FEE, key).toKeccak256();
    s.setUint(k, fee);

    getStakingContract().increaseStake(key, super._msgSender(), stakeWithFee - fee);

    IERC20 nep = s.nepToken();

    nep.ensureTransferFrom(super._msgSender(), address(this), stakeWithFee);
    _burn(nep, fee);

    proto.vaultDeposit(getName(), key, nep, super._msgSender(), stakeWithFee - fee);

    if (liquidity > 0) {
      getLiquidityContract().addLiquidity(key, super._msgSender(), liquidity);
    }

    emit CoverCreated(key, info, stakeWithFee, liquidity);
  }

  function updateCover(bytes32 key, bytes32 info) external nonReentrant {
    // only cover owner or admin
    s.onlyCoverOwner(key, super._msgSender(), owner());

    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER_INFO, key).toKeccak256();
    s.setBytes32(k, info);
  }

  function getCover(bytes32 key)
    external
    view
    returns (
      address owner,
      bytes32 info,
      uint256[] memory values
    )
  {
    return s.getCoverInfo(key);
  }

  function version() external pure override returns (bytes32) {
    return "v0.1";
  }

  function getStakingContract() public view returns (ICoverStake) {
    return ICoverStake(ProtoUtilV1.getContract(s, ProtoUtilV1.CONTRACTS_COVER_STAKE));
  }

  function getLiquidityContract() public view returns (ICoverLiquidity) {
    return ICoverLiquidity(ProtoUtilV1.getContract(s, ProtoUtilV1.CONTRACTS_COVER_LIQUIDITY));
  }

  function getName() public pure override returns (bytes32) {
    return ProtoUtilV1.CONTRACTS_COVER;
  }

  function _burn(IERC20 token, uint256 amount) private {
    address burnAddress = s.getBurnAddress();
    token.ensureTransfer(burnAddress, amount);
  }
}
