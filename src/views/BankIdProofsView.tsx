import React, { useState } from 'react';
import { BankIdProof } from '../types';

interface BankIdProofsViewProps {
  idProofs: BankIdProof[];
  onSelectProof: (doc: BankIdProof) => void;
  onOpenUploadModal: () => void;
  onUpdateStatus: (id: string, newStatus: BankIdProof['status']) => void;
  onShowToast: (title: string, msg: string) => void;
  onNavigateToOverview: () => void;
}

export const BankIdProofsView: React.FC<BankIdProofsViewProps> = ({
  idProofs,
  onSelectProof,
  onOpenUploadModal,
  onUpdateStatus,
  onShowToast,
  onNavigateToOverview,
}) => {
  const [search, setSearch] = useState('');
  const [selectedBank, setSelectedBank] = useState('All Banks');
  const [selectedDocType, setSelectedDocType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Stats calculation
  const totalDocs = idProofs.length;
  const verifiedDocs = idProofs.filter((d) => d.status === 'Verified').length;
  const flaggedDocs = idProofs.filter((d) => d.status === 'Flagged / Mismatch').length;
  const pendingDocs = idProofs.filter((d) => d.status === 'Pending Review').length;

  const banks = [
    'All Banks',
    'Corp Bank IN - Mumbai Fort',
    'Commonwealth Bank of Australia (AU Cards)',
    'DBS Bank Singapore',
    'Mizuho Bank / JCB International',
    'OCBC Bank Singapore',
  ];

  const docTypes = [
    'All Types',
    'Passport',
    'Certificate of Incorporation',
    'National ID',
    'Driving License',
    'Tax ID / PAN',
  ];

  const filteredProofs = idProofs.filter((doc) => {
    const matchesSearch =
      doc.customerName.toLowerCase().includes(search.toLowerCase()) ||
      doc.accountNumber.toLowerCase().includes(search.toLowerCase()) ||
      doc.docNumberMasked.toLowerCase().includes(search.toLowerCase()) ||
      doc.id.toLowerCase().includes(search.toLowerCase());

    const matchesBank =
      selectedBank === 'All Banks' || doc.bankName.toLowerCase().includes(selectedBank.toLowerCase().split(' ')[0]);

    const matchesType =
      selectedDocType === 'All Types' || doc.docType === selectedDocType;

    const matchesStatus =
      selectedStatus === 'All' || doc.status === selectedStatus;

    return matchesSearch && matchesBank && matchesType && matchesStatus;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto select-none">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">badge</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Bank ID Proof &amp; KYC Verification Vault
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Institutional repository for customer identity proofs, corporate incorporations, and automated biometric audits
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
            onClick={onOpenUploadModal}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
            <span>Verify New ID Proof</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Total Bank ID Proofs</span>
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-600 material-symbols-outlined text-base">
              inventory_2
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">{totalDocs}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Registered across 5 partner banking units
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">AI-Vision Verified</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 material-symbols-outlined text-base">
              verified
            </span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono">{verifiedDocs}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Avg match score: 99.1% with SHA-256 seal
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Flagged / Mismatch</span>
            <span className="p-1.5 rounded-lg bg-red-50 text-red-600 material-symbols-outlined text-base">
              warning
            </span>
          </div>
          <div className="text-2xl font-extrabold text-red-600 font-mono">{flaggedDocs}</div>
          <div className="text-[11px] text-red-500 font-medium mt-1">
            High risk: shell entity / watchlisted address
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Pending Attestation</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 material-symbols-outlined text-base">
              hourglass_top
            </span>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono">{pendingDocs}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Requires manual operator sign-off
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search by customer name, account number, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Tabs */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            {['All', 'Verified', 'Flagged / Mismatch', 'Pending Review'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'Flagged / Mismatch' ? 'Flagged' : st}
              </button>
            ))}
          </div>

          {/* Doc Type Selector */}
          <select
            value={selectedDocType}
            onChange={(e) => setSelectedDocType(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:bg-white focus:outline-none cursor-pointer"
          >
            {docTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Bank Selector */}
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:bg-white focus:outline-none cursor-pointer"
          >
            {banks.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Export Report */}
          <button
            onClick={() => onShowToast('Export Generated', 'Downloaded Bank_Customer_ID_Proof_Audit.csv')}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 cursor-pointer shadow-2xs"
            title="Export CSV"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
          </button>
        </div>
      </div>

      {/* ID Proofs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProofs.map((doc) => {
          const isVerified = doc.status === 'Verified';
          const isFlagged = doc.status === 'Flagged / Mismatch';

          return (
            <div
              key={doc.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top Badge & Status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                      {doc.id}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {doc.docType}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      isVerified
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : isFlagged
                        ? 'bg-red-50 text-red-700 border border-red-200/60 animate-pulse'
                        : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span>{doc.status}</span>
                  </span>
                </div>

                {/* Customer & Bank Info */}
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                  {doc.customerName}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Acc: <span className="font-semibold text-slate-700">{doc.accountNumber}</span>
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  Bank: {doc.bankName}
                </p>

                {/* Masked Doc Card Simulation */}
                <div className="mt-4 p-3.5 bg-slate-900 text-white rounded-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-2">
                    <span>{doc.docType.toUpperCase()}</span>
                    <span className={isVerified ? 'text-emerald-400 font-bold' : isFlagged ? 'text-red-400 font-bold' : 'text-amber-400'}>
                      {doc.matchScore}% MATCH
                    </span>
                  </div>
                  <div className="font-mono text-sm tracking-wider font-bold text-orange-400">
                    {doc.docNumberMasked}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
                    <span className="truncate max-w-[150px]">{doc.issuingAuthority}</span>
                    <span>EXP: {doc.expiryDate}</span>
                  </div>
                </div>

                {/* OCR Metadata preview */}
                <div className="mt-3 space-y-1 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span>Legal Name:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                      {doc.extractedName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Jurisdiction:</span>
                    <span className="font-semibold text-slate-800">{doc.issuingCountry}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                    <span>Tamper Checksum:</span>
                    <span className="truncate max-w-[120px]">{doc.checksum}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectProof(doc)}
                  className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  <span>Inspect ID Proof</span>
                </button>

                <div className="flex items-center gap-1">
                  {!isVerified && (
                    <button
                      onClick={() => {
                        onUpdateStatus(doc.id, 'Verified');
                        onShowToast('Document Approved', `${doc.id} marked as Verified.`);
                      }}
                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      title="Approve ID"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </button>
                  )}
                  {!isFlagged && (
                    <button
                      onClick={() => {
                        onUpdateStatus(doc.id, 'Flagged / Mismatch');
                        onShowToast('Document Flagged', `${doc.id} flagged for compliance mismatch.`);
                      }}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      title="Flag Mismatch"
                    >
                      <span className="material-symbols-outlined text-[16px]">flag</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProofs.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-2xs space-y-3">
          <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
          <h3 className="text-base font-bold text-slate-800">No bank ID proofs match your search</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try resetting your search query, or upload a new identity proof into the bank verification queue.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedBank('All Banks');
              setSelectedDocType('All Types');
              setSelectedStatus('All');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
