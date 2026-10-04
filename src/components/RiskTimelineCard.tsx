import React from 'react';
import { TIMELINE_PROFILES } from '../data/vaultData';

interface RiskTimelineCardProps {
  timeRange?: string;
  onComparePeriods: () => void;
}

export const RiskTimelineCard: React.FC<RiskTimelineCardProps> = ({
  timeRange = 'Last 24 hours',
  onComparePeriods,
}) => {
  const profile = TIMELINE_PROFILES[timeRange] || TIMELINE_PROFILES['Last 24 hours'];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 flex flex-col justify-between select-none">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Risk Trend Timeline
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">
            Granularity: {timeRange}
          </span>
        </div>
        <button
          onClick={onComparePeriods}
          className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
        >
          Compare periods
        </button>
      </div>

      {/* SVG Chart Viewport */}
      <div className="relative w-full h-52 flex flex-col justify-end">
        <svg className="w-full h-full" viewBox="0 0 520 220" preserveAspectRatio="none">
          {/* Horizontal Gridlines */}
          <line x1="35" y1="20" x2="510" y2="20" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="35" y1="65" x2="510" y2="65" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="35" y1="110" x2="510" y2="110" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="35" y1="155" x2="510" y2="155" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="35" y1="200" x2="510" y2="200" stroke="#e2e8f0" strokeWidth="1" />

          {/* Y Axis Numeric Labels */}
          <text x="25" y="24" fill="#94a3b8" fontSize="11" fontFamily="Plus Jakarta Sans, sans-serif" textAnchor="end">320</text>
          <text x="25" y="69" fill="#94a3b8" fontSize="11" fontFamily="Plus Jakarta Sans, sans-serif" textAnchor="end">240</text>
          <text x="25" y="114" fill="#94a3b8" fontSize="11" fontFamily="Plus Jakarta Sans, sans-serif" textAnchor="end">160</text>
          <text x="25" y="159" fill="#94a3b8" fontSize="11" fontFamily="Plus Jakarta Sans, sans-serif" textAnchor="end">80</text>
          <text x="25" y="204" fill="#94a3b8" fontSize="11" fontFamily="Plus Jakarta Sans, sans-serif" textAnchor="end">0</text>

          {/* Line 3: Manual Reviews (Teal) */}
          <path
            d={profile.tealPath}
            fill="none"
            stroke="#0d9488"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-700 ease-out"
          />

          {/* Line 2: Blocked (Dark Slate) */}
          <path
            d={profile.navyPath}
            fill="none"
            stroke="#0f172a"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-700 ease-out"
          />

          {/* Line 1: Suspicious Flagged (Orange) */}
          <path
            d={profile.orangePath}
            fill="none"
            stroke="#ea580c"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* X Axis Timestamps dynamically populated */}
        <div className="flex justify-between pl-9 pr-2 pt-1 text-[11px] text-slate-500 font-mono">
          {profile.labels.map((lbl, idx) => (
            <span key={idx}>{lbl}</span>
          ))}
        </div>
      </div>

      {/* Legend at Bottom */}
      <div className="flex items-center justify-center gap-7 pt-4 border-t border-slate-50 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
          <span className="text-slate-700 font-medium">Suspicious Flagged</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-900 shrink-0" />
          <span className="text-slate-700 font-medium">Blocked</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-600 shrink-0" />
          <span className="text-slate-700 font-medium">Manual Reviews</span>
        </div>
      </div>
    </div>
  );
};
