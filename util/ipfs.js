const bs58 = require('bs58')
const IPFS = require('ipfs-mini')
const node = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

const toBytes32 = (ipfsListing) => `0x${bs58.decode(ipfsListing).slice(2).toString('hex')}`
const toIPFShash = (bytes32Hex) => bs58.encode(Buffer.from(`1220${bytes32Hex.slice(2)}`, 'hex'))

const write = async (contents) => {
  const formatted = JSON.stringify(contents, null, 2)
  return toBytes32(await node.add(formatted))
}

const read = async (key) => {
  const raw = await node.cat(toIPFShash(key))
  return JSON.parse(raw)
}

module.exports = { toBytes32, toIPFShash, write, read }
