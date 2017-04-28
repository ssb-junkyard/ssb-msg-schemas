const {
  create: { name, image } 
} = require('./about')

const {
  create: { follow, unfollow, block, unblock }
} = require('./contact')

const { 
  create: post
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
  post,
  name, image,
  follow, unfollow,
  block, unblock,
  pub,
  vote
}

