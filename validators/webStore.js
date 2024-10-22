const { check, param } = require("express-validator");
const validateResults = require("../utils/handleValidator");

// Validador para crear una página web de comercio
const validatorCreateWebStore = [
    check("city")
        .exists().withMessage("La ciudad es requerida")
        .notEmpty().withMessage("La ciudad no puede estar vacía")
        .isString().withMessage("La ciudad debe ser una cadena de texto"),
    
    check("activity")
        .exists().withMessage("La actividad es requerida")
        .notEmpty().withMessage("La actividad no puede estar vacía")
        .isString().withMessage("La actividad debe ser una cadena de texto"),
    
    check("title")
        .exists().withMessage("El título es requerido")
        .notEmpty().withMessage("El título no puede estar vacío")
        .isString().withMessage("El título debe ser una cadena de texto"),
    
    check("resume")
        .exists().withMessage("El resumen es requerido")
        .notEmpty().withMessage("El resumen no puede estar vacío")
        .isString().withMessage("El resumen debe ser una cadena de texto"),
    
    check("textsArray")
        .optional()
        .isArray().withMessage("textsArray debe ser un array de cadenas")
        .custom((arr) => arr.every(item => typeof item === 'string')).withMessage("Cada elemento de textsArray debe ser una cadena de texto"),
    
    check("imagesArray")
        .optional()
        .isArray().withMessage("imagesArray debe ser un array de cadenas")
        .custom((arr) => arr.every(item => typeof item === 'string')).withMessage("Cada elemento de imagesArray debe ser una cadena de texto"),
    
    check("reviews.scoring")
        .optional()
        .isFloat({ min: 0, max: 5 }).withMessage("El scoring debe ser un número entre 0 y 5"),
    
    check("reviews.totalRatings")
        .optional()
        .isInt({ min: 0 }).withMessage("totalRatings debe ser un número entero mayor o igual a 0"),
    
    check("reviews.reviews")
        .optional()
        .isArray().withMessage("reviews.reviews debe ser un array de cadenas")
        .custom((arr) => arr.every(item => typeof item === 'string')).withMessage("Cada reseña debe ser una cadena de texto"),
    
    check("pageId")
        .exists().withMessage("El pageId es requerido")
        .notEmpty().withMessage("El pageId no puede estar vacío")
        .isInt().withMessage("El pageId debe ser un número entero"),
    
    // Middleware para manejar los resultados de la validación
    (req, res, next) => validateResults(req, res, next)
];

// Validador para visitar una página web por su ID
const validatorGetWebStore = [
    param("pageId")
        .exists().withMessage("El parámetro pageId es requerido")
        .notEmpty().withMessage("El parámetro pageId no puede estar vacío")
        .isInt().withMessage("El parámetro pageId debe ser un número entero"),
    
    (req, res, next) => validateResults(req, res, next)
];

// Validador para modificar una página web de comercio
const validatorUpdateWebStore = [
    param("pageId")
        .exists().withMessage("El parámetro pageId es requerido")
        .notEmpty().withMessage("El parámetro pageId no puede estar vacío")
        .isInt().withMessage("El parámetro pageId debe ser un número entero"),

    check("city")
        .optional()
        .isString().withMessage("La ciudad debe ser una cadena de texto"),
    
    check("activity")
        .optional()
        .isString().withMessage("La actividad debe ser una cadena de texto"),
    
    check("title")
        .optional()
        .isString().withMessage("El título debe ser una cadena de texto"),
    
    check("resume")
        .optional()
        .isString().withMessage("El resumen debe ser una cadena de texto"),
    
    check("textsArray")
        .optional()
        .isArray().withMessage("textsArray debe ser un array de cadenas")
        .custom((arr) => arr.every(item => typeof item === 'string')).withMessage("Cada elemento de textsArray debe ser una cadena de texto"),
    
    check("imagesArray")
        .optional()
        .isArray().withMessage("imagesArray debe ser un array de cadenas")
        .custom((arr) => arr.every(item => typeof item === 'string')).withMessage("Cada elemento de imagesArray debe ser una cadena de texto"),
    
    check("reviews.scoring")
        .optional()
        .isFloat({ min: 0, max: 5 }).withMessage("El scoring debe ser un número entre 0 y 5"),
    
    check("reviews.totalRatings")
        .optional()
        .isInt({ min: 0 }).withMessage("totalRatings debe ser un número entero mayor o igual a 0"),
    
    check("reviews.reviews")
        .optional()
        .isArray().withMessage("reviews.reviews debe ser un array de cadenas")
        .custom((arr) => arr.every(item => typeof item === 'string')).withMessage("Cada reseña debe ser una cadena de texto"),
    
    (req, res, next) => validateResults(req, res, next)
];

// Validador para archivar una página web de comercio
const validatorArchiveWebStore = [
    param("pageId")
        .exists().withMessage("El parámetro pageId es requerido")
        .notEmpty().withMessage("El parámetro pageId no puede estar vacío")
        .isInt().withMessage("El parámetro pageId debe ser un número entero"),
    
    (req, res, next) => validateResults(req, res, next)
];

// Validador para eliminar una página web de comercio
const validatorDeleteWebStore = [
    param("pageId")
        .exists().withMessage("El parámetro pageId es requerido")
        .notEmpty().withMessage("El parámetro pageId no puede estar vacío")
        .isInt().withMessage("El parámetro pageId debe ser un número entero"),
    
    (req, res, next) => validateResults(req, res, next)
];

const validatorGetMongoID = [
    param("pageId")
        .exists().withMessage("El parámetro pageId es requerido")
        .notEmpty().withMessage("El parámetro pageId no puede estar vacío")
        .isMongoId().withMessage("El parámetro pageId debe ser un número entero"),
    
    (req, res, next) => validateResults(req, res, next)
];

module.exports = { validatorCreateWebStore, validatorGetWebStore, validatorUpdateWebStore, validatorArchiveWebStore, validatorDeleteWebStore, validatorGetMongoID };
