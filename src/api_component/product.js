const Product = require("../model/product");
class ApiProduct {
  async gets(req, res) {
    let product;
    if (req.params.id !== "all") product = await Product.find({ type: req.params.id.split("_").join(" ") });
    else product = await Product.find();
    return res.json(product);
  }
  async delete(req, res) {
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200);
  }
  async add(req, res) {
    let { title, prise, type, upload } = req.body;
    let candidate = await Product.findOne({ title: title });
    if (!candidate) return res.json({ message: "Данный логин занят" });
    let product = new Product({
      title: title,
      prise: prise,
      type: type,
      upload: upload,
    });
    await product.save();
    return res.status(200).json(product);
  }
}
module.exports = new ApiProduct();
