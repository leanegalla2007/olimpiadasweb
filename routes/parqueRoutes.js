const express = require("express");
const router = express.Router();

// Importamos nuestro controlador
const usuariosController = require("../controllers/usuariosController");

// Definimos la ruta. 
// Cuando el front-end haga un POST a /api/empleados, se ejecuta registrarEmpleado
router.post("/registro", usuariosController.registrarUsuario);
router.post("/empleados", usuariosController.registrarEmpleado);
router.post("/login", usuariosController.iniciarSesion);

module.exports = router;