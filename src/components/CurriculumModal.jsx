import React, { useState } from 'react';
import { X, BookOpen, FileText, Check, AlertCircle, Upload, Loader2, Sparkles, Layers } from 'lucide-react';
import { parseCurriculumText } from '../utils/curriculumParser';
import { extractTextFromPdfFile } from '../utils/pdfExtractor';

export default function CurriculumModal({ isOpen, onClose, onImportCurriculum }) {
  const [activeTab, setActiveTab] = useState('pdf');
  const [rawText, setRawText] = useState('');
  const [parsedPeriods, setParsedPeriods] = useState([]);
  const [courseNameInput, setCourseNameInput] = useState('Meu Curso');
  const [hasParsed, setHasParsed] = useState(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [pdfFileName, setPdfFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  const handleProcessText = (textToParse) => {
    const result = parseCurriculumText(textToParse);
    setParsedPeriods(result);
    setHasParsed(true);
  };

  const handlePdfUpload = async (filesList) => {
    const files = Array.from(filesList).filter(f => f.name.toLowerCase().endsWith('.pdf'));
    if (files.length === 0) {
      alert("Por favor, selecione um arquivo PDF da Matriz Curricular do seu curso.");
      return;
    }

    setIsLoadingPdf(true);
    setPdfFileName(files[0].name);
    setHasParsed(false);

    try {
      const text = await extractTextFromPdfFile(files[0]);
      setRawText(text);
      handleProcessText(text);
    } catch (err) {
      console.error("Erro ao ler PDF da Matriz Curricular:", err);
      alert("Não foi possível ler o PDF. Tente colar o texto da matriz na aba 'Colar Texto'.");
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handlePdfUpload(e.dataTransfer.files);
    }
  };

  const handleConfirmImport = () => {
    if (parsedPeriods.length > 0) {
      onImportCurriculum({
        courseName: courseNameInput || 'Meu Curso',
        periods: parsedPeriods
      });
      onClose();
    }
  };

  const totalCoursesCount = parsedPeriods.reduce((acc, p) => acc + p.courses.length, 0);

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
            <BookOpen size={22} color="var(--color-secondary)" />
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Importar Matriz Curricular por Períodos
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Envie o PPC ou Matriz Curricular para categorizar matérias em 1º, 2º, 3º, 4º Períodos
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-main)',
          padding: '0.25rem 1rem 0 1rem',
          gap: '0.5rem'
        }}>
          <button
            onClick={() => setActiveTab('pdf')}
            style={{
              padding: '0.5rem 1rem',
              fontWeight: 600,
              fontSize: '0.85rem',
              borderBottom: activeTab === 'pdf' ? '2px solid var(--color-secondary)' : '2px solid transparent',
              color: activeTab === 'pdf' ? 'var(--color-secondary)' : 'var(--text-muted)'
            }}
          >
            📄 Enviar PDF da Matriz
          </button>
          <button
            onClick={() => setActiveTab('text')}
            style={{
              padding: '0.5rem 1rem',
              fontWeight: 600,
              fontSize: '0.85rem',
              borderBottom: activeTab === 'text' ? '2px solid var(--color-secondary)' : '2px solid transparent',
              color: activeTab === 'text' ? 'var(--color-secondary)' : 'var(--text-muted)'
            }}
          >
            📝 Colar Texto da Matriz
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Course Name Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Nome do seu Curso:
            </label>
            <input 
              type="text"
              value={courseNameInput}
              onChange={(e) => setCourseNameInput(e.target.value)}
              placeholder="Ex: Engenharia Elétrica, Química, Matemática, Ciência da Computação..."
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            />
          </div>

          {activeTab === 'pdf' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Selecione ou arraste o <strong>PDF da Matriz Curricular / Projeto Pedagógico</strong> do seu curso:
              </p>

              <div 
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{
                  border: dragOver ? '2px dashed var(--color-secondary)' : '2px dashed var(--border-color)',
                  backgroundColor: dragOver ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-main)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  cursor: 'pointer'
                }}
              >
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handlePdfUpload(e.target.files);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0,
                    cursor: 'pointer',
                    width: '100%',
                    height: '100%'
                  }}
                />

                {isLoadingPdf ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--color-secondary)' }}>
                    <Loader2 size={36} className="animate-spin" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Lendo Matriz Curricular...</span>
                  </div>
                ) : pdfFileName ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{
                      padding: '0.5rem 0.85rem',
                      backgroundColor: 'var(--color-secondary)',
                      color: '#0f172a',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      <BookOpen size={18} /> {pdfFileName}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Clique para escolher outro PDF
                    </span>
                  </div>
                ) : (
                  <>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(245, 158, 11, 0.15)',
                      color: 'var(--color-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Upload size={26} />
                    </div>

                    <div>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
                        Arraste o PDF da Matriz Curricular para cá
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        ou clique para selecionar o arquivo no seu computador
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <textarea
                rows={9}
                placeholder="Cole aqui o texto da matriz por períodos (ex: 1º PERÍODO MAT013 - CÁLCULO I ... 2º PERÍODO MAT014 - CÁLCULO II ...)..."
                value={rawText}
                onChange={(e) => {
                  setRawText(e.target.value);
                  setHasParsed(false);
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  resize: 'vertical'
                }}
              />

              <button
                onClick={() => handleProcessText(rawText)}
                disabled={!rawText.trim()}
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: rawText.trim() ? 'var(--color-secondary)' : 'var(--bg-main)',
                  color: rawText.trim() ? '#0f172a' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  opacity: rawText.trim() ? 1 : 0.5
                }}
              >
                <FileText size={16} /> Organizar por Períodos
              </button>
            </div>
          )}

          {/* Parsed Result Preview */}
          {hasParsed && (
            <div style={{
              borderTop: '1px solid var(--border-color)',
              paddingTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              {parsedPeriods.length === 0 ? (
                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.825rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <AlertCircle size={18} />
                  Nenhum período ou disciplina identificado. Certifique-se de incluir títulos como "1º Período", "2º Período", etc.
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-secondary)' }}>
                      🎉 Identificados {parsedPeriods.length} períodos com {totalCoursesCount} disciplinas:
                    </span>
                  </div>

                  <div style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.6rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem'
                  }}>
                    {parsedPeriods.map(p => (
                      <div 
                        key={p.periodName}
                        style={{
                          backgroundColor: 'var(--bg-card)',
                          padding: '0.6rem 0.85rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        <div style={{
                          fontWeight: 700,
                          fontSize: '0.825rem',
                          color: 'var(--color-accent)',
                          marginBottom: '0.35rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          <Layers size={14} /> {p.periodName} ({p.courses.length} disciplinas)
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {p.courses.map(c => (
                            <span 
                              key={c.code}
                              style={{
                                fontSize: '0.725rem',
                                backgroundColor: 'var(--bg-main)',
                                padding: '0.15rem 0.45rem',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--text-main)',
                                border: '1px solid var(--border-color)'
                              }}
                            >
                              <strong>{c.code}</strong> {c.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleConfirmImport}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-secondary)',
                      color: '#0f172a',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Check size={18} /> Salvar Matriz do Curso ({courseNameInput})
                  </button>
                </>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
