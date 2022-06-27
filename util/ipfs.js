const axios = require('axios')

const write = async (contents) => {
  const { data } = await axios.put(process.env.NPM_IPFS_API_URL, contents)
  const { bytes32Hash, hash } = data

  // June 22 Security Review: use an entirely different domain for
  // hosting IPFS server to avoid phishing attacks on the
  // Neptune Mutual domain(s)
  console.info(process.env.IPFS_GATEWAY, hash)

  return bytes32Hash
}

module.exports = { write }
