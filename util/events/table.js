const path = require('path')
const io = require('../io')

const getFileList = async () => io.findFiles('json', path.join(process.cwd(), 'abis'))
const ignored = ['Approval', 'Transfer']

const getEvents = async (file) => {
  const contents = await io.readFile(file)
  const parsed = JSON.parse(contents)
  const events = parsed.filter(x => x.type === 'event')

  const candidates = []

  for (const event of events) {
    const { name } = event
    if (ignored.indexOf(name) > -1) {
      continue
    }

    candidates.push(`${file.split('/').pop()} | ${name} | |`)
  }

  if (candidates.length === 0) {
    return
  }

  console.log(candidates.join('\n'))
}

const start = async () => {
  const abis = await getFileList()

  if (!abis.length) {
    console.error(new Error('Please first export the ABIs'))
    return
  }

  console.log('| Contract | Events | Roles |')
  console.log('| -------- | ------ | ------- |')

  for (const abi of abis) {
    await getEvents(abi)
  }
}

start()
