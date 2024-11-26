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
 *     parameters:
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: Ordenar por CIF
 *     responses:
 *       200:
 *         description: Lista de comercios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
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
 *             $ref: '#/components/schemas/StoreCreate'
 *     responses:
 *       200:
 *         description: Comercio creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       400:
 *         description: Error al crear el comercio
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       404:
 *         description: Comercio no encontrado
 */
router.get("/getByCIF/:CIF", authMiddleware, validatorGetStore, getStore);

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
 *             $ref: '#/components/schemas/StoreUpdate'
 *     responses:
 *       200:
 *         description: Comercio actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       400:
 *         description: Error al actualizar el comercio
 *       404:
 *         description: Comercio no encontrado
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
 *       - in: query
 *         name: deleteType
 *         schema:
 *           type: string
 *         description: Tipo de borrado (physical o logical)
 *     responses:
 *       200:
 *         description: Comercio eliminado exitosamente
 *       404:
 *         description: Comercio no encontrado
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
 *       - in: query
 *         name: topic
 *         required: true
 *         schema:
 *           type: string
 *         description: Tema de interés
 *     responses:
 *       200:
 *         description: Lista de emails de usuarios interesados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       400:
 *         description: Tema de interés requerido
 *       404:
 *         description: Comercio o webStore no encontrado
 */
router.get("/interested-users", authMiddleware, checkRole(['merchant']), getInterestedUserEmails);
// router.get("/interested-users", (req, res) => { console.log("TEST"); res.send("TEST") });

module.exports = router;
