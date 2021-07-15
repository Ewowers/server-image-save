const User = require("../model/user");
const jwt = require("jsonwebtoken");
const { keyJWT } = require("../config");
const generateToket = (id, status) => {
  const payload = { id, status };
  return jwt.sign(payload, keyJWT, { expiresIn: "24h" });
};
class LogicgUsers {
  async gets(req, res) {
    let type = req.params.id;
    let users;
    if (type === "all") users = await User.find({});
    else users = await User.find({ status: type });
    return res.json(users);
  }
  async getOneUser(req, res) {
    let users = await User.findById(req.params.id);
    return res.json(users);
  }
  async deleteUser(req, res) {
    let users = await User.findByIdAndDelete(req.params.id);
    return res.json(users);
  }
  async updateUser(req, res) {
    console.log(req.body);
    let users = await User.findByIdAndUpdate(req.params.id, { ...req.body });
    return res.json(users);
  }
  async registration(req, res) {
    let { name, password } = req.body;
    let candidate = await User.findOne({ name: name });
    console.log(name, password);
    if (candidate) {
      return res.json({ message: "Данный логин занят" });
    }
    let user = new User({
      name: name,
      password: password,
      status: "nouser",
    });
    await user.save();
    return res.cookie("toket", generateToket(user._id, user.status)).json({ status: true });
  }
  async authorization(req, res) {
    let { name, password } = req.body;
    let candidate = await User.findOne({ name: name });
    if (!candidate) return res.json({ status: false, message: "не верный логин" });
    if (password !== candidate.password) return res.json({ status: false, message: "не верный пороль" });
    if (!candidate.status) {
      return res
        .cookie("toket", generateToket(candidate._id, candidate.status))
        .json({ status: false, message: "пользователь не потвержден" });
    }
    return res
      .cookie("toket", generateToket(candidate._id, candidate.status))
      .json({ status: true, url: candidate.status === "user" ? "user" : "admin" });
  }
  async onload(req, res) {
    let admin = await User.findOne({ name: "admin" });
    if (!admin) {
      new User({
        name: "admin",
        password: "admin",
        status: "admin",
      }).save();
    }
    let token = req.cookies.toket;
    if (!token) return res.json({ status: false, message: "token not" });
    token = jwt.verify(token, keyJWT);
    let user = await User.findById(token.id);
    if (!user) return res.json({ status: false, message: "user not" });
    if (user.status === "nouser") res.json({ status: false, registr: false });
    return res.json({ status: true, registr: true, url: user.status === "user" ? "user" : "admin" });
  }
}
module.exports = new LogicgUsers();
