const { exec } = require('./exec')

const main = async () => {
  await exec('rm -rf ./.flatsol && mkdir ./.flatsol')
  await exec('flatsol ./contracts/core/store/Store.sol > ./.flatsol/Store.flat.sol')
  await exec('flatsol ./contracts/core/Protocol.sol > ./.flatsol/Protocol.flat.sol')
}

main()
