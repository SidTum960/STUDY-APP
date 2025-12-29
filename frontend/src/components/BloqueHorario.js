import React from 'react';

const TIPO_COLORS = {
  'sueño': '#2196f3',
  'clase': '#ff9800',
  'hora_blanca': '#9c27b0',
  'estudio_blanco': '#4caf50',
  'estudio_gris': '#8bc34a',
  'libre': '#ffeb3b',
  'habito': '#00bcd4',
  'negro': '#795548'
};

const TIPO_LABELS = {
  'sueño': 'Sueño',
  'clase': 'Clase',
  'hora_blanca': 'Hora Blanca',
  'estudio_blanco': 'Estudio Blanco',
  'estudio_gris': 'Estudio Gris',
  'libre': 'Tiempo Libre',
  'habito': 'Hábito',
  'negro': 'Tiempo Negro'
};

function BloqueHorario({ bloque }) {
  return (
    <div className={`bloque bloque-${bloque.tipo}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>{bloque.hora_inicio} - {bloque.hora_fin}</strong>
          <span style={{ marginLeft: '10px', color: TIPO_COLORS[bloque.tipo] }}>
            {TIPO_LABELS[bloque.tipo]}
          </span>
        </div>
        {bloque.materia_nombre && (
          <div style={{ fontWeight: 'bold' }}>
            {bloque.materia_nombre}
          </div>
        )}
      </div>
      {bloque.prioridad_asignada && (
        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          Prioridad: {bloque.prioridad_asignada.toFixed(2)}
        </div>
      )}
      {bloque.regla_aplicada && (
        <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
          {bloque.regla_aplicada}
        </div>
      )}
    </div>
  );
}

export default BloqueHorario;
