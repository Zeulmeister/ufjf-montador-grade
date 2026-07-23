import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { DAYS_OF_WEEK } from '../data/coursesData';

export default function CustomCourseModal({ isOpen, onClose, onAddCustomCourse }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [turmaName, setTurmaName] = useState('A');
  const [docente, setDocente] = useState('');
  const [slots, setSlots] = useState([
    { day: 'seg', start: '08:00', end: '10:00', room: '' }
  ]);

  if (!isOpen) return null;

  const handleAddSlot = () => {
    setSlots(prev => [...prev, { day: 'qua', start: '08:00', end: '10:00', room: '' }]);
  };

  const handleRemoveSlot = (index) => {
    setSlots(prev => prev.filter((_, i) => i !== index));
  };

  const handleSlotChange = (index, field, value) => {
    setSlots(prev => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code || !name) return;

    const newCourse = {
      code: code.toUpperCase().trim(),
      name: name.trim(),
      turmas: [
        {
          id: `${code.toUpperCase().trim()}-${turmaName.toUpperCase().trim()}-${Date.now()}`,
          turma: turmaName.toUpperCase().trim(),
          docentes: docente.trim() ? [docente.trim()] : [],
          slots: slots
        }
      ]
    };

    onAddCustomCourse(newCourse);
    onClose();
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
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Adicionar Disciplina Personalizada
          </h2>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600 }}>Código</label>
              <input 
                type="text" 
                placeholder="Ex: FIS001"
                value={code}
                onChange={e => setCode(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600 }}>Nome da Disciplina</label>
              <input 
                type="text" 
                placeholder="Ex: Física I"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600 }}>Turma</label>
              <input 
                type="text" 
                placeholder="Ex: A"
                value={turmaName}
                onChange={e => setTurmaName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600 }}>Professor(a)</label>
              <input 
                type="text" 
                placeholder="Nome do docente"
                value={docente}
                onChange={e => setDocente(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          {/* Slots */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 700 }}>Horários e Dias</label>
              <button 
                type="button" 
                onClick={handleAddSlot}
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-accent)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                <Plus size={14} /> Adicionar Horário
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {slots.map((slot, index) => (
                <div key={index} style={{
                  backgroundColor: 'var(--bg-main)',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr 1fr 1fr auto',
                  gap: '0.4rem',
                  alignItems: 'center'
                }}>
                  <select
                    value={slot.day}
                    onChange={e => handleSlotChange(index, 'day', e.target.value)}
                    style={{
                      padding: '0.35rem',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.775rem'
                    }}
                  >
                    {DAYS_OF_WEEK.map(d => (
                      <option key={d.id} value={d.id}>{d.label}</option>
                    ))}
                  </select>

                  <input 
                    type="time" 
                    value={slot.start} 
                    onChange={e => handleSlotChange(index, 'start', e.target.value)}
                    style={{
                      padding: '0.35rem',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.775rem'
                    }}
                  />

                  <input 
                    type="time" 
                    value={slot.end} 
                    onChange={e => handleSlotChange(index, 'end', e.target.value)}
                    style={{
                      padding: '0.35rem',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.775rem'
                    }}
                  />

                  <input 
                    type="text" 
                    placeholder="Sala" 
                    value={slot.room} 
                    onChange={e => handleSlotChange(index, 'room', e.target.value)}
                    style={{
                      padding: '0.35rem',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.775rem'
                    }}
                  />

                  {slots.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSlot(index)}
                      style={{ color: '#ef4444' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
              marginTop: '0.5rem'
            }}
          >
            Adicionar à Lista de Disciplinas
          </button>

        </form>

      </div>
    </div>
  );
}
