import React from 'react';
import { AlertIncident } from '../types';
import { RiskHealthCard } from '../components/RiskHealthCard';
import { RiskTimelineCard } from '../components/RiskTimelineCard';
import { TrendAnalyticsPanel } from '../components/TrendAnalyticsPanel';
import { TopAlertsTable } from '../components/TopAlertsTable';

interface VaultOverviewViewProps {
  alerts: AlertIncident[];
  region?: string;
  timeRange?: string;
  currency?: string;
  onOpenFilters: () => void;
  onViewDetails: () => void;
  onComparePeriods: () => void;
  onViewAllAlerts: () => void;
  onSelectAlert: (alert: AlertIncident) => void;
  onNavigateToIdProofs?: () => void;
  onNavigateToBanks?: () => void;
}

export const VaultOverviewView: React.FC<VaultOverviewViewProps> = ({
  alerts,
  region = 'EU Payments',
  timeRange = 'Last 24 hours',
  currency = 'USD',
  onOpenFilters,
  onViewDetails,
  onComparePeriods,
  onViewAllAlerts,
  onSelectAlert,
  onNavigateToIdProofs,
  onNavigateToBanks,
}) => {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Risk Overview Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Risk Overview
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time monitoring of transaction risk and fraud indications
          </p>
        </div>

        <div className="text-right text-xs text-slate-500"><div>Updated</div><div className="font-semibold text-slate-700">{new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'medium', timeZone: 'Asia/Kolkata' })} IST</div></div>

        {/* Filters Button */}
        <button
          onClick={onOpenFilters}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200/90 shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <span>Filters</span>
          {/* Sliders / Filter icon matching screenshot */}
          <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
      </div>

      {/* Bank ID Proof Verification Alert Callout */}
      {onNavigateToIdProofs && (
        <div className="bg-orange-50/80 border border-orange-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg">badge</span>
            </div>
            <div>
              <span className="font-bold text-slate-900 block">
                Bank ID Proof &amp; KYC Verification Alert
              </span>
              <span className="text-slate-600 text-[11px] block mt-0.5">
                Apex Global FZ (DBS Singapore) flagged for shell entity mismatch • 1 Corporate ID proof requires compliance sign-off
              </span>
            </div>
          </div>
          <button
            onClick={onNavigateToIdProofs}
            className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto flex items-center gap-1.5"
          >
            <span>Review Bank ID Proofs</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      )}

      {/* Top Cards Row: 2-column balanced grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskHealthCard region={region} currency={currency} onViewDetails={onViewDetails} />
        <RiskTimelineCard timeRange={timeRange} onComparePeriods={onComparePeriods} />
      </div>

      {onNavigateToBanks && <button onClick={onNavigateToBanks} className="w-full text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-orange-300"><div className="flex justify-between items-center"><div><h2 className="font-bold text-slate-900">Bank transfer summary</h2><p className="text-xs text-slate-500 mt-1">HDFC, ICICI, SBI, Axis, Kotak, DBS, Barclays and Commonwealth</p></div><span className="text-orange-600 text-sm font-semibold">View bank breakdown →</span></div></button>}

      {/* Mid Section: Recharts Trend Analytics Panel for Transaction Volume Spikes */}
      <div>
        <TrendAnalyticsPanel
          timeRange={timeRange}
          region={region}
          currency={currency}
        />
      </div>

      {/* Bottom Section: Top Alerts & Incidents */}
      <div>
        <TopAlertsTable
          alerts={alerts}
          onViewAll={onViewAllAlerts}
          onSelectAlert={onSelectAlert}
        />
      </div>
    </div>
  );
};
