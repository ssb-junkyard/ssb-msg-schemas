var mlib = require('ssb-msgs')
var ssbref = require('ssb-ref')

exports.post = function (text, repliesTo, mentions, recps) {
  var content = { type: 'post', text: text }
  if (repliesTo) {
    repliesTo = mlib.link(repliesTo)
    if (!repliesTo)
      throw new Error('repliesTo is not a valid link')
    content.repliesTo = repliesTo
  }
  if (mentions && (!Array.isArray(mentions) || mentions.length)) {
    mentions = mlib.links(mentions)
    if (!mentions || !mentions.length)
      throw new Error('mentions are not valid links')
    content.mentions = mentions
  }
  if (recps && (!Array.isArray(recps) || recps.length)) {
    recps = mlib.links(recps)
    if (!recps || !recps.length)
      throw new Error('recps are not valid links')
    content.recps = recps
  }
  return content
}

exports.name = function (userId, name) {
  return { type: 'about', about: mlib.link(userId), name: name }
}

exports.image = function (userId, imgLink) {
  return { type: 'about', about: mlib.link(userId), image: mlib.link(imgLink) }
}

exports.about = function (userId, name, imgLink) {
  return { type: 'about', about: mlib.link(userId), name: name, image: mlib.link(imgLink) }
}

exports.follow = function (userId) {
  return { type: 'contact', contact: mlib.link(userId), following: true, blocking: false }
}

exports.unfollow = function (userId) {
  return { type: 'contact', contact: mlib.link(userId), following: false }
}

exports.block = function (userId) {
  return { type: 'contact', contact: mlib.link(userId), following: false, blocking: true }
}

exports.unblock = function (userId) {
  return { type: 'contact', contact: mlib.link(userId), blocking: false }
}

exports.vote = function (id, vote) {
  var votelink = mlib.link(id)
  if (!votelink)
    throw new Error('invalid target id')
  votelink.value = vote
  return { type: 'vote', vote: votelink }
}

exports.flag = function (id, reason) {
  var flaglink = mlib.link(id)
  if (!flaglink)
    throw new Error('invalid target id')
  flaglink.reason = reason
  return { type: 'flag', flag: flaglink }
}

exports.unflag = function (id, flagmsgId) {
  var flaglink = mlib.link(id)
  if (!flaglink)
    throw new Error('invalid target id')
  flaglink.reason = false

  var content = { type: 'flag', flag: flaglink }
  if (flagmsgId) {
    var redacts = mlib.link(flagmsgId)
    if (!redacts)
      throw new Error('invalid redacts target')
    content.redacts = redacts
  }
  return content
}

exports.pub = function (id, host, port) {
  return { type: 'pub', pub: mlib.link(id), host: host, port: port }
}
