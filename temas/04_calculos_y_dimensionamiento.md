# 4. Cálculos y dimensionamiento

## Modelo simulado (FluidSIM)
- A y B: doble efecto, Ø20/8 mm, carrera 100 mm. C: simple efecto con resorte, Ø20/8 mm, carrera 50 mm. Presión 8 bar.
- Fuerza de avance: F = 8·10⁵ · π · 0,020² / 4 ≈ **251 N**; retroceso ≈ 211 N.
- Volumen A y B: Vc ≈ 0,0578 L por ciclo → Q ≈ 5,14 L/min cada uno (10 ciclos/min, relación de presiones 8,90).
- C: Vc = π · 0,050 · 0,020² / 4 ≈ 0,0157 L → Q ≈ 1,40 L/min.
- **Total teórico:** ≈ 11,7 L/min de aire libre (1,17 L/ciclo); al ritmo real (≈ 8 ciclos/min) ≈ 9,6 L/min.

### Reconciliación del caudal (13,1 → 11,7 vs. 3,348 L/min)
1. **Escala:** el caudalímetro de FluidSIM está configurado 0–1000 L/min (0–10 V), pero `SENSOR_C` en CODESYS usa `CAUDAL_V * 100 / 32768`. El valor registrado es **la décima parte** del simulado (≈ 33,5 L/min). Corrección: factor 1000 y referencia ×10 en «Z-Score». La puntuación Z **no cambia**.
2. **Frecuencia real:** ciclo de ≈ 7,3 s (≈ 8,2 ciclos/min).
3. **Ventana de promedio:** `SENSOR_C` promedia ≈ 4,3 s (sin la pausa de 3 s) → esperado ≈ 16,3 L/min.
4. **Volúmenes muertos** de mangueras y válvulas (FluidSIM los simula; la ecuación 3 no): probablemente explican que el simulado sea ≈ el doble del esperado. No verificado.

## Máquina de referencia (hipotética, base del análisis económico)
- Cargas supuestas con factor de seguridad 2: A 300 N, B 1600 N, C 100 N.
- Selección ISO 15552 a 8 bar y eficiencia 90 %: A y C Ø32 mm, B Ø63 mm (Ø50 no cumple: 1414 N útiles).
- Consumo medio ≈ 79,3 L/min; **pico ≈ 333 L/min** (avance de B); con fuga de 1,6 mm ≈ 461 L/min.

| Serie | D (mm) | d (mm) | F avance (N) | F retroceso (N) | Vc (L/ciclo) | Q (L/min) |
|---|---|---|---|---|---|---|
| ISO 15552 | 32 | 12 | 643 | 553 | 0,15 | 13,31 |
| ISO 15552 | 40 | 16 | 1005 | 844 | 0,23 | 20,57 |
| ISO 15552 | 50 | 20 | 1571 | 1319 | 0,36 | 32,14 |
| ISO 15552 | 63 | 20 | 2494 | 2242 | 0,59 | 52,68 |

## Selección de sensores (máquina de referencia)
- La línea trabaja de 8 a 10 bar → los sensores deben soportar **más de 10 bar**.
- **Caudal:** medidor de aire comprimido 0,2–75 m³/h (≈ 3–1250 L/min), 16 bar, 4-20 mA escalado a 0–500 L/min (tipo ifm SD6000). Se descartó el SMC PFMB7501 (5–500 L/min) porque su rango nominal llega solo a 0,8 MPa, y uno de 2–100 L/min se saturaría ante la fuga.
- **Presión:** transmisor 0–16 bar, 4-20 mA (tipo WIKA A-10), para leer también sobrepresiones.
