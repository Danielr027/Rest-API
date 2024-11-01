const mongoose = require("mongoose");

// Definimos el modelo de nuestros comercios que vamos a utilizar para interactuar con nuestra BBDD 
const WebStoreSchema = new mongoose.Schema({
    city: { type: String, required: true, trim: true },
    activity: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    resume: { type: String, required: true, trim: true },
    textsArray: { type: [String], default: [] },
    imagesArray: { type: [String], default: [] },
    reviews: {
        scoring: { type: Number, min: 0, max: 5, default: 0 },
        totalRatings: { type: Number, default: 0 },
        reviews: { type: [String], default: [] }
    },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "store", unique: true, required: true } // Relación 1:1 con Store
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("webStore", WebStoreSchema);
