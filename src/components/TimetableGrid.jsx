import React, { useState, useMemo } from 'react';
import { DAYS_OF_WEEK, TIME_SLOTS, COURSE_COLORS } from '../data/coursesData';
import { AlertTriangle, X, MapPin, User, Clock, Eye, Plus } from 'lucide-react';

export default function TimetableGrid({ 
  selectedTurmas, 
  onRemoveTurma, 
  gridRef,
  courseColorMap,
  academicPeriod,
  onSlotClick
}) {
  const [hourRangeMode, setHourRangeMode] = useState('completo'); // 'completo' (until 23:00), 'diurno' (until 18:00), 'auto'

  // Convert HH:mm to minutes from midnight
  const timeToMinutes = (tStr) => {
    const [h, m] = tStr.split(':').map(Number);
    return h * 60 + m;
  };

  // Helper to abbreviate long words in course names so tiles remain ultra-clean
  const abbreviateCourseName = (name) => {
    if (!name) return '';
    return name
      .replace(/LABORATÓRIO/gi, 'LAB.')
      .replace(/LABORATORIO/gi, 'LAB.')
      .replace(/TRANSFORMAÇÃO/gi, 'TRANSF.')
      .replace(/TRANSFORMACAO/gi, 'TRANSF.')
      .replace(/INTRODUÇÃO/gi, 'INTRO.')
      .replace(/INTRODUCAO/gi, 'INTRO.')
      .replace(/FUNDAMENTOS/gi, 'FUND.')
      .replace(/EXPERIMENTAL/gi, 'EXP.')
      .replace(/ESTRUTURAS/gi, 'ESTRUT.')
      .replace(/ELEMENTOS/gi, 'ELEM.')
      .replace(/EQUAÇÕES/gi, 'EQ.')
      .replace(/EQUACOES/gi, 'EQ.')
      .replace(/DIFERENCIAIS/gi, 'DIF.')
      .replace(/MATEMÁTICA/gi, 'MAT.')
      .replace(/MATEMATICA/gi, 'MAT.')
      .replace(/COMPUTAÇÃO/gi, 'COMP.')
      .replace(/COMPUTACAO/gi, 'COMP.')
      .replace(/PROGRAMAÇÃO/gi, 'PROG.')
      .replace(/PROGRAMACAO/gi, 'PROG.')
      .replace(/QUÍMICA/gi, 'QUÍM.')
      .replace(/QUIMICA/gi, 'QUÍM.')
      .replace(/FÍSICA/gi, 'FÍS.')
      .replace(/FISICA/gi, 'FÍS.');
  };

  // Find maximum end hour across all selected turmas
  const maxSelectedEndHour = useMemo(() => {
    let maxH = 18; // Default max is 18:00 (diurno)
    selectedTurmas.forEach(item => {
      (item.turma.slots || []).forEach(s => {
        const endH = parseInt(s.end.split(':')[0], 10);
        if (endH > maxH) {
          maxH = endH;
        }
      });
    });
    return maxH;
  }, [selectedTurmas]);

  // Determine active visible TIME_SLOTS
  const visibleTimeSlots = useMemo(() => {
    if (hourRangeMode === 'completo') {
      return TIME_SLOTS;
    }
    if (hourRangeMode === 'diurno') {
      return TIME_SLOTS.filter(s => parseInt(s.end.split(':')[0], 10) <= 18);
    }
    const limitHour = Math.max(18, maxSelectedEndHour);
    return TIME_SLOTS.filter(s => parseInt(s.end.split(':')[0], 10) <= limitHour);
  }, [hourRangeMode, maxSelectedEndHour]);

  // Check if a section slot overlaps with a grid cell
  const getOccupyingTurmas = (dayId, slotStart, slotEnd) => {
    const cellStartMin = timeToMinutes(slotStart);
    const cellEndMin = timeToMinutes(slotEnd);

    const matches = [];

    selectedTurmas.forEach((item) => {
      const { course, turma } = item;
      (turma.slots || []).forEach((s) => {
        if (s.day === dayId) {
          const slotStartMin = timeToMinutes(s.start);
          const slotEndMin = timeToMinutes(s.end);

          if (slotStartMin < cellEndMin && slotEndMin > cellStartMin) {
            matches.push({
              course,
              turma,
              slot: s
            });
          }
        }
      });
    });

    return matches;
  };

  const eadTurmas = selectedTurmas.filter(item => !item.turma.slots || item.turma.slots.length === 0);

  // Total weekly hours
  const totalWeeklyHours = selectedTurmas.reduce((acc, item) => {
    let sum = 0;
    (item.turma.slots || []).forEach(s => {
      const [sh, sm] = s.start.split(':').map(Number);
      const [eh, em] = s.end.split(':').map(Number);
      sum += (eh * 60 + em) - (sh * 60 + sm);
    });
    return acc + sum;
  }, 0) / 60;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
      
      {/* Grid Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'var(--bg-card)',
        padding: '0.5rem 0.85rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        fontSize: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          <Eye size={15} /> Visualização da Grade:
        </div>
        <div style={{ display: 'flex', gap: '0.3rem' }}>
          <button
            onClick={() => setHourRangeMode('auto')}
            style={{
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: hourRangeMode === 'auto' ? 'var(--color-primary)' : 'var(--bg-main)',
              color: hourRangeMode === 'auto' ? '#fff' : 'var(--text-muted)',
              border: '1px solid var(--border-color)'
            }}
          >
            Auto ({Math.max(18, maxSelectedEndHour)}h)
          </button>
          <button
            onClick={() => setHourRangeMode('diurno')}
            style={{
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: hourRangeMode === 'diurno' ? 'var(--color-primary)' : 'var(--bg-main)',
              color: hourRangeMode === 'diurno' ? '#fff' : 'var(--text-muted)',
              border: '1px solid var(--border-color)'
            }}
          >
            Até 18:00 (Diurno)
          </button>
          <button
            onClick={() => setHourRangeMode('completo')}
            style={{
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: hourRangeMode === 'completo' ? 'var(--color-primary)' : 'var(--bg-main)',
              color: hourRangeMode === 'completo' ? '#fff' : 'var(--text-muted)',
              border: '1px solid var(--border-color)'
            }}
          >
            Até 23:00 (Completo)
          </button>
        </div>
      </div>

      {/* Grid container with STRICT EQUAL COLUMNS and FIXED EQUAL ROW HEIGHTS */}
      <div 
        ref={gridRef}
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-md)',
          overflowX: 'auto'
        }}
      >
        <div style={{ minWidth: '850px' }}>
          
          {/* Printable Official Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-header)',
            padding: '0.85rem 1.15rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            marginBottom: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1.15rem',
                boxShadow: 'var(--shadow-glow)'
              }}>
                UFJF
              </div>
              <div>
                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  letterSpacing: '0.3px'
                }}>
                  UNIVERSIDADE FEDERAL DE JUIZ DE FORA
                </h2>
                <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Grade Horária Acadêmica • Período {academicPeriod || '2026/3'}
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '0.85rem',
              fontSize: '0.775rem',
              backgroundColor: 'var(--bg-main)',
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Matérias: </span>
                <strong style={{ color: 'var(--color-accent)' }}>{selectedTurmas.length}</strong>
              </div>
              <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }} />
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Carga Horária: </span>
                <strong style={{ color: 'var(--color-secondary)' }}>{Math.round(totalWeeklyHours)}h/sem</strong>
              </div>
            </div>
          </div>

          {/* Header Row (Days) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `95px repeat(${DAYS_OF_WEEK.length}, minmax(0, 1fr))`,
            gap: '5px',
            marginBottom: '5px'
          }}>
            <div style={{
              padding: '0.6rem',
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '0.775rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem'
            }}>
              <Clock size={14} /> Horário
            </div>

            {DAYS_OF_WEEK.map((day) => (
              <div 
                key={day.id}
                style={{
                  padding: '0.6rem',
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9rem',
                  letterSpacing: '0.5px'
                }}
              >
                {day.full}
              </div>
            ))}
          </div>

          {/* Time Slot Rows - STRICT EQUAL FIXED ROW HEIGHT (54px) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {visibleTimeSlots.map((slot) => (
              <div 
                key={slot.start}
                style={{
                  display: 'grid',
                  gridTemplateColumns: `95px repeat(${DAYS_OF_WEEK.length}, minmax(0, 1fr))`,
                  gap: '5px',
                  height: '54px',
                  maxHeight: '54px'
                }}
              >
                {/* Time Label Column */}
                <div style={{
                  padding: '0.35rem',
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-color)',
                  height: '100%',
                  boxSizing: 'border-box'
                }}>
                  <span>{slot.start} - {slot.end}</span>
                </div>

                {/* Day Columns */}
                {DAYS_OF_WEEK.map((day) => {
                  const occupying = getOccupyingTurmas(day.id, slot.start, slot.end);
                  const hasConflict = occupying.length > 1;

                  return (
                    <div 
                      key={day.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (occupying.length === 0 && onSlotClick) {
                          onSlotClick(day.id, slot);
                        }
                      }}
                      className={occupying.length === 0 ? "empty-grid-cell" : ""}
                      title={occupying.length === 0 ? `Clique para buscar aulas em ${day.full} às ${slot.start}` : undefined}
                      style={{
                        backgroundColor: occupying.length === 0 
                          ? 'var(--bg-main)' 
                          : hasConflict 
                            ? 'rgba(239, 68, 68, 0.15)' 
                            : 'transparent',
                        borderRadius: 'var(--radius-md)',
                        border: hasConflict 
                          ? '2px dashed #ef4444' 
                          : '1px solid var(--border-color)',
                        position: 'relative',
                        padding: '2px 3px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        justifyContent: 'center',
                        height: '100%',
                        overflow: 'hidden',
                        boxSizing: 'border-box',
                        transition: 'all 0.2s ease',
                        cursor: occupying.length === 0 ? 'pointer' : 'default'
                      }}
                    >
                      {occupying.length === 0 && (
                        <div 
                          className="empty-cell-placeholder"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            width: '100%',
                            color: 'var(--text-muted)',
                            opacity: 0.25,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            userSelect: 'none'
                          }}
                        >
                          +
                        </div>
                      )}
                      {hasConflict && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          color: '#ef4444',
                          fontSize: '0.625rem',
                          fontWeight: 700,
                          backgroundColor: 'rgba(239, 68, 68, 0.2)',
                          padding: '1px 3px',
                          borderRadius: '3px'
                        }}>
                          <AlertTriangle size={11} /> CONFLITO!
                        </div>
                      )}

                      {occupying.map((occ, idx) => {
                        const { course, turma, slot: occSlot } = occ;
                        const colorIndex = courseColorMap[course.code] ?? 0;
                        const colorObj = COURSE_COLORS[colorIndex % COURSE_COLORS.length];
                        const abbreviatedName = abbreviateCourseName(course.name);

                        return (
                          <div 
                            key={`${turma.id}-${idx}`}
                            title={`${course.code} - ${course.name}\nTurma ${turma.turma}\nProfessor: ${turma.docentes?.join(', ') || 'N/A'}\nSala: ${occSlot.room || 'N/A'}`}
                            style={{
                              backgroundColor: colorObj.hex,
                              color: '#ffffff',
                              borderRadius: 'var(--radius-md)',
                              padding: '3px 5px',
                              fontSize: '0.725rem',
                              boxShadow: 'var(--shadow-sm)',
                              position: 'relative',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              height: '100%',
                              borderLeft: `3px solid ${colorObj.darkBorder}`,
                              overflow: 'hidden',
                              boxSizing: 'border-box'
                            }}
                          >
                            {/* Header: Code + Turma + Remove */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <strong style={{ fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                {course.code} (T.{turma.turma})
                              </strong>
                              <button
                                onClick={() => onRemoveTurma(turma.id)}
                                style={{
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  padding: '1px',
                                  borderRadius: '3px',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                                title="Remover matéria"
                              >
                                <X size={12} />
                              </button>
                            </div>

                            {/* Abbreviated Name snippet strictly truncated to single line */}
                            <span style={{ 
                              fontSize: '0.65rem', 
                              opacity: 0.95, 
                              whiteSpace: 'nowrap', 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis',
                              display: 'block'
                            }}>
                              {abbreviatedName}
                            </span>

                            {/* Info footer */}
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '0.6rem', 
                              opacity: 0.9,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden'
                            }}>
                              {turma.docentes && turma.docentes.length > 0 && (
                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '65%' }}>
                                  👤 {turma.docentes[0].split(' ')[0]}
                                </span>
                              )}
                              {occSlot.room && (
                                <span>📍 {occSlot.room.replace('Sala ', '')}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}

                    </div>
                  );
                })}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* EAD / Flexible Courses Section */}
      {eadTurmas.length > 0 && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: '0.85rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            Disciplinas EAD / Sem Horário Fixo na Grade ({eadTurmas.length})
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {eadTurmas.map((item) => {
              const { course, turma } = item;
              const colorIndex = courseColorMap[course.code] ?? 0;
              const colorObj = COURSE_COLORS[colorIndex % COURSE_COLORS.length];

              return (
                <div 
                  key={turma.id}
                  style={{
                    backgroundColor: colorObj.hex,
                    color: '#ffffff',
                    padding: '0.4rem 0.65rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.775rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <div>
                    <strong>{course.code} (Turma {turma.turma})</strong> - {course.name}
                    {turma.docentes.length > 0 && (
                      <span style={{ fontSize: '0.7rem', opacity: 0.85, display: 'block' }}>
                        Prof: {turma.docentes.join(', ')}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => onRemoveTurma(turma.id)}
                    style={{ color: '#fff', opacity: 0.8, display: 'flex' }}
                  >
                    <X size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
