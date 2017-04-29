const test = require('tape')

const { vote: Vote } = require('../')
const { msgId } = require('./mockIds')

test('Vote create', function (t) {
  t.deepEqual(
    Vote(msgId, 1),
    { type: 'vote', vote: { link: msgId, value: 1 } }
  )
  t.deepEqual(
    Vote(msgId, -1, 'reason'),
    { type: 'vote', vote: { link: msgId, value: -1, reason: 'reason' } }
  )
  t.end()
})

