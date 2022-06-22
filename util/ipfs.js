const axios = require('axios')

const write = async (contents) => {
  const { data } = await axios.put(process.env.NPM_IPFS_API_URL, contents)
  const { bytes32Hash, hash } = data

  console.info(`https://ipfs.neptunedefi.com/ipfs/${hash}`)

  return bytes32Hash
}

module.exports = { write }
