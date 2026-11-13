// Nodo function de Node-RED: «function 3» (id e203ed36b3f2c7be)
// Extraído de flows_corregido.json


 // CAUDAL CODESYS - GUARDAR ULTIMA LECTURA

if (!Array.isArray(msg.payload) || msg.payload.length < 2) {
    node.warn("Caudal: faltan las dos palabras");
    return null;
}

const word0 = Number(msg.payload[0]);
const word1 = Number(msg.payload[1]);

if (
    !Number.isInteger(word0) ||
    !Number.isInteger(word1) ||
    word0 < 0 || word0 > 65535 ||
    word1 < 0 || word1 > 65535
) {
    node.warn("Caudal: palabras invalidas");
    return null;
}

const buffer = Buffer.alloc(4);
buffer.writeUInt16LE(word0, 0);
buffer.writeUInt16LE(word1, 2);

const caudal = buffer.readFloatLE(0);

if (!Number.isFinite(caudal)) {
    node.warn("Caudal: valor no valido");
    return null;
}

const lecturaCaudal = {
    caudal: caudal,
    timestamp: Date.now(),
    word0: word0,
    word1: word1
};

// Guardar la última lectura para otros nodos
flow.set("ultimaLecturaCaudal", lecturaCaudal);

// Enviar la lectura al Debug
msg.payload = lecturaCaudal;
return msg;

