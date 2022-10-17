// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "./VaultDelegateWithFlashLoan.sol";

/**
 * @title Vault Delegate
 *
 * @dev Because vaults cannot be upgraded individually, all vaults delegate some logic to this contract.
 *
 * @notice Liquidity providers can earn fees by adding stablecoin liquidity
 * to any cover contract. The cover pool is collectively owned by liquidity providers
 * where fees automatically get accumulated and compounded.
 *
 * <br /> <br />
 *
 * **Fees:**
 *
 * - Cover fees paid in stablecoin get added to the liquidity pool.
 * - The protocol supplies a small portion of idle assets to third-party lending protocols.
 * - Flash loan interest also gets added back to the pool.
 * - Cover creators can donate a small portion of their revenue as a reassurance fund
 * to protect liquidity providers. This assists liquidity providers in the event of an exploit
 * by preventing pool depletion.
 *
 */
contract VaultDelegate is VaultDelegateWithFlashLoan {
  constructor(IStore store) VaultDelegateBase(store) {} // solhint-disable-line
}
