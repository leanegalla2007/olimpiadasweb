const express = require("express");
const router = express.Router();

const llamadasController = require("../controller/llamadasController");

router.post("/llamadas", llamadasController.registrarLlamada);
router.get("/llamadas", llamadasController.obtenerLlamada)