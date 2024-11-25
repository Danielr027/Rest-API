const { tokenSign } = require("../utils/handleJwt");
const { storeModel } = require('../models');
const { userModel } = require("../models");
const { webStoreModel } = require("../models");
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
// const createStore = async (req, res) => {
//     try {
//         const { body } = req;
//         console.log("Datos recibidos para crear comercio:", body); // Datos enviados

//         const store = await storeModel.create(body); // Crear el comercio

//         // Generar un JWT específico para el comercio
//         const token = tokenSign({ _id: store._id, CIF: store.CIF });
//         res.send({ store, token }); // Enviar el comercio y el token
//     } catch (error) {
//         console.error("Error en createStore:", error.message); // Muestra el mensaje de error específico
//         console.error("Detalle del error:", error.errors); // Muestra los detalles de error de validación
//         handleHttpError(res, "ERROR_CREATING_STORE");
//     }
// };

const createStore = async (req, res) => {
    try {
        const { body } = req;

        const merchantId = body.merchantId; // El admin debe proporcionar el merchantId
        const merchantUser = await userModel.findById(merchantId);
        if (!merchantUser || merchantUser.role !== 'merchant') {
            return handleHttpError(res, "MERCHANT_ID_INVALIDO", 400);
        }

        // Verificar que el merchant no tenga ya un store
        const existingStore = await storeModel.findOne({ merchantId });
        if (existingStore) {
            return handleHttpError(res, "EL_MERCHANT_YA_TIENE_UN_STORE", 400);
        }

        const store = await storeModel.create({ ...body, merchantId });
        res.send({ store });
    } catch (error) {
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
        const merchantId = req.user._id; // Obtener el ID del merchant autenticado
        const { topic } = req.query; // Obtener el tema de interés de los query parameters

        if (!topic) {
            return handleHttpError(res, "TOPIC_REQUIRED", 400);
        }

        // Obtener el store asociado al merchant
        const store = await storeModel.findOne({ merchantId });
        if (!store) {
            return handleHttpError(res, "STORE_NOT_FOUND", 404);
        }

        // Obtener el webStore asociado al store
        const webStore = await webStoreModel.findOne({ storeId: store._id });
        if (!webStore) {
            return handleHttpError(res, "WEBSTORE_NOT_FOUND", 404);
        }

        const storeCity = webStore.city;

        if (!storeCity) {
            return handleHttpError(res, "STORE_CITY_NOT_FOUND", 400);
        }

        // Agregar logs para depuración
        console.log('Ciudad del comercio:', storeCity);
        console.log('Tema de interés:', topic);

        // Buscar usuarios en la misma ciudad, interesados en el tema y que permiten recibir ofertas
        const interestedUsers = await userModel.find({
            ciudad: storeCity,
            intereses: topic,
            permiteRecibirOfertas: true
        }).select('email');

        console.log('Usuarios interesados encontrados:', interestedUsers);

        res.send(interestedUsers);

    } catch (error) {
        console.error("Error en getInterestedUserEmails:", error);
        handleHttpError(res, "ERROR_GETTING_INTERESTED_USERS");
    }
};

// Exportamos las funciones de consulta como paquetes de módulo
module.exports = { getStores, getStore, createStore, updateStore, deleteStore, getInterestedUserEmails };
