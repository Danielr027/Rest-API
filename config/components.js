// components.js

/**
 * @swagger
 * components:
 *   schemas:
 *     WebStore:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID de la página web
 *         city:
 *           type: string
 *           description: Ciudad donde se encuentra el comercio
 *         activity:
 *           type: string
 *           description: Actividad o sector del comercio
 *         title:
 *           type: string
 *           description: Título de la página web
 *         resume:
 *           type: string
 *           description: Resumen o descripción corta
 *         textsArray:
 *           type: array
 *           items:
 *             type: string
 *           description: Arreglo de textos adicionales
 *         imagesArray:
 *           type: array
 *           items:
 *             type: string
 *           description: Arreglo de URLs de imágenes
 *         reviews:
 *           type: object
 *           properties:
 *             scoring:
 *               type: number
 *               description: Puntuación promedio
 *             totalRatings:
 *               type: integer
 *               description: Número total de puntuaciones
 *             reviews:
 *               type: array
 *               items:
 *                 type: string
 *               description: Arreglo de reseñas
 *         storeId:
 *           type: string
 *           description: ID del comercio asociado
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     WebStoreCreate:
 *       type: object
 *       required:
 *         - city
 *         - activity
 *         - title
 *         - resume
 *       properties:
 *         city:
 *           type: string
 *           description: Ciudad donde se encuentra el comercio
 *         activity:
 *           type: string
 *           description: Actividad o sector del comercio
 *         title:
 *           type: string
 *           description: Título de la página web
 *         resume:
 *           type: string
 *           description: Resumen o descripción corta
 *         textsArray:
 *           type: array
 *           items:
 *             type: string
 *           description: (Opcional) Arreglo de textos adicionales
 *         imagesArray:
 *           type: array
 *           items:
 *             type: string
 *           description: (Opcional) Arreglo de URLs de imágenes
 *     WebStoreUpdate:
 *       type: object
 *       properties:
 *         city:
 *           type: string
 *           description: Ciudad donde se encuentra el comercio
 *         activity:
 *           type: string
 *           description: Actividad o sector del comercio
 *         title:
 *           type: string
 *           description: Título de la página web
 *         resume:
 *           type: string
 *           description: Resumen o descripción corta
 *         textsArray:
 *           type: array
 *           items:
 *             type: string
 *           description: Arreglo de textos adicionales
 *         imagesArray:
 *           type: array
 *           items:
 *             type: string
 *           description: Arreglo de URLs de imágenes
 *     Store:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID del comercio
 *         storeName:
 *           type: string
 *           description: Nombre del comercio
 *         CIF:
 *           type: string
 *           description: CIF del comercio
 *         address:
 *           type: string
 *           description: Dirección del comercio
 *         city:
 *           type: string
 *           description: Ciudad donde se encuentra el comercio
 *         email:
 *           type: string
 *           description: Email de contacto
 *         contactNumber:
 *           type: string
 *           description: Número de contacto
 *         merchantId:
 *           type: string
 *           description: ID del merchant asociado
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     StoreCreate:
 *       type: object
 *       required:
 *         - storeName
 *         - CIF
 *         - address
 *         - city
 *         - email
 *         - contactNumber
 *         - merchantId
 *       properties:
 *         storeName:
 *           type: string
 *           description: Nombre del comercio
 *         CIF:
 *           type: string
 *           description: CIF del comercio
 *         address:
 *           type: string
 *           description: Dirección del comercio
 *         city:
 *           type: string
 *           description: Ciudad donde se encuentra el comercio
 *         email:
 *           type: string
 *           description: Email de contacto
 *         contactNumber:
 *           type: string
 *           description: Número de contacto
 *         merchantId:
 *           type: string
 *           description: ID del merchant asociado
 *     StoreUpdate:
 *       type: object
 *       properties:
 *         storeName:
 *           type: string
 *           description: Nombre del comercio
 *         address:
 *           type: string
 *           description: Dirección del comercio
 *         city:
 *           type: string
 *           description: Ciudad donde se encuentra el comercio
 *         email:
 *           type: string
 *           description: Email de contacto
 *         contactNumber:
 *           type: string
 *           description: Número de contacto
 *     UserRegister:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *         - age
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *         age:
 *           type: integer
 *           description: Edad del usuario
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *     UserUpdate:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Nuevo email del usuario
 *         name:
 *           type: string
 *           description: Nuevo nombre del usuario
 *         age:
 *           type: integer
 *           description: Nueva edad del usuario
 *     UserResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *         age:
 *           type: integer
 *           description: Edad del usuario
 *         role:
 *           type: string
 *           description: Rol del usuario (user, merchant, admin)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     UserLoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: Token de autenticación JWT
 *         user:
 *           $ref: '#/components/schemas/UserResponse'
 */

module.exports = {};
