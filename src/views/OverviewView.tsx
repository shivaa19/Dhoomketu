import React, { useState } from 'react';
import { MOCK_SIGNALS, PRIMARY_ACCOUNT } from '../data/mockData';
import { ViewMode } from '../types';

interface OverviewViewProps {
  onNavigate: (view: ViewMode) => void;
  onShowToast: (title: string, msg: string, icon?: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate, onShowToast }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical'>('all');

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationStatus('Ingesting synthetic multi-hop payload...');
    onShowToast('Attack Vector Ingestion Started', 'Simulating ₹18.4L in 42m structuring payload for ACC-10482...', 'terminal');

    setTimeout(() => {
      setSimulationStatus('8 Outward Transits Identified • Anomaly Triggered');
      setIsSimulating(false);
      onShowToast('Pipeline Ingested', '8 transactions flagged. Score elevated to 92. Ready for Copilot.', 'check_circle');
    }, 1500);
  };

  const displayedSignals = filterSeverity === 'critical'
    ? MOCK_SIGNALS.filter((s) => s.severity === 'CRITICAL')
    : MOCK_SIGNALS.slice(0, 4);

  return (
    <div className="flex flex-col w-full text-on-surface">
      {/* Executive Ticker & Top Alert Strip */}
      <section className="w-full bg-surface-container-lowest px-space-lg py-space-sm shadow-md border-b border-outline-variant/20">
        <div className="flex flex-wrap items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md min-w-0">
            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-1 rounded border border-tertiary/30">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-ping" />
              <span className="font-label-sm text-label-sm text-tertiary font-bold tracking-wider uppercase font-mono">
                SENTINEL-CORP AML PIPELINE ACTIVE
              </span>
            </div>
            <div className="hidden md:flex items-center gap-space-sm text-on-surface-variant font-label-sm text-label-sm font-mono">
              <span>HOST: IND-MUM-PRIMARY-01</span>
              <span>•</span>
              <span className="text-tertiary font-semibold">ZERO UNHANDLED BREACHES</span>
              <span>•</span>
              <span>LATENCY 14ms (p99.4)</span>
            </div>
          </div>
          <div className="flex items-center gap-space-lg font-label-sm text-label-sm">
            <div className="flex items-center gap-space-xs">
              <span className="text-on-surface-variant">Throughput:</span>
              <span className="font-code-metric text-code-metric text-primary leading-none font-mono">14,290</span>
              <span className="text-on-surface-variant text-[10px]">tx/sec</span>
            </div>
            <div className="flex items-center gap-space-xs bg-error-container/30 px-space-sm py-1 rounded border border-error/30 font-mono">
              <span className="material-symbols-outlined text-error text-[14px]">timer</span>
              <span className="text-error font-bold">CRITICAL SLA: 34m 12s REMAINING</span>
            </div>
          </div>
        </div>
      </section>

      <div className="p-space-lg space-y-space-lg">
        {/* Five Top Metric Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
          {/* Monitored Books */}
          <div className="bg-surface-container-low p-space-md rounded flex flex-col justify-between shadow-sm relative overflow-hidden border border-outline-variant/20">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-label-sm text-label-sm uppercase tracking-wide font-mono">Monitored Books</span>
              <span className="material-symbols-outlined text-[18px] text-secondary">account_balance</span>
            </div>
            <div className="my-space-sm">
              <div className="font-headline-lg text-headline-lg text-on-surface tracking-tight">1,284</div>
              <div className="font-label-sm text-label-sm text-tertiary flex items-center gap-1 mt-0.5 font-mono">
                <span className="material-symbols-outlined text-[12px]">trending_up</span>
                +12 this week • Tier-1 Corp
              </div>
            </div>
            <div className="w-full bg-surface-container-highest h-1 rounded overflow-hidden">
              <div className="bg-secondary h-full" style={{ width: '82%' }} />
            </div>
          </div>

          {/* Active Alerts */}
          <div className="bg-surface-container-low p-space-md rounded flex flex-col justify-between shadow-sm relative overflow-hidden border border-outline-variant/20">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-label-sm text-label-sm uppercase tracking-wide font-mono">Active Signals</span>
              <span className="material-symbols-outlined text-[18px] text-primary">warning</span>
            </div>
            <div className="my-space-sm">
              <div className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-mono">47</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1.5 mt-0.5 font-mono">
                <span className="text-error font-bold">18 Crit</span>
                <span>•</span>
                <span className="text-secondary font-medium">21 High</span>
                <span>•</span>
                <span>8 Med</span>
              </div>
            </div>
            <div className="w-full bg-surface-container-highest h-1 rounded overflow-hidden flex">
              <div className="bg-error h-full" style={{ width: '38%' }} />
              <div className="bg-secondary-container h-full" style={{ width: '45%' }} />
              <div className="bg-surface-variant h-full" style={{ width: '17%' }} />
            </div>
          </div>

          {/* Critical Entities */}
          <div className="bg-surface-container-low p-space-md rounded flex flex-col justify-between shadow-sm relative overflow-hidden border border-outline-variant/20">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-label-sm text-label-sm uppercase tracking-wide font-mono">Urgent SAR Entities</span>
              <span className="material-symbols-outlined text-[18px] text-error">gavel</span>
            </div>
            <div className="my-space-sm">
              <div className="font-headline-lg text-headline-lg text-error tracking-tight font-mono">18</div>
              <div className="font-label-sm text-label-sm text-error/90 flex items-center gap-1 mt-0.5 font-mono">
                <span className="material-symbols-outlined text-[12px]">schedule</span>
                SAR review SLA &lt; 38 min
              </div>
            </div>
            <div className="w-full bg-surface-container-highest h-1 rounded overflow-hidden">
              <div className="bg-error h-full animate-pulse" style={{ width: '90%' }} />
            </div>
          </div>

          {/* Risk Exposure */}
          <div className="bg-surface-container-low p-space-md rounded flex flex-col justify-between shadow-sm relative overflow-hidden border border-outline-variant/20">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-label-sm text-label-sm uppercase tracking-wide font-mono">7D Risk Exposure</span>
              <span className="material-symbols-outlined text-[18px] text-primary">currency_rupee</span>
            </div>
            <div className="my-space-sm">
              <div className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-mono">₹2.84 Cr</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant truncate mt-0.5">
                Outbound Cross-Border FX
              </div>
            </div>
            <div className="w-full bg-surface-container-highest h-1 rounded overflow-hidden">
              <div className="bg-primary-container h-full" style={{ width: '64%' }} />
            </div>
          </div>

          {/* Audit Readiness */}
          <div className="bg-surface-container-low p-space-md rounded flex flex-col justify-between shadow-sm relative overflow-hidden border border-outline-variant/20">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-label-sm text-label-sm uppercase tracking-wide font-mono">Audit Readiness</span>
              <span className="material-symbols-outlined text-[18px] text-tertiary">verified_user</span>
            </div>
            <div className="my-space-sm">
              <div className="font-headline-lg text-headline-lg text-tertiary tracking-tight font-mono">98.4%</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant truncate mt-0.5 font-mono">
                Deterministic cryptographic log
              </div>
            </div>
            <div className="w-full bg-surface-container-highest h-1 rounded overflow-hidden">
              <div className="bg-tertiary h-full" style={{ width: '98.4%' }} />
            </div>
          </div>
        </section>

        {/* AI Executive Risk Briefing Card */}
        <section className="w-full bg-surface-container-high rounded-xl p-space-lg shadow-xl relative overflow-hidden border border-outline-variant/30">
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
            <div className="space-y-space-sm max-w-4xl">
              <div className="flex items-center gap-space-sm">
                <span className="px-space-sm py-0.5 rounded bg-primary/20 text-primary font-label-sm text-label-sm font-bold flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-[14px]">psychology</span>
                  SENTINEL COGNITIVE RAG
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                  Intelligence Briefing • 02 Oct 2026 10:40 UTC
                </span>
              </div>
              <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
                Autonomous monitoring identified <span className="text-error font-semibold">47 active risk signals</span> across 18 accounts. 6 corporate accounts exhibit velocity surges and threshold structuring. Account{' '}
                <button
                  onClick={() => onNavigate('accounts')}
                  className="font-label-md text-label-md bg-surface-container hover:bg-surface-container-highest px-1.5 py-0.5 rounded text-primary font-bold font-mono transition-colors"
                >
                  ACC-10482
                </button>{' '}
                shows <span className="text-on-surface font-semibold underline decoration-error underline-offset-4">8 rapid transfers in 42 minutes</span> exceeding historical baseline by <strong className="text-error font-mono">6.4x</strong>.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md pt-space-xs">
                <div className="bg-surface-container-low p-space-sm rounded">
                  <div className="flex justify-between items-center text-on-surface-variant font-label-sm text-label-sm mb-1 font-mono">
                    <span>Velocity Anomaly</span>
                    <span className="text-error font-bold">42% Spike</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 rounded overflow-hidden">
                    <div className="bg-error h-full rounded" style={{ width: '42%' }} />
                  </div>
                </div>

                <div className="bg-surface-container-low p-space-sm rounded">
                  <div className="flex justify-between items-center text-on-surface-variant font-label-sm text-label-sm mb-1 font-mono">
                    <span>Structuring Sub-10L</span>
                    <span className="text-secondary font-bold">21% Detected</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 rounded overflow-hidden">
                    <div className="bg-secondary h-full rounded" style={{ width: '21%' }} />
                  </div>
                </div>

                <div className="bg-surface-container-low p-space-sm rounded">
                  <div className="flex justify-between items-center text-on-surface-variant font-label-sm text-label-sm mb-1 font-mono">
                    <span>Rapid Fund Dissipation</span>
                    <span className="text-error font-bold">68% Outflow</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 rounded overflow-hidden">
                    <div className="bg-error h-full rounded" style={{ width: '68%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex lg:flex-col gap-space-sm shrink-0">
              <button
                onClick={() => onNavigate('ai-copilot')}
                className="px-space-lg py-space-sm bg-primary-container text-on-primary-container font-headline-sm text-headline-sm rounded flex items-center justify-center gap-space-xs hover:brightness-110 transition-all shadow-md active:scale-95 cursor-pointer font-semibold"
              >
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                Launch Copilot on ACC-10482
              </button>
              <button
                onClick={() => onNavigate('risk-signals')}
                className="px-space-lg py-space-sm bg-surface-container-highest text-on-surface font-body-md text-body-md rounded hover:bg-surface-bright transition-all flex items-center justify-center gap-space-xs cursor-pointer font-medium"
              >
                <span className="material-symbols-outlined text-[18px]">rule_folder</span>
                Review Critical Queue (18)
              </button>
            </div>
          </div>
        </section>

        {/* Two-Column Dashboard Core */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Left Column (8 cols): Live Risk Signals Feed & Risk Vector Decomposition */}
          <div className="lg:col-span-8 flex flex-col gap-space-lg">
            {/* Live Risk Signals Feed Card */}
            <div className="bg-surface-container-low rounded-xl shadow-md overflow-hidden flex flex-col border border-outline-variant/20">
              <div className="p-space-md bg-surface-container flex flex-wrap items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-[20px]">radar</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">Live Risk Signals Feed</span>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono">
                    Real-Time
                  </span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <button
                    onClick={() => setFilterSeverity(filterSeverity === 'all' ? 'critical' : 'all')}
                    className={`font-label-sm text-label-sm px-space-sm py-1 rounded transition-colors font-mono cursor-pointer ${
                      filterSeverity === 'critical'
                        ? 'bg-error text-on-error font-bold'
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-bright'
                    }`}
                  >
                    Filter: {filterSeverity === 'critical' ? 'Critical Only' : 'Critical/High'}
                  </button>
                  <button
                    onClick={() => onShowToast('Export Initiated', '47 Risk Signals exported as signals_ledger_20261002.csv')}
                    className="font-label-sm text-label-sm px-space-sm py-1 rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors font-mono cursor-pointer"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-mono">
                      <th className="py-space-sm px-space-md">Signal Ref</th>
                      <th className="py-space-sm px-space-md">Entity / Account</th>
                      <th className="py-space-sm px-space-md">Triggered Rule</th>
                      <th className="py-space-sm px-space-md text-right">Volume</th>
                      <th className="py-space-sm px-space-md text-center">Evidences</th>
                      <th className="py-space-sm px-space-md">Severity / Score</th>
                      <th className="py-space-sm px-space-md text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-sm text-body-sm text-on-surface divide-y divide-surface-container">
                    {displayedSignals.map((signal) => {
                      const isTarget = signal.accountId === 'ACC-10482';
                      return (
                        <tr
                          key={signal.id}
                          onClick={() => onNavigate('accounts')}
                          className={`hover:bg-surface-container transition-colors group cursor-pointer ${
                            isTarget ? 'bg-error-container/10' : ''
                          }`}
                        >
                          <td className="py-space-sm px-space-md font-label-md text-label-md text-primary font-bold font-mono">
                            {signal.id}
                          </td>
                          <td className="py-space-sm px-space-md">
                            <div className="font-semibold text-on-surface font-mono">{signal.accountId}</div>
                            <div className="text-[11px] text-on-surface-variant">{signal.accountName}</div>
                          </td>
                          <td className="py-space-sm px-space-md">
                            <div className={`font-medium flex items-center gap-1 ${signal.severity === 'CRITICAL' ? 'text-error' : 'text-secondary'}`}>
                              {signal.severity === 'CRITICAL' && (
                                <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
                              )}
                              {signal.triggeredRule}
                            </div>
                            <div className="text-[11px] text-on-surface-variant">{signal.ruleDescription}</div>
                          </td>
                          <td className="py-space-sm px-space-md font-label-md text-label-md text-right font-bold text-on-surface font-mono">
                            ₹{(signal.volume / 100000).toFixed(2)} Lakh
                          </td>
                          <td className="py-space-sm px-space-md text-center">
                            <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold font-mono">
                              {signal.evidenceCount} Proofs
                            </span>
                          </td>
                          <td className="py-space-sm px-space-md">
                            <div className="flex items-center gap-space-xs">
                              <span
                                className={`px-1.5 py-0.5 rounded font-label-sm text-label-sm font-bold font-mono ${
                                  signal.severity === 'CRITICAL' ? 'bg-error/20 text-error' : 'bg-secondary-container/30 text-secondary'
                                }`}
                              >
                                {signal.severity}
                              </span>
                              <span className="font-label-md text-label-md font-bold font-mono">
                                {signal.score}
                              </span>
                            </div>
                          </td>
                          <td className="py-space-sm px-space-md text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigate('ai-copilot');
                              }}
                              className="p-1 rounded hover:bg-surface-container-highest text-primary transition-colors cursor-pointer"
                              title="Investigate with AI Copilot"
                            >
                              <span className="material-symbols-outlined text-[18px]">search_insights</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-space-sm bg-surface-container-lowest flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-t border-outline-variant/20">
                <span className="font-mono">Displaying {displayedSignals.length} priority signals out of 47</span>
                <button
                  onClick={() => onNavigate('risk-signals')}
                  className="text-primary hover:underline flex items-center gap-0.5 font-medium cursor-pointer"
                >
                  View All 47 Alerts
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Risk Vector Trends Chart Widget */}
            <div className="bg-surface-container-low rounded-xl p-space-md shadow-md border border-outline-variant/20">
              <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
                <div>
                  <span className="font-headline-sm text-headline-sm text-on-surface">Risk Vector Decomposition</span>
                  <p className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                    Cross-vector telemetry scoring over 24-hour timeline
                  </p>
                </div>
                <div className="flex items-center gap-space-md font-label-sm text-label-sm font-mono">
                  <span className="flex items-center gap-1 text-error">
                    <span className="w-2.5 h-2.5 bg-error rounded-xs inline-block" /> Velocity
                  </span>
                  <span className="flex items-center gap-1 text-secondary">
                    <span className="w-2.5 h-2.5 bg-secondary-container rounded-xs inline-block" /> Structuring
                  </span>
                  <span className="flex items-center gap-1 text-primary">
                    <span className="w-2.5 h-2.5 bg-primary-container rounded-xs inline-block" /> Behavioral
                  </span>
                  <span className="flex items-center gap-1 text-tertiary">
                    <span className="w-2.5 h-2.5 bg-tertiary rounded-xs inline-block" /> Counterparty
                  </span>
                </div>
              </div>

              {/* Inline Technical SVG Chart */}
              <div className="relative w-full h-48 bg-surface-container-lowest rounded p-space-sm overflow-hidden flex flex-col justify-end border border-outline-variant/10">
                {/* Gridlines */}
                <div className="absolute inset-0 flex flex-col justify-between p-space-sm pointer-events-none opacity-20">
                  <div className="w-full border-b border-outline-variant" />
                  <div className="w-full border-b border-outline-variant" />
                  <div className="w-full border-b border-outline-variant" />
                  <div className="w-full border-b border-outline-variant" />
                </div>

                {/* SVG Curves */}
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 700 160">
                  <defs>
                    <linearGradient id="velocityGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#ffb4ab" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="structGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#0566d9" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#0566d9" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Velocity Area & Line */}
                  <path d="M0,130 Q120,110 200,90 T350,115 T500,40 T620,20 L700,10 L700,160 L0,160 Z" fill="url(#velocityGrad)" />
                  <path d="M0,130 Q120,110 200,90 T350,115 T500,40 T620,20 L700,10" fill="none" stroke="#ffb4ab" strokeWidth="2.5" />
                  {/* Structuring Line */}
                  <path d="M0,140 Q150,120 280,100 T480,90 T600,60 L700,45" fill="none" stroke="#adc6ff" strokeDasharray="4,3" strokeWidth="2" />
                  {/* Behavioral Line */}
                  <path d="M0,150 Q180,145 320,130 T550,110 T640,95 L700,80" fill="none" stroke="#4cd7f6" strokeWidth="2" />
                  {/* Counterparty Line */}
                  <path d="M0,155 Q210,150 400,140 T580,135 L700,120" fill="none" stroke="#4edea3" strokeWidth="1.5" />
                  {/* Anomaly Pin at T620 (ACC-10482 event) */}
                  <circle className="animate-ping" cx="620" cy="20" fill="#ffb4ab" r="5" />
                  <circle cx="620" cy="20" fill="#ffb4ab" r="4" />
                </svg>

                {/* Bottom Time Axis */}
                <div className="flex justify-between items-center text-on-surface-variant font-label-sm text-label-sm pt-1 font-mono">
                  <span>00:00</span>
                  <span>04:00</span>
                  <span>08:00</span>
                  <span>12:00</span>
                  <span>16:00</span>
                  <span>20:00</span>
                  <span className="text-error font-bold">10:42 UTC (Velocity Spike)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Top Risky Accounts & Regulatory Engine & Scenario Runner */}
          <div className="lg:col-span-4 flex flex-col gap-space-lg">
            {/* Top Risky Accounts Card */}
            <div className="bg-surface-container-low rounded-xl p-space-md shadow-md flex flex-col border border-outline-variant/20">
              <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-outline-variant/20">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-error text-[20px]">security</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">Top Risky Accounts</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">Ranked 1-3</span>
              </div>

              <div className="space-y-space-md">
                {/* Account 1: ACC-10482 */}
                <div
                  onClick={() => onNavigate('accounts')}
                  className="bg-surface-container p-space-md rounded-lg flex flex-col gap-space-sm hover:bg-surface-container-high transition-colors cursor-pointer border border-error/30"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-mono font-bold">ACC-10482</span>
                        <span className="px-1.5 py-0.5 rounded bg-error/20 text-error font-label-sm text-label-sm font-bold font-mono">
                          CRITICAL
                        </span>
                      </div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">Alpha Corp Ltd • Corp Current</div>
                    </div>
                    {/* Mini Dial / Score Badge */}
                    <div className="w-12 h-12 rounded-full bg-error-container/40 flex flex-col items-center justify-center text-error border border-error/40">
                      <span className="font-code-metric text-code-metric leading-none text-error font-mono font-bold">92</span>
                      <span className="text-[9px] font-label-sm font-bold uppercase font-mono">Risk</span>
                    </div>
                  </div>
                  {/* Segmented Risk Meter Bar */}
                  <div className="flex items-center gap-1 w-full py-0.5">
                    <div className="h-1.5 flex-1 rounded-xs bg-tertiary" />
                    <div className="h-1.5 flex-1 rounded-xs bg-secondary" />
                    <div className="h-1.5 flex-1 rounded-xs bg-error" />
                    <div className="h-1.5 flex-1 rounded-xs bg-error" />
                    <div className="h-1.5 flex-1 rounded-xs bg-error animate-pulse" />
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm font-mono">
                    <span>Exposure: <strong className="text-on-surface">₹4.8 Cr</strong></span>
                    <span className="text-error font-semibold">8 Spikes in 42m</span>
                  </div>
                </div>

                {/* Account 2: ACC-09144 */}
                <div
                  onClick={() => onNavigate('accounts')}
                  className="bg-surface-container p-space-md rounded-lg flex flex-col gap-space-sm hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-mono font-bold">ACC-09144</span>
                        <span className="px-1.5 py-0.5 rounded bg-error/20 text-error font-label-sm text-label-sm font-bold font-mono">
                          CRITICAL
                        </span>
                      </div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">V-Fin Global • Escrow Pool</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-error-container/40 flex flex-col items-center justify-center text-error border border-error/40">
                      <span className="font-code-metric text-code-metric leading-none text-error font-mono font-bold">91</span>
                      <span className="text-[9px] font-label-sm font-bold uppercase font-mono">Risk</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 w-full py-0.5">
                    <div className="h-1.5 flex-1 rounded-xs bg-tertiary" />
                    <div className="h-1.5 flex-1 rounded-xs bg-secondary" />
                    <div className="h-1.5 flex-1 rounded-xs bg-error" />
                    <div className="h-1.5 flex-1 rounded-xs bg-error" />
                    <div className="h-1.5 flex-1 rounded-xs bg-surface-container-highest" />
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm font-mono">
                    <span>Exposure: <strong className="text-on-surface">₹2.1 Cr</strong></span>
                    <span className="text-secondary font-semibold">Sub-10L Smurfing</span>
                  </div>
                </div>

                {/* Account 3: ACC-11029 */}
                <div
                  onClick={() => onNavigate('accounts')}
                  className="bg-surface-container p-space-md rounded-lg flex flex-col gap-space-sm hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-mono font-bold">ACC-11029</span>
                        <span className="px-1.5 py-0.5 rounded bg-secondary-container/30 text-secondary font-label-sm text-label-sm font-bold font-mono">
                          HIGH
                        </span>
                      </div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">Zenith Tech Soft • Treasury</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex flex-col items-center justify-center text-secondary border border-secondary/40">
                      <span className="font-code-metric text-code-metric leading-none text-secondary font-mono font-bold">78</span>
                      <span className="text-[9px] font-label-sm font-bold uppercase font-mono">Risk</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 w-full py-0.5">
                    <div className="h-1.5 flex-1 rounded-xs bg-tertiary" />
                    <div className="h-1.5 flex-1 rounded-xs bg-secondary" />
                    <div className="h-1.5 flex-1 rounded-xs bg-secondary" />
                    <div className="h-1.5 flex-1 rounded-xs bg-surface-container-highest" />
                    <div className="h-1.5 flex-1 rounded-xs bg-surface-container-highest" />
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm font-mono">
                    <span>Exposure: <strong className="text-on-surface">₹85.0 L</strong></span>
                    <span className="text-secondary font-semibold">Corridor Anomaly</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Regulatory Engine Status Widget */}
            <div className="bg-surface-container-low rounded-xl p-space-md shadow-md flex flex-col border border-outline-variant/20">
              <div className="flex items-center justify-between mb-space-sm">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-tertiary text-[20px]">policy</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">Regulatory Engine Status</span>
                </div>
                <span className="font-label-sm text-label-sm text-tertiary font-bold font-mono">SYNC 100%</span>
              </div>
              <div className="space-y-space-sm">
                <div
                  onClick={() => onNavigate('regulatory-intelligence')}
                  className="p-space-sm bg-surface-container hover:bg-surface-container-high rounded-lg flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div>
                    <div className="font-body-md text-body-md text-on-surface font-semibold">AML-04 Section 4.2</div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant">Structuring &amp; Velocity limits</div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-md text-label-md text-error font-bold font-mono">14 Triggers</span>
                    <div className="text-[10px] text-on-surface-variant font-mono">FIU-IND aligned</div>
                  </div>
                </div>

                <div
                  onClick={() => onNavigate('regulatory-intelligence')}
                  className="p-space-sm bg-surface-container hover:bg-surface-container-high rounded-lg flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div>
                    <div className="font-body-md text-body-md text-on-surface font-semibold">KYC Para 8.1 EDD</div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant">Enhanced Due Diligence checks</div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-md text-label-md text-secondary font-bold font-mono">6 Triggers</span>
                    <div className="text-[10px] text-on-surface-variant font-mono">UBO missing</div>
                  </div>
                </div>

                <div
                  onClick={() => onNavigate('regulatory-intelligence')}
                  className="p-space-sm bg-surface-container hover:bg-surface-container-high rounded-lg flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div>
                    <div className="font-body-md text-body-md text-on-surface font-semibold">Basel III Sanctions &amp; High-Risk</div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant">FATF grey-list counterparty screening</div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-md text-label-md text-primary font-bold font-mono">4 Triggers</span>
                    <div className="text-[10px] text-on-surface-variant font-mono">OFAC / EU List</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scenario Test Runner (Hackathon Simulation Card) */}
            <div className="bg-gradient-to-br from-surface-container-high to-surface-container-low p-space-md rounded-xl shadow-xl flex flex-col gap-space-sm relative overflow-hidden border border-primary/30">
              <div className="flex items-center gap-space-xs text-primary">
                <span className="material-symbols-outlined text-[18px]">terminal</span>
                <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider font-mono">
                  Scenario Test Runner
                </span>
              </div>
              <div className="text-on-surface font-headline-sm text-headline-sm">
                Simulate ACC-10482 Attack Vector
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Inject synthetic multi-hop structuring payload (₹18.4L in 42m) to inspect instant graph expansion, evidence hashing, and automated SAR drafting.
              </p>
              
              {simulationStatus && (
                <div className="p-2 rounded bg-surface-container font-mono text-label-sm text-tertiary border border-tertiary/20 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">info</span>
                  <span>{simulationStatus}</span>
                </div>
              )}

              <button
                disabled={isSimulating}
                onClick={handleRunSimulation}
                className="mt-space-xs w-full py-2.5 bg-primary text-on-primary font-headline-sm text-headline-sm rounded-lg flex items-center justify-center gap-space-xs hover:brightness-110 active:scale-98 transition-all font-semibold cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                    <span>Pipeline Ingesting...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">play_circle</span>
                    <span>Execute ACC-10482 Pipeline</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
