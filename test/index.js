var tape = require('tape')
var schemas = require('../')

var feedid = '@5BmAwnJXrDVYje5FJX6Cg1eolZiWLZsThd5p/4ZJ6VY=.ed25519'
var msgid  = '%RYnp9p24dlAPYGhrsFYdGGHIAYM2uM5pr1//RocCF/U=.sha256'
var blobid = '&RYnp9p24dlAPYGhrsFYdGGHIAYM2uM5pr1//RocCF/U=.sha256'

tape('schemas', function (t) {
  t.deepEqual(
    schemas.post('text'),
    { type: 'post', text: 'text' }
  )
  t.deepEqual(
    schemas.post('text', msgid, null, [feedid]),
    { type: 'post', text: 'text', repliesTo: { link: msgid }, recps: [{ link: feedid }] }
  )
  t.deepEqual(
    schemas.post('text', null, [feedid, msgid, blobid]),
    { type: 'post', text: 'text', mentions: [{ link: feedid }, { link: msgid }, { link: blobid }] }
  )
  t.deepEqual(
    schemas.post('text', msgid, [feedid, msgid, blobid], [feedid]),
    { type: 'post', text: 'text', repliesTo: { link: msgid }, mentions: [{ link: feedid }, { link: msgid }, { link: blobid }], recps: [{ link: feedid }] }
  )
  t.deepEqual(
    schemas.name(feedid, 'name'),
    { type: 'about', about: { link: feedid }, name: 'name' }
  )
  t.deepEqual(
    schemas.image(feedid, { link: blobid, size: 123 }),
    { type: 'about', about: { link: feedid }, image: { link: blobid, size: 123 } }
  )
  t.deepEqual(
    schemas.about(feedid, 'name', { link: blobid, size: 123 }),
    { type: 'about', about: { link: feedid }, name: 'name', image: { link: blobid, size: 123 } }
  )
  t.deepEqual(
    schemas.follow(feedid),
    { type: 'contact', contact: { link: feedid }, following: true, blocking: false }
  )
  t.deepEqual(
    schemas.unfollow(feedid),
    { type: 'contact', contact: { link: feedid }, following: false }
  )
  t.deepEqual(
    schemas.block(feedid),
    { type: 'contact', contact: { link: feedid }, following: false, blocking: true }
  )
  t.deepEqual(
    schemas.unblock(feedid),
    { type: 'contact', contact: { link: feedid }, blocking: false }
  )
  t.deepEqual(
    schemas.vote(msgid, 1),
    { type: 'vote', vote: { link: msgid, value: 1 } }
  )
  t.deepEqual(
    schemas.flag(msgid, 'reason'),
    { type: 'flag', flag: { link: msgid, reason: 'reason' } }
  )
  t.deepEqual(
    schemas.unflag(msgid, msgid),
    { type: 'flag', flag: { link: msgid, reason: false }, redacts: { link: msgid } }
  )
  t.deepEqual(
    schemas.pub(feedid, 'host', 123),
    { type: 'pub', pub: { link: feedid }, host: 'host', port: 123 }
  )
  t.end()
})
