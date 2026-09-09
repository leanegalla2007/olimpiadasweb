const db = require("../config/db.js");

const registrarArea = async (req, res) => {
    try {
        const { nombre, origen, admin, sensores } = req.body;

        if (!nombre || !origen) {
            return res.status(400).json({ error: "El nombre y el origen son obligatorios" });
        }

        const sql = `
            INSERT INTO areas 
            (nombre, origen, admin, sensores) 
            VALUES (?, ?, ?, ?)
        `;
        
        const valores = [nombre, origen, admin, sensores];

        const [resultado] = await db.query(sql, valores);

        res.status(201).json({ 
            mensaje: "¡Área registrada con éxito!", 
            id: resultado.insertId 
        });

    } catch (error) {
        console.error("Error al registrar el área en MySQL:", error);
        res.status(500).json({ error: "Error interno del servidor al registrar el área" });
    }
};

const obtenerAreas = async (req, res) => {
    try {
        const [filas] = await db.query("SELECT * FROM areas");
        res.json(filas);
    } catch (error) {
        console.error("Error al obtener las áreas:", error);
        res.status(500).json({ error: "Error al obtener las áreas" });
    }
};

module.exports = {
    registrarArea,
    obtenerAreas
}