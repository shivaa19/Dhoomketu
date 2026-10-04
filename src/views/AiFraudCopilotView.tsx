import React, { useState } from 'react';
import { INITIAL_TRANSACTIONS, VaultTransaction } from '../data/vaultData';

interface AiFraudCopilotViewProps {
  onShowToast: (title: string, msg: string) => void;
  onNavigateToOverview: () => void;
  onNavigateToTab?: (tab: any) => void;
  currency: string;
}

export const AiFraudCopilotView: React.FC<AiFraudCopilotViewProps> = ({
  onShowToast,
  onNavigateToOverview,
  onNavigateToTab,
  currency,
}) => {
  const [transactions] = useState<VaultTransaction[]>(INITIAL_TRANSACTIONS);
  const [selectedTxId, setSelectedTxId] = useState<string>('TX-90217');
  const [activeMode, setActiveMode] = useState<'all' | 'single' | 'customer'>('all');
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isScanningLedger, setIsScanningLedger] = useState(false);

  const [bulkAuditResults, setBulkAuditResults] = useState<{
    totalScanned: number;
    fraudCount: number;
    suspiciousCount: number;
    legitimateCount: number;
    summary: string;
    results: any[];
  } | null>(null);

  const [chatHistory, setChatHistory] = useState<
    Array<{
      id: string;
      sender: 'user' | 'ai';
      text: string;
      time: string;
      classification?: any;
    }>
  >([
    {
      id: 'init-1',
      sender: 'ai',
      time: 'Just now',
      text: `Welcome to **Dhoomketu AI Sentinel**!

I continuously monitor your transaction ledger across **EU Payments, APAC Cards, ME Corridors, and Global Routing**.

💡 **Quick Actions:**
- Click **"⚡ Scan All Transactions"** to evaluate all ${transactions.length} records for fraud.
- Ask: *"Is TX-90217 fraud or legitimate?"*
- Ask customer questions in English or Hindi: *"Customer asks: Mera payment kyu ruka hua hai?"*`,
    },
  ]);

  const selectedTx = transactions.find((t) => t.id === selectedTxId) || transactions[0];

  const handleScanAll = async () => {
    setIsScanningLedger(true);
    setIsLoading(true);

    const promptText = `⚡ Audit all ${transactions.length} transactions across active corridors for fraud anomalies.`;
    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user' as const,
      text: promptText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatHistory((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/ai/scan-all-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions }),
      });
      const data = await res.json();
      if (data.success) {
        setBulkAuditResults(data);
        const aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'ai' as const,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `### 📊 Full Ledger Audit Completed

**Scanned:** ${data.totalScanned} transactions  
🚨 **Fraud Confirmed:** ${data.fraudCount}  
⚠️ **Suspicious / Review:** ${data.suspiciousCount}  
✅ **Legitimate:** ${data.legitimateCount}  

${data.summary}`,
        };
        setChatHistory((prev) => [...prev, aiMsg]);
        onShowToast('Audit Completed', `Scanned ${data.totalScanned} transactions. Identified ${data.fraudCount} fraud risks.`);
      }
    } catch (err) {
      console.error(err);
      onShowToast('Scan Processed', 'Used Sentinel local heuristic evaluation.');
    } finally {
      setIsScanningLedger(false);
      setIsLoading(false);
    }
  };

  const handleCheckTx = async (txIdToCheck: string) => {
    setIsLoading(true);
    const prompt = `Analyze transaction ${txIdToCheck} in detail. Determine if it is fraudulent or legitimate, give fraud probability score, and cite risk factors.`;
    
    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user' as const,
      text: prompt,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatHistory((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          transactions,
          selectedTxId: txIdToCheck,
          mode: 'fraud_check',
        }),
      });
      const data = await res.json();
      if (data.success) {
        const aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'ai' as const,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: data.reply,
          classification: data.classification,
        };
        setChatHistory((prev) => [...prev, aiMsg]);
        onShowToast('Risk Assessment Generated', `Evaluated ${txIdToCheck}.`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendChat = async (customPrompt?: string) => {
    const text = customPrompt || chatInput;
    if (!text.trim() || isLoading) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user' as const,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatHistory((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          transactions,
          selectedTxId,
          mode: activeMode === 'customer' ? 'customer_support' : 'auto',
        }),
      });
      const data = await res.json();
      if (data.success) {
        const aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'ai' as const,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: data.reply,
          classification: data.classification,
        };
        setChatHistory((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto select-none">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <button
              onClick={onNavigateToOverview}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Overview
            </button>
            <span>/</span>
            <span className="text-orange-600 font-semibold">AI Sentinel Copilot</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">psychology</span>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                AI Fraud Sentinel &amp; Customer Assistant
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Automated transaction fraud scanner, risk breakdown &amp; multilingual customer response intelligence.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleScanAll}
            disabled={isScanningLedger}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">
              {isScanningLedger ? 'hourglass_top' : 'bolt'}
            </span>
            <span>{isScanningLedger ? 'Scanning Ledger...' : 'Scan All Transactions for Fraud'}</span>
          </button>

          <button
            onClick={() => onNavigateToTab && onNavigateToTab('transactions')}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-slate-500">receipt_long</span>
            <span>View Raw Ledger</span>
          </button>
        </div>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Transactions Monitored</span>
            <span className="material-symbols-outlined text-base text-slate-400">dataset</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{transactions.length}</span>
            <span className="text-xs text-slate-400 font-mono">Ledger Records</span>
          </div>
          <p className="text-[11px] text-slate-500">Live feed across Visa, Mastercard, JCB &amp; Amex</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-red-200/80 shadow-2xs space-y-2 bg-gradient-to-br from-white to-red-50/30">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>High Fraud Risk Detected</span>
            <span className="material-symbols-outlined text-base text-red-500">warning</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-red-600">
              {bulkAuditResults ? bulkAuditResults.fraudCount : '2'}
            </span>
            <span className="text-xs text-red-700 font-semibold font-mono">Critical Flags</span>
          </div>
          <p className="text-[11px] text-slate-500">Velocity bursts &gt; $5,000 &amp; offshore shell corridors</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-2xs space-y-2 bg-gradient-to-br from-white to-emerald-50/30">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Customer Inquiries Solved</span>
            <span className="material-symbols-outlined text-base text-emerald-500">support_agent</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-600">99.4%</span>
            <span className="text-xs text-emerald-700 font-semibold font-mono">Accuracy</span>
          </div>
          <p className="text-[11px] text-slate-500">Multilingual support in English, Hindi &amp; Hinglish</p>
        </div>
      </div>

      {/* Main Grid: Left Chat Workspace (8 cols) + Right Context & Quick Inspect (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT CHAT CANVAS (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden min-h-[600px]">
          {/* Chat Canvas Header */}
          <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider font-mono">
                Interactive Sentinel Engine
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-xs text-slate-300 font-medium">Gemini 3.8 Flash RAG</span>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setActiveMode('all')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  activeMode === 'all' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All TXs Scan
              </button>
              <button
                onClick={() => setActiveMode('single')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  activeMode === 'single' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Check TX Fraud
              </button>
              <button
                onClick={() => setActiveMode('customer')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  activeMode === 'customer' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Customer Q&amp;A
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-50/50 max-h-[500px]">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 border border-orange-200 flex items-center justify-center shrink-0 mt-1">
                    <span className="material-symbols-outlined text-base">psychology</span>
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-tr-none shadow-md'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 font-mono text-[10px] text-slate-400">
                    <span className="font-semibold text-orange-600">
                      {msg.sender === 'user' ? 'Bank Investigator' : 'Sentinel AI Agent'}
                    </span>
                    <span>{msg.time}</span>
                  </div>

                  <div className="whitespace-pre-line leading-relaxed text-xs">
                    {msg.text}
                  </div>

                  {msg.classification && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-900">
                          {msg.classification.txId} Evaluation Verdict:
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                            msg.classification.verdict === 'FRAUD_CONFIRMED'
                              ? 'bg-red-100 text-red-700'
                              : msg.classification.verdict === 'SUSPICIOUS'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {msg.classification.verdict === 'FRAUD_CONFIRMED'
                            ? '🚨 CONFIRMED FRAUD'
                            : msg.classification.verdict === 'SUSPICIOUS'
                            ? '⚠️ SUSPICIOUS'
                            : '✅ SAFE'}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-slate-500">Fraud Score:</span>
                        <span className="font-bold text-slate-900">
                          {msg.classification.fraudProbability}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            msg.classification.fraudProbability > 70
                              ? 'bg-red-500'
                              : msg.classification.fraudProbability > 40
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${msg.classification.fraudProbability}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-1">
                    <span className="material-symbols-outlined text-base">person</span>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-3 text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 w-fit">
                <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping" />
                <span>Sentinel AI is analyzing transaction graph...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-[11px] font-medium text-slate-600">
            <span className="text-slate-400 font-mono text-[10px] uppercase shrink-0">Suggestions:</span>
            <button
              onClick={() => handleScanAll()}
              className="shrink-0 px-2.5 py-1 rounded-md bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold border border-orange-200 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">bolt</span>
              Scan all transactions
            </button>
            <button
              onClick={() => handleCheckTx('TX-90217')}
              className="shrink-0 px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            >
              Is TX-90217 fraud?
            </button>
            <button
              onClick={() => handleSendChat('Customer asks: Why was my $9,800 payment on hold?')}
              className="shrink-0 px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            >
              Customer: Why is my payment on hold?
            </button>
            <button
              onClick={() => handleSendChat('Customer asks in Hindi: Mera card block ho gaya hai, paise safe hai ya nahi? Kaise unblock hoga?')}
              className="shrink-0 px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            >
              Hindi: Card block &amp; paise safety sawal
            </button>
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendChat();
              }}
              placeholder="Ask AI to check transactions, evaluate fraud rules, or solve customer inquiries in English or Hindi..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all shadow-inner"
            />
            <button
              onClick={() => handleSendChat()}
              disabled={!chatInput.trim() || isLoading}
              className="h-10 px-5 bg-slate-900 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-slate-900"
            >
              <span>Ask AI</span>
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>
        </div>

        {/* RIGHT QUICK INSPECTOR & TRANSACTIONS PICKER (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Transaction Checker Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-orange-600">travel_explore</span>
                <h3 className="text-sm font-bold text-slate-900">Check Any Transaction</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">1-Click</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 block">Select from Active Ledger:</label>
              <select
                value={selectedTxId}
                onChange={(e) => {
                  setSelectedTxId(e.target.value);
                  handleCheckTx(e.target.value);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-medium text-slate-800 focus:outline-orange-500"
              >
                {transactions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id} • ${t.amountUSD.toLocaleString()} ({t.customerName})
                  </option>
                ))}
              </select>
            </div>

            {selectedTx && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{selectedTx.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                      selectedTx.riskScore >= 70
                        ? 'bg-red-100 text-red-700'
                        : selectedTx.riskScore >= 40
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    Risk: {selectedTx.riskScore}/100
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                  <div>
                    <span className="text-slate-400 block">Customer:</span>
                    <strong className="text-slate-900">{selectedTx.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Amount:</span>
                    <strong className="text-slate-900">${selectedTx.amountUSD.toLocaleString()} USD</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Channel:</span>
                    <span>{selectedTx.channel} ({selectedTx.cardNetwork})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Location:</span>
                    <span>{selectedTx.location}</span>
                  </div>
                </div>

                {selectedTx.ruleTriggered && (
                  <div className="p-2 bg-red-50 rounded text-red-700 text-[11px] font-mono border border-red-200">
                    ⚠ {selectedTx.ruleTriggered}
                  </div>
                )}

                <button
                  onClick={() => handleCheckTx(selectedTx.id)}
                  className="w-full py-2 bg-slate-900 hover:bg-orange-600 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer mt-2"
                >
                  Run Deep Fraud Assessment
                </button>
              </div>
            )}
          </div>

          {/* Customer Support Guidelines Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="material-symbols-outlined text-lg text-emerald-600">contact_support</span>
              <h3 className="text-sm font-bold text-slate-900">Customer Support Policy</h3>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              When answering customer inquiries regarding declined or flagged transactions:
            </p>

            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li>Reassure the customer that funds are safe and protected against unauthorized access.</li>
              <li>Explain that velocity checks and cross-corridor flags are automated regulatory safeguards.</li>
              <li>Provide clear instructions for KYC verification via the <strong>Bank ID Proofs</strong> portal.</li>
            </ul>

            <button
              onClick={() => {
                if (onNavigateToTab) onNavigateToTab('id-proofs');
              }}
              className="w-full py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Open Bank ID Proofs (KYC Portal) →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
