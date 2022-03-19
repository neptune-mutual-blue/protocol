const isLib = (name) => {
  const contract = (name || '').toLowerCase().split('/').pop()

  if (contract.indexOf('lib') > -1 || contract.indexOf('util') > -1 || contract.indexOf('helper') > -1) {
    return true
  }

  return false
}

module.exports = { isLib }
