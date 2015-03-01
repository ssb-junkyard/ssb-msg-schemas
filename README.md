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
schemas.validators.contact(content)
schemas.validators.pub(content)

// publishing functions
// - `feed` should be the feed interface, eg an ssb feed or sbot rpc api
schemas.addPost(feed, text, [{ repliesTo: link, refers: links, mentions: links, attachments: links }], cb)
schemas.addAdvert(feed, text, cb)
schemas.addName(feed, name, cb)
schemas.addContact(feed, target, { following: bool, name: string, trust: -1|0|1 }, cb)
schemas.addPub(address, cb)

// errors
schemas.errors.UnknownType
schemas.errors.MalformedMessage
schemas.errors.BadAttr
schemas.errors.BadLinkAttr
```