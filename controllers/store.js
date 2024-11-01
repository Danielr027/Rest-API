const { tokenSign } = require("../utils/handleJwt");
const { storeModel } = require('../models');
const { userModel } = require("../models");
const handleHttpError = require("../utils/handleHttpError");

// Obtener comercios
const getStores = async (req, res) => {
    const { CIF } = req.params; // Obtenemos los parámetros
    const query = req.query;
    if (query.order === "true") {  // Manejamos las queries
        const data = await storeModel.find({}).sort({"CIF": "asc"});
        res.send(data);
    } else {
        const data = await storeModel.find({});
        res.send(data);
    }
}

// Obtener comercio por CIF
const getStore = async (req, res) => {
    const { CIF } = req.params; // Obtenemos parámetros
    const data = await storeModel.find({CIF: CIF});
    res.send(data);
}

// Subir comercios
// const createStore = async (req, res) => {
//     try {
//         const { body } = req;
//         const store = await storeModel.create(body); // Crear el comercio

//         // Generar un JWT específico para el comercio
//         const token = tokenSign({ _id: store._id, CIF: store.CIF });
//         res.send({ store, token }); // Enviar el comercio y el token
//     } catch (error) {
//         handleHttpError(res, "ERROR_CREATING_STORE");
//     }
// };
const createStore = async (req, res) => {
    try {
        const { body } = req;
        console.log("Datos recibidos para crear comercio:", body); // Datos enviados

        const store = await storeModel.create(body); // Crear el comercio

        // Generar un JWT específico para el comercio
        const token = tokenSign({ _id: store._id, CIF: store.CIF });
        res.send({ store, token }); // Enviar el comercio y el token
    } catch (error) {
        console.error("Error en createStore:", error.message); // Muestra el mensaje de error específico
        console.error("Detalle del error:", error.errors); // Muestra los detalles de error de validación
        handleHttpError(res, "ERROR_CREATING_STORE");
    }
};


// Modificar un comercio a partir de su CIF
const updateStore = async (req, res) => {
    const { CIF } = req.params; // Obtenemos los parámetros
    const { body } = req;
    const data = await storeModel.findOneAndUpdate({CIF: CIF}, body);
    res.send(data);
};

// Borrar un comercio a partir de su CIF [Borrado Físico]
const deleteStore = async (req, res) => {
    const { CIF } = req.params;
    const query = req.query;
    if (query.deleteType === "physical") {  // Manejamos las queries
        const data = await storeModel.findOneAndDelete({CIF: CIF}); // Borrado físico
        res.send(data);
    } else if (query.deleteType === "logical") {
        const data = await storeModel.deleteOne({CIF: CIF}); // Borrado lógico
        res.send(data);
    }
};

const getInterestedUserEmails = async (req, res) => {
    try {
        const { storeId } = req.params;

        // Verificar que el storeId es válido y realizar la búsqueda
        const interestedUsers = await userModel.find({
            permiteRecibirOfertas: true,
            intereses: storeId
        }).select('email');
        
        res.send(interestedUsers);

    } catch (error) {
        console.error("Error en getInterestedUsers:", error);
        handleHttpError(res, "ERROR_GETTING_INTERESTED_USERS");
    }
};

// Exportamos las funciones de consulta como paquetes de módulo
module.exports = { getStores, getStore, createStore, updateStore, deleteStore, getInterestedUserEmails };
