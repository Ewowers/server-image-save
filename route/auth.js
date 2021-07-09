const { Router } = require("express");
let User = require("./user");
const router = Router();
router.get("/", async (req, res) => {
  //все пользователи без потвержденной регистраций
  let users = await User.find({ registry: false });
  let test = await User.find();
  console.log(test);
  let array = [];
  users = users.map((item) => {
    array.push({ name: item.name, id: item._id });
  });
  res.json(array);
});
router.delete("/:id", async (req, res) => {
  //удалить регистрацию
  let user = await User.findByIdAndDelete(req.params.id);
  res.status(200).json(user);
});
router.put("/:id", async (req, res) => {
  //потвердить регистраци.
  let { id } = req.params.id;
  console.log(id);
  let user = await User.findByIdAndUpdate(req.params.id, { registry: true });
  res.status(200).json(user);
});
router.post("/registration", async (req, res) => {
  //регистрация
  let { name, password } = req.body;
  let candidate = await User.findOne({ name: name });
  if (candidate) res.status(200).json({ status: false, message: "Данный логин занят" });
  else {
    let user = new User({
      name: name,
      password: password,
      registry: false,
    });
    await user.save();
    res.status(200);
  }
});
router.post("/authorization", async (req, res) => {
  //авторизация
  let { name, password } = req.body;
  let candidate = await User.findOne({ name: name });
  if (!candidate) res.status(200).json({ status: false, message: "Пользователь не существует" });
  else if (candidate.password !== password) {
    res.json({ status: false, message: "Пороль не верный" });
  } else if (!candidate.registry) {
    res.status(200).json({ status: false, message: "Администратор не подвердил вашу регистрацию" });
  }
  res.cookie("id", candidate._id);
  res.json({ status: true, name: candidate.name });
});
router.post("/onload", async (req, res) => {
  //вход при загрузки страницы
  let user = await User.findById(req.cookies.id);
  user.password = null;
  if (!!user) res.json({ status: true, user: user });
  else res.json({ status: false });
});
router.post("/out", (req, res) => {
  //выход
  res.clearCookie("id").status(200).send(true);
});
module.exports = router;
