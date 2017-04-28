const mlib = require('ssb-msgs')

function create (id, vote, reason) {
  var voteLink = mlib.link(id)
  if (!voteLink) { throw new Error('invalid target id') }
  voteLink.value = vote
  if (reason && typeof reason === 'string') { voteLink.reason = reason }
  return { type: 'vote', vote: voteLink }
}

const schema = {}

function validate () {
}

module.exports = {
  create,
  schema,
  validate
}
