import React from 'react';
import { formatCompactMoney, REGION_PROFILES } from '../data/vaultData';

interface RiskHealthCardProps {
  region?: string;
  currency?: string;
  onViewDetails: () => void;
}

export const RiskHealthCard: React.FC<RiskHealthCardProps> = ({
  region = 'EU Payments',
  currency = 'USD',
  onViewDetails,
}) => {
  const profile = REGION_PROFILES[region] || REGION_PROFILES['EU Payments'];
  const isUp = profile.deltaDir === 'up';

  // Calculate dashoffset based on score
  // max score ~ 5000, percentage between 10% to 90%
  const normalizedPct = Math.min(Math.max((profile.score / 5000) * 100, 20), 85);
  // Circumference = 2 * PI * 38 ≈ 238.76
  const dashoffset = 238.76 * (1 - normalizedPct / 100);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 flex flex-col justify-between select-none">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Risk Health Score
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">
            {region} • Vol: {formatCompactMoney(profile.totalVolumeUSD, currency)}
          </span>
        </div>
        <button
          onClick={onViewDetails}
          className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
        >
          View details
        </button>
      </div>

      {/* Card Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column: Donut Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-2">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Donut */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Ring */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="10"
              />
              {/* Active Orange Segment */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#ea580c"
                strokeWidth="10"
                strokeDasharray="238.76"
                strokeDashoffset={dashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
                {profile.score.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Delta Pill */}
          <div className="mt-3 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/60 text-xs font-semibold text-slate-700 flex items-center gap-1 shadow-2xs">
            <span>{profile.delta}</span>
            <span className={`text-[10px] ${isUp ? 'text-red-600' : 'text-emerald-600'}`}>
              {isUp ? '▲' : '▼'}
            </span>
          </div>
        </div>

        {/* Right Column: Top Contributors */}
        <div className="md:col-span-7 flex flex-col justify-center space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 tracking-tight">
              Top Contributors
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Active in {region}
            </span>
          </div>

          <div className="space-y-3 font-mono">
            {profile.contributors.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-sans font-medium text-[13px]">{item.label}</span>
                  <span className="text-slate-800 font-bold text-xs">{item.percentage}%</span>
                </div>
                {/* Horizontal Progress Bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
