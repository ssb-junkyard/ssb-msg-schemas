const { link, links } = require('./util')

function create (text, root, branch, mentions, recps, channel) {
  var content = { type: 'post', text }
  if (root) {
    root = link(root)
    if (!root) { throw new Error('root is not a valid link') }
    content.root = root
  }
  if (branch) {
    branch = link(branch)
    if (!root) { throw new Error('must provide root is if describing a branch') }
    if (!branch) { throw new Error('branch is not a valid link') }
    content.branch = branch
  }
  if (mentions && (!Array.isArray(mentions) || mentions.length)) {
    mentions = links(mentions)
    if (!mentions || !mentions.length) { throw new Error('mentions are not valid links') }
    content.mentions = mentions
  }
  if (recps && (!Array.isArray(recps) || recps.length)) {
    recps = links(recps)
    if (!recps || !recps.length) { throw new Error('recps are not valid links') }
    content.recps = recps
  }
  if (channel) {
    if (typeof channel !== 'string')
      throw new Error('channel must be a string')
    content.channel = channel
  }

  return content
}

function validate () {
}

const schema = {}

module.exports = {
  create,
  validate,
  schema
}

