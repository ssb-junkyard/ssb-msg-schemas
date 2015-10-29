var tape = require('tape')
var schemas = require('../')

var feedid = '@5BmAwnJXrDVYje5FJX6Cg1eolZiWLZsThd5p/4ZJ6VY=.ed25519'
var msgid  = '%RYnp9p24dlAPYGhrsFYdGGHIAYM2uM5pr1//RocCF/U=.sha256'
var msgid2 = '%SYnp9p24dlAPYGhrsFYdGGHIAYM2uM5pr1//RocCF/U=.sha256'
var blobid = '&RYnp9p24dlAPYGhrsFYdGGHIAYM2uM5pr1//RocCF/U=.sha256'

tape('schemas', function (t) {
  t.deepEqual(
    schemas.post('text'),
    { type: 'post', text: 'text' }
  )
  t.deepEqual(
    schemas.post('text', msgid, msgid2, null, [feedid]),
    { type: 'post', text: 'text', root: msgid, branch: msgid2, recps: [feedid] }
  )
  t.deepEqual(
    schemas.post('text', null, null, [feedid, msgid, blobid]),
    { type: 'post', text: 'text', mentions: [feedid, msgid, blobid] }
  )
  t.deepEqual(
    schemas.post('text', msgid, msgid2, [feedid, msgid, blobid], [feedid]),
    { type: 'post', text: 'text', root: msgid, branch: msgid2, mentions: [feedid, msgid, blobid], recps: [feedid] }
  )
  t.deepEqual(
    schemas.name(feedid, 'name'),
    { type: 'about', about: feedid, name: 'name' }
  )
  t.deepEqual(
    schemas.image(feedid, { link: blobid, size: 123 }),
    { type: 'about', about: feedid, image: { link: blobid, size: 123 } }
  )
  t.deepEqual(
    schemas.follow(feedid),
    { type: 'contact', contact: feedid, following: true, blocking: false }
  )
  t.deepEqual(
    schemas.unfollow(feedid),
    { type: 'contact', contact: feedid, following: false }
  )
  t.deepEqual(
    schemas.block(feedid),
    { type: 'contact', contact: feedid, following: false, blocking: true }
  )
  t.deepEqual(
    schemas.unblock(feedid),
    { type: 'contact', contact: feedid, blocking: false }
  )
  t.deepEqual(
    schemas.vote(msgid, 1),
    { type: 'vote', vote: { link: msgid, value: 1 } }
  )
  t.deepEqual(
    schemas.vote(msgid, -1, 'reason'),
    { type: 'vote', vote: { link: msgid, value: -1, reason: 'reason' } }
  )
  t.deepEqual(
    schemas.pub(feedid, 'host', 123),
    { type: 'pub', pub: { link: feedid, host: 'host', port: 123 } }
  )
  t.end()
})
