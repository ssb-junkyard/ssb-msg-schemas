function UnknownTypeError(msg) {
  this.name = 'UnknownType'
  this.unknownType = true
  this.message = (msg||'Unknown message type')
}
UnknownTypeError.prototype = Error.prototype
exports.UnknownType = UnknownTypeError

function MalformedMessageError(msg) {
  this.name = 'MalformedMessage'
  this.unknownType = true
  this.message = (msg||'Malformed message')
}
MalformedMessageError.prototype = Error.prototype
exports.MalformedMessage = MalformedMessageError

function BadAttrError(attr, msg) {
  this.name = 'BadAttr'
  this.badAttr = true
  this.attr = attr
  this.message = (msg||'Bad attribute')
}
BadAttrError.prototype = Error.prototype
exports.BadAttr = BadAttrError

function BadLinkAttrError(linkRel, attr, msg) {
  this.name = 'BadLinkAttr'
  this.badLinkAttr = true
  this.linkRel = linkRel
  this.attr = attr
  this.message = (msg||'Bad attribute')
}
BadLinkAttrError.prototype = Error.prototype
exports.BadLinkAttr = BadLinkAttrError

