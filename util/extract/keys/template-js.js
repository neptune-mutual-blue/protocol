const pre = `const ethers = require('ethers')

const encodeKey = (x) => ethers.utils.solidityKeccak256(['bytes32'], [toBytes32(x)])
const encodeKeys = (x, y) => ethers.utils.solidityKeccak256(x, y)
const toBytes32 = (x) => ethers.utils.formatBytes32String(x)
const getCoverContractKey = (namespace, coverKey) => encodeKeys(['bytes32', 'bytes32'], [toBytes32(namespace), coverKey])
const qualifyBytes32 = (k) => encodeKeys(['bytes32', 'bytes32'], [PROTOCOL.NS.CONTRACTS, k])
const qualify = (k) => encodeKeys(['bytes32', 'address'], [PROTOCOL.NS.CONTRACTS, k])
const qualifyMember = (k) => encodeKeys(['bytes32', 'address'], [PROTOCOL.NS.MEMBERS, k])`

const post = `module.exports = {
  encodeKey,
  encodeKeys,
  toBytes32,
  getCoverContractKey,
  qualify,
  qualifyMember,
  qualifyBytes32,
  {{scopes}}
}`

module.exports = { pre, post }
