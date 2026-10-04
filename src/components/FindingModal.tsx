import React, { useState } from 'react';
import { MOCK_FINDING } from '../data/mockData';

interface FindingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (findingData: any) => void;
}

export const FindingModal: React.FC<FindingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState(MOCK_FINDING.title);
  const [severity, setSeverity] = useState(MOCK_FINDING.severity);
  const [statute, setStatute] = useState(MOCK_FINDING.primaryStatute);
  const [summary, setSummary] = useState(MOCK_FINDING.summary);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: MOCK_FINDING.id,
      title,
      severity,
      statute,
      summary,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center p-space-lg animate-in fade-in">
      <div className="bg-surface-container-low border border-outline-variant/30 max-w-xl w-full rounded-xl p-space-xl shadow-2xl space-y-space-lg">
        {/* Header */}
        <div className="flex items-center justify-between pb-space-sm bg-surface-container-lowest/60 p-space-md rounded">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded bg-primary-container/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">gavel</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Create Regulatory Finding
              </h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                Pre-populated via Copilot Reasoning &amp; Evidence Engine
              </span>
            </div>
          </div>
          <button
            className="text-on-surface-variant hover:text-on-surface p-1 rounded"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-space-md">
          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1 font-mono uppercase">
              FINDING REFERENCE ID
            </label>
            <input
              className="w-full h-9 px-space-md bg-surface-container rounded font-label-md text-label-md text-primary font-bold focus:outline-none font-mono"
              readOnly
              type="text"
              value={MOCK_FINDING.id}
            />
          </div>

          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1 font-mono uppercase">
              FINDING TITLE
            </label>
            <input
              className="w-full h-9 px-space-md bg-surface-container rounded font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-high transition-colors"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-space-md">
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1 font-mono uppercase">
                SEVERITY LEVEL
              </label>
              <select
                className="w-full h-9 px-space-md bg-surface-container text-on-surface rounded font-body-sm text-body-sm focus:outline-none"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
              >
                <option value="CRITICAL (Tier 1)">CRITICAL (STR-01 Required)</option>
                <option value="HIGH">HIGH (Enhanced Due Diligence)</option>
                <option value="MEDIUM">MEDIUM (Surveillance)</option>
                <option value="INFORMATIONAL">INFORMATIONAL</option>
              </select>
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1 font-mono uppercase">
                PRIMARY STATUTE / REGULATION
              </label>
              <input
                className="w-full h-9 px-space-md bg-surface-container rounded font-body-sm text-body-sm text-on-surface focus:outline-none"
                type="text"
                value={statute}
                onChange={(e) => setStatute(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1 font-mono uppercase">
              EXECUTIVE SUMMARY / COPILOT REASONING
            </label>
            <textarea
              className="w-full p-space-md bg-surface-container text-on-surface rounded font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-high leading-relaxed"
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <div className="p-space-md bg-surface-container rounded flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
              <span className="font-label-sm text-label-sm text-on-surface">
                Attach 4 verified SHA-256 evidence records
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-tertiary font-bold font-mono">READY</span>
          </div>

          <div className="flex items-center justify-end gap-space-md pt-space-xs">
            <button
              type="button"
              className="px-space-lg py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-body-md text-body-md transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-space-xl py-2 bg-primary-container text-on-primary-container font-headline-sm text-headline-sm rounded flex items-center gap-space-xs shadow-md hover:brightness-110 active:scale-95 transition-all font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Submit to Compliance Head</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
