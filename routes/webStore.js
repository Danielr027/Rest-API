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
const { validatorCreateWebStore, validatorGetWebStore, validatorUpdateWebStore, validatorDeleteWebStore, validatorAddReview, validatorAddText } = require("../validators/webStore");
const { getWebStores, getWebStore, createWebStore, updateWebStore, deleteWebStore, uploadImage, addReview, addText } = require("../controllers/webStore");

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
router.get("/", getWebStores);

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
router.post("/", authMiddleware, checkRole(["merchant"]), validatorCreateWebStore, createWebStore);

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
router.get("/:storeId", validatorGetWebStore, getWebStore);

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
router.put("/:storeId", authMiddleware, checkRole(["merchant"]), validatorUpdateWebStore, updateWebStore);

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
router.delete("/:storeId", authMiddleware, checkRole(["merchant"]), validatorDeleteWebStore, deleteWebStore);

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
router.patch("/:storeId/uploadImage", authMiddleware, checkRole(['merchant']), validatorGetWebStore, uploadMiddleware.single("image"), uploadImage);

router.patch("/:storeId/review", authMiddleware, checkRole(['user', 'merchant', 'admin']), validatorAddReview, addReview);

router.post("/:storeId/addText", authMiddleware, checkRole(['merchant']), validatorAddText, addText);

module.exports = router;
