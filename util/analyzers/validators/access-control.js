const { isMock } = require('./mock')

const validate = async (code, _, name) => {
  if (isMock(name)) {
    return null
  }

  const hasAcl = code.indexOf('AccessControl') > -1
  const hasCallerCheck = code.indexOf('callerMustBe') > -1
  const hasOwnerCheck = code.indexOf('onlyOwner') > -1
  const isLibrary = (name || '').split('/').indexOf('libraries') > -1
  const suppressionMissing = code.toLowerCase().indexOf('@suppress-acl') === -1 && code.toLowerCase().indexOf('@custom:suppress-acl') === -1

  if (!(hasAcl || hasCallerCheck || hasOwnerCheck || isLibrary) && suppressionMissing) {
    return '\x1b[31m' + '* Access control logic not found. Are you sure this function should be publicly accessible?' + '\x1b[0m'
  }

  return null
}

module.exports = validate
