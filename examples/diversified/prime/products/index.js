const aave = require('./aave')
const balancer = require('./balancer')
const chainlink = require('./chainlink')
const compound = require('./compound')
const curve = require('./curve')
const maker = require('./maker')
const uniswap = require('./uniswap')

module.exports = [aave, balancer, chainlink, compound, curve, maker, uniswap]
