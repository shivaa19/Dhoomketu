import React, { useState } from 'react';
import { VaultNavTab } from '../types';

interface VaultGenericListViewProps {
  tab: VaultNavTab;
  onNavigate: (tab: VaultNavTab) => void;
  onShowToast: (title: string, msg: string) => void;
}

export const VaultGenericListView: React.FC<VaultGenericListViewProps> = ({
  tab,
  onNavigate,
  onShowToast,
}) => {
  const [search, setSearch] = useState('');

  const titles: Record<VaultNavTab, { title: string; subtitle: string; icon: string }> = {
    overview: { title: 'Risk Overview', subtitle: 'Real-time monitoring', icon: 'grid_view' },
    banks: { title: 'Bank Transfers', subtitle: 'Received, sent, processing, and failed payments by bank', icon: 'account_balance' },
    profile: { title: 'My Profile', subtitle: 'Personal and account details', icon: 'person' },
    'id-proofs': { title: 'Bank Customer ID Proofs', subtitle: 'KYC identity documentation and biometric match audits', icon: 'badge' },
    transactions: { title: 'Transactions Ledger', subtitle: 'Live stream of card authorizations, settlements and chargebacks', icon: 'swap_horiz' },
    'fraud-detection': { title: 'Fraud Detection Engine', subtitle: 'Heuristic rules, machine learning scores and anomaly clusters', icon: 'shield_with_heart' },
    investigations: { title: 'Investigations & Cases', subtitle: 'Open forensic case dossiers, linked cardholders and chargeback dispute files', icon: 'find_in_page' },
    customers: { title: 'Customer Risk Profiles', subtitle: 'Cardholder behavioral baselines, device fingerprints and velocity scores', icon: 'group' },
    merchants: { title: 'Merchant Directory', subtitle: 'Acquiring portfolio risk index, chargeback ratios and high-risk classifications', icon: 'storefront' },
    'rules-models': { title: 'Rules & Machine Learning Models', subtitle: 'Active decision models, threshold triggers and shadow-mode simulations', icon: 'tune' },
    alerts: { title: 'All Alerts & Incidents', subtitle: 'System-wide triage queue, SLA monitoring and incident dispatch', icon: 'warning' },
    reports: { title: 'Risk & Audit Reports', subtitle: 'Periodic compliance exports, SAR dossiers and forensic ledger manifests', icon: 'description' },
    compliance: { title: 'Compliance & Mandates', subtitle: 'Visa VROL, Mastercard MATCH, PCI-DSS and FIU statutory standards', icon: 'verified_user' },
    'admin-panel': { title: 'Admin & Gateway Settings', subtitle: 'API tokens, webhook endpoints, user roles and security keys', icon: 'space_dashboard' },
    'ai-copilot': { title: 'AI Fraud Sentinel Copilot', subtitle: 'Automated transaction fraud scanner, risk scoring and customer query assistant', icon: 'psychology' },
  };

  const currentMeta = titles[tab] || titles.overview;

  const mockRows: Record<string, Array<{ col1: string; col2: string; col3: string; col4: string; status: string }>> = {
    transactions: [
      { col1: 'TX-90218', col2: 'Emily Watson • Visa Debit (4532 •••• 8812)', col3: '$1,240.50', col4: 'AU Cards • Sydney POS', status: 'Cleared' },
      { col1: 'TX-90217', col2: 'V-Capital Trade • Mastercard (5120 •••• 9921)', col3: '$9,800.00', col4: 'APAC Cards • SG Online', status: 'Flagged' },
      { col1: 'TX-90216', col2: 'Alpha Corp Ltd • Corporate (4912 •••• 3314)', col3: '$18,400.00', col4: 'ME Cards • Dubai Wire', status: 'Under Review' },
      { col1: 'TX-90215', col2: 'Kenji Sato • JCB Platinum (3528 •••• 0192)', col3: '$310.00', col4: 'APAC Cards • Tokyo E-Com', status: 'Cleared' },
      { col1: 'TX-90214', col2: 'Liam O’Connor • Mastercard (5412 •••• 7712)', col3: '$4,290.00', col4: 'EU Payments • Dublin Web', status: 'Cleared' },
    ],
    'fraud-detection': [
      { col1: 'RULE-101', col2: 'High-Velocity Card Testing on Checkout', col3: '24 tx / 60 sec threshold', col4: 'Triggered 142 times today', status: 'Active (Block)' },
      { col1: 'RULE-104', col2: 'Card-Not-Present Billing IP Distance > 3,000km', col3: 'Cross-corridor mismatch', col4: 'Triggered 48 times today', status: 'Active (Review)' },
      { col1: 'ML-MODEL-4', col2: 'XGBoost Synthetic Identity Score > 0.85', col3: 'Device + SSN + Email Age', col4: 'Real-time inference (8ms)', status: 'Active' },
    ],
    investigations: [
      { col1: 'CASE-4401', col2: 'Syndicate Card Cycling (APAC Cards)', col3: '$48,200 Exposure', col4: 'Lead: John Lee', status: 'Investigating' },
      { col1: 'CASE-4398', col2: 'BIN Range Attack on AU Merchant Gateways', col3: '$12,400 Exposure', col4: 'Lead: Emily Wang', status: 'Monitoring' },
      { col1: 'CASE-4390', col2: 'Prepaid Card Cashout Network', col3: '$89,000 Exposure', col4: 'Lead: Amina Hassan', status: 'Resolved' },
    ],
    customers: [
      { col1: 'CUST-8812', col2: 'Alpha Corp Ltd (Director: Vikram Rao)', col3: 'Risk Score: 92/100', col4: 'Last Active: 2m ago', status: 'High Risk' },
      { col1: 'CUST-8740', col2: 'Apex Traders Global Pte', col3: 'Risk Score: 78/100', col4: 'Last Active: 14m ago', status: 'Elevated' },
      { col1: 'CUST-8610', col2: 'Zenith Software Systems', col3: 'Risk Score: 18/100', col4: 'Last Active: 1h ago', status: 'Normal' },
    ],
    merchants: [
      { col1: 'MERCH-0042', col2: 'Global Luxury Imports SG', col3: 'Chargeback: 1.84%', col4: 'Volume: $2.4M / mo', status: 'Under Review' },
      { col1: 'MERCH-0038', col2: 'QuickPay Digital Services', col3: 'Chargeback: 0.28%', col4: 'Volume: $8.9M / mo', status: 'Nominal' },
      { col1: 'MERCH-0029', col2: 'Pacific Pacific Travel Ltd', col3: 'Chargeback: 2.12%', col4: 'Volume: $1.1M / mo', status: 'Flagged' },
    ],
    'rules-models': [
      { col1: 'MODEL-X9', col2: 'Deep Fraud Neural Network v3.8', col3: 'Accuracy: 99.4%', col4: 'Latency: 14ms', status: 'Active' },
      { col1: 'MODEL-B4', col2: 'Bayesian Velocity Predictor', col3: 'Precision: 98.1%', col4: 'Latency: 6ms', status: 'Active' },
    ],
    alerts: [
      { col1: 'ALT-003', col2: 'High transaction volume observed in AU debit transactions', col3: 'AU Cards • 10 min ago', col4: 'Owner: Emily Wang', status: 'Monitoring' },
      { col1: 'ALT-002', col2: 'Decline rate increase in APAC credit cards', col3: 'APAC Cards • 5 min ago', col4: 'Owner: John Lee', status: 'Investigating' },
      { col1: 'ALT-005', col2: 'System downtime affecting ME card transactions', col3: 'ME Cards • 20 min ago', col4: 'Owner: Amina Hassan', status: 'Resolved' },
      { col1: 'ALT-008', col2: 'Customer request for new features in AS card app', col3: 'AS Cards • 10 min ago', col4: 'Owner: Mike Chen', status: 'Pending Review' },
      { col1: 'ALT-007', col2: 'Issue with incorrect transaction amounts on AS card statements', col3: 'APAC Cards • 15 min ago', col4: 'Owner: Sara Lee', status: 'Monitoring' },
    ],
    reports: [
      { col1: 'REP-2026-Q3', col2: 'Quarterly Risk Health & Loss Summary', col3: 'PDF (2.4 MB)', col4: 'Generated Oct 02, 2026', status: 'Ready' },
      { col1: 'REP-SAR-01', col2: 'Suspicious Activity Report Dossier - APAC Cards', col3: 'Encrypted Zip', col4: 'Generated Today', status: 'Filed' },
    ],
    compliance: [
      { col1: 'VISA-VROL', col2: 'Visa Dispute Resolution Mandate 2026.2', col3: 'Cycle: Nominal', col4: 'Compliance: 100%', status: 'Compliant' },
      { col1: 'MC-MATCH', col2: 'Mastercard Terminated Merchant Check', col3: 'Daily Sync: Complete', col4: '0 Violations', status: 'Compliant' },
      { col1: 'PCI-DSS-4', col2: 'Payment Card Industry Data Security Standard', col3: 'Annual Audit: Passed', col4: 'Seal: Verified', status: 'Compliant' },
    ],
    'admin-panel': [
      { col1: 'KEY-LIVE-01', col2: 'Production API Gateway Token', col3: 'Scope: Full Write', col4: 'Last Used: 2m ago', status: 'Active' },
      { col1: 'HOOK-ALT-02', col2: 'Slack / PagerDuty Incident Webhook', col3: 'Endpoint: Active', col4: 'Latency: 120ms', status: 'Active' },
    ],
  };

  const rows = mockRows[tab] || mockRows.transactions;

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-600 text-2xl">
              {currentMeta.icon}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {currentMeta.title}
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {currentMeta.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('overview')}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition-colors cursor-pointer"
          >
            ← Back to Overview
          </button>
          <button
            onClick={() => onShowToast('Export Started', `Exporting data for ${currentMeta.title}...`)}
            className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Export Data
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-100 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder={`Filter ${currentMeta.title.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none"
          />
        </div>
        <span className="text-xs font-medium text-slate-400 font-mono">
          Showing {rows.length} records
        </span>
      </div>

      {/* Data Table Card */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] text-slate-700 font-semibold">
                <th className="py-3 px-4">Identifier</th>
                <th className="py-3 px-4">Subject &amp; Scope</th>
                <th className="py-3 px-4">Metrics / Value</th>
                <th className="py-3 px-4">Segment / Origin</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-orange-600">{r.col1}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{r.col2}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">{r.col3}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{r.col4}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onShowToast('Record Inspected', `Loaded details for ${r.col1}`)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition-colors cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
