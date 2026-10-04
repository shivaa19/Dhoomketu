import React, { useState } from 'react';
import { AlertIncident } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: AlertIncident[];
  onSelectAlert: (alert: AlertIncident) => void;
  onShowToast: (title: string, msg: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onSelectAlert,
  onShowToast,
}) => {
  const [unreadOnly, setUnreadOnly] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-600 text-xl">notifications_active</span>
              <h3 className="text-base font-bold text-slate-900">Live Incident Notification Feed</h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 text-xs">
            <span className="text-slate-500 font-mono">
              {alerts.length} synchronized incidents
            </span>
            <button
              onClick={() => onShowToast('All Marked Read', 'All notifications acknowledged.')}
              className="text-orange-600 hover:underline font-semibold cursor-pointer"
            >
              Mark all as read
            </button>
          </div>

          {/* List of alerts */}
          <div className="mt-3 space-y-2 overflow-y-auto max-h-96 pr-1">
            {alerts.map((a) => (
              <div
                key={a.id}
                onClick={() => {
                  onSelectAlert(a);
                  onClose();
                }}
                className="p-3 bg-slate-50 hover:bg-orange-50/60 rounded-2xl border border-slate-100 hover:border-orange-200 transition-all cursor-pointer flex items-start gap-3 text-xs"
              >
                <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-orange-600">{a.code}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{a.started}</span>
                  </div>
                  <span className="font-bold text-slate-900 block mt-0.5">{a.title}</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Segment: {a.segment} • Owner: {a.owner.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
          >
            Close Feed
          </button>
        </div>
      </div>
    </div>
  );
};
