# 2. Marco teórico

## Cilindros neumáticos
| Ecuación | Fórmula |
|---|---|
| (1) Fuerza de avance | F = P · π · D² / 4 |
| (2) Fuerza de retroceso | F = P · π · (D² − d²) / 4 |
| (3) Volumen por ciclo (doble efecto) | Vc = (π · L / 4) · [D² + (D² − d²)] |
| (4) Consumo de aire libre | Q = Vc · n · (P + Patm) / Patm |
| (9) Caudal pico | Qpico = A · v · (P + Patm) / Patm |

P: presión manométrica; D: émbolo; d: vástago; L: carrera; n: ciclos/min; A: área del émbolo; v: velocidad.

**Caudal medio vs. caudal pico:** el aire solo se consume mientras un cilindro se mueve. Válvulas, mangueras y sensores se dimensionan con el **caudal pico**, no con el medio.

## Fallas y mantenimiento
- MTBF = tiempo total de operación / número de fallas (5).
- Obstrucción o fricción → el movimiento **tarda más**.
- Fuga → **sube el caudal** y puede bajar la presión (una fuga de 1,6 mm produce una caída cercana al 10 %).

## Puntuación Z (carta de Shewhart de individuales)
- Media: μ = (1/n) Σ xᵢ (6)
- Desviación estándar muestral: s = √[Σ (xᵢ − μ)² / (n − 1)] (7)
- Puntuación Z de un ciclo: z = (x − μ) / s (8)

Si |z| ≥ 3 la medición está fuera de lo normal: por azar, eso ocurre en ≈ 0,27 % de los casos para una variable normal.

### ¿Por qué la puntuación Z y no otra técnica?
| Técnica | Ventaja | Limitación |
|---|---|---|
| Umbral fijo | Muy sencilla | El umbral cambia con la carga, presión y tamaño |
| **Puntuación Z (elegida)** | Línea base corta (25 ciclos), interpretable, detecta cambios grandes y abruptos | Poco sensible a fallas incipientes; supone estacionariedad |
| CUSUM / EWMA | Detecta desplazamientos pequeños | Más parámetros y ajuste |
| Aprendizaje automático | Patrones complejos | Necesita muchos datos con fallas etiquetadas |

## IoT e Industria 4.0
Arquitectura por capas (ISO/IEC 30141): percepción (sensores en FluidSIM), red (OPC DA y Modbus TCP) y aplicación (Node-RED y Dashboard).
