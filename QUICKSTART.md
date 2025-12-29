# Quick Start Guide - Planificador Académico

Get the Academic Planner up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB installed and running
- Terminal/Command Line access

## Installation

### Step 1: Clone and Install Dependencies

```bash
# If you haven't cloned yet
git clone <repository-url>
cd STUDY-APP

# Install all dependencies (backend and frontend)
npm run install:all
```

This will install dependencies for both backend and frontend.

### Step 2: Configure Environment

```bash
# Create backend environment file
cd backend
cp .env.example .env
```

Edit `backend/.env` if needed (default values work for local development):
```
MONGODB_URI=mongodb://localhost:27017/planificador-academico
PORT=5000
```

### Step 3: Start MongoDB

Make sure MongoDB is running:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux with systemd
sudo systemctl start mongod

# On Windows
# Start MongoDB from Services or run mongod.exe
```

### Step 4: Start the Backend

```bash
# From the backend directory
npm start

# OR for development with auto-reload
npm run dev
```

You should see:
```
MongoDB conectado: localhost
Servidor corriendo en puerto 5000
```

### Step 5: Start the Frontend

Open a new terminal:

```bash
cd frontend
npm start
```

The React app will open automatically at `http://localhost:3000`

## First Time Setup in the App

### 1. Configure Your Settings

1. Click on **"Configuración"** in the navigation
2. Set your sleep hours (default is 8 hours)
3. Optionally add special days (holidays, etc.)

### 2. Add Your Subjects

1. Go to **"Materias"**
2. Click **"Agregar Materia"**
3. Fill in the form:
   - **Nombre**: e.g., "Cálculo Diferencial"
   - **Créditos**: e.g., 4
   - **Dificultad Percibida**: 0-3 scale (e.g., 2.0 for moderate difficulty)
4. Click **"Crear Materia"**

### 3. Add Evaluations

1. In the **"Materias"** page, find your subject
2. Click **"Agregar Evaluación"**
3. Select:
   - **Tipo**: Examen, Quiz, or Proyecto Largo
   - **Fecha**: Date of the evaluation
4. Click **"Agregar"**

### 4. Generate Your Schedule

1. Go to **"Horario Diario"**
2. Select today's date (or any date)
3. Click **"Generar Horario"**
4. View your optimized daily schedule!

## Example: Complete First Session

Here's a complete example to get started:

### Add Two Subjects

**Subject 1: Cálculo Diferencial**
- Créditos: 4
- Dificultad: 2.5
- Horarios: Lunes 08:00-10:00, Miércoles 08:00-10:00

**Subject 2: Programación**
- Créditos: 3
- Dificultad: 1.5
- Horarios: Martes 10:00-12:00, Jueves 10:00-12:00

### Add Evaluations

**Cálculo - Examen**
- Fecha: 7 days from now
- Tipo: Examen

**Programación - Quiz**
- Fecha: 3 days from now
- Tipo: Quiz

### Generate and View

1. Generate schedule for today
2. Observe how the system prioritizes:
   - Programming quiz (closer date) gets more study time
   - Post-class study blocks appear right after classes
   - Sleep and free time are guaranteed

## Understanding Your Schedule

### Block Colors

The schedule uses color-coded blocks:

- 🔵 **Blue (Sueño)**: Sleep time
- 🟠 **Orange (Clase)**: Scheduled classes
- 🟣 **Purple (Hora Blanca)**: 1-hour mandatory high-priority study
- 🟢 **Dark Green (Estudio Blanco)**: High concentration study blocks
- 🟢 **Light Green (Estudio Gris)**: Medium concentration study
- 🟡 **Yellow (Libre)**: Free time
- 🟤 **Brown (Negro)**: Unstructured time

### Priority Numbers

Each study block shows a priority number. Higher numbers mean:
- More credits
- Higher difficulty
- Closer evaluation dates
- Recent classes that need review

## Weekly View

1. Go to **"Vista Semanal"**
2. Select a start date
3. Click **"Cargar Semana"**
4. See a summary of your entire week

## Troubleshooting

### MongoDB Connection Error

**Error:** `Error de conexión: connect ECONNREFUSED`

**Solution:**
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod           # Linux
```

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9

# Or change the port in backend/.env
PORT=5001
```

### Cannot Find Module Error

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules
npm install

cd ../frontend
rm -rf node_modules
npm install
```

## Next Steps

### Explore Advanced Features

1. **Special Days**: Configure holidays or exam weeks
2. **Weekly Planning**: Generate schedules for an entire week
3. **Priority Analysis**: Review how priorities are calculated
4. **Schedule Adjustments**: Regenerate schedules as evaluations approach

### Customize the System

1. **Adjust Sleep Hours**: Change in Configuration
2. **Modify Difficulty Ratings**: Update subjects as needed
3. **Add/Remove Evaluations**: Keep your schedule current

## Command Reference

### Backend Commands
```bash
npm start          # Start production server
npm run dev        # Start with auto-reload
```

### Frontend Commands
```bash
npm start          # Start development server
npm run build      # Create production build
```

### Combined Commands (from root)
```bash
npm run install:all      # Install all dependencies
npm run dev:backend      # Start backend in dev mode
npm run dev:frontend     # Start frontend in dev mode
npm run start:backend    # Start backend
npm run start:frontend   # Start frontend
```

## Tips for Best Results

1. **Keep Evaluations Updated**: Mark completed evaluations as inactive
2. **Regular Schedule Generation**: Regenerate daily for best results
3. **Review Priorities**: Check which subjects need more attention
4. **Use Special Days**: Mark holidays and busy days ahead of time
5. **Adjust Difficulty**: Update difficulty ratings based on your experience

## Getting Help

- Check the main [README.md](README.md) for detailed documentation
- Review [ALGORITHM.md](ALGORITHM.md) for how priorities are calculated
- See [API.md](API.md) for API endpoint details

## Ready to Go!

You're all set! Start by adding your subjects and generating your first schedule. The system will help you manage your study time efficiently based on your academic priorities.

Happy studying! 📚✨
