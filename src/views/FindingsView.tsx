import React from 'react';
import { MOCK_FINDING } from '../data/mockData';
import { ViewMode } from '../types';

interface FindingsViewProps {
  onNavigate: (view: ViewMode) => void;
  onOpenFindingModal: () => void;
  onShowToast: (title: string, msg: string, icon?: string) => void;
}

export const FindingsView: React.FC<FindingsViewProps> = ({
  onNavigate,
  onOpenFindingModal,
  onShowToast,
}) => {
  const findings = [
    MOCK_FINDING,
    {
      id: 'RF-2026-00479',
      title: 'Sub-10L Smurfing Pattern on Escrow Inflows',
      targetAccount: 'ACC-09144',
      targetEntity: 'V-Fin Global',
      severity: 'CRITICAL (Tier 1)',
      primaryStatute: 'PMLA Rule 3(1)(B)',
      status: 'Escalated to FIU',
      summary: 'Series of 10 structured transfers executed within 3 hours under ₹10,00,000 threshold to evade automated CTR triggers.',
      dateCreated: '01 Oct 2026 14:12:00 IST',
      investigator: 'Priya Sharma (L2)',
    },
    {
      id: 'RF-2026-00472',
      title: 'Unregistered Offshore Corridor Remittance',
      targetAccount: 'ACC-11029',
      targetEntity: 'Zenith Tech Soft',
      severity: 'HIGH',
      primaryStatute: 'RBI Master Direction Sec 24',
      status: 'Awaiting Director UBO',
      summary: 'High-value wire transfers to offshore non-FATF compliant jurisdictions without matching export trade invoices.',
      dateCreated: '30 Sep 2026 16:45:10 IST',
      investigator: 'Rohan Mehra (L2)',
    },
  ];

  return (
    <div className="flex flex-col w-full px-space-lg py-space-md gap-space-lg text-on-surface">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-sm bg-surface-container-low/40 p-space-md rounded-xl border border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">assignment_late</span>
            <h1 className="font-headline-md text-headline-md text-on-surface">Regulatory Findings Registry</h1>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant font-mono mt-0.5">
            Formally substantiated regulatory findings • Form-STR-01 &amp; Form-CTR-02 Preparation
          </p>
        </div>
        <button
          onClick={onOpenFindingModal}
          className="h-8 px-space-md bg-primary-container text-on-primary-container rounded font-label-sm text-label-sm font-semibold flex items-center gap-1 shadow-md hover:brightness-110 cursor-pointer font-mono"
        >
          <span className="material-symbols-outlined text-[16px]">bolt</span>
          <span>Draft New Regulatory Finding</span>
        </button>
      </div>

      <div className="space-y-space-md">
        {findings.map((f) => (
          <div
            key={f.id}
            className="p-space-lg rounded-xl bg-surface-container border border-outline-variant/20 hover:border-primary/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-space-md shadow-md"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-space-sm font-mono text-label-sm">
                <span className="font-bold text-primary">{f.id}</span>
                <span className="px-1.5 py-0.5 rounded bg-error/20 text-error font-bold">{f.severity}</span>
                <span className="text-tertiary font-semibold">{f.status}</span>
                <span className="text-on-surface-variant">• {f.dateCreated}</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">{f.title}</h2>
              <div className="text-body-sm text-on-surface-variant max-w-3xl">{f.summary}</div>
              <div className="text-label-sm font-mono text-secondary pt-1">
                Target: {f.targetEntity} ({f.targetAccount}) • Statute: {f.primaryStatute} • Investigator: {f.investigator}
              </div>
            </div>

            <div className="flex items-center gap-space-xs font-mono">
              <button
                onClick={() => onNavigate('reports')}
                className="h-8 px-space-md bg-primary text-on-primary rounded font-label-sm text-label-sm font-semibold flex items-center gap-1 shadow-md hover:brightness-110 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">description</span>
                <span>Open Dossier</span>
              </button>
              <button
                onClick={() => onShowToast('Finding Signed', `Cryptographically signed ${f.id} with compliance officer key.`, 'verified')}
                className="h-8 px-space-sm bg-surface-container-high hover:bg-surface-bright text-on-surface rounded font-label-sm text-label-sm flex items-center gap-1 transition-colors cursor-pointer border border-outline-variant/20"
              >
                <span className="material-symbols-outlined text-[16px]">fingerprint</span>
                <span>Sign</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
