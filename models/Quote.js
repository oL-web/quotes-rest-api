const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quote", quoteSchema);
