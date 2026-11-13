# 1. Problema, pregunta y objetivos

## Problema
En una máquina de estampado de cajas con tres cilindros neumáticos (A sujeta, B estampa, C expulsa), las fallas típicas —obstrucciones, fricción, fugas— se descubren tarde, por inspección manual o cuando la máquina se detiene. Las paradas no planificadas pueden representar entre el 5 % y el 20 % de las pérdidas anuales de producción.

## Pregunta de investigación
¿Puede un sistema de autotesting basado en IoT, que compara cada ciclo con una línea base mediante la puntuación Z, detectar obstrucciones y fugas en los cilindros de un modelo digital de la máquina?

## Objetivo general
Simular un sistema de autotesting para los cilindros neumáticos de una máquina de estampado, integrando simulación neumática, control y supervisión IoT.

## Objetivos específicos
1. Analizar el comportamiento de los cilindros en condiciones normales y de falla.
2. Desarrollar la arquitectura de simulación (FluidSIM + CODESYS + Node-RED).
3. Programar la lógica de autotesting y diagnóstico.
4. Evaluar el comportamiento del sistema simulado.

## Alcance (lo que es y lo que no es)
- **Es** una prueba de concepto **simulada**: un *modelo digital* de la máquina.
- **No es** un gemelo digital: según ISO 23247-1 y Kritzinger et al. (2018), un gemelo exige sincronización automática y bidireccional con una planta física, que aquí no existe.
- La máquina de referencia y el análisis económico son **hipotéticos**.
