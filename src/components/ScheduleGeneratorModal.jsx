import React, { useState, useMemo } from 'react';
import { X, Sparkles, Check, ChevronLeft, ChevronRight, AlertCircle, CheckSquare, Square, Search, Upload } from 'lucide-react';
import { DAYS_OF_WEEK } from '../data/coursesData';

export default function ScheduleGeneratorModal({ 
  isOpen, 
  onClose, 
  courses = [], 
  onApplySchedule,
  onOpenImporter
}) {
  const [selectedCourseCodes, setSelectedCourseCodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [generatedOptions, setGeneratedOptions] = useState([]);
  const [currentOptionIndex, setCurrentOptionIndex] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(false);

  if (!isOpen) return null;

  const toggleCourse = (code) => {
    setSelectedCourseCodes(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code) 
        : [...prev, code]
    );
  };

  const normalizeStr = (str) => {
    return (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  };

  const filteredCourses = useMemo(() => {
    const normSearch = normalizeStr(searchTerm);
    if (!normSearch) return courses;

    return courses.filter(c => {
      const normCode = normalizeStr(c?.code);
      const normName = normalizeStr(c?.name);
      return normCode.includes(normSearch) || normName.includes(normSearch);
    });
  }, [courses, searchTerm]);

  const selectAllFiltered = () => {
    const filteredCodes = filteredCourses.map(c => c.code);
    setSelectedCourseCodes(prev => Array.from(new Set([...prev, ...filteredCodes])));
  };

  const clearSelectedCourses = () => {
    setSelectedCourseCodes([]);
  };

  const timeToMin = (t) => {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const turmasConflict = (t1, t2) => {
    const slots1 = t1?.slots || [];
    const slots2 = t2?.slots || [];

    for (const s1 of slots1) {
      for (const s2 of slots2) {
        if (s1.day === s2.day) {
          const start1 = timeToMin(s1.start);
          const end1 = timeToMin(s1.end);
          const start2 = timeToMin(s2.start);
          const end2 = timeToMin(s2.end);

          if (start1 < end2 && end1 > start2) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Fast DFS Backtracking Solver
  const generateSchedules = () => {
    const selectedCoursesList = courses.filter(c => selectedCourseCodes.includes(c.code));
    if (selectedCoursesList.length === 0) return;

    const validCombinations = [];
    const MAX_RESULTS = 50;

    const backtrack = (courseIndex, currentCombo) => {
      if (validCombinations.length >= MAX_RESULTS) return;

      if (courseIndex === selectedCoursesList.length) {
        validCombinations.push([...currentCombo]);
        return;
      }

      const course = selectedCoursesList[courseIndex];
      const turmasList = course?.turmas || [];

      for (const turma of turmasList) {
        let conflict = false;
        for (const existing of currentCombo) {
          if (turmasConflict(existing.turma, turma)) {
            conflict = true;
            break;
          }
        }

        if (!conflict) {
          currentCombo.push({ course, turma });
          backtrack(courseIndex + 1, currentCombo);
          currentCombo.pop();
        }
      }
    };

    backtrack(0, []);

    setGeneratedOptions(validCombinations);
    setCurrentOptionIndex(0);
    setHasGenerated(true);
  };

  const currentOption = generatedOptions[currentOptionIndex];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(6px)',
      zIndex: 9999, // Ensure modal is on top of everything
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
        maxWidth: '780px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-header)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={22} color="var(--color-secondary)" />
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Montador de Grade Perfeita (Matérias Obrigatórias)
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Encontra opções de turmas onde TODAS as suas matérias entram sem choque
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              color: 'var(--text-muted)',
              padding: '0.25rem',
              borderRadius: 'var(--radius-sm)' 
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {courses.length === 0 ? (
            /* Empty Catalog Warning inside Generator */
            <div style={{
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-lg)',
              border: '2px dashed var(--color-accent)',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Upload size={24} />
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Nenhuma Disciplina Importada Ainda!
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.3rem', lineHeight: '1.4' }}>
                  Para gerar suas opções de grade perfeitas, primeiro você precisa importar o arquivo PDF da Relação de Turmas do SIGA.
                </p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  if (onOpenImporter) onOpenImporter();
                }}
                style={{
                  backgroundColor: 'var(--color-secondary)',
                  color: '#0f172a',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <Sparkles size={18} />
                Importar PDF do SIGA Agora
              </button>
            </div>
          ) : (
            <>
              {/* Step 1: Select Required Courses */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    1. Marque as disciplinas que você PRECISA cursar este período:
                  </h3>
                  <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
                    <button 
                      onClick={selectAllFiltered}
                      style={{ color: 'var(--color-accent)', fontWeight: 600 }}
                    >
                      Marcar Visíveis
                    </button>
                    <span style={{ color: 'var(--border-color)' }}>|</span>
                    <button 
                      onClick={clearSelectedCourses}
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Desmarcar Todas
                    </button>
                  </div>
                </div>

                {/* Search Input inside Generator Modal */}
                <div style={{ position: 'relative', marginBottom: '0.6rem' }}>
                  <Search 
                    size={15} 
                    style={{ 
                      position: 'absolute', 
                      left: '10px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      color: 'var(--text-muted)' 
                    }} 
                  />
                  <input 
                    type="text" 
                    placeholder="Pesquisar matéria por código ou nome (ex: MAT013)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.45rem 0.6rem 0.45rem 2rem',
                      backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-main)',
                      fontSize: '0.825rem'
                    }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  maxHeight: '180px',
                  overflowY: 'auto',
                  backgroundColor: 'var(--bg-main)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)'
                }}>
                  {filteredCourses.length === 0 ? (
                    <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      Nenhuma matéria encontrada para "{searchTerm}".
                    </span>
                  ) : (
                    filteredCourses.map(course => {
                      const isSelected = selectedCourseCodes.includes(course.code);
                      return (
                        <button
                          key={course.code}
                          onClick={() => toggleCourse(course.code)}
                          style={{
                            padding: '0.4rem 0.75rem',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--bg-card)',
                            color: isSelected ? '#ffffff' : 'var(--text-main)',
                            border: isSelected ? '1px solid var(--color-accent)' : '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          {isSelected ? <CheckSquare size={14} color="var(--color-accent)" /> : <Square size={14} color="var(--text-muted)" />}
                          <strong>{course.code}</strong> - {course.name}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={generateSchedules}
                disabled={selectedCourseCodes.length === 0}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: selectedCourseCodes.length === 0 ? 'var(--bg-main)' : 'var(--color-secondary)',
                  color: selectedCourseCodes.length === 0 ? 'var(--text-muted)' : '#0f172a',
                  fontWeight: 700,
                  fontSize: '0.925rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: selectedCourseCodes.length === 0 ? 'not-allowed' : 'pointer',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <Sparkles size={18} />
                Gerar Grades ({selectedCourseCodes.length} matérias marcadas)
              </button>

              {/* Results section */}
              {hasGenerated && (
                <div style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  {generatedOptions.length === 0 ? (
                    <div style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      border: '1px dashed #ef4444',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1rem',
                      color: '#ef4444',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <AlertCircle size={22} style={{ flexShrink: 0 }} />
                      <span>
                        Não encontramos nenhuma combinação de turmas onde <strong>todas as {selectedCourseCodes.length} matérias</strong> entrem sem choque de horários simultaneamente. Tente desmarcar uma disciplina conflitante!
                      </span>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                          🎉 {generatedOptions.length} grades perfeitas encontradas onde TODAS entram!
                        </span>

                        {/* Pagination Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            onClick={() => setCurrentOptionIndex(prev => Math.max(0, prev - 1))}
                            disabled={currentOptionIndex === 0}
                            style={{
                              padding: '0.3rem 0.5rem',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'var(--bg-main)',
                              color: 'var(--text-main)',
                              opacity: currentOptionIndex === 0 ? 0.4 : 1,
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <ChevronLeft size={18} />
                          </button>
                          <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                            Grade <strong>{currentOptionIndex + 1}</strong> de <strong>{generatedOptions.length}</strong>
                          </span>
                          <button
                            onClick={() => setCurrentOptionIndex(prev => Math.min(generatedOptions.length - 1, prev + 1))}
                            disabled={currentOptionIndex === generatedOptions.length - 1}
                            style={{
                              padding: '0.3rem 0.5rem',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'var(--bg-main)',
                              color: 'var(--text-main)',
                              opacity: currentOptionIndex === generatedOptions.length - 1 ? 0.4 : 1,
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Schedule Option Preview */}
                      {currentOption && (
                        <div style={{
                          backgroundColor: 'var(--bg-main)',
                          borderRadius: 'var(--radius-lg)',
                          padding: '1rem',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem'
                        }}>
                          <h4 style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                            Turmas escolhidas nesta opção ({currentOption.length} matérias):
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {currentOption.map((item, idx) => (
                              <div 
                                key={idx}
                                style={{
                                  backgroundColor: 'var(--bg-card)',
                                  padding: '0.6rem 0.85rem',
                                  borderRadius: 'var(--radius-md)',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  fontSize: '0.8rem',
                                  borderLeft: '4px solid var(--color-primary)'
                                }}
                              >
                                <div>
                                  <strong style={{ color: 'var(--text-main)' }}>{item.course.code} (Turma {item.turma.turma})</strong> - {item.course.name}
                                  {item.turma.docentes && item.turma.docentes.length > 0 && (
                                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block' }}>
                                      Prof: {item.turma.docentes.join(', ')}
                                    </span>
                                  )}
                                </div>

                                <div style={{ fontSize: '0.725rem', color: 'var(--color-accent)', fontWeight: 600, textAlign: 'right' }}>
                                  {(item.turma.slots || []).map(s => {
                                    const d = DAYS_OF_WEEK.find(day => day.id === s.day);
                                    return `${d?.label} ${s.start}-${s.end}`;
                                  }).join(' | ')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Apply schedule button */}
                      <button
                        onClick={() => {
                          if (currentOption) {
                            onApplySchedule(currentOption);
                            onClose();
                          }
                        }}
                        style={{
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--color-primary)',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          boxShadow: 'var(--shadow-md)'
                        }}
                      >
                        <Check size={18} />
                        Aplicar Esta Grade no Meu Calendário
                      </button>
                    </>
                  )}
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
}
