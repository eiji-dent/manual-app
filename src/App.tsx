import React, { useState } from 'react';
import { mockDoctors } from './data/mockData';
import { DoctorSelector } from './components/DoctorSelector';
import { ProcedureSelector } from './components/ProcedureSelector';
import { PreparationList } from './components/PreparationList';
import { EditorSelector, type EditorType } from './components/EditorSelector';
import { Settings, Activity } from 'lucide-react';

function App() {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(mockDoctors[0]?.id || null);
  const [selectedProcedureId, setSelectedProcedureId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditor, setCurrentEditor] = useState<EditorType>(null);
  const [guestName, setGuestName] = useState<string>('');

  const selectedDoctor = mockDoctors.find(d => d.id === selectedDoctorId);
  const selectedProcedure = selectedDoctor?.procedures.find(p => p.id === selectedProcedureId);

  // ドクターが変わったら処置の選択をリセットするか、最初の処置を選ぶ
  const handleDoctorSelect = (id: string) => {
    setSelectedDoctorId(id);
    const doctor = mockDoctors.find(d => d.id === id);
    if (doctor && doctor.procedures.length > 0) {
      setSelectedProcedureId(doctor.procedures[0].id);
    } else {
      setSelectedProcedureId(null);
    }
  };

  // 初期ロード時に最初のドクターの最初の処置を選択しておく
  React.useEffect(() => {
    if (selectedDoctor && !selectedProcedureId && selectedDoctor.procedures.length > 0) {
      setSelectedProcedureId(selectedDoctor.procedures[0].id);
    }
  }, [selectedDoctor, selectedProcedureId]);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="app-header">
          <h1 className="app-title">
            <Activity size={28} />
            DentalPrep
          </h1>
        </div>

        <EditorSelector 
          currentEditor={currentEditor}
          guestName={guestName}
          onSelectEditor={(editor, guest) => {
            setCurrentEditor(editor);
            if (guest !== undefined) setGuestName(guest);
          }}
        />

        <DoctorSelector 
          doctors={mockDoctors} 
          selectedId={selectedDoctorId} 
          onSelect={handleDoctorSelect} 
        />
        
        <div style={{ marginTop: 'auto' }}>
          <button 
            className={`edit-mode-btn ${isEditMode ? 'active' : ''}`}
            onClick={() => setIsEditMode(!isEditMode)}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Settings size={18} />
            {isEditMode ? '編集モード終了' : 'マスター編集モード'}
          </button>
        </div>
      </aside>

      <main className="main-content">
        {isEditMode && (
          <div className="alert-box alert-warning" style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5', color: '#991b1b' }}>
            <Settings size={24} className="alert-icon" />
            <div>
              <div className="alert-title">マスター編集モード中</div>
              <div className="alert-content">
                現在表示されている準備物や特記事項をクリックして直接編集できるようになります。（モックアップのため表示のみ）
              </div>
            </div>
          </div>
        )}

        {selectedDoctor && (
          <ProcedureSelector 
            procedures={selectedDoctor.procedures} 
            selectedId={selectedProcedureId}
            onSelect={setSelectedProcedureId}
          />
        )}

        {selectedProcedure ? (
          <PreparationList procedure={selectedProcedure} />
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            ドクターと処置を選択してください
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
