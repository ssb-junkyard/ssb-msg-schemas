const test = require('tape')

const { post: Post } = require('../')
const { msgId, msgId2, feedId, blobId } = require('./mockIds')

test('Post create', t => {
  t.deepEqual(
    Post('dog'),
    { type: 'post', text: 'dog' }
  )
  t.deepEqual(
    Post('dog', msgId, msgId2, null, [feedId]),
    { type: 'post', text: 'dog', root: msgId, branch: msgId2, recps: [feedId] }
  )
  t.deepEqual(
    Post('dog', null, null, [feedId, msgId, blobId]),
    { type: 'post', text: 'dog', mentions: [feedId, msgId, blobId] }
  )
  t.deepEqual(
    Post('dog', msgId, msgId2, [feedId, msgId, blobId], [feedId]),
    { type: 'post', text: 'dog', root: msgId, branch: msgId2, mentions: [feedId, msgId, blobId], recps: [feedId] }
  )

  t.throws(() => Post('dog', null, msgId2), 'if there is a branch, there should also be a root')

  // TODO : test possible malformed Ids coming in

  t.end()
})
