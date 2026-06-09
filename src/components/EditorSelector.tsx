import { useState } from 'react';
import { Users } from 'lucide-react';

export type EditorType = 'マリア' | '森重' | '岡島' | '鶴見' | '前田' | 'ドクター' | 'ゲスト' | null;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectEditor: (editor: EditorType, guestName?: string) => void;
}

const EDITORS: EditorType[] = ['マリア', '森重', '岡島', '鶴見', '前田', 'ドクター', 'ゲスト'];

export function EditorSelector({ isOpen, onClose, onSelectEditor }: Props) {
  const [selectedEditor, setSelectedEditor] = useState<EditorType>(null);
  const [guestName, setGuestName] = useState('');

  if (!isOpen) return null;

  const handleSelect = (editor: EditorType) => {
    setSelectedEditor(editor);
  };

  const handleConfirm = () => {
    if (!selectedEditor) {
      alert('編集者を選択してください');
      return;
    }
    if (selectedEditor === 'ゲスト' && !guestName.trim()) {
      alert('ゲストのお名前を入力してください');
      return;
    }
    onSelectEditor(selectedEditor, guestName);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, padding: '1rem'
    }} onClick={onClose}>
      <div 
        className="card"
        style={{ width: '100%', maxWidth: '400px', padding: '1.5rem', margin: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
          <Users size={24} />
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>編集者を選択</h2>
        </div>

        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          編集モードに入る前に、履歴に記録するお名前を選択してください。
        </div>

        <div className="procedure-tabs" style={{ marginBottom: '1.5rem' }}>
          {EDITORS.map(editor => (
            <button
              key={editor}
              className={`procedure-tab ${selectedEditor === editor ? 'active' : ''}`}
              onClick={() => handleSelect(editor)}
            >
              {editor}
            </button>
          ))}
        </div>

        {selectedEditor === 'ゲスト' && (
          <div style={{ marginBottom: '1.5rem' }}>
            <input 
              type="text" 
              placeholder="ゲストのお名前を入力" 
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '1rem' }}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={onClose}
            style={{ flex: 1, padding: '0.75rem', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
          >
            キャンセル
          </button>
          <button 
            onClick={handleConfirm}
            style={{ flex: 1, padding: '0.75rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
          >
            編集モードを開始
          </button>
        </div>
      </div>
    </div>
  );
}
