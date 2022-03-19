const { ethers } = require('hardhat')
const { ether } = require('../helper')

const request = async (token, amount) => {
  const [owner] = await ethers.getSigners()

  const balance = await token.balanceOf(owner.address)

  if (balance.gte(amount || '0')) {
    return
  }

  const contract = await new ethers.Contract(token.address, ['function mint(uint256) external'], owner)
  console.info('Requesting tokens')

  const tx = await contract.connect(owner).mint(amount || ether(1_000_000))
  await tx.wait()
}

module.exports = { request }
