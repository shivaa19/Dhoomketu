import React from 'react';
import { AlertIncident } from '../types';

interface IncidentDrawerProps {
  alert: AlertIncident | null;
  onClose: () => void;
  onUpdateStatus: (alertId: string, newStatus: AlertIncident['status']) => void;
  onShowToast: (title: string, msg: string) => void;
}

export const IncidentDrawer: React.FC<IncidentDrawerProps> = ({
  alert,
  onClose,
  onUpdateStatus,
  onShowToast,
}) => {
  if (!alert) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-white shadow-2xl z-50 p-6 flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right select-none">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                {alert.code}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {alert.segment}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {alert.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Status & Telemetry Tiles */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Current Status</span>
            <span className="text-sm font-bold text-orange-600 mt-0.5 block">{alert.status}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Reported Time</span>
            <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{alert.started}</span>
          </div>
        </div>

        {/* Affected Volume & Details */}
        {alert.details && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-orange-900">Total Flagged Volume</span>
                <span className="font-mono font-bold text-orange-600 text-sm">{alert.details.volume}</span>
              </div>
              <div className="text-slate-600">
                Affecting {alert.details.affectedUsers} distinct merchant and customer payment tokens.
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-800 block mb-1">Incident Summary</span>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {alert.details.description}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-800 block mb-1">Automated Recommendation</span>
              <p className="text-slate-700 font-medium bg-emerald-50 text-emerald-900 p-3 rounded-lg border border-emerald-100">
                {alert.details.suggestedAction}
              </p>
            </div>

            <div className="flex justify-between items-center py-2 border-t border-slate-100 text-slate-600">
              <span>Incident Lead Owner:</span>
              <span className="font-semibold text-slate-900">{alert.owner.name}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {alert.status !== 'Resolved' ? (
            <button
              onClick={() => {
                onUpdateStatus(alert.id, 'Resolved');
                onShowToast('Alert Resolved', `${alert.code} marked as resolved and archived.`);
              }}
              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-sm transition-all cursor-pointer text-center"
            >
              Mark Resolved
            </button>
          ) : (
            <button
              onClick={() => {
                onUpdateStatus(alert.id, 'Monitoring');
                onShowToast('Alert Reopened', `${alert.code} status shifted back to active monitoring.`);
              }}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all cursor-pointer text-center"
            >
              Reopen Monitoring
            </button>
          )}

          <button
            onClick={() => {
              onUpdateStatus(alert.id, 'Investigating');
              onShowToast('Escalated', `${alert.code} escalated to Senior Fraud Analyst queue.`);
            }}
            className="flex-1 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs rounded-lg shadow-sm transition-all cursor-pointer text-center"
          >
            Escalate Incident
          </button>
        </div>

        <button
          onClick={() => {
            onShowToast('Packet Exported', `Forensic audit log for ${alert.code} exported.`);
          }}
          className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200 transition-colors cursor-pointer text-center"
        >
          Export Evidence Packet
        </button>
      </div>
    </div>
  );
};
