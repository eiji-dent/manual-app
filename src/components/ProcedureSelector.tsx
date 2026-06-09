import React from 'react';
import type { Procedure } from '../types';
import { Stethoscope } from 'lucide-react';

interface Props {
  procedures: Procedure[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ProcedureSelector({ procedures, selectedId, onSelect }: Props) {
  if (procedures.length === 0) return null;

  return (
    <div className="card">
      <h2 className="section-title">
        <Stethoscope size={20} />
        処置メニュー
      </h2>
      <div className="procedure-tabs">
        {procedures.map(proc => (
          <button
            key={proc.id}
            className={`procedure-tab ${selectedId === proc.id ? 'active' : ''}`}
            onClick={() => onSelect(proc.id)}
          >
            {proc.name}
          </button>
        ))}
      </div>
    </div>
  );
}
