const encodeKey = (x) => ethers.utils.solidityKeccak256(['bytes32'], [toBytes32(x)])
const encodeKeys = (x, y) => ethers.utils.solidityKeccak256(x, y)
const toBytes32 = (x) => ethers.utils.formatBytes32String(x)
const getCoverContractKey = (namespace, coverKey) => encodeKeys(['bytes32', 'bytes32'], [toBytes32(namespace), coverKey])
const qualifyBytes32 = (k) => encodeKeys(['bytes32', 'bytes32'], [toBytes32(NS.CONTRACTS), toBytes32(k)])
const qualify = (k) => encodeKeys(['bytes32', 'address'], [toBytes32(NS.CONTRACTS), k])
const qualifyMember = (k) => encodeKeys(['bytes32', 'address'], [toBytes32(NS.MEMBERS), k])

const CNS = {
  CORE: 'cns:core',
  BURNER: 'cns:core:burner',
  COVER: 'cns:cover',
  COVER_REASSURANCE: 'cns:cover:reassurance',
  COVER_POLICY: 'cns:cover:policy',
  COVER_STAKE: 'cns:cover:stake',
  COVER_POLICY_ADMIN: 'cns:cover:policy:admin',
  COVER_VAULT: 'cns:cover:vault',
  COVER_STABLECOIN: 'cns:cover:stablecoin',
  COVER_CXTOKEN_FACTORY: 'cns:cover:cxtoken:factory',
  COVER_VAULT_FACTORY: 'cns:cover:vault:factory',
  GOVERNANCE: 'cns:gov',
  RESOLUTION: 'cns:gov:resolution',
  CLAIM_PROCESSOR: 'cns:claim:processor',
  PRICE_DISCOVERY: 'cns:core:price:discovery',
  NPM: 'cns:core:npm:instance',
  REASSURANCE_VAULT: 'cns:core:reassurance:vault',
  TREASURY: 'cns:core:treasury'
}

const NS = {
  CONTRACTS: 'ns:contracts',
  MEMBERS: 'ns:members',
  COVER: 'ns:cover',
  COVER_REASSURANCE_TOKEN: 'ns:cover:reassurance:token',
  COVER_CLAIMABLE: 'ns:cover:claimable',
  COVER_FEE_EARNING: 'ns:cover:fee:earning',
  GOVERNANCE_UNSTAKE_TS: 'ns:gov:unstake:ts',
  COVER_INFO: 'ns:cover:info',
  COVER_LIQUIDITY: 'ns:cover:liquidity',
  COVER_LIQUIDITY_COMMITTED: 'ns:cover:liquidity:committed',
  COVER_LIQUIDITY_NAME: 'ns:cover:liquidityName',
  COVER_LIQUIDITY_RELEASE_DATE: 'ns:cover:liquidity:release',
  COVER_OWNER: 'ns:cover:owner',
  COVER_POLICY_RATE_FLOOR: 'ns:cover:policy:rate:floor',
  COVER_POLICY_RATE_CEILING: 'ns:cover:policy:rate:ceiling',
  COVER_PROVISION: 'ns:cover:provision',
  COVER_STAKE: 'ns:cover:stake',
  COVER_STAKE_OWNED: 'ns:cover:stake:owned',
  COVER_STATUS: 'ns:cover:status',
  COVER_WHITELIST: 'ns:cover:whitelist',
  COVER_CXTOKEN: 'ns:cover:cxToken',
  SETUP_COVER_CREATION_FEE: 'ns:cover:creation:fee',
  SETUP_MIN_STAKE: 'ns:cover:creation:min:stake',
  SETUP_FIRST_REPORTING_STAKE: 'ns:gov:1st:reporting:stake',
  SETUP_MIN_LIQ_PERIOD: 'ns:cover:liquidity:min:period',
  ROLES: {
    ADMIN: 'role:admin',
    COVER_MANAGER: 'role:cover:manager',
    LIQUIDITY_MANAGER: 'role:liquidity:manager',
    GOVERNANCE_ADMIN: 'role:governance:admin',
    GOVERNANCE_AGENT: 'role:governance:agent',
    UPGRADE_AGENT: 'role:upgrade:agent',
    RECOVERY_AGENT: 'role:recovery:agent',
    PAUSE_AGENT: 'role:pause:agent',
    UNPAUSE_AGENT: 'role:unpause:agent'
  }
}

const CNAME = {
  PROTOCOL: 'Protocol',
  TREASURY: 'Treasury',
  POLICY: 'Policy',
  PRICE_DISCOVERY: 'PriceDiscovery',
  COVER: 'Cover',
  VAULT_FACTORY: 'VaultFactory',
  CXTOKEN_FACTORY: 'cxTokenFactory',
  COVER_PROVISION: 'CoverProvision',
  COVER_STAKE: 'CoverStake',
  COVER_REASSURANCE: 'CoverReassurance',
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
  CXTOKEN_FACTORY: toBytes32(CNAME.CXTOKEN_FACTORY),
  COVER_PROVISION: toBytes32(CNAME.COVER_PROVISION),
  COVER_STAKE: toBytes32(CNAME.COVER_STAKE),
  COVER_REASSURANCE: toBytes32(CNAME.COVER_REASSURANCE),
  LIQUIDITY_VAULT: toBytes32(CNAME.LIQUIDITY_VAULT)
}

const CNAME_KEYS_FQN = {
  PROTOCOL: qualifyBytes32(CNAME.PROTOCOL),
  TREASURY: qualifyBytes32(CNAME.TREASURY),
  POLICY: qualifyBytes32(CNAME.POLICY),
  COVER: qualifyBytes32(CNAME.COVER),
  VAULT_FACTORY: qualifyBytes32(CNAME.VAULT_FACTORY),
  CXTOKEN_FACTORY: qualifyBytes32(CNAME.CXTOKEN_FACTORY),
  COVER_PROVISION: qualifyBytes32(CNAME.COVER_PROVISION),
  COVER_STAKE: qualifyBytes32(CNAME.COVER_STAKE),
  COVER_REASSURANCE: qualifyBytes32(CNAME.COVER_REASSURANCE),
  LIQUIDITY_VAULT: qualifyBytes32(CNAME.LIQUIDITY_VAULT)
}

module.exports = {
  NS,
  CNS,
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
