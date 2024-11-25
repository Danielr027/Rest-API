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
    
    // Middleware para manejar los resultados de la validación
    (req, res, next) => validateResults(req, res, next)
];

// Validador para visitar una página web por su storeId
const validatorGetWebStore = [
    param("storeId")
        .exists().withMessage("El parámetro storeId es requerido")
        .notEmpty().withMessage("El parámetro storeId no puede estar vacío")
        .isMongoId().withMessage("El parámetro storeId debe ser un MongoID válido"),
    
    (req, res, next) => validateResults(req, res, next)
];

// Validador para modificar una página web de comercio
const validatorUpdateWebStore = [
    param("storeId")
        .exists().withMessage("El parámetro storeId es requerido")
        .notEmpty().withMessage("El parámetro storeId no puede estar vacío")
        .isMongoId().withMessage("El parámetro storeId debe ser un MongoID válido"),

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
    param("storeId")
        .exists().withMessage("El parámetro storeId es requerido")
        .notEmpty().withMessage("El parámetro storeId no puede estar vacío")
        .isMongoId().withMessage("El parámetro storeId debe ser un MongoID válido"),
    
    (req, res, next) => validateResults(req, res, next)
];

// Validador para eliminar una página web de comercio
const validatorDeleteWebStore = [
    param("storeId")
        .exists().withMessage("El parámetro storeId es requerido")
        .notEmpty().withMessage("El parámetro storeId no puede estar vacío")
        .isMongoId().withMessage("El parámetro storeId debe ser un MongoID válido"),
    
    (req, res, next) => validateResults(req, res, next)
];

// Validador para añadir una review a la web
const validatorAddReview = [
    param("storeId")
        .exists().withMessage("El parámetro storeId es requerido")
        .notEmpty().withMessage("El parámetro storeId no puede estar vacío")
        .isMongoId().withMessage("El parámetro storeId debe ser un MongoID válido"),

    check("scoring")
        .exists().withMessage("La puntuación es requerida")
        .notEmpty().withMessage("La puntuación no puede estar vacía")
        .isFloat({ min: 0, max: 5 }).withMessage("La puntuación debe ser un número entre 0 y 5"),

    check("review")
        .exists().withMessage("La reseña es requerida")
        .notEmpty().withMessage("La reseña no puede estar vacía")
        .isString().withMessage("La reseña debe ser una cadena de texto"),

    (req, res, next) => validateResults(req, res, next)
];

// Validador para añadir texto a la web
const validatorAddText = [
    param("storeId")
        .exists().withMessage("El parámetro storeId es requerido")
        .notEmpty().withMessage("El parámetro storeId no puede estar vacío")
        .isMongoId().withMessage("El parámetro storeId debe ser un MongoID válido"),
    
    check("text")
        .exists().withMessage("El texto es requerido")
        .notEmpty().withMessage("El texto no puede estar vacío")
        .isString().withMessage("El texto debe ser una cadena de texto"),
    
    (req, res, next) => validateResults(req, res, next)
];

module.exports = { validatorCreateWebStore, validatorGetWebStore, validatorUpdateWebStore, validatorArchiveWebStore, validatorDeleteWebStore, validatorAddReview, validatorAddText };
