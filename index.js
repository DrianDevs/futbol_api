const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

const cors = require("cors");
app.use(cors());

// Ruta base para verificar que el servidor funciona
app.get("/", (req, res) => {
  res.send("API de equipos de fútbol");
});

// Importamos la ruta para los equipos
const equiposRouter = require("./routes/equipos");
app.use("/api/equipos", equiposRouter);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
