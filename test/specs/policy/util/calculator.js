const getCoverFee = (data, amount, duration, days, precision, debug = false) => {
  const truncate = (x, p) => Math.trunc(x * Math.pow(10, p)) / Math.pow(10, p)

  if (!amount) {
    return
  }

  data.reassuranceFund = (data.reassuranceAmount * data.INCIDENT_SUPPORT_POOL_CAP_RATIO) / data.MULTIPLIER
  data.totalAvailableLiquidity = data.inVault + data.reassuranceFund

  if (amount > data.totalAvailableLiquidity) {
    throw new Error('Balance insufficient')
  }

  // solidity-like truncation
  data.utilizationRatio = truncate(((data.totalCommitment + amount) / data.totalAvailableLiquidity), 4)

  {
    const multiplier = 10 ** precision
    debug && console.debug('[js] s: %s. p: %s. u: %s', data.inVault * multiplier, data.reassuranceFund * multiplier, data.utilizationRatio * 10_000)
    debug && console.debug('[js] c: %s, a: %s. t: %s', data.totalCommitment * multiplier, amount * multiplier, data.totalAvailableLiquidity * multiplier)
  }

  let rate = data.utilizationRatio > data.floor ? data.utilizationRatio : data.floor

  rate = rate + (duration * 100 / data.MULTIPLIER)

  if (rate > data.ceiling) {
    rate = data.ceiling
  }

  data.rate = rate
  data.projectedFee = (amount * data.rate * days) / 365

  return data.projectedFee
}

const getCoverFeeBn = (payload, amount, duration, days, debug = false) => {
  const reassuranceFund = payload.reassuranceAmount.mul(payload.INCIDENT_SUPPORT_POOL_CAP_RATIO.toString()).div(payload.MULTIPLIER.toString())
  const totalAvailableLiquidity = payload.inVault.add(reassuranceFund)

  if (amount.gt(totalAvailableLiquidity)) {
    throw new Error('Balance insufficient')
  }

  const utilizationRatio = payload.totalCommitment.add(amount).mul(payload.MULTIPLIER).div(totalAvailableLiquidity)
  debug && console.debug('s: %s. p: %s. u: %s', payload.inVault, reassuranceFund, utilizationRatio)
  debug && console.debug('c: %s, a: %s. t: %s', payload.totalCommitment, amount, totalAvailableLiquidity)

  let rate = utilizationRatio.gt(payload.floor) ? utilizationRatio : payload.floor

  rate = rate.add(duration.mul(100))

  if (rate.gt(payload.ceiling)) {
    rate = payload.ceiling
  }

  return amount.mul(rate).mul(days.toString()).div(365 * payload.MULTIPLIER)
}

module.exports = { getCoverFee, getCoverFeeBn }
