const config = {
  mocha: {
    timeout: 250000
  },
  compilers: {
    solc: {
      version: '0.8.17',
      docker: false,
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
        evmVersion: 'istanbul'
      }
    }
  },
  db: {
    enabled: false
  }
}

module.exports = config
