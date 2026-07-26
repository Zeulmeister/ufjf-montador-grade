import React, { useState } from 'react';
import { X, FileText, Check, AlertCircle, Upload, FileUp, Loader2, Award, GraduationCap, EyeOff } from 'lucide-react';
import { extractTextFromPdfFile } from '../utils/pdfExtractor';
import { parseHistoricoText } from '../utils/historicoParser';

export default function HistoricoModal({ isOpen, onClose, onImportHistorico }) {
  const [activeTab, setActiveTab] = useState('pdf');
  const [rawText, setRawText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [pdfFileName, setPdfFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  const handleProcessText = (textToParse) => {
    const result = parseHistoricoText(textToParse);
    setParsedData(result);
  };

  const handlePdfUpload = async (filesList) => {
    const files = Array.from(filesList).filter(f => f.name.toLowerCase().endsWith('.pdf'));
    if (files.length === 0) {
      alert("Por favor, selecione um arquivo no formato .pdf do seu Histórico Escolar (SIGA/CDARA).");
      return;
    }

    const file = files[0];
    setIsLoadingPdf(true);
    setPdfFileName(file.name);
    setParsedData(null);

    try {
      const text = await extractTextFromPdfFile(file);
      setRawText(text);
      handleProcessText(text);
    } catch (err) {
      console.error("Erro ao ler PDF do histórico:", err);
      alert("Não foi possível ler o arquivo PDF. Verifique se é um arquivo do Histórico Escolar válido.");
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
    if (parsedData && parsedData.passedCodes.length > 0) {
      onImportHistorico(parsedData.passedCodes, parsedData.header);
      setRawText('');
      setParsedData(null);
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
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(139, 92, 246, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#c084fc'
            }}>
              <GraduationCap size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Analisador de Histórico Escolar
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Importe seu PDF do SIGA para marcar matérias concluídas e ignorá-las no montador de grade.
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
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selection */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-main)',
          padding: '0.5rem 1.5rem 0 1.5rem',
          gap: '0.5rem'
        }}>
          <button
            onClick={() => setActiveTab('pdf')}
            style={{
              padding: '0.6rem 1.25rem',
              border: 'none',
              borderBottom: activeTab === 'pdf' ? '2px solid var(--primary-color)' : '2px solid transparent',
              background: 'transparent',
              color: activeTab === 'pdf' ? 'var(--primary-color)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FileUp size={16} /> Enviar PDF do Histórico
          </button>

          <button
            onClick={() => setActiveTab('text')}
            style={{
              padding: '0.6rem 1.25rem',
              border: 'none',
              borderBottom: activeTab === 'text' ? '2px solid var(--primary-color)' : '2px solid transparent',
              background: 'transparent',
              color: activeTab === 'text' ? 'var(--primary-color)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FileText size={16} /> Colar Texto do Histórico
          </button>
        </div>

        {/* Content Body */}
        <div style={{
          padding: '1.5rem',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {activeTab === 'pdf' ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                border: dragOver ? '2px dashed var(--primary-color)' : '2px dashed var(--border-color)',
                backgroundColor: dragOver ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}
              onClick={() => document.getElementById('historico-pdf-input').click()}
            >
              <input
                type="file"
                id="historico-pdf-input"
                accept=".pdf"
                style={{ display: 'none' }}
                onChange={(e) => e.target.files && handlePdfUpload(e.target.files)}
              />

              {isLoadingPdf ? (
                <>
                  <Loader2 size={38} style={{ color: 'var(--primary-color)', animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Analisando o PDF do Histórico Escolar...</span>
                </>
              ) : (
                <>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    backgroundColor: 'rgba(139, 92, 246, 0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--primary-color)'
                  }}>
                    <Upload size={28} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '1.05rem', fontWeight: 600 }}>
                      Clique para selecionar ou arraste o PDF do Histórico
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Suporta PDFs baixados do SIGA/CDARA da UFJF
                    </p>
                  </div>
                </>
              )}

              {pdfFileName && !isLoadingPdf && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-success)',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}>
                  <FileText size={16} /> Arquivo lido: {pdfFileName}
                </div>
              )}
            </div>
          ) : (
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Cole o texto do Histórico Escolar aqui:
              </label>
              <textarea
                value={rawText}
                onChange={(e) => {
                  setRawText(e.target.value);
                  handleProcessText(e.target.value);
                }}
                placeholder="Copie e cole o texto completo do seu Histórico Escolar..."
                style={{
                  width: '100%',
                  height: '140px',
                  backgroundColor: 'rgba(10, 11, 18, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  padding: '0.75rem',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  resize: 'vertical'
                }}
              />
            </div>
          )}

          {/* Parsed Preview Banner */}
          {parsedData && (
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {parsedData.header.studentName || 'Estudante'}
                  </h4>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Matrícula: {parsedData.header.matricula || 'N/A'} • {parsedData.header.course || 'UFJF'}
                  </p>
                </div>
                {parsedData.header.ira && (
                  <div style={{
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>IRA</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#c084fc' }}>{parsedData.header.ira}</span>
                  </div>
                )}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--color-success)'
              }}>
                <Check size={18} />
                <span>{parsedData.passedCodes.length} matérias concluídas/aprovadas identificadas!</span>
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.4rem',
                maxHeight: '120px',
                overflowY: 'auto',
                paddingRight: '0.25rem'
              }}>
                {parsedData.passedCodes.map(code => (
                  <span key={code} style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    color: '#6ee7b7',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    ✓ {code}
                  </span>
                ))}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.82rem',
                color: '#e9d5ff',
                backgroundColor: 'rgba(139, 92, 246, 0.15)',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-md)'
              }}>
                <EyeOff size={16} />
                <span>Ao importar, o filtro <strong>"Ocultar Concluídas"</strong> será ativado para você nem cogitar em pegá-las!</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          backgroundColor: 'rgba(15, 23, 42, 0.4)'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'transparent',
              color: 'var(--text-main)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          
          <button
            onClick={handleConfirmImport}
            disabled={!parsedData || parsedData.passedCodes.length === 0}
            style={{
              padding: '0.6rem 1.4rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: (!parsedData || parsedData.passedCodes.length === 0)
                ? 'var(--border-color)'
                : 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: (!parsedData || parsedData.passedCodes.length === 0) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: parsedData?.passedCodes?.length ? '0 4px 15px rgba(139, 92, 246, 0.4)' : 'none'
            }}
          >
            <Check size={18} /> Importar e Marcar Concluídas
          </button>
        </div>
      </div>
    </div>
  );
}
