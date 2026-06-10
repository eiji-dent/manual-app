import { useState, useMemo } from 'react';
import type { InstrumentMaster } from '../types';
import { Search, Plus, X, Package } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  instruments: Record<string, InstrumentMaster>;
  onSelect: (itemName: string) => void;
}

export function InstrumentSelectorModal({ isOpen, onClose, instruments, onSelect }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  // 検索クエリでフィルタリング
  const filteredInstruments = useMemo(() => {
    const list = Object.values(instruments);
    if (!searchQuery.trim()) return list;
    
    const lowerQuery = searchQuery.toLowerCase();
    return list.filter(inst => inst.name.toLowerCase().includes(lowerQuery));
  }, [instruments, searchQuery]);

  // 完全一致する名前があるかチェック
  const exactMatchExists = useMemo(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return true;
    return Object.values(instruments).some(inst => inst.name === trimmed);
  }, [instruments, searchQuery]);

  if (!isOpen) return null;

  const handleCreateNew = () => {
    const newName = searchQuery.trim();
    if (newName) {
      onSelect(newName);
      setSearchQuery('');
    }
  };

  const handleSelect = (name: string) => {
    onSelect(name);
    setSearchQuery('');
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, padding: '1rem'
    }} onClick={onClose}>
      <div 
        className="card"
        style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', padding: '1.5rem', margin: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={24} color="var(--primary)" />
            準備物を追加
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="器具名を検索..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            style={{ 
              width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', 
              fontSize: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)',
              backgroundColor: '#f8fafc'
            }}
          />
        </div>

        <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '0.5rem' }}>
          {filteredInstruments.map((inst) => (
            <button 
              key={inst.name}
              onClick={() => handleSelect(inst.name)}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              {inst.imageUrl ? (
                <div style={{ width: '40px', height: '40px', borderRadius: '4px', backgroundImage: `url(${inst.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }} />
              ) : (
                <div style={{ width: '40px', height: '40px', borderRadius: '4px', backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#94a3b8', flexShrink: 0 }}>
                  <Package size={20} />
                </div>
              )}
              <div style={{ flexGrow: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)' }}>{inst.name}</div>
                {inst.masterDescription && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {inst.masterDescription}
                  </div>
                )}
              </div>
            </button>
          ))}

          {filteredInstruments.length === 0 && searchQuery.trim() && (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              見つかりませんでした
            </div>
          )}
        </div>

        {/* 完全一致する名前がない場合のみ、新規作成ボタンを表示 */}
        {!exactMatchExists && searchQuery.trim() && (
          <button 
            onClick={handleCreateNew}
            style={{
              marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              padding: '1rem', backgroundColor: '#f0fdf4', color: '#166534', border: '1px dashed #22c55e', 
              borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600
            }}
          >
            <Plus size={20} />
            「{searchQuery.trim()}」を新しく追加
          </button>
        )}
      </div>
    </div>
  );
}
