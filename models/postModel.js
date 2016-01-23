var mongoose = require('mongoose');

var schema = mongoose.Schema({
  title: String,
  body: String,
  author: String,
  photo: String
});

var Post = mongoose.model('posts', schema);
module.exports = Post;