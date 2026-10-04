import React from 'react';
import { MOCK_AUDIT_LOGS } from '../data/mockData';
import { ViewMode } from '../types';

interface AuditTrailViewProps {
  onNavigate: (view: ViewMode) => void;
  onShowToast: (title: string, msg: string, icon?: string) => void;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ onShowToast }) => {
  return (
    <div className="flex flex-col w-full px-space-lg py-space-md gap-space-lg text-on-surface">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-sm bg-surface-container-low/40 p-space-md rounded-xl border border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-[24px]">receipt_long</span>
            <h1 className="font-headline-md text-headline-md text-on-surface">Cryptographic Audit Ledger</h1>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant font-mono mt-0.5">
            Immutable chain-of-custody • SHA-256 Merkle root verified • ISO/IEC 27037 Compliant
          </p>
        </div>
        <div className="flex items-center gap-space-xs font-mono">
          <button
            onClick={() => onShowToast('Ledger Integrity Valid', 'HMAC SHA-256 Merkle tree verification completed with 0 errors.', 'verified_user')}
            className="h-8 px-space-md bg-tertiary-container text-on-tertiary-container rounded font-label-sm text-label-sm font-semibold flex items-center gap-1 shadow-md hover:brightness-110 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Verify Merkle Root</span>
          </button>
        </div>
      </div>

      {/* Merkle Root Banner */}
      <div className="p-space-md bg-surface-container rounded-xl border border-tertiary/30 font-mono text-label-sm flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-tertiary text-[20px]">lock</span>
          <div>
            <span className="text-on-surface font-semibold block">CURRENT ACTIVE BLOCK #9842</span>
            <span className="text-on-surface-variant text-[11px] break-all">
              Root Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </span>
          </div>
        </div>
        <span className="px-2 py-1 rounded bg-tertiary/20 text-tertiary font-bold uppercase shrink-0">
          PROVENANCE: SEALED
        </span>
      </div>

      {/* Ledger Table */}
      <div className="bg-surface-container rounded-xl shadow-md overflow-hidden border border-outline-variant/20 font-mono text-body-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                <th className="py-2.5 px-4">Event Ref</th>
                <th className="py-2.5 px-4">Timestamp (UTC)</th>
                <th className="py-2.5 px-4">Actor</th>
                <th className="py-2.5 px-4">Action Dispatched</th>
                <th className="py-2.5 px-4">Target Entity</th>
                <th className="py-2.5 px-4">Cryptographic Hash (SHA-256)</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {MOCK_AUDIT_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-surface-container-high/60 transition-colors">
                  <td className="py-2.5 px-4 text-primary font-bold">{log.id}</td>
                  <td className="py-2.5 px-4 text-on-surface-variant">{log.timestamp}</td>
                  <td className="py-2.5 px-4 text-on-surface font-semibold">{log.actor}</td>
                  <td className="py-2.5 px-4 font-sans">{log.action}</td>
                  <td className="py-2.5 px-4 text-secondary font-semibold">{log.target}</td>
                  <td className="py-2.5 px-4 text-tertiary text-[11px] max-w-xs truncate" title={log.sha256}>
                    {log.sha256}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <span className="px-2 py-0.5 rounded bg-tertiary/15 text-tertiary font-bold text-label-sm">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
