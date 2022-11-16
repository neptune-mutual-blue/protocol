const axios = require('axios')

const write = async (contents) => {
  const { data } = await axios.put(process.env.NPM_IPFS_API_URL, contents)
  const { hash } = data

  return hash
}

module.exports = { write }
