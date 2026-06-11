import { useState, useEffect } from 'react';
import { DoctorSelector } from './components/DoctorSelector';
import { ProcedureSelector } from './components/ProcedureSelector';
import { PreparationList } from './components/PreparationList';
import { InstrumentManager } from './components/InstrumentManager';
import { EditorSelector, type EditorType } from './components/EditorSelector';
import { ActivityLogViewer } from './components/ActivityLogViewer';
import { Settings, Activity, History, Package, ClipboardList } from 'lucide-react';
import { subscribeToDoctors, subscribeToInstruments, initializeFirestoreData } from './firebaseUtils';
import { addLog } from './firebaseLogs';
import type { Doctor, InstrumentMaster } from './types';

function App() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [instrumentsMap, setInstrumentsMap] = useState<Record<string, InstrumentMaster>>({});
  const [loading, setLoading] = useState(true);

  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedProcedureId, setSelectedProcedureId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditor, setCurrentEditor] = useState<EditorType>(null);
  const [guestName, setGuestName] = useState<string>('');
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [currentView, setCurrentView] = useState<'procedures' | 'master'>('procedures');

  const getEditorName = () => {
    if (currentEditor === 'ゲスト') return guestName || 'ゲスト';
    if (currentEditor) return currentEditor;
    return '未選択';
  };

  const handleEditModeToggle = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setCurrentEditor(null);
    } else {
      setShowEditorModal(true);
    }
  };

  useEffect(() => {
    // データベースの初期化（初回のみ）
    initializeFirestoreData();

    // リアルタイム同期の開始
    const unsubscribeDocs = subscribeToDoctors((data) => {
      setDoctors(data);
      setLoading(false);
      
      // データ取得後に未選択なら最初のドクターを選択
      if (data.length > 0 && !selectedDoctorId) {
        setSelectedDoctorId(data[0].id);
        if (data[0].procedures.length > 0) {
          setSelectedProcedureId(data[0].procedures[0].id);
        }
      }
    });

    const unsubscribeInsts = subscribeToInstruments((map) => {
      setInstrumentsMap(map);
    });

    return () => {
      unsubscribeDocs();
      unsubscribeInsts();
    };
  }, [selectedDoctorId]);

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);
  const selectedProcedure = selectedDoctor?.procedures.find(p => p.id === selectedProcedureId);

  // ドクターが変わったら処置の選択をリセットするか、最初の処置を選ぶ
  const handleDoctorSelect = (id: string) => {
    setSelectedDoctorId(id);
    const doctor = doctors.find(d => d.id === id);
    if (doctor && doctor.procedures.length > 0) {
      setSelectedProcedureId(doctor.procedures[0].id);
    } else {
      setSelectedProcedureId(null);
    }
  };

  if (loading) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="app-header" style={{ marginBottom: '1rem' }}>
          <h1 className="app-title">
            <Activity size={28} />
            DentalPrep
          </h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button 
            className={`procedure-tab ${currentView === 'procedures' ? 'active' : ''}`}
            onClick={() => setCurrentView('procedures')}
            style={{ width: '100%', justifyContent: 'flex-start', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: currentView === 'procedures' ? 'var(--primary)' : 'transparent', color: currentView === 'procedures' ? 'white' : 'var(--text-main)', cursor: 'pointer', fontWeight: 600 }}
          >
            <ClipboardList size={20} />
            処置マニュアル
          </button>
          <button 
            className={`procedure-tab ${currentView === 'master' ? 'active' : ''}`}
            onClick={() => setCurrentView('master')}
            style={{ width: '100%', justifyContent: 'flex-start', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: currentView === 'master' ? 'var(--primary)' : 'transparent', color: currentView === 'master' ? 'white' : 'var(--text-main)', cursor: 'pointer', fontWeight: 600 }}
          >
            <Package size={20} />
            器具・材料一覧
          </button>
        </div>

        {currentView === 'procedures' && (
          <DoctorSelector 
            doctors={doctors} 
            selectedId={selectedDoctorId} 
            onSelect={handleDoctorSelect} 
          />
        )}

        <EditorSelector 
          isOpen={showEditorModal}
          onClose={() => setShowEditorModal(false)}
          onSelectEditor={(editor, guest) => {
            setCurrentEditor(editor);
            if (guest !== undefined) setGuestName(guest);
            setIsEditMode(true);
            setShowEditorModal(false);
          }}
        />
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            className="edit-mode-btn"
            onClick={() => setIsLogOpen(true)}
            style={{ width: '100%', justifyContent: 'center', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}
          >
            <History size={18} />
            変更履歴を見る
          </button>
          <button 
            className={`edit-mode-btn ${isEditMode ? 'active' : ''}`}
            onClick={handleEditModeToggle}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Settings size={18} />
            {isEditMode ? `編集中: ${getEditorName()} (終了)` : 'マスター編集モード'}
          </button>
        </div>
      </aside>

      <main className="main-content">
        {currentView === 'master' ? (
          <InstrumentManager 
            instruments={instrumentsMap}
            editorName={getEditorName()}
          />
        ) : (
          <>
            {isEditMode && (
              <div className="alert-box alert-warning" style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5', color: '#991b1b', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Settings size={24} className="alert-icon" />
                  <div>
                    <div className="alert-title">マスター編集モード中</div>
                    <div className="alert-content">
                      ※ 現在は「表示」と「Firebaseのリアルタイム同期」までの実装となっています。実際の編集・保存機能は実装準備中です！
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button 
                    onClick={async () => {
                      if (!window.confirm('Wordマニュアルのアシスト手順を、関連する処置に一括反映しますか？（※既存の手順は上書きされます）')) return;
                      try {
                        const { manualStepsData } = await import('./data/manualData');
                        const { updateDoctor } = await import('./firebaseUtils');
                        
                        let updatedCount = 0;
                        for (const doctor of doctors) {
                          if (!doctor.procedures) continue;
                          let changed = false;
                          const newProcedures = doctor.procedures.map(proc => {
                            let stepsToApply = null;
                            const procName = proc.name.toLowerCase();
                            
                            if (procName.includes('mta')) {
                              stepsToApply = procName.includes('パテ') ? manualStepsData['パテタイプのMTA'] : manualStepsData['MTA'];
                            } else if (procName.includes('rcf') || procName.includes('根充')) {
                              stepsToApply = manualStepsData['RCF'];
                            } else if (procName.includes('コア') || procName.includes('土台')) {
                              if (procName.includes('除去')) {
                                stepsToApply = manualStepsData['Zr・レジンコア除去'];
                              } else {
                                stepsToApply = manualStepsData['コア築'];
                              }
                            } else if (procName.includes('tek') || procName.includes('テック')) {
                              stepsToApply = manualStepsData['TEK調整'];
                            }
                            
                            if (stepsToApply) {
                              changed = true;
                              updatedCount++;
                              return { ...proc, assistantSteps: stepsToApply };
                            }
                            return proc;
                          });
                          
                          if (changed) {
                            await updateDoctor(doctor.id, { procedures: newProcedures });
                          }
                        }
                        alert(`マニュアルデータの反映が完了しました！（${updatedCount}件の処置を更新）`);
                      } catch (e: any) {
                        console.error("Migration error:", e);
                        alert(`エラーが発生しました: ${e.message || '不明なエラー'}`);
                      }
                    }}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                  >
                    📖 Wordマニュアルの手順を一括反映する
                  </button>
                  <button 
                    onClick={async () => {
                      if (!window.confirm('過去に各処置で入力された「文字だけの器具データ」を、すべて共通マスターに登録しますか？')) return;
                      try {
                        const { updateInstrumentMaster } = await import('./firebaseUtils');
                        for (const doctor of doctors) {
                          if (!doctor.procedures) continue;
                          for (const proc of doctor.procedures) {
                            if (!proc.items) continue;
                            for (const item of proc.items) {
                              if (!item) continue;
                              const itemName = typeof item === 'string' ? item : item.name;
                              if (!itemName || !itemName.trim()) continue;
                              
                              const cleanName = itemName.trim();
                              if (!instrumentsMap[cleanName]) {
                                await updateInstrumentMaster(cleanName, { name: cleanName });
                              }
                            }
                          }
                        }
                        alert('マスターへの一括同期が完了しました！');
                      } catch (e: any) {
                        console.error("Migration error:", e);
                        alert(`エラーが発生しました: ${e.message || '不明なエラー'}`);
                      }
                    }}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                  >
                    🚀 文字だけの器具をマスターに一括同期する
                  </button>
                </div>
              </div>
            )}

            {selectedDoctor && (
              <ProcedureSelector 
                procedures={selectedDoctor.procedures} 
                selectedId={selectedProcedureId}
                onSelect={setSelectedProcedureId}
                isEditMode={isEditMode}
                onAddProcedure={async (name) => {
                  const newId = `proc-${Date.now()}`;
                  const newProcedures = [...selectedDoctor.procedures, { id: newId, name, items: [] }];
                  try {
                    const { updateDoctor } = await import('./firebaseUtils');
                    await updateDoctor(selectedDoctor.id, { procedures: newProcedures });
                    setSelectedProcedureId(newId);
                    await addLog(getEditorName(), 'update_procedure', `${selectedDoctor.name}に「${name}」を追加`);
                  } catch (e) {
                    console.error("Add procedure failed", e);
                  }
                }}
              />
            )}

            {selectedProcedure ? (
              <PreparationList 
                procedure={selectedProcedure} 
                instruments={instrumentsMap}
                isEditMode={isEditMode}
                editorName={getEditorName()}
                onUpdateProcedure={async (updatedProc) => {
                  if (!selectedDoctor) return;
                  const newProcedures = selectedDoctor.procedures.map(p => 
                    p.id === updatedProc.id ? updatedProc : p
                  );
                  try {
                    const { updateDoctor } = await import('./firebaseUtils');
                    await updateDoctor(selectedDoctor.id, { procedures: newProcedures });
                    await addLog(getEditorName(), 'update_procedure', `${selectedDoctor.name} - ${updatedProc.name}`);
                  } catch (e) {
                    console.error("Update failed", e);
                  }
                }}
              />
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                ドクターと処置を選択してください
              </div>
            )}
          </>
        )}
      </main>

      <ActivityLogViewer isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} />
    </div>
  );
}

export default App;
