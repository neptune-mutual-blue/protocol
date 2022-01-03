const acl = require('./access-control')
const address = require('./address')
const erc20 = require('./erc-20')
const nonReentrancy = require('./non-reentrancy')
const notImplemented = require('./not-implemented')
const pausable = require('./pausable')
const revert = require('./revert')
const todo = require('./todo')

module.exports = [acl, address, erc20, nonReentrancy, notImplemented, pausable, revert, todo]
