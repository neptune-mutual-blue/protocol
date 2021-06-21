// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../interfaces/IStore.sol";
import "../interfaces/ICoverStake.sol";
import "../interfaces/ICoverAssurance.sol";
import "../interfaces/ICoverLiquidity.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./ProtoUtilV1.sol";

library CoverUtilV1 {
  using ProtoUtilV1 for IStore;

  function ensureValidCover(IStore s, bytes32 key) external view {
    require(_getStatus(s, key) != 1, "Cover on Maintenance");

    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.KP_COVER, key));
    require(s.getBool(k), "Cover does not exist");
  }

  function ensureCoverOwner(
    IStore s,
    bytes32 key,
    address sender,
    address owner
  ) external view {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.KP_COVER_OWNER, key));
    bool isCoverOwner = s.getAddress(k) == sender;
    bool isOwner = sender == owner;

    require(isOwner || isCoverOwner, "Forbidden");
  }

  /**
   * @dev Gets the current status of the protocol
   *
   * 0 - normal
   * 1 - stopped, can not purchase covers or add liquidity
   * 2 - reporting, incident happened
   * 3 - reporting, false reporting
   * 4 - claimable, claims accepted for payout
   *
   */
  function getStatus(IStore s, bytes32 key) external view returns (uint256) {
    return _getStatus(s, key);
  }

  function getLiquidity(IStore s, bytes32 key) public view returns (uint256) {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.KP_COVER_LIQUIDITY, key));
    return s.getUint(k);
  }

  function getStake(IStore s, bytes32 key) public view returns (uint256) {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.KP_COVER_STAKE, key));
    return s.getUint(k);
  }

  function getClaimable(IStore s, bytes32 key) external view returns (uint256) {
    return _getClaimable(s, key);
  }

  function getCoverInfo(IStore s, bytes32 key)
    external
    view
    returns (
      address owner,
      bytes32 info,
      uint256[] memory values
    )
  {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.KP_COVER_INFO, key));
    info = s.getBytes32(k);

    k = keccak256(abi.encodePacked(ProtoUtilV1.KP_COVER_OWNER, key));
    owner = s.getAddress(k);

    values = new uint256[](5);

    values[0] = s.getUint(keccak256(abi.encodePacked(ProtoUtilV1.KP_COVER_FEE, key)));
    values[1] = s.getUint(keccak256(abi.encodePacked(ProtoUtilV1.KP_COVER_STAKE, key)));
    values[2] = s.getUint(keccak256(abi.encodePacked(ProtoUtilV1.KP_COVER_LIQUIDITY, key)));
    values[3] = s.getUint(keccak256(abi.encodePacked(ProtoUtilV1.KP_COVER_PROVISION, key)));
    values[4] = _getClaimable(s, key);
  }

  function getStakingContract(IStore s) public view returns (ICoverStake) {
    return ICoverStake(ProtoUtilV1.getContract(s, ProtoUtilV1.CONTRACTS_COVER_STAKE));
  }

  function getAssuranceContract(IStore s) public view returns (ICoverAssurance) {
    return ICoverAssurance(ProtoUtilV1.getContract(s, ProtoUtilV1.CONTRACTS_COVER_STAKE));
  }

  function getLiquidityContract(IStore s) public view returns (ICoverLiquidity) {
    return ICoverLiquidity(ProtoUtilV1.getContract(s, ProtoUtilV1.CONTRACTS_COVER_LIQUIDITY));
  }

  function _getClaimable(IStore s, bytes32 key) private view returns (uint256) {
    // Todo: deduct the expired cover amounts
    return s.getUint(keccak256(abi.encodePacked(ProtoUtilV1.KP_COVER_CLAIMABLE, key)));
  }

  function _getStatus(IStore s, bytes32 key) private view returns (uint256) {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.KP_COVER_STATUS, key));
    return s.getUint(k);
  }
}
