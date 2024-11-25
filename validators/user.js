const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");


const validatorRegister = [
    check("nombre")
        .exists().withMessage("El nombre es requerido")
        .notEmpty().withMessage("El nombre no puede estar vacío")
        .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),
    
    check("email")
        .exists().withMessage("El email es requerido")
        .notEmpty().withMessage("El email no puede estar vacío")
        .isEmail().withMessage("Debe ser un email válido"),
    
    check("password")
        .exists().withMessage("La contraseña es requerida")
        .notEmpty().withMessage("La contraseña no puede estar vacía")
        .isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres"),
    
    check("edad")
        .optional()
        .isInt({ min: 0 }).withMessage("La edad debe ser un número entero positivo"),
    
    check("ciudad")
        .optional()
        .isString().withMessage("La ciudad debe ser una cadena de texto"),
    
    check("intereses")
        .optional()
        .isArray().withMessage("Los intereses deben ser un arreglo de cadenas")
        .custom((arr) => arr.every(item => typeof item === 'string')).withMessage("Cada interés debe ser una cadena de texto"),
    
    check("permiteRecibirOfertas")
        .optional()
        .isBoolean().withMessage("permiteRecibirOfertas debe ser un valor booleano"),
    
    (req, res, next) => validateResults(req, res, next)
];

const validatorLogin = [
    check("email")
        .exists().withMessage("El email es requerido")
        .notEmpty().withMessage("El email no puede estar vacío")
        .isEmail().withMessage("Debe ser un email válido"),
    
    check("password")
        .exists().withMessage("La contraseña es requerida")
        .notEmpty().withMessage("La contraseña no puede estar vacía")
        .isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres"),
    
    (req, res, next) => validateResults(req, res, next)
];

const validatorUpdateUser = [
    check("nombre")
        .optional()
        .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),
    
    check("edad")
        .optional()
        .isInt({ min: 0 }).withMessage("La edad debe ser un número entero positivo"),
    
    check("ciudad")
        .optional()
        .isString().withMessage("La ciudad debe ser una cadena de texto"),
    
    check("intereses")
        .optional()
        .isArray().withMessage("Los intereses deben ser un arreglo de cadenas")
        .custom((arr) => arr.every(item => typeof item === 'string')).withMessage("Cada interés debe ser una cadena de texto"),
    
    check("permiteRecibirOfertas")
        .optional()
        .isBoolean().withMessage("permiteRecibirOfertas debe ser un valor booleano"),
    
    (req, res, next) => validateResults(req, res, next)
];

module.exports = { validatorRegister, validatorLogin, validatorUpdateUser };
