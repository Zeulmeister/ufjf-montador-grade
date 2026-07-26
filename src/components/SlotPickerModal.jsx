import React, { useState, useMemo } from 'react';
import { X, Search, Clock, Plus, Check, GraduationCap, AlertCircle, Calendar } from 'lucide-react';
import { DAYS_OF_WEEK } from '../data/coursesData';

export default function SlotPickerModal({
  isOpen,
  onClose,
  targetSlot,
  courses = [],
  selectedTurmas = [],
  completedCourseCodes = new Set(),
  hideCompleted = true,
  onAddTurma,
  checkTurmaConflict
}) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen || !targetSlot) return null;

  const dayObj = DAYS_OF_WEEK.find(d => d.id === targetSlot.dayId);
  const dayLabel = dayObj ? dayObj.full : targetSlot.dayId;

  // Selected turmas set for quick lookup
  const selectedTurmaIds = new Set(selectedTurmas.map(t => t.turma.id));

  const timeToMinutes = (tStr) => {
    const [h, m] = tStr.split(':').map(Number);
    return h * 60 + m;
  };

  const slotStartMin = timeToMinutes(targetSlot.start);
  const slotEndMin = timeToMinutes(targetSlot.end);

  // Find all turmas offered at this specific time slot
  const matchingTurmasList = useMemo(() => {
    const results = [];

    courses.forEach(course => {
      const isCompleted = completedCourseCodes.has(course.code.toUpperCase());
      if (hideCompleted && isCompleted) return;

      (course.turmas || []).forEach(turma => {
        const hasSlotMatch = (turma.slots || []).some(s => {
          if (s.day !== targetSlot.dayId) return false;
          const sStart = timeToMinutes(s.start);
          const sEnd = timeToMinutes(s.end);
          return sStart < slotEndMin && sEnd > slotStartMin;
        });

        if (hasSlotMatch) {
          results.push({ course, turma, isCompleted });
        }
      });
    });

    return results;
  }, [courses, targetSlot, completedCourseCodes, hideCompleted, slotStartMin, slotEndMin]);

  // Filter matching turmas by search term
  const filteredTurmas = useMemo(() => {
    if (!searchTerm.trim()) return matchingTurmasList;
    const term = searchTerm.toLowerCase();

    return matchingTurmasList.filter(({ course, turma }) => {
      const matchCode = course.code.toLowerCase().includes(term);
      const matchName = course.name.toLowerCase().includes(term);
      const matchTurma = turma.name.toLowerCase().includes(term);
      const matchDocentes = (turma.docentes || []).some(d => d.toLowerCase().includes(term));
      return matchCode || matchName || matchTurma || matchDocentes;
    });
  }, [matchingTurmasList, searchTerm]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(6px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-color)',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(56, 189, 248, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-accent)'
            }}>
              <Clock size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Aulas em {dayLabel} às {targetSlot.start}
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Selecione uma disciplina oferecida neste horário para adicionar à sua grade.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search & Toolbar */}
        <div style={{ padding: '1rem 1.5rem 0.5rem 1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Pesquisar por código (ex: MAT154), nome da matéria ou professor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.6rem 0.6rem 2.2rem',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>

        {/* List of matching turmas */}
        <div style={{
          padding: '1rem 1.5rem',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {filteredTurmas.length === 0 ? (
            <div style={{ textAlignment: 'center', padding: '2.5rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              <AlertCircle size={36} style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Nenhuma aula oferecida encontrada para {dayLabel} às {targetSlot.start}.</p>
              {completedCourseCodes.size > 0 && hideCompleted && (
                <p style={{ fontSize: '0.8rem', color: 'var(--color-primary)', marginTop: '0.4rem' }}>
                  (O filtro "Ocultar Concluídas" está ativo com {completedCourseCodes.size} matérias ocultas).
                </p>
              )}
            </div>
          ) : (
            filteredTurmas.map(({ course, turma, isCompleted }) => {
              const isSelected = selectedTurmaIds.has(turma.id);
              const isConflict = !isSelected && checkTurmaConflict && checkTurmaConflict(turma);

              return (
                <div
                  key={turma.id}
                  style={{
                    backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-main)',
                    border: isSelected ? '1px solid rgba(16, 185, 129, 0.4)' : (isConflict ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-color)'),
                    borderRadius: 'var(--radius-lg)',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--color-accent)', fontSize: '0.95rem' }}>
                        {course.code}
                      </span>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px'
                      }}>
                        Turma {turma.name}
                      </span>
                      {isCompleted && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-success)', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                          ✓ Concluída
                        </span>
                      )}
                      {isConflict && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fca5a5', backgroundColor: 'rgba(239, 68, 68, 0.15)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                          Conflito de Horário
                        </span>
                      )}
                    </div>

                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {course.name}
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Prof.: {(turma.docentes || []).join(', ') || 'A definir'}
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
                      {(turma.slots || []).map((s, idx) => (
                        <span key={idx}>
                          {DAYS_OF_WEEK.find(d => d.id === s.day)?.label || s.day}: {s.start}-{s.end} ({s.location || 'Sala a definir'})
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    {isSelected ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        color: 'var(--color-success)',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}>
                        <Check size={16} /> Na Grade
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          onAddTurma(course, turma);
                          onClose();
                        }}
                        disabled={isConflict}
                        style={{
                          backgroundColor: isConflict ? 'var(--border-color)' : 'var(--color-primary)',
                          color: 'white',
                          border: 'none',
                          padding: '0.55rem 1.1rem',
                          borderRadius: 'var(--radius-md)',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: isConflict ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          boxShadow: isConflict ? 'none' : '0 4px 12px rgba(139, 92, 246, 0.3)'
                        }}
                      >
                        <Plus size={16} /> Adicionar
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.85rem 1.5rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justify: 'flex-end',
          backgroundColor: 'rgba(15, 23, 42, 0.4)'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1.2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'transparent',
              color: 'var(--text-main)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
