var mlib = require('ssb-msgs')
var ssbref = require('ssb-ref')

function link (l) {
  if (typeof l == 'string') {
    if (ssbref.isLink(l))
      return l
  }
  if (l && typeof l == 'object') {
    if (Object.keys(l).length === 1 && l.link && ssbref.isLink(l))
      return l
    return mlib.link(l)
  }
}

function links (l) {
  if (!l)
    return
  if (!Array.isArray(l))
    l = [l]
  return l.map(link)
}

exports.post = function (text, root, branch, mentions, recps, channel) {
  var content = { type: 'post', text: text }
  if (root) {
    root = link(root)
    if (!root)
      throw new Error('root is not a valid link')
    content.root = root
  }
  if (branch) {
    branch = link(branch)
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

exports.postEdit = function(text, mentions, revision) {
  var content = { type: 'post-edit', text: text }
  if (revision) { // Revisions are like branches, except they form a differently
                  // templated (and regarded) thread
    revision = link(revision)
    if (!revision)
      throw new Error('revision is not a valid link')
    content.revision = revision
  }
  if (mentions && (!Array.isArray(mentions) || mentions.length)) {
    mentions = links(mentions)
    if (!mentions || !mentions.length)
      throw new Error('mentions are not valid links')
    content.mentions = mentions
  }
  
  return content  
}

exports.name = function (userId, name) {
  return { type: 'about', about: link(userId), name: name }
}

exports.image = function (userId, imgLink) {
  return { type: 'about', about: link(userId), image: link(imgLink) }
}

exports.follow = function (userId) {
  return { type: 'contact', contact: link(userId), following: true, blocking: false }
}

exports.unfollow = function (userId) {
  return { type: 'contact', contact: link(userId), following: false }
}

exports.block = function (userId) {
  return { type: 'contact', contact: link(userId), following: false, blocking: true }
}

exports.unblock = function (userId) {
  return { type: 'contact', contact: link(userId), blocking: false }
}

exports.vote = function (id, vote, reason) {
  var voteLink = mlib.link(id)
  if (!voteLink)
    throw new Error('invalid target id')
  voteLink.value = vote
  if (reason && typeof reason === 'string')
    voteLink.reason = reason
  return { type: 'vote', vote: voteLink }
}

exports.pub = function (id, host, port) {
  var publink = mlib.link(id)
  publink.host = host
  publink.port = port
  return { type: 'pub', pub: publink }
}
