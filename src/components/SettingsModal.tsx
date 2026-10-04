import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: string;
  onCurrencyChange: (c: string) => void;
  onShowToast: (title: string, msg: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currency,
  onCurrencyChange,
  onShowToast,
}) => {
  const [sensitivity, setSensitivity] = useState('Balanced (Standard 50/100 threshold)');
  const [pollInterval, setPollInterval] = useState('Real-Time (mTLS WebSockets)');
  const [desktopAlerts, setDesktopAlerts] = useState(true);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('Settings Saved', 'Platform parameters updated successfully.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Platform &amp; Sentinel Settings</h3>
            <p className="text-xs text-slate-500">
              Configure fraud scoring sensitivity, telemetry polling, and display options
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Scoring Engine Sensitivity
            </label>
            <select
              value={sensitivity}
              onChange={(e) => setSensitivity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="Aggressive (Low threshold, higher 3DS challenges)">
                Aggressive (Strict, &gt;35 score triggers 3DS)
              </option>
              <option value="Balanced (Standard 50/100 threshold)">
                Balanced (Default banking standard)
              </option>
              <option value="Permissive (High threshold, reduces customer friction)">
                Permissive (Frictionless, &gt;75 score triggers 3DS)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Default Display Currency
            </label>
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="AUD">AUD (A$) - Australian Dollar</option>
              <option value="CAD">CAD (C$) - Canadian Dollar</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Telemetry Polling Frequency
            </label>
            <select
              value={pollInterval}
              onChange={(e) => setPollInterval(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="Real-Time (mTLS WebSockets)">Real-Time (mTLS WebSockets stream)</option>
              <option value="5 Seconds Interval">5 Seconds Polling</option>
              <option value="30 Seconds Batch">30 Seconds Batch Clearing</option>
            </select>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={desktopAlerts}
                onChange={(e) => setDesktopAlerts(e.target.checked)}
                className="w-4 h-4 rounded accent-orange-600 cursor-pointer"
              />
              <span className="text-slate-700 font-medium">
                Push high-severity alerts immediately to desktop notification banner
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
