import { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import type { Procedure, AssistantStep } from '../types';
import { uploadImage } from '../firebaseUtils';
import { addLog } from '../firebaseLogs';

interface ProcedureStepsProps {
  procedure: Procedure;
  isEditMode: boolean;
  editorName: string;
  onUpdateProcedure: (updated: Procedure) => void;
}

export function ProcedureSteps({ procedure, isEditMode, editorName, onUpdateProcedure }: ProcedureStepsProps) {
  const steps = procedure.assistantSteps || [];
  const [uploadingStepId, setUploadingStepId] = useState<string | null>(null);

  const handleAddStep = () => {
    const newStep: AssistantStep = {
      id: `step-${Date.now()}`,
      stepNumber: steps.length + 1,
      description: '新しい手順',
    };
    onUpdateProcedure({
      ...procedure,
      assistantSteps: [...steps, newStep]
    });
  };

  const handleDeleteStep = (stepId: string) => {
    if (!window.confirm('この手順を削除しますか？')) return;
    const newSteps = steps.filter(s => s.id !== stepId)
      .map((s, index) => ({ ...s, stepNumber: index + 1 })); // 番号を振り直す
    onUpdateProcedure({ ...procedure, assistantSteps: newSteps });
  };

  const handleUpdateStep = (stepId: string, updates: Partial<AssistantStep>) => {
    const newSteps = steps.map(s => s.id === stepId ? { ...s, ...updates } : s);
    onUpdateProcedure({ ...procedure, assistantSteps: newSteps });
  };

  const handleImageUpload = async (stepId: string, file: File) => {
    try {
      setUploadingStepId(stepId);
      const path = `assistant_steps/${procedure.id}/${stepId}_${file.name}`;
      const url = await uploadImage(file, path);
      handleUpdateStep(stepId, { imageUrl: url });
      await addLog(editorName, 'update_procedure', `${procedure.name} の手順画像を追加しました`);
    } catch (e) {
      console.error('Image upload failed', e);
      alert('画像のアップロードに失敗しました。');
    } finally {
      setUploadingStepId(null);
    }
  };

  if (!isEditMode && steps.length === 0) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        アシスト手順はまだ登録されていません。
      </div>
    );
  }

  return (
    <div className="procedure-steps-container">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {steps.map((step) => (
          <div key={step.id} className="card" style={{ display: 'flex', gap: '1rem', padding: '1rem', alignItems: 'flex-start' }}>
            
            <div style={{
              backgroundColor: 'var(--primary)', 
              color: 'white', 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 'bold',
              flexShrink: 0
            }}>
              {step.stepNumber}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {isEditMode ? (
                <>
                  <textarea 
                    value={step.description}
                    onChange={(e) => handleUpdateStep(step.id, { description: e.target.value })}
                    placeholder="手順の説明"
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '60px' }}
                  />
                  <input 
                    type="text"
                    value={step.note || ''}
                    onChange={(e) => handleUpdateStep(step.id, { note: e.target.value })}
                    placeholder="注意点（あれば）"
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                  />
                </>
              ) : (
                <>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, whiteSpace: 'pre-wrap' }}>{step.description}</div>
                  {step.note && (
                    <div style={{ color: '#b91c1c', backgroundColor: '#fef2f2', padding: '0.5rem', borderRadius: '4px', fontSize: '0.9rem' }}>
                      <strong>注意：</strong> {step.note}
                    </div>
                  )}
                </>
              )}

              {/* 画像セクション */}
              <div style={{ marginTop: '0.5rem' }}>
                {step.imageUrl ? (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={step.imageUrl} alt={`手順 ${step.stepNumber}`} style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', border: '1px solid var(--border)' }} />
                    {isEditMode && (
                      <button 
                        onClick={() => handleUpdateStep(step.id, { imageUrl: undefined })}
                        style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: 'white', border: 'none', borderRadius: '50%', padding: '0.25rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                      >
                        <Trash2 size={16} color="red" />
                      </button>
                    )}
                  </div>
                ) : (
                  isEditMode && (
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-muted)' }}>
                      <ImageIcon size={18} />
                      {uploadingStepId === step.id ? 'アップロード中...' : '写真を追加'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(step.id, file);
                        }}
                        disabled={uploadingStepId === step.id}
                      />
                    </label>
                  )
                )}
              </div>
            </div>

            {isEditMode && (
              <button 
                onClick={() => handleDeleteStep(step.id)}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}
                title="この手順を削除"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}
      </div>

      {isEditMode && (
        <button 
          onClick={handleAddStep}
          style={{ 
            marginTop: '1rem', 
            width: '100%', 
            padding: '1rem', 
            border: '2px dashed var(--border)', 
            backgroundColor: 'transparent', 
            color: 'var(--text-muted)', 
            borderRadius: '8px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontWeight: 600
          }}
        >
          <Plus size={20} />
          手順を追加する
        </button>
      )}
    </div>
  );
}
