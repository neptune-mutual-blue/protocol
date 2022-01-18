const pre = `import { ByteArray } from "@graphprotocol/graph-ts";

const toBytes32 = (x: string): ByteArray => ByteArray.fromUTF8(x);`

const post = ''

module.exports = { pre, post }
