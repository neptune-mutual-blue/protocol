const axios = require('axios')

class IPFSClient {
  constructor (urls) {
    this.urls = urls
  }

  createBoundary (stringPayload) {
    let boundary = 'Delimiter.'

    while (true) {
      boundary += `${Math.random()}`

      if (!stringPayload.includes(boundary)) {
        return boundary
      }
    }
  }

  async addString (value) {
    const boundary = this.createBoundary(value)
    const payload = `--${boundary}\r\nContent-Disposition: form-data; name="path"\r\nContent-Type: application/octet-stream\r\n\r\n${value}\r\n--${boundary}--`
    let result

    for (const url of this.urls) {
      try {
        const options = {
          boundary,
          payload,
          method: 'POST',
          url: `${url}/api/v0/add`,
          headers: {
            Accept: 'application/json',
            'Content-Type': `multipart/form-data; boundary=${boundary}`
          }
        }

        result = await this.call(options)
      } catch (error) {
        console.error(error)
      }
    }

    if (result !== undefined) {
      const { Hash } = JSON.parse(result)
      return Hash
    }
  }

  async getString (hash) {
    const [url] = this.urls

    // eslint-disable-next-line
    return this.call({
      hash,
      method: 'GET',
      url: `${url}/api/v0/cat/${hash}`,
      headers: {
        Accept: 'application/json'
      }
    })
  }

  async call (options) {
    const { payload, method, url, headers } = options

    const result = await axios.request({
      url,
      method,
      headers,
      data: payload
    })

    return JSON.stringify(result.data)
  }
}

module.exports = { IPFSClient }
