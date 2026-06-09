import React from 'react';
import type { Procedure } from '../types';
import { AlertCircle, Lightbulb, Image as ImageIcon, CheckSquare } from 'lucide-react';

interface Props {
  procedure: Procedure;
}

export function PreparationList({ procedure }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {procedure.checkItems && procedure.checkItems.length > 0 && (
        <div className="alert-box alert-warning">
          <AlertCircle className="alert-icon" size={24} />
          <div>
            <div className="alert-title">先生に都度確認する事項</div>
            <div className="alert-content">
              {procedure.checkItems.map((item, idx) => (
                <div key={idx}>{item}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {procedure.notes && (
        <div className="alert-box alert-info">
          <Lightbulb className="alert-icon" size={24} />
          <div>
            <div className="alert-title">アシスト特記事項</div>
            <div className="alert-content">{procedure.notes}</div>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="section-title">
          <CheckSquare size={20} />
          準備物リスト
        </h2>
        <div className="prep-list">
          {procedure.items.map((item, idx) => (
            <label key={idx} className="prep-item">
              <input type="checkbox" className="prep-item-checkbox" />
              <span className="prep-item-label">{item}</span>
              <ImageIcon className="photo-placeholder" size={18} title="写真を表示（将来実装）" />
            </label>
          ))}
        </div>
      </div>

      {procedure.conditionalItems && procedure.conditionalItems.length > 0 && (
        <>
          {procedure.conditionalItems.map((cond, idx) => (
            <div key={idx} className="card" style={{ backgroundColor: '#f8fafc' }}>
              <h3 className="section-title" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
                条件付き追加：{cond.condition}
              </h3>
              <div className="prep-list">
                {cond.items.map((item, itemIdx) => (
                  <label key={itemIdx} className="prep-item" style={{ backgroundColor: '#ffffff' }}>
                    <input type="checkbox" className="prep-item-checkbox" />
                    <span className="prep-item-label">{item}</span>
                    <ImageIcon className="photo-placeholder" size={18} title="写真を表示（将来実装）" />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

    </div>
  );
}
