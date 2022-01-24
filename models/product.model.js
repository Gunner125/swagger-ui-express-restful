const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
      productName: {
            type: String,
            required: true
      },
      productPointUse: {
            type: Number,
            required: true,
            min: 0
      },
      cr_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
      },
      cr_date: {
            type: Date,
            required: true,
            default: Date.now
      }
}, { collection: 'Product' });

module.exports = mongoose.model("Product", productSchema);