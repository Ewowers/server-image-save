const router = require("express").Router();
const Product = require("./model"); // модель продукта
const auth = require("./auth"); //роутер авторизаций и регистраций
router.get("/", async (req, res) => {
  // все продукты
  let product = await Product.find();
  res.status(200).json(product);
});
router.get("/type=:id", async (req, res) => {
  // получение по категорий
  let product = await Product.find({ type: req.params.id });
  res.status(200).json(product);
});
router.delete("/:id", async (req, res) => {
  // удаление продукта
  await Product.findByIdAndDelete(req.params.id).then(() => {
    res.status(200).send(true);
  });
});
router.post("/add", async (req, res) => {
  // новый продукт
  let product = new Product({
    //создание продукта
    ...req.body,
  });
  await product.save();
  res.status(200).send(true);
});

router.use("/auth", auth); //мидлвейр регистраций и авторизаций
module.exports = router;
