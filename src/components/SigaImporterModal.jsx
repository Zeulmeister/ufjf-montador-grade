import React, { useState } from 'react';
import { X, FileText, Check, AlertCircle, Upload, FileUp, Loader2, Files } from 'lucide-react';
import { parseSigaText } from '../utils/sigaParser';
import { extractTextFromPdfFile } from '../utils/pdfExtractor';

export default function SigaImporterModal({ isOpen, onClose, onImportCourses }) {
  const [activeTab, setActiveTab] = useState('pdf');
  const [rawText, setRawText] = useState('');
  const [parsedPreview, setParsedPreview] = useState([]);
  const [detectedPeriod, setDetectedPeriod] = useState(null);
  const [hasParsed, setHasParsed] = useState(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [pdfFileName, setPdfFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  const handleProcessText = (textToParse) => {
    const result = parseSigaText(textToParse);
    setParsedPreview(result.courses);
    setDetectedPeriod(result.period);
    setHasParsed(true);
  };

  const handlePdfFilesUpload = async (filesList) => {
    const files = Array.from(filesList).filter(f => f.name.toLowerCase().endsWith('.pdf'));
    if (files.length === 0) {
      alert("Por favor, selecione um ou mais arquivos no formato .pdf baixados do SIGA.");
      return;
    }

    setIsLoadingPdf(true);
    setPdfFileName(files.length === 1 ? files[0].name : `${files.length} arquivos PDF selecionados`);
    setHasParsed(false);

    try {
      let combinedText = '';
      for (const file of files) {
        const text = await extractTextFromPdfFile(file);
        combinedText += '\n\n' + text;
      }
      setRawText(combinedText);
      handleProcessText(combinedText);
    } catch (err) {
      console.error("Erro ao ler arquivos PDF:", err);
      alert("Não foi possível ler um ou mais arquivos PDF. Tente selecioná-los novamente.");
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handlePdfFilesUpload(e.dataTransfer.files);
    }
  };

  const handleConfirmImport = () => {
    if (parsedPreview.length > 0) {
      onImportCourses(parsedPreview, detectedPeriod);
      setRawText('');
      setParsedPreview([]);
      setDetectedPeriod(null);
      setHasParsed(false);
      setPdfFileName('');
      onClose();
    }
  };

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileUp size={20} color="var(--color-accent)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Importar PDF(s) do SIGA UFJF
            </h2>
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
              borderBottom: activeTab === 'pdf' ? '2px solid var(--color-accent)' : '2px solid transparent',
              color: activeTab === 'pdf' ? 'var(--color-accent)' : 'var(--text-muted)'
            }}
          >
            📄 Carregar Arquivos PDF
          </button>
          <button
            onClick={() => setActiveTab('text')}
            style={{
              padding: '0.5rem 1rem',
              fontWeight: 600,
              fontSize: '0.85rem',
              borderBottom: activeTab === 'text' ? '2px solid var(--color-accent)' : '2px solid transparent',
              color: activeTab === 'text' ? 'var(--color-accent)' : 'var(--text-muted)'
            }}
          >
            📝 Colar Texto
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {activeTab === 'pdf' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Você pode selecionar ou arrastar <strong>um ou múltiplos arquivos PDF</strong> do SIGA simultaneamente:
              </p>

              <div 
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{
                  border: dragOver ? '2px dashed var(--color-accent)' : '2px dashed var(--border-color)',
                  backgroundColor: dragOver ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-main)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2.5rem 1.5rem',
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
                  multiple
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handlePdfFilesUpload(e.target.files);
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
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)' }}>
                    <Loader2 size={36} className="animate-spin" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Lendo e processando arquivos PDF...</span>
                  </div>
                ) : pdfFileName ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{
                      padding: '0.5rem 0.85rem',
                      backgroundColor: 'var(--color-primary)',
                      color: '#fff',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      <Files size={18} /> {pdfFileName}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Clique para escolher outros arquivos PDF
                    </span>
                  </div>
                ) : (
                  <>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(56, 189, 248, 0.15)',
                      color: 'var(--color-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Upload size={26} />
                    </div>

                    <div>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
                        Arraste um ou mais arquivos PDF para cá
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        ou clique aqui para selecionar vários PDFs juntos
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
                placeholder="Cole aqui o texto copiado do SIGA (ex: Disciplina MAT013 - MATEMÁTICA FINANCEIRA ... Turma A ...)..."
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
                  backgroundColor: rawText.trim() ? 'var(--color-primary)' : 'var(--bg-main)',
                  color: rawText.trim() ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  opacity: rawText.trim() ? 1 : 0.5
                }}
              >
                <FileText size={16} /> Processar Texto
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
              {parsedPreview.length === 0 ? (
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
                  Nenhuma disciplina identificada nos arquivos PDF. Certifique-se de enviar PDFs da "Relação de Turmas Oferecidas por Departamento" do SIGA.
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-accent)' }}>
                      🎉 Identificadas {parsedPreview.length} disciplinas para importar:
                    </span>
                    {detectedPeriod && (
                      <span style={{
                        fontSize: '0.75rem',
                        backgroundColor: 'var(--color-primary)',
                        color: '#fff',
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 600
                      }}>
                        Período detectado: {detectedPeriod}
                      </span>
                    )}
                  </div>

                  <div style={{
                    maxHeight: '180px',
                    overflowY: 'auto',
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}>
                    {parsedPreview.map(c => (
                      <div 
                        key={c.code}
                        style={{
                          backgroundColor: 'var(--bg-card)',
                          padding: '0.5rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <strong>{c.code}</strong> - {c.name}
                        </div>
                        <span style={{
                          backgroundColor: 'var(--color-primary)',
                          color: '#fff',
                          padding: '0.1rem 0.4rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.725rem',
                          fontWeight: 600
                        }}>
                          {c.turmas.length} turma(s)
                        </span>
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
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Check size={18} /> Importar {parsedPreview.length} Disciplinas para o Meu Catálogo
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
