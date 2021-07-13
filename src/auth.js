const { Router } = require("express");
let User = require("./model/user");
const router = Router();
router.post("/user/:id", async (req, res) => {
  let user = await User.findById(req.params.id);
  res.json(user);
});
router.get("/", async (req, res) => {
  //все Юзеры
  const users = await User.find();
  res.json(users);
});
router.delete("/:id", async (req, res) => {
  //удалить регистрацию
  let user = await User.findByIdAndDelete(req.params.id);
  res.status(200).json(user);
});
router.put("/:id", async (req, res) => {
  //потвердить регистраци.
  await User.findByIdAndUpdate(req.params.id, { ...req.body });
});
router.post("/registration", async (req, res) => {
  //регистрация
  let { name, password } = req.body;
  let candidate = await User.findOne({ name: name });
  if (candidate) res.json({ position: false, message: "Данный логин занят" });
  else {
    let user = new User({
      name: name,
      password: password,
      status: "user",
    });
    await user.save();
    res.cookie("id", user._id).json({ status: true, name: user.name, url: "product" });
  }
});
router.post("/authorization", async (req, res) => {
  //авторизация
  let { name, password } = req.body;
  let candidate = await User.findOne({ name: name });
  if (!candidate) {
    res.status(200).json({ status: false, message: "Пользователь не существует" });
  }
  if (candidate.password !== password) res.json({ status: false, message: "Логин не верный" });
  res.cookie("id", candidate._id);
  if (candidate?.status === "admin") res.json({ status: true, name: candidate.name, url: "admin" });
  if (candidate?.status === "user") res.json({ status: true, name: candidate.name, url: "product" });
});
router.post("/onload", async (req, res) => {
  //вход при загрузки страницы
  let user = await User.findById(req.cookies.id);
  if (user?.status === "admin") res.json({ status: true, name: user.name, url: "admin" });
  if (user?.status === "user") res.json({ status: true, name: user.name, url: "product" });
  res.json({ status: false });
});
router.post("/out", (req, res) => {
  //выход
  res.clearCookie("id").status(200).send(true);
});

module.exports = router;
