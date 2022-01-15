const ethers = require('ethers')

const toWalletAddress = (privateKey) => {
  const wallet = new ethers.Wallet(privateKey)
  return wallet.address
}

module.exports = {
  toWalletAddress
}
