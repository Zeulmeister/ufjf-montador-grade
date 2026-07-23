import React, { useState } from 'react';
import { X, Bookmark, Trash2, ArrowRight, Save } from 'lucide-react';

export default function SavedDraftsModal({ 
  isOpen, 
  onClose, 
  savedDrafts, 
  onSaveCurrent, 
  onLoadDraft, 
  onDeleteDraft 
}) {
  const [draftName, setDraftName] = useState('');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!draftName.trim()) return;
    onSaveCurrent(draftName.trim());
    setDraftName('');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      zIndex: 50,
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
        maxWidth: '550px',
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
            <Bookmark size={20} color="var(--color-accent)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Grades Salvas (Rascunhos)
            </h2>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Save current form */}
          <form onSubmit={handleSave} style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              placeholder="Dar um nome para esta grade (ex: Opção Manhã)..."
              value={draftName}
              onChange={e => setDraftName(e.target.value)}
              style={{
                flex: 1,
                padding: '0.6rem 0.75rem',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
            />
            <button
              type="submit"
              disabled={!draftName.trim()}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                opacity: !draftName.trim() ? 0.5 : 1
              }}
            >
              <Save size={16} /> Salvar
            </button>
          </form>

          {/* List of saved drafts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              Seus rascunhos armazenados:
            </h3>

            {savedDrafts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem 1rem',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                backgroundColor: 'var(--bg-main)',
                borderRadius: 'var(--radius-lg)'
              }}>
                Nenhuma grade salva ainda. Digite um nome acima para salvar a grade atual!
              </div>
            ) : (
              savedDrafts.map((draft, idx) => (
                <div 
                  key={idx}
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {draft.name}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {draft.items.length} matérias • Salvo em {draft.date}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => {
                        onLoadDraft(draft);
                        onClose();
                      }}
                      style={{
                        fontSize: '0.775rem',
                        padding: '0.35rem 0.65rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-primary)',
                        color: '#fff',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      Carregar <ArrowRight size={14} />
                    </button>

                    <button
                      onClick={() => onDeleteDraft(idx)}
                      style={{
                        padding: '0.35rem',
                        borderRadius: 'var(--radius-md)',
                        color: '#ef4444'
                      }}
                      title="Excluir rascunho"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
