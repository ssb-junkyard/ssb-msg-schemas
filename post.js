const Validate = require('is-my-json-valid')
const { msgIdRegex, feedIdRegex, blobIdRegex } = require('ssb-ref')

const { link, links } = require('./util')

const channelIdRegex = /^#.*$/

function create (text, root, branch, mentions, recps, channel) {
  var content = { type: 'post', text }
  if (root) {
    root = link(root)
    if (!root)
      throw new Error('root is not a valid link')
    content.root = root
  }
  if (branch) {
    if (!root)
      throw new Error('root is not a valid link')
    branch = Array.isArray(branch) ? branch.map(link) : link(branch)
    if (!branch)
      throw new Error('branch is not a valid link')
    content.branch = branch
  }
  if (mentions && (!Array.isArray(mentions) || mentions.length)) {
    mentions = links(mentions)
    if (!mentions || !mentions.length)
      throw new Error('mentions are not valid links')
    content.mentions = mentions
  }
  if (recps && (!Array.isArray(recps) || recps.length)) {
    recps = links(recps)
    if (!recps || !recps.length)
      throw new Error('recps are not valid links')
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
  $schema: 'http://json-schema.org/schema#',
  type: 'object',
  required: ['type', 'text'],
  properties: {
    type: {
      type: 'string',
      pattern: '^post$'
    },
    text: { type: 'string' },
    channel: { type: 'string', },
    root: { $ref: '#/definitions/messageId' },
    branch: {
      oneOf: [
        { $ref: '#/definitions/messageId' },
        { type: 'array', items: { $ref: '#/definitions/messageId' } }
      ]
    },
    mentions: {
      oneOf: [
        { type: 'null' },
        {
          type: 'array',
          items: {
            oneOf: [
              { $ref: '#/definitions/mentions/message' },
              { $ref: '#/definitions/mentions/feed' },
              { $ref: '#/definitions/mentions/blob' },
              { $ref: '#/definitions/mentions/channel' }
            ]
          }
        }
      ]
    },
    recps: {
      oneOf: [
        { type: 'null' },
        {
          type: 'array',
          items: {
            oneOf: [
              { $ref: '#/definitions/feedId' },
              { $ref: '#/definitions/mentions/feed' },
            ]
          }
        }
      ]
    }
  },
  definitions: {
    messageId: {
      type: 'string',
      pattern: msgIdRegex
    },
    feedId: {
      type: 'string',
      pattern: feedIdRegex
    },
    blobId: {
      type: 'string',
      pattern: blobIdRegex
    },
    channelId: {
      type: 'string',
      pattern: channelIdRegex
    },
    mentions: {
      message: {
        type: 'object',
        required: ['link'],
        properties: {
          link: { $ref: '#/definitions/messageId'}
        }
      },
      feed: {
        type: 'object',
        required: ['link', 'name'],
        properties: {
          link: { $ref: '#/definitions/feedId'},
          name: { type: 'string' }
        }
      },
      blob: {
        type: 'object',
        required: ['link', 'name'],
        properties: {
          link: { $ref: '#/definitions/blobId'},
          name: { type: 'string' }
        }
      },
      channel: {
        type: 'object',
        required: ['link'],
        properties: {
          link: { $ref: '#/definitions/channelId'}
        }
      }
    }
  },
}

const validate = Validate(schema, { verbose: true })

module.exports = {
  create,
  schema,
  validate
}

