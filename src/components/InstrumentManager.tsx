import { useState, useMemo } from 'react';
import type { InstrumentMaster } from '../types';
import { Package, Search, Plus, Trash2, Camera, Edit3, X } from 'lucide-react';
import { updateInstrumentMaster, uploadImage, deleteInstrumentMaster } from '../firebaseUtils';
import { addLog } from '../firebaseLogs';

interface Props {
  instruments: Record<string, InstrumentMaster>;
  editorName: string;
}

export function InstrumentManager({ instruments, editorName }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // モーダル管理
  const [editingItemName, setEditingItemName] = useState<string | null>(null);
  const [masterDraftDesc, setMasterDraftDesc] = useState('');
  const [uploadingIdx, setUploadingIdx] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newInstrumentName, setNewInstrumentName] = useState('');

  // 検索フィルタ
  const filteredInstruments = useMemo(() => {
    const list = Object.values(instruments);
    if (!searchQuery.trim()) return list;
    const lowerQuery = searchQuery.toLowerCase();
    return list.filter(inst => inst.name.toLowerCase().includes(lowerQuery));
  }, [instruments, searchQuery]);

  const openEditModal = (name: string) => {
    setMasterDraftDesc(instruments[name]?.masterDescription || '');
    setEditingItemName(name);
  };

  const closeEditModal = () => {
    setEditingItemName(null);
    setMasterDraftDesc('');
  };

  const handleSaveDesc = async () => {
    if (!editingItemName) return;
    await updateInstrumentMaster(editingItemName, { masterDescription: masterDraftDesc });
    await addLog(editorName, 'update_master_desc', editingItemName);
    closeEditModal();
  };

  const handleImageUpload = async (file: File) => {
    if (!editingItemName) return;
    setUploadingIdx(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `preparations/${editingItemName.replace(/[/]/g, '_')}_${Date.now()}.${ext}`;
      const url = await uploadImage(file, path);
      await updateInstrumentMaster(editingItemName, { imageUrl: url });
      await addLog(editorName, 'update_master_image', editingItemName);
    } catch (e) {
      console.error("Image upload failed", e);
      alert("画像のアップロードに失敗しました。");
    } finally {
      setUploadingIdx(false);
    }
  };

  const handleDelete = async (name: string) => {
    if (window.confirm(`「${name}」をマスターから削除しますか？\n※すでに処置に登録されているものは消えませんが、写真と共通説明が参照できなくなります。`)) {
      await deleteInstrumentMaster(name);
      await addLog(editorName, 'update_master_desc', `${name}を削除`);
    }
  };

  const handleCreateNew = async () => {
    const name = newInstrumentName.trim();
    if (!name) return;
    if (instruments[name]) {
      alert('その名前の器具はすでに存在します。');
      return;
    }
    await updateInstrumentMaster(name, { name });
    setNewInstrumentName('');
    setIsCreatingNew(false);
    openEditModal(name);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card">
        <h2 className="section-title">
          <Package size={24} />
          器具・材料マスター
        </h2>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flexGrow: 1, minWidth: '200px' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="器具名を検索..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', 
                fontSize: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)'
              }}
            />
          </div>
          <button 
            onClick={() => setIsCreatingNew(true)}
            className="doctor-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
          >
            <Plus size={20} />
            新しい器具を登録
          </button>
        </div>

        {/* 新規作成フォーム（インライン表示） */}
        {isCreatingNew && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: 'var(--radius-md)', border: '1px dashed #22c55e' }}>
            <input 
              type="text" 
              placeholder="新しい器具名を入力" 
              value={newInstrumentName}
              onChange={(e) => setNewInstrumentName(e.target.value)}
              autoFocus
              style={{ flexGrow: 1, padding: '0.75rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
            />
            <button 
              onClick={handleCreateNew}
              style={{ padding: '0 1.5rem', backgroundColor: '#166534', color: 'white', borderRadius: '4px', border: 'none', fontWeight: 600, cursor: 'pointer' }}
            >
              登録
            </button>
            <button 
              onClick={() => { setIsCreatingNew(false); setNewInstrumentName(''); }}
              style={{ padding: '0 1rem', background: 'none', border: 'none', color: '#166534', cursor: 'pointer' }}
            >
              キャンセル
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {filteredInstruments.map(inst => (
            <div key={inst.name} style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'white' }}>
              {inst.imageUrl ? (
                <div style={{ width: '100%', height: '160px', backgroundImage: `url(${inst.imageUrl})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-color)' }} />
              ) : (
                <div style={{ width: '100%', height: '160px', backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#94a3b8', borderBottom: '1px solid var(--border-color)' }}>
                  <Camera size={40} />
                </div>
              )}
              
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', fontWeight: 700, color: 'var(--text-main)' }}>
                  {inst.name}
                </h3>
                {inst.masterDescription ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1rem 0', flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {inst.masterDescription}
                  </p>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '0 0 1rem 0', flexGrow: 1, fontStyle: 'italic' }}>
                    共通説明はありません
                  </p>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                  <button 
                    onClick={() => openEditModal(inst.name)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: '0.5rem 0' }}
                  >
                    <Edit3 size={16} />
                    編集
                  </button>
                  <button 
                    onClick={() => handleDelete(inst.name)}
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredInstruments.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              器具が見つかりません。
            </div>
          )}
        </div>
      </div>

      {/* 編集モーダル */}
      {editingItemName && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem'
        }} onClick={closeEditModal}>
          <div 
            style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', padding: '1.5rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{editingItemName}</h3>
              <button onClick={closeEditModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>共通写真</label>
              {instruments[editingItemName]?.imageUrl ? (
                <div style={{ marginBottom: '1rem' }}>
                  <img src={instruments[editingItemName].imageUrl} alt="current" style={{ width: '100%', borderRadius: 'var(--radius-md)', objectFit: 'contain', maxHeight: '200px' }} />
                </div>
              ) : (
                <div style={{ height: '100px', background: '#f3f4f6', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#9ca3af' }}>写真未登録</div>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
                  <Camera size={20} />
                  写真を撮影／アップロード
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
              onClick={handleSaveDesc}
              style={{ width: '100%', padding: '0.75rem', background: 'var(--primary)', color: 'white', fontWeight: 700, borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer' }}
            >
              説明文を保存
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
