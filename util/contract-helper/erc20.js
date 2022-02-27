const { ethers, network } = require('hardhat')
const erc20abi = require('../../abis/IERC20Detailed.json')

const getInstance = async (at, signer) => {
  const [owner] = await ethers.getSigners()
  return new ethers.Contract(at, erc20abi, signer || owner)
}

const approve = async (tokenAddress, spender, account, amount = ethers.constants.MaxUint256) => {
  const erc20 = await getInstance(tokenAddress, account)

  if (network.name !== 'hardhat') {
    const allowance = await erc20.allowance(account.address, spender)
    const symbol = await erc20.symbol()

    if (allowance.gte(amount)) {
      console.info('Spender %s already approved to spend %s from account %s', spender, symbol, account.address)
      return
    }
  }

  const tx = await erc20.connect(account).approve(spender, amount)
  await tx.wait()
}

module.exports = { getInstance, approve }
