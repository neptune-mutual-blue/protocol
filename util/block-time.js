const networks = {
  1: {
    approximateBlockTime: 15
  },
  3: {
    approximateBlockTime: 12
  },
  42: {
    approximateBlockTime: 4
  },
  97: {
    approximateBlockTime: 3
  },
  80001: {
    approximateBlockTime: 3

  },
  31337: {
    approximateBlockTime: 1
  }
}

const minutesToBlocks = (chainId, minutes) => {
  const seconds = minutes * 60
  const { approximateBlockTime } = networks[chainId]

  return seconds / approximateBlockTime
}

const hoursToBlocks = (chainId, hours) => {
  const minutes = hours * 60
  return minutesToBlocks(chainId, minutes)
}

const daysToBlocks = (chainId, days) => {
  const hours = days * 24
  return hoursToBlocks(chainId, hours)
}

module.exports = { minutesToBlocks, hoursToBlocks, daysToBlocks }
