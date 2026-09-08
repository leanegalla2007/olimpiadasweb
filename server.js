const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

// Habilita el parseo de JSON para recibir datos en el body
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// 1. Cambiamos createConnection por createPool 
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 2. Probamos la conexión para asegurarnos de que no haya errores
db.getConnection((err, connection) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err.code);
  } else {
    console.log("Conectado exitosamente a la base de datos MySQL");
    connection.release(); // Liberamos la conexión de prueba
  }
});

// 3. Inyectamos la db en cada petición para que tus rutas puedan usarla
// app.use((req, next) => {
//   req.db = db;
//   next();
// });

// Importas y conectas tus rutas DESPUÉS de inyectar la DB
const parqueRoutes = require("./routes/parqueRoutes");
app.use("/api", parqueRoutes);

// Iniciamos el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));