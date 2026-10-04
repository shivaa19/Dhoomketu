import React, { useState } from 'react';
import { INITIAL_MODELS, MachineLearningModel } from '../data/vaultData';

interface RulesModelsViewProps {
  onShowToast: (title: string, msg: string) => void;
  onNavigateToOverview: () => void;
}

export const RulesModelsView: React.FC<RulesModelsViewProps> = ({
  onShowToast,
  onNavigateToOverview,
}) => {
  const [models, setModels] = useState<MachineLearningModel[]>(INITIAL_MODELS);

  // Simulator inputs
  const [simAmount, setSimAmount] = useState('2400');
  const [simVelocity, setSimVelocity] = useState('8');
  const [simDeviceAgeDays, setSimDeviceAgeDays] = useState('3');
  const [simGeoDistanceKm, setSimGeoDistanceKm] = useState('1800');
  const [simPrediction, setSimPrediction] = useState<{
    score: number;
    decision: string;
    features: Array<{ name: string; impact: string }>;
  } | null>(null);

  const handleToggleMode = (modelId: string) => {
    setModels(
      models.map((m) => {
        if (m.id === modelId) {
          const newMode: MachineLearningModel['mode'] =
            m.mode === 'Live (Production)' ? 'Shadow Mode' : 'Live (Production)';
          onShowToast(
            'Model Deployment Updated',
            `${m.name} is now running in ${newMode}.`
          );
          return { ...m, mode: newMode };
        }
        return m;
      })
    );
  };

  const handleRunInference = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(simAmount) || 0;
    const vel = parseFloat(simVelocity) || 0;
    const devAge = parseFloat(simDeviceAgeDays) || 0;
    const dist = parseFloat(simGeoDistanceKm) || 0;

    let rawScore = 0.08;
    if (amt > 2000) rawScore += 0.28;
    if (vel > 5) rawScore += 0.24;
    if (devAge < 7) rawScore += 0.31;
    if (dist > 1500) rawScore += 0.18;

    const prob = Math.min(Math.max(rawScore, 0.02), 0.99);
    const decision =
      prob > 0.8 ? 'AUTOMATIC DECLINE (HIGH FRAUD PROBABILITY)' : prob > 0.45 ? 'STEP-UP 3D SECURE 2.2 CHALLENGE' : 'CLEARED (NOMINAL RISK)';

    setSimPrediction({
      score: Math.round(prob * 100),
      decision,
      features: [
        { name: 'Device Fingerprint Age (< 7 days)', impact: devAge < 7 ? '+31% Fraud Weight' : 'Nominal' },
        { name: 'Velocity Surge (> 5 tx/hr)', impact: vel > 5 ? '+24% Fraud Weight' : 'Nominal' },
        { name: 'Ticket Size Anomaly', impact: amt > 2000 ? '+28% Fraud Weight' : 'Nominal' },
        { name: 'Cross-Corridor IP Distance', impact: dist > 1500 ? '+18% Fraud Weight' : 'Nominal' },
      ],
    });

    onShowToast('Inference Evaluated', `Prediction generated in 12ms via Deep Neural Net.`);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">tune</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Machine Learning Models &amp; Scoring Pipelines
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time inference engines, drift monitoring, and shadow-mode algorithmic evaluation
          </p>
        </div>

        <button
          onClick={onNavigateToOverview}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          ← Back to Overview
        </button>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {models.map((model) => (
          <div
            key={model.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                    {model.id}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {model.version}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{model.name}</h3>
                <span className="text-xs text-slate-400">{model.type}</span>
              </div>

              <button
                onClick={() => handleToggleMode(model.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  model.mode === 'Live (Production)'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {model.mode}
              </button>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-center font-mono">
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Accuracy</span>
                <span className="font-bold text-slate-900 text-sm">{model.accuracy}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Precision</span>
                <span className="font-bold text-slate-900 text-sm">{model.precision}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Latency</span>
                <span className="font-bold text-emerald-600 text-sm">{model.latencyMs}ms</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
              <span>Drift Score: {model.driftScore} (Stable)</span>
              <span>Trained: {model.lastTrained}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Inference Sandbox */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Live Neural Inference Sandbox
            </h3>
            <p className="text-xs text-slate-500">
              Simulate feature vectors and inspect algorithmic SHAP attribution
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
            Model: Deep Neural Network v3.8
          </span>
        </div>

        <form onSubmit={handleRunInference} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Transaction Amount ($ USD)
            </label>
            <input
              type="number"
              value={simAmount}
              onChange={(e) => setSimAmount(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              1-Hour Velocity Count
            </label>
            <input
              type="number"
              value={simVelocity}
              onChange={(e) => setSimVelocity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Device Fingerprint Age (Days)
            </label>
            <input
              type="number"
              value={simDeviceAgeDays}
              onChange={(e) => setSimDeviceAgeDays(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Issuing vs IP Distance (km)
            </label>
            <input
              type="number"
              value={simGeoDistanceKm}
              onChange={(e) => setSimGeoDistanceKm(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="sm:col-span-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">psychology</span>
              <span>Run Neural Inference</span>
            </button>
          </div>
        </form>

        {simPrediction && (
          <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-mono block">FRAUD PROBABILITY</span>
                <span className="text-3xl font-extrabold font-mono text-orange-400">
                  {simPrediction.score}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-mono block">SYSTEM DECISION</span>
                <span className="text-sm font-bold font-mono text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                  {simPrediction.decision}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-slate-800 text-xs">
              <span className="text-slate-400 block font-semibold">SHAP Feature Attribution:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                {simPrediction.features.map((f, idx) => (
                  <div key={idx} className="p-2 bg-slate-800/70 rounded-lg flex justify-between">
                    <span className="text-slate-300 font-sans">{f.name}:</span>
                    <span className="text-orange-400 font-bold">{f.impact}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
