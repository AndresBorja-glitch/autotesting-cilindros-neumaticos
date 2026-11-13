// Nodo function de Node-RED: «function 4» (id fafa22aca151143e)
// Extraído de flows_corregido.json


/* =========================================
   LIMPIAR DASHBOARD E HISTORIAL DE ANOMALIAS
   ========================================= */

// 1. Limpiar historiales
flow.set("historialCaudal", []);
flow.set("historialPresion", []);
flow.set("historialTiempo", []);
flow.set("historialAnomalias", []);

// 2. Reiniciar contador y acumuladores
flow.set("contadorMuestras", 0);
flow.set("sumaCaudal", 0);
flow.set("sumaPresion", 0);
flow.set("sumaTiempo", 0);

// 3. Reiniciar contadores de anomalías consecutivas
flow.set("contadorAnomalias", {
    AP: 0,
    AN: 0,
    BP: 0,
    BN: 0,
    CP: 0,
    CN: 0,
    caudal: 0
});

// 4. Limpiar estado general de anomalías
flow.set("estadoAnomaliaDashboard", {
    ciclo: null,
    estadoGeneral: "SIN DATOS",
    anomalia: false,
    falla: false,
    estados: {}
});

// 5. Enviar señal de limpieza a los nodos del dashboard
msg.limpiar = true;
msg.payload = [];

node.status({
    fill: "green",
    shape: "dot",
    text: "Historial y acumuladores limpiados"
});

return msg;

