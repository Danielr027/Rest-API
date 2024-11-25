/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios y autenticación
 */

const express = require("express");
const router = express.Router();
const checkRole = require('../middlewares/role');
const { registerCtrl, loginCtrl, registerMerchantCtrl } = require("../controllers/auth");
const { updateUser, deleteUser } = require("../controllers/users");
const { validatorRegister, validatorLogin, validatorUpdateUser } = require("../validators/user");
const authMiddleware = require("../middlewares/session");

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Error en el registro
 */
router.post("/register", validatorRegister, registerCtrl);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserLoginResponse'
 *       400:
 *         description: Credenciales inválidas
 */
router.post("/login", validatorLogin, loginCtrl);

/**
 * @swagger
 * /user:
 *   put:
 *     summary: Modificar información del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Error en la actualización
 */
router.put("/", authMiddleware, validatorUpdateUser, updateUser);

/**
 * @swagger
 * /user:
 *   delete:
 *     summary: Eliminar el usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 */
router.delete("/", authMiddleware, deleteUser);


/**
 * @swagger
 * /user/register-merchant:
 *   post:
 *     summary: Registrar un nuevo merchant (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       200:
 *         description: Merchant registrado exitosamente
 *       403:
 *         description: No autorizado
 *       400:
 *         description: Error en el registro
 */
router.post("/register-merchant", authMiddleware, checkRole(["admin"]), validatorRegister, registerMerchantCtrl);


module.exports = router;
