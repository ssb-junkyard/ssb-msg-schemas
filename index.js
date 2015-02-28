var errors = require('./errors')
var mlib = require('ssb-msgs')

// validation

exports.errors = errors

function allLinksValid (links, attr) {
  for (var i =0; i < links.length; i++) {
    var link = links[i]
    if (!mlib.isHash(link[attr]))
      return false
  }
  return true
}

var validators =
exports.validators = {

  post: function (content) {
    if (typeof content.text != 'string' || !content.text.trim())
      return new errors.BadAttr('text', 'Can not create an empty post')

    if (!allLinksValid(mlib.asLinks(content.repliesTo), 'msg'))
      return new errors.BadLinkAttr('repliesTo', 'msg', 'repliesTo link must have a valid msg reference')

    if (!allLinksValid(mlib.asLinks(content.refers), 'msg'))
      return new errors.BadLinkAttr('refers', 'msg', 'refers link must have a valid msg reference')

    if (!allLinksValid(mlib.asLinks(content.mentions), 'feed'))
      return new errors.BadLinkAttr('mentions', 'feed', 'mentions link must have a valid feed reference')

    if (!allLinksValid(mlib.asLinks(content.attachments), 'ext'))
      return new errors.BadLinkAttr('attachments', 'ext', 'attachments link must have a valid ext reference')
  },

  advert: function (content) {
    if (typeof content.text != 'string' || !content.text.trim())
      return new errors.BadAttr('text', 'Can not create an empty advert')
  },

  name: function (content) {
    if (typeof content.name != 'string' || !content.name.trim())
      return new errors.BadAttr('text', 'Can not use an empty name')

    if (!allLinksValid(mlib.asLinks(content.target), 'feed'))
      return new errors.BadLinkAttr('target', 'feed', 'target link must have a valid feed reference')
  },

  follow: function (content) {
    if (content.follow !== true && content.follow !== false)
      return new errors.BadAttr('follow', 'Follow msgs must have a `.follow` of true or false')

    var links = mlib.asLinks(content.target)
    if (links.length === 0)
      return new errors.MalformedMessage('target link is required')
    if (!allLinksValid(links, 'feed'))
      return new errors.BadLinkAttr('target', 'feed', 'target link must have a valid feed reference')
  },

  trust: function (content) {
    if (content.trust !== -1 && content.trust !== 0 && content.trust !== 1)
      return new errors.BadAttr('trust', 'Trusts msgs must have a `.trust` of -1, 0, or 1')

    var links = mlib.asLinks(content.target)
    if (links.length === 0)
      return new errors.MalformedMessage('target link is required')
    if (!allLinksValid(links, 'feed'))
      return new errors.BadLinkAttr('target', 'feed', 'target link must have a valid feed reference')
  },

  pub: function (content) {
    if (typeof content.address != 'string' || !content.address.trim())
      return new errors.BadAttr('address', 'Must specify an address')
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
    if (opts) {
      if (opts.repliesTo)
        content.repliesTo = opts.repliesTo
      if (opts.refers)
        content.refers = opts.refers
      if (opts.mentions)
        content.mentions = opts.mentions
      if (opts.attachments)
        content.attachments = opts.attachments
    }
    return content
  },
  advert: function (text) {
    return { type: 'advert', text: text }
  },
  ownName: function (name) {
    return { type: 'name', name: name }
  },
  otherName: function (target, name) {
    return { type: 'name', name: name, target: { feed: target } }
  },
  follow: function (target) {
    return { type: 'follow', follow: true, target: { feed: target } }
  },
  unfollow: function (target) {
    return { type: 'follow', follow: false, target: { feed: target } }
  },
  trust: function (target, value) {
    return { type: 'trust', target: { feed: target }, trust: value }
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

