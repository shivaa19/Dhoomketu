import React, { useState } from 'react';
import { BankIdProof } from '../types';

interface UploadIdProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (proof: BankIdProof) => void;
  onShowToast: (title: string, msg: string) => void;
}

export const UploadIdProofModal: React.FC<UploadIdProofModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  onShowToast,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('Corp Bank IN - Mumbai Fort');
  const [docType, setDocType] = useState<BankIdProof['docType']>('Passport');
  const [docNumber, setDocNumber] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('');
  const [issuingCountry, setIssuingCountry] = useState('India');
  const [dob, setDob] = useState('1988-06-15');
  const [address, setAddress] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    if (!customerName) {
      setCustomerName('Aarav Mehta');
      setAccountNumber('ACC-11942');
      setDocNumber('Z9821408');
      setIssuingAuthority('Regional Passport Office, Mumbai');
      setAddress('Flat 502, Sea Green Apts, Worli Sea Face, Mumbai 400030');
    }
    setIsScanning(true);
    onShowToast('AI OCR Vision Scanning', 'Analyzing document texture, holographic tamper seals, and MRZ code...');

    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      onShowToast('OCR Extraction Complete', 'Biometric confidence: 99.2% • No digital tampering detected');
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const maskedNum =
      docNumber.length > 4
        ? docNumber.slice(0, 2) + '••••' + docNumber.slice(-3)
        : docNumber + '••••';

    const newProof: BankIdProof = {
      id: `DOC-${Math.floor(8000 + Math.random() * 2000)}-01`,
      customerName: customerName || 'Aarav Mehta',
      accountNumber: accountNumber || 'ACC-11942',
      bankName,
      docType,
      docNumberMasked: maskedNum,
      issuingAuthority: issuingAuthority || 'Government Regulatory Authority',
      issuingCountry,
      issueDate: '01 Jan 2023',
      expiryDate: '01 Jan 2033',
      status: 'Verified',
      matchScore: 98.8,
      extractedName: customerName || 'Aarav Mehta',
      extractedDob: dob || '15-06-1988',
      extractedAddress: address || 'Corporate Banking Client Registry, Mumbai',
      checksum: `sha256:${Math.random().toString(16).substring(2, 10)}...sealed`,
      uploadedAt: 'Just now',
      verifiedBy: 'AI Biometric & Bank OCR Gateway (Auto-Approved)',
    };

    onUpload(newProof);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-orange-600 text-xl">badge</span>
              <span className="text-xs font-mono font-bold text-orange-600 uppercase">
                Bank Identity Proof Verification
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Submit Customer ID Proof for KYC Clearance
            </h3>
            <p className="text-xs text-slate-500">
              Automated OCR ingestion and cryptographic SHA-256 seal generation for banking records
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Scan Helper Button */}
        <div className="p-3 bg-orange-50/70 border border-orange-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-orange-600 text-lg">document_scanner</span>
            <div>
              <span className="font-bold text-orange-950 block">Auto-Fill &amp; Simulate OCR Vision</span>
              <span className="text-orange-700 text-[11px] block">Test instantaneous bank document extraction</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSimulateScan}
            disabled={isScanning}
            className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            {isScanning ? 'Scanning...' : 'Simulate OCR'}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Name */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Customer / Entity Legal Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Aarav Mehta / Global Tech Ltd"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Bank Account / IBAN *
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g. ACC-11942"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bank Name */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Target Bank &amp; Branch *
              </label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-orange-500 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="Corp Bank IN - Mumbai Fort">Corp Bank IN - Mumbai Fort</option>
                <option value="Commonwealth Bank (AU Cards)">Commonwealth Bank (AU Cards)</option>
                <option value="DBS Bank Singapore">DBS Bank Singapore</option>
                <option value="Barclays UK - London HQ">Barclays UK - London HQ</option>
                <option value="Mizuho Bank Tokyo">Mizuho Bank Tokyo</option>
              </select>
            </div>

            {/* Document Type */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                ID Proof Document Type *
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as BankIdProof['docType'])}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-orange-500 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="Passport">Passport (MRZ Biometric)</option>
                <option value="National ID">National ID / Aadhaar / Gov ID</option>
                <option value="Driving License">Driving License</option>
                <option value="Certificate of Incorporation">Certificate of Incorporation (CIN / UEN)</option>
                <option value="Tax ID / PAN">Tax ID / PAN / W-8BEN</option>
                <option value="Proof of Address">Proof of Address / Utility Seal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Document Number */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Document Identification Number *
              </label>
              <input
                type="text"
                required
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder="e.g. Z9821408 or DL-99201"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Issuing Jurisdiction */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Issuing Country / Jurisdiction
              </label>
              <input
                type="text"
                value={issuingCountry}
                onChange={(e) => setIssuingCountry(e.target.value)}
                placeholder="e.g. India / Australia / Singapore"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Registered Residential / Corporate Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 402 Trade Centre, Nariman Point, Mumbai"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Scan Preview Card */}
          {scanComplete && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
                <span className="font-semibold text-xs">OCR Confidence: 99.4% Match Verified</span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-100/80 px-2 py-0.5 rounded text-emerald-700">
                SHA-256 Verified
              </span>
            </div>
          )}

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">verified</span>
              <span>Register &amp; Verify ID Proof</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
