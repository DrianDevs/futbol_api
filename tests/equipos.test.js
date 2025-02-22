// tests/equipos.test.js
const request = require("supertest");
const express = require("express");
const fs = require("fs");
const path = require("path");

// Importa las rutas
const equiposRouter = require("../routes/equipos");

const app = express();
app.use(express.json());  // Necesario para que `req.body` funcione
app.use("/equipos", equiposRouter);

// Ruta mock para interceptar la escritura de archivos
jest.mock("fs");

describe("Pruebas de las rutas de equipos", () => {
  const dataPath = path.join(__dirname, "../data/equipos.json");

  // Simulamos la respuesta del archivo JSON
  const mockEquipos = [
    { id: 1, nombre: "FC Barcelona", ciudad: "Barcelona" },
    { id: 2, nombre: "Real Madrid", ciudad: "Madrid" },
  ];

  beforeEach(() => {
    // Cada vez que se ejecute una prueba, el mock debe estar limpio
    fs.readFile.mockImplementation((path, encoding, callback) => {
      callback(null, JSON.stringify(mockEquipos));  // Simula la lectura del archivo
    });
    fs.writeFile.mockImplementation((path, data, callback) => {
      callback(null);  // Simula la escritura exitosa del archivo
    });
  });

  test("GET /equipos - Debe obtener todos los equipos", async () => {
    const response = await request(app).get("/equipos");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockEquipos);
  });

  test("GET /equipos/:id - Debe obtener un equipo por ID", async () => {
    const response = await request(app).get("/equipos/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockEquipos[0]);
  });

  test("GET /equipos/:id - Debe devolver 404 si el equipo no existe", async () => {
    const response = await request(app).get("/equipos/999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Equipo no encontrado");
  });

  test("POST /equipos - Debe agregar un nuevo equipo", async () => {
    const nuevoEquipo = { nombre: "Atletico Madrid", ciudad: "Madrid" };
    const response = await request(app).post("/equipos").send(nuevoEquipo);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.nombre).toBe("Atletico Madrid");
    expect(response.body.ciudad).toBe("Madrid");
  });

  test("POST /equipos - Debe devolver 500 si ocurre un error al agregar", async () => {
    fs.writeFile.mockImplementationOnce((path, data, callback) => {
      callback(new Error("Error al guardar el equipo"));
    });

    const nuevoEquipo = { nombre: "Atletico Madrid", ciudad: "Madrid" };
    const response = await request(app).post("/equipos").send(nuevoEquipo);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "Error al guardar el equipo");
  });

  test("PUT /equipos/:id - Debe actualizar un equipo", async () => {
    const equipoActualizado = { nombre: "FC Barcelona Updated", ciudad: "Barcelona" };
    const response = await request(app).put("/equipos/1").send(equipoActualizado);

    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe("FC Barcelona Updated");
  });

  test("PUT /equipos/:id - Debe devolver 404 si el equipo no existe", async () => {
    const equipoActualizado = { nombre: "Nuevo Nombre", ciudad: "Nueva Ciudad" };
    const response = await request(app).put("/equipos/999").send(equipoActualizado);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Equipo no encontrado");
  });

  test("DELETE /equipos/:id - Debe eliminar un equipo", async () => {
    const response = await request(app).delete("/equipos/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Equipo eliminado correctamente");
  });

  test("DELETE /equipos/:id - Debe devolver 404 si el equipo no existe", async () => {
    const response = await request(app).delete("/equipos/999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Equipo no encontrado");
  });
});
