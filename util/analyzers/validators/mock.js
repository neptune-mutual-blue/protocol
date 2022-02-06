const isMock = (name) => {
  if ((name || '').toLowerCase().split('/').indexOf('mock') > -1) {
    return true
  }

  if ((name || '').toLowerCase().split('/').indexOf('fake') > -1) {
    return true
  }

  return false
}

module.exports = { isMock }
