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
  status: {
    type: String,
  },
});
module.exports = model("users", schema);
