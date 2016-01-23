var mongoose = require('mongoose');

var schema = mongoose.Schema({
  comment_desc: String,
  comment_author: String,
  post_id: mongoose.Schema.Types.ObjectId
});

var Comment = mongoose.model('comments', schema);
module.exports = Comment;