# SSB Message Schemas

validation and publishing methods for common ssb message types


```js
var schemas = require('ssb-msg-schemas')

// validates the message content, returns undefined if passing or an error object otherwise
schemas.validate(content)

// individual validator functions (by message type)
schemas.validators.post(content)
schemas.validators.advert(content)
schemas.validators.contact(content)
schemas.validators.pub(content)

// publishing functions
// - `feed` should be the feed interface, eg an ssb feed or sbot rpc api
schemas.addPost(feed, text, [{ repliesTo: link, refers: links, mentions: links, attachments: links }], cb)
schemas.addAdvert(feed, text, cb)
schemas.addContact(feed, target, {
  following: bool,
  name: string,
  alias: string|false, // is this feed an alias of my feed? suggested values: 'primary', 'secondary', or false
  trust: -1|0|1,
  profilePic: {
    ext: hash,
    type: string, // should be an image mimetype, eg 'image/png'
    size: number, // in bytes
    width: number, // in pixels (optional)
    height: number // in pixels (optional)
  },
}, cb)
schemas.addPub(address, cb)

// get functions
schemas.getContact(ssb, { by: feed_id, for: feed_id }, cbb)

// errors
schemas.errors.UnknownType
schemas.errors.MalformedMessage
schemas.errors.BadAttr
schemas.errors.BadLinkAttr
```