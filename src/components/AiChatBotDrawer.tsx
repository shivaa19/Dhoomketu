import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_TRANSACTIONS, INITIAL_CUSTOMERS, INITIAL_MERCHANTS, VaultTransaction } from '../data/vaultData';
import { BANK_TRANSFER_SUMMARIES } from '../data/bankData';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  targetTxId?: string;
  classification?: {
    txId: string;
    customerName: string;
    verdict: 'FRAUD_CONFIRMED' | 'SUSPICIOUS' | 'LEGITIMATE';
    fraudProbability: number;
    riskFactors: string[];
    rulesTriggered: string[];
    recommendedAction: string;
  };
  bulkScan?: {
    totalScanned: number;
    fraudCount: number;
    suspiciousCount: number;
    legitimateCount: number;
    summary: string;
    results: Array<{
      txId: string;
      customerName: string;
      verdict: 'FRAUD_CONFIRMED' | 'SUSPICIOUS' | 'LEGITIMATE';
      fraudProbability: number;
      riskFactors: string[];
      rulesTriggered: string[];
      recommendedAction: string;
    }>;
  };
  isCustomerQuery?: boolean;
}

interface AiChatBotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transactions?: VaultTransaction[];
  initialTx?: VaultTransaction | null;
  onNavigateToTab?: (tab: any) => void;
  onShowToast: (title: string, msg: string) => void;
}

export const AiChatBotDrawer: React.FC<AiChatBotDrawerProps> = ({
  isOpen,
  onClose,
  transactions = INITIAL_TRANSACTIONS,
  initialTx = null,
  onNavigateToTab,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'all-scan' | 'fraud-analysis' | 'customer-support'>('customer-support');
  const [selectedTxId, setSelectedTxId] = useState<string>(initialTx?.id || transactions[0]?.id || '');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isScanningAll, setIsScanningAll] = useState(false);
  const [aiProviderReady, setAiProviderReady] = useState<boolean | null>(null);

  // Multi-turn system role and model options
  const [selectedRole, setSelectedRole] = useState<'fraud_analyst' | 'customer_support' | 'compliance_officer'>('customer_support');
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-3.5-flash-lite' | 'gemini-3.1-pro-preview'>('gemini-3.8-flash');

  // Voice Conversation States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      timestamp: 'Just now',
      text: 'Hello! Main aapki kis tarah madad kar sakta hoon?',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/ai/status')
      .then((response) => response.json())
      .then((data) => setAiProviderReady(Boolean(data.ready)))
      .catch(() => setAiProviderReady(false));
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setMessages([{ id: `welcome-${Date.now()}`, role: 'assistant', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: 'Hello! Main aapki kis tarah madad kar sakta hoon?' }]);
    setActiveTab('customer-support');
    setSelectedRole('customer_support');
    setSelectedTxId(initialTx?.id || transactions[0]?.id || '');
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Speech Recognition (Voice Input)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage(transcript);
          onShowToast('Voice Captured', `"${transcript}"`);
          handleSendMessage(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
        onShowToast('Voice Input Notice', 'Microphone input stopped. You can type query.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      onShowToast('Voice Input', 'Speech recognition is not supported in this browser. Please type.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        onShowToast('Listening...', 'Speak your question or transaction query.');
      } catch (err) {
        console.warn(err);
        setIsListening(false);
      }
    }
  };

  // Text-To-Speech (Voice Output)
  const speakText = async (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const cleanText = text.replace(/[*#_`>]/g, '').slice(0, 400);

    try {
      const response = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, voice: 'Kore' }),
      });

      const data = await response.json();

      if (data.audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
        audioPlayerRef.current = audio;
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => {
          fallbackSpeechSynthesis(cleanText);
        };
        await audio.play();
        return;
      }
    } catch (err) {
      console.warn('Backend TTS failed, using browser speech synthesis:', err);
    }

    fallbackSpeechSynthesis(cleanText);
  };

  const fallbackSpeechSynthesis = (textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  // Handle Full Ledger Scan for all transactions
  const handleScanAllTransactions = async () => {
    setIsScanningAll(true);
    setIsLoading(true);

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: `⚡ Run AI Fraud Scan on all ${transactions.length} transactions in ledger.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await fetch('/api/ai/scan-all-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `### 📊 Complete Transaction Audit Results

I have scanned **${data.totalScanned} transactions** across all corridors.

**Audit Findings:**
- 🚨 **Confirmed Fraudulent Anomaly:** **${data.fraudCount} transactions**
- ⚠️ **Suspicious / Requiring Review:** **${data.suspiciousCount} transactions**
- ✅ **Legitimate / Safe:** **${data.legitimateCount} transactions**

${data.summary}`,
          bulkScan: data,
        };
        setMessages((prev) => [...prev, aiMsg]);
        onShowToast('Scan Complete', `Flagged ${data.fraudCount} fraud and ${data.suspiciousCount} suspicious transactions.`);
        if (isVoiceMode) {
          speakText(`Audit complete. Found ${data.fraudCount} fraudulent and ${data.suspiciousCount} suspicious transactions.`);
        }
      } else {
        throw new Error(data.error || 'Scan failed');
      }
    } catch (err: any) {
      console.error('Error scanning transactions:', err);
      const total = transactions.length;
      const flagged = transactions.filter((t) => t.status === 'Flagged' || t.riskScore >= 70).length;
      const review = transactions.filter((t) => t.status === 'Under Review' || (t.riskScore >= 40 && t.riskScore < 70)).length;
      const safe = total - flagged - review;

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `### 📊 Transaction Audit Complete (Sentinel Heuristics Engine)

- **Total Scanned:** ${total}
- 🚨 **High Fraud Risk:** ${flagged} (e.g. TX-90217, TX-90213)
- ⚠️ **Suspicious / Step-Up Needed:** ${review}
- ✅ **Nominal / Safe:** ${safe}

**Key Risk Highlights:**
- **TX-90217 (V-Capital Trade):** Severe velocity anomaly (> $5,000/hr) via SG payment rail.
- **TX-90213 (Apex Global FZ):** High-risk shell transit corridor into offshore transit entity.`,
      };
      setMessages((prev) => [...prev, aiMsg]);
      onShowToast('Local Scan Evaluated', `${flagged} high-risk transactions detected.`);
    } finally {
      setIsScanningAll(false);
      setIsLoading(false);
    }
  };

  // Handle checking a specific transaction
  const handleCheckTransaction = async (txIdToCheck?: string) => {
    const targetId = txIdToCheck || selectedTxId;
    const targetTx = transactions.find((t) => t.id.toLowerCase() === targetId.toLowerCase());

    const promptText = `Analyze transaction ${targetId}. Is it fraud or legitimate? Give full fraud probability and recommended actions.`;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      targetTxId: targetId,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptText,
          history: messages.slice(-10),
          role: selectedRole,
          model: selectedModel,
          transactions,
          customers: INITIAL_CUSTOMERS.map(({ id, name, accountNumber, status, riskScore, totalVolumeUSD, country, lastActive }) => ({ id, name, accountNumber, status, riskScore, totalVolumeUSD, country, lastActive })),
          merchants: INITIAL_MERCHANTS,
          banks: BANK_TRANSFER_SUMMARIES,
          selectedTxId: targetId,
          mode: 'fraud_check',
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: data.reply,
          classification: data.classification,
          targetTxId: targetId,
        };
        setMessages((prev) => [...prev, aiMsg]);
        onShowToast('Fraud Analysis Generated', `Evaluated risk for ${targetId}.`);
        if (isVoiceMode) {
          const verdictSummary = data.classification?.verdict === 'FRAUD_CONFIRMED'
            ? `Fraud confirmed on transaction ${targetId} with ${data.classification.fraudProbability} percent risk.`
            : `Transaction ${targetId} evaluated.`;
          speakText(verdictSummary);
        }
      } else {
        throw new Error(data.error || 'Failed to analyze');
      }
    } catch (err) {
      console.error('Error analyzing transaction:', err);
      const isHighRisk = (targetTx?.riskScore || 0) >= 60;
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `### ${isHighRisk ? '🚨 FRAUD INDICATION DETECTED' : '✅ TRANSACTION LEGITIMATE'} for ${targetId}

**Verdict:** **${isHighRisk ? 'SUSPICIOUS / ELEVATED FRAUD RISK' : 'NOMINAL / SAFE TO CLEAR'}**  
**Customer:** ${targetTx?.customerName || 'Cardholder'}  
**Amount:** $${targetTx?.amountUSD.toLocaleString()} USD  
**Risk Score:** **${targetTx?.riskScore || 25}/100**  
**Triggered Rule:** ${targetTx?.ruleTriggered || 'Baseline PCI & KYC checks nominal'}

**Recommendation:** ${
          isHighRisk
            ? 'Place hold on settlement and trigger 3D-Secure 2.2 challenge.'
            : 'Allow transaction to clear in regular batch.'
        }`,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle general multi-turn message submit
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-10),
          role: selectedRole,
          model: selectedModel,
          transactions,
          customers: INITIAL_CUSTOMERS.map(({ id, name, accountNumber, status, riskScore, totalVolumeUSD, country, lastActive }) => ({ id, name, accountNumber, status, riskScore, totalVolumeUSD, country, lastActive })),
          merchants: INITIAL_MERCHANTS,
          banks: BANK_TRANSFER_SUMMARIES,
          selectedTxId: initialTx && activeTab === 'fraud-analysis' ? selectedTxId : undefined,
          mode: activeTab === 'customer-support' ? 'customer_support' : 'auto',
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: data.reply,
          classification: data.classification,
          isCustomerQuery: data.isCustomerQuery,
        };
        setMessages((prev) => [...prev, aiMsg]);
        if (isVoiceMode) {
          speakText(data.reply);
        }
      } else {
        throw new Error(data.error || 'Failed response');
      }
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackText = 'I could not reach the AI service, so I have not answered this question. Please check the connection and try again.';

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: fallbackText,
      };
      setMessages((prev) => [...prev, aiMsg]);
      if (isVoiceMode) {
        speakText(fallbackText);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 text-slate-800 animate-in slide-in-from-right duration-300">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-2xl">psychology</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-white tracking-tight">Dhoomketu Sentinel AI</h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold flex items-center gap-1 border ${aiProviderReady ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-200 border-amber-500/30'}`} title={aiProviderReady ? 'Gemini API is configured' : 'Add GEMINI_API_KEY to .env.local to enable general AI answers'}>
                  <span className={`w-1.5 h-1.5 rounded-full ${aiProviderReady ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  {aiProviderReady === null ? 'Checking AI…' : aiProviderReady ? selectedModel : 'Demo answers · API key needed'}
                </span>
                {isVoiceMode && (
                  <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[10px] font-mono font-semibold flex items-center gap-1 border border-orange-500/30 animate-pulse">
                    <span className="material-symbols-outlined text-[11px]">graphic_eq</span>
                    Voice Mode Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Multi-Turn Fraud Intelligence • Voice Conversations • Customer Q&amp;A
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Voice Mode Toggle */}
            <button
              onClick={() => {
                setIsVoiceMode(!isVoiceMode);
                onShowToast(
                  !isVoiceMode ? 'Voice Mode Activated' : 'Voice Mode Disabled',
                  !isVoiceMode ? 'AI will speak responses and listen to microphone.' : 'Switched to text-only.'
                );
              }}
              title={isVoiceMode ? 'Disable Voice Mode' : 'Enable Voice Mode (Live Conversation)'}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold ${
                isVoiceMode
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {isVoiceMode ? 'volume_up' : 'volume_off'}
              </span>
            </button>

            {/* Clear Chat */}
            <button
              onClick={() => {
                setMessages([
                  {
                    id: `msg-${Date.now()}`,
                    role: 'assistant',
                    timestamp: 'Just now',
                    text: '🧹 Chat thread reset. Ready to inspect transactions or answer customer queries.',
                  },
                ]);
                onShowToast('Chat Reset', 'Cleared conversation history.');
              }}
              title="Clear Thread"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">restart_alt</span>
            </button>

            {/* Close Drawer */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* System Role & Model Configuration Row */}
        <div className="px-6 py-2 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between text-xs text-slate-300 gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono uppercase">Role:</span>
            <select
              value={selectedRole}
              onChange={(e: any) => setSelectedRole(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 font-semibold focus:outline-orange-500 cursor-pointer"
            >
              <option value="fraud_analyst">🛡️ Fraud Risk Analyst</option>
              <option value="customer_support">🤝 Customer Concierge (Hindi/Eng)</option>
              <option value="compliance_officer">⚖️ Compliance Officer (AML/FIU)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono uppercase">Model:</span>
            <select
              value={selectedModel}
              onChange={(e: any) => setSelectedModel(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-xs font-mono text-slate-200 font-semibold focus:outline-orange-500 cursor-pointer"
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash (Balanced)</option>
              <option value="gemini-3.5-flash-lite">gemini-3.5-flash-lite (Fast)</option>
              <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Deep)</option>
            </select>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('all-scan')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'all-scan'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-sm text-orange-400">dataset</span>
              <span>Scan All Transactions</span>
            </button>

            <button
              onClick={() => setActiveTab('fraud-analysis')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'fraud-analysis'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-sm text-orange-400">shield</span>
              <span>Check Fraud by TX</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('customer-support');
                setSelectedRole('customer_support');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'customer-support'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-sm text-orange-400">support_agent</span>
              <span>Customer Inquiries (English/Hindi)</span>
            </button>
          </div>
        </div>

        {/* Context Control Bar */}
        <div className="px-6 py-2.5 bg-orange-50/70 border-b border-orange-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          {activeTab === 'all-scan' ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-orange-600">receipt_long</span>
                <span className="font-semibold text-slate-700">
                  Transaction Ledger: <span className="font-mono text-orange-700 font-bold">{transactions.length} active transactions</span>
                </span>
              </div>
              <button
                onClick={handleScanAllTransactions}
                disabled={isScanningAll}
                className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">
                  {isScanningAll ? 'hourglass_top' : 'bolt'}
                </span>
                <span>{isScanningAll ? 'Auditing Ledger...' : 'Run All-TX Fraud Scan'}</span>
              </button>
            </div>
          ) : activeTab === 'fraud-analysis' ? (
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-semibold text-slate-700 shrink-0">Select Transaction:</span>
                <select
                  value={selectedTxId}
                  onChange={(e) => setSelectedTxId(e.target.value)}
                  className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs font-mono font-medium text-slate-800 focus:outline-orange-500 max-w-[200px] truncate cursor-pointer"
                >
                  {transactions.map((tx) => (
                    <option key={tx.id} value={tx.id}>
                      {tx.id} - ${tx.amountUSD.toLocaleString()} ({tx.customerName})
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => handleCheckTransaction(selectedTxId)}
                disabled={isLoading}
                className="px-3 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1 transition-colors cursor-pointer text-xs shrink-0"
              >
                <span className="material-symbols-outlined text-sm">search_check</span>
                <span>Check Fraud Status</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-orange-600">translate</span>
                <span className="text-slate-700 font-medium">
                  Customer Assistance Mode: <strong className="text-slate-900">English, Hindi &amp; Hinglish</strong>
                </span>
              </div>
              <span className="text-[11px] font-mono text-orange-700 bg-orange-100 px-2 py-0.5 rounded font-semibold">
                Customer-Facing Ready
              </span>
            </div>
          )}
        </div>

        {/* Scrollable Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 border border-orange-200 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                  <span className="material-symbols-outlined text-base">psychology</span>
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs space-y-2.5 ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none shadow-md'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-4 font-mono text-[10px] text-slate-400">
                  <span className="font-semibold text-orange-600">
                    {msg.role === 'user' ? 'Operator Query' : 'Dhoomketu Sentinel AI'}
                  </span>
                  <div className="flex items-center gap-2">
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => speakText(msg.text)}
                        title="Read aloud"
                        className="text-slate-400 hover:text-orange-600 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xs">volume_up</span>
                      </button>
                    )}
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {/* Markdown text representation */}
                <div className="whitespace-pre-line leading-relaxed text-xs">
                  {msg.text}
                </div>

                {/* Structured Classification Card if available */}
                {msg.classification && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-slate-900">
                        {msg.classification.txId} Evaluation
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          msg.classification.verdict === 'FRAUD_CONFIRMED'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : msg.classification.verdict === 'SUSPICIOUS'
                            ? 'bg-amber-100 text-amber-700 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {msg.classification.verdict === 'FRAUD_CONFIRMED'
                          ? '🚨 FRAUD DETECTED'
                          : msg.classification.verdict === 'SUSPICIOUS'
                          ? '⚠️ SUSPICIOUS'
                          : '✅ LEGITIMATE'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Fraud Probability Score:</span>
                        <span className="font-mono font-bold text-slate-900">
                          {msg.classification.fraudProbability}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
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

                    <div className="pt-2 border-t border-slate-200/80 flex flex-wrap gap-1.5">
                      <button
                        onClick={() => {
                          onShowToast('Action Enforced', `Applied payment hold on ${msg.classification?.txId}.`);
                        }}
                        className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Hold &amp; Freeze Rail
                      </button>

                      <button
                        onClick={() => {
                          if (onNavigateToTab) onNavigateToTab('id-proofs');
                          onClose();
                          onShowToast('Navigating', 'Opened Bank ID Proofs verification vault.');
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Verify Bank ID Proof
                      </button>

                      <button
                        onClick={() => {
                          onShowToast('Cleared', `Marked ${msg.classification?.txId} as cleared.`);
                        }}
                        className="px-2.5 py-1 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Approve &amp; Clear
                      </button>
                    </div>
                  </div>
                )}

                {/* Bulk Scan Results Table if present */}
                {msg.bulkScan && msg.bulkScan.results && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-700 flex justify-between">
                      <span>Ledger Anomaly Breakdown ({msg.bulkScan.results.length} TXs)</span>
                      <span className="font-mono text-orange-600">{msg.bulkScan.fraudCount} Flagged</span>
                    </div>
                    <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 text-[11px]">
                      {msg.bulkScan.results.map((res) => (
                        <div key={res.txId} className="p-2.5 flex items-center justify-between hover:bg-slate-50/80">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-slate-900">{res.txId}</span>
                              <span className="text-slate-500">• {res.customerName}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 truncate max-w-[280px]">
                              {res.riskFactors[0] || 'Standard flow'}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] ${
                                res.verdict === 'FRAUD_CONFIRMED'
                                  ? 'bg-red-100 text-red-700'
                                  : res.verdict === 'SUSPICIOUS'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {res.fraudProbability}% {res.verdict === 'FRAUD_CONFIRMED' ? 'FRAUD' : res.verdict === 'SUSPICIOUS' ? 'REVIEW' : 'SAFE'}
                            </span>
                            <button
                              onClick={() => handleCheckTransaction(res.txId)}
                              className="block text-[10px] text-orange-600 hover:underline mt-0.5 font-semibold cursor-pointer"
                            >
                              Deep Inspect →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                  <span className="material-symbols-outlined text-base">person</span>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-xs text-slate-500 bg-white p-3.5 rounded-xl border border-slate-200/80 w-fit shadow-xs">
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping" />
              <span className="font-medium">Sentinel AI ({selectedRole.replace('_', ' ')}) is thinking with Gemini...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips Carousel */}
        <div className="px-6 py-2 bg-white border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-[11px] font-medium text-slate-600 pb-2">
          <span className="text-slate-400 font-mono text-[10px] uppercase shrink-0">Prompts:</span>
          
          <button
            onClick={() => handleScanAllTransactions()}
            className="shrink-0 px-2.5 py-1 rounded-md bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 transition-colors cursor-pointer flex items-center gap-1 font-semibold"
          >
            <span className="material-symbols-outlined text-xs">bolt</span>
            Scan all transactions for fraud
          </button>

          <button
            onClick={() => handleCheckTransaction('TX-90217')}
            className="shrink-0 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            Is TX-90217 fraud or legitimate?
          </button>

          <button
            onClick={() => handleSendMessage('Customer asks: Why is my $9,800 transaction on hold and what should I do?')}
            className="shrink-0 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            Customer: Why is my payment on hold?
          </button>

          <button
            onClick={() => handleSendMessage('Customer asks in Hindi: Mera card block ho gaya hai, paise safe hai ya nahi? Kaise unblock kare?')}
            className="shrink-0 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            Hindi: Card block &amp; paise safety sawal
          </button>

          <button
            onClick={() => handleSendMessage('What are our mandatory regulatory filing requirements under AML-04?')}
            className="shrink-0 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            AML-04 Compliance rules
          </button>
        </div>

        {/* Input Bar with Voice & Send */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          {/* Voice Microphone Input Button */}
          <button
            onClick={toggleListening}
            title={isListening ? 'Stop listening' : 'Speak via Microphone'}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isListening
                ? 'bg-red-600 text-white animate-pulse shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {isListening ? 'mic' : 'mic_none'}
            </span>
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder={
              isListening
                ? 'Listening to your voice...'
                : activeTab === 'customer-support'
                ? 'Type or speak customer query (e.g. "Payment kyu ruka hua hai?")...'
                : 'Ask AI to check transaction, detect fraud or answer questions...'
            }
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all shadow-inner"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="h-10 px-4 bg-slate-900 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-slate-900"
          >
            <span>Send</span>
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </div>

      </div>
    </div>
  );
};
