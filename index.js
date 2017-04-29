const {
  create: { name, image },
  schema: aboutSchema,
  validate: isAbout
} = require('./about')

const {
  create: { follow, unfollow, block, unblock }
} = require('./contact')

const {
  create: post,
  schema: postSchema,
  validate: isPost
} = require('./post')


const {
  create: postEdit
} = require('./post-edit')

const { 
  create: pub
} = require('./pub')

const {
  create: vote
} = require('./vote')

module.exports = {
  name, image, aboutSchema, isAbout,
  follow, unfollow, block, unblock,
  post, postSchema, isPost,
  postEdit,
  pub,
  vote
}

