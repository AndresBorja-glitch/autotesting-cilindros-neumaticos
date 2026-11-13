// Nodo function de Node-RED: «Datos DashBoard» (id 2f556900201acb9e)
// Extraído de flows_corregido.json

let ciclo = msg.payload;

// Verificar que recibimos el texto generado por "function 1"
if (typeof ciclo !== "string") {
    return null;
}

let lineas = ciclo.split("\n");
let datos = {};

for (let linea of lineas) {

    let partes = linea.split(":");

    if (partes.length < 2) {
        continue;
    }

    let clave = partes[0].trim();
    let valor = partes.slice(1).join(":").trim();

    datos[clave] = valor;
}

// Crear estructura para el Dashboard
msg.payload = {
    ciclo: Number(datos["CICLO"]),

    tiempos: {
        AP: Number(datos["AP"]),
        AN: Number(datos["AN"]),
        BP: Number(datos["BP"]),
        BN: Number(datos["BN"]),
        CP: Number(datos["CP"]),
        CN: Number(datos["CN"])
    }
};

// Guardar el último ciclo para utilizarlo después
flow.set("ultimoCicloDashboard", msg.payload);

return msg;
