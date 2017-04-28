const test = require('tape')

const { name: Name, image: Image } = require('../')
const { postId, msgId, msgId2, feedId, blobId } = require('./mockIds')

test('About create', t => {
  t.deepEqual(
    Name(feedId, 'donna'),
    { type: 'about', about: feedId, name: 'donna' },
    'Name creates a message which assigns a feed name'
  )

  t.deepEqual(
    Image(feedId, { link: blobId, size: 123 }),
    { type: 'about', about: feedId, image: { link: blobId, size: 123 } },
    'Image creates a message which assigns a feed image'
  )

  t.end()
})

