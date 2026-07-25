import React from 'react';
import { Calendar, Moon, Sun, Download, Trash2, Bookmark, PlusCircle, Upload, HelpCircle, Edit3, BookOpen } from 'lucide-react';

export default function Header({ 
  theme, 
  setTheme, 
  selectedCount, 
  totalHours,
  academicPeriod,
  onUpdateAcademicPeriod,
  onClear, 
  onExport, 
  onOpenDrafts,
  onOpenAddCustom,
  onOpenSigaImporter,
  onOpenCurriculum,
  onOpenTutorial
}) {
  const handleEditPeriod = () => {
    const newP = prompt("Digite o período acadêmico (ex: 2026/3, 2026/1, 3º Semestre):", academicPeriod || '2026/3');
    if (newP && newP.trim()) {
      onUpdateAcademicPeriod(newP.trim());
    }
  };

  return (
    <header style={{
      backgroundColor: 'var(--bg-header)',
      borderBottom: '1px solid var(--border-color)',
      padding: '1rem 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: 'var(--shadow-md)'
    }}>
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.25rem',
            boxShadow: 'var(--shadow-glow)'
          }}>
            UFJF
          </div>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.35rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              Montador de Grade Horária 
              <button
                onClick={handleEditPeriod}
                title="Clique para alterar o período acadêmico manualmente"
                style={{
                  fontSize: '0.75rem',
                  backgroundColor: 'var(--color-primary)',
                  color: '#fff',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'transform 0.15s ease'
                }}
              >
                {academicPeriod || '2026/3'}
                <Edit3 size={11} />
              </button>
            </h1>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Universidade Federal de Juiz de Fora • Montagem Inteligente de Horários
            </p>
          </div>
        </div>

        {/* Stats summary badges */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          backgroundColor: 'var(--bg-card)',
          padding: '0.4rem 0.8rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          fontSize: '0.85rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Matérias Na Grade: </span>
            <strong style={{ color: 'var(--color-accent)' }}>{selectedCount}</strong>
          </div>
          <div style={{ height: '14px', width: '1px', backgroundColor: 'var(--border-color)' }} />
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Carga Horária Semanal: </span>
            <strong style={{ color: 'var(--color-secondary)' }}>{totalHours}h</strong>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          
          <button
            onClick={onOpenTutorial}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--color-secondary)',
              fontWeight: 600,
              fontSize: '0.875rem',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)'
            }}
            title="Como baixar o PDF do SIGA e usar o aplicativo"
          >
            <HelpCircle size={16} />
            Tutorial
          </button>

          <button
            onClick={onOpenCurriculum}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              color: 'var(--color-secondary)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              fontWeight: 700,
              fontSize: '0.875rem',
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)'
            }}
            title="Importar Matriz Curricular por Períodos do seu curso"
          >
            <BookOpen size={16} />
            Matriz do Curso
          </button>

          <button
            onClick={onOpenSigaImporter}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              color: 'var(--color-accent)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              fontWeight: 600,
              fontSize: '0.875rem',
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)'
            }}
            title="Enviar arquivo PDF do SIGA com as turmas oferecidas"
          >
            <Upload size={16} />
            Importar PDF (SIGA)
          </button>

          <button
            onClick={onOpenAddCustom}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.875rem',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)'
            }}
            title="Adicionar disciplina personalizada"
          >
            <PlusCircle size={16} />
            + Matéria
          </button>

          <button
            onClick={onOpenDrafts}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.875rem',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)'
            }}
            title="Minhas Grades Salvas"
          >
            <Bookmark size={16} />
            Salvas
          </button>

          <button
            onClick={onExport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.875rem',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)'
            }}
            title="Exportar imagem da grade"
          >
            <Download size={16} />
            Exportar PNG
          </button>

          {selectedCount > 0 && (
            <button
              onClick={onClear}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                fontSize: '0.875rem',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-md)'
              }}
              title="Limpar todas as matérias selecionadas da grade"
            >
              <Trash2 size={16} />
            </button>
          )}

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={theme === 'dark' ? "Mudar para modo claro" : "Mudar para modo escuro"}
          >
            {theme === 'dark' ? <Sun size={18} color="#e5a823" /> : <Moon size={18} color="#0f4c81" />}
          </button>

        </div>

      </div>
    </header>
  );
}
