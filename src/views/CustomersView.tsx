import React, { useState } from 'react';
import { CustomerRiskProfile, formatMoney, INITIAL_CUSTOMERS } from '../data/vaultData';

interface CustomersViewProps {
  currency: string;
  onShowToast: (title: string, msg: string) => void;
  onNavigateToOverview: () => void;
  onNavigateToIdProofs: () => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  currency,
  onShowToast,
  onNavigateToOverview,
  onNavigateToIdProofs,
}) => {
  const [customers, setCustomers] = useState<CustomerRiskProfile[]>(INITIAL_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [riskTier, setRiskTier] = useState<string>('All');
  const [selectedCust, setSelectedCust] = useState<CustomerRiskProfile | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.accountNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());

    const matchesTier = riskTier === 'All' || c.status === riskTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">group</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Customer Risk &amp; Behavioral Profiles
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Cardholder baseline anomalies, risk scoring tiers, and KYC identity clearance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToOverview}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            ← Back to Overview
          </button>
          <button
            onClick={onNavigateToIdProofs}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">badge</span>
            <span>View Bank ID Proofs</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search by customer name, account, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            {['All', 'High Risk', 'Elevated', 'Nominal'].map((st) => (
              <button
                key={st}
                onClick={() => setRiskTier(st)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  riskTier === st
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] text-slate-700 font-semibold">
                <th className="py-3 px-4">Entity ID &amp; Name</th>
                <th className="py-3 px-4">Type &amp; Country</th>
                <th className="py-3 px-4">Account Number</th>
                <th className="py-3 px-4">90D Volume ({currency})</th>
                <th className="py-3 px-4">Risk Tier</th>
                <th className="py-3 px-4">KYC Seal</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((cust) => {
                const isHigh = cust.status === 'High Risk';
                const isElevated = cust.status === 'Elevated';

                return (
                  <tr
                    key={cust.id}
                    onClick={() => setSelectedCust(cust)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-orange-600 block group-hover:underline">
                        {cust.id}
                      </span>
                      <span className="font-bold text-slate-900 block mt-0.5">
                        {cust.name}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      <span>{cust.type}</span>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        {cust.country}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-800 font-semibold">
                      {cust.accountNumber}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {formatMoney(cust.totalVolumeUSD, currency)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isHigh
                            ? 'bg-red-50 text-red-700 border border-red-200/60'
                            : isElevated
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        }`}
                      >
                        {cust.riskScore}/100 ({cust.status})
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] font-semibold ${
                          cust.kycStatus === 'Verified'
                            ? 'text-emerald-600'
                            : cust.kycStatus === 'Flagged'
                            ? 'text-red-600 font-bold'
                            : 'text-amber-600'
                        }`}
                      >
                        ● {cust.kycStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCust(cust);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Dossier Modal */}
      {selectedCust && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in select-none">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                    {selectedCust.id}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {selectedCust.type}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{selectedCust.name}</h3>
                <span className="text-xs text-slate-400 font-mono">
                  Account: {selectedCust.accountNumber} • {selectedCust.country}
                </span>
              </div>
              <button
                onClick={() => setSelectedCust(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Calculated Risk Score</span>
                <span className="font-bold text-orange-600 font-mono text-base">
                  {selectedCust.riskScore} / 100
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Total Processed Volume</span>
                <span className="font-bold text-slate-900 font-mono text-base">
                  {formatMoney(selectedCust.totalVolumeUSD, currency)}
                </span>
              </div>
            </div>

            {selectedCust.flagReason && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900">
                <span className="font-bold block mb-1">Active Compliance Flag:</span>
                <span>{selectedCust.flagReason}</span>
              </div>
            )}

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 text-sm">Behavioral Baseline Metrics</h4>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Active Payment Cards:</span>
                  <span className="font-bold text-slate-900">{selectedCust.linkedCardsCount} Tokenized</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">KYC Identity Seal:</span>
                  <span className="font-bold text-slate-900">{selectedCust.kycStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Last Transaction:</span>
                  <span className="text-slate-900">{selectedCust.lastActive}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
              <button
                onClick={() => {
                  setSelectedCust(null);
                  onNavigateToIdProofs();
                }}
                className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl cursor-pointer"
              >
                Inspect Bank ID Proof →
              </button>
              <button
                onClick={() => {
                  onShowToast('EDD Triggered', `Initiated Enhanced Due Diligence for ${selectedCust.name}`);
                  setSelectedCust(null);
                }}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl cursor-pointer"
              >
                Trigger Enhanced Due Diligence (EDD)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
