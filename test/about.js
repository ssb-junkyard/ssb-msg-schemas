const test = require('tape')

const { name: Name, image: Image, isAbout } = require('../')
const { feedId, blobId } = require('./mockIds')

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

test('About validate', t => {
  t.true(
    isAbout({
      type: 'about', about: feedId, name: 'donna'
    }),
    'passes well formed name-type about messages'
  )

  t.true(
    isAbout({
      type: 'about', about: feedId, image: { link: blobId, size: 123 }
    }),
    'passes well formed image-type about messages'
  )

  t.false(
    isAbout({
      type: 'aboot', about: feedId
    }),
    'fails non-about messages'
  )

  t.false(
    isAbout({
      type: 'about', about: 'dudFeedId', name: 'donna'
    }),
    'fails dud about ids'
  )

  t.false(
    isAbout({
      type: 'about', about: feedId, name: 22
    }),
    'fails dud name'
  )

  t.false(
    isAbout({
      type: 'about', about: feedId, image: { link: 'badBlobId', size: 123 }
    }),
    'fails dud image (must have blobIds)'
  )

  t.false(
    isAbout({
      type: 'about', about: feedId, image: { link: blobId, size: 'dave' }
    }),
    'fails dud image (must have size)'
  )

  t.false(
    isAbout({
      type: 'about', about: feedId
    }),
    'fails message which has neither name nor image'
  )

  t.end()
})

