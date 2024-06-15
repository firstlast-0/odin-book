const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    text: { type: String, required: true },
    on: { type: Schema.Types.ObjectId, ref: "Post" },
    by: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model('Comment', CommentSchema);
