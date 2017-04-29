const Validate = require('is-my-json-valid')
const { msgIdRegex, blobIdRegex } = require('ssb-ref')

const { link, links, stringifyRegex } = require('./util')

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

const schema = {
  $schema: 'https://www.github.com/ssbc/patchcore',
  type: 'object',
  definitions: {
    messageId: {
      type: 'string',
      pattern: stringifyRegex(msgIdRegex)
    }
  },
  required: ['type', 'text'],
  properties: {
    type: {
      type: 'string',
      pattern: '^post$'
    },
    text: { type: 'string' },
    root: { $ref: '#/definitions/messageId' },
    branch: { $ref: '#/definitions/messageId' },
  }
}

const validate = Validate(schema, { verbose: true })

module.exports = {
  create,
  schema,
  validate
}

