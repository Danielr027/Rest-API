const express = require("express");
const router = express.Router();
const { getStores, createStore } = require("../controllers/store");

router.get("/", getStores);
router.post("/", createStore);


// router.get("/:id", getItem);
// router.post("/", createItem);
// router.put("/:id", updateItem);
// router.delete("/:id", deleteItem);

module.exports = router;
