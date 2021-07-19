const User = require("../model/user");
const jwt = require("jsonwebtoken");
const ip = require("ip");
const { keyJWT } = require("../config");
const BlackList = require("../model/blackList");
const generateToket = (id, status) => {
  const payload = { id, status };
  return jwt.sign(payload, keyJWT, { expiresIn: "24h" });
};
class LogicgUsers {
  async token(req, res) {
    let token = req.cookies.toket;
    if (!token) return res.json({ status: false, message: "token not" });
    token = jwt.verify(token, keyJWT);
    let user = await User.findById(token.id);
    return res.json(user);
  }
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
    let { status } = req.body;
    switch (status) {
      case "admin":
        req.body.important = 5;
        break;
      case "moder":
        req.body.important = 4;
        break;
      case "user":
        req.body.important = 1;
        break;
      default:
        req.body.important = 0;
        break;
    }
    let users = await User.findByIdAndUpdate(req.params.id, { ...req.body });
    return res.json(users);
  }
  async registration(req, res) {
    let { name, password } = req.body;
    let candidate = await User.findOne({ name: name });
    let address = ip.address();
    let ipAdress = await BlackList.findOne({ ip: address });
    if (ipAdress) return res.json({ status: false, message: "вам бан" });
    if (candidate) {
      return res.json({ message: "Данный логин занят" });
    }
    let user = new User({
      name: name,
      password: password,
      status: "nouser",
      important: 0,
      ip: ip.address(),
    });
    await user.save();
    return res.cookie("toket", generateToket(user._id, user.status)).json({ status: true });
  }
  async authorization(req, res) {
    let { name, password } = req.body;
    let candidate = await User.findOne({ name: name });
    let address = ip.address();
    let ipAdress = await BlackList.findOne({ ip: address });
    if (ipAdress) return res.json({ status: false, message: "вам бан" });
    if (!candidate) return res.json({ status: false, message: "не верный логин" });
    if (password !== candidate.password) return res.json({ status: false, message: "не верный пороль" });
    if (!candidate.status) {
      return res
        .cookie("toket", generateToket(candidate._id, candidate.status))
        .json({ status: false, message: "пользователь не потвержден" });
    }
    return res
      .cookie("toket", generateToket(candidate._id, candidate.status))
      .json({ status: true, url: candidate.status === "user" ? "user/" + candidate._id : "admin" });
  }
  async updatesUser(req, res) {
    let { email, phone, address, ava } = req.body;
    let token = req.cookies.toket;
    let id = jwt.verify(token, keyJWT);
    await User.findByIdAndUpdate(id.id, {
      email: email || "",
      phone: parseInt(phone) || null,
      address: address || "",
      ava: ava || null,
    });
  }
  async onload(req, res) {
    let admin = await User.findOne({ name: "admin" });
    if (!admin) {
      new User({
        name: "admin",
        password: "admin",
        status: "admin",
        important: 5,
      }).save();
    }
    try {
      let token = req.cookies.toket;
      if (!token) return res.json({ status: false, message: "token not" });
      token = jwt.verify(token, keyJWT);
      let user = await User.findById(token.id);
      if (!user) return res.json({ status: false, message: "user not" });
      if (user.status === "nouser") res.json({ status: false, registr: false });
      return res.json({ status: true, registr: true, url: user.status === "user" ? "user/" + user._id : "admin" });
    } catch (e) {
      return res.json({ status: false });
    }
  }
}

//let ip = req.headers["x-forwarded-for"];

module.exports = new LogicgUsers();
