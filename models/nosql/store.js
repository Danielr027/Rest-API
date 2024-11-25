const mongoose = require("mongoose");

// Definimos el modelo de nuestros comercios que vamos a utilizar para interactuar con nuestra BBDD 
const StoreSchema = new mongoose.Schema(
    {
        storeName: { type: String },
        CIF: { type: String },
        address: { type: String },
        email: { type: String },
        contactNumber: { type: String },
        merchantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true }
    },
    { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("store", StoreSchema);
