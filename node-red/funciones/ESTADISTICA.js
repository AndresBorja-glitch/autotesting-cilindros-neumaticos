// Nodo function de Node-RED: «ESTADISTICA» (id d31f9e0f5da11a44)
// Extraído de flows_corregido.json


let ciclos = flow.get("ciclos") || [];

if (ciclos.length === 0) {
    return null;
}

const variables = ["AP", "AN", "BP", "BN", "CP", "CN", "caudal"];

let texto = "";

texto += "ESTADISTICAS - " + ciclos.length + " CICLOS\n";
texto += "================================\n";

for (let variable of variables) {

    let valores = ciclos
        .map(c => Number(c[variable]))
        .filter(v => Number.isFinite(v));

    if (valores.length === 0) {
        continue;
    }

    let n = valores.length;

    let media = valores.reduce(
        (suma, valor) => suma + valor, 0
    ) / n;

    let minimo = Math.min(...valores);
    let maximo = Math.max(...valores);

    let sumaCuadrados = valores.reduce(
        (suma, valor) => suma + Math.pow(valor - media, 2),
        0
    );

    let desviacion = n > 1
        ? Math.sqrt(sumaCuadrados / (n - 1))
        : 0;

    texto += variable +
        " | MUESTRAS: " + n +
        " | MEDIA: " + media.toFixed(4) +
        " | MIN: " + minimo.toFixed(4) +
        " | MAX: " + maximo.toFixed(4) +
        " | DESV: " + desviacion.toFixed(4) +
        "\n";
}

texto += "================================";

msg.payload = texto;

return msg;

