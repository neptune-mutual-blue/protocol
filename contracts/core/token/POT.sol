// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;

import "./NPM.sol";
import "../../interfaces/IStore.sol";

/**
 * @title Proof of Authority Tokens (POTs)
 *
 * @dev POTs can't be used outside of the protocol
 * for example in DEXes. Once NPM token is launched, it will replace POTs.
 *
 * For now, Neptune Mutual team and a few others will have access to POTs.
 *
 * POTs aren't conventional ERC-20 tokens; they can't be transferred freely;
 * they don't have any value, and therefore must not be purchased or sold.
 *
 * Agan, POTs are distributed to individuals and companies
 * who particpate in our governance and dispute management portals.
 *
 */
contract POT is NPM {
  IStore public immutable s;
  mapping(address => bool) public whitelist;
  bytes32 public constant NS_MEMBERS = "ns:members";

  event WhitelistUpdated(address indexed updatedBy, address[] accounts, bool[] statuses);

  constructor(address timelockOrOwner, IStore store) NPM(timelockOrOwner, "Neptune Mutual POT", "POT") {
    // require(timelockOrOwner != address(0), "Invalid owner"); // Already checked in `NPM`
    require(address(store) != address(0), "Invalid store");

    s = store;
    whitelist[address(this)] = true;
    whitelist[timelockOrOwner] = true;
  }

  function _throwIfNotProtocolMember(address account) private view {
    bytes32 key = keccak256(abi.encodePacked(NS_MEMBERS, account));
    bool isMember = s.getBool(key);

    // POTs can only be used within the Neptune Mutual protocol
    require(isMember == true, "Access denied");
  }

  function updateWhitelist(address[] calldata accounts, bool[] memory statuses) external onlyOwner {
    require(accounts.length > 0, "No account");
    require(accounts.length == statuses.length, "Invalid args");

    for (uint256 i = 0; i < accounts.length; i++) {
      whitelist[accounts[i]] = statuses[i];
    }

    emit WhitelistUpdated(msg.sender, accounts, statuses);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256
  ) internal view override whenNotPaused {
    // Token mints
    if (from == address(0)) {
      // aren't restricted
      return;
    }

    // Someone not whitelisted
    // ............................ can still transfer to a whitelisted address
    if (whitelist[from] == false && whitelist[to] == false) {
      // and to the Neptune Mutual Protocol contracts but nowhere else
      _throwIfNotProtocolMember(to);
    }
  }
}
