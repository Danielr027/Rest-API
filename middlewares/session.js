const { verifyToken } = require("../utils/handleJwt");
const userModel = require("../models/nosql/users");
const handleHttpError = require("../utils/handleHttpError");

const authMiddleware = async (req, res, next) => {
    try {
        // Verificar si hay un token en el encabezado de autorización
        const token = req.headers.authorization?.split(' ').pop();
        if (!token) return handleHttpError(res, "NO_TOKEN_PROVIDED", 401);

        // Verificar el token y obtener los datos decodificados
        const dataToken = await verifyToken(token);
        //console.log("Data del token:", dataToken); // Depuración

        if (!dataToken || !dataToken._id) return handleHttpError(res, "INVALID_TOKEN", 401);

        // Buscar el usuario en la base de datos
        const user = await userModel.findById(dataToken._id);
        //console.log("Usuario encontrado:", user); // Depuración
        if (!user) return handleHttpError(res, "USER_NOT_FOUND", 404);

        req.user = user; // Asignamos el usuario completo a req.user

        next();
    } catch (error) {
        console.log("Error en authMiddleware:", error); // Depuración de errores
        handleHttpError(res, "NOT_AUTHORIZED", 403);
    }
};


module.exports = authMiddleware;
