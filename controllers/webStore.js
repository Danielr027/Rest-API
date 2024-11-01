const { matchedData } = require("express-validator");
const { webStoreModel } = require("../models");
const handleHttpError = require("../utils/handleHttpError");


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
        const webPage = await webStoreModel.create({ ...body, storeId: req.user._id });
        res.send(webPage);
    } catch (error) {
        handleHttpError(res, "ERROR_CREATING_WEB_PAGE");
    }
};

// Modificar una página web de comercio
const updateWebStore = async (req, res) => {
    try {
        const body = matchedData(req);
        const webPage = await webStoreModel.findOneAndUpdate(
            { storeId: req.user._id }, body, { new: true }
        );
        res.send(webPage);
    } catch (error) {
        handleHttpError(res, "ERROR_UPDATING_WEB_PAGE");
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
        const webPage = await webStoreModel.findOneAndDelete({ storeId: req.user._id });
        res.send({ message: "Página web eliminada" });
    } catch (error) {
        handleHttpError(res, "ERROR_DELETING_WEB_PAGE");
    }
};

const uploadImage = async (req, res) => {
    try {
        const { file } = req;
        const { pageId } = req.params;

        if (!file) {
            return res.status(400).json({ error: "No se ha proporcionado ninguna imagen." });
        }

        // Verifica que la tienda que realiza la solicitud es la propietaria de la página
        const webPage = await webStoreModel.findOne({ _id: pageId, storeId: req.user._id });
        if (!webPage) {
            return res.status(403).json({ error: "No tienes permiso para subir imágenes a esta página." });
        }

        // Agrega la URL de la imagen al array de imágenes
        const imageUrl = `${process.env.PUBLIC_URL}/${file.filename}`;
        webPage.imagesArray.push(imageUrl);
        await webPage.save();

        res.send({ message: "Imagen subida con éxito", data: webPage });
    } catch (error) {
        console.error("Error en uploadImage:", error);
        handleHttpError(res, "ERROR_UPLOADING_IMAGE");
    }
};



module.exports = { getWebStores, getWebStore, createWebStore, updateWebStore, archiveWebStore, deleteWebStore, uploadImage };
