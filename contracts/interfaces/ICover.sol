// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "./IMember.sol";

interface ICover is IMember {
  event CoverCreated(bytes32 key, bytes32 info, uint256 stakeWithFee, uint256 liquidity);
  event CoverUpdated(bytes32 key, bytes32 info);
}
