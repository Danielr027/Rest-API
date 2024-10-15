const { storageModel } = require('../models');

const createItem = async (req, res) => {
    const { file } = req;
    const fileData = {
        filename: file.filename,
        url: process.env.PUBLIC_URL + "/" + file.filename
    };
    const data = await storageModel.create(fileData);
    res.send(data);
};

module.exports = { createItem };
