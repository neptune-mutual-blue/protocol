const io = require('../io')
const { getData } = require('./data')

const addUpgrade = async (file, id, upgrade) => {
  const data = await getData(file)

  if (!data[id].upgrades) {
    data[id].upgrades = []
  }

  data[id].upgrades.push(upgrade)

  await io.writeFile(file, JSON.stringify(data, null, 2))
}

module.exports = { addUpgrade }
