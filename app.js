const express = require("express"); // Importamos express
const cors = require("cors");
require("dotenv").config(); // Implementamos la librería dotenv para manejar el documento .env
const dbConnect = require("./config/mongo"); // Importamos la función para conectarnos a la BBDD
const morganBody = require("morgan-body");

const { IncomingWebhook } = require("@slack/webhook");

const swaggerUI = require("swagger-ui-express"); // Importamos Swagger UI
const swaggerSpecs = require("./config/swaggerOptions");

const webHook = new IncomingWebhook(process.env.SLACK_WEBHOOK);

const app = express();

app.use(cors());
app.use(express.json()); // Funcionalidad para convertir los modelos a JSON automáticamente
app.use(express.static("./storage"));

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

// Condicionar la conexión a la BD y el inicio del servidor
if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;

  // Conexión a la base de datos
  dbConnect();

  // Iniciar el servidor
  app.listen(port, () => {
    // Ponemos al servidor a escuchar cambios en el puerto
    console.log("Servidor escuchando en el puerto " + port);
  });
}

const loggerStream = {
  write: (message) => {
    webHook.send({
      text: message,
    });
  },
};
morganBody(app, {
  noColors: true, //limpiamos el String de datos lo máximo posible antes de mandarlo a Slack

  skip: function (req, res) {
    //Solo enviamos errores (4XX de cliente y 5XX de servidor)

    return res.statusCode < 400;
  },

  stream: loggerStream,
});

// Rutas
app.use("/api", require("./routes"));

module.exports = app;
