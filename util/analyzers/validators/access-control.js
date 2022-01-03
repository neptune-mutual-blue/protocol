const validate = async (code) => {
  if (code.indexOf('AccessControl') === -1 && code.toLowerCase().indexOf('@suppress-acl') === -1) {
    return '\x1b[31m' + '* Access control logic not found. Are you sure this function should be publicly accessible?' + '\x1b[0m'
  }

  return null
}

module.exports = validate
