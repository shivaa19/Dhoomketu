import React, { useState } from 'react';
import { AlertIncident } from '../types';

interface AlertsViewProps {
  alerts: AlertIncident[];
  onSelectAlert: (alert: AlertIncident) => void;
  onUpdateStatus: (alertId: string, newStatus: AlertIncident['status']) => void;
  onShowToast: (title: string, msg: string) => void;
  onNavigateToOverview: () => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onSelectAlert,
  onUpdateStatus,
  onShowToast,
  onNavigateToOverview,
}) => {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = alerts.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.code.toLowerCase().includes(search.toLowerCase()) ||
      a.owner.name.toLowerCase().includes(search.toLowerCase());

    const matchesSeverity = severityFilter === 'All' || a.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">warning</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              All Alerts &amp; Incident Triage
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            System-wide incident dispatch queue, SLA timeouts, and investigator assignments
          </p>
        </div>

        <button
          onClick={onNavigateToOverview}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          ← Back to Overview
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search alerts by code, title, or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Tabs */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            {['All', 'Monitoring', 'Investigating', 'Resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:bg-white focus:outline-none cursor-pointer"
          >
            <option value="All">All Severities</option>
            <option value="high">High Severity</option>
            <option value="medium">Medium Severity</option>
            <option value="low">Low Severity</option>
          </select>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] text-slate-700 font-semibold">
                <th className="py-3 px-4 w-16">Severity</th>
                <th className="py-3 px-4">Code &amp; Title</th>
                <th className="py-3 px-4">Segment</th>
                <th className="py-3 px-4">Started</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const isHigh = item.severity === 'high';

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectAlert(item)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center">
                        {isHigh ? (
                          <div className="w-5 h-5 rounded-sm rotate-45 border-2 border-orange-500 bg-orange-50 flex items-center justify-center">
                            <span className="-rotate-45 text-orange-600 font-extrabold text-[10px] leading-none">!</span>
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-sm rotate-45 border-2 border-slate-300 bg-slate-50 flex items-center justify-center">
                            <span className="-rotate-45 text-slate-400 font-extrabold text-[10px] leading-none">!</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors block">
                        {item.title}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400 mt-0.5 block">
                        {item.code}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">{item.segment}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.started}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-semibold">{item.owner.name}</td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                          item.status === 'Monitoring'
                            ? 'bg-orange-50 text-orange-700'
                            : item.status === 'Investigating'
                            ? 'bg-teal-50 text-teal-700'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAlert(item);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium cursor-pointer"
                      >
                        Inspect Drawer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
