// routes/store.js

const express = require("express");
const router = express.Router();
const { validatorCreateWebStore, validatorGetWebStore, validatorUpdateWebStore, validatorArchiveWebStore, validatorDeleteWebStore, validatorGetMongoID } = require("../validators/webStore");
const { getWebStores, getWebStore, createWebStore, updateWebStore, archiveWebStore, deleteWebStore, uploadImage } = require("../controllers/webStore");
const uploadMiddleware = require('../utils/handleStorage');

// Definimos las rutas de la API y el tipo de consulta (CRUD)
router.get("/", getWebStores);
router.post("/", validatorCreateWebStore, createWebStore);
router.get("/:pageId", validatorGetWebStore, getWebStore);
router.put("/:pageId", validatorUpdateWebStore, updateWebStore);
router.patch("/:pageId/archive", validatorArchiveWebStore, archiveWebStore);
router.patch("/:pageId", validatorGetMongoID, uploadMiddleware.single("image"), uploadImage);
router.delete("/:pageId", validatorDeleteWebStore, deleteWebStore);

module.exports = router;
