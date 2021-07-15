const { Router } = require("express");
const router = Router();
const logicg = require("./api_component/product");
router.get("/type=:id", logicg.gets);
router.post("/add", logicg.add);
router.delete("/:id", logicg.delete);
module.exports = router;
