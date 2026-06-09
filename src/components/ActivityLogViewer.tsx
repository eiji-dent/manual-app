import { useState, useEffect } from 'react';
import { subscribeToLogs } from '../firebaseLogs';
import type { ActivityLog } from '../types';
import { Clock, X, User, Edit, Camera, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ActivityLogViewer({ isOpen, onClose }: Props) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    
    // 開いている時だけ直近50件を購読
    const unsubscribe = subscribeToLogs(50, (data) => {
      setLogs(data);
    });

    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const getActionDetails = (action: string) => {
    switch (action) {
      case 'update_procedure':
        return { icon: <Edit size={16} />, text: '処置を更新', color: 'var(--primary)' };
      case 'update_master_image':
        return { icon: <Camera size={16} />, text: '共通写真を変更', color: '#10b981' }; // green
      case 'update_master_desc':
        return { icon: <FileText size={16} />, text: '共通説明を変更', color: '#8b5cf6' }; // purple
      default:
        return { icon: <Edit size={16} />, text: '変更', color: 'var(--text-muted)' };
    }
  };

  const formatTime = (timestamp: number) => {
    const d = new Date(timestamp);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${mm}/${dd} ${hh}:${min}`;
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'flex-end', zIndex: 2000
    }} onClick={onClose}>
      <div 
        style={{
          width: '100%', maxWidth: '400px', height: '100%', backgroundColor: 'white',
          boxShadow: '-4px 0 15px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column',
          animation: 'slideInRight 0.3s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <Clock size={24} color="var(--primary)" />
            変更履歴
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem' }}>
          {logs.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
              履歴はありません
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {logs.map(log => {
                const details = getActionDetails(log.action);
                return (
                  <div key={log.id} style={{ 
                    display: 'flex', gap: '1rem', padding: '1rem', 
                    backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{ 
                      width: '32px', height: '32px', borderRadius: '50%', 
                      backgroundColor: 'white', display: 'flex', justifyContent: 'center', 
                      alignItems: 'center', color: details.color, flexShrink: 0,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      {details.icon}
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <User size={14} />
                          {log.editorName}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {formatTime(log.timestamp)}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.95rem' }}>
                        <span style={{ color: details.color, fontWeight: 500 }}>{details.text}</span>: <br/>
                        <span style={{ fontWeight: 600 }}>{log.targetName}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
