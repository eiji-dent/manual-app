
import type { Doctor } from '../types';
import { User } from 'lucide-react';

interface Props {
  doctors: Doctor[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function DoctorSelector({ doctors, selectedId, onSelect }: Props) {
  return (
    <div className="card">
      <h2 className="section-title">
        <User size={20} />
        ドクター選択
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {doctors.map(doc => (
          <button
            key={doc.id}
            className={`doctor-btn ${selectedId === doc.id ? 'active' : ''}`}
            onClick={() => onSelect(doc.id)}
          >
            {doc.name}
          </button>
        ))}
      </div>
    </div>
  );
}
