const express = require("express");
const router = express.Router();
const { getStores, createStore, getStore, updateStore, deleteStore } = require("../controllers/store");

router.get("/", getStores);
router.post("/", createStore);
router.get("/:CIF", getStore);
router.put("/:CIF", updateStore);
router.delete("/:CIF", deleteStore);

module.exports = router;
