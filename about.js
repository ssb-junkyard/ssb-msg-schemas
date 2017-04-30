const Validate = require('is-my-json-valid')
const { feedIdRegex, blobIdRegex } = require('ssb-ref')

const { link } = require('./util')

function name (userId, name) {
  return {
    type: 'about',
    about: link(userId),
    name
  }
}

function image (userId, imgLink) {
  return {
    type: 'about',
    about: link(userId),
    image: link(imgLink)
  }
}

const schema = {
  $schema: 'https://www.github.com/ssbc/patchcore',
  type: 'object',
  required: ['type', 'about'],
  // TODO : extract for about profile in patchbay
  // anyOf: [
  //   { required: ['name'] },
  //   { required: ['description'] },
  //   { required: ['image'] }
  // ],
  properties: {
    type: {
      type: 'string',
      pattern: '^about$'
    },
    about: {
      type: 'string',
      pattern: feedIdRegex
    },
    name: { type: 'string' },
    description: { type: 'string' },
    image: {
      anyOf: [
        {
          type: 'string',
          pattern: blobIdRegex
        },
        {
          type: 'object',
          required: ['link', 'size'],
          properties: {
            link: {
              type: 'string',
              pattern: blobIdRegex
            },
            size: {
              type: 'integer'
            }
          }
        } 
      ]
    }
  }
}

const validate = Validate(schema, { verbose: true })

module.exports = {
  create: {
    name,
    image
  },
  schema,
  validate
}

