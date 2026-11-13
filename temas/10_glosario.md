# 10. Glosario

- **Alarma persistente:** tres anomalías consecutivas en la misma variable; indica persistencia, no confirma una falla física.
- **Anomalía:** medición con |z| ≥ 3 respecto a la línea base.
- **Autotesting:** autodiagnóstico continuo del equipo con sus propias mediciones.
- **CODESYS:** entorno IEC 61131-3 con soft-PLC (CODESYS Control Win V3).
- **CSV:** archivo de texto separado por comas que guarda un registro por ciclo.
- **Especificidad:** VN / (VN + FP); proporción de ciclos normales sin alarma.
- **FluidSIM:** software de Festo para simular circuitos neumáticos y eléctricos.
- **Gemelo digital:** réplica sincronizada en ambos sentidos con un sistema físico (ISO 23247). Este proyecto **no** lo es.
- **Línea base:** 25 ciclos normales que fijan μ y s.
- **Modbus TCP:** protocolo industrial cliente-servidor sobre Ethernet.
- **Modelo digital:** representación digital sin intercambio automático con la planta.
- **Node-RED:** herramienta de flujos para IoT; aquí calcula z, alarmas, Dashboard y CSV.
- **OPC DA:** estándar de intercambio de datos entre aplicaciones industriales en Windows.
- **Puntuación Z:** z = (x − μ) / s.
- **Sensibilidad:** VP / (VP + FN); proporción de fallas detectadas.
- **Sombra digital:** modelo que recibe datos automáticos de la planta en un solo sentido.
- **Soft-PLC:** PLC que se ejecuta como software en un computador.
- **VP, FN, FP, VN:** verdaderos positivos, falsos negativos, falsos positivos, verdaderos negativos.
