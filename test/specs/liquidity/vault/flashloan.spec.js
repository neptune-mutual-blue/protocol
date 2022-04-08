/* eslint-disable no-unused-expressions */
const { ethers } = require('hardhat')
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../../util')
const { deployDependencies } = require('./deps')

const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Flashloan', () => {
  let deployed, borrower

  before(async () => {
    deployed = await deployDependencies()
    borrower = await deployer.deploy(cache, 'MockFlashBorrower', deployed.dai.address, deployed.vault.address)
  })

  it('must successfully lend out a flash loan', async () => {
    const amount = '8000'
    const fee = await deployed.vault.flashFee(deployed.dai.address, amount)

    // First transfer the fee to the contract
    await deployed.dai.transfer(borrower.address, fee)

    deployed.vault.on('FlashLoanBorrowed', (_lender, _borrower, _stablecoin, _amount, _fee) => {
      _lender.should.equal(deployed.vault.address)
      _borrower.should.equal(borrower.address)
      _stablecoin.should.equal(deployed.dai.address)
      _amount.should.equal(amount)
      _fee.should.equal(fee)
    })

    await borrower.borrow(amount, 0)
  })

  it('must revert when a vault has insufficient balance', async () => {
    const amount = helper.ether(1_000_000_000)
    await borrower.borrow(amount, 0)
      .should.be.rejectedWith('Amount insufficient')
  })

  it('must revert when zero amount is specified', async () => {
    const amount = '0'
    await borrower.borrow(amount, 0)
      .should.be.rejectedWith('Please specify amount')
  })

  it('must revert when the loan is too small', async () => {
    await borrower.borrow('1', 0).should.be.rejectedWith('Loan too small')
    await borrower.borrow('7999', 0).should.be.rejectedWith('Loan too small')
  })

  it('must revert when an unknown token is being requested', async () => {
    const amount = helper.ether(1)

    await borrower.setStablecoin(deployed.npm.address)

    await borrower.borrow(amount, 0)
      .should.be.rejectedWith('Unsupported token')

    // Reset back
    await borrower.setStablecoin(deployed.dai.address)
  })

  it('must revert when an invalid value is returned', async () => {
    const amount = '8000'
    const fee = await deployed.vault.flashFee(deployed.dai.address, amount)

    // First transfer the fee to the contract
    await deployed.dai.transfer(borrower.address, fee)

    await borrower.setReturnValue(key.toBytes32('foobar'))

    await borrower.borrow(amount, 0)
      .should.be.rejectedWith('IERC3156: Callback failed')

    // Reset back
    await borrower.setReturnValue(ethers.utils.solidityKeccak256(['string'], ['ERC3156FlashBorrower.onFlashLoan']))
  })
})
