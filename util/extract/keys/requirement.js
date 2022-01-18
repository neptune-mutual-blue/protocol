module.exports = [
  {
    scope: 'ACCESS_CONTROL',
    type: 'role',
    prefix: 'NS_ROLES_',
    expression: /.*constant NS_ROLES_.*\n/g,
    src: './contracts/Libraries/AccessControlLibV1.sol'
  },
  {
    scope: 'BOND',
    type: 'bond',
    prefix: 'NS_BOND_',
    expression: /.*constant NS_BOND_.*\n/g,
    src: './contracts/Libraries/BondPoolLibV1.sol'
  },
  {
    scope: 'PROTOCOL',
    type: 'cns',
    prefix: 'CNS_',
    expression: /.*constant CNS_.*\n/g,
    src: './contracts/Libraries/ProtoUtilV1.sol'
  },
  {
    scope: 'PROTOCOL',
    type: 'ns',
    prefix: 'NS_',
    expression: /.*constant NS_.*\n/g,
    src: './contracts/Libraries/ProtoUtilV1.sol'
  },
  {
    scope: 'PROTOCOL',
    type: 'cname',
    prefix: 'CNAME_',
    expression: /.*constant CNAME_.*\n/g,
    src: './contracts/Libraries/ProtoUtilV1.sol'
  },
  {
    scope: 'STAKING',
    type: 'staking:pool',
    prefix: 'NS_POOL_',
    expression: /.*constant NS_POOL_.*\n/g,
    src: './contracts/Libraries/StakingPoolCoreLibV1.sol'
  }
]
