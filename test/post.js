const test = require('tape')

const { post: Post, isPost } = require('../')
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

test('Post validate', t => {
  t.true(
    isPost({
      type: 'post',
      text: 'here is a some text'
    }),
    'passes simple post message'
  )

  t.false(
    isPost({
      type: 'posts',
      text: 'here is a some text'
    }),
    'fails non-post messages'
  )

  t.false(
    isPost({
      type: 'posts'
    }),
    'fails post without text'
  )

  t.true(
    isPost({
      type: 'post',
      text: 'here is a some text',
      root: msgId,
      branch: msgId2
    }),
    'passes simple reply-post message'
  )

  t.false(
    isPost({
      type: 'post',
      text: 'here is a some text',
      root: 'not a root id',
      branch: msgId2
    }),
    'fails reply test if root is not a feed id'
  )
  t.false(
    isPost({
      type: 'post',
      text: 'here is a some text',
      root: msgId,
      branch: 'not a branch id'
    }),
    'fails reply test if branch is not a feed id'
  )


  t.end()
})

