// Nodo function de Node-RED: «limpiar datos» (id e6a36fded9a3b0bd)
// Extraído de flows_corregido.json


const claves = [
    "ciclos",
    "referenciaZScore",
    "reinicioReferenciaZScore",
    "ultimoZScoreDashboard",
    "estadoAnomaliaDashboard",
    "contadorAnomalias",
    "historialAnomalias",
    "ultimoCicloDashboard"
];

for (const clave of claves) {
    flow.set(clave, undefined);
}

node.warn("Datos de prueba eliminados del contexto de flujo.");

msg.payload = {
    limpieza: true,
    mensaje: "Memoria de prueba limpiada"
};

return msg;

