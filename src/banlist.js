const { Router } = require("express");
const logick = require("./api_component/banList");
const router = Router();
router.post("/add", logick.add);
router.get("/", logick.get);
router.delete("/:id", logick.deletes);
module.exports = router;
