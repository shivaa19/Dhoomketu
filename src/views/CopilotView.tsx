import React, { useState } from 'react';
import { ViewMode } from '../types';

interface CopilotViewProps {
  onNavigate: (view: ViewMode) => void;
  onOpenFindingModal: () => void;
  onShowToast: (title: string, msg: string, icon?: string) => void;
}

export const CopilotView: React.FC<CopilotViewProps> = ({
  onNavigate,
  onOpenFindingModal,
  onShowToast,
}) => {
  const [queryInput, setQueryInput] = useState(
    'Find suspicious transactions above ₹5 lakh involving high-risk accounts and analyze ACC-10482.'
  );
  const [expandedEv1, setExpandedEv1] = useState(false);
  const [expandedEv2, setExpandedEv2] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'user',
      text: 'Find suspicious transactions above ₹5 lakh involving high-risk accounts and analyze ACC-10482.',
      time: '10:48:02 UTC',
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePromptClick = (promptText: string) => {
    setQueryInput(promptText);
    dispatchQuery(promptText);
  };

  const dispatchQuery = (textToSend?: string) => {
    const text = textToSend || queryInput;
    if (!text.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text,
      time: new Date().toLocaleTimeString() + ' UTC',
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);
    onShowToast('Query Dispatched', 'AI Copilot analyzing transaction topology & policies...', 'psychology');

    setTimeout(() => {
      setIsProcessing(false);
      onShowToast('Analysis Synthesized', 'Generated multi-signal intelligence report with 4 linked policies.', 'verified');
    }, 1000);
  };

  const handleAddNote = () => {
    const note = prompt('Enter Investigator Note for ACC-10482:');
    if (note) {
      onShowToast('Note Appended', 'Logged to immutable audit ledger under session Vikram Rao.', 'edit_note');
    }
  };

  return (
    <div className="flex flex-col w-full text-on-surface">
      {/* Top Context Header Bar */}
      <div className="w-full bg-surface-container-low px-space-lg py-space-md shadow-md border-b border-outline-variant/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md flex-wrap">
            <div className="w-9 h-9 rounded bg-primary-container/20 flex items-center justify-center text-primary shadow-sm border border-primary/30">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
            </div>
            <div>
              <div className="flex items-center gap-space-sm">
                <span className="font-headline-sm text-headline-sm text-on-surface">AI Copilot</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                  • Regulatory &amp; Transaction Intelligence
                </span>
              </div>
              <div className="flex items-center gap-space-xs mt-0.5 font-mono">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                <span className="font-label-sm text-label-sm text-tertiary">Vector Engine v4.8 Active</span>
                <span className="text-on-surface-variant font-label-sm text-label-sm">
                  • Latency 210ms • Embeddings Cosine-94.2%
                </span>
              </div>
            </div>
          </div>

          {/* Investigation Context Pill */}
          <div
            onClick={() => onNavigate('accounts')}
            className="flex items-center gap-space-sm bg-surface-container hover:bg-surface-container-high px-space-md py-space-xs rounded shadow-inner border border-outline-variant/20 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-error">shield_lock</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
              Active Investigation:
            </span>
            <span className="font-label-sm text-label-sm font-semibold text-primary font-mono">
              ACC-10482
            </span>
            <span className="font-label-sm text-label-sm text-on-surface bg-surface-container-high px-space-xs py-0.5 rounded">
              (Alpha Corp Ltd)
            </span>
            <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-error/20 text-error font-bold tracking-tight font-mono">
              TIER-1 HIGH RISK
            </span>
          </div>
        </div>

        {/* Suggested Prompt Carousel Pills */}
        <div className="mt-space-md flex items-center gap-space-sm overflow-x-auto pb-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap flex items-center gap-1 font-mono">
            <span className="material-symbols-outlined text-[14px] text-primary">auto_awesome</span> Prompts:
          </span>
          <button
            className="shrink-0 px-space-md py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-label-sm text-label-sm transition-all hover:shadow-sm cursor-pointer border border-outline-variant/20"
            onClick={() => handlePromptClick('Show me high-risk transactions from the last 7 days')}
          >
            “Show me high-risk transactions from the last 7 days”
          </button>
          <button
            className="shrink-0 px-space-md py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-label-sm text-label-sm transition-all hover:shadow-sm cursor-pointer border border-outline-variant/20"
            onClick={() => handlePromptClick('Why was ACC-10482 flagged?')}
          >
            “Why was ACC-10482 flagged?”
          </button>
          <button
            className="shrink-0 px-space-md py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-label-sm text-label-sm transition-all hover:shadow-sm cursor-pointer border border-outline-variant/20"
            onClick={() => handlePromptClick('Show me suspicious transactions above ₹5 lakh')}
          >
            “Show me suspicious transactions above ₹5 lakh”
          </button>
          <button
            className="shrink-0 px-space-md py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-label-sm text-label-sm transition-all hover:shadow-sm cursor-pointer border border-outline-variant/20"
            onClick={() => handlePromptClick('Which AML policy is relevant to this finding?')}
          >
            “Which AML policy is relevant to this finding?”
          </button>
          <button
            className="shrink-0 px-space-md py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-label-sm text-label-sm transition-all hover:shadow-sm cursor-pointer border border-outline-variant/20"
            onClick={() => handlePromptClick('Summarize suspicious activity for ACC-10482')}
          >
            “Summarize suspicious activity for ACC-10482”
          </button>
          <button
            className="shrink-0 px-space-md py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-label-sm text-label-sm transition-all hover:shadow-sm cursor-pointer border border-outline-variant/20"
            onClick={() => handlePromptClick('Generate an audit-ready report for finding RF-2026-00481')}
          >
            “Generate an audit-ready report for finding RF-2026-00481”
          </button>
        </div>
      </div>

      {/* Main Split Investigation Workspace Grid (2/3 + 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg p-space-lg">
        {/* LEFT REASONING CANVAS (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg min-w-0">
          <div className="space-y-space-lg">
            {/* Dynamic User Messages & Turns */}
            {chatMessages.map((msg, index) => (
              <div key={index} className="flex items-start gap-space-md justify-end">
                <div className="max-w-2xl bg-surface-container-high text-on-surface p-space-md rounded-xl rounded-tr-none shadow-md border border-outline-variant/20">
                  <div className="flex items-center justify-between gap-space-xl mb-1 font-mono">
                    <span className="font-label-sm text-label-sm text-primary font-semibold">
                      Vikram Rao • Lead AML Investigator
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {msg.time}
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface">
                    {msg.text}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[16px] text-on-primary">person</span>
                </div>
              </div>
            ))}

            {/* AI Reasoning Response Block */}
            <div className="flex items-start gap-space-md">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0 shadow-md">
                <span className="material-symbols-outlined text-[18px] text-on-primary-container">psychology</span>
              </div>
              <div className="flex-1 bg-surface-container-low rounded-xl p-space-lg shadow-xl space-y-space-lg min-w-0 border border-outline-variant/30">
                {/* Analysis Header & Verification Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm bg-surface-container-lowest/50 p-space-md rounded border border-outline-variant/20">
                  <div>
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <span className="font-headline-sm text-headline-sm text-on-surface">
                        Multi-Signal Intelligence Report
                      </span>
                      <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-primary/20 text-primary font-semibold font-mono">
                        HYBRID RAG VERIFIED
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Identified 12 anomalous transactions across 4 high-risk accounts. Primary risk concentration found in{' '}
                      <button
                        onClick={() => onNavigate('accounts')}
                        className="text-primary font-semibold hover:underline font-mono"
                      >
                        ACC-10482 (Alpha Corp Ltd)
                      </button>.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-label-sm text-label-sm text-tertiary bg-tertiary-container/20 px-2 py-1 rounded font-semibold inline-flex items-center gap-1 font-mono">
                      <span className="material-symbols-outlined text-[14px]">verified</span> 99.4% Deterministic Match
                    </span>
                  </div>
                </div>

                {/* Risk Summary Box (4 metric chips) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
                  <div className="bg-surface-container p-space-md rounded shadow-inner border border-outline-variant/20">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-mono">Flagged TXs</span>
                      <span className="material-symbols-outlined text-[16px] text-secondary">swap_horiz</span>
                    </div>
                    <div className="font-code-metric text-code-metric text-on-surface mt-1 font-mono font-bold">12</div>
                    <span className="font-label-sm text-label-sm text-error flex items-center gap-0.5 mt-0.5 font-mono">
                      <span className="material-symbols-outlined text-[12px]">trending_up</span> 100% Outward
                    </span>
                  </div>

                  <div className="bg-surface-container p-space-md rounded shadow-inner border border-outline-variant/20">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-mono">Flagged Exposure</span>
                      <span className="material-symbols-outlined text-[16px] text-primary">currency_rupee</span>
                    </div>
                    <div className="font-code-metric text-code-metric text-primary mt-1 font-mono font-bold">₹1.84 Cr</div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5 font-mono">4 accounts linked</span>
                  </div>

                  <div className="bg-surface-container p-space-md rounded shadow-inner bg-gradient-to-br from-surface-container via-surface-container to-error-container/20 border border-error/30">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-mono">Risk Score</span>
                      <span className="material-symbols-outlined text-[16px] text-error">warning</span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-1 font-mono">
                      <span className="font-code-metric text-code-metric text-error font-bold">92</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">/ 100</span>
                    </div>
                    <span className="font-label-sm text-label-sm px-1.5 py-0.2 rounded bg-error/30 text-error font-bold uppercase inline-block font-mono">
                      CRITICAL
                    </span>
                  </div>

                  <div className="bg-surface-container p-space-md rounded shadow-inner border border-outline-variant/20">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-mono">Linked Policies</span>
                      <span className="material-symbols-outlined text-[16px] text-tertiary">policy</span>
                    </div>
                    <div className="font-code-metric text-code-metric text-tertiary mt-1 font-mono font-bold">4</div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5 font-mono">FIU-IND, PMLA 2002</span>
                  </div>
                </div>

                {/* Why Flagged (Risk Breakdown) */}
                <div className="bg-surface-container p-space-md rounded space-y-space-md border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-[18px]">account_tree</span>
                      Why Flagged: Algorithmic Attribution
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                      Σ Weight: 79 Delta Points
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    {/* Velocity Risk */}
                    <div className="bg-surface-container-high/60 p-space-md rounded flex items-start gap-space-md border border-outline-variant/10">
                      <div className="w-7 h-7 rounded bg-error/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[16px] text-error">speed</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-body-md text-body-md font-semibold text-on-surface">Velocity Risk</span>
                          <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-error/20 text-error font-bold font-mono">
                            +19 pts
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                          8 high-value transactions completed within <span className="text-on-surface font-semibold font-mono">42 minutes</span> (6.4x historical normal peak frequency).
                        </p>
                      </div>
                    </div>

                    {/* Transaction Structuring Risk */}
                    <div className="bg-surface-container-high/60 p-space-md rounded flex items-start gap-space-md border border-outline-variant/10">
                      <div className="w-7 h-7 rounded bg-error/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[16px] text-error">call_split</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-body-md text-body-md font-semibold text-on-surface">Transaction Structuring</span>
                          <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-error/20 text-error font-bold font-mono">
                            +22 pts
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                          Average ticket ₹9.5L - ₹9.8L structured intentionally below ₹10,00,000 threshold to evade mandatory CTR filing (<span className="text-primary font-semibold font-mono">RULE-003</span>).
                        </p>
                      </div>
                    </div>

                    {/* Behavioral Anomaly */}
                    <div className="bg-surface-container-high/60 p-space-md rounded flex items-start gap-space-md border border-outline-variant/10">
                      <div className="w-7 h-7 rounded bg-secondary-container/40 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[16px] text-secondary">show_chart</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-body-md text-body-md font-semibold text-on-surface">Behavioral Deviation</span>
                          <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-secondary-container/60 text-secondary font-bold font-mono">
                            +18 pts
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                          Prior 90-day baseline average was ₹40,000/transaction. Current window displays instantaneous <span className="text-secondary font-semibold font-mono">+820% volume spike</span>.
                        </p>
                      </div>
                    </div>

                    {/* Counterparty Dissipation */}
                    <div className="bg-surface-container-high/60 p-space-md rounded flex items-start gap-space-md border border-outline-variant/10">
                      <div className="w-7 h-7 rounded bg-error/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[16px] text-error">public_off</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-body-md text-body-md font-semibold text-on-surface">Counterparty Dissipation</span>
                          <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-error/20 text-error font-bold font-mono">
                            +20 pts
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                          Funds immediately wired offshore to unverified Singapore entity (<span className="text-on-surface font-semibold">Apex Global FZ</span>) with dwell time &lt; 3 mins.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verified Evidence Locker (4 artifacts) */}
                <div className="bg-surface-container p-space-md rounded space-y-space-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-[18px]">inventory_2</span>
                      Verified Evidence Locker (4 artifacts)
                    </span>
                    <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-1 font-semibold font-mono">
                      <span className="material-symbols-outlined text-[14px]">lock</span> SHA-256 Verified
                    </span>
                  </div>

                  <div className="space-y-space-xs text-on-surface">
                    {/* TX 1 */}
                    <div
                      className="bg-surface-container-high hover:bg-surface-container-highest p-space-md rounded flex items-center justify-between transition-colors cursor-pointer group border border-outline-variant/10"
                      onClick={() => setExpandedEv1(!expandedEv1)}
                    >
                      <div className="flex items-center gap-space-md">
                        <span className="material-symbols-outlined text-primary text-[18px]">receipt</span>
                        <div>
                          <div className="flex items-center gap-space-sm font-mono">
                            <span className="font-label-md text-label-md font-bold text-primary">TX-9281</span>
                            <span className="font-body-md text-body-md font-semibold text-on-surface">₹9,80,000.00</span>
                            <span className="font-label-sm text-label-sm px-1.5 rounded bg-surface-container text-on-surface-variant">
                              IMPS Outward
                            </span>
                          </div>
                          <div className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                            10:42 AM IST • Beneficiary: Apex Global FZ (DBS SG) • Auth: AUTO-TOKEN
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-space-md">
                        <span className="font-label-sm text-label-sm text-error bg-error/15 px-2 py-0.5 rounded font-semibold font-mono">
                          Threshold Structuring
                        </span>
                        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-transform">
                          {expandedEv1 ? 'expand_less' : 'expand_more'}
                        </span>
                      </div>
                    </div>
                    {expandedEv1 && (
                      <div className="bg-surface-container-lowest p-space-md rounded text-body-sm text-body-sm text-on-surface-variant space-y-1 font-mono border border-outline-variant/20 animate-in fade-in">
                        <p className="font-label-sm text-label-sm text-tertiary">
                          Cryptographic Hash: 8b73f9e8a01124cd48a3...verified
                        </p>
                        <p>
                          Origin Account: ACC-10482 (Current Balance: ₹12,410 | Inflow was ₹10,00,000 via RTGS at 10:39 AM). Net dwell time: 180 seconds before outward remittance.
                        </p>
                      </div>
                    )}

                    {/* TX 2 */}
                    <div
                      className="bg-surface-container-high hover:bg-surface-container-highest p-space-md rounded flex items-center justify-between transition-colors cursor-pointer group border border-outline-variant/10"
                      onClick={() => setExpandedEv2(!expandedEv2)}
                    >
                      <div className="flex items-center gap-space-md">
                        <span className="material-symbols-outlined text-primary text-[18px]">receipt</span>
                        <div>
                          <div className="flex items-center gap-space-sm font-mono">
                            <span className="font-label-md text-label-md font-bold text-primary">TX-9287</span>
                            <span className="font-body-md text-body-md font-semibold text-on-surface">₹9,70,000.00</span>
                            <span className="font-label-sm text-label-sm px-1.5 rounded bg-surface-container text-on-surface-variant">
                              NEFT Outward
                            </span>
                          </div>
                          <div className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                            10:47 AM IST • Beneficiary: Apex Global FZ (DBS SG) • Channel: WebPortal
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-space-md">
                        <span className="font-label-sm text-label-sm text-error bg-error/15 px-2 py-0.5 rounded font-semibold font-mono">
                          Burst Cluster
                        </span>
                        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-transform">
                          {expandedEv2 ? 'expand_less' : 'expand_more'}
                        </span>
                      </div>
                    </div>
                    {expandedEv2 && (
                      <div className="bg-surface-container-lowest p-space-md rounded text-body-sm text-body-sm text-on-surface-variant space-y-1 font-mono border border-outline-variant/20 animate-in fade-in">
                        <p className="font-label-sm text-label-sm text-tertiary">
                          Cryptographic Hash: 3e498da1c402129aa7b1...verified
                        </p>
                        <p>
                          Repeated transaction fingerprint. Destination IBAN matches offshore watchlist category: Shell Company Transit Gateway.
                        </p>
                      </div>
                    )}

                    {/* Baseline Doc */}
                    <div className="bg-surface-container-high p-space-md rounded flex items-center justify-between border border-outline-variant/10">
                      <div className="flex items-center gap-space-md">
                        <span className="material-symbols-outlined text-secondary text-[18px]">history_edu</span>
                        <div>
                          <div className="flex items-center gap-space-sm">
                            <span className="font-label-md text-label-md font-bold text-secondary font-mono">Historical Baseline Doc</span>
                            <span className="font-label-sm text-label-sm text-on-surface">Rolling 90-Day Telemetry Log</span>
                          </div>
                          <div className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                            Normal avg: ₹40,000/tx | Inflow-to-outflow dwell time: &lt; 3 mins
                          </div>
                        </div>
                      </div>
                      <span className="font-label-sm text-label-sm bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-mono">
                        DOC-HIST-10482
                      </span>
                    </div>

                    {/* Policy Document Link */}
                    <div
                      onClick={() => onNavigate('regulatory-intelligence')}
                      className="bg-surface-container-high hover:bg-surface-container-highest p-space-md rounded flex items-center justify-between cursor-pointer transition-colors border border-outline-variant/10"
                    >
                      <div className="flex items-center gap-space-md">
                        <span className="material-symbols-outlined text-tertiary text-[18px]">verified_user</span>
                        <div>
                          <div className="flex items-center gap-space-sm">
                            <span className="font-label-md text-label-md font-bold text-tertiary font-mono">Policy Reference</span>
                            <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                              AML Transaction Monitoring Manual
                            </span>
                          </div>
                          <div className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                            Code: AML-04, Section 4.2 (Rapid Dissipation &amp; Structuring)
                          </div>
                        </div>
                      </div>
                      <span className="font-label-sm text-label-sm bg-tertiary/20 text-tertiary px-2 py-0.5 rounded font-bold font-mono">
                        RAG Indexed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Regulatory Context (RAG Retrieved) */}
                <div className="bg-surface-container p-space-md rounded bg-gradient-to-r from-surface-container via-surface-container to-primary/10 border border-primary/20">
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-[18px]">gavel</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface">Regulatory Mandate Alignment</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-primary bg-primary/15 px-2 py-0.5 rounded font-bold font-mono">
                      RAG Retrieved • 94.2% Confidence
                    </span>
                  </div>
                  <blockquote className="bg-surface-container-lowest/80 p-space-md rounded text-on-surface-variant font-body-sm text-body-sm italic border-l-2 border-primary">
                    “Source: <strong className="text-on-surface not-italic font-semibold">AML-04 Section 4.2</strong> — ‘Accounts demonstrating rapid dissipation of newly credited funds without apparent commercial rationale or historical precedent must be subjected to enhanced scrutiny and reported via Form STR-01 to FIU within 7 banking days.’”
                  </blockquote>
                </div>

                {/* Recommended Next Step */}
                <div className="p-space-md rounded bg-error-container/20 flex items-start gap-space-md border border-error/30">
                  <span className="material-symbols-outlined text-error text-[20px] mt-0.5">notification_important</span>
                  <div className="flex-1">
                    <span className="font-headline-sm text-headline-sm text-error">Recommended Enforcement Action</span>
                    <p className="font-body-sm text-body-sm text-on-surface mt-0.5">
                      Initiate formal regulatory finding <strong className="text-primary font-mono font-bold">RF-2026-00481</strong>, place debit-freeze hold on downstream outward gateways, and prepare SAR dossier for Compliance Officer review.
                    </p>
                  </div>
                </div>

                {/* Action Footer Buttons */}
                <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                  <button
                    className="h-9 px-space-lg bg-primary-container text-on-primary-container font-headline-sm text-headline-sm rounded flex items-center gap-space-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer font-semibold"
                    onClick={onOpenFindingModal}
                  >
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                    <span>Create Regulatory Finding</span>
                  </button>
                  <button
                    className="h-9 px-space-md bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded font-body-md text-body-md font-semibold flex items-center gap-space-xs transition-colors cursor-pointer border border-outline-variant/20"
                    onClick={() => onNavigate('reports')}
                  >
                    <span className="material-symbols-outlined text-[18px] text-tertiary">summarize</span>
                    <span>Generate Audit-Ready Report</span>
                  </button>
                  <button
                    className="h-9 px-space-md bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded font-body-md text-body-md flex items-center gap-space-xs transition-colors cursor-pointer border border-outline-variant/20"
                    onClick={() => onNavigate('transactions')}
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">visibility</span>
                    <span>View Raw Evidence (4 items)</span>
                  </button>
                  <button
                    className="h-9 px-space-md bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface rounded font-body-md text-body-md flex items-center gap-space-xs transition-colors cursor-pointer border border-outline-variant/20"
                    onClick={handleAddNote}
                  >
                    <span className="material-symbols-outlined text-[18px]">edit_note</span>
                    <span>Add Investigator Note</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Query Input Box at Bottom */}
          <div className="mt-auto sticky bottom-space-md z-30">
            <div className="bg-surface-container-low p-space-md rounded-xl shadow-2xl space-y-space-xs backdrop-blur-xl border border-outline-variant/30">
              <div className="flex items-center gap-space-sm">
                <button
                  onClick={() => onShowToast('Document Attached', 'Loaded SWIFT MT103 packet for ACC-10482.', 'attach_file')}
                  className="w-8 h-8 rounded bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
                  title="Attach Document / Data Log"
                >
                  <span className="material-symbols-outlined text-[18px]">attach_file</span>
                </button>
                <div className="flex-1 relative">
                  <input
                    className="w-full h-10 px-space-md bg-surface-container-lowest text-on-surface placeholder:text-outline rounded font-body-md text-body-md focus:outline-none focus:bg-surface-container transition-all border border-outline-variant/20"
                    placeholder="Ask AI Copilot about transactions, counterparty networks, or FIU regulations..."
                    type="text"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') dispatchQuery();
                    }}
                  />
                </div>
                <button
                  onClick={() => onShowToast('Microphone Active', 'Listening for investigator voice query...', 'mic')}
                  className="w-8 h-8 rounded bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
                  title="Voice Input"
                >
                  <span className="material-symbols-outlined text-[18px]">mic</span>
                </button>
                <button
                  disabled={isProcessing}
                  className="h-10 px-space-lg bg-primary text-on-primary font-headline-sm text-headline-sm rounded flex items-center gap-space-xs shadow-md hover:brightness-110 active:scale-95 transition-all font-semibold cursor-pointer disabled:opacity-50"
                  onClick={() => dispatchQuery()}
                >
                  <span>{isProcessing ? 'Thinking...' : 'Send Query'}</span>
                  <span className="material-symbols-outlined text-[16px]">send</span>
                </button>
              </div>
              <div className="flex items-center justify-between px-space-xs pt-1">
                <div className="flex items-center gap-space-md">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input defaultChecked className="w-3.5 h-3.5 rounded bg-surface-container-lowest text-primary" type="checkbox" />
                    <span className="font-label-sm text-label-sm text-tertiary font-semibold flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary" /> Policy RAG Active
                    </span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input defaultChecked className="w-3.5 h-3.5 rounded bg-surface-container-lowest text-primary" type="checkbox" />
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                      Live Graph Context
                    </span>
                  </label>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                  Press ↵ Enter to dispatch to Sentinel Engine
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT INSPECTOR PANEL (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg min-w-0">
          {/* Live Evidence & Entity Dossier Card */}
          <div className="bg-surface-container-low rounded-xl p-space-lg shadow-xl space-y-space-md border border-outline-variant/30">
            <div className="flex items-center justify-between pb-space-sm bg-surface-container-lowest/40 p-space-md rounded border border-outline-variant/20">
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-mono">
                  Entity Under Review
                </span>
                <div className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Alpha Corp Ltd
                </div>
                <span className="font-label-sm text-label-sm text-primary font-mono">
                  ACC-10482 • Corporate IN
                </span>
              </div>
              <span className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center text-error font-bold font-mono text-label-lg border border-error/30">
                92
              </span>
            </div>

            {/* Risk Gauge & Meter */}
            <div className="bg-surface-container p-space-md rounded space-y-space-sm border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold font-mono">
                  RISK LEVEL INDEX
                </span>
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-error text-on-error font-bold font-mono">
                  CRITICAL BREACH
                </span>
              </div>
              {/* Segmented 6px Linear Track Bar */}
              <div className="w-full flex items-center gap-1 h-2 rounded overflow-hidden bg-surface-container-lowest p-0.5">
                <div className="h-full w-1/5 bg-tertiary rounded-sm" />
                <div className="h-full w-1/5 bg-tertiary rounded-sm" />
                <div className="h-full w-1/5 bg-secondary rounded-sm" />
                <div className="h-full w-1/5 bg-error rounded-sm" />
                <div className="h-full w-1/5 bg-error rounded-sm animate-pulse shadow-[0_0_8px_rgba(255,180,171,0.6)]" />
              </div>
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant font-mono">
                <span>Baseline 0</span>
                <span>Threshold 65</span>
                <span className="text-error font-bold">Score 92/100</span>
              </div>
            </div>

            {/* Risk Attribution Breakdown Bar */}
            <div className="bg-surface-container p-space-md rounded space-y-space-sm border border-outline-variant/20">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold block uppercase font-mono">
                Risk Attribution Weights
              </span>
              <div className="space-y-space-xs font-label-sm text-label-sm font-mono">
                <div>
                  <div className="flex justify-between text-on-surface-variant mb-0.5">
                    <span>Transaction Structuring</span>
                    <span className="text-on-surface">22 pts (24%)</span>
                  </div>
                  <div className="w-full bg-surface-container-lowest h-1.5 rounded overflow-hidden">
                    <div className="bg-error h-full rounded" style={{ width: '88%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-on-surface-variant mb-0.5">
                    <span>Velocity &amp; Frequency</span>
                    <span className="text-on-surface">19 pts (21%)</span>
                  </div>
                  <div className="w-full bg-surface-container-lowest h-1.5 rounded overflow-hidden">
                    <div className="bg-error h-full rounded" style={{ width: '76%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-on-surface-variant mb-0.5">
                    <span>Behavioral Volume Drift</span>
                    <span className="text-on-surface">18 pts (20%)</span>
                  </div>
                  <div className="w-full bg-surface-container-lowest h-1.5 rounded overflow-hidden">
                    <div className="bg-secondary-container h-full rounded" style={{ width: '72%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-on-surface-variant mb-0.5">
                    <span>Regulatory Non-Compliance</span>
                    <span className="text-on-surface">13 pts (14%)</span>
                  </div>
                  <div className="w-full bg-surface-container-lowest h-1.5 rounded overflow-hidden">
                    <div className="bg-primary-container h-full rounded" style={{ width: '52%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-on-surface-variant mb-0.5">
                    <span>Counterparty Shell Index</span>
                    <span className="text-on-surface">12 pts (13%)</span>
                  </div>
                  <div className="w-full bg-surface-container-lowest h-1.5 rounded overflow-hidden">
                    <div className="bg-primary h-full rounded" style={{ width: '48%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-on-surface-variant mb-0.5">
                    <span>Geographic Jurisdiction</span>
                    <span className="text-on-surface">8 pts (8%)</span>
                  </div>
                  <div className="w-full bg-surface-container-lowest h-1.5 rounded overflow-hidden">
                    <div className="bg-secondary h-full rounded" style={{ width: '32%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* RAG Vector Retrieval Status */}
            <div className="bg-surface-container p-space-md rounded flex items-start gap-space-sm border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">scatter_plot</span>
              <div className="min-w-0">
                <span className="font-body-sm text-body-sm font-semibold text-on-surface block">
                  RAG Retrieval Pipeline
                </span>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5 font-mono">
                  4 documents chunked &amp; embedded via Gemini RAG • Cosine Similarity:{' '}
                  <span className="text-tertiary font-bold">0.942</span>
                </p>
                <div className="flex items-center gap-space-xs mt-space-xs flex-wrap font-mono">
                  <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface">
                    AML-04.pdf
                  </span>
                  <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface">
                    RBI_Master_2024.docx
                  </span>
                  <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface">
                    Entity_Dossier_10482.json
                  </span>
                </div>
              </div>
            </div>

            {/* Audit Trail Telemetry for Current Session */}
            <div className="bg-surface-container p-space-md rounded space-y-space-xs border border-outline-variant/20">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">receipt_long</span>
                  Session Telemetry
                </span>
                <span className="font-label-sm text-label-sm text-tertiary bg-tertiary/15 px-1.5 py-0.5 rounded font-mono font-bold">
                  IMMUTABLE
                </span>
              </div>
              <div className="space-y-space-xs font-label-sm text-label-sm text-on-surface-variant font-mono">
                <div className="flex items-start gap-space-xs">
                  <span className="text-on-surface shrink-0 font-bold">10:48:02</span>
                  <span>Copilot query dispatched by Vikram Rao (Auth L3)</span>
                </div>
                <div className="flex items-start gap-space-xs">
                  <span className="text-on-surface shrink-0 font-bold">10:48:04</span>
                  <span>Hybrid rule engine evaluated 1,842 TXs (Filter: &gt; ₹5L)</span>
                </div>
                <div className="flex items-start gap-space-xs">
                  <span className="text-on-surface shrink-0 font-bold">10:48:06</span>
                  <span>Semantic match identified in <strong className="text-primary font-semibold">AML-04.txt</strong> (Section 4.2)</span>
                </div>
                <div className="flex items-start gap-space-xs">
                  <span className="text-on-surface shrink-0 font-bold">10:48:07</span>
                  <span>Risk score <strong className="text-error font-semibold">92</strong> computed via ensemble weights</span>
                </div>
              </div>
            </div>

            {/* Pre-filled Regulatory Finding Card preview */}
            <div className="bg-surface-container-high p-space-md rounded space-y-space-sm shadow-md border border-primary/30">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-[18px]">assignment_turned_in</span>
                  Finding Dossier Preview
                </span>
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-error/20 text-error font-bold font-mono">
                  READY TO FILE
                </span>
              </div>
              <div className="space-y-space-xs font-body-sm text-body-sm">
                <div className="flex justify-between font-mono">
                  <span className="text-on-surface-variant">Finding ID:</span>
                  <span className="font-label-sm text-label-sm font-bold text-primary">RF-2026-00481</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-on-surface-variant">Severity:</span>
                  <span className="font-label-sm text-label-sm font-bold text-error">CRITICAL (Tier 1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Title:</span>
                  <span className="font-body-sm text-body-sm text-on-surface font-semibold text-right truncate max-w-[180px]">
                    High-Velocity Structuring
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Status:</span>
                  <span className="font-label-sm text-label-sm text-tertiary font-mono">Open / Pending Sign-off</span>
                </div>
              </div>
              <button
                className="w-full mt-space-sm h-8 bg-surface-container hover:bg-surface-container-lowest text-primary rounded font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer border border-primary/20"
                onClick={onOpenFindingModal}
              >
                <span className="material-symbols-outlined text-[14px]">edit_document</span> Edit Dossier Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
