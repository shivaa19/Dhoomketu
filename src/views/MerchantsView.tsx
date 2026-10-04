import React, { useState } from 'react';
import { formatCompactMoney, formatMoney, INITIAL_MERCHANTS, MerchantProfile } from '../data/vaultData';

interface MerchantsViewProps {
  currency: string;
  onShowToast: (title: string, msg: string) => void;
  onNavigateToOverview: () => void;
}

export const MerchantsView: React.FC<MerchantsViewProps> = ({
  currency,
  onShowToast,
  onNavigateToOverview,
}) => {
  const [merchants, setMerchants] = useState<MerchantProfile[]>(INITIAL_MERCHANTS);
  const [search, setSearch] = useState('');
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantProfile | null>(null);

  const handleToggleHold = (mId: string) => {
    setMerchants(
      merchants.map((m) => {
        if (m.id === mId) {
          const nextStatus: MerchantProfile['settlementStatus'] =
            m.settlementStatus === 'Active' ? 'Held' : 'Active';
          onShowToast(
            nextStatus === 'Held' ? 'Settlement Frozen' : 'Settlement Released',
            `${m.name} payouts are now ${nextStatus.toLowerCase()}.`
          );
          return { ...m, settlementStatus: nextStatus };
        }
        return m;
      })
    );
  };

  const filtered = merchants.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase()) ||
      m.mcc.includes(search)
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">storefront</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Merchant Acquiring Portfolio Directory
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Chargeback ratios, MATCH compliance status, and automated settlement holding
          </p>
        </div>

        <button
          onClick={onNavigateToOverview}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          ← Back to Overview
        </button>
      </div>

      {/* Chargeback Warning Banner */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-amber-700 text-xl">warning</span>
          <div>
            <span className="font-bold text-amber-950 block">Visa &amp; Mastercard Chargeback Monitoring Standard</span>
            <span className="text-amber-800 text-[11px] block mt-0.5">
              Merchants with dispute ratio exceeding 1.00% are subject to automated settlement escrow holds.
            </span>
          </div>
        </div>
        <span className="font-mono font-bold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded">
          2 Merchants Exceed Threshold
        </span>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-200/80">
        <input
          type="text"
          placeholder="Filter merchants by name, MCC code, or identifier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
        />
      </div>

      {/* Merchants Table */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] text-slate-700 font-semibold">
                <th className="py-3 px-4">Merchant ID &amp; Name</th>
                <th className="py-3 px-4">MCC &amp; Category</th>
                <th className="py-3 px-4">Chargeback Rate</th>
                <th className="py-3 px-4">Monthly Volume ({currency})</th>
                <th className="py-3 px-4">Settlement Escrow</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((m) => {
                const isOverLimit = m.chargebackRate > 1.0;
                const isHeld = m.settlementStatus === 'Held';

                return (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-orange-600 block">{m.id}</span>
                      <span className="font-bold text-slate-900 block mt-0.5">{m.name}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">MCC {m.mcc}</span>
                      <span className="text-[11px] text-slate-400 block">{m.category}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-sm">
                      <span className={isOverLimit ? 'text-red-600' : 'text-emerald-600'}>
                        {m.chargebackRate}%
                      </span>
                      {isOverLimit && (
                        <span className="ml-2 text-[10px] text-red-700 font-sans font-semibold bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                          OVER LIMIT
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {formatCompactMoney(m.volumeUSD, currency)}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleHold(m.id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                          isHeld
                            ? 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-200'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200'
                        }`}
                      >
                        {isHeld ? '⛔ Payouts Held' : '✓ Active'}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onShowToast('Merchant Audited', `Audited chargeback files for ${m.name}`)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium cursor-pointer"
                      >
                        Review Disputes
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
