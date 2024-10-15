const mongoose = require("mongoose");

// Definimos el modelo de nuestros comercios que vamos a utilizar para interactuar con nuestra BBDD 
const StoreSchema = new mongoose.Schema(
    {
        storeName: { type: String },
        CIF: { type: String },
        adress: { type: String },
        email: { type: String },
        contactNumber: { type: String },
        pageId: { type: Number }
    },
    { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("store", StoreSchema);
