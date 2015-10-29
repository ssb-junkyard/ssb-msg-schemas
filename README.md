# SSB Message Schemas

Functions to create common SSB messages.

```js
{ type: 'post', text: String, root: Link, branch: Link, recps: FeedLinks, mentions: Links }
{ type: 'about', about: Link, name: String, image: BlobLink }
{ type: 'contact', contact: FeedLink, following: Bool, blocking: Bool }
{ type: 'vote', vote: { link: Ref, value: -1|0|1, reason: String } }
{ type: 'pub', pub: { link: FeedRef, host: String, port: Number } }
```


```js
var schemas = require('ssb-msg-schemas')

schemas.post(text, root (optional), branch (optional), mentions (optional), recps (optional))
// => { type: 'post', text: text, root: root, branch: branch, mentions: mentions, recps: recps }
schemas.name(userId, name)
// => { type: 'about', about: userId, name: name }
schemas.image(userId, imgLink)
// => { type: 'about', about: userId, image: imgLink }
schemas.about(userId, name, imgLink)
// => { type: 'about', about: userId, name: name, image: imgLink }
schemas.follow(userId)
// => { type: 'contact', contact: userId, following: true, blocking: false }
schemas.unfollow(userId)
// => { type: 'contact', contact: userId, following: false }
schemas.block(userId)
// => { type: 'contact', contact: userId, following: false, blocking: true }
schemas.unblock(userId)
// => { type: 'contact', contact: userId, blocking: false }
schemas.vote(id, vote)
// => { type: 'vote', vote: { link: id, value: vote } }
schemas.vote(id, vote, reason)
// => { type: 'vote', vote: { link: id, value: vote, reason: reason } }
schemas.pub(id, host, port)
// => { type: 'pub', pub: { link: id, host: host, port: port } }
```