// Nodo function de Node-RED: «function 2» (id c193a0e46d62049a)
// Extraído de flows_corregido.json

let word0 = msg.payload[0];
let word1 = msg.payload[1];

let buffer = Buffer.alloc(4);

buffer.writeUInt16LE(word0, 0);
buffer.writeUInt16LE(word1, 2);

let presion = Number(buffer.readFloatLE(0).toFixed(2));

msg.payload = presion;

return msg;
