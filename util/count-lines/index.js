const path = require('path')
const fs = require('fs').promises
const io = require('../io')

const settings = {
  exclusion: {
    files: ['StoreKeyUtil.sol', 'BokkyPooBahsDateTimeLibrary.sol', 'Destroyable.sol', 'FaultyCompoundDaiDelegator.sol', 'MaliciousToken.sol', 'ForceEther.sol', 'NTransferUtilV2Intermediate.sol', 'FaultyAaveLendingPool.sol', 'InvalidStrategy.sol', 'PoorMansERC20.sol'],
    patterns: ['mock', 'fake', 'interfaces']
  },
  // Ignore lines added by pretier code formatter
  // for asthetic reasons, not logic.
  //
  // https://github.com/prettier/prettier/issues/4298
  prettierLineBreaks: 2
}

const root = path.join(process.cwd(), 'contracts')
const readFile = async (where) => (await fs.readFile(where)).toString()
const removeComments = (content) => content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
const removePragma = (content) => content
const countLines = (content) => content.split('\n').filter(x => x.trim().split(' ').length > settings.prettierLineBreaks).length // minimum 3 characters

const getFiles = async () => {
  const result = await io.findFiles('sol', root)

  return result.filter(x => settings.exclusion.files.indexOf(x.split('/').pop()) === -1)
    .filter(x => {
      for (const pattern of settings.exclusion.patterns) {
        if (x.indexOf(pattern) > -1) {
          return false
        }
      }

      return true
    })
}

const getLines = async (file) => {
  const content = removeComments(await readFile(file))
  const lines = countLines(removePragma(content))

  return {
    content,
    lines
  }
}

const main = async () => {
  const files = await getFiles()
  const result = []
  let totalLines = 0

  for (const file of files) {
    const { /* content, */ lines } = await getLines(file)
    totalLines += lines

    result.push({
      file,
      // content,
      lines
    })
  }

  console.info(result.sort((x, y) => x.lines - y.lines))
  console.info('_'.repeat(100))
  console.info('Total lines: %s', totalLines)
}

main()
