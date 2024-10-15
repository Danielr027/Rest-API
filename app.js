const express = require("express");  // Importamos express
const cors = require("cors");
require('dotenv').config();  // Implementamos la librería dotenv para manejar el documento .env
const dbConnect = require('./config/mongo');  // Importamos la función para conectarnos a la BBDD

const app = express();

app.use(cors());
app.use(express.json());  // Funcionalidad para convertir los modelos a JSON automáticamente

const port = process.env.PORT || 3000;

app.listen(port, () => {   // Ponemos al servidor a escuchar cambios en el puerto
    console.log("Servidor escuchando en el puerto " + port);
});

dbConnect();

// Rutas
app.use("/api", require("./routes"));
