const { Schema, model } = require("mongoose");
const schema = new Schema({
  name: {
    required: true,
    unique: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  registry: {
    required: true,
    type: Boolean,
  },
});
module.exports = model("users", schema);
