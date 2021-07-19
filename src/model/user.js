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
  ip: String,
  important: Number,
  phone: Number,
  email: String,
  fio: String,
  address: String,
  ava: String,
});
module.exports = model("users", schema);
