
import type { Procedure } from '../types';
import { AlertCircle, Lightbulb, Image as ImageIcon, CheckSquare, Plus, Trash2 } from 'lucide-react';

interface Props {
  procedure: Procedure;
  isEditMode: boolean;
  onUpdateProcedure: (updatedProcedure: Procedure) => void;
}

export function PreparationList({ procedure, isEditMode, onUpdateProcedure }: Props) {

  const handleUpdateNotes = (notes: string) => {
    onUpdateProcedure({ ...procedure, notes });
  };

  const handleUpdateCheckItems = (idx: number, newValue: string) => {
    const newItems = [...(procedure.checkItems || [])];
    newItems[idx] = newValue;
    onUpdateProcedure({ ...procedure, checkItems: newItems });
  };

  const handleAddCheckItem = () => {
    const newItems = [...(procedure.checkItems || []), '新しい確認事項'];
    onUpdateProcedure({ ...procedure, checkItems: newItems });
  };

  const handleRemoveCheckItem = (idx: number) => {
    const newItems = [...(procedure.checkItems || [])];
    newItems.splice(idx, 1);
    onUpdateProcedure({ ...procedure, checkItems: newItems });
  };

  const handleUpdateItem = (idx: number, newValue: string) => {
    const newItems = [...procedure.items];
    newItems[idx] = newValue;
    onUpdateProcedure({ ...procedure, items: newItems });
  };

  const handleAddItem = () => {
    const newItems = [...procedure.items, '新しい準備物'];
    onUpdateProcedure({ ...procedure, items: newItems });
  };

  const handleRemoveItem = (idx: number) => {
    const newItems = [...procedure.items];
    newItems.splice(idx, 1);
    onUpdateProcedure({ ...procedure, items: newItems });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 都度確認事項 */}
      {(procedure.checkItems && procedure.checkItems.length > 0 || isEditMode) && (
        <div className="alert-box alert-warning">
          <AlertCircle className="alert-icon" size={24} />
          <div style={{ width: '100%' }}>
            <div className="alert-title">先生に都度確認する事項</div>
            <div className="alert-content">
              {(procedure.checkItems || []).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  {isEditMode ? (
                    <>
                      <input 
                        type="text" 
                        value={item} 
                        onChange={(e) => handleUpdateCheckItems(idx, e.target.value)}
                        style={{ flexGrow: 1, padding: '0.25rem', fontSize: '0.95rem' }}
                      />
                      <button onClick={() => handleRemoveCheckItem(idx)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <div>{item}</div>
                  )}
                </div>
              ))}
              {isEditMode && (
                <button onClick={handleAddCheckItem} style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', color: '#b45309', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
                  <Plus size={16} /> 確認事項を追加
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 特記事項 */}
      {(procedure.notes || isEditMode) && (
        <div className="alert-box alert-info">
          <Lightbulb className="alert-icon" size={24} />
          <div style={{ width: '100%' }}>
            <div className="alert-title">アシスト特記事項</div>
            <div className="alert-content">
              {isEditMode ? (
                <textarea 
                  value={procedure.notes || ''} 
                  onChange={(e) => handleUpdateNotes(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', minHeight: '60px', fontSize: '0.95rem', resize: 'vertical' }}
                  placeholder="特記事項を入力"
                />
              ) : (
                procedure.notes
              )}
            </div>
          </div>
        </div>
      )}

      {/* 準備物リスト */}
      <div className="card">
        <h2 className="section-title">
          <CheckSquare size={20} />
          準備物リスト
        </h2>
        <div className="prep-list">
          {procedure.items.map((item, idx) => (
            <label key={idx} className="prep-item" style={{ cursor: isEditMode ? 'default' : 'pointer' }}>
              {!isEditMode && <input type="checkbox" className="prep-item-checkbox" />}
              {isEditMode ? (
                <>
                  <input 
                    type="text" 
                    value={item} 
                    onChange={(e) => handleUpdateItem(idx, e.target.value)}
                    style={{ flexGrow: 1, padding: '0.25rem', fontSize: '0.95rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                  />
                  <button onClick={() => handleRemoveItem(idx)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </>
              ) : (
                <>
                  <span className="prep-item-label">{item}</span>
                  <span title="写真を表示（将来実装）" style={{ display: 'flex' }}>
                    <ImageIcon className="photo-placeholder" size={18} />
                  </span>
                </>
              )}
            </label>
          ))}
          
          {isEditMode && (
            <button 
              onClick={handleAddItem} 
              className="prep-item" 
              style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', borderStyle: 'dashed', color: 'var(--primary)', fontWeight: 500, cursor: 'pointer' }}
            >
              <Plus size={18} />
              追加
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
