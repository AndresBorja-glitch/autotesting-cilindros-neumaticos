// Nodo function de Node-RED: «REGISTRO CSV PRUEBAS» (id a1b2c3d4e5f60001)
// Extraído de flows_corregido.json

// REGISTRO TABULAR DE PRUEBAS (una fila por ciclo evaluado)
if (msg.limpiar === true) { return null; }

const est = flow.get("estadoAnomaliaDashboard");
if (!est || est.ciclo === null || est.ciclo === undefined) { return null; }

const vars = ["AP", "AN", "BP", "BN", "CP", "CN", "caudal"];
const e = est.estados || {};
const f = (v) => (v === null || v === undefined || !Number.isFinite(Number(v))) ? "" : Number(v);

let fila = [new Date().toISOString(), est.ciclo];
for (const v of vars) fila.push(f(e[v] ? e[v].actual : null));
for (const v of vars) fila.push(f(e[v] ? e[v].zscore : null));
for (const v of vars) fila.push(e[v] ? e[v].estado : "");
fila.push(est.estadoGeneral);

let lineas = [];
if (!flow.get("registroCabeceraEscrita")) {
    let cab = ["fecha", "ciclo"];
    for (const v of vars) cab.push(v);
    for (const v of vars) cab.push("z_" + v);
    for (const v of vars) cab.push("estado_" + v);
    cab.push("estado_general");
    lineas.push(cab.join(","));
    flow.set("registroCabeceraEscrita", true);
}
lineas.push(fila.join(","));

msg.payload = lineas.join("\n");
return msg;

