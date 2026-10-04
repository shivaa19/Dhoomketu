import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  INITIAL_TRANSACTIONS,
  INITIAL_ALERTS,
  INITIAL_CUSTOMERS,
  INITIAL_MERCHANTS,
  VaultTransaction,
  CustomerRiskProfile,
  MerchantProfile,
  formatMoney,
} from '../data/vaultData';
import { AlertIncident, VaultNavTab } from '../types';

interface GlobalSearchDropdownProps {
  searchTerm: string;
  isOpen: boolean;
  onClose: () => void;
  currency: string;
  onSelectTransaction?: (tx: VaultTransaction) => void;
  onSelectAlert?: (alert: AlertIncident) => void;
  onSelectCustomer?: (cust: CustomerRiskProfile) => void;
  onSelectMerchant?: (merch: MerchantProfile) => void;
  onNavigateToTab?: (tab: VaultNavTab) => void;
}

type FilterCategory = 'all' | 'transactions' | 'alerts' | 'customers' | 'merchants';

export const GlobalSearchDropdown: React.FC<GlobalSearchDropdownProps> = ({
  searchTerm,
  isOpen,
  onClose,
  currency,
  onSelectTransaction,
  onSelectAlert,
  onSelectCustomer,
  onSelectMerchant,
  onNavigateToTab,
}) => {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const query = searchTerm.trim().toLowerCase();

  // Search results across 4 datasets
  const matchedTransactions = useMemo(() => {
    if (!query) return [];
    return INITIAL_TRANSACTIONS.filter((tx) =>
      tx.id.toLowerCase().includes(query) ||
      tx.customerName.toLowerCase().includes(query) ||
      tx.merchantName.toLowerCase().includes(query) ||
      tx.cardNumberMasked.toLowerCase().includes(query) ||
      tx.location.toLowerCase().includes(query) ||
      tx.channel.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [query]);

  const matchedAlerts = useMemo(() => {
    if (!query) return [];
    return INITIAL_ALERTS.filter((alt) =>
      alt.code.toLowerCase().includes(query) ||
      alt.title.toLowerCase().includes(query) ||
      alt.segment.toLowerCase().includes(query) ||
      alt.owner.name.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [query]);

  const matchedCustomers = useMemo(() => {
    if (!query) return [];
    return INITIAL_CUSTOMERS.filter((cust) =>
      cust.name.toLowerCase().includes(query) ||
      cust.accountNumber.toLowerCase().includes(query) ||
      cust.id.toLowerCase().includes(query) ||
      cust.country.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [query]);

  const matchedMerchants = useMemo(() => {
    if (!query) return [];
    return INITIAL_MERCHANTS.filter((merch) =>
      merch.id.toLowerCase().includes(query) ||
      merch.name.toLowerCase().includes(query) ||
      merch.mcc.toLowerCase().includes(query) ||
      merch.category.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [query]);

  const totalResultsCount =
    matchedTransactions.length +
    matchedAlerts.length +
    matchedCustomers.length +
    matchedMerchants.length;

  if (!isOpen || !query) return null;

  const highlightMatch = (text: string, q: string) => {
    if (!q) return text;
    const parts = text.split(new RegExp(`(${q})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === q.toLowerCase() ? (
            <span key={i} className="bg-orange-100 text-orange-900 font-semibold px-0.5 rounded">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute left-0 top-full mt-2 w-[480px] max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 text-slate-800"
    >
      {/* Category Filter Pills Bar */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] font-semibold text-slate-600">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white hover:bg-slate-200/70 border border-slate-200 text-slate-700'
          }`}
        >
          All ({totalResultsCount})
        </button>

        <button
          onClick={() => setActiveCategory('transactions')}
          className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
            activeCategory === 'transactions'
              ? 'bg-slate-900 text-white'
              : 'bg-white hover:bg-slate-200/70 border border-slate-200 text-slate-700'
          }`}
        >
          <span className="material-symbols-outlined text-[13px] text-orange-500">swap_horiz</span>
          <span>Transactions ({matchedTransactions.length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('alerts')}
          className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
            activeCategory === 'alerts'
              ? 'bg-slate-900 text-white'
              : 'bg-white hover:bg-slate-200/70 border border-slate-200 text-slate-700'
          }`}
        >
          <span className="material-symbols-outlined text-[13px] text-red-500">warning</span>
          <span>Alerts ({matchedAlerts.length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('customers')}
          className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
            activeCategory === 'customers'
              ? 'bg-slate-900 text-white'
              : 'bg-white hover:bg-slate-200/70 border border-slate-200 text-slate-700'
          }`}
        >
          <span className="material-symbols-outlined text-[13px] text-blue-500">group</span>
          <span>Customers ({matchedCustomers.length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('merchants')}
          className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
            activeCategory === 'merchants'
              ? 'bg-slate-900 text-white'
              : 'bg-white hover:bg-slate-200/70 border border-slate-200 text-slate-700'
          }`}
        >
          <span className="material-symbols-outlined text-[13px] text-emerald-500">storefront</span>
          <span>Merchants ({matchedMerchants.length})</span>
        </button>
      </div>

      {/* Results Body */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 p-2">
        {totalResultsCount === 0 ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-xl">search_off</span>
            </div>
            <p className="text-xs font-semibold text-slate-700">No results found for "{searchTerm}"</p>
            <p className="text-[11px] text-slate-400">
              Try searching by TX ID (e.g. TX-90217), alert code (ALT-003), customer name, or merchant ID (MERCH-0042).
            </p>
          </div>
        ) : (
          <>
            {/* 1. TRANSACTIONS SECTION */}
            {(activeCategory === 'all' || activeCategory === 'transactions') &&
              matchedTransactions.length > 0 && (
                <div className="py-2 first:pt-0">
                  <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-orange-700">
                      <span className="material-symbols-outlined text-xs">swap_horiz</span>
                      Transactions ({matchedTransactions.length})
                    </span>
                    <button
                      onClick={() => {
                        if (onNavigateToTab) onNavigateToTab('transactions');
                        onClose();
                      }}
                      className="text-[10px] text-orange-600 hover:underline cursor-pointer lowercase"
                    >
                      view in ledger →
                    </button>
                  </div>
                  <div className="space-y-1 mt-1">
                    {matchedTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        onClick={() => {
                          if (onSelectTransaction) onSelectTransaction(tx);
                          onClose();
                        }}
                        className="px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                              {highlightMatch(tx.id, query)}
                            </span>
                            <span className="text-xs font-semibold text-slate-700 truncate">
                              {highlightMatch(tx.customerName, query)}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono truncate">
                            <span>{highlightMatch(tx.merchantName, query)}</span>
                            <span>•</span>
                            <span>{tx.channel}</span>
                            <span>•</span>
                            <span>{tx.location}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono font-bold text-xs text-slate-900 block">
                            {formatMoney(tx.amountUSD, currency)}
                          </span>
                          <span
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                              tx.riskScore > 70
                                ? 'bg-red-100 text-red-700'
                                : tx.riskScore > 40
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            Risk: {tx.riskScore}/100
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* 2. ALERTS SECTION */}
            {(activeCategory === 'all' || activeCategory === 'alerts') &&
              matchedAlerts.length > 0 && (
                <div className="py-2">
                  <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-red-700">
                      <span className="material-symbols-outlined text-xs">warning</span>
                      Alerts &amp; Incidents ({matchedAlerts.length})
                    </span>
                    <button
                      onClick={() => {
                        if (onNavigateToTab) onNavigateToTab('alerts');
                        onClose();
                      }}
                      className="text-[10px] text-red-600 hover:underline cursor-pointer lowercase"
                    >
                      view all alerts →
                    </button>
                  </div>
                  <div className="space-y-1 mt-1">
                    {matchedAlerts.map((alt) => (
                      <div
                        key={alt.id}
                        onClick={() => {
                          if (onSelectAlert) onSelectAlert(alt);
                          onClose();
                        }}
                        className="px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-red-600 group-hover:underline">
                              {highlightMatch(alt.code, query)}
                            </span>
                            <span className="text-xs font-medium text-slate-800 truncate">
                              {highlightMatch(alt.title, query)}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                            <span>{alt.segment}</span>
                            <span>•</span>
                            <span>{alt.started}</span>
                            <span>•</span>
                            <span>Assignee: {alt.owner.name}</span>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${
                              alt.severity === 'high'
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : alt.severity === 'medium'
                                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {alt.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* 3. CUSTOMERS SECTION */}
            {(activeCategory === 'all' || activeCategory === 'customers') &&
              matchedCustomers.length > 0 && (
                <div className="py-2">
                  <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-blue-700">
                      <span className="material-symbols-outlined text-xs">group</span>
                      Customers ({matchedCustomers.length})
                    </span>
                    <button
                      onClick={() => {
                        if (onNavigateToTab) onNavigateToTab('customers');
                        onClose();
                      }}
                      className="text-[10px] text-blue-600 hover:underline cursor-pointer lowercase"
                    >
                      view directory →
                    </button>
                  </div>
                  <div className="space-y-1 mt-1">
                    {matchedCustomers.map((cust) => (
                      <div
                        key={cust.id}
                        onClick={() => {
                          if (onSelectCustomer) onSelectCustomer(cust);
                          if (onNavigateToTab) onNavigateToTab('customers');
                          onClose();
                        }}
                        className="px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                              {highlightMatch(cust.name, query)}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500">
                              ({highlightMatch(cust.accountNumber, query)})
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                            <span>ID: {highlightMatch(cust.id, query)}</span>
                            <span>•</span>
                            <span>{cust.type}</span>
                            <span>•</span>
                            <span>{cust.country}</span>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                              cust.status === 'High Risk'
                                ? 'bg-red-100 text-red-700'
                                : cust.status === 'Elevated'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {cust.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* 4. MERCHANTS SECTION */}
            {(activeCategory === 'all' || activeCategory === 'merchants') &&
              matchedMerchants.length > 0 && (
                <div className="py-2">
                  <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <span className="material-symbols-outlined text-xs">storefront</span>
                      Merchants ({matchedMerchants.length})
                    </span>
                    <button
                      onClick={() => {
                        if (onNavigateToTab) onNavigateToTab('merchants');
                        onClose();
                      }}
                      className="text-[10px] text-emerald-600 hover:underline cursor-pointer lowercase"
                    >
                      view portfolio →
                    </button>
                  </div>
                  <div className="space-y-1 mt-1">
                    {matchedMerchants.map((merch) => (
                      <div
                        key={merch.id}
                        onClick={() => {
                          if (onSelectMerchant) onSelectMerchant(merch);
                          if (onNavigateToTab) onNavigateToTab('merchants');
                          onClose();
                        }}
                        className="px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-600 transition-colors">
                              {highlightMatch(merch.name, query)}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                              MCC {highlightMatch(merch.mcc, query)}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                            <span>ID: {highlightMatch(merch.id, query)}</span>
                            <span>•</span>
                            <span>{merch.category}</span>
                            <span>•</span>
                            <span>CB: {merch.chargebackRate}%</span>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                              merch.riskRating === 'High'
                                ? 'bg-red-100 text-red-700'
                                : merch.riskRating === 'Moderate'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            Risk: {merch.riskRating}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </>
        )}
      </div>

      {/* Footer Instructions */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span className="flex items-center gap-1">
          <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-semibold shadow-3xs">
            esc
          </kbd>
          <span>to close</span>
        </span>
        <span>Click any row to open details</span>
      </div>
    </div>
  );
};
