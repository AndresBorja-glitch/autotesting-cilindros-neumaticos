// Nodo function de Node-RED: «function 1» (id 11cc886370b4e400)
// Extraído de flows_corregido.json


let t = msg.payload;

if (!Array.isArray(t) || t.length < 7) {
    return null;
}

let cicloActual = Number(t[6]);

if (!Number.isFinite(cicloActual)) {
    return null;
}

let ultimoCiclo = flow.get("ultimoCiclo");

if (ultimoCiclo === undefined) {
    flow.set("ultimoCiclo", cicloActual);
    return null;
}

if (cicloActual === ultimoCiclo) {
    return null;
}

flow.set("ultimoCiclo", cicloActual);

// Obtener la última lectura de caudal guardada por function 3
let lecturaCaudal = flow.get("ultimaLecturaCaudal");

let ciclo = {
    ciclo: cicloActual,
    AP: Number(t[0]),
    AN: Number(t[1]),
    BP: Number(t[2]),
    BN: Number(t[3]),
    CP: Number(t[4]),
    CN: Number(t[5]),
    caudal: lecturaCaudal &&
        Number.isFinite(Number(lecturaCaudal.caudal))
        ? Number(lecturaCaudal.caudal)
        : null,
    fecha: new Date().toISOString()
};

let ciclos = flow.get("ciclos") || [];

ciclos.push(ciclo);
flow.set("ciclos", ciclos);

// Preparar el registro de texto
msg.payload =
    "CICLO: " + ciclo.ciclo + "\n" +
    "-------------------------\n" +
    "AP: " + ciclo.AP + "\n" +
    "AN: " + ciclo.AN + "\n" +
    "BP: " + ciclo.BP + "\n" +
    "BN: " + ciclo.BN + "\n" +
    "CP: " + ciclo.CP + "\n" +
    "CN: " + ciclo.CN + "\n" +
    "CAUDAL: " +
    (ciclo.caudal !== null ? ciclo.caudal : "SIN LECTURA") + "\n" +
    "FECHA: " + ciclo.fecha;

return msg;

