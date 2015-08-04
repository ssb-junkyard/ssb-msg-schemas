# SSB Message Schemas

Functions to create common SSB messages.

```js
{ type: 'post', text: String, repliesTo: Link, recps: FeedLinks, mentions: Links }
{ type: 'about', about: Link, name: String, image: BlobLink }
{ type: 'contact', contact: FeedLink, following: Bool, blocking: Bool }
{ type: 'vote', vote: { link: Ref, value: -1|0|1 } }
{ type: 'flag', flag: { link: Ref, reason: false|String }, redacts: MsgLink }
{ type: 'pub', pub: FeedLink, host: String, port: Number }
```


```js
var schemas = require('ssb-msg-schemas')

schemas.post(text, repliesTo (optional), mentions (optional), recps (optional))
// => { type: 'post', text: text, repliesTo: repliesTo, mentions: mentions, recps: recps }
schemas.name(userId, name)
// => { type: 'about', about: { link: userId }, name: name }
schemas.image(userId, imgLink)
// => { type: 'about', about: { link: userId }, image: imgLink }
schemas.about(userId, name, imgLink)
// => { type: 'about', about: { link: userId }, name: name, image: imgLink }
schemas.follow(userId)
// => { type: 'contact', contact: { link: userId }, following: true, blocking: false }
schemas.unfollow(userId)
// => { type: 'contact', contact: { link: userId }, following: false }
schemas.block(userId)
// => { type: 'contact', contact: { link: userId }, following: false, blocking: true }
schemas.unblock(userId)
// => { type: 'contact', contact: { link: userId }, blocking: false }
schemas.vote(id, vote)
// => { type: 'vote', vote: { link: id, value: vote } }
schemas.flag(id, reason)
// => { type: 'flag', flag: { link: id, reason: reason } }
schemas.unflag(id, flagmsgId (optional))
// => { type: 'flag', flag: { link: id, reason: false }, redacts: { msg: flagmsgId } }
schemas.pub(id, host, port)
// => { type: 'pub', pub: { link: id }, host: host, port: port }
```