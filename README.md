# SSB Message Schemas

validation and publishing methods for common ssb message types


```js
var schemas = require('ssb-msg-schemas')

// validates the message content, returns undefined if passing or an error object otherwise
schemas.validate(content)

// individual validator functions (by message type)
schemas.validators.post(content)
schemas.validators.advert(content)
schemas.validators.name(content)
schemas.validators.follow(content)
schemas.validators.trust(content)

// publishing functions
// - `feed` should be the feed interface, eg an ssb feed or sbot rpc api
schemas.addPost(feed, text, [{ repliesTo: link, refers: links, mentions: links, attachments: links }], cb)
schemas.addAdvert(feed, text, cb)
schemas.addOwnName(feed, name, cb)
schemas.addOtherName(feed, target, name, cb)
schemas.addFollow(feed, target, cb)
schemas.addUnfollow(feed, target, cb)
schemas.addTrust(feed, target, value, cb)

// errors
schemas.errors.UnknownType
schemas.errors.MalformedMessage
schemas.errors.BadAttr
schemas.errors.BadLinkAttr
```