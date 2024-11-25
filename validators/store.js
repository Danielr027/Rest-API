const { check, param } = require("express-validator");
const validateResults = require("../utils/handleValidator");

// Validador para crear una tienda
const validatorCreateStore = [
    check("storeName")
        .exists().withMessage("El nombre de la tienda es requerido")
        .notEmpty().withMessage("El nombre de la tienda no puede estar vacío")
        .isString().withMessage("El nombre de la tienda debe ser una cadena de texto"),
    
    check("CIF")
        .exists().withMessage("El CIF es requerido")
        .notEmpty().withMessage("El CIF no puede estar vacío")
        .isString().withMessage("El CIF debe ser una cadena de texto"),
    
    check("address")
        .exists().withMessage("La dirección es requerida")
        .notEmpty().withMessage("La dirección no puede estar vacía")
        .isString().withMessage("La dirección debe ser una cadena de texto"),
    
    check("email")
        .exists().withMessage("El correo electrónico es requerido")
        .notEmpty().withMessage("El correo electrónico no puede estar vacío")
        .isEmail().withMessage("Debe proporcionar un correo electrónico válido"),
    
    check("contactNumber")
        .exists().withMessage("El número de contacto es requerido")
        .notEmpty().withMessage("El número de contacto no puede estar vacío")
        .isString().withMessage("El número de contacto debe ser una cadena de texto"),
    
    (req, res, next) => validateResults(req, res, next)
];

// Validador para obtener una tienda por CIF
const validatorGetStore = [
    param("CIF")
        .exists().withMessage("El parámetro CIF es requerido")
        .notEmpty().withMessage("El parámetro CIF no puede estar vacío")
        .isString().withMessage("El parámetro CIF debe ser una cadena de texto"),
    
    (req, res, next) => validateResults(req, res, next)
];

// Validador para actualizar una tienda
const validatorUpdateStore = [
    param("CIF")
        .exists().withMessage("El parámetro CIF es requerido")
        .notEmpty().withMessage("El parámetro CIF no puede estar vacío")
        .isString().withMessage("El parámetro CIF debe ser una cadena de texto"),
    
    check("storeName")
        .optional()
        .isString().withMessage("El nombre de la tienda debe ser una cadena de texto"),
    
    check("address")
        .optional()
        .isString().withMessage("La dirección debe ser una cadena de texto"),
    
    check("email")
        .optional()
        .isEmail().withMessage("Debe proporcionar un correo electrónico válido"),
    
    check("contactNumber")
        .optional()
        .isString().withMessage("El número de contacto debe ser una cadena de texto"),

    check("merchantId")
    .exists().withMessage("El ID del merchant es requerido")
    .notEmpty().withMessage("El ID del merchant no puede estar vacío")
    .isMongoId().withMessage("El ID del merchant debe ser un MongoID válido"),
    
    (req, res, next) => validateResults(req, res, next)
];

// Validador para eliminar una tienda por CIF
const validatorDeleteStore = [
    param("CIF")
        .exists().withMessage("El parámetro CIF es requerido")
        .notEmpty().withMessage("El parámetro CIF no puede estar vacío")
        .isString().withMessage("El parámetro CIF debe ser una cadena de texto"),
    
    (req, res, next) => validateResults(req, res, next)
];

module.exports = {
    validatorCreateStore,
    validatorGetStore,
    validatorUpdateStore,
    validatorDeleteStore
};
