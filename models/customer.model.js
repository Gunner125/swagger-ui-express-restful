const mongoose = require('mongoose');

const convertPointHistory = new mongoose.Schema({
      productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
      },
      convertedPoint: {
            type: Number,
            required: true,
            min: 0
      },
      convertDate: {
            type: Date,
            required: true,
            default: Date.now
      }
});

const customerSchema = new mongoose.Schema({
      firstname: {
            type: String,
            required: true
      },
      lastname: {
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
      age: {
            type: Number,
            required: true
      },
      point: {
            type: Number,
            required: true,
            min: 0
      },
      role: {
            type: String,
            required: true
      },
      convertPointHistory: [convertPointHistory],
      registerDate: {
            type: Date,
            required: true,
            default: Date.now
      }
}, { collection: 'Customer' });

module.exports = mongoose.model("Customer", customerSchema);