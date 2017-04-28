const test = require('tape')

const { postEdit } = require('../')
const { msgId, msgId2, feedId } = require('./mockIds')

test('Post-edit create', t => {
  t.throws(() => postEdit('revised text') )
  t.deepEqual(
    postEdit('revised text', msgId, msgId, msgId, [feedId]),
    { type: 'post-edit', text: 'revised text', root: msgId, revisionRoot: msgId, revisionBranch: msgId, mentions: [feedId]}
  )
  t.deepEqual(
    postEdit('revised text', msgId, msgId2, msgId2, null),
    { type: 'post-edit', text: 'revised text', root: msgId, revisionRoot: msgId2, revisionBranch: msgId2}
  )
})
