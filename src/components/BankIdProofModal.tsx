import React from 'react';
import { BankIdProof } from '../types';

interface BankIdProofModalProps {
  doc: BankIdProof | null;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: BankIdProof['status']) => void;
  onShowToast: (title: string, msg: string) => void;
}

export const BankIdProofModal: React.FC<BankIdProofModalProps> = ({
  doc,
  onClose,
  onUpdateStatus,
  onShowToast,
}) => {
  if (!doc) return null;

  const isVerified = doc.status === 'Verified';
  const isFlagged = doc.status === 'Flagged / Mismatch';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                {doc.id}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {doc.docType}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  isVerified
                    ? 'bg-emerald-50 text-emerald-700'
                    : isFlagged
                    ? 'bg-red-50 text-red-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {doc.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {doc.customerName}
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Account: {doc.accountNumber} • Bank: {doc.bankName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Visual Document Verification Card Preview */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden shadow-lg border border-slate-700">
          <div className="absolute right-0 top-0 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col justify-between h-44">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-400 text-2xl">badge</span>
                <div>
                  <span className="text-xs font-mono tracking-widest text-slate-300 uppercase block">
                    BANK KYC VERIFICATION PROOF
                  </span>
                  <span className="text-sm font-bold text-white block">{doc.docType}</span>
                </div>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="text-emerald-400 font-bold block">{doc.matchScore}% Match Score</span>
                <span className="text-slate-400 text-[10px]">AI OCR Confirmed</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-slate-400">DOCUMENT NUMBER (MASKED)</div>
              <div className="text-lg font-mono font-bold tracking-wider text-orange-300">
                {doc.docNumberMasked}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-700/60 pt-2">
              <span>ISSUED BY: {doc.issuingAuthority}</span>
              <span>EXP: {doc.expiryDate}</span>
            </div>
          </div>
        </div>

        {/* Extracted OCR Information Breakdown */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-sm">Extracted OCR Metadata</span>
            <span className="text-[11px] font-mono text-slate-500">Tamper Seal: {doc.checksum}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Legal Name on Document</span>
              <span className="font-bold text-slate-900 text-sm block">{doc.extractedName}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Date of Birth / Formation</span>
              <span className="font-bold text-slate-900 font-mono text-sm block">{doc.extractedDob}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 sm:col-span-2">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Registered Residential / Corporate Address</span>
              <span className="text-slate-800 font-medium block">{doc.extractedAddress}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Issuing Jurisdiction</span>
              <span className="font-bold text-slate-900 block">{doc.issuingCountry}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Verification Engine &amp; Auditor</span>
              <span className="font-semibold text-slate-800 block truncate">{doc.verifiedBy}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            {!isVerified && (
              <button
                onClick={() => {
                  onUpdateStatus(doc.id, 'Verified');
                  onShowToast('Document Verified', `${doc.customerName}'s ${doc.docType} has been manually approved.`);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Approve &amp; Verify
              </button>
            )}

            {!isFlagged && (
              <button
                onClick={() => {
                  onUpdateStatus(doc.id, 'Flagged / Mismatch');
                  onShowToast('Document Flagged', `${doc.id} flagged for enhanced compliance scrutiny.`);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Flag for Mismatch
              </button>
            )}

            <button
              onClick={() => {
                onShowToast('Re-Running Biometric Match', 'Verifying facial match against passport biometric chip...');
              }}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Re-Run Biometric Scan
            </button>
          </div>

          <button
            onClick={() => {
              onShowToast('PDF Exported', `Downloaded ${doc.id}_Certified_Bank_Proof.pdf`);
            }}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export Certified ID PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
