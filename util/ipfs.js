const bs58 = require('bs58')
const { IPFSClient } = require('./net/ipfs-client')

const fallbackNodes = ['https://api.thegraph.com/ipfs']

const toBytes32 = (ipfsListing) => `0x${bs58.decode(ipfsListing).slice(2).toString('hex')}`
const toIPFShash = (bytes32Hex) => bs58.encode(Buffer.from(`1220${bytes32Hex.slice(2)}`, 'hex'))

const write = async (contents, nodeUrls = fallbackNodes) => {
  const formatted = JSON.stringify(contents, null, 2)

  const client = new IPFSClient(nodeUrls)

  const hash = await client.addString(formatted)

  if (hash === undefined) {
    return undefined
  }

  console.info(`https://ipfs.neptunedefi.com/ipfs/${hash}`)

  return toBytes32(hash)
}

const read = async (key, nodeUrls = fallbackNodes) => {
  const client = new IPFSClient(nodeUrls)

  const raw = await client.getString(key)

  if (raw !== undefined) {
    return JSON.parse(raw)
  }

  return raw // which is undefined
}

const readBytes32 = async (key) => {
  return read(toIPFShash(key))
}

module.exports = { toBytes32, toIPFShash, write, read, readBytes32 }
