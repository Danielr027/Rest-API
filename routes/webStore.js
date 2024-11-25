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
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filtrar por ciudad
 *       - in: query
 *         name: activity
 *         schema:
 *           type: string
 *         description: Filtrar por actividad
 *     responses:
 *       200:
 *         description: Lista de páginas web de los comercios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WebStore'
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
 *             $ref: '#/components/schemas/WebStoreCreate'
 *     responses:
 *       200:
 *         description: Página web de comercio creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WebStore'
 *       400:
 *         description: Error al crear la página web
 *       404:
 *         description: Comercio no encontrado para el merchant autenticado
 */
router.post("/", authMiddleware, checkRole(["merchant"]), validatorCreateWebStore, createWebStore);

/**
 * @swagger
 * /webStore/{storeId}:
 *   get:
 *     summary: Visitar una página web por su ID
 *     tags: [WebStores]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la página web
 *     responses:
 *       200:
 *         description: Página web de comercio encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WebStore'
 *       500:
 *         description: Error al obtener la página web
 */
router.get("/:storeId", validatorGetWebStore, getWebStore);

/**
 * @swagger
 * /webStore/{storeId}:
 *   put:
 *     summary: Modificar una página web de comercio
 *     tags: [WebStores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la página web
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WebStoreUpdate'
 *     responses:
 *       200:
 *         description: Página web de comercio actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WebStore'
 *       404:
 *         description: Página web no encontrada o no autorizada
 */
router.put("/:storeId", authMiddleware, checkRole(["merchant"]), validatorUpdateWebStore, updateWebStore);

/**
 * @swagger
 * /webStore/{storeId}:
 *   delete:
 *     summary: Eliminar una página web de comercio
 *     tags: [WebStores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la página web
 *     responses:
 *       200:
 *         description: Página web de comercio eliminada
 *       404:
 *         description: Página web no encontrada
 */
router.delete("/:storeId", authMiddleware, checkRole(["merchant"]), validatorDeleteWebStore, deleteWebStore);


/**
 * @swagger
 * /webStore/{storeId}/uploadImage:
 *   patch:
 *     summary: Subir una imagen a la página web del comercio
 *     tags: [WebStores]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la página web
 *       - in: formData
 *         name: image
 *         type: file
 *         description: La imagen a subir
 *     responses:
 *       200:
 *         description: Imagen subida exitosamente
 *       400:
 *         description: No se ha proporcionado ninguna imagen
 *       403:
 *         description: No tienes permiso para subir imágenes a esta página
 */
router.patch("/:storeId/uploadImage", authMiddleware, checkRole(['merchant']), validatorGetWebStore, uploadMiddleware.single("image"), uploadImage);


/**
 * @swagger
 * /webStore/{storeId}/review:
 *   post:
 *     summary: Añadir una reseña a la página web del comercio
 *     tags: [WebStores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la página web
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scoring:
 *                 type: number
 *                 description: Puntuación entre 0 y 5
 *               review:
 *                 type: string
 *                 description: Texto de la reseña
 *     responses:
 *       200:
 *         description: Reseña agregada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Página web no encontrada
 */
router.patch("/:storeId/review", authMiddleware, checkRole(['user', 'merchant', 'admin']), validatorAddReview, addReview);

/**
 * @swagger
 * /webStore/{storeId}/addText:
 *   post:
 *     summary: Añadir texto a la página web del comercio
 *     tags: [WebStores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la página web
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: El texto a añadir
 *     responses:
 *       200:
 *         description: Texto añadido exitosamente
 *       403:
 *         description: No tienes permiso para añadir texto a esta página
 *       404:
 *         description: Página web no encontrada
 */
router.post("/:storeId/addText", authMiddleware, checkRole(['merchant']), validatorAddText, addText);

module.exports = router;
