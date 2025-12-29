const { calcularPrioridades } = require('./priorityCalculator');

/**
 * Convierte una hora en formato "HH:MM" a minutos desde medianoche
 */
function horaAMinutos(hora) {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Convierte minutos desde medianoche a formato "HH:MM"
 */
function minutosAHora(minutos) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Crea un bloque de horario
 */
function crearBloque(hora_inicio, hora_fin, tipo, materia = null, prioridad = null, regla = null) {
  return {
    hora_inicio,
    hora_fin,
    tipo,
    materia: materia?._id,
    materia_nombre: materia?.nombre,
    prioridad_asignada: prioridad,
    regla_aplicada: regla
  };
}

/**
 * Obtiene las clases del día
 */
function obtenerClasesDelDia(materias, fecha) {
  const diaSemana = fecha.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  const clasesDelDia = [];
  
  materias.forEach(materia => {
    const clasesHoy = materia.horarios_clase.filter(h => h.dia_semana === diaSemana);
    clasesHoy.forEach(horario => {
      clasesDelDia.push({
        materia,
        hora_inicio: horario.hora_inicio,
        hora_fin: horario.hora_fin
      });
    });
  });
  
  // Ordenar por hora de inicio
  clasesDelDia.sort((a, b) => horaAMinutos(a.hora_inicio) - horaAMinutos(b.hora_inicio));
  
  return clasesDelDia;
}

/**
 * Crea bloques de tiempo disponibles (excluyendo sueño y clases)
 */
function crearBloquesDisponibles(bloques) {
  const disponibles = [];
  const INICIO_DIA = 0; // 00:00
  const FIN_DIA = 24 * 60; // 24:00
  
  // Convertir bloques a minutos y ordenar
  const bloquesOcupados = bloques
    .map(b => ({
      inicio: horaAMinutos(b.hora_inicio),
      fin: horaAMinutos(b.hora_fin)
    }))
    .sort((a, b) => a.inicio - b.inicio);
  
  let ultimoFin = INICIO_DIA;
  
  bloquesOcupados.forEach(bloque => {
    if (bloque.inicio > ultimoFin) {
      disponibles.push({
        hora_inicio: minutosAHora(ultimoFin),
        hora_fin: minutosAHora(bloque.inicio),
        duracion: bloque.inicio - ultimoFin
      });
    }
    ultimoFin = Math.max(ultimoFin, bloque.fin);
  });
  
  if (ultimoFin < FIN_DIA) {
    disponibles.push({
      hora_inicio: minutosAHora(ultimoFin),
      hora_fin: minutosAHora(FIN_DIA),
      duracion: FIN_DIA - ultimoFin
    });
  }
  
  return disponibles;
}

/**
 * Asigna la hora blanca (1 hora obligatoria)
 */
function asignarHoraBlanca(disponibles, prioridadesOrdenadas, clasesHoy, fecha) {
  // Regla 1: Evaluación mañana
  const mañana = new Date(fecha);
  mañana.setDate(mañana.getDate() + 1);
  
  for (const { materia, prioridad_final } of prioridadesOrdenadas) {
    const evaluacionMañana = materia.evaluaciones.find(e => {
      const evalDate = new Date(e.fecha);
      return e.activa && 
             evalDate.getFullYear() === mañana.getFullYear() &&
             evalDate.getMonth() === mañana.getMonth() &&
             evalDate.getDate() === mañana.getDate();
    });
    
    if (evaluacionMañana) {
      const bloque = disponibles.find(d => d.duracion >= 60);
      if (bloque) {
        return {
          bloque: crearBloque(
            bloque.hora_inicio,
            minutosAHora(horaAMinutos(bloque.hora_inicio) + 60),
            'hora_blanca',
            materia,
            prioridad_final,
            'Evaluación mañana'
          ),
          tiempo_usado: 60
        };
      }
    }
  }
  
  // Regla 2: Materia con clase hoy, justo después
  for (const clase of clasesHoy) {
    const bloqueDisponible = disponibles.find(d => 
      d.hora_inicio === clase.hora_fin && d.duracion >= 60
    );
    
    if (bloqueDisponible) {
      const prioridad = prioridadesOrdenadas.find(p => p.materia._id.toString() === clase.materia._id.toString());
      return {
        bloque: crearBloque(
          bloqueDisponible.hora_inicio,
          minutosAHora(horaAMinutos(bloqueDisponible.hora_inicio) + 60),
          'hora_blanca',
          clase.materia,
          prioridad?.prioridad_final,
          'Post-clase inmediata'
        ),
        tiempo_usado: 60
      };
    }
  }
  
  // Regla 3: Mayor prioridad
  if (prioridadesOrdenadas.length > 0) {
    const bloque = disponibles.find(d => d.duracion >= 60);
    if (bloque) {
      const top = prioridadesOrdenadas[0];
      return {
        bloque: crearBloque(
          bloque.hora_inicio,
          minutosAHora(horaAMinutos(bloque.hora_inicio) + 60),
          'hora_blanca',
          top.materia,
          top.prioridad_final,
          'Mayor prioridad'
        ),
        tiempo_usado: 60
      };
    }
  }
  
  return null;
}

/**
 * Asigna bloques de estudio
 */
function asignarEstudio(disponibles, prioridadesOrdenadas, tipo, minimoHoras = 1) {
  const bloques = [];
  const minutosPorBloque = minimoHoras * 60;
  
  for (const { materia, prioridad_final } of prioridadesOrdenadas) {
    for (const disponible of disponibles) {
      if (disponible.duracion >= minutosPorBloque) {
        const duracion = Math.min(disponible.duracion, 120); // Máximo 2 horas por bloque
        bloques.push(
          crearBloque(
            disponible.hora_inicio,
            minutosAHora(horaAMinutos(disponible.hora_inicio) + duracion),
            tipo,
            materia,
            prioridad_final,
            `Estudio programado - prioridad ${prioridad_final.toFixed(2)}`
          )
        );
        disponible.hora_inicio = minutosAHora(horaAMinutos(disponible.hora_inicio) + duracion);
        disponible.duracion -= duracion;
        break;
      }
    }
  }
  
  return bloques;
}

/**
 * Genera el horario diario
 */
async function generarHorario(fecha, materias, diasEspeciales, usuario) {
  const bloques = [];
  const fechaSinHora = new Date(fecha);
  fechaSinHora.setHours(0, 0, 0, 0);
  
  // 1. Verificar días especiales
  const diaEspecial = diasEspeciales.find(d => {
    const dEspecialFecha = new Date(d.fecha);
    dEspecialFecha.setHours(0, 0, 0, 0);
    return dEspecialFecha.getTime() === fechaSinHora.getTime();
  });
  
  if (diaEspecial?.tipo === 'dia_negro') {
    return {
      fecha: fechaSinHora,
      bloques: [],
      resumen: { tipo: 'dia_negro', mensaje: 'Día ignorado por configuración' }
    };
  }
  
  // 2. Bloque de sueño
  const horasSueno = usuario?.horas_sueno || 8;
  const horaDespertar = 6; // Por defecto 6 AM
  const horaDormir = 24 - (horasSueno - horaDespertar);
  
  bloques.push(crearBloque('00:00', `${horaDespertar.toString().padStart(2, '0')}:00`, 'sueño', null, null, 'Descanso necesario'));
  bloques.push(crearBloque(`${horaDormir.toString().padStart(2, '0')}:00`, '24:00', 'sueño', null, null, 'Descanso necesario'));
  
  if (diaEspecial?.tipo === 'ocio_total') {
    // Solo sueño y tiempo libre
    bloques.push(crearBloque(`${horaDespertar.toString().padStart(2, '0')}:00`, `${horaDormir.toString().padStart(2, '0')}:00`, 'libre', null, null, 'Día de ocio'));
    return {
      fecha: fechaSinHora,
      bloques,
      resumen: { tipo: 'ocio_total', mensaje: 'Día completo de descanso' }
    };
  }
  
  // 3. Detectar clases del día
  const clasesHoy = obtenerClasesDelDia(materias, fechaSinHora);
  clasesHoy.forEach(clase => {
    bloques.push(crearBloque(clase.hora_inicio, clase.hora_fin, 'clase', clase.materia, null, 'Clase programada'));
  });
  
  // 4. Calcular prioridades
  const prioridadesOrdenadas = calcularPrioridades(materias, fechaSinHora);
  
  // 5. Crear bloques disponibles
  let disponibles = crearBloquesDisponibles(bloques);
  
  // 6. Asignar hora blanca
  const horaBlanca = asignarHoraBlanca(disponibles, prioridadesOrdenadas, clasesHoy, fechaSinHora);
  if (horaBlanca) {
    bloques.push(horaBlanca.bloque);
    disponibles = crearBloquesDisponibles(bloques);
  }
  
  // 7. Asignar estudio blanco
  const estudiosBlanco = asignarEstudio(disponibles, prioridadesOrdenadas, 'estudio_blanco', 1);
  bloques.push(...estudiosBlanco);
  disponibles = crearBloquesDisponibles(bloques);
  
  // 8. Asignar estudio gris
  const estudiosGris = asignarEstudio(disponibles, prioridadesOrdenadas, 'estudio_gris', 1);
  bloques.push(...estudiosGris);
  disponibles = crearBloquesDisponibles(bloques);
  
  // 9. Garantizar tiempo libre (mínimo 1 hora)
  const tiempoLibreTotal = disponibles.reduce((sum, d) => sum + d.duracion, 0);
  if (tiempoLibreTotal >= 60) {
    const bloqueLibre = disponibles.find(d => d.duracion >= 60);
    if (bloqueLibre) {
      bloques.push(crearBloque(
        bloqueLibre.hora_inicio,
        minutosAHora(horaAMinutos(bloqueLibre.hora_inicio) + Math.min(60, bloqueLibre.duracion)),
        'libre',
        null,
        null,
        'Tiempo libre obligatorio'
      ));
      disponibles = crearBloquesDisponibles(bloques);
    }
  }
  
  // 10. Llenar espacios restantes como tiempo negro
  disponibles.forEach(d => {
    if (d.duracion >= 15) { // Solo si es >= 15 minutos
      bloques.push(crearBloque(d.hora_inicio, d.hora_fin, 'negro', null, null, 'Tiempo no estructurado'));
    }
  });
  
  // Ordenar bloques por hora
  bloques.sort((a, b) => horaAMinutos(a.hora_inicio) - horaAMinutos(b.hora_inicio));
  
  // Crear resumen
  const resumen = {
    total_bloques: bloques.length,
    clases: bloques.filter(b => b.tipo === 'clase').length,
    estudio_total: bloques.filter(b => b.tipo === 'hora_blanca' || b.tipo === 'estudio_blanco' || b.tipo === 'estudio_gris').length,
    tiempo_libre: bloques.filter(b => b.tipo === 'libre').length
  };
  
  return {
    fecha: fechaSinHora,
    bloques,
    resumen
  };
}

module.exports = {
  generarHorario,
  horaAMinutos,
  minutosAHora
};
