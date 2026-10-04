import React, { useState } from 'react';
import { ComplianceFramework, INITIAL_COMPLIANCE } from '../data/vaultData';

interface ComplianceViewProps {
  onShowToast: (title: string, msg: string) => void;
  onNavigateToOverview: () => void;
  onNavigateToIdProofs: () => void;
}

export const ComplianceView: React.FC<ComplianceViewProps> = ({
  onShowToast,
  onNavigateToOverview,
  onNavigateToIdProofs,
}) => {
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>(INITIAL_COMPLIANCE);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleToggleChecklist = (frameworkId: string, itemId: string) => {
    setFrameworks(
      frameworks.map((fw) => {
        if (fw.id === frameworkId) {
          const updatedItems = fw.checklistItems.map((item) =>
            item.id === itemId ? { ...item, passed: !item.passed } : item
          );
          const allPassed = updatedItems.every((it) => it.passed);
          return {
            ...fw,
            checklistItems: updatedItems,
            status: allPassed ? 'Compliant (100%)' : 'Action Required',
          };
        }
        return fw;
      })
    );
    onShowToast('Audit Requirement Updated', 'Compliance status recalculated.');
  };

  const handleRunAudit = () => {
    setIsAuditing(true);
    onShowToast('Compliance Scan Initiated', 'Validating tokenization keys, SAR queues, and KYC vault...');

    setTimeout(() => {
      setIsAuditing(false);
      onShowToast('Compliance Audit Complete', '98.4% institutional compliance index achieved.');
    }, 1100);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">verified_user</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Compliance Mandates &amp; Statutory Governance
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Institutional enforcement of Visa VROL, Mastercard MATCH, PCI-DSS 4.0, and RBI KYC / PMLA
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
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">fact_check</span>
            <span>{isAuditing ? 'Auditing Platform...' : 'Run Automated Audit'}</span>
          </button>
        </div>
      </div>

      {/* Compliance Frameworks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {frameworks.map((fw) => {
          const isCompliant = fw.status === 'Compliant (100%)';

          return (
            <div
              key={fw.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                      {fw.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{fw.name}</h3>
                    <span className="text-xs text-slate-400">{fw.authority}</span>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      isCompliant
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                    }`}
                  >
                    {fw.status}
                  </span>
                </div>

                {/* Audit Checklist */}
                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-semibold block text-[11px] uppercase tracking-wider">
                    Statutory Checklist:
                  </span>
                  <div className="space-y-1.5">
                    {fw.checklistItems.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={item.passed}
                          onChange={() => handleToggleChecklist(fw.id, item.id)}
                          className="w-4 h-4 rounded accent-orange-600 cursor-pointer"
                        />
                        <span
                          className={`font-medium ${
                            item.passed ? 'text-slate-800' : 'text-amber-800 font-semibold'
                          }`}
                        >
                          {item.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
                <span>Next Audit: {fw.nextAuditDate}</span>
                {fw.id === 'RBI-PMLA' && (
                  <button
                    onClick={onNavigateToIdProofs}
                    className="text-orange-600 font-bold hover:underline cursor-pointer"
                  >
                    Open Bank ID Proofs Vault →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
