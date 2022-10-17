const io = require('../../io')
const path = require('path')
const root = path.join('artifacts', 'contracts', 'interfaces')

const getFiles = async () => {
  const hasFiles = await io.exists(root)

  if (!hasFiles) {
    const command = '\x1b[36m' + 'npx hardhat compile' + '\x1b[0m'
    console.log(`Please generate artifacts using: ${command}`)
    return
  }

  const files = await io.findFiles('json', root)
  const all = files.map(x => `${x.replace('.dbg', '')}`)

  all.push('./artifacts/openzeppelin-solidity/contracts/token/ERC20/IERC20.sol/IERC20.json')
  all.push('./artifacts/contracts/dependencies/aave/IAaveV2LendingPoolLike.sol/IAaveV2LendingPoolLike.json')
  all.push('./artifacts/contracts/dependencies/compound/ICompoundERC20DelegatorLike.sol/ICompoundERC20DelegatorLike.json')
  all.push('./artifacts/contracts/dependencies/uniswap-v2/IUniswapV2FactoryLike.sol/IUniswapV2FactoryLike.json')
  all.push('./artifacts/contracts/dependencies/uniswap-v2/IUniswapV2PairLike.sol/IUniswapV2PairLike.json')
  all.push('./artifacts/contracts/dependencies/uniswap-v2/IUniswapV2RouterLike.sol/IUniswapV2RouterLike.json')

  return [...new Set(all)]
}

const createAbi = async (file) => {
  const destination = path.join(process.cwd(), 'abis', file.split('/').pop())

  if (!(await io.exists(file))) {
    return
  }

  const contents = await io.readFile(file)
  const artifact = JSON.parse(contents)

  await io.ensureFile(destination, JSON.stringify(artifact.abi, null, 2))
}

const extract = async () => {
  const files = await getFiles()

  for (const i in files) {
    await createAbi(files[i])
  }
}

extract()
