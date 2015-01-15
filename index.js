var errors = require('./errors')
var ssbMsgs = require('ssb-msgs')

// copied from ssb-keys to avoid a large dep (would be bad for phoenix)
// todo: move into independent repo?
function isString(s) {
  return 'string' === typeof s
}
function isHash (data) {
  return isString(data) && /^[A-Za-z0-9\/+]{43}=\.blake2s$/.test(data)
}
exports.isHash = isHash

// validation

exports.errors = errors

var repliesToOpts = { rel: 'replies-to' }
var mentionsOpts  = { rel: 'mentions' }
var namesOpts     = { rel: 'names' }
var followsOpts   = { rel: 'follows' }
var unfollowsOpts = { rel: 'unfollows' }
var trustsOpts    = { rel: 'trusts' }

var validators =
exports.validators = {

  post: function (content) {
    if (typeof content.text != 'string' || !content.text.trim())
      return new errors.BadAttr('text', 'Can not create an empty post')

    var links = ssbMsgs.getLinks(content, repliesToOpts)
    for (var i =0; i < links.length; i++) {
      var link = links[i]
      if (!link.msg || !isHash(link.msg))
        return new errors.BadLinkAttr('replies-to', 'msg', 'Replies-to link must have a valid msg reference')
    }

    var links = ssbMsgs.getLinks(content, mentionsOpts)
    for (var i =0; i < links.length; i++) {
      var link = links[i]
      if (!link.feed || !isHash(link.feed))
        return new errors.BadLinkAttr('mentions', 'msg', 'Mentions link must have a valid msg reference')
    }
  },

  advert: function (content) {
    if (typeof content.text != 'string' || !content.text.trim())
      return new errors.BadAttr('text', 'Can not create an empty advert')
  },

  name: function (content) {
    if (typeof content.name != 'string' || !content.name.trim())
      return new errors.BadAttr('text', 'Can not create an empty name')

    var links = ssbMsgs.getLinks(content, namesOpts)
    for (var i =0; i < links.length; i++) {
      var link = links[i]
      if (!link.feed || !isHash(link.feed))
        return new errors.BadLinkAttr('names', 'feed', 'Names link must have a valid feed reference')
    }
  },

  follow: function (content) {
    var links = ssbMsgs.getLinks(content, followsOpts)
    for (var i =0; i < links.length; i++) {
      var link = links[i]
      if (!link.feed || !isHash(link.feed))
        return new errors.BadLinkAttr('follows', 'feed', 'Follows link must have a valid feed reference')
    }

    var links = ssbMsgs.getLinks(content, unfollowsOpts)
    for (var i =0; i < links.length; i++) {
      var link = links[i]
      if (!link.feed || !isHash(link.feed))
        return new errors.BadLinkAttr('unfollows', 'feed', 'Unfollows link must have a valid feed reference')
    }
  },

  trust: function (content) {
    var links = ssbMsgs.getLinks(content, trustsOpts)
    for (var i =0; i < links.length; i++) {
      var link = links[i]
      if (!link.feed || !isHash(link.feed))
        return new errors.BadLinkAttr('trusts', 'feed', 'Trusts link must have a valid feed reference')
      if (link.value !== -1 && link.value !== 0 && link.value !== 1)
        return new errors.BadLinkAttr('trusts', 'value', 'Trusts link must have a value of -1, 0, or 1')
    }
  }
}

var validate = 
exports.validate = function (content) {
  var validator = validators[content.type]
  if (!validator)
    return new errors.UnknownType('Unknown message type, ' + content.type)
  return validator(content)
}

var validateAndAdd =
exports.validateAndAdd = function (feed, content, cb) {
  var err = validate(content)
  if (err) return cb(err)
  feed.add(content, cb)
}

var schemas = exports.schemas = {
  post: function (text, opts) {
    var content = { type: 'post', text: text }
    if (opts && opts.mentions) {
      if (Array.isArray(opts.mentions)) {
        content.mentions = opts.mentions.map(function (id) { return { rel: 'mentions', feed: id }})
      } else {
        content.mentions = { rel: 'mentions', feed: opts.mentions }
      }
    }
    return content
  },
  replyPost: function (text, opts, parent) {
    if (!parent && typeof opts == 'string') {
      parent = opts
      opts = null
    }
    var content = { type: 'post', text: text, repliesTo: { msg: parent, rel: 'replies-to' } }
    if (opts && opts.mentions) {
      if (Array.isArray(opts.mentions)) {
        content.mentions = opts.mentions.map(function (id) { return { rel: 'mentions', feed: id }})
      } else {
        content.mentions = { rel: 'mentions', feed: opts.mentions }
      }
    }
    return content
  },
  advert: function (text) {
    return {type: 'advert', text: text }
  },
  ownName: function (name) {
    return {type: 'name', name: name}
  },
  otherName: function (target, name) {
    return { type: 'name', name: name, rel: 'names', feed: target }
  },
  follow: function (target) {
    return { type: 'follow', rel: 'follows', feed: target }
  },
  unfollow: function (target) {
    return { type: 'follow', rel: 'unfollows', feed: target }
  },
  trust: function (target, value) {
    return { type: 'trust', rel: 'trusts', feed: target, value: value }
  }
}

function createAdd(name) {
  return function () {
    var args = [].slice.call(arguments)
    var feed = args.shift()
    var cb = args.pop()
    var content = schemas[name].apply(null, args)
    validateAndAdd(feed, content, cb)
  }
}

for(var k in schemas) {
  var addK = 'add'+k[0].toUpperCase() + k.substring(1)
  exports[addK] = createAdd(k)
}

