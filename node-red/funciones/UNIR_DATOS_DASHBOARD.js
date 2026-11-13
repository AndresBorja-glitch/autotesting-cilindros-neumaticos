// Nodo function de Node-RED: «UNIR DATOS DASHBOARD» (id 3e147b576ab72b1e)
// Extraído de flows_corregido.json


let ciclo = flow.get("ultimoCicloDashboard");
let zscore = flow.get("ultimoZScoreDashboard");
let estado = flow.get("estadoAnomaliaDashboard");

let historialAnomalias = flow.get("historialAnomalias") || [];
let lecturaCaudal = flow.get("ultimaLecturaCaudal");

// Sin datos de ciclo, no enviar nada
if (
    !ciclo ||
    ciclo.ciclo === undefined ||
    ciclo.ciclo === null
) {
    return null;
}

// Evitar duplicados, usando también la fecha si está disponible
let identificadorCiclo =
    String(ciclo.ciclo) + "|" + String(ciclo.fecha || "");

let ultimoCicloEnviado =
    flow.get("ultimoCicloEnviadoDashboard");

if (ultimoCicloEnviado === identificadorCiclo) {
    return null;
}

flow.set("ultimoCicloEnviadoDashboard", identificadorCiclo);

// Limpiar el estado general para que no aparezca
// el mensaje "dashboard reiniciado"
let estadoGeneral = estado
    ? estado.estadoGeneral
    : null;

if (
    estadoGeneral &&
    String(estadoGeneral)
        .toLowerCase()
        .includes("dashboard reiniciado")
) {
    estadoGeneral = "ESPERANDO DATOS";
}

// Datos para el dashboard
msg.payload = {
    ciclo: ciclo.ciclo,
    fecha: ciclo.fecha || null,

    caudal: {
        valor:
            zscore && zscore.caudal
                ? zscore.caudal.actual
                : (lecturaCaudal
                    ? lecturaCaudal.caudal
                    : null),

        timestamp: lecturaCaudal
            ? lecturaCaudal.timestamp
            : null
    },

    tiempos: ciclo.tiempos
        ? {
            AP: ciclo.tiempos.AP,
            AN: ciclo.tiempos.AN,
            BP: ciclo.tiempos.BP,
            BN: ciclo.tiempos.BN,
            CP: ciclo.tiempos.CP,
            CN: ciclo.tiempos.CN
        }
        : null,

    zscore: zscore
        ? {
            AP: zscore.AP,
            AN: zscore.AN,
            BP: zscore.BP,
            BN: zscore.BN,
            CP: zscore.CP,
            CN: zscore.CN,
            caudal: zscore.caudal || null
        }
        : null,

    estado: estado
        ? {
            ciclo: estado.ciclo,
            estadoGeneral: estadoGeneral,
            anomalia: estado.anomalia,
            falla: estado.falla || false,
            estados: estado.estados
        }
        : {
            ciclo: ciclo.ciclo,
            estadoGeneral: "ESPERANDO DATOS",
            anomalia: false,
            falla: false,
            estados: {}
        },

    historialAnomalias: historialAnomalias
};

return msg;

