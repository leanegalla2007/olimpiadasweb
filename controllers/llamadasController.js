const db = require("../config/db.js");

const registrarLlamada = async (req, res) => {
    console.log("recibi post del arduino");
    try {
        console.log(req.body);
        const { area, tipo_llamado, descripcion } = req.body;
        console.log(area, tipo_llamado, descripcion);
        if (!area || !tipo_llamado) {
            return res.status(400).json({ error: "El área y el tipo de llamado son obligatorios" });
        }

        const sql = `
            INSERT INTO llamados 
            (lugar_origen, tipo_emergencia, descripcion, estado) 
            VALUES (?, ?, ?, 'Activo')
        `;
        
        const valores = [area, tipo_llamado, descripcion || 'Sin descripción'];

        const [resultado] = await db.query(sql, valores);

        res.status(201).json({ 
            mensaje: "¡Evento registrado con éxito!", 
            id: resultado.insertId 
        });

    } catch (error) {
        console.error("Error al registrar el llamado en MySQL:", error);
        res.status(500).json({ error: "Error interno del servidor al registrar el llamado" });
    }
};

// Obtener los llamados para mostrarlos en el monitoreo general
const obtenerLlamada = async (req, res) => {
    try {
        const [filas] = await db.query("SELECT * FROM llamados");
        res.json(filas);
    } catch (error) {
        console.error("Error al obtener los llamados:", error);
        res.status(500).json({ error: "Error al obtener los llamados" });
    }
};

module.exports = {
    registrarLlamada,
    obtenerLlamada
}