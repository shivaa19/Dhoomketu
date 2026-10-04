import React, { useState } from 'react';
import { ViewMode } from '../types';

interface HeaderProps {
  onNavigate: (view: ViewMode) => void;
  onOpenSearch: () => void;
  onTriggerDemo: () => void;
  onShowToast: (title: string, msg: string, icon?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onOpenSearch,
  onTriggerDemo,
  onShowToast,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [timeFilter, setTimeFilter] = useState('Last 7 Days');
  const [severityFilter, setSeverityFilter] = useState('All / Critical');
  const [tenantFilter, setTenantFilter] = useState('Corp Bank IN');

  const notifications = [
    { id: 1, title: 'Critical Anomaly Detected', desc: 'ACC-10482 executed 8 outbound transfers totaling ₹18.4L in 42 mins.', time: '2m ago', sev: 'critical' },
    { id: 2, title: 'Threshold Avoidance Alert', desc: 'ACC-09144 structured multiple payments at ₹9.80L below ₹10L CTR limit.', time: '14m ago', sev: 'critical' },
    { id: 3, title: 'Offshore Shell Entity Match', desc: 'Apex Global FZ matched against Singapore shell transit watchlist.', time: '28m ago', sev: 'high' },
    { id: 4, title: 'Cryptographic Hash Verified', desc: 'SHA-256 seal confirmed for evidentiary packet #8f90c4e1.', time: '41m ago', sev: 'info' },
  ];

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface/90 backdrop-blur-xl z-40 border-b border-outline-variant/20 shadow-[0_1px_8px_rgba(0,0,0,0.18)] flex items-center justify-between px-space-lg">
      {/* Search Bar */}
      <div className="flex items-center gap-space-md flex-1 max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            onClick={onOpenSearch}
            className="w-full h-9 pl-9 pr-space-md bg-surface-container rounded font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-high transition-colors cursor-pointer"
            placeholder="Search ACC-*, TX-*, rules, policies, or ask copilot... (Ctrl + K)"
            type="text"
            readOnly
          />
        </div>
      </div>

      {/* Alert Strip on ACC-10482 */}
      <button
        onClick={() => {
          onNavigate('accounts');
          onShowToast('Navigated to ACC-10482', 'Focused on Alpha Corp Ltd real-time investigation.');
        }}
        className="hidden xl:flex items-center gap-space-xs px-space-md py-1 bg-surface-container-low hover:bg-surface-container border border-error/30 rounded transition-all cursor-pointer text-left"
      >
        <span className="material-symbols-outlined text-error text-[16px] animate-pulse">warning</span>
        <span className="font-label-sm text-label-sm text-error truncate max-w-xs font-mono font-bold">
          Alert on ACC-10482 (₹18.4L in 42m)
        </span>
      </button>

      {/* Right Controls */}
      <div className="flex items-center gap-space-md">
        {/* Filters */}
        <div className="hidden lg:flex items-center gap-space-xs">
          <button
            onClick={() => {
              const next = timeFilter === 'Last 7 Days' ? 'Last 24 Hours' : timeFilter === 'Last 24 Hours' ? 'Last 30 Days' : 'Last 7 Days';
              setTimeFilter(next);
              onShowToast('Time Window Changed', `Telemetry filtered by ${next}.`);
            }}
            className="h-8 px-space-sm bg-surface-container hover:bg-surface-container-high rounded font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1 cursor-pointer font-mono"
          >
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            {timeFilter}
          </button>
          <button
            onClick={() => {
              const next = severityFilter === 'All / Critical' ? 'Tier-1 Critical' : severityFilter === 'Tier-1 Critical' ? 'All Active' : 'All / Critical';
              setSeverityFilter(next);
              onShowToast('Severity Filter', `Filter set to ${next}.`);
            }}
            className="h-8 px-space-sm bg-surface-container hover:bg-surface-container-high rounded font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1 cursor-pointer font-mono"
          >
            <span className="material-symbols-outlined text-[14px]">filter_alt</span>
            {severityFilter}
          </button>
          <button
            onClick={() => {
              const next = tenantFilter === 'Corp Bank IN' ? 'Corp Bank SG' : 'Corp Bank IN';
              setTenantFilter(next);
              onShowToast('Tenant Switched', `Active institutional gateway: ${next}`);
            }}
            className="h-8 px-space-sm bg-surface-container hover:bg-surface-container-high rounded font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1 cursor-pointer font-mono"
          >
            <span className="material-symbols-outlined text-[14px]">domain</span>
            {tenantFilter}
          </button>
        </div>

        {/* Demo ACC-10482 CTA */}
        <button
          onClick={onTriggerDemo}
          className="h-8 px-space-md bg-primary-container text-on-primary-container rounded font-label-sm text-label-sm font-semibold flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer font-mono"
        >
          <span className="material-symbols-outlined text-[16px]">bolt</span>
          Demo ACC-10482
        </button>

        {/* Notifications Icon with popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 rounded hover:bg-surface-container transition-colors cursor-pointer text-on-surface-variant hover:text-on-surface"
            title="System Alert Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error text-on-error font-label-sm text-[9px] flex items-center justify-center font-bold">
              18
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-low border border-outline-variant/30 rounded-xl shadow-2xl p-space-md z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20 mb-2">
                <span className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-[18px]">notifications_active</span>
                  Alert Stream (18 Active)
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('accounts');
                    }}
                    className="p-2 rounded bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center justify-between text-label-sm font-label-sm">
                      <span className={`font-bold ${n.sev === 'critical' ? 'text-error' : 'text-secondary'}`}>
                        {n.title}
                      </span>
                      <span className="text-on-surface-variant">{n.time}</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface mt-0.5 leading-snug">
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-outline-variant/20 mt-2 flex justify-between items-center text-label-sm font-label-sm text-on-surface-variant">
                <span>Immutable telemetry log</span>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigate('risk-signals');
                  }}
                  className="text-primary hover:underline font-semibold"
                >
                  View All Signals →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Timestamp & User */}
        <div className="hidden sm:flex flex-col text-right">
          <span className="font-label-sm text-label-sm text-on-surface font-medium">
            Risk Analyst / Officer
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
            2026-10-02 10:48:22 UTC
          </span>
        </div>

        {/* User Avatar */}
        <button
          onClick={() => onNavigate('gateway')}
          title="Operator: Vikram Rao (Click to switch user or sign-in)"
          className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all shadow-md"
        >
          <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
        </button>
      </div>
    </header>
  );
};
