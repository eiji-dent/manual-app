import { useState } from 'react';
import type { Procedure, PreparationItem, InstrumentMaster } from '../types';
import { AlertCircle, Lightbulb, CheckSquare, Plus, Trash2, X, Camera, Edit3 } from 'lucide-react';
import { uploadImage, updateInstrumentMaster } from '../firebaseUtils';
import { addLog } from '../firebaseLogs';

interface Props {
  procedure: Procedure;
  instruments: Record<string, InstrumentMaster>;
  isEditMode: boolean;
  editorName: string;
  onUpdateProcedure: (updatedProcedure: Procedure) => void;
}

export function PreparationList({ procedure, instruments, isEditMode, editorName, onUpdateProcedure }: Props) {
  const [selectedItemInfo, setSelectedItemInfo] = useState<{name: string, description?: string, imageUrl?: string} | null>(null);
  
  // 共通データ編集用モーダルの状態
  const [editingMasterItemName, setEditingMasterItemName] = useState<string | null>(null);
  const [masterDraftDesc, setMasterDraftDesc] = useState('');
  const [uploadingIdx, setUploadingIdx] = useState<boolean>(false);

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

  const openMasterEditModal = (itemName: string) => {
    const master = instruments[itemName];
    setMasterDraftDesc(master?.masterDescription || '');
    setEditingMasterItemName(itemName);
  };

  const saveMasterDesc = async () => {
    if (!editingMasterItemName) return;
    await updateInstrumentMaster(editingMasterItemName, { masterDescription: masterDraftDesc });
    await addLog(editorName, 'update_master_desc', editingMasterItemName);
    setEditingMasterItemName(null);
  };

  const handleImageUpload = async (file: File) => {
    if (!editingMasterItemName) return;
    setUploadingIdx(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `preparations/${editingMasterItemName.replace(/[/]/g, '_')}_${Date.now()}.${ext}`;
      const url = await uploadImage(file, path);
      await updateInstrumentMaster(editingMasterItemName, { imageUrl: url });
      await addLog(editorName, 'update_master_image', editingMasterItemName);
    } catch (e) {
      console.error("Image upload failed", e);
      alert("画像のアップロードに失敗しました。");
    } finally {
      setUploadingIdx(false);
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
            const masterData = instruments[item.name];
            
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
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>この処置での個別メモ（グレー文字）</label>
                      <textarea
                        placeholder="例：この時は3本用意する、など"
                        value={item.description || ''}
                        onChange={(e) => handleUpdateItem(idx, { ...item, description: e.target.value })}
                        style={{ padding: '0.5rem', fontSize: '1rem', border: '1px solid var(--border-color)', borderRadius: '4px', resize: 'vertical' }}
                      />
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          openMasterEditModal(item.name);
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, color: '#374151' }}
                      >
                        <Edit3 size={18} />
                        写真・共通説明を編集（全体に反映）
                      </button>
                      
                      {masterData?.imageUrl && (
                        <div style={{ width: '36px', height: '36px', borderRadius: '4px', backgroundImage: `url(${masterData.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid var(--border-color)' }} />
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
                    {(masterData?.imageUrl || masterData?.masterDescription) && (
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedItemInfo({
                            name: item.name,
                            description: masterData?.masterDescription,
                            imageUrl: masterData?.imageUrl
                          });
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center' }}
                        title="写真・説明を見る"
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

      {/* 写真・説明表示モーダル（閲覧用） */}
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
              <p style={{ color: 'var(--text-muted)' }}>共通の説明はありません。</p>
            )}
          </div>
        </div>
      )}

      {/* 写真・共通説明編集モーダル（マスター編集用） */}
      {editingMasterItemName && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem'
        }} onClick={() => setEditingMasterItemName(null)}>
          <div 
            style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', padding: '1.5rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{editingMasterItemName} の共通データ</h3>
              <button onClick={() => setEditingMasterItemName(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              ※ここで設定した写真と説明は、全ての処置リストの同じ名前の器具に自動で反映されます。
            </p>

            {/* 写真 */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>共通写真</label>
              {instruments[editingMasterItemName]?.imageUrl ? (
                <div style={{ marginBottom: '1rem' }}>
                  <img src={instruments[editingMasterItemName].imageUrl} alt="current" style={{ width: '100%', borderRadius: 'var(--radius-md)', objectFit: 'contain', maxHeight: '200px' }} />
                </div>
              ) : (
                <div style={{ height: '100px', background: '#f3f4f6', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#9ca3af' }}>写真未登録</div>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
                  <Camera size={20} />
                  {instruments[editingMasterItemName]?.imageUrl ? '写真を変更する' : '写真を撮影／アップロード'}
                  <input 
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                {uploadingIdx && <span style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>送信中...</span>}
              </div>
            </div>

            {/* 説明 */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>ポップアップ用の共通説明</label>
              <textarea
                value={masterDraftDesc}
                onChange={(e) => setMasterDraftDesc(e.target.value)}
                placeholder="例：この器具は滅菌パックに入れること、など"
                style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid var(--border-color)', borderRadius: '4px', minHeight: '100px', resize: 'vertical' }}
              />
            </div>

            <button 
              onClick={saveMasterDesc}
              style={{ width: '100%', padding: '0.75rem', background: 'var(--primary)', color: 'white', fontWeight: 700, borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer' }}
            >
              説明文を保存して閉じる
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
