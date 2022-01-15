const { ethers } = require('hardhat')
const erc20abi = require('../../abis/IERC20.json')

const getInstance = async (at, signer) => {
  const [owner] = await ethers.getSigners()
  return new ethers.Contract(at, erc20abi, signer || owner)
}

const approve = async (at, spender, signer) => {
  const erc20 = await getInstance(at, signer)
  const tx = await erc20.approve(spender, ethers.constants.MaxUint256)

  await tx.wait()
}

module.exports = { getInstance, approve }
