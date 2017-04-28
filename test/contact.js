const test = require('tape')

const { follow, unfollow, block, unblock } = require('../')
const { postId, msgId, msgId2, feedId, blobId } = require('./mockIds')

test('Contact creators', t => {
  t.deepEqual(
    follow(feedId),
    { type: 'contact', contact: feedId, following: true, blocking: false },
    'follow'
  )
  t.deepEqual(
    unfollow(feedId),
    { type: 'contact', contact: feedId, following: false },
    'unfollow'
  )
  t.deepEqual(
    block(feedId),
    { type: 'contact', contact: feedId, following: false, blocking: true },
    'block'
  )
  t.deepEqual(
    unblock(feedId),
    { type: 'contact', contact: feedId, blocking: false },
    'unblock'
  )
  t.end()
})
