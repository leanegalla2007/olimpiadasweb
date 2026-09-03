const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require ('dotenv').config();
 // Importas tus rutas separadas
const panolRoutes = require("./routes/panolRoutes");
const PORT = process.env.PORT || 3000;

const app = express();

// Habilita el parseo de JSON para recibir datos en el body
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Conectas las rutas al servidor
app.use("/api", panolRoutes);

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "panol_db"
});

// --- LÓGICA DE ALMACENAMIENTO (LOCALSTORAGE) ---

function obtenerDatos(clave, datosPorDefecto) {
    let guardados = localStorage.getItem(clave);
    return guardados ? JSON.parse(guardados) : datosPorDefecto;
}

function guardarDatos(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}

// Datos iniciales por defecto
const empleadosDefault = [
    { nombre: "Lauryn Rivero", dni: "41.234.567", tarea: "Control de Riego y Sensores", horario: "10:00 a 14:00 hs", tipo: "Genérico / Empleado" }
];

const areasDefault = [
    { nombre: "Invernadero 1", origen: "Invernaderos", admin: "Carlos Gómez", sensores: "Temp / Humedad" },
    { nombre: "Sector Hidroponia", origen: "Hidroponia", admin: "María López", sensores: "Nivel de Agua / pH" }
];

const eventosDefault = [
    { fecha: "02/09/2026 - 10:15", area: "Invernadero 1 (Arduino)", tipo: "Emergencia (Temp. Alta)", estado: "Atendido" }
];

// --- RENDERIZAR TABLAS AUTOMÁTICAMENTE ---
document.addEventListener("DOMContentLoaded", () => {
    let tablaEmpleados = document.getElementById("tabla-empleados");
    if (tablaEmpleados) {
        let empleados = obtenerDatos("parque_empleados", empleadosDefault);
        tablaEmpleados.innerHTML = "";
        empleados.forEach(emp => {
            tablaEmpleados.innerHTML += `
                <tr>
                    <td>${emp.nombre}</td>
                    <td>${emp.dni}</td>
                    <td>${emp.tarea}</td>
                    <td>${emp.horario}</td>
                    <td>${emp.tipo}</td>
                </tr>
            `;
        });
    }

    let tablaAreas = document.getElementById("tabla-areas");
    if (tablaAreas) {
        let areas = obtenerDatos("parque_areas", areasDefault);
        tablaAreas.innerHTML = "";
        areas.forEach(area => {
            tablaAreas.innerHTML += `
                <tr>
                    <td>${area.nombre}</td>
                    <td>${area.origen}</td>
                    <td>${area.admin}</td>
                    <td>${area.sensores}</td>
                </tr>
            `;
        });
    }

    let tablaReportes = document.getElementById("tabla-reportes");
    if (tablaReportes) {
        let eventos = obtenerDatos("parque_eventos", eventosDefault);
        tablaReportes.innerHTML = "";
        eventos.forEach(ev => {
            tablaReportes.innerHTML += `
                <tr>
                    <td>${ev.fecha}</td>
                    <td>${ev.area}</td>
                    <td>${ev.tipo}</td>
                    <td><span style="color: ${ev.estado === 'Atendido' ? '#2e7d32' : '#dc2626'}; font-weight: bold;">${ev.estado}</span></td>
                </tr>
            `;
        });
    }
});

// --- FUNCIONES PARA GUARDAR DESDE FORMULARIOS ---
function registrarEmpleado(e) {
    e.preventDefault();
    let nuevo = {
        nombre: document.getElementById("emp-nombre").value,
        dni: document.getElementById("emp-dni").value,
        tarea: document.getElementById("emp-tarea").value,
        horario: document.getElementById("emp-horario").value,
        tipo: document.getElementById("emp-tipo").value
    };
    let empleados = obtenerDatos("parque_empleados", empleadosDefault);
    empleados.push(nuevo);
    guardarDatos("parque_empleados", empleados);
    alert("¡Ficha de empleado guardada con éxito!");
    window.location.href = "empleados.html";
}

function registrarArea(e) {
    e.preventDefault();
    let nueva = {
        nombre: document.getElementById("area-nombre").value,
        origen: document.getElementById("area-origen").value,
        admin: document.getElementById("area-admin").value,
        sensores: document.getElementById("area-sensores").value
    };
    let areas = obtenerDatos("parque_areas", areasDefault);
    areas.push(nueva);
    guardarDatos("parque_areas", areas);
    alert("¡Área creada y guardada con éxito!");
    window.location.href = "configuracion.html";
}

function registrarEvento(e) {
    e.preventDefault();
    let fechaActual = new Date().toLocaleString();
    let nuevoEv = {
        fecha: fechaActual,
        area: document.getElementById("ev-area").value,
        tipo: document.getElementById("ev-tipo").value,
        estado: "Pendiente / Activo"
    };
    let eventos = obtenerDatos("parque_eventos", eventosDefault);
    eventos.push(nuevoEv);
    guardarDatos("parque_eventos", eventos);
    alert("¡Evento registrado correctamente!");
    window.location.href = "index.html";
}