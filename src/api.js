const router = require("express").Router();
const auth = require("./auth"); //роутер авторизаций и регистраций
const product = require("./apiProduct");
router.use("/auth", auth); //мидлвейр регистраций и авторизаций
router.use("/product", product);
// router.get("/", async (req, res) => {
//   // все продукты
//   let product = await Product.find();
//   res.status(200).json(product);
// });
// router.get("/product=:id", async (req, res) => {
//   // получение по категорий
//   let type = req.params.id.split("_").join(" ");
//   let product = await Product.find({ type: type });
//   res.status(200).json(product);
// });
// router.delete("/:id", async (req, res) => {
//   // удаление продукта
//   await Product.findByIdAndDelete(req.params.id).then(() => {
//     res.status(200).send(true);
//   });
// });
// router.post("/add", async (req, res) => {
//   // новый продукт
//   let product = new Product({
//     //создание продукта
//     ...req.body,
//   });
//   await product.save();
//   res.status(200).send(true);
// });

module.exports = router;
