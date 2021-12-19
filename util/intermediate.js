const io = require('./io')

module.exports = async (cache, contract, action, ...args) => {
  const key = [action, contract.interface.encodeFunctionData(action, [...args])].join('.')

  const persisted = await io.fetchValue(cache, key)

  if (persisted) {
    global.log && console.log('[skip] %s(%s) to %s was found on the tx %s', action, JSON.stringify(args), contract.address, persisted)
    return
  }

  global.log && console.log('[tx] %s(%s) to %s', action, JSON.stringify(args), contract.address)

  const tx = await contract[action](...args)
  await io.cacheValue(cache, key, tx.hash)
}
