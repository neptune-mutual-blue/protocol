const { ethers } = require('hardhat')
const { covers } = require('../../examples')
const composer = require('../composer')
const { ether, getRandomNumber, weiAsToken, STABLECOIN_DECIMALS } = require('../helper')
const { approve } = require('../contract-helper/erc20')
const { key } = require('..')
const PRECISION = STABLECOIN_DECIMALS

const add = async (coverKey, payload) => {
  const [lp] = await ethers.getSigners() // eslint-disable-line
  const amount = ether(getRandomNumber(1_250_000, 5_000_000), PRECISION)
  const npmStakeToAdd = ether(getRandomNumber(1000, 125_000))

  const { dai, npm } = payload
  const vault = await composer.vault.getVault(payload, coverKey)

  console.info('%s %s %s', vault.address, dai.address, npm.address)

  await approve(dai.address, vault.address, lp, ethers.constants.MaxUint256)
  await approve(npm.address, vault.address, lp, ethers.constants.MaxUint256)

  console.info('Adding %s to the vault. Stake: %s. From: %s', weiAsToken(amount, 'DAI', PRECISION), weiAsToken(npmStakeToAdd, 'NPM'), lp.address)

  await vault.addLiquidity({
    coverKey,
    amount,
    npmStakeToAdd,
    referralCode: key.toBytes32('')
  })

  console.info('Added %s to the vault. Stake: %s', weiAsToken(amount, 'DAI', PRECISION), weiAsToken(npmStakeToAdd, 'NPM'))
}

const addLiquidity = async (payload) => {
  for (const i in covers) {
    const { coverKey, coverName } = covers[i]

    console.info('Adding liquidity to %s', coverName)
    await add(coverKey, payload)
  }
}

module.exports = { addLiquidity }
