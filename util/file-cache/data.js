const io = require('../io')

const getData = async (file) => {
  const contents = await io.readFile(file)
  return JSON.parse(contents)
}

module.exports = { getData }
