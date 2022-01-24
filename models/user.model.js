const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
      name: {
            type: String,
            required: true
      },
      username: {
            type: String,
            required: true
      },
      password: {
            type: String,
            required: true
      },
      role: {
            type: String,
            required: true
      },
      createDatetime: {
            type: Date,
            required: true,
            default: Date.now
      }
}, { collection: 'User' });

module.exports = mongoose.model("User", userSchema);