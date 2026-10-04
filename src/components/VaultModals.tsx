import React from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-600">tune</span>
            Filter Risk Overview
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Card Network Segments</label>
            <div className="grid grid-cols-2 gap-2">
              {['APAC Cards', 'AU Cards', 'ME Cards', 'AS Cards', 'EU Payments'].map((seg) => (
                <label key={seg} className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-100 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-orange-600 rounded" />
                  <span className="text-slate-700 font-medium">{seg}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Risk Severity Level</label>
            <div className="flex gap-2">
              <label className="flex-1 p-2 rounded bg-slate-50 border border-slate-100 text-center cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-orange-600 mr-1.5" /> High
              </label>
              <label className="flex-1 p-2 rounded bg-slate-50 border border-slate-100 text-center cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-orange-600 mr-1.5" /> Medium
              </label>
              <label className="flex-1 p-2 rounded bg-slate-50 border border-slate-100 text-center cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-orange-600 mr-1.5" /> Low
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button onClick={onClose} className="px-3 py-1.5 text-slate-600 hover:text-slate-800 font-medium">Cancel</button>
          <button onClick={() => { onApply(); onClose(); }} className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg shadow-sm">Apply Filters</button>
        </div>
      </div>
    </div>
  );
};

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DetailsModal: React.FC<DetailsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Risk Health Score Breakdown</h3>
            <p className="text-slate-500">Aggregated index: 1,258 • Normalized standard</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
            <span className="font-semibold text-orange-950 block">Primary Risk Factor: High-Risk BIN Range (71%)</span>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Elevated authorization attempts from prepaid card BIN ranges with high historical chargeback ratios.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between p-2 rounded bg-slate-50">
              <span className="font-medium text-slate-700">Velocity Deviation:</span>
              <span className="font-bold text-slate-900 font-mono">2.4x historical average</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-50">
              <span className="font-medium text-slate-700">New Device Fingerprint Ratio:</span>
              <span className="font-bold text-slate-900 font-mono">6.2% of daily traffic</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-50">
              <span className="font-medium text-slate-700">Geographic IP Mismatch Rate:</span>
              <span className="font-bold text-slate-900 font-mono">14.1% cross-corridor</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg">Close</button>
        </div>
      </div>
    </div>
  );
};

interface ComparePeriodsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComparePeriodsModal: React.FC<ComparePeriodsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Period Comparison Analysis</h3>
            <p className="text-slate-500">Current 24h vs. Prior 24h Telemetry</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 font-mono">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-sans font-semibold text-slate-500 text-[11px] block">CURRENT 24H</span>
            <div className="text-lg font-bold text-orange-600 mt-1">265 Flagged</div>
            <span className="text-slate-500 text-[11px] font-sans">Peak at 20:00 UTC</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-sans font-semibold text-slate-500 text-[11px] block">PREVIOUS 24H</span>
            <div className="text-lg font-bold text-slate-700 mt-1">214 Flagged</div>
            <span className="text-emerald-600 text-[11px] font-sans">+23.8% surge today</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 leading-relaxed font-sans">
          The velocity surge is predominantly localized to APAC card networks during evening clearing cycles (16:00–20:00 UTC).
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg">Done</button>
        </div>
      </div>
    </div>
  );
};
