const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    following: { type: Array },
    follow_requests: { type: Array }
});

// UserSchema.virtual('fullname').get(function () {
//     return `${this.first} ${this.last}`;
// });

module.exports = mongoose.model('User', UserSchema);
