# 5. Detección de anomalías y validación

## Regla de decisión
- Línea base: 25 ciclos normales a 8 bar, reguladoras al 100 %.
- Para cada ciclo se calcula z en 6 tiempos + caudal.
- |z| ≥ 3 → **anomalía**. Tres anomalías consecutivas en la misma variable → **alarma persistente** (etiqueta interna `FALLA`).
- Una alarma persistente indica **persistencia** de la desviación, no confirma por sí sola una falla física.

## Línea base (Tabla 2 del documento)
| Variable | Movimiento | μ (ms) | s (ms) | μ − 3s | μ + 3s | CV |
|---|---|---|---|---|---|---|
| AP | A+ sujeción | 447,12 | 115,0403 | 102,00 | 792,24 | 25,7 % |
| AN | A− liberación | 621,44 | 35,6149 | 514,60 | 728,28 | 5,7 % |
| BP | B+ estampado | 413,08 | 31,7660 | 317,78 | 508,38 | 7,7 % |
| BN | B− retroceso | 558,92 | 42,7697 | 430,61 | 687,23 | 7,7 % |
| CP | C+ expulsión | 383,08 | 48,2579 | 238,31 | 527,85 | 12,6 % |
| CN | C− resorte | 583,96 | 65,2109 | 388,33 | 779,59 | 11,2 % |
| Caudal | — | 3,3480 L/min* | 0,7094 | 1,22 | 5,48 | 21,2 % |

*Escala registrada (≈ 33,5 L/min simulados).

## Pruebas realizadas (verificación funcional)
- Ciclo 1 normal: todas las |z| < 1,5.
- Ciclo 4: A+ = 1839 ms → z = 12,10 → anomalía (primera, sin alarma).
- Ciclo 8: B+ = 1780 ms → z = (1780 − 413,08) / 31,7660 = **43,03** → alarma persistente.
- Video: https://youtu.be/GWYC5u2iOjM

## Simulación Monte Carlo (datos sintéticos)
Usa el **mismo código** de los nodos «Z-Score» y «DETECCION DE ANOMALIAS». Ver `../simulacion-montecarlo/`.

| | Alarma persistente | Sin alarma | Total |
|---|---|---|---|
| Falla inyectada | VP = 4724 | FN = 1276 | 6000 |
| Tramo normal | FP = 0 | VN = 3000 | 3000 |

- Sensibilidad 78,7 % (IC 95 %: 77,7–79,8 %): obstrucciones 93,8 %, fugas 63,6 %.
- Especificidad 100 %; 1,7 % de los ciclos normales tienen alguna anomalía aislada (8,9 % con colas pesadas t₄), pero casi nunca tres seguidas.
- Detección promedio a los 3,4 ciclos.
- Supera 95 % solo con desplazamientos ≥ 4,5 desviaciones estándar.

## Protocolo pendiente en FluidSIM (Anexo B)
60 inyecciones (30 obstrucciones de 20–80 % y 30 fugas de 0,5–1,6 mm) + 30 tramos normales de 10 ciclos, en orden aleatorio, con variabilidad de presión (7,5–8,5 bar) y de las reguladoras (±10 %). Unos 900 ciclos (≈ 1,8 h).
Justificación del tamaño: con 0 fallos en n pruebas, la cota inferior al 95 % es 0,95 si n ≥ 59 (0,95⁵⁹ ≈ 0,05); para la especificidad se usan 299 ciclos normales.
**500 repeticiones de un caso determinista no aportan información nueva:** hay que sortear condiciones en cada tramo.
