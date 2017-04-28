const mlib = require('ssb-msgs')

function create (id, host, port) {
  var publink = mlib.link(id)
  publink.host = host
  publink.port = port
  return { type: 'pub', pub: publink }
}

const schema = {}

function validate () {
}

module.exports = {
  create,
  schema,
  validate
}
