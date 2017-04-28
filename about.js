const { link } = require('./util/link')

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

const schema = {}

function validate () {
}

module.exports = {
  create: {
    name,
    image
  },
  schema,
  validate
}

