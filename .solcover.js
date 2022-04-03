module.exports = {
  peephole: false,
  inliner: false,
  jumpdestRemover: false,
  orderLiterals: true, 
  deduplicate: false,
  cse: false,
  constantOptimizer: false,
  yul: false,
  configureYulOptimizer: true,
  skipFiles: ['fakes', 'mock', 'libraries/BokkyPooBahsDateTimeLibrary.sol']
}