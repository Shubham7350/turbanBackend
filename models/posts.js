var mongoose = require('mongoose')

var postSchema = new mongoose.Schema({
    photoLink: String
});

const Post = mongoose.model('Post', postSchema)
module.exports = Post;