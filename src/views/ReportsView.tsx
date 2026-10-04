import React, { useState } from 'react';
import { formatCompactMoney } from '../data/vaultData';

interface ReportsViewProps {
  currency: string;
  region: string;
  onShowToast: (title: string, msg: string) => void;
  onNavigateToOverview: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  currency,
  region,
  onShowToast,
  onNavigateToOverview,
}) => {
  const [reportType, setReportType] = useState('Suspicious Activity Report (SAR)');
  const [selectedRange, setSelectedRange] = useState('Quarter to Date');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState<{id:string; name:string; type:string; date:string; format:string; status:string} | null>(null);

  const reportsList = [
    {
      id: 'REP-2026-Q3',
      name: 'Quarterly Risk Health & Loss Summary',
      type: 'Executive Dossier',
      date: 'Oct 02, 2026',
      format: 'PDF (2.4 MB)',
      status: 'Ready',
    },
    {
      id: 'REP-SAR-01',
      name: 'Suspicious Activity Report Dossier - APAC Cards',
      type: 'Regulatory SAR',
      date: 'Oct 01, 2026',
      format: 'Encrypted ZIP',
      status: 'Filed with FIU',
    },
    {
      id: 'REP-CHARGEBACK-88',
      name: 'Visa & Mastercard Chargeback Audit Manifest',
      type: 'Dispute Ledger',
      date: 'Sep 28, 2026',
      format: 'CSV (1.1 MB)',
      status: 'Ready',
    },
    {
      id: 'REP-PCI-40',
      name: 'PCI-DSS v4.0.1 Annual Tokenization Audit',
      type: 'Security Compliance',
      date: 'Sep 15, 2026',
      format: 'PDF (4.8 MB)',
      status: 'Certified',
    },
  ];
  const completeReports = [...reportsList, ...Array.from({length: 16}, (_, i) => ({ id: `REP-2026-${String(i + 5).padStart(2, '0')}`, name: ['Daily Transaction Reconciliation', 'Fraud Detection Activity Summary', 'Bank Settlement Status Report', 'Customer Risk Profile Audit', 'Merchant Payout Exception Report', 'KYC Verification Register', 'Cross Border Transfer Review', 'Failed Payment Investigation', 'High Risk Account Monitoring', 'Regulatory Control Evidence'][i % 10], type: ['Operations', 'Fraud Monitoring', 'Bank Reconciliation', 'Risk Audit'][i % 4], date: `Sep ${String(27 - i % 20).padStart(2, '0')}, 2026`, format: i % 2 ? 'DOCX' : 'PDF', status: i % 5 === 0 ? 'In Review' : 'Ready' }))];
  const downloadDocument = (format: 'pdf' | 'word') => {
    if (!selectedReport) return;
    const content = `${selectedReport.name}\n${selectedReport.id}\n${selectedReport.type}\nGenerated: ${selectedReport.date}\nRegion: ${region} | Currency: ${currency}\n\nThis report contains the risk monitoring and payment activity summary for the selected reporting period.`;
    if (format === 'word') {
      const blob = new Blob([`<html><body><h1>${selectedReport.name}</h1><p>${content.replace(/\n/g, '<br/>')}</p></body></html>`], { type: 'application/msword' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${selectedReport.id}.doc`; a.click(); URL.revokeObjectURL(a.href);
    } else {
      const w = window.open('', '_blank');
      if (w) { w.document.write(`<html><head><title>${selectedReport.name}</title><style>body{font:14px Arial;padding:48px;color:#172033}h1{font-size:24px}pre{white-space:pre-wrap;font:14px Arial}</style></head><body><h1>${selectedReport.name}</h1><pre>${content}</pre><script>window.print()</script></body></html>`); w.document.close(); }
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    onShowToast('Compiling Regulatory Data', `Extracting transactions and cryptographic hashes for ${region}...`);

    setTimeout(() => {
      setIsGenerating(false);
      setSelectedReport({ id: `REP-${Date.now()}`, name: reportType, type: 'Custom report', date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }), format: 'PDF / Word', status: 'Ready' });
      onShowToast(
        'Report Generated',
        `Your ${reportType} is ready to view or download.`
      );
    }, 1200);
  };

  return (
    <>
    <div className="p-8 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">description</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Risk &amp; Audit Compliance Reports
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Generate audit-ready SAR dossiers, chargeback manifests, and Basel III reports in {currency}
          </p>
        </div>

        <button
          onClick={onNavigateToOverview}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          ← Back to Overview
        </button>
      </div>

      {/* On-Demand Report Generator Builder */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Generate Custom Regulatory Report
          </h3>
          <p className="text-xs text-slate-500">
            Instantaneous compilation of filtered telemetry into audit-certified PDF/CSV
          </p>
        </div>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Report Standard</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
            >
              <option value="Suspicious Activity Report (SAR)">Suspicious Activity Report (SAR)</option>
              <option value="Executive Risk Health Overview">Executive Risk Health Overview</option>
              <option value="Merchant Chargeback Portfolio">Merchant Chargeback Portfolio</option>
              <option value="KYC Bank Identity Proof Audit">KYC Bank Identity Proof Audit</option>
              <option value="PCI-DSS Cryptographic Manifest">PCI-DSS Cryptographic Manifest</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Time Horizon</label>
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
            >
              <option value="Last 24 hours">Last 24 hours</option>
              <option value="Last 7 days">Last 7 days</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="Quarter to Date">Quarter to Date</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Routing Scope &amp; Currency</label>
            <input
              type="text"
              readOnly
              value={`${region} (${currency})`}
              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-mono font-medium"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isGenerating ? (
                <span>Compiling Dossier...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>Export Official PDF</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Reports Repository */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 overflow-hidden">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Archived &amp; Certified Report Manifests
        </h3>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] text-slate-700 font-semibold">
                <th className="py-3 px-4">Report Identifier</th>
                <th className="py-3 px-4">Title &amp; Classification</th>
                <th className="py-3 px-4">Generated Date</th>
                <th className="py-3 px-4">Payload Format</th>
                <th className="py-3 px-4">Regulatory Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {completeReports.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-orange-600">{r.id}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{r.name}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{r.type}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono">{r.date}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">{r.format}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedReport(r)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    {selectedReport && <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"><div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4"><div className="flex justify-between"><div><div className="text-xs text-orange-600 font-mono">{selectedReport.id}</div><h2 className="text-xl font-bold mt-1">{selectedReport.name}</h2></div><button onClick={() => setSelectedReport(null)} className="text-slate-500">✕</button></div><p className="text-sm text-slate-600">{selectedReport.type} · {selectedReport.date} · {region} · {currency}</p><div className="rounded-xl bg-slate-50 border p-4 text-sm text-slate-700">Risk monitoring report preview<br/>Transactions reviewed: 1,284<br/>Flagged for review: 38<br/>Processing: 12<br/>Failed: 7</div><div className="flex gap-3"><button onClick={() => downloadDocument('pdf')} className="px-4 py-2 rounded-lg bg-orange-600 text-white">Download / Print PDF</button><button onClick={() => downloadDocument('word')} className="px-4 py-2 rounded-lg bg-slate-900 text-white">Download Word</button></div></div></div>}
    </>
  );
};
