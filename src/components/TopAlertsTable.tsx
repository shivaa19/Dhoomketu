import React from 'react';
import { AlertIncident } from '../types';

interface TopAlertsTableProps {
  alerts: AlertIncident[];
  onViewAll: () => void;
  onSelectAlert: (alert: AlertIncident) => void;
}

export const TopAlertsTable: React.FC<TopAlertsTableProps> = ({
  alerts,
  onViewAll,
  onSelectAlert,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Top Alerts &amp; Incidents
        </h2>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
        >
          View all alerts
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f1f5f9] text-slate-700 text-xs font-semibold">
              <th className="py-3 px-4 w-16">Severity</th>
              <th className="py-3 px-4">Alert</th>
              <th className="py-3 px-4">Segment</th>
              <th className="py-3 px-4">Started</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Owner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {alerts.map((item) => {
              const isHigh = item.severity === 'high';
              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectAlert(item)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  {/* Severity Icon Column */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center">
                      {isHigh ? (
                        /* Orange Diamond Warning */
                        <div className="w-5 h-5 rounded-sm rotate-45 border-2 border-orange-500 bg-orange-50 flex items-center justify-center">
                          <span className="-rotate-45 text-orange-600 font-extrabold text-[10px] leading-none">!</span>
                        </div>
                      ) : (
                        /* Muted Gray Diamond */
                        <div className="w-5 h-5 rounded-sm rotate-45 border-2 border-slate-300 bg-slate-50 flex items-center justify-center">
                          <span className="-rotate-45 text-slate-400 font-extrabold text-[10px] leading-none">!</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Alert Title & Code */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {item.code}
                    </div>
                  </td>

                  {/* Segment */}
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {item.segment}
                  </td>

                  {/* Started Time */}
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {item.started}
                  </td>

                  {/* Status with exact chromatic coding */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-semibold ${
                        item.status === 'Monitoring'
                          ? 'text-orange-600'
                          : item.status === 'Investigating'
                          ? 'text-teal-600'
                          : item.status === 'Resolved'
                          ? 'text-slate-800'
                          : 'text-slate-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Owner */}
                  <td className="py-3.5 px-4 text-slate-800 font-medium">
                    {item.owner.name}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
