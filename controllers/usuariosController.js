// Importamos la conexión a la base de datos
const db = require("../config/db.js");

const registrarEmpleado = async (req, res) => {
    try {
        // 1. Extraemos los datos que nos mandó el Front-end (fetch)
        const { nombre, apellido, contraseña, fecha_nac, dni, lugar_trabajo, especialidad } = req.body;

        // 2. Armamos la consulta SQL
        // Usamos los signos de interrogación (?) por seguridad, para evitar Inyecciones SQL
        const sql = "INSERT INTO usuarios (nombre, apellido, contraseña, fecha_nac, dni, lugar_trabajo, especialidad) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const valores = [nombre, apellido, contraseña, fecha_nac, dni, lugar_trabajo, especialidad];

        // 3. Ejecutamos la consulta. Usamos .promise() para poder usar await.
        const [resultado] = await db.promise().query(sql, valores);

        // 4. Respondemos al Front-end que todo salió bien
        res.status(201).json({ 
            mensaje: "¡Empleado registrado con éxito en la base de datos!", 
            id_insertado: resultado.insertId 
        });

    } catch (error) {
        console.error("Error al guardar en MySQL:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const registrarUsuario = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;

        // Validamos que no vengan vacíos
        if (!usuario || !contrasena) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        // Insertamos en la base de datos de phpMyAdmin
        const sql = "INSERT INTO usuarios (usuario, contrasena) VALUES (?, ?)";
        const [resultado] = await db.promise().query(sql, [usuario, contrasena]);

        res.status(201).json({ 
            mensaje: "¡Cuenta creada con éxito!", 
            id: resultado.insertId 
        });

    } catch (error) {
        console.error("Error al registrar en MySQL:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Exportamos la función para usarla en las rutas
module.exports = {
    registrarEmpleado,
    registrarUsuario
};