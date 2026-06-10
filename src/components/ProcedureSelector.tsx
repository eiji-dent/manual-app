import { useState } from 'react';
import type { Procedure } from '../types';
import { Plus, X } from 'lucide-react';

interface Props {
  procedures: Procedure[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isEditMode?: boolean;
  onAddProcedure?: (name: string) => void;
}

export function ProcedureSelector({ procedures, selectedId, onSelect, isEditMode, onAddProcedure }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [newProcedureName, setNewProcedureName] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProcedureName.trim() && onAddProcedure) {
      onAddProcedure(newProcedureName.trim());
      setNewProcedureName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
      <h2 className="section-title">処置メニューを選択</h2>
      
      <div className="procedure-tabs" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {procedures.map(proc => (
          <button
            key={proc.id}
            className={`procedure-tab ${selectedId === proc.id ? 'active' : ''}`}
            onClick={() => onSelect(proc.id)}
          >
            {proc.name}
          </button>
        ))}

        {isEditMode && onAddProcedure && (
          <button
            onClick={() => setIsAdding(true)}
            className="procedure-tab"
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#f0fdf4', color: '#166534', border: '1px dashed #22c55e' }}
          >
            <Plus size={16} />
            新しい処置を追加
          </button>
        )}
      </div>

      {isAdding && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, padding: '1rem'
        }} onClick={() => setIsAdding(false)}>
          <div 
            className="card"
            style={{ width: '100%', maxWidth: '400px', padding: '1.5rem', margin: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={20} color="var(--primary)" />
                新しい処置を追加
              </h3>
              <button onClick={() => setIsAdding(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit}>
              <input 
                type="text" 
                placeholder="処置の名前（例：EXT、SETなど）" 
                value={newProcedureName}
                onChange={(e) => setNewProcedureName(e.target.value)}
                autoFocus
                style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid var(--border-color)', marginBottom: '1rem' }}
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  style={{ flex: 1, padding: '0.75rem', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                >
                  キャンセル
                </button>
                <button 
                  type="submit"
                  disabled={!newProcedureName.trim()}
                  style={{ flex: 1, padding: '0.75rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, opacity: newProcedureName.trim() ? 1 : 0.5 }}
                >
                  追加する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
