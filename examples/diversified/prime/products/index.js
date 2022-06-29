const aave = require('./aave')
const balancer = require('./balancer')
const chainlink = require('./chainlink')
const curve = require('./curve')
const gnosisSafe = require('./gnosis-safe')
const maker = require('./maker')
const uniswap = require('./uniswap')

module.exports = [aave, balancer, chainlink, curve, gnosisSafe, maker, uniswap]
