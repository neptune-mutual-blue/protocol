const encodeKey = (x) => ethers.utils.solidityKeccak256(['bytes32'], [toBytes32(x)])
const encodeKeys = (x, y) => ethers.utils.solidityKeccak256(x, y)
const toBytes32 = (x) => ethers.utils.formatBytes32String(x)
const getCoverContractKey = (namespace, coverKey) => encodeKeys(['bytes32', 'bytes32'], [toBytes32(namespace), coverKey])
const qualifyBytes32 = (k) => encodeKeys(['bytes32', 'bytes32'], [toBytes32(NS.CONTRACTS), toBytes32(k)])
const qualify = (k) => encodeKeys(['bytes32', 'address'], [toBytes32(NS.CONTRACTS), k])
const qualifyMember = (k) => encodeKeys(['bytes32', 'address'], [toBytes32(NS.MEMBERS), k])

const NS = {
  ASSURANCE_VAULT: 'proto:core:assurance:vault',
  BURNER: 'proto:core:burner',
  CONTRACTS: 'proto:contracts',
  MEMBERS: 'proto:members',
  CORE: 'proto:core',
  COVER: 'proto:cover',
  COVER_ASSURANCE: 'proto:cover:assurance',
  COVER_ASSURANCE_TOKEN: 'proto:cover:assurance:token',
  COVER_CLAIMABLE: 'proto:cover:claimable',
  COVER_FEE: 'proto:cover:fee',
  GOVERNANCE: 'proto:governance',
  CLAIMS_PROCESSOR: 'proto:claims:processor',
  COVER_INFO: 'proto:cover:info',
  COVER_LIQUIDITY: 'proto:cover:liquidity',
  COVER_LIQUIDITY_COMMITTED: 'proto:cover:liquidity:committed',
  COVER_LIQUIDITY_NAME: 'proto:cover:liquidityName',
  COVER_LIQUIDITY_TOKEN: 'proto:cover:liquidityToken',
  COVER_LIQUIDITY_RELEASE_DATE: 'proto:cover:liquidity:release',
  COVER_OWNER: 'proto:cover:owner',
  COVER_POLICY: 'proto:cover:policy',
  COVER_POLICY_ADMIN: 'proto:cover:policy:admin',
  COVER_POLICY_RATE_FLOOR: 'proto:cover:policy:rate:floor',
  COVER_POLICY_RATE_CEILING: 'proto:cover:policy:rate:ceiling',
  COVER_PROVISION: 'proto:cover:provision',
  COVER_STAKE: 'proto:cover:stake',
  COVER_STAKE_OWNED: 'proto:cover:stake:owned',
  COVER_STATUS: 'proto:cover:status',
  COVER_VAULT: 'proto:cover:vault',
  COVER_CTOKEN: 'proto:cover:cToken',
  TREASURY: 'proto:core:treasury',
  SETUP_NEP: 'proto:setup:nep',
  SETUP_COVER_FEE: 'proto:setup:cover:fee',
  SETUP_MIN_STAKE: 'proto:setup:min:stake',
  SETUP_REPORTING_STAKE: 'proto:setup:reporting:stake',
  SETUP_MIN_LIQ_PERIOD: 'proto:setup:min:liq:period',
  PRICE_DISCOVERY: 'proto:core:price:discovery',
  COVER_CTOKEN_FACTORY: 'proto:cover:ctoken:factory',
  COVER_VAULT_FACTORY: 'proto:cover:vault:factory'
}

const CNAME = {
  PROTOCOL: 'Protocol',
  TREASURY: 'Treasury',
  POLICY: 'Policy',
  PRICE_DISCOVERY: 'PriceDiscovery',
  COVER: 'Cover',
  VAULT_FACTORY: 'VaultFactory',
  CTOKEN_FACTORY: 'cTokenFactory',
  COVER_PROVISION: 'CoverProvison',
  COVER_STAKE: 'CoverStake',
  COVER_ASSURANCE: 'CoverAssurance',
  LIQUIDITY_VAULT: 'Vault'
}

// Note the protocol automatically prefixes these intermediate keys when adding
const CNAME_KEYS = {
  PROTOCOL: toBytes32(CNAME.PROTOCOL),
  TREASURY: toBytes32(CNAME.TREASURY),
  POLICY: toBytes32(CNAME.POLICY),
  PRICE_DISCOVERY: toBytes32(CNAME.PRICE_DISCOVERY),
  COVER: toBytes32(CNAME.COVER),
  VAULT_FACTORY: toBytes32(CNAME.VAULT_FACTORY),
  CTOKEN_FACTORY: toBytes32(CNAME.CTOKEN_FACTORY),
  COVER_PROVISION: toBytes32(CNAME.COVER_PROVISION),
  COVER_STAKE: toBytes32(CNAME.COVER_STAKE),
  COVER_ASSURANCE: toBytes32(CNAME.COVER_ASSURANCE),
  LIQUIDITY_VAULT: toBytes32(CNAME.LIQUIDITY_VAULT)
}

const CNAME_KEYS_FQN = {
  PROTOCOL: qualifyBytes32(CNAME.PROTOCOL),
  TREASURY: qualifyBytes32(CNAME.TREASURY),
  POLICY: qualifyBytes32(CNAME.POLICY),
  COVER: qualifyBytes32(CNAME.COVER),
  VAULT_FACTORY: qualifyBytes32(CNAME.VAULT_FACTORY),
  CTOKEN_FACTORY: qualifyBytes32(CNAME.CTOKEN_FACTORY),
  COVER_PROVISION: qualifyBytes32(CNAME.COVER_PROVISION),
  COVER_STAKE: qualifyBytes32(CNAME.COVER_STAKE),
  COVER_ASSURANCE: qualifyBytes32(CNAME.COVER_ASSURANCE),
  LIQUIDITY_VAULT: qualifyBytes32(CNAME.LIQUIDITY_VAULT)
}

module.exports = {
  NS,
  CNAME,
  CNAME_KEYS,
  CNAME_KEYS_FQN,
  encodeKey,
  encodeKeys,
  toBytes32,
  getCoverContractKey,
  qualify,
  qualifyMember,
  qualifyBytes32
}
