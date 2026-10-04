import React, { useState } from 'react';
import { AlertIncident } from '../types';

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (alert: AlertIncident) => void;
}

export const CreateAlertModal: React.FC<CreateAlertModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [segment, setSegment] = useState<'AU Cards' | 'APAC Cards' | 'ME Cards' | 'AS Cards' | 'EU Payments'>('APAC Cards');
  const [severity, setSeverity] = useState<'high' | 'medium' | 'low'>('high');
  const [owner, setOwner] = useState('Emily Wang');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const randNum = Math.floor(10 + Math.random() * 90);
    const newAlert: AlertIncident = {
      id: `alt-${Date.now()}`,
      code: `ALT-0${randNum}`,
      title,
      severity,
      segment,
      started: 'Just now',
      status: 'Investigating',
      owner: { name: owner },
      details: {
        volume: '$240,000.00',
        affectedUsers: 34,
        description: description || 'Automated rule violation flagged by Dhoomketu anomaly detector.',
        suggestedAction: 'Review transaction ledger and cross-reference device fingerprint.',
      },
    };

    onCreate(newAlert);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              +
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Create Risk Alert</h3>
              <p className="text-xs text-slate-500">Configure new threshold trigger or operational anomaly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Alert Headline</label>
            <input
              type="text"
              required
              placeholder="e.g. Velocity surge detected on merchant checkout gateway"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Target Segment</label>
              <select
                value={segment}
                onChange={(e) => setSegment(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none"
              >
                <option value="APAC Cards">APAC Cards</option>
                <option value="AU Cards">AU Cards</option>
                <option value="ME Cards">ME Cards</option>
                <option value="AS Cards">AS Cards</option>
                <option value="EU Payments">EU Payments</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Initial Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none"
              >
                <option value="high">High (Orange Diamond)</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Assigned Investigator</label>
              <select
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none"
              >
                <option value="Emily Wang">Emily Wang</option>
                <option value="John Lee">John Lee</option>
                <option value="Amina Hassan">Amina Hassan</option>
                <option value="Mike Chen">Mike Chen</option>
                <option value="Sara Lee">Sara Lee</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Trigger Condition</label>
              <input
                type="text"
                readOnly
                value="Rule Engine: Threshold Anomaly"
                className="w-full px-3 py-2 bg-slate-100 text-slate-500 rounded-lg cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Incident Context / Hypothesis</label>
            <textarea
              rows={3}
              placeholder="Provide context on abnormal patterns or suspected fraud syndicate behavior..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:border-orange-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Create &amp; Dispatch Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
