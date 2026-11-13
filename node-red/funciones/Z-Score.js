// Nodo function de Node-RED: «Z-Score» (id b1e2939bbfb07448)
// Extraído de flows_corregido.json


/* ==========================================
   Z-SCORE CON REFERENCIAS NOMINALES FIJAS
   AP, AN, BP, BN, CP, CN y CAUDAL

   Calibración: 25 mediciones nominales
   Umbral de anomalía: |Z| >= 3
   Las referencias no cambian en ejecución.
   ========================================== */

// ------------------------------------------
// 1. REFERENCIAS NOMINALES FIJAS
// ------------------------------------------

const REFERENCIA = {
    AP:     { media: 447.12,  desviacion: 115.0403 },
    AN:     { media: 621.44,  desviacion: 35.6149 },
    BP:     { media: 413.08,  desviacion: 31.7660 },
    BN:     { media: 558.92,  desviacion: 42.7697 },
    CP:     { media: 383.08,  desviacion: 48.2579 },
    CN:     { media: 583.96,  desviacion: 65.2109 },
    CAUDAL: { media: 3.3480,  desviacion: 0.7094 }
};

const VARIABLES = ["AP", "AN", "BP", "BN", "CP", "CN"];
const UMBRAL_Z = 3;

// ------------------------------------------
// 2. OBTENER EL CICLO ACTUAL
// ------------------------------------------

const ciclos = flow.get("ciclos") || [];

if (!Array.isArray(ciclos) || ciclos.length === 0) {
    node.warn("Z-Score: no hay ciclos disponibles.");
    return null;
}

const cicloActual = ciclos[ciclos.length - 1];

// ------------------------------------------
// 3. CALCULAR Z-SCORE DE LOS SEIS TIEMPOS
// ------------------------------------------

const tiempos = {};
const zscore = {};

for (const variable of VARIABLES) {
    const valorOriginal = cicloActual[variable];
    const actual = Number(valorOriginal);

    const media = REFERENCIA[variable].media;
    const desviacion = REFERENCIA[variable].desviacion;

    if (
        valorOriginal === null ||
        valorOriginal === undefined ||
        valorOriginal === "" ||
        !Number.isFinite(actual) ||
        desviacion <= 0
    ) {
        node.warn(
            "Z-Score: valor inválido para " + variable +
            " en el ciclo " + cicloActual.ciclo
        );
        return null;
    }

    const z = (actual - media) / desviacion;

    tiempos[variable] = actual;

    zscore[variable] = {
        actual: actual,
        media: media,
        desviacion: desviacion,
        zscore: Number(z.toFixed(4)),
        estado: Math.abs(z) >= UMBRAL_Z
            ? "ANOMALIA"
            : "NORMAL"
    };
}

// ------------------------------------------
// 4. CALCULAR Z-SCORE DEL CAUDAL
// ------------------------------------------

const valorOriginalCaudal = cicloActual.caudal;

const caudalActual =
    valorOriginalCaudal === null ||
    valorOriginalCaudal === undefined ||
    valorOriginalCaudal === ""
        ? NaN
        : Number(valorOriginalCaudal);

if (!Number.isFinite(caudalActual)) {
    node.warn(
        "Z-Score: caudal inválido en el ciclo " +
        cicloActual.ciclo
    );
    return null;
}

const mediaCaudal = REFERENCIA.CAUDAL.media;
const desviacionCaudal = REFERENCIA.CAUDAL.desviacion;

const zCaudal =
    (caudalActual - mediaCaudal) / desviacionCaudal;

zscore.caudal = {
    actual: caudalActual,
    media: mediaCaudal,
    desviacion: desviacionCaudal,
    zscore: Number(zCaudal.toFixed(4)),
    estado: Math.abs(zCaudal) >= UMBRAL_Z
        ? "ANOMALIA"
        : "NORMAL"
};

// ------------------------------------------
// 5. ENTREGAR RESULTADO
// ------------------------------------------

msg.payload = {
    ciclo: cicloActual.ciclo,
    tiempos: tiempos,
    zscore: zscore,
    referenciaFija: true,
    referenciaCaudal: {
        media: mediaCaudal,
        desviacion: desviacionCaudal,
        muestras: 25,
        estado: "Referencia nominal fija"
    }
};

// Guardar Z-Scores para el Dashboard
flow.set("ultimoZScoreDashboard", zscore);

// Estado visual del nodo
const variablesAnomalas = Object.keys(zscore).filter(
    variable =>
        Math.abs(zscore[variable].zscore) >= UMBRAL_Z
);

if (variablesAnomalas.length > 0) {
    node.status({
        fill: "red",
        shape: "dot",
        text: "Anomalía | ciclo " + cicloActual.ciclo
    });
} else {
    node.status({
        fill: "green",
        shape: "dot",
        text: "Ciclo normal | " + cicloActual.ciclo
    });
}

return msg;

