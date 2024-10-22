const { matchedData } = require("express-validator");
const { webStoreModel } = require("../models");

// Obtener todas las páginas web de comercios
const getWebStores = async (req, res) => {
    try {
        const data = await webStoreModel.find({})
        res.send(data);

    } catch (error) {
        res.status(500).json({ error: "Error al obtener las páginas web de comercios." });
    }
};

// Visitar una página web por su ID
const getWebStore = async (req, res) => {
    try {
        const { pageId } = req.params;
        const data = await webStoreModel.findOne({ pageId: pageId });
        res.send(data);

    } catch (error) {
        res.status(500).json({ error: "Error al obtener la página web de comercio." });
    }
};

// Crear una nueva página web de comercio
const createWebStore = async (req, res) => {
    try {
        const body = matchedData(req);
        console.log(body);
        const data = await webStoreModel.create(body);
        console.log("CREADO");
        res.send(data);

    } catch (error) {
        res.status(500).json({ error: "Error al crear la página web de comercio." });
    }
};

// Modificar una página web de comercio
const updateWebStore = async (req, res) => {
    try {
        const { pageId } = req.params;
        const { body } = req;
        const data = await webStoreModel.findOneAndUpdate({ pageId: pageId }, body);
        res.send(data);

    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la página web de comercio." });
    }
};

// Archivar una página web de comercio (Borrado lógico)
const archiveWebStore = async (req, res) => {
    try {
        const { pageId } = req.params;
        const data = await WebStore.findOneAndUpdate({ pageId: pageId });
        res.send(data);

    } catch (error) {
        res.status(500).json({ error: "Error al archivar la página web de comercio." });
    }
};

// Eliminar una página web de comercio (Borrado físico)
const deleteWebStore = async (req, res) => {
    try {
        const { pageId } = req.params;
        const data = await WebStore.findOneAndDelete({ pageId: pageId });
        res.send(data);
        
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la página web de comercio." });
    }
};

const uploadImage = async (req, res) => {
    const { file } = req;
    const { pageId } = matchedData(req);
    const fileData = {
        filename: file.filename,
        url: process.env.PUBLIC_URL+"/"+file.filename
    }
    const data = await webStoreModel.findOneAndUpdate({_id: pageId}, {
        $push: { textsArray: fileData.filename, imagesArray: fileData.url }
    });
    res.send(data)
}


module.exports = { getWebStores, getWebStore, createWebStore, updateWebStore, archiveWebStore, deleteWebStore, uploadImage };
