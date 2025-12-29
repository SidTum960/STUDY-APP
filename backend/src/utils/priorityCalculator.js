/**
 * Algoritmo de priorización académica
 */

/**
 * Calcula el factor de dificultad percibida
 * f(d) = e^((1/5) * ln(3) * d)
 */
function calcularDificultad(dificultad_percibida) {
  return Math.exp((1/5) * Math.log(3) * dificultad_percibida);
}

/**
 * Calcula el factor de estado de clase
 */
function calcularEstadoClase(estado_clase) {
  return estado_clase === 'clase_pendiente' ? 0.3 : 1.0;
}

/**
 * Calcula el multiplicador de evaluación
 */
function calcularMultiplicadorEvaluacion(evaluaciones, fechaActual) {
  let multiplicador = 1.0;
  
  evaluaciones.forEach(eval => {
    if (eval.activa && eval.fecha >= fechaActual) {
      const diasHastaEval = Math.floor((eval.fecha - fechaActual) / (1000 * 60 * 60 * 24));
      
      // Calcular función de proximidad
      let proximidad = 1.0;
      if (diasHastaEval <= 1) {
        proximidad = 3.0;
      } else if (diasHastaEval <= 7) {
        proximidad = 3.0 - ((diasHastaEval - 1) / 6) * 2.0; // decaimiento lineal 3.0 a 1.0
      } else if (diasHastaEval <= 14) {
        proximidad = 2.0 - ((diasHastaEval - 8) / 6) * 1.0; // decaimiento lineal 2.0 a 1.0
      }
      
      // Multiplicadores por tipo
      let tipoMultiplicador = 1.0;
      if (eval.tipo === 'examen') {
        tipoMultiplicador = 3.0;
      } else if (eval.tipo === 'quiz') {
        tipoMultiplicador = 2.0;
      } else if (eval.tipo === 'proyecto_largo') {
        tipoMultiplicador = 1.5;
      }
      
      multiplicador *= (proximidad * tipoMultiplicador);
    }
  });
  
  return multiplicador;
}

/**
 * Calcula el refuerzo post-clase
 */
function calcularRefuerzoPostClase(fecha_ultima_clase, fechaActual) {
  if (!fecha_ultima_clase) return 1.0;
  
  const diasDesdeClase = Math.floor((fechaActual - fecha_ultima_clase) / (1000 * 60 * 60 * 24));
  
  // Si la clase fue en los últimos 5 días, hay 1 hora de estudio obligatoria
  if (diasDesdeClase >= 0 && diasDesdeClase <= 5) {
    return 1.5; // Mayor prioridad para estudio post-clase
  }
  
  return 1.0;
}

/**
 * Calcula la prioridad final de una materia
 */
function calcularPrioridadFinal(materia, suma_total_creditos, fechaActual) {
  const prioridad_base = materia.creditos / suma_total_creditos;
  const dificultad = calcularDificultad(materia.dificultad_percibida);
  const estado_clase = calcularEstadoClase(materia.estado_clase);
  const evaluacion = calcularMultiplicadorEvaluacion(materia.evaluaciones, fechaActual);
  const refuerzo_post_clase = calcularRefuerzoPostClase(materia.fecha_ultima_clase, fechaActual);
  
  const prioridad_final = prioridad_base * dificultad * evaluacion * estado_clase * refuerzo_post_clase;
  
  return {
    prioridad_final,
    desglose: {
      prioridad_base,
      dificultad,
      estado_clase,
      evaluacion,
      refuerzo_post_clase
    }
  };
}

/**
 * Calcula las prioridades de todas las materias
 */
function calcularPrioridades(materias, fechaActual) {
  const suma_total_creditos = materias.reduce((sum, m) => sum + m.creditos, 0);
  
  return materias.map(materia => {
    const { prioridad_final, desglose } = calcularPrioridadFinal(materia, suma_total_creditos, fechaActual);
    return {
      materia,
      prioridad_final,
      desglose
    };
  }).sort((a, b) => b.prioridad_final - a.prioridad_final);
}

module.exports = {
  calcularDificultad,
  calcularEstadoClase,
  calcularMultiplicadorEvaluacion,
  calcularRefuerzoPostClase,
  calcularPrioridadFinal,
  calcularPrioridades
};
