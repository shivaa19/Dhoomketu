import React, { useState } from 'react';
import { OperatorProfile, VaultNavTab, AlertIncident } from '../types';
import { VaultTransaction, CustomerRiskProfile, MerchantProfile } from '../data/vaultData';
import { GlobalSearchDropdown } from './GlobalSearchDropdown';

interface VaultHeaderProps {
  region: string;
  onRegionChange: (r: string) => void;
  timeRange: string;
  onTimeRangeChange: (t: string) => void;
  currency: string;
  onCurrencyChange: (c: string) => void;
  searchTerm: string;
  onSearchChange: (s: string) => void;
  onCreateAlert: () => void;
  onExport: () => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  operator?: OperatorProfile;
  onSignOut?: () => void;
  onNavigateToTab?: (tab: VaultNavTab) => void;
  onOpenAiChat?: () => void;
  onSelectTransaction?: (tx: VaultTransaction) => void;
  onSelectAlert?: (alert: AlertIncident) => void;
  onSelectCustomer?: (customer: CustomerRiskProfile) => void;
  onSelectMerchant?: (merchant: MerchantProfile) => void;
}

export const VaultHeader: React.FC<VaultHeaderProps> = ({
  region,
  onRegionChange,
  timeRange,
  onTimeRangeChange,
  currency,
  onCurrencyChange,
  searchTerm,
  onSearchChange,
  onCreateAlert,
  onExport,
  onOpenNotifications,
  onOpenSettings,
  operator,
  onSignOut,
  onNavigateToTab,
  onOpenAiChat,
  onSelectTransaction,
  onSelectAlert,
  onSelectCustomer,
  onSelectMerchant,
}) => {
  const [showRegionMenu, setShowRegionMenu] = useState(false);
  const [showTimeMenu, setShowTimeMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showOperatorMenu, setShowOperatorMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const regionOptions = ['EU Payments', 'US Core', 'APAC Cards', 'Global Routing'];
  const timeOptions = ['Last 24 hours', 'Last 7 days', 'Last 30 days', 'Quarter to Date'];
  const currencyOptions = ['USD', 'EUR', 'GBP', 'AUD', 'CAD'];

  return (
    <header className="w-full bg-white px-6 py-3.5 border-b border-slate-100 flex items-center justify-between gap-4 select-none relative">
      {/* Click outside backdrop for dropdowns */}
      {(showRegionMenu || showTimeMenu || showCurrencyMenu || showOperatorMenu) && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => {
            setShowRegionMenu(false);
            setShowTimeMenu(false);
            setShowCurrencyMenu(false);
            setShowOperatorMenu(false);
          }}
        />
      )}

      {/* Left: Brand Logo & Context Selectors */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Brand */}
        <div className="flex items-center gap-2 mr-2">
          {/* Orange Shield Checkmark SVG Icon */}
          <div className="w-7 h-7 flex items-center justify-center text-orange-500">
            <svg
              className="w-7 h-7"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 2.5L23.5 6.5V13.8C23.5 19.8 19.4 24.8 14 26.5C8.6 24.8 4.5 19.8 4.5 13.8V6.5L14 2.5Z"
                stroke="#EA580C"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 13.5L12.8 16.5L18.5 10.5"
                stroke="#EA580C"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            Dhoom<span className="text-orange-600">ketu</span>
          </span>
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2">
          {/* Region Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRegionMenu(!showRegionMenu);
                setShowTimeMenu(false);
                setShowCurrencyMenu(false);
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <span>{region}</span>
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showRegionMenu && (
              <div className="absolute left-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 animate-in fade-in">
                {regionOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      onRegionChange(opt);
                      setShowRegionMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                      region === opt ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Time Range Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowTimeMenu(!showTimeMenu);
                setShowRegionMenu(false);
                setShowCurrencyMenu(false);
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <span>{timeRange}</span>
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showTimeMenu && (
              <div className="absolute left-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 animate-in fade-in">
                {timeOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      onTimeRangeChange(opt);
                      setShowTimeMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                      timeRange === opt ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Currency Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCurrencyMenu(!showCurrencyMenu);
                setShowRegionMenu(false);
                setShowTimeMenu(false);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span>{currency}</span>
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showCurrencyMenu && (
              <div className="absolute left-0 mt-1 w-28 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 animate-in fade-in">
                {currencyOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      onCurrencyChange(opt);
                      setShowCurrencyMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                      currency === opt ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Search Input */}
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search transactions, alerts, customers, merchants..."
            value={searchTerm}
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setIsSearchFocused(true);
            }}
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 placeholder-slate-400 rounded-lg border border-transparent focus:border-slate-300 focus:outline-none transition-all"
          />

          {searchTerm && (
            <button
              onClick={() => {
                onSearchChange('');
                setIsSearchFocused(false);
              }}
              title="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Results Preview Dropdown */}
          <GlobalSearchDropdown
            searchTerm={searchTerm}
            isOpen={isSearchFocused && searchTerm.trim().length > 0}
            onClose={() => setIsSearchFocused(false)}
            currency={currency}
            onSelectTransaction={onSelectTransaction}
            onSelectAlert={onSelectAlert}
            onSelectCustomer={onSelectCustomer}
            onSelectMerchant={onSelectMerchant}
            onNavigateToTab={onNavigateToTab}
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* AI Fraud Bot Button */}
        <button
          onClick={onOpenAiChat}
          title="Open AI Sentinel Fraud Chatbot"
          className="px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200/80 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs text-xs font-semibold"
        >
          <span className="material-symbols-outlined text-sm">psychology</span>
          <span className="hidden sm:inline">AI Fraud Bot</span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
        </button>

        {/* Create Alert Button */}
        <button
          onClick={onCreateAlert}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span className="text-sm leading-none font-bold">+</span>
          <span>Create Alert</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onExport}
          title="Export Telemetry Report"
          className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>

        {/* Notifications Button with Dot */}
        <button
          onClick={onOpenNotifications}
          title="Notifications"
          className="relative w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white" />
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          title="System Settings"
          className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Bank Operator Account & ID Proof Pill */}
        {operator && (
          <div className="relative pl-2 border-l border-slate-200">
            <button
              onClick={() => setShowOperatorMenu(!showOperatorMenu)}
              className="flex items-center gap-2.5 p-1 pr-2.5 rounded-xl hover:bg-slate-50 border border-slate-200/80 transition-all cursor-pointer shadow-2xs group"
            >
              <div className="w-7 h-7 rounded-lg bg-orange-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {operator.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-slate-900 block leading-tight group-hover:text-orange-600 transition-colors">
                  {operator.name}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block leading-tight">
                  {operator.bankName}
                </span>
              </div>
              <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Operator Menu Dropdown */}
            {showOperatorMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200/60">
                      {operator.id}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 font-semibold">
                      ✓ mTLS Active
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-2">{operator.name}</h4>
                  <p className="text-[11px] text-slate-600">{operator.role}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">Badge: {operator.badgeNumber}</p>
                  <div className="text-[10px] text-orange-700 bg-orange-100/60 px-2 py-1 rounded mt-2 font-medium">
                    {operator.clearanceLevel}
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      if (onNavigateToTab) onNavigateToTab('profile');
                      setShowOperatorMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-orange-50 hover:text-orange-700 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-orange-600">account_circle</span>
                    <span>My Profile & Bank ID</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onNavigateToTab) onNavigateToTab('id-proofs');
                      setShowOperatorMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base text-orange-600">badge</span>
                    <span>Bank ID Proofs &amp; KYC Vault</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onSignOut) onSignOut();
                      setShowOperatorMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    <span>Sign Out / Switch Operator Login</span>
                  </button>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
