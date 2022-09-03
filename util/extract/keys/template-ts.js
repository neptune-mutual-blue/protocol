const pre = `import { keccak256 as solidityKeccak256 } from '@ethersproject/solidity'
import { formatBytes32String } from '@ethersproject/strings'

const encodeKey = (x: string): string => solidityKeccak256(['bytes32'], [x])
const encodeKeys = (x: string[], y: string[]): string => solidityKeccak256(x, y)
const toBytes32 = (x: string): string => formatBytes32String(x)
const getCoverContractKey = (namespace: string, coverKey: string): string => encodeKeys(['bytes32', 'bytes32'], [namespace, coverKey])
const qualifyBytes32 = (k: string): string => encodeKeys(['bytes32', 'bytes32'], [PROTOCOL.NS.CONTRACTS, k])
const qualify = (k: string): string => encodeKeys(['bytes32', 'address'], [PROTOCOL.NS.CONTRACTS, k])
const qualifyMember = (k: string): string => encodeKeys(['bytes32', 'address'], [PROTOCOL.NS.MEMBERS, k])`

const post = `export {
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
