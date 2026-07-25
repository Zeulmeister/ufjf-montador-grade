import React, { useState, useMemo } from 'react';
import { Search, Plus, AlertCircle, ChevronDown, ChevronUp, User, MapPin, Filter, Upload, Sparkles, Trash2, HelpCircle, BookOpen, Layers, Globe, X } from 'lucide-react';
import { DAYS_OF_WEEK } from '../data/coursesData';

export default function CourseCatalog({ 
  courses, 
  selectedTurmas, 
  curriculumData,
  onAddTurma, 
  onRemoveTurma,
  checkTurmaConflict,
  onOpenSigaImporter,
  onOpenCurriculumModal,
  onResetCatalog,
  onOpenTutorial
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDayFilter, setSelectedDayFilter] = useState('all');
  const [selectedShiftFilter, setSelectedShiftFilter] = useState('all');
  const [selectedPeriodFilter, setSelectedPeriodFilter] = useState('all');
  const [expandedCourse, setExpandedCourse] = useState(null);

  const selectedTurmaIds = useMemo(() => {
    return new Set(selectedTurmas.map(t => t.turma.id));
  }, [selectedTurmas]);

  // Helper to normalize strings for robust search
  const normalizeStr = (str) => {
    return (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  };

  // Map each course code to its period name in the imported curriculum
  const coursePeriodMap = useMemo(() => {
    const map = {};
    if (curriculumData && curriculumData.periods) {
      curriculumData.periods.forEach(p => {
        p.courses.forEach(c => {
          map[c.code.toUpperCase()] = p.periodName;
        });
      });
    }
    return map;
  }, [curriculumData]);

  // Available periods list from curriculum
  const availablePeriods = useMemo(() => {
    if (!curriculumData || !curriculumData.periods) return [];
    return curriculumData.periods.map(p => p.periodName);
  }, [curriculumData]);

  // Filtered courses logic
  const filteredCourses = useMemo(() => {
    const normSearch = normalizeStr(searchTerm);

    return courses.filter(course => {
      const normCode = normalizeStr(course.code);
      const normName = normalizeStr(course.name);
      const normTeachers = normalizeStr(course.turmas.flatMap(t => t.docentes).join(' '));

      const matchesSearch = !normSearch || 
        normCode.includes(normSearch) || 
        normName.includes(normSearch) || 
        normTeachers.includes(normSearch);

      if (!matchesSearch) return false;

      // If user typed a search term, OVERRIDE period filter so they can find ANY course instantly!
      if (!normSearch && selectedPeriodFilter !== 'all') {
        const coursePeriod = coursePeriodMap[course.code.toUpperCase()];
        if (coursePeriod !== selectedPeriodFilter) return false;
      }

      // Filter by day if selected
      if (selectedDayFilter !== 'all') {
        const hasDay = course.turmas.some(t => t.slots.some(s => s.day === selectedDayFilter));
        if (!hasDay) return false;
      }

      // Filter by shift
      if (selectedShiftFilter !== 'all') {
        const hasShift = course.turmas.some(t => {
          return t.slots.some(s => {
            const startH = parseInt(s.start.split(':')[0], 10);
            if (selectedShiftFilter === 'manha' && startH < 12) return true;
            if (selectedShiftFilter === 'tarde' && startH >= 12 && startH < 18) return true;
            if (selectedShiftFilter === 'noite' && startH >= 18) return true;
            return false;
          });
        });
        if (!hasShift) return false;
      }

      return true;
    });
  }, [courses, searchTerm, selectedDayFilter, selectedShiftFilter, selectedPeriodFilter, coursePeriodMap]);

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-color)',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      boxShadow: 'var(--shadow-md)',
      height: '100%',
      maxHeight: 'calc(100vh - 120px)',
      overflowY: 'auto'
    }}>
      
      {/* Header title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            Catálogo de Disciplinas
          </h2>
          {curriculumData && (
            <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
              🎓 {curriculumData.courseName} ({availablePeriods.length} períodos)
            </span>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            onClick={onOpenCurriculumModal}
            style={{
              fontSize: '0.725rem',
              color: 'var(--color-secondary)',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Importar ou alterar Matriz Curricular por Períodos"
          >
            <BookOpen size={13} /> {curriculumData ? 'Alterar Matriz' : '+ Matriz do Curso'}
          </button>

          {courses.length > 0 && (
            <button
              onClick={onResetCatalog}
              style={{
                fontSize: '0.725rem',
                color: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '0.25rem 0.5rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
              title="Apagar todas as matérias importadas no catálogo"
            >
              <Trash2 size={12} /> Limpar
            </button>
          )}
        </div>
      </div>

      {courses.length > 0 && (
        <>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search 
              size={16} 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--text-muted)' 
              }} 
            />
            <input 
              type="text" 
              placeholder="Pesquise QUALQUER matéria por código ou nome..."
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
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            
            {/* Period Filters if Curriculum Data exists */}
            {availablePeriods.length > 0 && (
              <div style={{
                backgroundColor: 'var(--bg-main)',
                padding: '0.5rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Layers size={13} /> Período do Curso:
                  </span>
                  {selectedPeriodFilter !== 'all' && (
                    <button
                      onClick={() => setSelectedPeriodFilter('all')}
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--color-accent)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                    >
                      <Globe size={11} /> Ver Todas ({courses.length})
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setSelectedPeriodFilter('all')}
                    style={{
                      fontSize: '0.725rem',
                      padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600,
                      backgroundColor: selectedPeriodFilter === 'all' ? 'var(--color-secondary)' : 'var(--bg-card)',
                      color: selectedPeriodFilter === 'all' ? '#0f172a' : 'var(--text-muted)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    Todas ({courses.length})
                  </button>

                  {availablePeriods.map(pName => {
                    const countInPeriod = courses.filter(c => coursePeriodMap[c.code.toUpperCase()] === pName).length;
                    return (
                      <button
                        key={pName}
                        onClick={() => setSelectedPeriodFilter(pName)}
                        style={{
                          fontSize: '0.725rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: 600,
                          backgroundColor: selectedPeriodFilter === pName ? 'var(--color-secondary)' : 'var(--bg-card)',
                          color: selectedPeriodFilter === pName ? '#0f172a' : 'var(--text-muted)',
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        {pName} {countInPeriod > 0 ? `(${countInPeriod})` : ''}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Shifts & Days */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Filter size={12} /> Turno:
              </span>
              {[
                { id: 'all', label: 'Todos' },
                { id: 'manha', label: 'Manhã' },
                { id: 'tarde', label: 'Tarde' },
                { id: 'noite', label: 'Noite' }
              ].map(shift => (
                <button
                  key={shift.id}
                  onClick={() => setSelectedShiftFilter(shift.id)}
                  style={{
                    fontSize: '0.725rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: selectedShiftFilter === shift.id ? 'var(--color-primary)' : 'var(--bg-main)',
                    color: selectedShiftFilter === shift.id ? '#fff' : 'var(--text-muted)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  {shift.label}
                </button>
              ))}

              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>Dia:</span>
              <button
                onClick={() => setSelectedDayFilter('all')}
                style={{
                  fontSize: '0.725rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: selectedDayFilter === 'all' ? 'var(--color-primary)' : 'var(--bg-main)',
                  color: selectedDayFilter === 'all' ? '#fff' : 'var(--text-muted)',
                  border: '1px solid var(--border-color)'
                }}
              >
                Todos
              </button>
              {DAYS_OF_WEEK.map(day => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDayFilter(day.id)}
                  style={{
                    fontSize: '0.725rem',
                    padding: '0.2rem 0.4rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: selectedDayFilter === day.id ? 'var(--color-primary)' : 'var(--bg-main)',
                    color: selectedDayFilter === day.id ? '#fff' : 'var(--text-muted)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  {day.label}
                </button>
              ))}
            </div>

          </div>
        </>
      )}

      {/* Empty State Banner when no courses imported */}
      {courses.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-main)',
          borderRadius: 'var(--radius-lg)',
          border: '2px dashed var(--color-accent)',
          padding: '2rem 1.25rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '0.5rem'
        }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            color: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Upload size={28} />
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Seu Catálogo Está Vazio!
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: '1.4' }}>
              Baixe a <strong>Relação de Turmas em PDF</strong> no SIGA e envie aqui para carregar todas as disciplinas.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
            <button
              onClick={onOpenSigaImporter}
              style={{
                backgroundColor: 'var(--color-secondary)',
                color: '#0f172a',
                fontWeight: 700,
                fontSize: '0.9rem',
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <Sparkles size={18} />
              Importar PDF do SIGA
            </button>

            <button
              onClick={onOpenCurriculumModal}
              style={{
                backgroundColor: 'var(--bg-card)',
                color: 'var(--color-secondary)',
                border: '1px solid var(--border-color)',
                fontWeight: 600,
                fontSize: '0.825rem',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <BookOpen size={15} /> Importar Matriz Curricular por Períodos
            </button>

            <button
              onClick={onOpenTutorial}
              style={{
                backgroundColor: 'var(--bg-card)',
                color: 'var(--color-accent)',
                border: '1px solid var(--border-color)',
                fontWeight: 600,
                fontSize: '0.825rem',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <HelpCircle size={15} /> Ver Passo a Passo (Tutorial)
            </button>
          </div>

        </div>
      ) : (
        /* Courses List */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.25rem' }}>
          {filteredCourses.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>Nenhuma disciplina encontrada para este período.</span>
              <button
                onClick={() => setSelectedPeriodFilter('all')}
                style={{
                  fontSize: '0.775rem',
                  color: 'var(--color-accent)',
                  fontWeight: 700,
                  textDecoration: 'underline'
                }}
              >
                Clique aqui para ver todas as matérias do catálogo ({courses.length})
              </button>
            </div>
          ) : (
            filteredCourses.map(course => {
              const isSearching = searchTerm.trim().length > 0;
              const isExpanded = isSearching || expandedCourse === course.code;
              const hasAnySelected = course.turmas.some(t => selectedTurmaIds.has(t.id));
              const coursePeriod = coursePeriodMap[course.code.toUpperCase()];

              return (
                <div 
                  key={course.code}
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: 'var(--radius-lg)',
                    border: hasAnySelected ? '1px solid var(--color-accent)' : '1px solid var(--border-color)',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s ease'
                  }}
                >
                  {/* Course Header */}
                  <div 
                    onClick={() => setExpandedCourse(isExpanded && !isSearching ? null : course.code)}
                    style={{
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          backgroundColor: 'var(--bg-card)',
                          padding: '0.15rem 0.4rem',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--color-accent)'
                        }}>
                          {course.code}
                        </span>
                        {coursePeriod && (
                          <span style={{
                            fontSize: '0.68rem',
                            backgroundColor: 'rgba(245, 158, 11, 0.2)',
                            color: 'var(--color-secondary)',
                            padding: '0.1rem 0.4rem',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: 700
                          }}>
                            {coursePeriod}
                          </span>
                        )}
                        {hasAnySelected && (
                          <span style={{
                            fontSize: '0.68rem',
                            backgroundColor: 'rgba(56, 189, 248, 0.2)',
                            color: 'var(--color-accent)',
                            padding: '0.1rem 0.4rem',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: 600
                          }}>
                            Na Grade
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginTop: '2px', color: 'var(--text-main)' }}>
                        {course.name}
                      </h3>
                    </div>

                    <div style={{ color: 'var(--text-muted)' }}>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {/* Turmas list when expanded */}
                  {isExpanded && (
                    <div style={{
                      borderTop: '1px solid var(--border-color)',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      {course.turmas.map(turma => {
                        const isSelected = selectedTurmaIds.has(turma.id);
                        const hasConflict = !isSelected && checkTurmaConflict(turma);

                        return (
                          <div 
                            key={turma.id}
                            style={{
                              backgroundColor: 'var(--bg-card)',
                              borderRadius: 'var(--radius-md)',
                              padding: '0.6rem 0.75rem',
                              border: isSelected 
                                ? '1px solid var(--color-accent)' 
                                : hasConflict 
                                  ? '1px dashed rgba(239, 68, 68, 0.5)' 
                                  : '1px solid var(--border-color)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.35rem'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <strong style={{ fontSize: '0.825rem', color: 'var(--text-main)' }}>
                                Turma {turma.turma}
                              </strong>

                              {isSelected ? (
                                <button
                                  onClick={() => onRemoveTurma(turma.id)}
                                  style={{
                                    fontSize: '0.725rem',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                                    color: '#ef4444',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}
                                >
                                  Remover
                                </button>
                              ) : (
                                <button
                                  onClick={() => onAddTurma(course, turma)}
                                  style={{
                                    fontSize: '0.725rem',
                                    padding: '0.25rem 0.6rem',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: hasConflict ? 'rgba(239, 68, 68, 0.15)' : 'var(--color-primary)',
                                    color: hasConflict ? '#ef4444' : '#ffffff',
                                    border: hasConflict ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}
                                >
                                  {hasConflict ? (
                                    <>
                                      <AlertCircle size={12} /> Com Conflito
                                    </>
                                  ) : (
                                    <>
                                      <Plus size={12} /> Adicionar
                                    </>
                                  )}
                                </button>
                              )}
                            </div>

                            {/* Professor */}
                            {turma.docentes && turma.docentes.length > 0 && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <User size={12} /> {turma.docentes.join(', ')}
                              </div>
                            )}

                            {/* Slots */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                              {turma.slots.length === 0 ? (
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                  Horário a definir / EAD
                                </span>
                              ) : (
                                turma.slots.map((s, idx) => {
                                  const dayObj = DAYS_OF_WEEK.find(d => d.id === s.day);
                                  return (
                                    <div 
                                      key={idx}
                                      style={{
                                        fontSize: '0.725rem',
                                        color: 'var(--text-main)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        backgroundColor: 'var(--bg-main)',
                                        padding: '2px 6px',
                                        borderRadius: '4px'
                                      }}
                                    >
                                      <span style={{ fontWeight: 600, color: 'var(--color-accent)' }}>
                                        {dayObj?.label}
                                      </span>
                                      <span>{s.start} - {s.end}</span>
                                      {s.room && (
                                        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                          <MapPin size={10} /> {s.room}
                                        </span>
                                      )}
                                    </div>
                                  );
                                })
                              )}
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
}
