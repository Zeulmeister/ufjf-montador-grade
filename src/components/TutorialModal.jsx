import React from 'react';
import { X, HelpCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export default function TutorialModal({ isOpen, onClose, onOpenImporter }) {
  if (!isOpen) return null;

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
        maxWidth: '640px',
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
            <HelpCircle size={22} color="var(--color-secondary)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Passo a Passo: Como Obter o PDF no SIGA UFJF
            </h2>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Step 1 */}
          <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              1
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Acesse o SIGA UFJF
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.25rem', lineHeight: '1.4' }}>
                No menu do SIGA, vá em: <strong style={{ color: 'var(--color-accent)' }}>Meu curso → Plano departamental</strong>.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              2
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Selecione o Departamento
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                No campo <strong>Departamento</strong>, escolha o departamento das disciplinas (ex: <em>DEP MAT - DEPTO DE MATEMÁTICA / ICE</em>, <em>DCC</em>, <em>FIS</em>, etc.).
              </p>
            </div>
          </div>

          {/* Step 3 - Warning Callout */}
          <div style={{
            backgroundColor: 'rgba(229, 168, 35, 0.12)',
            border: '1px solid rgba(229, 168, 35, 0.4)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.85rem 1rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start'
          }}>
            <AlertTriangle size={22} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ fontSize: '0.875rem', color: 'var(--color-secondary)' }}>
                💡 Dica Importante: Confira o Período!
              </strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.25rem', lineHeight: '1.4' }}>
                Verifique se o <strong>Ano</strong> (ex: <code>2026</code>) e o <strong>Semestre</strong> (ex: <code>1</code> ou <code>2</code>) correspondem ao próximo período que você vai cursar.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              3
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Clique em "Imprimir"
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Clique no botão de impressão do SIGA. Será gerado o documento oficial em PDF (<em>"Relação de Turmas Oferecidas por Departamento"</em>). Baixe ou salve esse arquivo no seu computador.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-accent)',
              color: '#0f172a',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              4
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Envie o PDF no Aplicativo
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Clique em <strong>Importar PDF do SIGA</strong> no app e selecione o PDF. Todas as matérias e horários serão carregados instantaneamente no seu catálogo!
              </p>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={() => {
              onClose();
              onOpenImporter();
            }}
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
              gap: '0.5rem',
              marginTop: '0.5rem',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            Importar Arquivo PDF Agora <ArrowRight size={18} />
          </button>

        </div>

      </div>
    </div>
  );
}
