// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./IFinalization.sol";
import "./IResolvable.sol";
import "./IUnstakable.sol";
import "./IMember.sol";

//solhint-disable-next-line
interface IResolution is IFinalization, IResolvable, IUnstakable, IMember {

}
