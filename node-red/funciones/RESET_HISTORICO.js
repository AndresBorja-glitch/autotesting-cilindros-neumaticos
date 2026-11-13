// Nodo function de Node-RED: «RESET HISTORICO» (id 4533dd7d0944354c)
// Extraído de flows_corregido.json

flow.set("ciclos", []);
flow.set("ultimoCiclo", undefined);

msg.payload = "Histórico borrado. Node-RED tiene 0 ciclos.";

return msg;
