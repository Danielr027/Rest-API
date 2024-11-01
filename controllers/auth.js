const { matchedData } = require("express-validator");
const userModel = require("../models/nosql/users");
const { encrypt, compare } = require("../utils/handlePassword");
const { tokenSign } = require("../utils/handleJwt");
const handleHttpError = require("../utils/handleHttpError");

// const registerCtrl = async (req, res) => {
//     try {
//         const body = matchedData(req);
//         const password = await encrypt(body.password);
//         const user = await userModel.create({ ...body, password });
//         user.set('password', undefined, { strict: false });
//         res.send({ token: await tokenSign(user), user });
//     } catch (error) {
//         console.log("Error en registerCtrl:", error);
//         handleHttpError(res, "ERROR_REGISTER_USER");
//     }
// };

const registerCtrl = async (req, res) => {
    try {
        const body = matchedData(req);

        console.log("Contraseña antes de guardar:", body.password); // Log para ver la contraseña original
        
        const user = await userModel.create(body);  // Hasheado en el middleware
        user.set('password', undefined, { strict: false });
        res.send({ token: await tokenSign(user), user });
    } catch (error) {
        if (error.code === 11000) {
            return handleHttpError(res, "EMAIL_ALREADY_REGISTERED", 409);
        }
        console.log("Error en registerCtrl:", error);
        handleHttpError(res, "ERROR_REGISTER_USER");
    }
};


// const loginCtrl = async (req, res) => {
//     try {
//         const body = matchedData(req);
//         const user = await userModel.findOne({ email: body.email }).select("password email role");
//         if (!user) return handleHttpError(res, "USER_NOT_FOUND", 404);
        
//         const isValidPassword = await compare(body.password, user.password);
//         if (!isValidPassword) return handleHttpError(res, "INVALID_PASSWORD", 401);
        
//         user.set("password", undefined, { strict: false });
//         res.send({ token: await tokenSign(user), user });
//     } catch (error) {
//         handleHttpError(res, "ERROR_LOGIN_USER");
//     }
// };

const loginCtrl = async (req, res) => {
    try {
        const body = matchedData(req);
        const user = await userModel.findOne({ email: body.email }).select("password email role");
        if (!user) return handleHttpError(res, "USER_NOT_FOUND", 404);

        console.log("Contraseña ingresada:", body.password);
        console.log("Contraseña hasheada en la BD:", user.password);

        const isValidPassword = await compare(body.password, user.password);
        console.log("¿Las contraseñas coinciden?", isValidPassword);  // Log para diagnosticar

        if (!isValidPassword) return handleHttpError(res, "INVALID_PASSWORD", 401);

        user.set("password", undefined, { strict: false });
        res.send({ token: await tokenSign(user), user });
    } catch (error) {
        console.log("Error en loginCtrl:", error);
        handleHttpError(res, "ERROR_LOGIN_USER");
    }
};



module.exports = { registerCtrl, loginCtrl };
