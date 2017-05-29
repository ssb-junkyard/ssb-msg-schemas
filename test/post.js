const test = require('tape')

const { post: Post, isPost } = require('../')
const { msgId, msgId2, feedId, blobId, channelId } = require('./mockIds')

// NOTE : to check validation errors, you can do this:
// isPost( testMsg )
// console.log('show errors on last validation', isPost.errors)

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
    Post('dog', null, null, [feedId, msgId, blobId, channelId]),
    { type: 'post', text: 'dog', mentions: [feedId, msgId, blobId, channelId] }
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

  // SIMPLE POST

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

  // REPLIES

  t.true(
    isPost({
      type: 'post',
      text: 'here is a some text',
      root: msgId,
      branch: msgId2
    }),
    'passes simple reply-post message'
  )
  t.true(
    isPost({
      type: 'post',
      text: 'here is a some text',
      root: msgId,
      branch: [ msgId2 ]  // could be one or more ids
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

  // CHANNELS

  t.true(
    isPost({
      type: 'post',
      text: 'here is a some text',
      channel: 'new-zealand',
    }),
    'passes post with channel'
  )
  t.false(
    isPost({
      type: 'post',
      text: 'here is a some text',
      channel: 23,
    }),
    'fails post with non-string channel'
  )

  // MENTIONS

  t.true(
    isPost({
      type: 'post',
      text: 'here is a some text',
      mentions: [
        {
          link: feedId,
          name: 'Piet'
        },
        {
          link: blobId,
          name: 'Tararuras.jpg'
        },
        {
          link: msgId 
        },
        {
          link: channelId
        }
      ]
    }),
    'passes post with combination of feed + blob + message mentions'
  )
  t.true(
    isPost({
      type: 'post',
      text: 'here is a some text',
      mentions: null
    }),
    'passes post with null mentions'
  )
  t.true(
    isPost({
      type: 'post',
      text: 'here is a some text',
      mentions: []
    }),
    'passes post with empty mentions'
  )

  t.false(
    isPost({
      type: 'post',
      text: 'here is a some text',
      mentions: [
        {
          link: 'not a link',
          name: 'Piet'
        },
      ]
    }),
    'fails a post with a dud mention link'
  )
  t.false(
    isPost({
      type: 'post',
      text: 'here is a some text',
      mentions: [
        msgId
      ]
    }),
    'fails a post with badly formed mentions'
  )

  // RECPS

  t.true(
    isPost({
      type: 'post',
      text: 'here is a some text',
      recps: [
        feedId,
        {
          link: feedId,
          name: 'Piet'
        }
      ]
    }),
    'passes post with combination of recipient mentions'
  )
  t.true(
    isPost({
      type: 'post',
      text: 'here is a some text',
      recps: null
    }),
    'passes post with null recps'
  )
  t.true(
    isPost({
      type: 'post',
      text: 'here is a some text',
      recps: []
    }),
    'passes post with empty recps'
  )

  t.false(
    isPost({
      type: 'post',
      text: 'here is a some text',
      recps: [
        'not an id',
        {
          link: feedId,
          name: 'Piet'
        }
      ]
    }),
    'fails a post with a broken string recps'
  )
  t.false(
    isPost({
      type: 'post',
      text: 'here is a some text',
      recps: [
        feedId,
        {
          link: 'not an Id',
          name: 'Piet'
        }
      ]
    }),
    'fails a post with a broken link recps'
  )

  t.end()
})

