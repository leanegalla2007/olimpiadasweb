const express = require("express");
const router = express.Router();

const llamadasController = require("../controllers/llamadasController");

router.post("/lecturas", llamadasController.registrarLlamada);
router.get("/llamadas", llamadasController.obtenerLlamada)

module.exports = router;