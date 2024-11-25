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

        const user = await userModel.findByIdAndUpdate(req.user._id, body, { new: true });
        
        res.send({ user });
    } catch (error) {
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
