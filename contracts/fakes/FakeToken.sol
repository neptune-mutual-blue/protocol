// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract FakeToken is ERC20 {
  address public immutable deployer;
  mapping(address => bool) public minters;

  function addMinter(address account, bool flag) public onlyDeployer {
    minters[account] = flag;
  }

  modifier onlyDeployer() {
    require(msg.sender == deployer, "Forbidden");
    _;
  }

  constructor(
    string memory name,
    string memory symbol,
    uint256 supply
  ) ERC20(name, symbol) {
    super._mint(msg.sender, supply);
    deployer = msg.sender;
    minters[msg.sender] = true;
  }

  function mint(uint256 amount) external {
    if (amount > 2000 ether) {
      require(minters[msg.sender], "Please specify a smaller value");
    }

    super._mint(msg.sender, amount);
  }

  function burn(uint256 amount) external {
    super._burn(msg.sender, amount);
  }
}
