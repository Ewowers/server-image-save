const { Router } = require("express");
let User = require("./model/user");
const logicg = require("./api_component/users");
const router = Router();

router.get("/", async (req, res) => {
  let users = await User.find();
  res.json(users);
});
router.get("/type=:id", logicg.gets); //получить пользователя по одному типу
router.post("/user/:id", logicg.getOneUser); // получить пользователя по id
router.delete("/:id", logicg.deleteUser); // удалить юзера
router.put("/:id", logicg.updateUser); //изменить юзера
router.post("/registration", logicg.registration); //регистрация юзера
router.post("/authorization", logicg.authorization); // авторизация
router.post("/onload", logicg.onload); //авто вход
router.post("/out", (req, res) => {
  //выход
  res.clearCookie("toket").status(200).send(true);
});

module.exports = router;
