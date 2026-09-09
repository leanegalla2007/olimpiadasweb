const express = require("express");
const router = express.Router();
const areasController = require("../controllers/areasController");

// Ruta para traer todas las áreas y mostrarlas en la tabla
router.get("/areas", areasController.obtenerAreas);

// Ruta para guardar una nueva área desde el formulario
router.post("/areas", areasController.registrarArea);

module.exports = router;