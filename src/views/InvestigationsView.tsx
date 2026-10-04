import React, { useState } from 'react';
import { formatMoney, INITIAL_CASES, InvestigationCase } from '../data/vaultData';

interface InvestigationsViewProps {
  currency: string;
  onShowToast: (title: string, msg: string) => void;
  onNavigateToOverview: () => void;
}

export const InvestigationsView: React.FC<InvestigationsViewProps> = ({
  currency,
  onShowToast,
  onNavigateToOverview,
}) => {
  const [cases, setCases] = useState<InvestigationCase[]>(INITIAL_CASES);
  const [selectedCase, setSelectedCase] = useState<InvestigationCase | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isAddCaseOpen, setIsAddCaseOpen] = useState(false);

  // New Case State
  const [caseTitle, setCaseTitle] = useState('');
  const [caseExposure, setCaseExposure] = useState('25000');
  const [casePriority, setCasePriority] = useState<InvestigationCase['priority']>('High');
  const [caseSummary, setCaseSummary] = useState('');

  const filteredCases = cases.filter(
    (c) => filterStatus === 'All' || c.status === filterStatus
  );

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    const newCase: InvestigationCase = {
      id: `CASE-${Math.floor(4410 + Math.random() * 50)}`,
      title: caseTitle || 'Card Velocity Anomaly Case',
      exposureUSD: parseFloat(caseExposure) || 10000,
      suspectCount: 4,
      leadInvestigator: 'Vikram Rao',
      status: 'Investigating',
      priority: casePriority,
      openedDate: 'Today',
      summary: caseSummary || 'Manual investigation triggered by risk officer.',
      notesCount: 1,
      linkedAlertCode: 'ALT-011',
    };

    setCases([newCase, ...cases]);
    setIsAddCaseOpen(false);
    onShowToast('Case Opened', `${newCase.id} initiated for forensic audit.`);
  };

  const handleUpdateStatus = (caseId: string, newStatus: InvestigationCase['status']) => {
    setCases(cases.map((c) => (c.id === caseId ? { ...c, status: newStatus } : c)));
    if (selectedCase && selectedCase.id === caseId) {
      setSelectedCase({ ...selectedCase, status: newStatus });
    }
    onShowToast('Case Updated', `${caseId} marked as ${newStatus}.`);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">find_in_page</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Investigations &amp; Forensic Case Dossiers
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Forensic tracking of organized syndicates, chargeback dispute rings, and SAR filings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToOverview}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            ← Back to Overview
          </button>
          <button
            onClick={() => setIsAddCaseOpen(true)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add_box</span>
            <span>Open New Case</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs text-xs">
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          {['All', 'Investigating', 'Monitoring', 'Escalated to FIU', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <span className="text-slate-400 font-mono">
          Showing {filteredCases.length} open cases
        </span>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCases.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelectedCase(c)}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-100">
                    {c.id}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      c.priority === 'Critical'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {c.priority} Priority
                  </span>
                </div>

                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {c.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                {c.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {c.summary}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block">Financial Exposure:</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">
                    {formatMoney(c.exposureUSD, currency)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Suspect Cards:</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">
                    {c.suspectCount} Cards Identified
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Lead: <strong className="text-slate-800">{c.leadInvestigator}</strong></span>
              <span className="text-orange-600 font-semibold group-hover:underline flex items-center gap-1">
                <span>View Dossier</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Case Dossier Slide-Over */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-end animate-in fade-in select-none">
          <div className="w-full sm:w-[520px] h-full bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l border-slate-200 animate-in slide-in-from-right">
            <div className="space-y-5">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                      {selectedCase.id}
                    </span>
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      {selectedCase.priority}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedCase.title}</h3>
                  <span className="text-xs text-slate-400">
                    Opened {selectedCase.openedDate} by {selectedCase.leadInvestigator}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[24px]">close</span>
                </button>
              </div>

              {/* Exposure Badge */}
              <div className="p-4 bg-orange-50/70 border border-orange-200/80 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-orange-800 font-medium block">Total At-Risk Exposure</span>
                  <span className="text-xl font-bold font-mono text-orange-700">
                    {formatMoney(selectedCase.exposureUSD, currency)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-orange-800 font-medium block">Linked Alert</span>
                  <span className="font-mono font-bold text-orange-900">{selectedCase.linkedAlertCode}</span>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">Forensic Narrative</h4>
                <p className="text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                  {selectedCase.summary}
                </p>
              </div>

              {/* Linked Suspects */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">Identified Suspect Cards ({selectedCase.suspectCount})</h4>
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex justify-between">
                    <span>4532 •••• •••• 8812 (Visa AU)</span>
                    <span className="text-red-600 font-bold">14 Declines</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex justify-between">
                    <span>5120 •••• •••• 9921 (MC SG)</span>
                    <span className="text-red-600 font-bold">8 Flags</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex justify-between">
                    <span>4912 •••• •••• 3314 (Visa IN)</span>
                    <span className="text-amber-600 font-bold">Under Review</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                {selectedCase.status !== 'Escalated to FIU' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedCase.id, 'Escalated to FIU')}
                    className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl cursor-pointer shadow-xs"
                  >
                    Escalate to FIU SAR
                  </button>
                )}
                {selectedCase.status !== 'Resolved' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedCase.id, 'Resolved')}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl cursor-pointer shadow-xs"
                  >
                    Close &amp; Resolve
                  </button>
                )}
              </div>
              <button
                onClick={() => onShowToast('Dossier Downloaded', `Exported ${selectedCase.id}_Dossier.pdf`)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Open Case Modal */}
      {isAddCaseOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in select-none">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Initiate Investigation Case</h3>
              <button
                onClick={() => setIsAddCaseOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Case Title</label>
                <input
                  type="text"
                  required
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  placeholder="e.g. Card Testing Attack on Merchant Terminal"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Estimated Exposure ($ USD)
                  </label>
                  <input
                    type="number"
                    required
                    value={caseExposure}
                    onChange={(e) => setCaseExposure(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={casePriority}
                    onChange={(e) => setCasePriority(e.target.value as InvestigationCase['priority'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Case Summary</label>
                <textarea
                  rows={3}
                  required
                  value={caseSummary}
                  onChange={(e) => setCaseSummary(e.target.value)}
                  placeholder="Describe initial anomaly evidence and suspect patterns..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddCaseOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Open Case File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
