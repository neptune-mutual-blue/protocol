const path = require('path')
const io = require('../io')

const getFileList = async () => io.findFiles('json', path.join(process.cwd(), 'abis'))
const ignored = ['Approval', 'Transfer']
const divider = '-'.repeat(128)

const getEvents = async (file) => {
  const contents = await io.readFile(file)
  const parsed = JSON.parse(contents)
  const events = parsed.filter(x => x.type === 'event')

  const result = [`${file}`, divider]

  const candidates = []

  for (const event of events) {
    if (ignored.indexOf(event.name) > -1) {
      continue
    }

    const args = event.inputs
      .filter(x => ['Approval', 'Transfer'].indexOf(x.name) === -1)
      .map(x => {
        const { indexed, type, name } = x

        return `${type}${indexed ? ' indexed' : ''} ${name}`
      }).join(', ')

    candidates.push(`event ${event.name}(${args});`)
  }

  if (candidates.length === 0) {
    return ''
  }

  result.push('```\n' + candidates.join('\n') + '\n```')

  result.push('')
  return result.join('\n')
}

const start = async () => {
  const events = []
  const abis = await getFileList()

  if (!abis.length) {
    console.error(new Error('Please first export the ABIs'))
    return
  }

  for (const abi of abis) {
    events.push(await getEvents(abi))
  }

  console.info(events.filter(x => !!x).join('\n'))
}

start()
