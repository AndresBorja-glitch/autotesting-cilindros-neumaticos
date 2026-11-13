# 6. Trazabilidad e interpretación de los datos

El hilo conductor es el **número de ciclo** (`CICLO_ACTUAL`) más la fecha de Node-RED.

| Etapa | Forma del dato | Transformación |
|---|---|---|
| 1. FluidSIM | Bits de sensores; REAL crudos de presión y caudal | OPC DA al soft-PLC |
| 2. CODESYS | TIME por movimiento, bar, L/min, CICLO_ACTUAL | M_TIEMPOS (bobina → sensor), escalado, promedio cada 100 ms |
| 3. Modbus TCP | Registros de 16 bits | TIME_TO_WORD a ms; FC 04 registros 0–11 |
| 4. Node-RED lectura | Números | Little-endian; descarte fuera de 0–65 535 y ciclos incompletos |
| 5. Node-RED diagnóstico | 7 z + estados | Ecuación (8), |z| ≥ 3, contador de consecutivas |
| 6. CSV | Una fila por ciclo | 3 archivos |

## Archivos CSV (carpeta `C:\NodeRED`)
| Archivo | Contenido |
|---|---|
| `historico_ciclos.csv` | ciclo, 6 tiempos, caudal, fecha |
| `zscore_ciclos.csv` | 6 z de los tiempos (sin número de ciclo → no permite reconstruir decisiones) |
| `registro_pruebas.csv` | 24 columnas: fecha, ciclo, 7 valores, 7 z, 7 estados, estado_general |

Formato: `../datos/formato_registro_pruebas.csv`. Para la matriz de confusión se agrega una columna con la condición real (normal / obstrucción / fuga) y se compara con `estado_general`.

## Cómo leer los datos
| Patrón | Interpretación probable | Acción |
|---|---|---|
| Todas |z| < 3, presión 8–10 bar | Normal | Ninguna |
| Una variable |z| ≥ 3 en un ciclo | Anomalía aislada (≈ 2 % por azar) | Observar |
| z ≥ 3 en el mismo tiempo 3 ciclos | Obstrucción, fricción o falta de lubricación | Revisar reguladora, cilindro y válvula |
| z ≤ −3 en un tiempo | Movimiento más rápido | Revisar ajuste de la reguladora |
| z del caudal ≥ 3 sostenido, tiempos normales | Fuga | Buscarla (un caudalímetro no la ubica) |
| Varios tiempos altos a la vez | Problema común (presión baja) | Revisar compresor y unidad de mantenimiento |
| Presión fuera de 8–10 bar | Suministro anormal | Corregir antes de interpretar |
