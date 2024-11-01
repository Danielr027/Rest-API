const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorRegister = [
    check("nombre").exists().notEmpty().isLength({ min: 3 }),
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength({ min: 8 }),
    (req, res, next) => validateResults(req, res, next)
];

const validatorLogin = [
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength({ min: 8 }),
    (req, res, next) => validateResults(req, res, next)
];

module.exports = { validatorRegister, validatorLogin };
