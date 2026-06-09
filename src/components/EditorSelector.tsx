import React, { useState } from 'react';
import { Users, UserCircle } from 'lucide-react';

export type EditorType = 'マリア' | '森重' | '岡島' | '鶴見' | '前田' | 'ドクター' | 'ゲスト' | null;

interface Props {
  currentEditor: EditorType;
  guestName: string;
  onSelectEditor: (editor: EditorType, guestName?: string) => void;
}

const EDITORS: EditorType[] = ['マリア', '森重', '岡島', '鶴見', '前田', 'ドクター', 'ゲスト'];

export function EditorSelector({ currentEditor, guestName, onSelectEditor }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempGuestName, setTempGuestName] = useState(guestName);

  const handleSelect = (editor: EditorType) => {
    if (editor !== 'ゲスト') {
      onSelectEditor(editor, '');
      setIsOpen(false);
    } else {
      // ゲストの場合は自由入力があるので、ここでは確定せずに入力欄を表示させたままにする
      onSelectEditor('ゲスト', tempGuestName);
    }
  };

  const handleGuestSubmit = () => {
    onSelectEditor('ゲスト', tempGuestName);
    setIsOpen(false);
  };

  const getDisplayName = () => {
    if (!currentEditor) return '編集者を選択';
    if (currentEditor === 'ゲスト') return `ゲスト: ${guestName || '名無し'}`;
    return currentEditor;
  };

  return (
    <div className="card" style={{ marginBottom: '1rem', padding: '1rem' }}>
      <div 
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
          <Users size={20} className={currentEditor ? 'text-primary' : 'text-muted'} />
          <span style={{ fontWeight: 500 }}>
            {getDisplayName()}
          </span>
        </div>
        <button className="doctor-btn" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          {isOpen ? '閉じる' : '変更'}
        </button>
      </div>

      {isOpen && (
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            編集中に記録される名前を選択してください
          </div>
          <div className="procedure-tabs">
            {EDITORS.map(editor => (
              <button
                key={editor}
                className={`procedure-tab ${currentEditor === editor ? 'active' : ''}`}
                onClick={() => handleSelect(editor)}
              >
                {editor}
              </button>
            ))}
          </div>

          {currentEditor === 'ゲスト' && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="ゲストのお名前を入力" 
                value={tempGuestName}
                onChange={(e) => {
                  setTempGuestName(e.target.value);
                  onSelectEditor('ゲスト', e.target.value);
                }}
                style={{ 
                  flexGrow: 1, 
                  padding: '0.5rem', 
                  borderRadius: '0.25rem', 
                  border: '1px solid var(--border-color)' 
                }}
              />
              <button 
                onClick={handleGuestSubmit}
                style={{ 
                  padding: '0.5rem 1rem', 
                  backgroundColor: 'var(--primary)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '0.25rem', 
                  cursor: 'pointer' 
                }}
              >
                確定
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
