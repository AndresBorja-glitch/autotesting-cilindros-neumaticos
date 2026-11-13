# Circuito FluidSIM

`PROYECTO_V1.prj`: proyecto de FluidSIM 6.1 con el circuito electroneumático de la máquina.

- Cilindros A y B: doble efecto, émbolo 20 mm, vástago 8 mm, carrera 100 mm.
- Cilindro C: simple efecto con retorno por resorte, émbolo 20 mm, vástago 8 mm, carrera 50 mm.
- Alimentación: 8 bar. Reguladoras de caudal (PVS4) al 100 % de apertura en condición normal.
- Transductor de presión: 0 a 10 bar → 0 a 10 V. Caudalímetro: 0 a 1000 L/min → 0 a 10 V.
- Enlace con CODESYS por OPC DA (`CoDeSys.OPC.DA`): entradas y salidas digitales y las variables `GVL.PRESION_V` y `GVL.CAUDAL_V`.

**Nota sobre la escala del caudal:** `SENSOR_C` en CODESYS usa `CAUDAL_V * 100 / 32768` (0 a 100 L/min), por lo que el caudal registrado es la décima parte del que simula FluidSIM. La puntuación Z no cambia. Para corregirlo, cambiar el factor a 1000 y multiplicar por 10 la referencia del caudal en el nodo «Z-Score» de Node-RED.
