import React, { useState, useMemo } from 'react';
import { X, Search, Clock, Plus, Check, GraduationCap, AlertCircle, Calendar, Lock, Building2 } from 'lucide-react';
import { DAYS_OF_WEEK } from '../data/coursesData';

const DEPARTMENT_NAMES = {
  'MAT': 'DEP MAT - Departamento de Matemática',
  'FIS': 'DEP FIS - Departamento de Física',
  'DCC': 'DEP DCC - Departamento de Ciência da Computação',
  'DC5': 'DEP DCC - Departamento de Ciência da Computação (Prática)',
  'MAC': 'DEP MAC - Mecânica Aplicada e Computacional',
  'QUI': 'DEP QUI - Departamento de Química',
  'EADQUI': 'DEP QUI - Departamento de Química (EAD)',
  'EST': 'DEP EST - Departamento de Estatística',
  'ICE': 'DEP ICE - Instituto de Ciências Exatas',
  'ESA': 'DEP ESA - Engenharia Sanitária e Ambiental',
  'ENE': 'DEP ENE - Engenharia Elétrica',
  'MEC': 'DEP MEC - Engenharia Mecânica',
  'CEL': 'DEP CEL - Engenharia de Controle'
};

function getDepartmentName(code) {
  const prefix = (code || '').toUpperCase().substring(0, 3);
  return DEPARTMENT_NAMES[prefix] || `DEP ${prefix} - Departamento ${prefix}`;
}

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
          // Check prerequisites
          const prereqs = course.prereqs || [];
          const missingPrereqs = prereqs.filter(p => !completedCourseCodes.has(p.toUpperCase()));
          const hasPrereqsMet = missingPrereqs.length === 0;

          results.push({ 
            course, 
            turma, 
            isCompleted, 
            prereqs, 
            missingPrereqs, 
            hasPrereqsMet 
          });
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
      const matchTurma = (turma.name || '').toLowerCase().includes(term);
      const matchDocentes = (turma.docentes || []).some(d => d.toLowerCase().includes(term));
      return matchCode || matchName || matchTurma || matchDocentes;
    });
  }, [matchingTurmasList, searchTerm]);

  // Group filtered turmas by Department
  const groupedByDepartment = useMemo(() => {
    const groups = {};
    filteredTurmas.forEach(item => {
      const deptName = getDepartmentName(item.course.code);
      if (!groups[deptName]) groups[deptName] = [];
      groups[deptName].push(item);
    });
    return groups;
  }, [filteredTurmas]);

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
        maxWidth: '720px',
        maxHeight: '88vh',
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
                Disciplinas divididas por departamento oferecidas neste horário.
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

        {/* List of matching turmas grouped by Department */}
        <div style={{
          padding: '1rem 1.5rem',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {filteredTurmas.length === 0 ? (
            <div style={{ padding: '2.5rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              <AlertCircle size={36} style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Nenhuma aula oferecida encontrada para {dayLabel} às {targetSlot.start}.</p>
              {completedCourseCodes.size > 0 && hideCompleted && (
                <p style={{ fontSize: '0.8rem', color: 'var(--color-primary)', marginTop: '0.4rem' }}>
                  (O filtro "Ocultar Concluídas" está ativo com {completedCourseCodes.size} matérias ocultas).
                </p>
              )}
            </div>
          ) : (
            Object.entries(groupedByDepartment).map(([deptName, turmasInDept]) => (
              <div key={deptName} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {/* Department Header Banner */}
                <div style={{
                  fontSize: '0.825rem',
                  fontWeight: 800,
                  color: 'var(--color-accent)',
                  backgroundColor: 'var(--bg-main)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <Building2 size={15} /> {deptName} ({turmasInDept.length} matéria{turmasInDept.length > 1 ? 's' : ''})
                </div>

                {/* Turmas in this Department */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {turmasInDept.map(({ course, turma, isCompleted, prereqs, missingPrereqs, hasPrereqsMet }) => {
                    const isSelected = selectedTurmaIds.has(turma.id);
                    const isConflict = !isSelected && checkTurmaConflict && checkTurmaConflict(turma);

                    return (
                      <div
                        key={turma.id}
                        style={{
                          backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-main)',
                          border: isSelected 
                            ? '1px solid rgba(16, 185, 129, 0.4)' 
                            : !hasPrereqsMet 
                              ? '1px solid rgba(239, 68, 68, 0.3)' 
                              : (isConflict ? '1px dashed rgba(239, 68, 68, 0.4)' : '1px solid var(--border-color)'),
                          borderRadius: 'var(--radius-lg)',
                          padding: '0.85rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          opacity: !hasPrereqsMet && !isSelected ? 0.75 : 1
                        }}
                      >
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
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
                            {!hasPrereqsMet && !isCompleted && (
                              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.15)', padding: '0.1rem 0.4rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                <Lock size={10} /> Requer {missingPrereqs.join(', ')}
                              </span>
                            )}
                            {isConflict && hasPrereqsMet && (
                              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fca5a5', backgroundColor: 'rgba(239, 68, 68, 0.15)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                Conflito de Horário
                              </span>
                            )}
                          </div>

                          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                            {course.name}
                          </div>

                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Prof.: {(turma.docentes || []).join(', ') || 'A definir'}
                          </div>

                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', marginTop: '0.1rem' }}>
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
                              fontSize: '0.825rem',
                              backgroundColor: 'rgba(16, 185, 129, 0.15)',
                              padding: '0.35rem 0.75rem',
                              borderRadius: 'var(--radius-md)'
                            }}>
                              <Check size={14} /> Adicionada
                            </span>
                          ) : !hasPrereqsMet ? (
                            <button
                              onClick={() => {
                                alert(`Você ainda não concluiu os pré-requisitos desta matéria (${missingPrereqs.join(', ')}). Marque-as como concluídas no menu 'Meu Histórico' para liberar.`);
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                color: '#ef4444',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                padding: '0.35rem 0.75rem',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer'
                              }}
                              title={`Pré-requisitos pendentes: ${missingPrereqs.join(', ')}`}
                            >
                              <Lock size={13} /> Bloqueada
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                onAddTurma(course, turma);
                                onClose();
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                backgroundColor: 'var(--color-primary)',
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '0.825rem',
                                padding: '0.4rem 0.85rem',
                                borderRadius: 'var(--radius-md)',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: 'var(--shadow-sm)'
                              }}
                            >
                              <Plus size={14} /> Adicionar
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
