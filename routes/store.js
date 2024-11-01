/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: Gestión de los comercios
 */

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/session");
const checkRole = require("../middlewares/role");
const { validatorCreateStore, validatorGetStore, validatorUpdateStore, validatorDeleteStore } = require("../validators/store");
const { getStores, createStore, getStore, updateStore, deleteStore, getInterestedUserEmails } = require("../controllers/store");

/**
 * @swagger
 * /store:
 *   get:
 *     summary: Obtener todos los comercios
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de comercios
 */
router.get("/", authMiddleware, getStores);

/**
 * @swagger
 * /store:
 *   post:
 *     summary: Crear un nuevo comercio (solo admin)
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Store'
 *     responses:
 *       200:
 *         description: Comercio creado exitosamente
 */
router.post("/", authMiddleware, checkRole(["admin"]), validatorCreateStore, createStore);

/**
 * @swagger
 * /store/{CIF}:
 *   get:
 *     summary: Obtener un comercio por su CIF
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: CIF
 *         required: true
 *         schema:
 *           type: string
 *         description: CIF del comercio
 *     responses:
 *       200:
 *         description: Comercio encontrado
 */
router.get("/:CIF", authMiddleware, validatorGetStore, getStore);

/**
 * @swagger
 * /store/{CIF}:
 *   put:
 *     summary: Modificar un comercio por su CIF (solo admin)
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: CIF
 *         required: true
 *         schema:
 *           type: string
 *         description: CIF del comercio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Store'
 *     responses:
 *       200:
 *         description: Comercio actualizado exitosamente
 */
router.put("/:CIF", authMiddleware, checkRole(["admin"]), validatorUpdateStore, updateStore);

/**
 * @swagger
 * /store/{CIF}:
 *   delete:
 *     summary: Eliminar un comercio por su CIF (solo admin)
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: CIF
 *         required: true
 *         schema:
 *           type: string
 *         description: CIF del comercio
 *     responses:
 *       200:
 *         description: Comercio eliminado exitosamente
 */
router.delete("/:CIF", authMiddleware, checkRole(["admin"]), validatorDeleteStore, deleteStore);

/**
 * @swagger
 * /store/{storeId}/interested-users:
 *   get:
 *     summary: Obtener emails de usuarios interesados en el comercio
 *     tags: [Stores]
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
 *         description: Lista de emails de usuarios interesados
 */
router.get("/:storeId/interested-users", authMiddleware, checkRole(['admin']), getInterestedUserEmails);

module.exports = router;
