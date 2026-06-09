import { useState } from 'react';
import type { Procedure, PreparationItem } from '../types';
import { AlertCircle, Lightbulb, CheckSquare, Plus, Trash2, X, Camera } from 'lucide-react';
import { uploadImage } from '../firebaseUtils';

interface Props {
  procedure: Procedure;
  isEditMode: boolean;
  onUpdateProcedure: (updatedProcedure: Procedure) => void;
}

export function PreparationList({ procedure, isEditMode, onUpdateProcedure }: Props) {
  const [selectedItemInfo, setSelectedItemInfo] = useState<PreparationItem | null>(null);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  // Helper to normalize item type
  const normalizeItem = (item: string | PreparationItem): PreparationItem => {
    return typeof item === 'string' ? { name: item } : item;
  };

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

  const handleUpdateItem = (idx: number, updatedItem: PreparationItem) => {
    const newItems = [...procedure.items];
    newItems[idx] = updatedItem;
    onUpdateProcedure({ ...procedure, items: newItems });
  };

  const handleAddItem = () => {
    const newItems = [...procedure.items, { name: '新しい準備物' }];
    onUpdateProcedure({ ...procedure, items: newItems });
  };

  const handleRemoveItem = (idx: number) => {
    const newItems = [...procedure.items];
    newItems.splice(idx, 1);
    onUpdateProcedure({ ...procedure, items: newItems });
  };

  const handleImageUpload = async (idx: number, file: File) => {
    setUploadingIdx(idx);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `preparations/${procedure.id}_${Date.now()}.${ext}`;
      const url = await uploadImage(file, path);
      const item = normalizeItem(procedure.items[idx]);
      handleUpdateItem(idx, { ...item, imageUrl: url });
    } catch (e) {
      console.error("Image upload failed", e);
      alert("画像のアップロードに失敗しました。");
    } finally {
      setUploadingIdx(null);
    }
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
                        style={{ flexGrow: 1, padding: '0.5rem', fontSize: '1rem' }}
                      />
                      <button onClick={() => handleRemoveCheckItem(idx)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
                        <Trash2 size={20} />
                      </button>
                    </>
                  ) : (
                    <div>{item}</div>
                  )}
                </div>
              ))}
              {isEditMode && (
                <button onClick={handleAddCheckItem} style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', color: '#b45309', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}>
                  <Plus size={20} /> 確認事項を追加
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
                  style={{ width: '100%', padding: '0.75rem', minHeight: '80px', fontSize: '1rem', resize: 'vertical' }}
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
          <CheckSquare size={24} />
          準備物リスト
        </h2>
        <div className="prep-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {procedure.items.map((rawItem, idx) => {
            const item = normalizeItem(rawItem);
            return (
              <label key={idx} className="prep-item" style={{ cursor: isEditMode ? 'default' : 'pointer', alignItems: isEditMode ? 'flex-start' : 'center' }}>
                {!isEditMode && <input type="checkbox" className="prep-item-checkbox" />}
                
                {isEditMode ? (
                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        value={item.name} 
                        onChange={(e) => handleUpdateItem(idx, { ...item, name: e.target.value })}
                        style={{ flexGrow: 1, padding: '0.5rem', fontSize: '1.125rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                      />
                      <button onClick={() => handleRemoveItem(idx)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <textarea
                      placeholder="器具の説明（任意）"
                      value={item.description || ''}
                      onChange={(e) => handleUpdateItem(idx, { ...item, description: e.target.value })}
                      style={{ padding: '0.5rem', fontSize: '1rem', border: '1px solid var(--border-color)', borderRadius: '4px', resize: 'vertical' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>
                        <Camera size={20} />
                        {item.imageUrl ? '写真を変更' : '写真を追加'}
                        <input 
                          type="file" 
                          accept="image/*" 
                          style={{ display: 'none' }} 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageUpload(idx, e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                      {uploadingIdx === idx && <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>アップロード中...</span>}
                      {item.imageUrl && (
                        <div style={{ width: '40px', height: '40px', borderRadius: '4px', backgroundImage: `url(${item.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="prep-item-label" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span>{item.name}</span>
                      {item.description && (
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500, whiteSpace: 'pre-wrap' }}>
                          {item.description}
                        </span>
                      )}
                    </span>
                    {item.imageUrl && (
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedItemInfo(item);
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center' }}
                        title="写真を見る"
                      >
                        <Camera size={24} />
                      </button>
                    )}
                  </>
                )}
              </label>
            );
          })}
          
          {isEditMode && (
            <button 
              onClick={handleAddItem} 
              className="prep-item" 
              style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', borderStyle: 'dashed', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: '1rem' }}
            >
              <Plus size={20} />
              準備物を追加
            </button>
          )}
        </div>
      </div>

      {/* 写真・説明表示モーダル */}
      {selectedItemInfo && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem'
        }} onClick={() => setSelectedItemInfo(null)}>
          <div 
            style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', padding: '1.5rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{selectedItemInfo.name}</h3>
              <button onClick={() => setSelectedItemInfo(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>
            
            {selectedItemInfo.imageUrl && (
              <img src={selectedItemInfo.imageUrl} alt={selectedItemInfo.name} style={{ width: '100%', borderRadius: 'var(--radius-md)', marginBottom: '1rem', objectFit: 'contain', maxHeight: '300px' }} />
            )}
            
            {selectedItemInfo.description ? (
              <p style={{ fontSize: '1.125rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{selectedItemInfo.description}</p>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>説明はありません。</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
