const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    text: { type: String, required: true },
    by: { type: Schema.Types.ObjectId, ref: "User" },
    time: { type: Date },
    likedBy: { type: Array }
});

module.exports = mongoose.model('Post', PostSchema);
