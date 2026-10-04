import React, { useState } from 'react';
import { MOCK_SIGNALS } from '../data/mockData';
import { RiskSignal, ViewMode } from '../types';

interface RiskSignalsViewProps {
  onNavigate: (view: ViewMode) => void;
  onOpenFindingModal: () => void;
  onShowToast: (title: string, msg: string, icon?: string) => void;
}

export const RiskSignalsView: React.FC<RiskSignalsViewProps> = ({
  onNavigate,
  onOpenFindingModal,
  onShowToast,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const signals = MOCK_SIGNALS.filter((s) => {
    const matchesSev = filterSeverity === 'ALL' || s.severity === filterSeverity;
    const matchesQuery =
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.triggeredRule.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSev && matchesQuery;
  });

  return (
    <div className="flex flex-col w-full px-space-lg py-space-md gap-space-lg text-on-surface">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-sm bg-surface-container-low/40 p-space-md rounded-xl border border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-error text-[24px]">bolt</span>
            <h1 className="font-headline-md text-headline-md text-on-surface">Risk Signals Radar</h1>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant font-mono mt-0.5">
            Continuous Bayesian monitoring • 42 alerts active across 18 accounts
          </p>
        </div>
        <div className="flex items-center gap-space-xs font-mono">
          <button
            onClick={() => onShowToast('Triage All', 'Auto-triaged 18 critical alerts to L3 investigator queue.', 'fact_check')}
            className="h-8 px-space-md bg-primary-container text-on-primary-container rounded font-label-sm text-label-sm font-semibold flex items-center gap-1 shadow-md hover:brightness-110 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">done_all</span>
            <span>Batch Triage</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-space-md font-mono">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search signals, rules, entities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container pl-10 pr-3 py-1.5 rounded font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-high transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded text-label-sm">
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                filterSeverity === sev
                  ? sev === 'CRITICAL'
                    ? 'bg-error text-on-error font-bold shadow-sm'
                    : 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Signals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
        {signals.map((sig) => (
          <div
            key={sig.id}
            onClick={() => onNavigate('accounts')}
            className={`p-space-md rounded-xl bg-surface-container hover:bg-surface-container-high transition-all cursor-pointer border flex flex-col justify-between gap-space-md ${
              sig.severity === 'CRITICAL' ? 'border-error/40 shadow-lg' : 'border-outline-variant/20'
            }`}
          >
            <div>
              <div className="flex items-center justify-between font-mono mb-2">
                <span className="font-bold text-primary">{sig.id}</span>
                <span
                  className={`px-2 py-0.5 rounded text-label-sm font-bold ${
                    sig.severity === 'CRITICAL'
                      ? 'bg-error/20 text-error'
                      : sig.severity === 'HIGH'
                      ? 'bg-secondary-container/40 text-secondary'
                      : 'bg-surface-container-highest text-on-surface-variant'
                  }`}
                >
                  {sig.severity} ({sig.score})
                </span>
              </div>

              <div className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                {sig.accountName}
              </div>
              <div className="text-label-sm font-mono text-primary mt-0.5">{sig.accountId}</div>

              <div className="mt-3 p-2 bg-surface-container-low rounded border border-outline-variant/10">
                <div className="text-body-sm font-semibold text-error flex items-center gap-1 font-mono">
                  {sig.triggeredRule}
                </div>
                <div className="text-body-sm text-on-surface-variant mt-0.5">{sig.ruleDescription}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between font-mono text-label-sm">
              <span className="text-on-surface font-bold">
                ₹{(sig.volume / 100000).toFixed(2)} Lakh Exposure
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('ai-copilot');
                }}
                className="text-primary hover:underline flex items-center gap-0.5 font-semibold cursor-pointer"
              >
                Inspect Copilot →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
