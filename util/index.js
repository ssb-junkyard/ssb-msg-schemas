const mlib = require('ssb-msgs')
const { isLink } = require('ssb-ref')

function link (l) {
  if (typeof l === 'string') {
    if (isLink(l)) { return l }
  }
  if (l && typeof l === 'object') {
    if (Object.keys(l).length === 1 && l.link && isLink(l)) { return l }
    return mlib.link(l)
  }
}

function links (l) {
  if (!l) return
  if (!Array.isArray(l)) l = [l]
  return l.map(link)
}

function stringifyRegex (regex) {
  return regex.toString()
    .replace(/^\//, '')
    .replace(/\/$/, '')
}

module.exports = {
  link,
  links,
  stringifyRegex
}

