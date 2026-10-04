import React, { useState } from 'react';
import { FraudRule, INITIAL_FRAUD_RULES } from '../data/vaultData';

interface FraudDetectionViewProps {
  onShowToast: (title: string, msg: string) => void;
  onNavigateToOverview: () => void;
}

export const FraudDetectionView: React.FC<FraudDetectionViewProps> = ({
  onShowToast,
  onNavigateToOverview,
}) => {
  const [rules, setRules] = useState<FraudRule[]>(INITIAL_FRAUD_RULES);
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const [testAmount, setTestAmount] = useState('7500');
  const [testDistanceKm, setTestDistanceKm] = useState('3500');
  const [testVelocity, setTestVelocity] = useState('24');
  const [testResult, setTestResult] = useState<{ triggered: string[]; action: string } | null>(null);

  // New rule form
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleCategory, setNewRuleCategory] = useState<FraudRule['category']>('Velocity');
  const [newRuleAction, setNewRuleAction] = useState<FraudRule['action']>('Block');
  const [newRuleCondition, setNewRuleCondition] = useState('');
  const [newRuleThreshold, setNewRuleThreshold] = useState('');

  const handleToggleRule = (id: string) => {
    setRules(
      rules.map((r) => {
        if (r.id === id) {
          const updated = !r.enabled;
          onShowToast(
            updated ? 'Rule Enabled' : 'Rule Disabled',
            `${r.id} (${r.name}) is now ${updated ? 'active' : 'inactive'}.`
          );
          return { ...r, enabled: updated };
        }
        return r;
      })
    );
  };

  const handleRunSandbox = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(testAmount) || 0;
    const dist = parseFloat(testDistanceKm) || 0;
    const vel = parseFloat(testVelocity) || 0;

    const triggered: string[] = [];
    if (vel >= 20) triggered.push('RULE-101: High-Velocity Card Testing on Checkout');
    if (dist >= 3000) triggered.push('RULE-104: Card-Not-Present Billing IP Distance > 3,000km');
    if (amt >= 5000 && vel > 10) triggered.push('RULE-202: Synthetic Identity & High Ticket Velocity');

    const action = triggered.length > 1 ? 'BLOCK IMMEDIATELY' : triggered.length === 1 ? 'MANUAL REVIEW REQUIRED' : 'AUTO-APPROVE (NOMINAL)';
    setTestResult({ triggered, action });
    onShowToast('Sandbox Evaluation Complete', `Simulation evaluated against ${rules.length} active rules.`);
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    const newRule: FraudRule = {
      id: `RULE-${Math.floor(500 + Math.random() * 400)}`,
      name: newRuleName || 'Custom Fraud Decision Rule',
      condition: newRuleCondition || 'Velocity threshold exceeded',
      threshold: newRuleThreshold || '> 10 tx / 60 sec',
      action: newRuleAction,
      triggersToday: 0,
      accuracy: '99.0%',
      enabled: true,
      category: newRuleCategory,
    };

    setRules([...rules, newRule]);
    setIsAddRuleOpen(false);
    onShowToast('Rule Activated', `${newRule.id} registered into production decision engine.`);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">shield_with_heart</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Fraud Detection &amp; Heuristic Rules Engine
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time decision models, velocity monitors, and automated challenge triggers
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
            onClick={() => setIsAddRuleOpen(true)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Create Fraud Rule</span>
          </button>
        </div>
      </div>

      {/* Rules Performance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <span className="text-slate-400 font-semibold uppercase text-[11px] block mb-1">
            Active Rules
          </span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {rules.filter((r) => r.enabled).length} / {rules.length}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
            Running at 8ms average latency
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <span className="text-slate-400 font-semibold uppercase text-[11px] block mb-1">
            Triggers Today
          </span>
          <div className="text-2xl font-extrabold text-orange-600 font-mono">
            {rules.reduce((acc, r) => acc + (r.enabled ? r.triggersToday : 0), 0)}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            184 blocked, 44 held for manual triage
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <span className="text-slate-400 font-semibold uppercase text-[11px] block mb-1">
            False Positive Rate
          </span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            0.18%
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
            Within Basel III banking threshold
          </span>
        </div>
      </div>

      {/* Interactive Sandbox Test Runner */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Interactive Rule Evaluation Sandbox
            </h3>
            <p className="text-xs text-slate-500">
              Test transaction parameters against all active rules to verify instant decisioning
            </p>
          </div>
          <span className="text-[11px] font-mono bg-orange-50 text-orange-700 px-2 py-1 rounded border border-orange-200">
            Real-time Rule Evaluator
          </span>
        </div>

        <form onSubmit={handleRunSandbox} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Amount ($ USD)</label>
            <input
              type="number"
              value={testAmount}
              onChange={(e) => setTestAmount(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">IP Distance (km)</label>
            <input
              type="number"
              value={testDistanceKm}
              onChange={(e) => setTestDistanceKm(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Velocity (tx / 60s)</label>
            <input
              type="number"
              value={testVelocity}
              onChange={(e) => setTestVelocity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">play_arrow</span>
              <span>Run Rule Test</span>
            </button>
          </div>
        </form>

        {testResult && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 animate-in fade-in text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Sandbox Test Outcome:</span>
              <span
                className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                  testResult.action.includes('BLOCK')
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : testResult.action.includes('REVIEW')
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                DECISION: {testResult.action}
              </span>
            </div>

            {testResult.triggered.length > 0 ? (
              <ul className="list-disc list-inside text-slate-700 space-y-1 font-mono text-[11px]">
                {testResult.triggered.map((t, idx) => (
                  <li key={idx} className="text-red-700 font-medium">
                    Triggered: {t}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-emerald-700 text-xs">
                No rules triggered. Transaction cleared baseline heuristic standards.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Rules Table */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 overflow-hidden">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Production Heuristic Rules</h3>
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] text-slate-700 font-semibold">
                <th className="py-3 px-4">Rule ID &amp; Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Condition &amp; Threshold</th>
                <th className="py-3 px-4">Enforced Action</th>
                <th className="py-3 px-4">Triggers Today</th>
                <th className="py-3 px-4 text-center">Status / Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-orange-600 block">{rule.id}</span>
                    <span className="font-semibold text-slate-900 block mt-0.5">{rule.name}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {rule.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                    <span className="block">{rule.condition}</span>
                    <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
                      Threshold: {rule.threshold}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                        rule.action === 'Block'
                          ? 'bg-red-50 text-red-700'
                          : rule.action === 'Challenge 3DS'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {rule.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {rule.triggersToday}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                        rule.enabled
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {rule.enabled ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Rule Modal */}
      {isAddRuleOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in select-none">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Create New Fraud Rule</h3>
              <button
                onClick={() => setIsAddRuleOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddRule} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="e.g. Excessive Nighttime Withdrawals"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={newRuleCategory}
                    onChange={(e) => setNewRuleCategory(e.target.value as FraudRule['category'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                  >
                    <option value="Velocity">Velocity</option>
                    <option value="Geolocation">Geolocation</option>
                    <option value="Device">Device</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Compliance">Compliance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Action</label>
                  <select
                    value={newRuleAction}
                    onChange={(e) => setNewRuleAction(e.target.value as FraudRule['action'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                  >
                    <option value="Block">Block Auth</option>
                    <option value="Review">Manual Review</option>
                    <option value="Challenge 3DS">Challenge 3DS</option>
                    <option value="Flag">Flag Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Rule Condition</label>
                <input
                  type="text"
                  required
                  value={newRuleCondition}
                  onChange={(e) => setNewRuleCondition(e.target.value)}
                  placeholder="e.g. Card authorized > 5 times between 02:00 and 05:00 UTC"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Threshold</label>
                <input
                  type="text"
                  required
                  value={newRuleThreshold}
                  onChange={(e) => setNewRuleThreshold(e.target.value)}
                  placeholder="e.g. > 5 auths / 3 hrs"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddRuleOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Deploy Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
