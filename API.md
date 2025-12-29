# API Documentation - Planificador Académico

## Base URL

```
http://localhost:5000/api
```

## Authentication

Currently, the API does not require authentication. This can be added in future versions.

## Error Handling

All endpoints return errors in the following format:

```json
{
  "error": "Error message description"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

---

## Endpoints

### Health Check

#### GET /api/health

Check if the API is running.

**Response:**
```json
{
  "status": "OK",
  "message": "Planificador Académico API funcionando"
}
```

---

## Materias (Subjects)

### Create Materia

#### POST /api/materias

Create a new subject.

**Request Body:**
```json
{
  "nombre": "Cálculo Diferencial",
  "creditos": 4,
  "dificultad_percibida": 2.5,
  "horarios_clase": [
    {
      "dia_semana": 1,
      "hora_inicio": "08:00",
      "hora_fin": "10:00"
    },
    {
      "dia_semana": 3,
      "hora_inicio": "08:00",
      "hora_fin": "10:00"
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nombre": "Cálculo Diferencial",
  "creditos": 4,
  "dificultad_percibida": 2.5,
  "estado_clase": "clase_pendiente",
  "horarios_clase": [...],
  "evaluaciones": [],
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

### Get All Materias

#### GET /api/materias

Get all subjects.

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "nombre": "Cálculo Diferencial",
    "creditos": 4,
    ...
  }
]
```

### Get Single Materia

#### GET /api/materias/:id

Get a specific subject by ID.

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nombre": "Cálculo Diferencial",
  ...
}
```

### Update Materia

#### PUT /api/materias/:id

Update a subject.

**Request Body:**
```json
{
  "dificultad_percibida": 3.0,
  "estado_clase": "clase_vista"
}
```

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nombre": "Cálculo Diferencial",
  "dificultad_percibida": 3.0,
  "estado_clase": "clase_vista",
  ...
}
```

### Delete Materia

#### DELETE /api/materias/:id

Delete a subject.

**Response:** `200 OK`
```json
{
  "mensaje": "Materia eliminada exitosamente"
}
```

### Add Evaluation to Materia

#### POST /api/materias/:id/evaluaciones

Add an evaluation to a subject.

**Request Body:**
```json
{
  "tipo": "examen",
  "fecha": "2024-02-15",
  "activa": true,
  "multiplicador": 3.0
}
```

**Response:** `201 Created`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nombre": "Cálculo Diferencial",
  "evaluaciones": [
    {
      "tipo": "examen",
      "fecha": "2024-02-15T00:00:00.000Z",
      "activa": true,
      "multiplicador": 3.0
    }
  ],
  ...
}
```

---

## Días Especiales (Special Days)

### Create Día Especial

#### POST /api/dias-especiales

Create a special day.

**Request Body:**
```json
{
  "fecha": "2024-12-25",
  "tipo": "ocio_total",
  "reglas": {}
}
```

**Tipos válidos:**
- `ocio_total` - Complete leisure day
- `trabajo_limitado` - Limited work day
- `dia_negro` - Black day (ignored)

**Response:** `201 Created`
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "fecha": "2024-12-25T00:00:00.000Z",
  "tipo": "ocio_total",
  "reglas": {},
  ...
}
```

### Get All Días Especiales

#### GET /api/dias-especiales

Get all special days.

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "fecha": "2024-12-25T00:00:00.000Z",
    "tipo": "ocio_total",
    ...
  }
]
```

### Get Single Día Especial

#### GET /api/dias-especiales/:id

Get a specific special day.

### Update Día Especial

#### PUT /api/dias-especiales/:id

Update a special day.

### Delete Día Especial

#### DELETE /api/dias-especiales/:id

Delete a special day.

**Response:** `200 OK`
```json
{
  "mensaje": "Día especial eliminado exitosamente"
}
```

---

## Horarios (Schedules)

### Generate Schedule

#### POST /api/generar-horario/:fecha

Generate a daily schedule for a specific date.

**Parameters:**
- `fecha` (string) - Date in format YYYY-MM-DD

**Example:**
```
POST /api/generar-horario/2024-01-15
```

**Response:** `201 Created`
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "fecha": "2024-01-15T00:00:00.000Z",
  "bloques": [
    {
      "hora_inicio": "00:00",
      "hora_fin": "06:00",
      "tipo": "sueño",
      "regla_aplicada": "Descanso necesario"
    },
    {
      "hora_inicio": "08:00",
      "hora_fin": "10:00",
      "tipo": "clase",
      "materia": "507f1f77bcf86cd799439011",
      "materia_nombre": "Cálculo Diferencial",
      "regla_aplicada": "Clase programada"
    },
    {
      "hora_inicio": "10:00",
      "hora_fin": "11:00",
      "tipo": "hora_blanca",
      "materia": "507f1f77bcf86cd799439011",
      "materia_nombre": "Cálculo Diferencial",
      "prioridad_asignada": 2.45,
      "regla_aplicada": "Post-clase inmediata"
    }
  ],
  "resumen": {
    "total_bloques": 10,
    "clases": 2,
    "estudio_total": 5,
    "tiempo_libre": 1
  }
}
```

**Block Types:**
- `sueño` - Sleep
- `clase` - Class
- `hora_blanca` - White hour (1 mandatory hour)
- `estudio_blanco` - White study (high concentration)
- `estudio_gris` - Gray study (medium concentration)
- `libre` - Free time
- `habito` - Habit
- `negro` - Black time (unstructured)

### Get Schedule

#### GET /api/horario/:fecha

Get the schedule for a specific date.

**Parameters:**
- `fecha` (string) - Date in format YYYY-MM-DD

**Example:**
```
GET /api/horario/2024-01-15
```

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "fecha": "2024-01-15T00:00:00.000Z",
  "bloques": [...],
  "resumen": {...}
}
```

**Error Response:** `404 Not Found`
```json
{
  "error": "Horario no encontrado para esta fecha"
}
```

### Get Schedule Range

#### GET /api/horarios

Get schedules for a date range.

**Query Parameters:**
- `fechaInicio` (string) - Start date in format YYYY-MM-DD
- `fechaFin` (string) - End date in format YYYY-MM-DD

**Example:**
```
GET /api/horarios?fechaInicio=2024-01-15&fechaFin=2024-01-21
```

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "fecha": "2024-01-15T00:00:00.000Z",
    "bloques": [...],
    "resumen": {...}
  },
  {
    "_id": "507f1f77bcf86cd799439014",
    "fecha": "2024-01-16T00:00:00.000Z",
    "bloques": [...],
    "resumen": {...}
  }
]
```

---

## User Configuration

### Set User Configuration

#### POST /api/user

Create or update user configuration.

**Request Body:**
```json
{
  "horas_sueno": 7.5,
  "configuracion_excepciones": {
    "hora_despertar": "06:00"
  }
}
```

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "horas_sueno": 7.5,
  "configuracion_excepciones": {
    "hora_despertar": "06:00"
  },
  ...
}
```

### Get User Configuration

#### GET /api/user

Get current user configuration.

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "horas_sueno": 8,
  "configuracion_excepciones": {}
}
```

---

## Data Models

### Materia Schema

```javascript
{
  nombre: String (required),
  creditos: Number (required, 1-6),
  dificultad_percibida: Number (required, 0-3),
  estado_clase: String (enum: ['clase_pendiente', 'clase_vista']),
  fecha_ultima_clase: Date,
  horarios_clase: [
    {
      dia_semana: Number (0=Sunday, 1=Monday, ..., 6=Saturday),
      hora_inicio: String ("HH:MM"),
      hora_fin: String ("HH:MM")
    }
  ],
  evaluaciones: [
    {
      tipo: String (enum: ['examen', 'quiz', 'proyecto_largo']),
      fecha: Date,
      activa: Boolean,
      multiplicador: Number
    }
  ]
}
```

### DiaEspecial Schema

```javascript
{
  fecha: Date (required),
  tipo: String (enum: ['ocio_total', 'trabajo_limitado', 'dia_negro']),
  reglas: Object
}
```

### HorarioDiario Schema

```javascript
{
  fecha: Date (required, unique),
  bloques: [
    {
      hora_inicio: String ("HH:MM"),
      hora_fin: String ("HH:MM"),
      tipo: String (enum: ['sueño', 'clase', 'hora_blanca', 'estudio_blanco', 'estudio_gris', 'libre', 'habito', 'negro']),
      materia: ObjectId (ref: 'Materia'),
      materia_nombre: String,
      prioridad_asignada: Number,
      regla_aplicada: String
    }
  ],
  resumen: Object
}
```

### User Schema

```javascript
{
  horas_sueno: Number (default: 8),
  configuracion_excepciones: Object
}
```

---

## Example Workflow

### 1. Configure User

```bash
curl -X POST http://localhost:5000/api/user \
  -H "Content-Type: application/json" \
  -d '{"horas_sueno": 8}'
```

### 2. Add Subjects

```bash
curl -X POST http://localhost:5000/api/materias \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Cálculo",
    "creditos": 4,
    "dificultad_percibida": 2.5,
    "horarios_clase": [
      {"dia_semana": 1, "hora_inicio": "08:00", "hora_fin": "10:00"}
    ]
  }'
```

### 3. Add Evaluation

```bash
curl -X POST http://localhost:5000/api/materias/MATERIA_ID/evaluaciones \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "examen",
    "fecha": "2024-02-15",
    "activa": true,
    "multiplicador": 3.0
  }'
```

### 4. Generate Schedule

```bash
curl -X POST http://localhost:5000/api/generar-horario/2024-01-15
```

### 5. Get Schedule

```bash
curl http://localhost:5000/api/horario/2024-01-15
```

---

## Rate Limiting

Currently, no rate limiting is implemented. This should be added for production use.

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.

## Future Enhancements

- Authentication and authorization
- Rate limiting
- Pagination for list endpoints
- Filtering and sorting options
- WebSocket support for real-time updates
- Export schedules to calendar formats (iCal, Google Calendar)
