import React, { useState } from 'react';
import { AdminApiKey, INITIAL_API_KEYS } from '../data/vaultData';

interface AdminPanelViewProps {
  onShowToast: (title: string, msg: string) => void;
  onNavigateToOverview: () => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  onShowToast,
  onNavigateToOverview,
}) => {
  const [keys, setKeys] = useState<AdminApiKey[]>(INITIAL_API_KEYS);
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.slack.com/services/T00/B00/X00DhoomketuAlerts');
  const [isPinging, setIsPinging] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [keyScope, setKeyScope] = useState('Full Write (Transactions + Alerts)');

  const handleToggleKey = (keyId: string) => {
    setKeys(
      keys.map((k) => {
        if (k.id === keyId) {
          const newStatus: AdminApiKey['status'] = k.status === 'Active' ? 'Revoked' : 'Active';
          onShowToast(
            newStatus === 'Revoked' ? 'Key Revoked' : 'Key Reactivated',
            `${k.name} has been ${newStatus.toLowerCase()}.`
          );
          return { ...k, status: newStatus };
        }
        return k;
      })
    );
  };

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    const newKey: AdminApiKey = {
      id: `KEY-${Math.floor(10 + Math.random() * 90)}`,
      name: keyName || 'Automated Processing Token',
      prefix: `vg_live_${Math.random().toString(16).substring(2, 6)}••••••••${Math.floor(10 + Math.random() * 90)}`,
      scope: keyScope,
      createdAt: 'Just now',
      lastUsed: 'Never',
      status: 'Active',
    };

    setKeys([...keys, newKey]);
    setIsGenerateOpen(false);
    onShowToast('API Key Provisioned', `${newKey.name} generated with 256-bit token.`);
  };

  const handleTestWebhook = () => {
    setIsPinging(true);
    onShowToast('Sending Webhook Test Ping', `Transmitting cryptographic test payload to endpoint...`);

    setTimeout(() => {
      setIsPinging(false);
      onShowToast('Webhook Delivered (HTTP 200)', 'Endpoint acknowledged delivery in 42ms.');
    }, 900);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">space_dashboard</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Admin &amp; Gateway Settings
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            API key credentials, incident webhook integrations, and platform security policies
          </p>
        </div>

        <button
          onClick={onNavigateToOverview}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          ← Back to Overview
        </button>
      </div>

      {/* API Key Management */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Production API Gateway Keys</h3>
            <p className="text-xs text-slate-500">
              Cryptographically signed bearer tokens for real-time transaction ingestion
            </p>
          </div>
          <button
            onClick={() => setIsGenerateOpen(true)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">key</span>
            <span>Generate New Key</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] text-slate-700 font-semibold">
                <th className="py-3 px-4">Key Name</th>
                <th className="py-3 px-4">Key Prefix (Masked)</th>
                <th className="py-3 px-4">Access Scope</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {keys.map((k) => (
                <tr key={k.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{k.name}</td>
                  <td className="py-3.5 px-4 font-mono text-orange-600 font-semibold">{k.prefix}</td>
                  <td className="py-3.5 px-4 text-slate-600">{k.scope}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">{k.lastUsed}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        k.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {k.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleKey(k.id)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium cursor-pointer"
                    >
                      {k.status === 'Active' ? 'Revoke' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Webhook Configuration */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Incident Webhook Dispatch</h3>
          <p className="text-xs text-slate-500">
            Push real-time critical fraud alerts to your internal Slack or PagerDuty channel
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-none"
          />
          <button
            onClick={handleTestWebhook}
            disabled={isPinging}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">send</span>
            <span>{isPinging ? 'Pinging...' : 'Send Test Ping'}</span>
          </button>
        </div>
      </div>

      {/* Generate Key Modal */}
      {isGenerateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in select-none">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Provision API Key</h3>
              <button
                onClick={() => setIsGenerateOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleGenerateKey} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Key Description</label>
                <input
                  type="text"
                  required
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="e.g. Core Banking Settlement Engine"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Scope</label>
                <select
                  value={keyScope}
                  onChange={(e) => setKeyScope(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                >
                  <option value="Full Write (Transactions + Alerts)">Full Write (Transactions + Alerts)</option>
                  <option value="Read Only (KYC & Audit Vault)">Read Only (KYC & Audit Vault)</option>
                  <option value="Ingestion Only (POS / Online Stream)">Ingestion Only (POS / Online Stream)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsGenerateOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Generate Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
