const mongoose = require('mongoose');

const slipSchema = new mongoose.Schema({
      customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true
      },
      slipImg: {
            type: String,
            required: true
      },
      slipPoint: {
            type: Number,
            required: true,
            min: 0
      },
      givenStatus : {
            type: mongoose.Schema.Types.Boolean,
      },
      givenBy: {
            type: mongoose.Schema.Types.ObjectId,
      },
      updDate: {
            type: Date,
            required: true,
            default: Date.now
      }
}, { collection: 'Image_Slip' });

module.exports = mongoose.model("ImageSlip", slipSchema);