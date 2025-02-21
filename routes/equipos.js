const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Ruta para obtener todos los equipos
router.get("/", (req, res) => {
  const dataPath = path.join(__dirname, "../data/equipos.json");
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "No se pudo leer la data" });
    }
    const equipos = JSON.parse(data);
    res.json(equipos);
  });
});

// Ruta para obtener un equipo por ID
router.get("/:id", (req, res) => {
  const equipoId = parseInt(req.params.id);
  const dataPath = path.join(__dirname, "../data/equipos.json");
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "No se pudo leer la data" });
    }
    const equipos = JSON.parse(data);
    const equipo = equipos.find((e) => e.id === equipoId);
    if (!equipo) {
      return res.status(404).json({ error: "Equipo no encontrado" });
    }
    res.json(equipo);
  });
});

// Ruta para agregar un nuevo equipo
router.post("/", (req, res) => {
  const nuevoEquipo = req.body;
  const dataPath = path.join(__dirname, "../data/equipos.json");
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "No se pudo leer la data" });
    }
    let equipos = JSON.parse(data);
    // Asigna un nuevo id
    nuevoEquipo.id = equipos.length ? equipos[equipos.length - 1].id + 1 : 1;
    equipos.push(nuevoEquipo);
    fs.writeFile(dataPath, JSON.stringify(equipos, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Error al guardar el equipo" });
      }
      res.status(201).json(nuevoEquipo);
    });
  });
});

// Ruta para actualizar un equipo
router.put("/:id", (req, res) => {
  const equipoId = parseInt(req.params.id);
  const equipoActualizado = req.body;
  const dataPath = path.join(__dirname, "../data/equipos.json");
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "No se pudo leer la data" });
    }
    let equipos = JSON.parse(data);
    const index = equipos.findIndex((e) => e.id === equipoId);
    if (index === -1) {
      return res.status(404).json({ error: "Equipo no encontrado" });
    }
    // Actualizar el equipo
    equipos[index] = { id: equipoId, ...equipoActualizado };
    fs.writeFile(dataPath, JSON.stringify(equipos, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Error al actualizar el equipo" });
      }
      res.json(equipos[index]);
    });
  });
});

// Ruta para eliminar un equipo
router.delete("/:id", (req, res) => {
  const equipoId = parseInt(req.params.id);
  const dataPath = path.join(__dirname, "../data/equipos.json");
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "No se pudo leer la data" });
    }
    let equipos = JSON.parse(data);
    const nuevoArray = equipos.filter((e) => e.id !== equipoId);
    if (equipos.length === nuevoArray.length) {
      return res.status(404).json({ error: "Equipo no encontrado" });
    }
    fs.writeFile(dataPath, JSON.stringify(nuevoArray, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Error al eliminar el equipo" });
      }
      res.json({ message: "Equipo eliminado correctamente" });
    });
  });
});

module.exports = router;
