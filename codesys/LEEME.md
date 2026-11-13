# Proyecto CODESYS

`PROV9.project`: proyecto de CODESYS V3.5 SP9 Patch 1 (soft-PLC CODESYS Control Win V3, tarea MainTask de 20 ms).

| POU | Función |
|---|---|
| `PLC_PRG` | Llamada de los programas (Diagrama de Contactos) |
| `VARIABLES`, `EA`, `EM` | Secuencia A+ B+ B− A− C+ C− por estados, entradas y salidas |
| `M_TIEMPOS` | Mide el tiempo de cada movimiento (bobina → sensor de destino) con TON |
| `SENSOR_P` | Presión: `PRESION := PRESION_V * 10.0 / 32768.0` (0 a 10 bar) |
| `SENSOR_C` | Caudal: `CAUDAL := CAUDAL_V * 100.0 / 32768.0` (0 a 100 L/min) y promedio del ciclo con una muestra cada 100 ms |
| `SENSORES` | Pasa los tiempos a ms (`TIME_TO_WORD`), divide los REAL en dos palabras y publica `CICLO_ACTUAL` y `FIN_CICLO` |

El servidor Modbus TCP (puerto 502) expone 12 registros de entrada (0 a 11), leídos por Node-RED con la función 04. El mapa completo está en la Tabla F2 de los anexos.
