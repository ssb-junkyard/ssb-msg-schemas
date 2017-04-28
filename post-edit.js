const { link, links } = require('./util') 

function create (text, root, revisionRoot, revisionBranch, mentions) {
  var content = { type: 'post-edit', text: text }
  if (root) {
    root = link(root)
    if (!root)
      throw new Error('root is not a valid link')
    content.root = root
  }
  
  revisionRoot = link(revisionRoot)
  if (!revisionRoot)
    throw new Error('revisionRoot is not a valid link')
  content.revisionRoot = revisionRoot

  revisionBranch = link(revisionBranch)
  if (!revisionBranch)
    throw new Error('revisionBranch is not a valid link')
  content.revisionBranch = revisionBranch

  if (mentions && (!Array.isArray(mentions) || mentions.length)) {
    mentions = links(mentions)
    if (!mentions || !mentions.length)
      throw new Error('mentions are not valid links')
    content.mentions = mentions
  }
  
  return content  
}

const schema = {}

const valitate = () => {}

module.exports = {
  create,
  schema,
  valitate
}

