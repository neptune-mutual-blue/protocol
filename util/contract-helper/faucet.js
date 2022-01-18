const { ethers } = require('hardhat')

const request = async (token) => {
  const [owner] = await ethers.getSigners()

  const balance = await token.balanceOf(owner.address)

  if (balance.gt(0)) {
    return
  }

  const contract = await new ethers.Contract(token.address, ['function request() external'], owner)
  console.info('Requesting tokens')

  const tx = await contract.request()
  await tx.wait()
}

module.exports = { request }
