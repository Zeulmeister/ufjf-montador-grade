import React, { useState, useEffect, useRef, useMemo } from 'react';
import html2canvas from 'html2canvas';

import Header from './components/Header';
import TimetableGrid from './components/TimetableGrid';
import CourseCatalog from './components/CourseCatalog';
import CustomCourseModal from './components/CustomCourseModal';
import SavedDraftsModal from './components/SavedDraftsModal';
import SigaImporterModal from './components/SigaImporterModal';
import HistoricoModal from './components/HistoricoModal';
import TutorialModal from './components/TutorialModal';

import { initialCourses, COURSE_COLORS } from './data/coursesData';
import { PRESET_CURRICULUMS } from './utils/curriculumParser';

export default function App() {
  const [theme, setTheme] = useState('dark');
  
  const [academicPeriod, setAcademicPeriod] = useState(() => {
    return localStorage.getItem('ufjf_academic_period') || '2026/3';
  });

  const [courses, setCourses] = useState(() => {
    const savedCustom = localStorage.getItem('ufjf_custom_courses');
    return savedCustom ? JSON.parse(savedCustom) : initialCourses;
  });

  // Permanently preset Engenharia Computacional UFJF Curriculum
  const [curriculumData] = useState(PRESET_CURRICULUMS[0]);

  // Active selected turmas in schedule: array of { course, turma }
  const [selectedTurmas, setSelectedTurmas] = useState(() => {
    const saved = localStorage.getItem('ufjf_selected_turmas');
    return saved ? JSON.parse(saved) : [];
  });

  // Saved draft schedules
  const [savedDrafts, setSavedDrafts] = useState(() => {
    const saved = localStorage.getItem('ufjf_saved_drafts');
    return saved ? JSON.parse(saved) : [];
  });

  // Completed Course Codes from Histórico Escolar
  const [completedCourseCodes, setCompletedCourseCodes] = useState(() => {
    const saved = localStorage.getItem('ufjf_completed_courses');
    return new Set(saved ? JSON.parse(saved) : []);
  });

  const [hideCompleted, setHideCompleted] = useState(() => {
    const saved = localStorage.getItem('ufjf_hide_completed');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Modals state
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);
  const [isSigaImporterOpen, setIsSigaImporterOpen] = useState(false);
  const [isHistoricoOpen, setIsHistoricoOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const gridRef = useRef(null);

  // Sync theme to root class
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  // Persist selected turmas
  useEffect(() => {
    localStorage.setItem('ufjf_selected_turmas', JSON.stringify(selectedTurmas));
  }, [selectedTurmas]);

  // Persist drafts
  useEffect(() => {
    localStorage.setItem('ufjf_saved_drafts', JSON.stringify(savedDrafts));
  }, [savedDrafts]);

  // Persist academic period
  useEffect(() => {
    localStorage.setItem('ufjf_academic_period', academicPeriod);
  }, [academicPeriod]);

  // Map each course code to a unique color index
  const courseColorMap = useMemo(() => {
    const map = {};
    let colorIdx = 0;
    courses.forEach((c) => {
      if (!(c.code in map)) {
        map[c.code] = colorIdx % COURSE_COLORS.length;
        colorIdx++;
      }
    });
    return map;
  }, [courses]);

  // Total hours calculation
  const totalHours = useMemo(() => {
    let totalMin = 0;
    selectedTurmas.forEach(({ turma }) => {
      (turma.slots || []).forEach(slot => {
        const [sh, sm] = slot.start.split(':').map(Number);
        const [eh, em] = slot.end.split(':').map(Number);
        totalMin += (eh * 60 + em) - (sh * 60 + sm);
      });
    });
    return Math.round(totalMin / 60);
  }, [selectedTurmas]);

  // Check if a target turma conflicts with currently selected turmas
  const checkTurmaConflict = (targetTurma) => {
    for (const { turma: selTurma } of selectedTurmas) {
      if (selTurma.id === targetTurma.id) continue;

      for (const slot1 of (targetTurma.slots || [])) {
        for (const slot2 of (selTurma.slots || [])) {
          if (slot1.day === slot2.day) {
            const [s1h, s1m] = slot1.start.split(':').map(Number);
            const [e1h, e1m] = slot1.end.split(':').map(Number);
            const [s2h, s2m] = slot2.start.split(':').map(Number);
            const [e2h, e2m] = slot2.end.split(':').map(Number);

            const start1 = s1h * 60 + s1m;
            const end1 = e1h * 60 + e1m;
            const start2 = s2h * 60 + s2m;
            const end2 = e2h * 60 + e2m;

            if (start1 < end2 && end1 > start2) {
              return true; // Overlap detected
            }
          }
        }
      }
    }
    return false;
  };

  // Add turma (replaces existing section of same course if added)
  const handleAddTurma = (course, turma) => {
    setSelectedTurmas(prev => {
      const filtered = prev.filter(item => item.course.code !== course.code);
      return [...filtered, { course, turma }];
    });
  };

  const handleRemoveTurma = (turmaId) => {
    setSelectedTurmas(prev => prev.filter(item => item.turma.id !== turmaId));
  };

  const handleClearAll = () => {
    if (window.confirm("Deseja realmente limpar toda a sua grade atual?")) {
      setSelectedTurmas([]);
    }
  };

  // Reset entire catalog to zero courses
  const handleResetCatalog = () => {
    if (window.confirm("Deseja apagar todas as disciplinas importadas do seu catálogo?")) {
      setCourses([]);
      setSelectedTurmas([]);
      localStorage.removeItem('ufjf_custom_courses');
      localStorage.removeItem('ufjf_selected_turmas');
    }
  };

  // Export grid to PNG image with high resolution
  const handleExport = async () => {
    if (!gridRef.current) return;
    try {
      const canvas = await html2canvas(gridRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff'
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      const safePeriod = (academicPeriod || 'periodo').replace('/', '_');
      link.download = `grade_ufjf_${safePeriod}.png`;
      link.click();
    } catch (err) {
      console.error("Erro ao exportar imagem:", err);
      alert("Não foi possível exportar a imagem. Tente tirar uma captura de tela.");
    }
  };

  // Custom course addition
  const handleAddCustomCourse = (newCourse) => {
    setCourses(prev => {
      const copy = [...prev, newCourse];
      localStorage.setItem('ufjf_custom_courses', JSON.stringify(copy));
      return copy;
    });
    
    if (newCourse.turmas.length > 0) {
      handleAddTurma(newCourse, newCourse.turmas[0]);
    }
  };

  // Import completed courses from Histórico Escolar
  const handleImportHistorico = (passedCodes, headerInfo) => {
    setCompletedCourseCodes(prev => {
      const updated = new Set([...prev, ...passedCodes.map(c => c.toUpperCase())]);
      localStorage.setItem('ufjf_completed_courses', JSON.stringify(Array.from(updated)));
      return updated;
    });
    setHideCompleted(true);
    localStorage.setItem('ufjf_hide_completed', JSON.stringify(true));
  };

  const handleToggleCourseCompleted = (code) => {
    const cleanCode = code.toUpperCase();
    setCompletedCourseCodes(prev => {
      const updated = new Set(prev);
      if (updated.has(cleanCode)) {
        updated.delete(cleanCode);
      } else {
        updated.add(cleanCode);
      }
      localStorage.setItem('ufjf_completed_courses', JSON.stringify(Array.from(updated)));
      return updated;
    });
  };

  const handleToggleHideCompleted = () => {
    setHideCompleted(prev => {
      const next = !prev;
      localStorage.setItem('ufjf_hide_completed', JSON.stringify(next));
      return next;
    });
  };

  // Import courses from SIGA parser
  const handleImportSigaCourses = (importedCourses, newPeriod) => {
    if (newPeriod) {
      setAcademicPeriod(newPeriod);
    }

    setCourses(prev => {
      const coursesMap = new Map();
      prev.forEach(c => {
        coursesMap.set(c.code, { ...c, turmas: [...c.turmas] });
      });

      importedCourses.forEach(imp => {
        if (!coursesMap.has(imp.code)) {
          coursesMap.set(imp.code, { ...imp, turmas: [...imp.turmas] });
        } else {
          const existing = coursesMap.get(imp.code);
          imp.turmas.forEach(newTurma => {
            const turmIdx = existing.turmas.findIndex(t => t.turma === newTurma.turma);
            if (turmIdx >= 0) {
              existing.turmas[turmIdx] = newTurma;
            } else {
              existing.turmas.push(newTurma);
            }
          });
        }
      });

      const updated = Array.from(coursesMap.values());
      localStorage.setItem('ufjf_custom_courses', JSON.stringify(updated));
      return updated;
    });
  };

  // Save current draft
  const handleSaveCurrentDraft = (name) => {
    const newDraft = {
      name,
      date: new Date().toLocaleDateString('pt-BR'),
      items: selectedTurmas
    };
    setSavedDrafts(prev => [...prev, newDraft]);
  };

  const handleLoadDraft = (draft) => {
    setSelectedTurmas(draft.items);
  };

  const handleDeleteDraft = (index) => {
    setSavedDrafts(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header Navigation */}
      <Header 
        theme={theme}
        setTheme={setTheme}
        selectedCount={selectedTurmas.length}
        totalHours={totalHours}
        academicPeriod={academicPeriod}
        onUpdateAcademicPeriod={setAcademicPeriod}
        onClear={handleClearAll}
        onExport={handleExport}
        onOpenDrafts={() => setIsDraftsOpen(true)}
        onOpenAddCustom={() => setIsAddCustomOpen(true)}
        onOpenSigaImporter={() => setIsSigaImporterOpen(true)}
        onOpenHistorico={() => setIsHistoricoOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
      />

      {/* Main Workspace Layout */}
      <main style={{
        flex: 1,
        maxWidth: '1600px',
        width: '100%',
        margin: '0 auto',
        padding: '1.25rem',
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 380px) 1fr',
        gap: '1.25rem',
        alignItems: 'start'
      }}>
        
        {/* Left Side: Course Catalog */}
        <CourseCatalog 
          courses={courses}
          selectedTurmas={selectedTurmas}
          curriculumData={curriculumData}
          completedCourseCodes={completedCourseCodes}
          hideCompleted={hideCompleted}
          onToggleHideCompleted={handleToggleHideCompleted}
          onToggleCourseCompleted={handleToggleCourseCompleted}
          onAddTurma={handleAddTurma}
          onRemoveTurma={handleRemoveTurma}
          checkTurmaConflict={checkTurmaConflict}
          onOpenSigaImporter={() => setIsSigaImporterOpen(true)}
          onOpenHistorico={() => setIsHistoricoOpen(true)}
          onResetCatalog={handleResetCatalog}
          onOpenTutorial={() => setIsTutorialOpen(true)}
        />

        {/* Right Side: Interactive Timetable Grid */}
        <TimetableGrid 
          selectedTurmas={selectedTurmas}
          onRemoveTurma={handleRemoveTurma}
          gridRef={gridRef}
          courseColorMap={courseColorMap}
          academicPeriod={academicPeriod}
        />

      </main>

      {/* Modals */}
      <CustomCourseModal 
        isOpen={isAddCustomOpen}
        onClose={() => setIsAddCustomOpen(false)}
        onAddCustomCourse={handleAddCustomCourse}
      />

      <SavedDraftsModal 
        isOpen={isDraftsOpen}
        onClose={() => setIsDraftsOpen(false)}
        savedDrafts={savedDrafts}
        onLoadDraft={handleLoadDraft}
        onDeleteDraft={handleDeleteDraft}
      />

      <SigaImporterModal 
        isOpen={isSigaImporterOpen}
        onClose={() => setIsSigaImporterOpen(false)}
        onImportCourses={handleImportSigaCourses}
      />

      <HistoricoModal
        isOpen={isHistoricoOpen}
        onClose={() => setIsHistoricoOpen(false)}
        onImportHistorico={handleImportHistorico}
      />

      <TutorialModal 
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onOpenImporter={() => setIsSigaImporterOpen(true)}
      />

    </div>
  );
}
