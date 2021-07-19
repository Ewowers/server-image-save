const { Schema, model } = require("mongoose");
const schema = new Schema({
  ip: String,
});
module.exports = model("blackList", schema);
