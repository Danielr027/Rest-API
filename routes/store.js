// routes/store.js

const express = require("express");
const router = express.Router();
const { validatorCreateStore, validatorGetStore, validatorUpdateStore, validatorDeleteStore } = require("../validators/store");
const { getStores, createStore, getStore, updateStore, deleteStore } = require("../controllers/store");

// Definimos las rutas de la API y el tipo de consulta (CRUD)
router.get("/", getStores);
router.post("/", validatorCreateStore, createStore);
router.get("/:CIF", validatorGetStore, getStore);
router.put("/:CIF", validatorUpdateStore, updateStore);
router.delete("/:CIF", validatorDeleteStore, deleteStore);

module.exports = router;
