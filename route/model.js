const { Schema, model } = require("mongoose");
const schema = new Schema({
  title: {
    required: true,
    type: String,
  },
  prise: {
    required: true,
    type: Number,
  },
  type: {
    required: true,
    type: String,
  },
  upload: {
    required: true,
    type: String,
  },
});
module.exports = model("Product", schema);
