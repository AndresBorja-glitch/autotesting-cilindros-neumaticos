# Simulación de un sistema de autotesting para cilindros neumáticos basado en IoT

Trabajo final del **Diplomado en Automatización Industrial**, Universidad Uniagustiniana, Facultad de Ingeniería, Bogotá, 2026.

**Autores:** Jorge Andrés Borja Castro y Cristian David Londoño Gómez
**Asesor:** Daniel Felipe Peñarete Moreno
**Video:** https://youtu.be/GWYC5u2iOjM

Sistema simulado que diagnostica los tres cilindros neumáticos de una máquina de estampado de cajas. Compara cada ciclo con una línea base mediante la **puntuación Z** para detectar obstrucciones y fugas.

```
FluidSIM 6.1  --OPC DA-->  CODESYS V3.5 SP9 (soft-PLC)  --Modbus TCP-->  Node-RED (diagnóstico, Dashboard y CSV)
```

> Es una prueba de concepto **simulada** (modelo digital), no un gemelo digital: no hay sincronización con una planta física.

## 📄 Documento
- [`documento/Proyecto_Borja_Londoño.pdf`](documento/Proyecto_Borja_Londoño.pdf): versión final (50 páginas, con anexos). También en `.docx`.

## 📚 Temas explicados
| # | Tema |
|---|---|
| 1 | [Problema, pregunta y objetivos](temas/01_problema_y_objetivos.md) |
| 2 | [Marco teórico: cilindros, fallas y puntuación Z](temas/02_marco_teorico.md) |
| 3 | [Arquitectura, OPC, Modbus y elección de CODESYS](temas/03_arquitectura_y_comunicacion.md) |
| 4 | [Cálculos, dimensionamiento y selección de sensores](temas/04_calculos_y_dimensionamiento.md) |
| 5 | [Detección, validación y simulación Monte Carlo](temas/05_deteccion_y_validacion.md) |
| 6 | [Trazabilidad e interpretación de los datos (CSV)](temas/06_trazabilidad_y_datos.md) |
| 7 | [Análisis económico](temas/07_analisis_economico.md) |
| 8 | [Normas aplicadas (ISO, IEC, RETIE)](temas/08_normas.md) |
| 9 | [Conclusiones y trabajo futuro](temas/09_conclusiones_y_trabajo_futuro.md) |
| 10 | [Glosario](temas/10_glosario.md) |

## 🗂️ Contenido del repositorio
| Carpeta | Qué contiene |
|---|---|
| `documento/` | Documento final en PDF y Word |
| `temas/` | Explicación de cada tema de la tesis |
| `fluidsim/` | `PROYECTO_V1.prj`: circuito electroneumático (ver [LEEME](fluidsim/LEEME.md)) |
| `codesys/` | `PROV9.project`: programa del soft-PLC (ver [LEEME](codesys/LEEME.md)) |
| `node-red/` | `flows_corregido.json` (flujo final) y `funciones/` con el código de cada nodo |
| `simulacion-montecarlo/` | Evaluación del detector con el mismo código de Node-RED |
| `datos/` | Línea base, matriz de confusión y formato de `registro_pruebas.csv` |
| `figuras/` | Figuras del documento en tamaño original |

## ▶️ Cómo reproducir
1. **FluidSIM 6.1:** abrir `fluidsim/PROYECTO_V1.prj`.
2. **CODESYS V3.5 SP9 Patch 1:** abrir `codesys/PROV9.project`, iniciar el soft-PLC (CODESYS Control Win V3) y descargar el programa.
3. **Node-RED:** instalar `node-red-contrib-modbus` y `@flowfuse/node-red-dashboard`, importar `node-red/flows_corregido.json`, cambiar la IP Modbus (`10.20.64.7`) por la del equipo con CODESYS (puerto 502) y crear la carpeta `C:\NodeRED\`.
4. Iniciar la simulación en FluidSIM y pulsar START: el Dashboard muestra tiempos, z, caudal y presión, y los CSV se llenan ciclo a ciclo.

## 🔎 Regla de detección
- |z| ≥ 3 → **anomalía**; tres anomalías consecutivas en la misma variable → **alarma persistente** (etiqueta interna `FALLA`).
- La presión es indicación visual (normal entre 8 y 10 bar).

## 🎲 Simulación Monte Carlo
```bash
cd simulacion-montecarlo
node simulacion_montecarlo.js ../node-red/flows_corregido.json > resultados.json
python graficar.py
```
| | Alarma persistente | Sin alarma |
|---|---|---|
| Falla inyectada (6000) | VP = 4724 | FN = 1276 |
| Tramo normal (3000) | FP = 0 | VN = 3000 |

Sensibilidad 78,7 % (obstrucciones 93,8 %, fugas 63,6 %) y especificidad 100 %. Son **datos sintéticos**: no reemplazan las pruebas en FluidSIM.

## ⚠️ Notas conocidas
- **Escala del caudal:** el caudalímetro de FluidSIM está configurado de 0 a 1000 L/min, pero `SENSOR_C` escala de 0 a 100. El caudal registrado es la décima parte del simulado. La puntuación Z no cambia. Corrección: factor 1000 en `SENSOR_C` y referencia ×10 en «Z-Score».
- **Pendiente:** ejecutar en FluidSIM el protocolo del Anexo B para obtener la matriz de confusión con datos del modelo.

## Estado
- ✅ Modelo digital de tres capas y verificación funcional con obstrucciones inducidas.
- ✅ Evaluación de la regla de decisión mediante simulación Monte Carlo.
- ⏳ Protocolo de pruebas en FluidSIM (60 inyecciones y 30 tramos normales).
