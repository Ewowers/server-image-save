const ip = require("ip");
const Model = require("../model/blackList");
class Blacklist {
  async get(req, res) {
    let model = await Model.find({});
    return res.json(model);
  }
  async add(req, res) {
    const candidate = await Model.findOne({ ip: req.params.id });
    if (candidate) return res.json({ status: false });
    let model = new Model({ ip: req.body.id });
    await model.save();
    return res.json({ status: true });
  }
  async deletes(req, res) {
    const { id } = req.params;
    let ip = await Model.findByIdAndDelete(id);
    return res.json(ip);
  }
}
module.exports = new Blacklist();
