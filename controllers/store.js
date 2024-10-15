const { default: mongoose } = require('mongoose');
const { storeModel } = require('../models');

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
const createStore = async (req, res) => {
    const { body } = req;
    const data = await storeModel.create(body); // Subimos el modelo definido en formato json
    res.send(data);
}

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

// Exportamos las funciones de consulta como paquetes de módulo
module.exports = { getStores, getStore, createStore, updateStore, deleteStore };
