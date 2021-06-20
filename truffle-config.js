const config = {
  mocha: {
    timeout: 250000
  },
  compilers: {
    solc: {
      version: '0.8.4',
      docker: false,
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
        evmVersion: 'byzantium'
      }
    }
  },
  db: {
    enabled: false
  }
}

module.exports = config
