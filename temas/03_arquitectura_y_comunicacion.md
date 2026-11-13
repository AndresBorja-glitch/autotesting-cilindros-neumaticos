# 3. Arquitectura y comunicación

```
FluidSIM 6.1  ──OPC DA──>  CODESYS V3.5 SP9 (soft-PLC)  ──Modbus TCP (FC 04)──>  Node-RED + Dashboard 2.0
 circuito y sensores        secuencia, tiempos, caudal          puntuación Z, alarmas, CSV
```
Ver `../figuras/figura1_arquitectura.png`.

## ¿Por qué CODESYS? (matriz multicriterio, Tabla 3 del documento)
| Criterio | Peso | CODESYS | TIA Portal | Studio 5000 | OpenPLC |
|---|---|---|---|---|---|
| Costo y licencias | 25 % | 5 | 2 | 1 | 5 |
| IEC 61131-3 y paso a PLC físico | 25 % | 5 | 3 | 3 | 4 |
| Comunicaciones (Modbus, OPC) | 20 % | 5 | 4 | 3 | 4 |
| Simulación sin hardware | 15 % | 5 | 3 | 3 | 4 |
| Soporte y mantenimiento | 15 % | 4 | 5 | 5 | 2 |
| **Total** | 100 % | **4,85** | 3,25 | 2,80 | 3,95 |

## OPC DA (FluidSIM ↔ CODESYS)
| Ítem | Sentido | Contenido |
|---|---|---|
| IN0 bits 0–7 | FluidSIM → CODESYS | START, STOP, AN, AP, BN, BP, CN, CP |
| IN1 bits 0–1 | FluidSIM → CODESYS | START_A, SP |
| PRESION_V, CAUDAL_V | FluidSIM → CODESYS | Valores crudos 0–32 768 |
| OUT0 bits 0–6 | CODESYS → FluidSIM | MAP, MAN, MBP, MBN, MCP, LEDV, LEDA |

## Modbus TCP (CODESYS → Node-RED)
| Registro | Variable | Contenido |
|---|---|---|
| 0 | COMANDO | 456 fijo (verifica enlace) |
| 1–6 | TIEMPO_AP … TIEMPO_CN | Tiempos de A+, A−, B+, B−, C+, C− en ms |
| 7 | CICLO_ACTUAL | Número de ciclo |
| 8–9 | Presión | REAL en dos palabras |
| 10–11 | Caudal promedio | REAL en dos palabras |

Node-RED reconstruye cada REAL en orden little-endian y descarta palabras fuera de 0–65 535.

## Sincronización
El ciclo *k* termina cuando CN confirma el retorno de C (FIN_CICLO). Como caudal y tiempos se leen en consultas distintas, el caudal puede quedar asignado al ciclo anterior. Solución: leer los 12 registros en una sola consulta o comprobar que CICLO_ACTUAL sea el mismo antes de unir los datos.

## Paso a un PLC físico (hipotético)
Si el PLC admite el runtime de CODESYS: cambiar el dispositivo de destino, asignar la GVL a las E/S físicas y escalar 4-20 mA. Si es otra familia (p. ej. S7-1200): reprogramar (contactos casi directos, ST → SCL, Modbus con MB_SERVER). La parada de emergencia y la descarga de presión nunca dependen del programa (ISO 4414).
