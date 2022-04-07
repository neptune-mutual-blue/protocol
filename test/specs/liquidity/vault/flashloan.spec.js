/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
// const { helper } = require('../../../../util')
// const { deployDependencies } = require('./deps')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Flashloan', () => {
  // let deployed

  // before(async () => {
  //   deployed = await deployDependencies()
  // })

  // it('todo', async () => {

  // })
})
