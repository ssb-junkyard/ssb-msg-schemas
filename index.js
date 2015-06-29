var errors = require('./errors')
var mlib = require('ssb-msgs')
var isRef = require('ssb-ref')
// copied from ssb-keys to avoid a large dep (would be bad for phoenix)
// todo: move into independent repo?
function isString(s) {
  return 'string' === typeof s
}

var isHash = isRef.isHash
var isFeedId = isRef.isFeedId

var pull = require('pull-stream')

// validation

exports.errors = errors

function allLinksValid (links, attr, _isRef) {
  _isRef = _isRef || isRef
  for (var i =0; i < links.length; i++) {
    var link = links[i]
    if (!_isRef(link[attr]))
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

    var links = ssbMsgs.getLinks(content, mentionsOpts)
    if (!allLinksValid(mlib.asLinks(content.refers), 'msg', isHash))
      return new errors.BadLinkAttr('refers', 'msg', 'refers link must have a valid msg reference')

    if (!allLinksValid(mlib.asLinks(content.mentions), 'feed', isFeedId))
      return new errors.BadLinkAttr('mentions', 'feed', 'mentions link must have a valid feed reference')

    if (!allLinksValid(mlib.asLinks(content.attachments), 'ext', isHash))
      return new errors.BadLinkAttr('attachments', 'ext', 'attachments link must have a valid ext reference')
  },

  advert: function (content) {
    if (typeof content.text != 'string' || !content.text.trim())
      return new errors.BadAttr('text', 'Can not create an empty advert')
  },

  contact: function (content) {
    var links = mlib.asLinks(content.contact)
    if (links.length === 0)
      return new errors.MalformedMessage('contact link is required')
    if (!allLinksValid(links, 'feed', isFeedId))
      return new errors.BadLinkAttr('contact', 'feed', 'contact link must have a valid feed reference')

    if ('profilePic' in content && !allLinksValid(mlib.asLinks(content.profilePic), 'ext', isHash))
      return new errors.BadLinkAttr('profilePic', 'ext', 'profilePic link must have a valid ext reference')
    if ('alias' in content && content.alias !== false && content.alias !== null && typeof content.alias !== 'string')
      return new errors.BadAttr('alias', '`alias` must be a string, false, or null')

    if ('name' in content && (typeof content.name != 'string' || !content.name.trim()))
      return new errors.BadAttr('text', 'Contact msgs must have a `.name` string that is not blank')

    if ('following' in content && content.following !== true && content.following !== false)
      return new errors.BadAttr('following', 'Contact msgs must have a `.following` of true or false')

    if ('trust' in content && content.trust !== -1 && content.trust !== 0 && content.trust !== 1)
      return new errors.BadAttr('trust', 'Contact msgs must have a `.trust` of -1, 0, or 1')
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
  var adder = feed.publish || feed.add
  adder.call(feed, content, cb)
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
  contact: function (contact, opts) {
    var content = { type: 'contact', contact: { feed: contact } }
    for (var k in opts) {
      content[k] = opts[k]
    }
    return content
  },
  pub: function (address) {
    return { type: 'pub', address: address }
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

exports.getContact = function (ssb, opts, cb) {
  if (!opts || !opts.by || !opts.for)
    throw 'opts.by and opts.for are required'

  var contact = {}
  pull(
    ssb.feedsLinkedToFeed({ id: opts.for, rel: 'contact' }),
    pull.asyncMap(function (entry, cb) {
      if (entry.source == opts.by)
        ssb.get(entry.message, cb)
      else
        cb()
    }),
    pull.drain(
      function (msg) {
        for (var k in msg.content)
          contact[k] = msg.content[k]
      },
      function (err) {
        if (err)
          return cb(err)
        cb(null, contact)
      }
    )
  )
}
