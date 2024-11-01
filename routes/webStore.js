/**
 * @swagger
 * tags:
 *   name: WebStores
 *   description: Gestión de las páginas web de los comercios
 */

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/session");
const checkRole = require("../middlewares/role");
const uploadMiddleware = require("../utils/handleStorage");
const { validatorCreateWebStore, validatorGetWebStore, validatorUpdateWebStore, validatorDeleteWebStore } = require("../validators/webStore");
const { getWebStores, getWebStore, createWebStore, updateWebStore, deleteWebStore, uploadImage } = require("../controllers/webStore");

/**
 * @swagger
 * /webStore:
 *   get:
 *     summary: Obtener todas las páginas web de los comercios
 *     tags: [WebStores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de páginas web de los comercios
 */
router.get("/", authMiddleware, getWebStores);

/**
 * @swagger
 * /webStore:
 *   post:
 *     summary: Crear una nueva página web de comercio
 *     tags: [WebStores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WebStore'
 *     responses:
 *       200:
 *         description: Página web de comercio creada exitosamente
 */
router.post("/", authMiddleware, validatorCreateWebStore, createWebStore);

/**
 * @swagger
 * /webStore/{storeId}:
 *   get:
 *     summary: Obtener una página web por su storeId
 *     tags: [WebStores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comercio
 *     responses:
 *       200:
 *         description: Página web de comercio encontrada
 */
router.get("/:storeId", authMiddleware, validatorGetWebStore, getWebStore);

/**
 * @swagger
 * /webStore/{storeId}:
 *   put:
 *     summary: Modificar una página web por su storeId
 *     tags: [WebStores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comercio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WebStore'
 *     responses:
 *       200:
 *         description: Página web de comercio actualizada
 */
router.put("/:storeId", authMiddleware, validatorUpdateWebStore, updateWebStore);

/**
 * @swagger
 * /webStore/{storeId}:
 *   delete:
 *     summary: Eliminar una página web por su storeId
 *     tags: [WebStores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comercio
 *     responses:
 *       200:
 *         description: Página web de comercio eliminada
 */
router.delete("/:storeId", authMiddleware, validatorDeleteWebStore, deleteWebStore);

/**
 * @swagger
 * /webStore/{storeId}/uploadImage:
 *   patch:
 *     summary: Subir imagen a la página web del comercio
 *     tags: [WebStores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comercio
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagen subida exitosamente
 */
router.patch("/:storeId/uploadImage", authMiddleware, checkRole(['admin']), validatorGetWebStore, uploadMiddleware.single("image"), uploadImage);

module.exports = router;
