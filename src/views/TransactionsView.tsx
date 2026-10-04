import React, { useState } from 'react';
import { formatMoney, INITIAL_TRANSACTIONS, VaultTransaction } from '../data/vaultData';

interface TransactionsViewProps {
  currency: string;
  region: string;
  onShowToast: (title: string, msg: string) => void;
  onNavigateToOverview: () => void;
  onAnalyzeWithAi?: (tx: VaultTransaction) => void;
  onOpenAiScanner?: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  currency,
  region,
  onShowToast,
  onNavigateToOverview,
  onAnalyzeWithAi,
  onOpenAiScanner,
}) => {
  const [transactions, setTransactions] = useState<VaultTransaction[]>(INITIAL_TRANSACTIONS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [networkFilter, setNetworkFilter] = useState<string>('All');
  const [selectedTx, setSelectedTx] = useState<VaultTransaction | null>(null);
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);

  // New simulated transaction state
  const [simName, setSimName] = useState('Alex Dupont');
  const [simAmount, setSimAmount] = useState('450.00');
  const [simMerchant, setSimMerchant] = useState('Zara Paris Flagship');
  const [simChannel, setSimChannel] = useState<VaultTransaction['channel']>('POS');
  const [simNetwork, setSimNetwork] = useState<VaultTransaction['cardNetwork']>('Visa');

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      tx.customerName.toLowerCase().includes(search.toLowerCase()) ||
      tx.merchantName.toLowerCase().includes(search.toLowerCase()) ||
      tx.cardNumberMasked.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || tx.status === statusFilter;
    const matchesNetwork = networkFilter === 'All' || tx.cardNetwork === networkFilter;
    const matchesRegion =
      region === 'Global Routing' || tx.region === region || region === 'EU Payments';

    return matchesSearch && matchesStatus && matchesNetwork && matchesRegion;
  });

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(simAmount) || 100;
    const risk = amountVal > 5000 ? 82 : amountVal > 1000 ? 45 : 12;
    const status: VaultTransaction['status'] =
      risk > 75 ? 'Flagged' : risk > 40 ? 'Under Review' : 'Cleared';

    const newTx: VaultTransaction = {
      id: `TX-${Math.floor(90220 + Math.random() * 800)}`,
      timestamp: 'Just now',
      customerName: simName,
      accountNumber: `ACC-${Math.floor(10000 + Math.random() * 90000)}`,
      cardNumberMasked: `${simNetwork === 'Visa' ? '4532' : '5412'} •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
      cardNetwork: simNetwork,
      amountUSD: amountVal,
      merchantName: simMerchant,
      merchantMcc: '5651 (Family Clothing Stores)',
      channel: simChannel,
      region: (region as VaultTransaction['region']) || 'EU Payments',
      riskScore: risk,
      status,
      location: 'Paris, FR',
      ipAddress: '82.120.45.19',
      ruleTriggered: risk > 75 ? 'RULE-101: High Velocity Anomaly' : undefined,
    };

    setTransactions([newTx, ...transactions]);
    setIsSimulateOpen(false);
    onShowToast('Transaction Ingested', `${newTx.id} processed • Evaluated as ${status}`);
  };

  const handleUpdateStatus = (txId: string, newStatus: VaultTransaction['status']) => {
    setTransactions(
      transactions.map((t) => (t.id === txId ? { ...t, status: newStatus } : t))
    );
    if (selectedTx && selectedTx.id === txId) {
      setSelectedTx({ ...selectedTx, status: newStatus });
    }
    onShowToast('Status Updated', `${txId} marked as ${newStatus}.`);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto select-none">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">swap_horiz</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Real-Time Transactions Ledger
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Live stream of card authorizations, settlement batches, and fraud risk scores in {currency}
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
            onClick={() => setIsSimulateOpen(true)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            <span>Simulate Live Transaction</span>
          </button>
        </div>
      </div>

      {/* AI Fraud Sentinel Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 rounded-2xl p-4 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-orange-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">psychology</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight">AI Fraud Sentinel Bot</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-semibold flex items-center gap-1 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Gemini Engine
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Scan all transactions at once for fraud indications, or ask questions on customer inquiries in English/Hindi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (onOpenAiScanner) onOpenAiScanner();
            }}
            className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">bolt</span>
            <span>Scan All for Fraud</span>
          </button>
          <button
            onClick={() => {
              if (onOpenAiScanner) onOpenAiScanner();
            }}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">chat</span>
            <span>Open AI Chatbot</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search by transaction ID, customer, merchant, or card..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Pills */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            {['All', 'Cleared', 'Flagged', 'Under Review', 'Blocked'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Network Filter */}
          <select
            value={networkFilter}
            onChange={(e) => setNetworkFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:bg-white focus:outline-none cursor-pointer"
          >
            <option value="All">All Networks</option>
            <option value="Visa">Visa</option>
            <option value="Mastercard">Mastercard</option>
            <option value="JCB">JCB</option>
            <option value="Amex">Amex</option>
          </select>

          {/* Export Button */}
          <button
            onClick={() => onShowToast('Export Complete', 'Exported 142 transactions to CSV.')}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 cursor-pointer shadow-2xs"
            title="Export CSV"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] text-slate-700 font-semibold">
                <th className="py-3 px-4">TX ID &amp; Time</th>
                <th className="py-3 px-4">Customer &amp; Card</th>
                <th className="py-3 px-4">Merchant &amp; Channel</th>
                <th className="py-3 px-4">Amount ({currency})</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => {
                const isCleared = tx.status === 'Cleared';
                const isFlagged = tx.status === 'Flagged';
                const isBlocked = tx.status === 'Blocked';

                return (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-orange-600 block group-hover:underline">
                        {tx.id}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                        {tx.timestamp}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{tx.customerName}</span>
                      <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                        {tx.cardNetwork} • {tx.cardNumberMasked}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800 block">{tx.merchantName}</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {tx.channel} • {tx.location}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                      {formatMoney(tx.amountUSD, currency)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-bold text-xs ${
                            tx.riskScore > 75
                              ? 'text-red-600'
                              : tx.riskScore > 40
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {tx.riskScore}/100
                        </span>
                        <div className="w-14 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              tx.riskScore > 75
                                ? 'bg-red-500'
                                : tx.riskScore > 40
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${tx.riskScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 ${
                          isCleared
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : isFlagged
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                            : isBlocked
                            ? 'bg-red-50 text-red-700 border border-red-200/60'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{tx.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onAnalyzeWithAi) {
                              onAnalyzeWithAi(tx);
                            } else {
                              setSelectedTx(tx);
                            }
                          }}
                          title="Analyze with AI Fraud Bot"
                          className="px-2 py-1 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200/80 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[13px]">psychology</span>
                          <span>AI Check</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTx(tx);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition-colors cursor-pointer"
                        >
                          Inspect
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Slide-Over Drawer */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-end animate-in fade-in select-none">
          <div className="w-full sm:w-[500px] h-full bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l border-slate-200 animate-in slide-in-from-right">
            <div className="space-y-5">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                      {selectedTx.id}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {selectedTx.channel}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {formatMoney(selectedTx.amountUSD, currency)}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Authorized {selectedTx.timestamp}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[24px]">close</span>
                </button>
              </div>

              {/* Status and Risk */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">Authorization Status</span>
                  <span className="font-bold text-slate-900">{selectedTx.status}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">Calculated Risk Score</span>
                  <span className="font-bold text-orange-600 font-mono text-sm">
                    {selectedTx.riskScore} / 100
                  </span>
                </div>
              </div>

              {/* Rule Triggered Notice */}
              {selectedTx.ruleTriggered && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900">
                  <span className="font-bold block mb-1">Triggered Fraud Rule:</span>
                  <span>{selectedTx.ruleTriggered}</span>
                </div>
              )}

              {/* Payload Breakdown */}
              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">Transaction Attributes</h4>
                <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-100 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Cardholder:</span>
                    <span className="font-bold text-slate-900">{selectedTx.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Card Number:</span>
                    <span className="text-slate-800">{selectedTx.cardNumberMasked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Merchant:</span>
                    <span className="text-slate-800">{selectedTx.merchantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Merchant MCC:</span>
                    <span className="text-slate-800">{selectedTx.merchantMcc}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Geo Location:</span>
                    <span className="text-slate-800">{selectedTx.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Client IP:</span>
                    <span className="text-slate-800">{selectedTx.ipAddress}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                {selectedTx.status !== 'Cleared' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedTx.id, 'Cleared')}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl cursor-pointer shadow-2xs"
                  >
                    Approve Auth
                  </button>
                )}
                {selectedTx.status !== 'Blocked' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedTx.id, 'Blocked')}
                    className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl cursor-pointer shadow-2xs"
                  >
                    Block Card
                  </button>
                )}
              </div>
              <button
                onClick={() => onShowToast('Receipt Downloaded', `Saved receipt for ${selectedTx.id}`)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
              >
                Export Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulate Live Transaction Modal */}
      {isSimulateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in select-none">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Simulate Live Payment Transaction
                </h3>
                <p className="text-xs text-slate-500">
                  Inject an authorization into the Dhoomketu ingestion stream
                </p>
              </div>
              <button
                onClick={() => setIsSimulateOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSimulateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Amount (USD Base)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={simAmount}
                    onChange={(e) => setSimAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Card Network
                  </label>
                  <select
                    value={simNetwork}
                    onChange={(e) => setSimNetwork(e.target.value as VaultTransaction['cardNetwork'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                  >
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="JCB">JCB</option>
                    <option value="Amex">Amex</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Merchant Name
                </label>
                <input
                  type="text"
                  required
                  value={simMerchant}
                  onChange={(e) => setSimMerchant(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Channel</label>
                <select
                  value={simChannel}
                  onChange={(e) => setSimChannel(e.target.value as VaultTransaction['channel'])}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                >
                  <option value="POS">POS Terminal (In-store)</option>
                  <option value="Online / Web">Online / Web Checkout</option>
                  <option value="Wire / ACH">Wire / ACH Transfer</option>
                  <option value="Mobile App">Mobile App</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSimulateOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Execute Simulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
