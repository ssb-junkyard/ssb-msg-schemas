const { link } = require('./util/link')

function follow (userId) {
  return { type: 'contact', contact: link(userId), following: true, blocking: false }
}

function unfollow (userId) {
  return { type: 'contact', contact: link(userId), following: false }
}

function block (userId) {
  return { type: 'contact', contact: link(userId), following: false, blocking: true }
}

function unblock (userId) {
  return { type: 'contact', contact: link(userId), blocking: false }
}

const schema = {}

function validate () {
}

module.exports = {
  create: {
    follow,
    unfollow,
    block,
    unblock
  },
  schema,
  validate
}

