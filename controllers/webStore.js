const { matchedData } = require("express-validator");
const { webStoreModel, storeModel } = require("../models");
const handleHttpError = require("../utils/handleHttpError");


// Obtener todas las páginas web de comercios
const getWebStores = async (req, res) => {
    try {
        const { city, activity } = req.query;

        const filter = {};

        if (city) {
            filter.city = city;
        }

        if (activity) {
            filter.activity = activity;
        }

        const data = await webStoreModel.find(filter);
        res.send(data);
    } catch (error) {
        console.error("Error en getWebStores:", error);
        res.status(500).json({ error: "Error al obtener las páginas web de comercios." });
    }
};

// Visitar una página web por su ID
const getWebStore = async (req, res) => {
    try {
        const { storeId } = req.params;
        const data = await webStoreModel.findOne({ _id: storeId });
        res.send(data);

    } catch (error) {
        res.status(500).json({ error: "Error al obtener la página web de comercio." });
    }
};

// Crear una nueva página web de comercio
const createWebStore = async (req, res) => {
    try {
        const body = matchedData(req);

        // Obtener el store asociado al merchant autenticado
        const store = await storeModel.findOne({ merchantId: req.user._id });
        if (!store) {
            return handleHttpError(res, "STORE_NOT_FOUND_FOR_MERCHANT", 404);
        }

        // Verificar que el merchant no tenga ya una webStore
        const existingWebStore = await webStoreModel.findOne({ storeId: store._id });
        if (existingWebStore) {
            return handleHttpError(res, "WEBSTORE_ALREADY_EXISTS_FOR_STORE", 400);
        }

        // Crear la webStore con el storeId correcto
        const webPage = await webStoreModel.create({ ...body, storeId: store._id });
        res.send(webPage);
    } catch (error) {
        console.error("Error en createWebStore:", error);
        handleHttpError(res, "ERROR_CREATING_WEB_PAGE");
    }
};

// Modificar una página web de comercio
const updateWebStore = async (req, res) => {
    try {
        const { storeId } = req.params;
        const body = matchedData(req);

        const webPage = await webStoreModel.findOneAndUpdate(
            { _id: storeId, storeId: req.user._id },
            body,
            { new: true }
        );

        if (!webPage) {
            return handleHttpError(res, "WEBSTORE_NOT_FOUND_OR_UNAUTHORIZED", 404);
        }

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
        const { storeId } = req.params;

        // Verificar que el store existe y está asociado al merchant autenticado
        const store = await storeModel.findOne({ _id: storeId, merchantId: req.user._id });
        if (!store) {
            return handleHttpError(res, "STORE_NOT_FOUND_OR_UNAUTHORIZED", 403);
        }

        // Eliminar la webStore asociada al store
        const webPage = await webStoreModel.findOneAndDelete({ storeId: store._id });
        if (!webPage) {
            return handleHttpError(res, "WEBSTORE_NOT_FOUND", 404);
        }

        res.send({ message: "Página web eliminada" });
    } catch (error) {
        handleHttpError(res, "ERROR_DELETING_WEB_PAGE");
    }
};

const uploadImage = async (req, res) => {
    try {
        const { file } = req;
        const { storeId } = req.params;

        if (!file) {
            return res.status(400).json({ error: "No se ha proporcionado ninguna imagen." });
        }

        // Obtener el store asociado al merchant autenticado
        const store = await storeModel.findOne({ merchantId: req.user._id });
        if (!store) {
            return res.status(403).json({ error: "No tienes permiso para subir imágenes a esta página." });
        }

        // Verificar que la webStore pertenece al store del merchant
        const webPage = await webStoreModel.findOne({ _id: storeId, storeId: store._id });
        if (!webPage) {
            return res.status(403).json({ error: "No tienes permiso para subir imágenes a esta página." });
        }

        // Agregar la URL de la imagen al array de imágenes
        const imageUrl = `${process.env.PUBLIC_URL}/${file.filename}`;
        webPage.imagesArray.push(imageUrl);
        await webPage.save();

        res.send({ message: "Imagen subida con éxito", data: webPage });
    } catch (error) {
        handleHttpError(res, "ERROR_UPLOADING_IMAGE");
    }
};

const addReview = async (req, res) => {
    try {
        const { storeId } = req.params;
        const { scoring, review } = matchedData(req);

        // Validar que la puntuación está entre 0 y 5
        if (scoring < 0 || scoring > 5) {
            return handleHttpError(res, "SCORING_MUST_BE_BETWEEN_0_AND_5", 400);
        }

        // Buscar la webStore por su ID
        const webPage = await webStoreModel.findById(storeId);
        if (!webPage) {
            return handleHttpError(res, "WEBSTORE_NOT_FOUND", 404);
        }

        // Calcular el nuevo scoring promedio
        const totalRatings = webPage.reviews.totalRatings + 1;
        const totalScore = (webPage.reviews.scoring * webPage.reviews.totalRatings) + scoring;
        const newScoring = totalScore / totalRatings;

        // Actualizar la información de la reseña
        webPage.reviews.scoring = newScoring;
        webPage.reviews.totalRatings = totalRatings;
        webPage.reviews.reviews.push(review);

        // Se guardan los cambios
        await webPage.save();

        res.send({ message: "Reseña agregada exitosamente", data: webPage });
    } catch (error) {
        handleHttpError(res, "ERROR_ADDING_REVIEW");
    }
};

const addText = async (req, res) => {
    try {
        const { storeId } = req.params;
        const { text } = matchedData(req);

        // Obtener el store asociado al merchant autenticado
        const store = await storeModel.findOne({ merchantId: req.user._id });
        if (!store) {
            return handleHttpError(res, "STORE_NOT_FOUND_FOR_MERCHANT", 404);
        }

        // Verificar que la webStore pertenece al store del merchant
        const webPage = await webStoreModel.findOne({ _id: storeId, storeId: store._id });
        if (!webPage) {
            return res.status(403).json({ error: "No tienes permiso para añadir texto a esta página." });
        }

        // Agregar el texto al array de textos
        webPage.textsArray.push(text);
        await webPage.save();

        res.send({ message: "Texto añadido con éxito", data: webPage });
    } catch (error) {
        handleHttpError(res, "ERROR_ADDING_TEXT");
    }
};


module.exports = { getWebStores, getWebStore, createWebStore, updateWebStore, archiveWebStore, deleteWebStore, uploadImage, addReview, addText };
