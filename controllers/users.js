const { matchedData } = require("express-validator");
const userModel = require("../models/nosql/users");
const handleHttpError = require("../utils/handleHttpError");

// const updateUser = async (req, res) => {
//     try {
//         const body = matchedData(req);
//         const user = await userModel.findByIdAndUpdate(req.user._id, body, { new: true });
//         res.send({ user });
//     } catch (error) {
//         handleHttpError(res, "ERROR_UPDATE_USER");
//     }
// };

const updateUser = async (req, res) => {
    try {
        const body = matchedData(req); // Datos validados y limpiados
        console.log("Datos para actualizar:", body); // Log para verificar los datos recibidos

        const user = await userModel.findByIdAndUpdate(req.user._id, body, { new: true });
        console.log("Usuario actualizado:", user); // Log para verificar si se actualiza el usuario
        
        res.send({ user });
    } catch (error) {
        console.log("Error en updateUser:", error); // Log para ver el error exacto
        handleHttpError(res, "ERROR_UPDATE_USER");
    }
};

const deleteUser = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.user._id);
        res.send({ message: "User deleted" });
    } catch (error) {
        handleHttpError(res, "ERROR_DELETE_USER");
    }
};

module.exports = { updateUser, deleteUser };
