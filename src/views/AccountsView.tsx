import React, { useState } from 'react';
import { MOCK_TRANSACTIONS, PRIMARY_ACCOUNT } from '../data/mockData';
import { ViewMode } from '../types';

interface AccountsViewProps {
  onNavigate: (view: ViewMode) => void;
  onOpenFindingModal: () => void;
  onShowToast: (title: string, msg: string, icon?: string) => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  onNavigate,
  onOpenFindingModal,
  onShowToast,
}) => {
  const [activeLedgerTab, setActiveLedgerTab] = useState<'flagged' | 'all' | 'counterparties'>('flagged');
  const [isFrozen, setIsFrozen] = useState(false);

  const handleFreezeToggle = () => {
    setIsFrozen(!isFrozen);
    if (!isFrozen) {
      onShowToast('Gateways Frozen', 'Emergency debit freeze placed on ACC-10482 outward gateways.', 'gavel');
    } else {
      onShowToast('Freeze Lifted', 'Debit freeze lifted on ACC-10482 with supervisory sign-off.', 'check_circle');
    }
  };

  const displayedTransactions = activeLedgerTab === 'flagged'
    ? MOCK_TRANSACTIONS.filter((t) => t.status === 'Flagged')
    : MOCK_TRANSACTIONS;

  return (
    <div className="flex flex-col w-full px-space-lg py-space-md gap-space-lg text-on-surface">
      {/* TOP BREADCRUMB, STATUS TELEMETRY & ACTIONS */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md pb-space-sm bg-surface-container-low/40 p-space-md rounded-xl border border-outline-variant/20">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant font-mono">
            <button onClick={() => onNavigate('overview')} className="hover:text-primary transition-colors cursor-pointer">
              Accounts
            </button>
            <span className="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
            <span className="text-secondary font-semibold">ACC-10482</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface">Entity Intelligence Profile</span>
          </div>
          <div className="flex flex-wrap items-center gap-space-xs mt-0.5 font-mono">
            <span className={`inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded font-label-sm text-label-sm font-semibold tracking-wider ${
              isFrozen ? 'bg-error text-on-error' : 'bg-error/15 text-error'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
              {isFrozen ? 'GATEWAY DEBIT-FROZEN' : 'STATUS: ENHANCED DUE DILIGENCE (EDD)'}
            </span>
            <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[13px] text-primary">schedule</span>
              LAST EVAL: 10:48 IST (2m ago)
            </span>
            <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-tertiary/15 text-tertiary font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[13px]">dataset</span>
              DATASET: SYNTHETIC DEMO
            </span>
            <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[12px] text-tertiary">lock</span>
              PROOF: SHA-256 #8f90c4e1
            </span>
          </div>
        </div>

        {/* Top Action CTA Buttons */}
        <div className="flex flex-wrap items-center gap-space-xs font-mono">
          <button
            onClick={() => onNavigate('ai-copilot')}
            className="h-8 px-space-md rounded bg-primary-container text-on-primary-container font-label-sm text-label-sm font-semibold flex items-center gap-1.5 hover:brightness-110 shadow-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">smart_toy</span>
            Launch Copilot on ACC-10482
          </button>
          <button
            onClick={onOpenFindingModal}
            className="h-8 px-space-sm rounded bg-surface-container-high text-on-surface hover:bg-surface-bright font-label-sm text-label-sm flex items-center gap-1.5 transition-colors cursor-pointer border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">note_add</span>
            Create Finding
          </button>
          <button
            onClick={handleFreezeToggle}
            className={`h-8 px-space-sm rounded font-label-sm text-label-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isFrozen
                ? 'bg-tertiary-container text-on-tertiary-container hover:brightness-110'
                : 'bg-error-container text-on-error-container hover:brightness-125'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">gavel</span>
            {isFrozen ? 'Lift Outbound Freeze' : 'Freeze Outbound Gateways'}
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="h-8 px-space-sm rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm flex items-center gap-1 transition-colors cursor-pointer border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-[15px]">file_download</span>
            Export Dossier
          </button>
        </div>
      </div>

      {/* ENTITY IDENTITY HEADER & 5 CORE TELEMETRY METRIC TILES */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md">
        {/* Entity Master Card (4 cols) */}
        <div className="xl:col-span-4 bg-surface-container rounded-xl p-space-lg flex flex-col justify-between shadow-lg relative overflow-hidden border border-outline-variant/30">
          <div className="absolute -right-12 -top-12 w-44 h-44 bg-error/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-space-md">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">
                    {PRIMARY_ACCOUNT.name}
                  </span>
                  <span className="material-symbols-outlined text-tertiary text-[20px]" title="Corporate Registry Verified">
                    verified
                  </span>
                </div>
                <div className="font-label-md text-label-md text-primary mt-0.5 font-mono">
                  LEI: {PRIMARY_ACCOUNT.lei} • CIN: {PRIMARY_ACCOUNT.cin}
                </div>
              </div>
              <span className="px-space-xs py-0.5 rounded bg-error/20 text-error font-label-sm text-label-sm font-bold font-mono">
                SEV 1 BREACH
              </span>
            </div>

            <div className="grid grid-cols-2 gap-space-xs text-body-sm font-body-sm pt-space-xs">
              <div className="bg-surface-container-low p-space-xs rounded border border-outline-variant/10">
                <span className="font-label-sm text-label-sm text-on-surface-variant block font-mono">Account Identifier</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold font-mono">
                  {PRIMARY_ACCOUNT.id} ({PRIMARY_ACCOUNT.type})
                </span>
              </div>
              <div className="bg-surface-container-low p-space-xs rounded border border-outline-variant/10">
                <span className="font-label-sm text-label-sm text-on-surface-variant block font-mono">Customer Classification</span>
                <span className="font-body-sm text-body-sm text-on-surface font-medium truncate block">
                  {PRIMARY_ACCOUNT.classification}
                </span>
              </div>
              <div className="bg-surface-container-low p-space-xs rounded border border-outline-variant/10">
                <span className="font-label-sm text-label-sm text-on-surface-variant block font-mono">Corridor Network</span>
                <span className="font-label-md text-label-md text-secondary font-medium font-mono">
                  {PRIMARY_ACCOUNT.corridor}
                </span>
              </div>
              <div className="bg-surface-container-low p-space-xs rounded border border-outline-variant/10">
                <span className="font-label-sm text-label-sm text-on-surface-variant block font-mono">Incorporated &amp; Age</span>
                <span className="font-body-sm text-body-sm text-on-surface">{PRIMARY_ACCOUNT.age}</span>
              </div>
              <div className="bg-surface-container-low p-space-xs rounded border border-outline-variant/10">
                <span className="font-label-sm text-label-sm text-on-surface-variant block font-mono">Primary Branch</span>
                <span className="font-body-sm text-body-sm text-on-surface truncate block">{PRIMARY_ACCOUNT.branch}</span>
              </div>
              <div className="bg-surface-container-low p-space-xs rounded border border-outline-variant/10">
                <span className="font-label-sm text-label-sm text-on-surface-variant block font-mono">Lead AML Officer</span>
                <span className="font-body-sm text-body-sm text-primary font-mono truncate block">
                  {PRIMARY_ACCOUNT.leadOfficer}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-space-md pt-space-sm flex items-center justify-between bg-surface-container-lowest/80 px-space-md py-space-xs rounded border border-outline-variant/10">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">Last Audited by Engine</span>
            <span className="font-label-sm text-label-sm text-tertiary font-mono">10:48:11 IST • Cycle #9842</span>
          </div>
        </div>

        {/* Core Metrics Grid of 5 Cards (8 cols) */}
        <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-sm">
          {/* Metric 1: Overall Risk Score */}
          <div className="bg-surface-container rounded-xl p-space-md flex flex-col justify-between shadow-md relative overflow-hidden border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-mono">
                Overall Risk Score
              </span>
              <span className="px-space-xs py-0.5 rounded bg-error/20 text-error font-label-sm text-label-sm font-bold font-mono">
                CRITICAL
              </span>
            </div>
            <div className="my-space-xs flex items-baseline gap-space-xs font-mono">
              <span className="font-code-metric text-[34px] leading-none text-error font-bold tracking-tight">92</span>
              <span className="font-label-md text-label-md text-on-surface-variant">/ 100</span>
              <span className="ml-auto font-label-sm text-label-sm text-error flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +48pts
              </span>
            </div>
            {/* Segmented Risk Meter */}
            <div className="w-full">
              <div className="grid grid-cols-10 gap-1 h-1.5 w-full my-1">
                <div className="bg-tertiary rounded-xs" />
                <div className="bg-tertiary rounded-xs" />
                <div className="bg-tertiary rounded-xs" />
                <div className="bg-secondary rounded-xs" />
                <div className="bg-secondary rounded-xs" />
                <div className="bg-error/60 rounded-xs" />
                <div className="bg-error/80 rounded-xs" />
                <div className="bg-error rounded-xs" />
                <div className="bg-error rounded-xs shadow-[0_0_8px_rgba(255,180,171,0.5)]" />
                <div className="bg-surface-container-highest rounded-xs" />
              </div>
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant text-[9px] mt-0.5 font-mono">
                <span>Low (0)</span>
                <span>Triggered: Structuring</span>
                <span>Severe (100)</span>
              </div>
            </div>
          </div>

          {/* Metric 2: Total 90-Day Volume */}
          <div className="bg-surface-container rounded-xl p-space-md flex flex-col justify-between shadow-md border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-mono">
                Total 90D Volume
              </span>
              <span className="material-symbols-outlined text-secondary text-[18px]">account_balance_wallet</span>
            </div>
            <div className="my-space-xs font-mono">
              <div className="font-code-metric text-[26px] leading-tight text-on-surface font-bold">
                {PRIMARY_ACCOUNT.total90dVolume}
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Across 1,842 total cleared tx</span>
            </div>
            <div className="bg-surface-container-low px-space-xs py-1 rounded flex items-center justify-between border border-outline-variant/10 font-mono">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Daily Avg Run-rate</span>
              <span className="font-label-sm text-label-sm text-on-surface">₹5.38 L / day</span>
            </div>
          </div>

          {/* Metric 3: Flagged High-Risk Volume */}
          <div className="bg-surface-container rounded-xl p-space-md flex flex-col justify-between shadow-md relative overflow-hidden border border-error/30">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-error uppercase tracking-wider font-semibold font-mono">
                Flagged Anomalous
              </span>
              <span className="material-symbols-outlined text-error text-[18px]">report</span>
            </div>
            <div className="my-space-xs font-mono">
              <div className="font-code-metric text-[26px] leading-tight text-error font-bold">
                {PRIMARY_ACCOUNT.flaggedVolume}
              </div>
              <span className="font-label-sm text-label-sm text-error/90">17 high-risk flagged transactions</span>
            </div>
            <div className="bg-error/10 px-space-xs py-1 rounded flex items-center justify-between font-mono">
              <span className="font-label-sm text-label-sm text-error font-medium">38.0% of Total Volume</span>
              <span className="font-label-sm text-label-sm text-error font-bold">CRITICAL SPIKE</span>
            </div>
          </div>

          {/* Metric 4: Outflow Dwell Time */}
          <div className="bg-surface-container rounded-xl p-space-md flex flex-col justify-between shadow-md border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-mono">
                Outflow Dwell Time
              </span>
              <span className="material-symbols-outlined text-primary text-[18px]">speed</span>
            </div>
            <div className="my-space-xs font-mono">
              <div className="font-code-metric text-[26px] leading-tight text-primary font-bold">
                {PRIMARY_ACCOUNT.dwellTime}
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">98th percentile rapid pass-through</span>
            </div>
            <div className="bg-surface-container-low px-space-xs py-1 rounded flex items-center justify-between border border-outline-variant/10 font-mono">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Normal Baseline</span>
              <span className="font-label-sm text-label-sm text-tertiary">{PRIMARY_ACCOUNT.baselineDwell}</span>
            </div>
          </div>

          {/* Metric 5: Active Risk Triggers */}
          <div className="bg-surface-container rounded-xl p-space-md flex flex-col justify-between shadow-md sm:col-span-2 lg:col-span-2 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-mono">
                Active Risk Engine Triggers
              </span>
              <span className="font-label-sm text-label-sm text-error font-mono font-bold">
                4 Active Rules Violations
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs my-space-xs font-mono">
              <div className="bg-surface-container-low p-space-xs rounded flex flex-col border border-outline-variant/10">
                <span className="font-label-sm text-label-sm text-error font-bold">RULE-002</span>
                <span className="font-body-sm text-[11px] text-on-surface-variant truncate">Velocity Burst</span>
              </div>
              <div className="bg-surface-container-low p-space-xs rounded flex flex-col border border-outline-variant/10">
                <span className="font-label-sm text-label-sm text-error font-bold">RULE-003</span>
                <span className="font-body-sm text-[11px] text-on-surface-variant truncate">Sub-10L Smurfing</span>
              </div>
              <div className="bg-surface-container-low p-space-xs rounded flex flex-col border border-outline-variant/10">
                <span className="font-label-sm text-label-sm text-secondary font-bold">RULE-004</span>
                <span className="font-body-sm text-[11px] text-on-surface-variant truncate">Pass-through Dissip.</span>
              </div>
              <div className="bg-surface-container-low p-space-xs rounded flex flex-col border border-outline-variant/10">
                <span className="font-label-sm text-label-sm text-tertiary font-bold">RULE-006</span>
                <span className="font-body-sm text-[11px] text-on-surface-variant truncate">Offshore Shell FZ</span>
              </div>
            </div>
            <div className="bg-surface-container-high px-space-xs py-1 rounded flex items-center justify-between border border-outline-variant/10">
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">Recommended Action</span>
              <span className="font-label-sm text-label-sm text-error font-bold flex items-center gap-1 font-mono">
                <span className="material-symbols-outlined text-[13px]">notification_important</span>
                Immediate SAR Escalation Required
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RISK SCORE DECOMPOSITION & AI BEHAVIORAL BASELINE SYNTHESIS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        {/* Left: Score Decomposition (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container rounded-xl p-space-lg shadow-md flex flex-col justify-between border border-outline-variant/20">
          <div>
            <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-outline-variant/15">
              <div>
                <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">Risk Score Decomposition</h3>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                  Weighted contributions to aggregated 92/100 index
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-primary bg-primary/10 px-2 py-0.5 rounded font-mono">
                MODEL V4.8
              </span>
            </div>

            {/* Stacked visual bar */}
            <div className="h-3 w-full rounded flex overflow-hidden gap-0.5 my-space-sm bg-surface-container-lowest p-0.5">
              <div className="bg-error h-full rounded-xs" style={{ width: '24%' }} title="Structuring: 22pts" />
              <div className="bg-error-container h-full rounded-xs" style={{ width: '21%' }} title="Velocity Spike: 19pts" />
              <div className="bg-secondary-container h-full rounded-xs" style={{ width: '20%' }} title="Baseline Deviation: 18pts" />
              <div className="bg-secondary h-full rounded-xs" style={{ width: '14%' }} title="Regulatory: 13pts" />
              <div className="bg-primary h-full rounded-xs" style={{ width: '13%' }} title="Counterparty: 12pts" />
              <div className="bg-tertiary h-full rounded-xs" style={{ width: '8%' }} title="Corridor: 8pts" />
            </div>

            {/* Itemized decomposition list */}
            <div className="space-y-space-xs mt-space-md font-mono">
              <div className="flex items-center justify-between p-space-xs bg-surface-container-low rounded border border-outline-variant/10">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-error" />
                  <span className="font-body-sm text-body-sm text-on-surface font-sans">
                    Transaction Structuring (Sub-10L evasion)
                  </span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-md text-label-md text-error font-bold">22 pts</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant text-[10px]">WEIGHT 24%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-space-xs bg-surface-container-low rounded border border-outline-variant/10">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-error-container" />
                  <span className="font-body-sm text-body-sm text-on-surface font-sans">
                    Burst Velocity Spike (&gt;8 tx/hr)
                  </span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-md text-label-md text-error font-bold">19 pts</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant text-[10px]">WEIGHT 21%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-space-xs bg-surface-container-low rounded border border-outline-variant/10">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
                  <span className="font-body-sm text-body-sm text-on-surface font-sans">
                    Behavioral Baseline Shift (+24x ticket)
                  </span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-md text-label-md text-secondary font-bold">18 pts</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant text-[10px]">WEIGHT 20%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-space-xs bg-surface-container-low rounded border border-outline-variant/10">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                  <span className="font-body-sm text-body-sm text-on-surface font-sans">
                    Regulatory AML-04 Sec 4.2 Breach
                  </span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-md text-label-md text-secondary font-bold">13 pts</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant text-[10px]">WEIGHT 14%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-space-xs bg-surface-container-low rounded border border-outline-variant/10">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="font-body-sm text-body-sm text-on-surface font-sans">
                    Counterparty Risk (Apex Global FZ)
                  </span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-md text-label-md text-primary font-bold">12 pts</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant text-[10px]">WEIGHT 13%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-space-xs bg-surface-container-low rounded border border-outline-variant/10">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                  <span className="font-body-sm text-body-sm text-on-surface font-sans">
                    Geographic Corridor Anomaly (SG Offshore)
                  </span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-md text-label-md text-tertiary font-bold">8 pts</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant text-[10px]">WEIGHT 8%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-space-sm mt-space-sm flex items-center justify-between text-on-surface-variant text-[11px] font-label-sm font-mono border-t border-outline-variant/15">
            <span>Deterministic Sum: 92/100</span>
            <span className="text-tertiary">Entropy Score: 0.04 (High Confidence)</span>
          </div>
        </div>

        {/* Right: AI Behavioral Baseline Comparison & Cognitive Synthesis (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container rounded-xl p-space-lg shadow-md flex flex-col justify-between relative overflow-hidden border border-outline-variant/20">
          <div>
            {/* AI synthesis badge */}
            <div className="flex items-center justify-between bg-primary/10 p-space-xs rounded mb-space-sm border border-primary/20">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">neurology</span>
                <span className="font-label-sm text-label-sm text-primary font-bold tracking-wide font-mono">
                  AI COGNITIVE INTELLIGENCE SYNTHESIS • GEMINI ENGINE V4.8
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-tertiary bg-surface-container px-2 py-0.5 rounded font-mono font-semibold">
                99.4% Match
              </span>
            </div>

            {/* Synthesis Narrative */}
            <p className="font-body-md text-body-md text-on-surface leading-relaxed mb-space-md">
              This corporate account exhibits an extreme <span className="text-error font-bold font-mono">+820% volume velocity surge</span> and rapid dissipation in the last 42 minutes. Historical 90-day baseline average ticket size is ₹40,000–₹1,20,000 with typical 72h fund dwell time. In the past 42 minutes, 8 rapid transfers totaling <span className="text-primary font-bold font-mono">₹18.4L</span> (including <span className="font-mono text-secondary">TX-9281</span> at ₹9.80L and <span className="font-mono text-secondary">TX-9287</span> at ₹9.70L) were immediately wired to unverified offshore recipient <span className="text-error font-semibold">Apex Global FZ</span> in Singapore, deliberately evading the ₹10,00,000 CTR statutory reporting threshold.
            </p>

            {/* 3-way Baseline Comparison Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs font-mono">
              {/* Ticket Size Deviation */}
              <div className="bg-surface-container-low p-space-sm rounded border border-outline-variant/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Ticket Size</span>
                  <span className="font-label-sm text-label-sm text-error font-bold font-mono">+24.3x</span>
                </div>
                <div className="text-body-sm text-on-surface-variant font-mono">
                  Base: <span className="text-on-surface font-semibold">₹40,000</span>
                </div>
                <div className="text-body-sm text-on-surface font-mono">
                  Recent: <span className="text-error font-bold">₹9,75,000</span>
                </div>
                <div className="mt-2 h-1 w-full bg-surface-container-highest rounded overflow-hidden">
                  <div className="h-full bg-error" style={{ width: '96%' }} />
                </div>
              </div>

              {/* Velocity Surge */}
              <div className="bg-surface-container-low p-space-sm rounded border border-outline-variant/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Velocity Rate</span>
                  <span className="font-label-sm text-label-sm text-error font-bold font-mono">+480x</span>
                </div>
                <div className="text-body-sm text-on-surface-variant font-mono">
                  Base: <span className="text-on-surface font-semibold">1.2 tx / day</span>
                </div>
                <div className="text-body-sm text-on-surface font-mono">
                  Burst: <span className="text-error font-bold">8 tx / 42 min</span>
                </div>
                <div className="mt-2 h-1 w-full bg-surface-container-highest rounded overflow-hidden">
                  <div className="h-full bg-error" style={{ width: '100%' }} />
                </div>
              </div>

              {/* Dwell Collapse */}
              <div className="bg-surface-container-low p-space-sm rounded border border-outline-variant/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Retention Dwell</span>
                  <span className="font-label-sm text-label-sm text-error font-bold font-mono">-99.9%</span>
                </div>
                <div className="text-body-sm text-on-surface-variant font-mono">
                  Base: <span className="text-on-surface font-semibold">72.0 Hours</span>
                </div>
                <div className="text-body-sm text-on-surface font-mono">
                  Recent: <span className="text-error font-bold">2.8 Mins</span>
                </div>
                <div className="mt-2 h-1 w-full bg-surface-container-highest rounded overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '4%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-space-md pt-space-xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-t border-outline-variant/15">
            <span className="flex items-center gap-1 font-mono">
              <span className="material-symbols-outlined text-primary text-[15px]">auto_fix_high</span>
              Pattern Match: Smurfing &amp; Immediate Pass-through Dissipation
            </span>
            <button
              onClick={() => onNavigate('ai-copilot')}
              className="text-primary hover:underline flex items-center gap-0.5 cursor-pointer font-mono"
            >
              View Explainability Weights →
            </button>
          </div>
        </div>
      </div>

      {/* VISUAL ANALYTICS & CORRIDOR FLOW TELEMETRY SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        {/* Left Column: Timeline & Telemetry Burst SVG Chart (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container rounded-xl p-space-lg shadow-md flex flex-col justify-between border border-outline-variant/20">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-space-xs mb-space-sm">
              <div>
                <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">Timeline &amp; Telemetry Burst</h3>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                  Baseline flatline vs Anomaly Window (10:00 - 10:48 IST)
                </span>
              </div>
              <div className="flex items-center gap-space-sm font-mono">
                <div className="flex items-center gap-1 text-[11px] font-label-sm text-tertiary">
                  <span className="w-2 h-2 rounded-full bg-tertiary" /> Inflow: ₹19.50L
                </div>
                <div className="flex items-center gap-1 text-[11px] font-label-sm text-error">
                  <span className="w-2 h-2 rounded-full bg-error" /> Outflow: ₹18.40L (94%)
                </div>
              </div>
            </div>

            {/* Inline SVG Chart */}
            <div className="w-full bg-surface-container-lowest rounded-lg p-space-sm my-space-xs border border-outline-variant/10">
              <svg className="w-full h-44" fill="none" viewBox="0 0 680 180" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="inflowGrad2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4edea3" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#4edea3" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="outflowGrad2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#ffb4ab" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal grid lines */}
                <line stroke="#222a3d" strokeDasharray="3 3" x1="40" x2="660" y1="20" y2="20" />
                <line stroke="#222a3d" strokeDasharray="3 3" x1="40" x2="660" y1="65" y2="65" />
                <line stroke="#222a3d" strokeDasharray="3 3" x1="40" x2="660" y1="110" y2="110" />
                <line stroke="#2d3449" x1="40" x2="660" y1="150" y2="150" />
                {/* Y Axis labels */}
                <text fill="#869397" fontFamily="JetBrains Mono" fontSize="9" textAnchor="end" x="32" y="24">₹10L</text>
                <text fill="#869397" fontFamily="JetBrains Mono" fontSize="9" textAnchor="end" x="32" y="69">₹5L</text>
                <text fill="#869397" fontFamily="JetBrains Mono" fontSize="9" textAnchor="end" x="32" y="114">₹1L</text>
                <text fill="#869397" fontFamily="JetBrains Mono" fontSize="9" textAnchor="end" x="32" y="153">₹0</text>
                {/* CTR Threshold line */}
                <line stroke="#ffb4ab" strokeDasharray="4 2" strokeWidth="1.5" x1="40" x2="660" y1="20" y2="20" />
                <text fill="#ffb4ab" fontFamily="JetBrains Mono" fontSize="9" fontWeight="bold" textAnchor="end" x="655" y="15">
                  CTR ₹10,00,000 THRESHOLD
                </text>
                {/* Pre-burst normal baseline */}
                <path d="M 40 144 Q 100 142 160 145 T 280 143 T 400 144" fill="none" opacity="0.6" stroke="#4cd7f6" strokeWidth="1.5" />
                {/* Inflow Path */}
                <path d="M 400 144 L 430 140 L 450 35 L 480 30 L 510 135 L 530 140 L 660 148 L 660 150 L 400 150 Z" fill="url(#inflowGrad2)" />
                <path d="M 400 144 L 430 140 L 450 35 L 480 30 L 510 135 L 530 140 L 660 148" stroke="#4edea3" strokeLinecap="round" strokeWidth="2.5" />
                {/* Outflow Burst Path */}
                <path d="M 420 148 L 445 145 L 460 38 L 490 32 L 520 40 L 550 42 L 580 44 L 620 50 L 650 145 L 650 150 L 420 150 Z" fill="url(#outflowGrad2)" />
                <path d="M 420 148 L 445 145 L 460 38 L 490 32 L 520 40 L 550 42 L 580 44 L 620 50 L 650 145" stroke="#ffb4ab" strokeLinecap="round" strokeWidth="2.5" />
                {/* Burst Points */}
                <circle cx="460" cy="38" fill="#ffb4ab" r="4" stroke="#0b1326" strokeWidth="1.5" />
                <circle cx="490" cy="32" fill="#ffb4ab" r="4" stroke="#0b1326" strokeWidth="1.5" />
                <circle cx="520" cy="40" fill="#ffb4ab" r="4" stroke="#0b1326" strokeWidth="1.5" />
                <circle cx="550" cy="42" fill="#ffb4ab" r="4" stroke="#0b1326" strokeWidth="1.5" />
                <circle cx="580" cy="44" fill="#ffb4ab" r="4" stroke="#0b1326" strokeWidth="1.5" />
                {/* Annotation Box */}
                <rect fill="#171f33" height="20" opacity="0.9" rx="3" stroke="#ffb4ab" strokeWidth="0.8" width="160" x="440" y="58" />
                <text fill="#ffb4ab" fontFamily="JetBrains Mono" fontSize="9" fontWeight="600" textAnchor="middle" x="520" y="72">
                  8x Transfers ~₹9.8L Evading CTR
                </text>
                {/* X Axis */}
                <text fill="#869397" fontFamily="JetBrains Mono" fontSize="9" x="60" y="167">08:00</text>
                <text fill="#869397" fontFamily="JetBrains Mono" fontSize="9" x="180" y="167">09:00</text>
                <text fill="#869397" fontFamily="JetBrains Mono" fontSize="9" x="300" y="167">09:45</text>
                <text fill="#4cd7f6" fontFamily="JetBrains Mono" fontSize="9" fontWeight="bold" x="440" y="167">10:15 (Burst Start)</text>
                <text fill="#ffb4ab" fontFamily="JetBrains Mono" fontSize="9" fontWeight="bold" x="570" y="167">10:48 (Now)</text>
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-space-xs mt-space-sm pt-space-xs text-center font-label-sm text-label-sm font-mono">
              <div className="bg-surface-container-low p-space-xs rounded border border-outline-variant/10">
                <span className="text-on-surface-variant block text-[10px]">Pass-through Dissipation</span>
                <span className="text-error font-bold">94.3% in 42m</span>
              </div>
              <div className="bg-surface-container-low p-space-xs rounded border border-outline-variant/10">
                <span className="text-on-surface-variant block text-[10px]">Net Retained Balance</span>
                <span className="text-secondary font-bold">₹1.10 L</span>
              </div>
              <div className="bg-surface-container-low p-space-xs rounded border border-outline-variant/10">
                <span className="text-on-surface-variant block text-[10px]">Structuring Margin</span>
                <span className="text-error font-bold">1.2% - 2.8% Sub-10L</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Counterparty & Jurisdiction Exposure Network (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container rounded-xl p-space-lg shadow-md flex flex-col justify-between border border-outline-variant/20">
          <div>
            <div className="flex items-center justify-between pb-space-xs mb-space-xs">
              <div>
                <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">Corridor &amp; Exposure Flow</h3>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                  Geographic settlement routes &amp; Shell indicators
                </span>
              </div>
              <span className="material-symbols-outlined text-secondary text-[20px]">hub</span>
            </div>

            {/* Geographic Corridor Bars */}
            <div className="space-y-space-xs my-space-sm font-mono">
              <div>
                <div className="flex justify-between font-label-sm text-label-sm mb-0.5">
                  <span className="text-on-surface flex items-center gap-1 font-sans">
                    <span className="w-2 h-2 rounded-full bg-secondary" /> India (Domestic Cleared Hub)
                  </span>
                  <span className="text-on-surface">₹4.84 Cr (Origin)</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-lowest rounded overflow-hidden">
                  <div className="h-full bg-secondary" style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-label-sm text-label-sm mb-0.5">
                  <span className="text-error font-semibold flex items-center gap-1 font-sans">
                    <span className="w-2 h-2 rounded-full bg-error animate-ping" /> Singapore (Burst Offshore Route)
                  </span>
                  <span className="text-error font-bold">₹1.84 Cr (Flagged)</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-lowest rounded overflow-hidden">
                  <div className="h-full bg-error" style={{ width: '38%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-label-sm text-label-sm mb-0.5">
                  <span className="text-on-surface flex items-center gap-1 font-sans">
                    <span className="w-2 h-2 rounded-full bg-tertiary" /> UAE (Commercial Invoices)
                  </span>
                  <span className="text-on-surface">₹68.0 L</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-lowest rounded overflow-hidden">
                  <div className="h-full bg-tertiary" style={{ width: '14%' }} />
                </div>
              </div>
            </div>

            {/* Entity Risk Profile for Flagged Beneficiary */}
            <div className="bg-surface-container-low p-space-sm rounded-lg mt-space-md space-y-space-xs border border-error/30">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-error font-bold flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-[14px]">domain_disabled</span>
                  HIGH-RISK COUNTERPARTY
                </span>
                <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-error/20 text-error font-mono">
                  Score: 98/100
                </span>
              </div>
              <div className="font-body-md text-body-md text-on-surface font-semibold">Apex Global FZ (Singapore)</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                Beneficiary AC: DBS-SG-8841-092 • SWIFT: DBSSSGSGXXX
              </div>
              <div className="grid grid-cols-2 gap-space-xs text-[11px] pt-1 font-mono">
                <div className="bg-surface-container px-space-xs py-1 rounded">
                  <span className="text-on-surface-variant block font-sans">KYC Status</span>
                  <span className="text-error font-semibold">Unverified / Shell Co</span>
                </div>
                <div className="bg-surface-container px-space-xs py-1 rounded">
                  <span className="text-on-surface-variant block font-sans">Company Age</span>
                  <span className="text-error font-semibold">&lt; 38 Days Registered</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-space-sm flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm font-mono border-t border-outline-variant/15">
            <span>Linked Graph Degree: 14 entities</span>
            <button
              onClick={() => onShowToast('Graph Explorer', 'Expanded 14-entity settlement cluster network in viewer.', 'hub')}
              className="text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              Open Graph Explorer →
            </button>
          </div>
        </div>
      </div>

      {/* HIGH-RISK RECENT BURST TRANSACTIONS LEDGER */}
      <div className="bg-surface-container rounded-xl shadow-md overflow-hidden border border-outline-variant/20">
        {/* Ledger Header with Tabs and Filter */}
        <div className="p-space-md bg-surface-container-high/60 flex flex-col md:flex-row md:items-center justify-between gap-space-sm border-b border-outline-variant/20">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">High-Density Transaction Ledger</h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                Real-time audit telemetry &amp; deterministic evidence
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded font-mono">
            <button
              onClick={() => setActiveLedgerTab('flagged')}
              className={`px-space-sm py-1 rounded font-label-sm text-label-sm font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                activeLedgerTab === 'flagged' ? 'bg-error/20 text-error' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-error" />
              Flagged Burst (8)
            </button>
            <button
              onClick={() => setActiveLedgerTab('all')}
              className={`px-space-sm py-1 rounded font-label-sm text-label-sm cursor-pointer transition-colors ${
                activeLedgerTab === 'all' ? 'bg-primary/20 text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All Transactions (1,842)
            </button>
            <button
              onClick={() => setActiveLedgerTab('counterparties')}
              className={`px-space-sm py-1 rounded font-label-sm text-label-sm cursor-pointer transition-colors ${
                activeLedgerTab === 'counterparties' ? 'bg-secondary/20 text-secondary font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Linked Counterparties (14)
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-mono">
                <th className="py-2.5 px-space-md">TX ID</th>
                <th className="py-2.5 px-space-md">Timestamp</th>
                <th className="py-2.5 px-space-md">Type / Channel</th>
                <th className="py-2.5 px-space-md">Beneficiary / Route</th>
                <th className="py-2.5 px-space-md text-right">Amount (INR)</th>
                <th className="py-2.5 px-space-md">Triggered Rule</th>
                <th className="py-2.5 px-space-md">Evidence Checksum</th>
                <th className="py-2.5 px-space-md text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-body-sm font-body-sm">
              {displayedTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-surface-container-high/60 transition-colors">
                  <td className="py-2.5 px-space-md font-mono text-primary font-bold">{tx.id}</td>
                  <td className="py-2.5 px-space-md font-mono text-on-surface-variant">{tx.timestamp}</td>
                  <td className="py-2.5 px-space-md">
                    <span className="px-space-xs py-0.5 rounded bg-surface-container-highest text-on-surface font-label-sm text-[10px] font-mono">
                      {tx.channel}
                    </span>
                  </td>
                  <td className="py-2.5 px-space-md">
                    <div className="font-medium text-on-surface">{tx.beneficiary}</div>
                    <span className="font-label-sm text-[10px] text-on-surface-variant font-mono">
                      {tx.beneficiaryBank} • {tx.beneficiaryAccount}
                    </span>
                  </td>
                  <td className="py-2.5 px-space-md text-right font-mono text-error font-bold">
                    ₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 px-space-md">
                    {tx.ruleTriggered ? (
                      <span className="px-space-xs py-0.5 rounded bg-error/20 text-error font-label-sm text-label-sm font-bold font-mono">
                        {tx.ruleTriggered}
                      </span>
                    ) : (
                      <span className="text-on-surface-variant text-[11px] font-mono">Nominal</span>
                    )}
                  </td>
                  <td className="py-2.5 px-space-md font-mono text-tertiary text-[10px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] text-tertiary">verified_user</span>
                    {tx.evidenceChecksum}
                  </td>
                  <td className="py-2.5 px-space-md text-right font-mono">
                    <button
                      onClick={() => onShowToast(`Inspecting ${tx.id}`, `Origin: ${tx.originAccount} → ${tx.beneficiary} (₹${tx.amount.toLocaleString('en-IN')})`, 'receipt')}
                      className="h-6 px-space-xs rounded bg-surface-container text-primary hover:bg-surface-bright font-label-sm text-[11px] mr-1 cursor-pointer transition-colors"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => {
                        onOpenFindingModal();
                        onShowToast('SAR Staged', `Attached ${tx.id} to Regulatory Dossier RF-2026-00481.`, 'note_add');
                      }}
                      className="h-6 px-space-xs rounded bg-error/20 text-error hover:bg-error/30 font-label-sm text-[11px] font-semibold cursor-pointer transition-colors"
                    >
                      SAR +
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-space-xs px-space-md bg-surface-container-lowest/90 flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant font-mono border-t border-outline-variant/20">
          <span>Showing {displayedTransactions.length} of 8 Critical Burst Transactions (Filtered for severity &gt; 80)</span>
          <div className="flex items-center gap-space-xs">
            <button
              onClick={() => onShowToast('Audit Manifest Exported', 'Downloaded tamper-proof cryptographic manifest with SHA-256 chain.', 'file_download')}
              className="text-primary hover:underline font-medium cursor-pointer"
            >
              Download Tamper-Proof Audit Manifest (CSV / JSON)
            </button>
          </div>
        </div>
      </div>

      {/* REGULATORY COMPLIANCE & BINDING GOVERNANCE FOOTER */}
      <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col md:flex-row items-center justify-between gap-space-md shadow-md mb-space-lg border border-primary/20">
        <div className="flex items-center gap-space-md">
          <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary flex-shrink-0 border border-primary/30">
            <span className="material-symbols-outlined text-[24px]">policy</span>
          </div>
          <div>
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-body-lg font-bold text-on-surface">Statutory Regulatory Binding</span>
              <span className="px-space-xs py-0.5 rounded bg-primary/20 text-primary font-label-sm text-label-sm font-bold font-mono">
                PMLA SEC 12
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Linked to <span className="text-on-surface font-semibold">Policy AML-04 Section 4.2</span> ("Rapid Dissipation of Structured Funds via Cross-Border Corridors"). Finding ref <span className="font-mono text-secondary font-bold">#RF-2026-00481</span> automatically provisioned.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-space-xs w-full md:w-auto justify-end font-mono">
          <button
            onClick={onOpenFindingModal}
            className="h-9 px-space-md rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-sm text-label-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">fact_check</span>
            Review Finding #RF-2026-00481
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="h-9 px-space-md rounded bg-primary-container text-on-primary-container hover:brightness-110 font-label-sm text-label-sm font-semibold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">send_and_archive</span>
            Generate Instant SAR Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
