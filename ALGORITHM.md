# Planificador Académico - Documentación del Algoritmo

## Introducción

Este documento describe en detalle el algoritmo de priorización y generación de horarios implementado en el Planificador Académico Inteligente.

## Modelo Matemático de Priorización

### 1. Prioridad Base

La prioridad base se calcula como la proporción de créditos de una materia respecto al total:

```
prioridad_base = creditos_materia / suma_total_creditos
```

**Ejemplo:**
- Materia A: 4 créditos
- Materia B: 3 créditos
- Materia C: 2 créditos
- Total: 9 créditos

```
prioridad_base_A = 4/9 = 0.444
prioridad_base_B = 3/9 = 0.333
prioridad_base_C = 2/9 = 0.222
```

### 2. Factor de Dificultad

La dificultad percibida se modela mediante una función exponencial:

```
f(d) = e^((1/5) * ln(3) * d)
```

Donde:
- `d` es la dificultad percibida (0 a 3)
- `e` es el número de Euler
- `ln` es el logaritmo natural

**Valores de referencia:**
- d = 0: f(0) = 1.0
- d = 1: f(1) ≈ 1.246
- d = 2: f(2) ≈ 1.552
- d = 3: f(3) = 3.0

Esta función garantiza que:
- Una materia con dificultad 0 no altera la prioridad (multiplicador 1.0)
- Una materia con dificultad 3 triplica su prioridad (multiplicador 3.0)
- El crecimiento es suave y exponencial

### 3. Estado de Clase

El estado de clase afecta la prioridad según si se ha visto la clase:

```
estado_clase = {
  0.3  si clase_pendiente (no vista)
  1.0  si clase_vista
}
```

**Justificación:**
- Las materias con clases vistas tienen mayor prioridad (1.0) porque requieren estudio de refuerzo
- Las materias con clases pendientes tienen menor prioridad (0.3) hasta que se vea la clase

### 4. Multiplicador de Evaluación

El multiplicador considera tanto el tipo de evaluación como su proximidad temporal.

#### 4.1 Multiplicadores por Tipo

```
tipo_multiplicador = {
  examen: 3.0
  quiz: 2.0
  proyecto_largo: 1.5
}
```

#### 4.2 Función de Proximidad

La proximidad temporal se calcula según los días hasta la evaluación:

```
proximidad(dias) = {
  3.0                              si dias <= 1
  3.0 - ((dias - 1) / 6) * 2.0    si 2 <= dias <= 7
  2.0 - ((dias - 8) / 6) * 1.0    si 8 <= dias <= 14
  1.0                              si dias > 14
}
```

**Gráfica de proximidad:**
```
  3.0 |████
      |████
  2.5 |████▓▓▓▓
      |████▓▓▓▓
  2.0 |████▓▓▓▓▒▒▒▒
      |████▓▓▓▓▒▒▒▒
  1.5 |████▓▓▓▓▒▒▒▒
      |████▓▓▓▓▒▒▒▒░░░░░░░░░░░░
  1.0 |████▓▓▓▓▒▒▒▒░░░░░░░░░░░░░░░░░░░░
      +--------------------------------
        0  2  4  6  8 10 12 14 16 18 20
                    días
```

**Multiplicador Final de Evaluación:**
```
multiplicador_eval = tipo_multiplicador * proximidad(dias)
```

### 5. Refuerzo Post-Clase

Cada clase genera una obligación de estudio en los siguientes 5 días:

```
refuerzo_post_clase = {
  1.5  si 0 <= dias_desde_clase <= 5
  1.0  si dias_desde_clase > 5
}
```

### 6. Prioridad Final

La fórmula completa que combina todos los factores:

```
prioridad_final = prioridad_base 
                * f(dificultad) 
                * multiplicador_eval 
                * estado_clase 
                * refuerzo_post_clase
```

## Algoritmo de Generación de Horarios

### Proceso Paso a Paso

#### Paso 1: Verificación de Día Especial

```
if (dia_es_negro):
    return horario_vacio
    
if (dia_es_ocio_total):
    return horario_con_solo_sueño_y_libre
```

#### Paso 2: Bloques Fijos

1. **Sueño**: Se calculan dos bloques
   ```
   hora_despertar = 06:00 (configurable)
   horas_sueno = configuracion.horas_sueno (default: 8)
   hora_dormir = 24:00 - (horas_sueno - hora_despertar)
   
   bloque_1: 00:00 - hora_despertar
   bloque_2: hora_dormir - 24:00
   ```

2. **Clases**: Se agregan todas las clases programadas para el día de la semana

#### Paso 3: Cálculo de Prioridades

```
para cada materia:
    calcular prioridad_final usando la fórmula completa
    
ordenar materias por prioridad_final (descendente)
```

#### Paso 4: Bloques Disponibles

Crear lista de espacios de tiempo no ocupados por sueño o clases:

```
bloques_disponibles = []
ultimo_fin = 00:00

para cada bloque_ocupado ordenado por hora_inicio:
    si bloque_ocupado.inicio > ultimo_fin:
        agregar (ultimo_fin, bloque_ocupado.inicio) a bloques_disponibles
    ultimo_fin = max(ultimo_fin, bloque_ocupado.fin)
    
si ultimo_fin < 24:00:
    agregar (ultimo_fin, 24:00) a bloques_disponibles
```

#### Paso 5: Hora Blanca (1 hora obligatoria)

Reglas en orden de prioridad:

1. **Evaluación mañana**: Si alguna materia tiene evaluación al día siguiente
   ```
   para cada materia con evaluacion_mañana:
       buscar primer bloque_disponible >= 60 minutos
       asignar hora_blanca
       return
   ```

2. **Post-clase inmediata**: Justo después de una clase del día
   ```
   para cada clase_del_dia:
       buscar bloque_disponible que inicie en clase.hora_fin
       si bloque >= 60 minutos:
           asignar hora_blanca
           return
   ```

3. **Mayor prioridad**: Materia con prioridad_final más alta
   ```
   materia_top = materias_ordenadas[0]
   buscar primer bloque_disponible >= 60 minutos
   asignar hora_blanca
   ```

#### Paso 6: Estudio Blanco

Asignar bloques de estudio de alta concentración:

```
para cada materia en materias_ordenadas:
    para cada bloque_disponible:
        si bloque.duracion >= 60 minutos:
            duracion_asignada = min(bloque.duracion, 120)  // max 2 horas
            crear bloque_estudio_blanco
            actualizar bloque_disponible
            siguiente_materia
```

#### Paso 7: Estudio Gris

Similar al estudio blanco pero con menor prioridad:

```
// Mismo proceso que estudio blanco
// pero se asigna después y con tipo 'estudio_gris'
```

#### Paso 8: Tiempo Libre (1 hora mínima garantizada)

```
tiempo_libre_total = suma(duraciones de bloques_disponibles)

si tiempo_libre_total >= 60:
    buscar bloque_disponible >= 60 minutos
    asignar min(60, bloque.duracion) como tiempo_libre
```

#### Paso 9: Tiempo Negro

Todo el tiempo restante se marca como tiempo negro:

```
para cada bloque_disponible:
    si bloque.duracion >= 15 minutos:
        crear bloque_negro
```

#### Paso 10: Actualización de Estados

Al finalizar el día, actualizar las materias que tuvieron clase:

```
para cada bloque de tipo 'clase':
    materia.estado_clase = 'clase_vista'
    materia.fecha_ultima_clase = fecha_actual
    guardar materia
```

### Validaciones

El sistema valida:
- Mínimo 1 hora blanca diaria
- Mínimo 1 hora libre diaria
- No solapamiento de bloques
- Bloques ordenados cronológicamente
- Cumplimiento de horas de sueño configuradas

## Tipos de Bloques

| Tipo | Color | Descripción | Prioridad |
|------|-------|-------------|-----------|
| Sueño | Azul | Tiempo de descanso fijo | No modificable |
| Clase | Naranja | Clases programadas | Fijo por horario |
| Hora Blanca | Morado | 1 hora obligatoria de máxima prioridad | Muy Alta |
| Estudio Blanco | Verde oscuro | Bloques de alta concentración | Alta |
| Estudio Gris | Verde claro | Bloques de concentración media | Media |
| Libre | Amarillo | Tiempo libre garantizado | Fijo (1h mínimo) |
| Hábito | Cian | Tiempo para hábitos personales | Opcional |
| Negro | Café | Tiempo no estructurado | Relleno |

## Restricciones del Sistema

### Restricciones Duras (No Violables)

1. Los bloques no pueden solaparse
2. El sueño debe respetar las horas configuradas
3. Las clases deben respetarse según el horario
4. Debe haber al menos 1 hora blanca al día
5. Debe haber al menos 1 hora libre al día

### Restricciones Suaves (Preferencias)

1. Los bloques de estudio deberían ser de al menos 1 hora
2. Los bloques de estudio no deberían exceder 2 horas
3. El estudio post-clase debería ser inmediato cuando sea posible
4. Las evaluaciones cercanas deben priorizarse

## Ejemplos de Cálculo

### Ejemplo 1: Materia sin evaluaciones próximas

**Datos:**
- Créditos: 3
- Total créditos: 10
- Dificultad: 1.5
- Estado: clase_vista
- Sin evaluaciones próximas
- Clase vista hace 2 días

**Cálculo:**
```
prioridad_base = 3/10 = 0.3
dificultad = e^((1/5) * ln(3) * 1.5) ≈ 1.385
evaluacion = 1.0 (sin evaluaciones)
estado_clase = 1.0 (clase vista)
refuerzo_post_clase = 1.5 (dentro de 5 días)

prioridad_final = 0.3 * 1.385 * 1.0 * 1.0 * 1.5
                ≈ 0.623
```

### Ejemplo 2: Materia con examen mañana

**Datos:**
- Créditos: 4
- Total créditos: 10
- Dificultad: 2.0
- Estado: clase_vista
- Examen mañana
- Clase vista hace 1 día

**Cálculo:**
```
prioridad_base = 4/10 = 0.4
dificultad = e^((1/5) * ln(3) * 2.0) ≈ 1.552
evaluacion = 3.0 (examen) * 3.0 (mañana) = 9.0
estado_clase = 1.0 (clase vista)
refuerzo_post_clase = 1.5 (dentro de 5 días)

prioridad_final = 0.4 * 1.552 * 9.0 * 1.0 * 1.5
                ≈ 8.38
```

Esta materia tiene aproximadamente 13 veces más prioridad que la del Ejemplo 1.

## Conclusión

El algoritmo es completamente determinista y no introduce aleatoriedad ni heurísticas no especificadas. Cada decisión está basada en reglas matemáticas claras y reproducibles.
