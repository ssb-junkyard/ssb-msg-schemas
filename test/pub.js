const test = require('tape')

const { pub: Pub } = require('../')
const { feedId } = require('./mockIds')

test('Pub create', t => {
  t.deepEqual(
    Pub(feedId, 'host.co', 123),
    { type: 'pub', pub: { link: feedId, host: 'host.co', port: 123 } }
  )
  t.end()
})
