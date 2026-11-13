# 9. Conclusiones y trabajo futuro

## Logros demostrados
- Modelo digital de tres capas (FluidSIM, CODESYS, Node-RED) enlazadas por OPC DA y Modbus TCP.
- Lógica de autotesting funcionando: la cadena respondió a obstrucciones inducidas (z = 12,10 en A+; alarma persistente con z = 43,03 en B+).
- Simulación Monte Carlo del detector: especificidad 100 %, sensibilidad 78,7 %; supera 95 % solo con desplazamientos ≥ 4,5 s.

## Resultados esperados (no demostrados)
- Desempeño del detector en FluidSIM: pendiente del protocolo del Anexo B.
- Beneficio económico: hipotético y marginal (equilibrio ≈ 5,5 fallas/año).

## Trabajo futuro
1. Ejecutar el protocolo en FluidSIM y obtener la matriz de confusión con `registro_pruebas.csv`.
2. Corregir la escala de `SENSOR_C` (factor 1000) y conciliar el caudal simulado con el teórico.
3. Un caudalímetro por línea para ubicar fugas; línea base móvil; CUSUM/EWMA para fallas incipientes.
4. Validar en un banco físico e instalar en planta conforme al RETIE.
