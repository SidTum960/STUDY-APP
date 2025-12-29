# Planificador Académico Inteligente

Sistema web de planificación académica basado en algoritmos deterministas de priorización para estudiantes universitarios.

## 🎯 Características

- **Gestión de Materias**: Administra tus cursos con créditos, dificultad percibida y horarios de clase
- **Evaluaciones**: Registra exámenes, quizzes y proyectos con fechas específicas
- **Generación Automática de Horarios**: Algoritmo determinista que genera horarios diarios óptimos
- **Sistema de Priorización Multi-factor**: Basado en créditos, dificultad, evaluaciones, proximidad temporal y estado de clase
- **Días Especiales**: Configura días de ocio, trabajo limitado o días negros
- **Vistas Múltiples**: Visualiza tu horario diario o semanal con bloques codificados por colores

## 🏗️ Arquitectura

### Stack Tecnológico

**Frontend:**
- React 18
- React Router DOM
- Axios
- CSS personalizado

**Backend:**
- Node.js
- Express
- MongoDB con Mongoose
- CORS

### Estructura del Proyecto

```
STUDY-APP/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── materiaController.js
│   │   │   ├── horarioController.js
│   │   │   ├── diaEspecialController.js
│   │   │   └── userController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Materia.js
│   │   │   ├── DiaEspecial.js
│   │   │   └── HorarioDiario.js
│   │   ├── routes/
│   │   │   ├── materias.js
│   │   │   ├── horarios.js
│   │   │   ├── dias-especiales.js
│   │   │   └── user.js
│   │   ├── utils/
│   │   │   ├── priorityCalculator.js
│   │   │   └── scheduleGenerator.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navigation.js
    │   │   └── BloqueHorario.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Materias.js
    │   │   ├── HorarioDiario.js
    │   │   ├── VistaSemanal.js
    │   │   └── Configuracion.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js 18+ y npm
- MongoDB instalado y ejecutándose

### Instalación del Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Edita `.env` con tu configuración:

```
MONGODB_URI=mongodb://localhost:27017/planificador-academico
PORT=5000
```

Inicia el servidor:

```bash
npm start
# o para desarrollo con auto-reload
npm run dev
```

El backend estará disponible en `http://localhost:5000`

### Instalación del Frontend

```bash
cd frontend
npm install
```

Inicia la aplicación:

```bash
npm start
```

El frontend estará disponible en `http://localhost:3000`

## 📊 Modelos de Datos

### Usuario
- `horas_sueno`: Horas de sueño requeridas (default: 8)
- `configuracion_excepciones`: Objeto con configuraciones adicionales

### Materia
- `nombre`: Nombre de la materia
- `creditos`: Número de créditos (1-6)
- `dificultad_percibida`: Escala 0-3
- `estado_clase`: 'clase_pendiente' | 'clase_vista'
- `fecha_ultima_clase`: Fecha de la última clase vista
- `horarios_clase`: Array de horarios semanales
- `evaluaciones`: Array de evaluaciones

### Evaluación
- `tipo`: 'examen' | 'quiz' | 'proyecto_largo'
- `fecha`: Fecha de la evaluación
- `activa`: Boolean
- `multiplicador`: Factor numérico (3.0 para examen, 2.0 para quiz, 1.5 para proyecto)

### DiaEspecial
- `fecha`: Fecha del día especial
- `tipo`: 'ocio_total' | 'trabajo_limitado' | 'dia_negro'
- `reglas`: Objeto con reglas específicas

### HorarioDiario
- `fecha`: Fecha del horario
- `bloques`: Array de bloques horarios
- `resumen`: Estadísticas del día

### BloqueHorario
- `hora_inicio`: String "HH:MM"
- `hora_fin`: String "HH:MM"
- `tipo`: 'sueño' | 'clase' | 'hora_blanca' | 'estudio_blanco' | 'estudio_gris' | 'libre' | 'habito' | 'negro'
- `materia`: Referencia a Materia
- `materia_nombre`: String
- `prioridad_asignada`: Número
- `regla_aplicada`: String descriptivo

## 🧮 Algoritmo de Priorización

### Fórmula de Prioridad Final

```
prioridad_final = prioridad_base × dificultad × evaluacion × proximidad × estado_clase × refuerzo_post_clase
```

### Componentes

**1. Prioridad Base**
```
prioridad_base = creditos / suma_total_creditos
```

**2. Dificultad Percibida**
```
f(d) = e^((1/5) × ln(3) × d)
```
Donde d ∈ [0, 3]

**3. Estado de Clase**
- `clase_pendiente`: 0.3
- `clase_vista`: 1.0

**4. Multiplicador de Evaluación**
- Examen: 3.0×
- Quiz: 2.0×
- Proyecto Largo: 1.5×

**5. Función de Proximidad**
- Hoy o mañana: 3.0
- 2-7 días: decaimiento lineal 3.0 → 1.0
- 8-14 días: decaimiento lineal 2.0 → 1.0
- Más de 14 días: 1.0

**6. Refuerzo Post-Clase**
- 0-5 días después de clase: 1.5
- Más de 5 días: 1.0

## 🔄 Algoritmo de Generación de Horarios

### Proceso Diario

1. **Verificar días especiales**
   - Si es día negro: ignorar
   - Si es ocio total: solo sueño y tiempo libre

2. **Bloques fijos**
   - Sueño (basado en configuración de usuario)
   - Clases programadas

3. **Calcular prioridades**
   - Ordenar materias por prioridad_final

4. **Asignar hora blanca (1 hora obligatoria)**
   - Prioridad 1: Evaluación mañana
   - Prioridad 2: Post-clase inmediata
   - Prioridad 3: Mayor prioridad general

5. **Asignar estudio blanco**
   - Alta concentración, bloques de mínimo 1 hora

6. **Asignar estudio gris**
   - Concentración media

7. **Garantizar tiempo libre**
   - Mínimo 1 hora diaria

8. **Asignar hábitos** (opcional)

9. **Marcar tiempo negro**
   - Tiempo no estructurado restante

10. **Actualizar estado de materias**
    - Marcar clases como vistas
    - Actualizar fecha_ultima_clase

## 🎨 Tipos de Bloques y Colores

- 🔵 **Sueño**: Tiempo de descanso fijo
- 🟠 **Clase**: Clases programadas
- 🟣 **Hora Blanca**: 1 hora obligatoria de alta prioridad
- 🟢 **Estudio Blanco**: Bloques de alta concentración
- 🟢 **Estudio Gris**: Bloques de concentración media
- 🟡 **Libre**: Tiempo libre garantizado (mínimo 1h)
- 🔵 **Hábito**: Tiempo para hábitos personales
- 🟤 **Negro**: Tiempo no estructurado

## 🌐 API Endpoints

### Materias
- `POST /api/materias` - Crear materia
- `GET /api/materias` - Obtener todas las materias
- `GET /api/materias/:id` - Obtener una materia
- `PUT /api/materias/:id` - Actualizar materia
- `DELETE /api/materias/:id` - Eliminar materia
- `POST /api/materias/:id/evaluaciones` - Agregar evaluación

### Días Especiales
- `POST /api/dias-especiales` - Crear día especial
- `GET /api/dias-especiales` - Obtener días especiales
- `GET /api/dias-especiales/:id` - Obtener un día especial
- `PUT /api/dias-especiales/:id` - Actualizar día especial
- `DELETE /api/dias-especiales/:id` - Eliminar día especial

### Horarios
- `POST /api/generar-horario/:fecha` - Generar horario para una fecha
- `GET /api/horario/:fecha` - Obtener horario de una fecha
- `GET /api/horarios?fechaInicio=...&fechaFin=...` - Obtener rango de horarios

### Usuario
- `POST /api/user` - Configurar usuario
- `GET /api/user` - Obtener configuración de usuario

### Health Check
- `GET /api/health` - Verificar estado del servidor

## 📝 Reglas y Restricciones

### Temporales
- 1 crédito = 2 horas de clase semanal + 1 hora de estudio semanal
- Cada clase genera 1 hora de estudio obligatoria en los siguientes 5 días

### Restricciones del Sistema
- ❌ No implementa lógica de fatiga
- ❌ No suaviza carga automáticamente
- ❌ No introduce heurísticas humanas
- ❌ No permite modificación manual de prioridades
- ✅ Sistema completamente determinista
- ✅ Basado exclusivamente en reglas formales

## 🧪 Uso de la Aplicación

### Flujo de Trabajo Recomendado

1. **Configuración Inicial**
   - Ir a "Configuración"
   - Establecer horas de sueño
   - Agregar días especiales si aplica

2. **Agregar Materias**
   - Ir a "Materias"
   - Crear cada materia con sus créditos y dificultad
   - Agregar evaluaciones programadas

3. **Generar Horario**
   - Ir a "Horario Diario"
   - Seleccionar fecha
   - Hacer clic en "Generar Horario"
   - Revisar los bloques generados con sus prioridades

4. **Vista Semanal**
   - Ir a "Vista Semanal"
   - Seleccionar inicio de semana
   - Ver resumen de todos los días

## 🔧 Desarrollo

### Agregar Nueva Funcionalidad

El sistema está diseñado para ser extensible. Para agregar funcionalidad:

1. **Backend**: Agregar modelo, controlador y ruta
2. **Frontend**: Agregar servicio API y componente/página
3. **Algoritmo**: Modificar priorityCalculator.js o scheduleGenerator.js

### Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📄 Licencia

MIT

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir cambios mayores.

## 📧 Soporte

Para preguntas o problemas, abre un issue en el repositorio de GitHub.