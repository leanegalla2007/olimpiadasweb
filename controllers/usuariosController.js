// Importamos la conexión a la base de datos
const db = require("../config/db.js");

const registrarEmpleado = async (req, res) => {
    try {
        // 1. Extraemos los datos que nos mandó el Front-end (fetch)
        const { contraseña, nombre_usuario} = req.body;

        // 2. Armamos la consulta SQL
        // Usamos los signos de interrogación (?) por seguridad, para evitar Inyecciones SQL
        const sql = "INSERT INTO usuarios (contraseña, nombre_usuario) VALUES (?, ?)";
        const valores = [contraseña, nombre_usuario];

        // 3. Ejecutamos la consulta. Usamos .promise() para poder usar await.
        const [resultado] = await db.query(sql, valores);

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
        // Extraemos todos los campos que coinciden con las columnas de tu phpMyAdmin
        const { nombre, apellido, contrasena, nombre_usuario, fecha_nac, dni, direccion, lugar_trabajo, especialidad, rol } = req.body;

        // Validamos que los campos obligatorios no vengan vacíos
        if (!nombre || !apellido) {
            return res.status(400).json({ error: "Faltan datos obligatorios (nombre, apellido, contraseña o dni)" });
        }

        // Armamos la consulta SQL adaptada a tus columnas exactas
        const sql = `
            INSERT INTO usuarios 
            (nombre, apellido, contraseña, nombre_usuario, fecha_nac, dni, direccion, lugar_trabajo, especialidad, rol) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const valores = [nombre, apellido, contrasena, nombre_usuario, fecha_nac, dni, direccion, lugar_trabajo, especialidad, rol || 'Usuario'];

        // Ejecutamos la consulta en MySQL
        const [resultado] = await db.query(sql, valores);

        res.status(201).json({ 
            mensaje: "¡Usuario registrado con éxito en la base de datos!", 
            id: resultado.insertId 
        });

    } catch (error) {
        console.error("Error al registrar en MySQL:", error);
        res.status(500).json({ error: "Error interno del servidor al registrar" });
    }
};


const iniciarSesion = async (req, res) => {
    try {
        console.log("Datos recibidos en el backend:", req.body);
        const { usuario, contrasena } = req.body;

        // Validamos que no vengan vacíos
        if (!usuario || !contrasena) {
            return res.status(400).json({ error: "Completá todos los campos" });
        }

        // Buscamos al usuario en la base de datos
        const sql = "SELECT * FROM usuarios WHERE nombre_usuario = ? AND contraseña = ?";
        const [filas] = await db.query(sql, [usuario, contrasena]);

        // Si no encuentra ninguna coincidencia, las credenciales son incorrectas
        if (filas.length === 0) {
            return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
        }

        // Si coincide, le damos acceso exitoso
        res.json({ mensaje: "¡Bienvenido!", usuario: filas[0].nombre });

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const obtenerUsuarios = async (req, res) => {
    try {
        // Traemos todos los usuarios (o podés filtrar por rol si querés: WHERE rol = 'Administrador')
        const [filas] = await db.query("SELECT id, nombre, apellido FROM usuarios");
        res.json(filas);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
};

// Y no te olvides de agregarlo en el module.exports abajo de todo:
module.exports = {
    registrarEmpleado,
    registrarUsuario,
    iniciarSesion,
    obtenerUsuarios
};