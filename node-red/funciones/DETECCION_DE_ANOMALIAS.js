// Nodo function de Node-RED: «DETECCION DE ANOMALIAS» (id 5e098d200bc84b7b)
// Extraído de flows_corregido.json


let datos = msg.payload;

// ==========================================
// 1. LIMPIAR HISTORIAL CUANDO SE SOLICITE
// ==========================================
if (msg.limpiar === true) {
    flow.set("historialAnomalias", []);
    flow.set("contadorAnomalias", {
        AP: 0,
        AN: 0,
        BP: 0,
        BN: 0,
        CP: 0,
        CN: 0,
        caudal: 0
    });

    flow.set("estadoAnomaliaDashboard", {
        ciclo: null,
        estadoGeneral: "SIN DATOS",
        anomalia: false,
        falla: false,
        estados: {}
    });

    node.status({
        fill: "green",
        shape: "dot",
        text: "Historial limpiado"
    });

    msg.payload = [];
    return msg;
}

// ==========================================
// 2. VALIDAR DATOS RECIBIDOS
// ==========================================
if (!datos || typeof datos !== "object") {
    return null;
}

if (
    datos.ciclo === null ||
    datos.ciclo === undefined ||
    datos.ciclo === ""
) {
    node.warn("Detección: ciclo no válido.");
    return null;
}

// ==========================================
// 3. CONFIGURACIÓN
// ==========================================
const variables = [
    "AP", "AN", "BP", "BN", "CP", "CN", "caudal"
];

const UMBRAL = 3;
const LIMITE_FALLA = 3;
const MAX_HISTORIAL = 100;

const identificadorCiclo = String(datos.ciclo);

// ==========================================
// 4. EVITAR EVALUAR DOS VECES EL MISMO CICLO
// ==========================================
const ultimoCicloEvaluado =
    flow.get("ultimoCicloEvaluadoDeteccion");

if (ultimoCicloEvaluado === identificadorCiclo) {
    return null;
}

// ==========================================
// 5. RECUPERAR MEMORIA
// ==========================================
let contadores = flow.get("contadorAnomalias") || {};
let historial = flow.get("historialAnomalias") || [];

if (!Array.isArray(historial)) {
    historial = [];
}

for (const variable of variables) {
    if (
        typeof contadores[variable] !== "number" ||
        !Number.isFinite(contadores[variable])
    ) {
        contadores[variable] = 0;
    }
}

// ==========================================
// 6. EVALUAR VARIABLES
// ==========================================
let anomalia = false;
let falla = false;
let evaluadas = 0;
let texto = "";

let estados = {};

texto += "CICLO: " + datos.ciclo + "\n";
texto += "-------------------------\n";

for (const variable of variables) {
    const dato = datos.zscore
        ? datos.zscore[variable]
        : null;

    if (!dato || typeof dato !== "object") {
        estados[variable] = {
            actual: datos.tiempos
                ? datos.tiempos[variable] ?? null
                : null,
            zscore: null,
            estado: "SIN REFERENCIA",
            contador: contadores[variable]
        };

        texto += variable + ": SIN REFERENCIA\n";
        continue;
    }

    const actual = Number(dato.actual);

    const z =
        dato.zscore === null ||
        dato.zscore === undefined ||
        dato.zscore === ""
            ? NaN
            : Number(dato.zscore);

    if (!Number.isFinite(z)) {
        estados[variable] = {
            actual: Number.isFinite(actual) ? actual : null,
            zscore: null,
            estado: "SIN REFERENCIA",
            contador: contadores[variable]
        };

        texto += variable + ": SIN REFERENCIA\n";
        continue;
    }

    evaluadas++;

    const esAnomalia = Math.abs(z) >= UMBRAL;
    let estado;

    if (esAnomalia) {
        contadores[variable]++;
        anomalia = true;

        // Evitar duplicar una variable en el mismo ciclo.
        const yaRegistrada = historial.some(item =>
            String(item.ciclo) === identificadorCiclo &&
            item.variable === variable
        );

        if (!yaRegistrada) {
            historial.push({
                ciclo: datos.ciclo,
                variable: variable,
                zscore: z,
                actual: Number.isFinite(actual) ? actual : null
            });
        }
    } else {
        contadores[variable] = 0;
    }

    if (contadores[variable] >= LIMITE_FALLA) {
        estado = "FALLA";
        falla = true;
    } else if (esAnomalia) {
        estado = "ANOMALIA";
    } else {
        estado = "NORMAL";
    }

    estados[variable] = {
        actual: Number.isFinite(actual) ? actual : null,
        zscore: z,
        estado: estado,
        contador: contadores[variable]
    };

    texto += variable.toUpperCase() + ": " +
        (Number.isFinite(actual) ? actual : "N/A") +
        " | Z: " + z.toFixed(2) +
        " | " + estado;

    if (esAnomalia) {
        texto += " | CONSECUTIVAS: " +
            contadores[variable];
    }

    texto += "\n";
}

// ==========================================
// 7. LIMITAR EL HISTORIAL
// ==========================================
if (historial.length > MAX_HISTORIAL) {
    historial = historial.slice(-MAX_HISTORIAL);
}

// ==========================================
// 8. DETERMINAR ESTADO GENERAL
// ==========================================
let estadoGeneral;

if (falla) {
    estadoGeneral = "FALLA";
} else if (anomalia) {
    estadoGeneral = "ANOMALIA DETECTADA";
} else if (evaluadas === 0) {
    estadoGeneral = "EN EVALUACION";
} else {
    estadoGeneral = "CICLO NORMAL";
}

// ==========================================
// 9. GUARDAR INFORMACIÓN ACTUALIZADA
// ==========================================
flow.set("contadorAnomalias", contadores);
flow.set("historialAnomalias", historial);

flow.set("estadoAnomaliaDashboard", {
    ciclo: datos.ciclo,
    estadoGeneral: estadoGeneral,
    anomalia: anomalia,
    falla: falla,
    estados: estados
});

flow.set(
    "ultimoCicloEvaluadoDeteccion",
    identificadorCiclo
);

// ==========================================
// 10. ENVIAR RESULTADO
// ==========================================
texto += "-------------------------\n";
texto += "ESTADO: " + estadoGeneral;

msg.payload = texto;
return msg;

