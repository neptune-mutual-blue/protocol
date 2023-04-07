const path = require('path')
const { io, key, helper } = require('../util')
const { getNetworkInfo } = require('../util/network')
const DEPLOYMENT_ID = 6

const NEW_PRICE_ORACLE = '0x86eDE99875faEa617Bf2E37F161f87735f966EC1'

const attach = async (connectedTo, at, contractName, libraries) => {
  const contract = libraries ? await ethers.getContractFactory(contractName, libraries) : await ethers.getContractFactory(contractName)
  return contract.connect(connectedTo).attach(at)
}

const getContractInstance = async (connectedTo, deployments, contractName) => {
  for (const prop in deployments) {
    const candidate = deployments[prop]
    if (candidate.contractName === contractName) {
      const { data, contractName, address } = candidate
      return attach(connectedTo, address, contractName, data)
    }
  }
}

const getStore = async () => {
  const [signer] = await ethers.getSigners()

  const network = await getNetworkInfo()
  const file = `./config/deployments/${network.name}.json`
  const cache = JSON.parse(await io.readFile(path.join(__dirname, file)))
  const { deployments } = cache[DEPLOYMENT_ID]

  return getContractInstance(signer, deployments, 'Store')
}

const getArgs = async () => {
  const store = await getStore()

  const burner = await store.getAddress(key.PROTOCOL.CNS.BURNER)
  const uniswapV2RouterLike = await store.getAddress(key.PROTOCOL.CNS.UNISWAP_V2_ROUTER)
  const uniswapV2FactoryLike = await store.getAddress(key.PROTOCOL.CNS.UNISWAP_V2_FACTORY)
  // const npm = await store.getAddress(key.PROTOCOL.CNS.NPM)
  const npm = helper.zerox // using the init function, you can't change NPM after deployment
  const treasury = await store.getAddress(key.PROTOCOL.CNS.TREASURY)
  const priceOracle = await store.getAddress(key.PROTOCOL.CNS.NPM_PRICE_ORACLE)

  const coverCreationFee = (await store.getUint(key.PROTOCOL.NS.COVER_CREATION_FEE)).toString()
  const minCoverCreationStake = (await store.getUint(key.PROTOCOL.NS.COVER_CREATION_MIN_STAKE)).toString()
  const minStakeToAddLiquidity = (await store.getUint(key.PROTOCOL.NS.COVER_LIQUIDITY_MIN_STAKE)).toString()
  const firstReportingStake = (await store.getUint(key.PROTOCOL.NS.GOVERNANCE_REPORTING_MIN_FIRST_STAKE)).toString()
  const claimPeriod = (await store.getUint(key.PROTOCOL.NS.CLAIM_PERIOD)).toString()
  const reportingBurnRate = (await store.getUint(key.PROTOCOL.NS.GOVERNANCE_REPORTING_BURN_RATE)).toString()
  const governanceReporterCommission = (await store.getUint(key.PROTOCOL.NS.GOVERNANCE_REPORTER_COMMISSION)).toString()
  const claimPlatformFee = (await store.getUint(key.PROTOCOL.NS.COVER_PLATFORM_FEE)).toString()
  const claimReporterCommission = (await store.getUint(key.PROTOCOL.NS.CLAIM_REPORTER_COMMISSION)).toString()
  const flashLoanFee = (await store.getUint(key.PROTOCOL.NS.COVER_LIQUIDITY_FLASH_LOAN_FEE)).toString()
  const flashLoanFeeProtocol = (await store.getUint(key.PROTOCOL.NS.COVER_LIQUIDITY_FLASH_LOAN_FEE_PROTOCOL)).toString()
  const resolutionCoolDownPeriod = (await store.getUint(key.PROTOCOL.NS.RESOLUTION_COOL_DOWN_PERIOD)).toString()
  const stateUpdateInterval = (await store.getUint(key.PROTOCOL.NS.LIQUIDITY_STATE_UPDATE_INTERVAL)).toString()
  const maxLendingRatio = (await store.getUint(key.PROTOCOL.NS.COVER_LIQUIDITY_MAX_LENDING_RATIO)).toString()
  const lendingPeriod = (await store.getUint(key.PROTOCOL.NS.COVER_LIQUIDITY_LENDING_PERIOD)).toString()
  const withdrawalWindow = (await store.getUint(key.PROTOCOL.NS.COVER_LIQUIDITY_WITHDRAWAL_WINDOW)).toString()
  const policyFloor = (await store.getUint(key.PROTOCOL.NS.COVER_POLICY_RATE_FLOOR)).toString()
  const policyCeiling = (await store.getUint(key.PROTOCOL.NS.COVER_POLICY_RATE_CEILING)).toString()

  const args = {
    burner,
    uniswapV2FactoryLike,
    uniswapV2RouterLike,
    npm,
    treasury,
    priceOracle,
    coverCreationFee,
    minCoverCreationStake,
    minStakeToAddLiquidity,
    firstReportingStake,
    claimPeriod,
    reportingBurnRate,
    governanceReporterCommission,
    claimPlatformFee,
    claimReporterCommission,
    flashLoanFee,
    flashLoanFeeProtocol,
    resolutionCoolDownPeriod,
    stateUpdateInterval,
    maxLendingRatio,
    lendingPeriod,
    withdrawalWindow,
    policyFloor,
    policyCeiling
  }

  return args
}

const main = async (newPriceOracle) => {
  const args = await getArgs()

  args.priceOracle = newPriceOracle

  console.clear()
  console.log('-'.repeat(86))
  console.log()
  console.log(JSON.stringify(args))
  console.log()
}

main(NEW_PRICE_ORACLE)
