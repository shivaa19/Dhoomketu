import React, { useState } from 'react';
import { ViewMode } from '../types';

interface RegulatoryIntelViewProps {
  onNavigate: (view: ViewMode) => void;
  onShowToast: (title: string, msg: string, icon?: string) => void;
}

export const RegulatoryIntelView: React.FC<RegulatoryIntelViewProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const [selectedDoc, setSelectedDoc] = useState('AML-04');

  const policies = [
    {
      id: 'AML-04',
      name: 'AML Transaction Monitoring Manual - Sec 4.2',
      authority: 'FIU-IND / RBI Master Direction',
      statute: 'Prevention of Money Laundering Act (PMLA) 2002, Sec 12',
      trigger: 'Rapid Dissipation & Structuring below ₹10,00,000 threshold',
      mandate:
        'Accounts demonstrating rapid dissipation of newly credited funds without apparent commercial rationale or historical precedent must be subjected to enhanced scrutiny and reported via Form STR-01 to FIU within 7 banking days.',
      confidence: '99.4% Deterministic Match',
    },
    {
      id: 'RBI-MD-2024',
      name: 'RBI Master Directions on Know Your Customer (KYC)',
      authority: 'Reserve Bank of India (RBI)',
      statute: 'Section 35A of the Banking Regulation Act, 1949',
      trigger: 'Beneficial Ownership & High-Risk Entity Screening',
      mandate:
        'Banks shall identify the beneficial owner and take all reasonable steps to verify their identity using reliable and independent sources. For accounts categorized as high-risk, periodic enhanced due diligence (EDD) must be undertaken at least once every six months.',
      confidence: '96.2% Semantic Relevance',
    },
    {
      id: 'FATF-REC-16',
      name: 'FATF Recommendation 16 - Wire Transfers (Travel Rule)',
      authority: 'Financial Action Task Force (FATF)',
      statute: 'International Standards on Combating Money Laundering',
      trigger: 'Cross-Border Wire Transfers exceeding USD/EUR 1,000 threshold',
      mandate:
        'Countries should ensure that financial institutions include required and accurate originator information, and required beneficiary information, on wire transfers and related messages throughout the payment chain.',
      confidence: '94.8% Cross-Corridor Relevance',
    },
  ];

  return (
    <div className="flex flex-col w-full px-space-lg py-space-md gap-space-lg text-on-surface">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-sm bg-surface-container-low/40 p-space-md rounded-xl border border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-[24px]">policy</span>
            <h1 className="font-headline-md text-headline-md text-on-surface">Regulatory Intelligence Engine</h1>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant font-mono mt-0.5">
            Vectorized statutory mandates • RAG-indexed knowledge graph for FIU-IND, RBI &amp; FATF
          </p>
        </div>
        <button
          onClick={() => onShowToast('Re-indexing', 'Re-embedded 42 statutory corpora via Gemini Vector RAG.', 'sync')}
          className="h-8 px-space-md bg-surface-container-high hover:bg-surface-bright text-primary rounded font-label-sm text-label-sm flex items-center gap-1 cursor-pointer font-mono border border-primary/20"
        >
          <span className="material-symbols-outlined text-[16px]">sync</span>
          <span>Re-Index Corpus</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
        {policies.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedDoc(p.id)}
            className={`p-space-lg rounded-xl bg-surface-container hover:bg-surface-container-high transition-all cursor-pointer border flex flex-col justify-between gap-space-md ${
              selectedDoc === p.id ? 'border-primary shadow-xl bg-surface-container-high' : 'border-outline-variant/20'
            }`}
          >
            <div>
              <div className="flex items-center justify-between font-mono text-label-sm mb-2">
                <span className="font-bold text-primary">{p.id}</span>
                <span className="px-2 py-0.5 rounded bg-tertiary/15 text-tertiary font-bold">{p.confidence}</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">{p.name}</h2>
              <div className="text-label-sm font-mono text-secondary mt-1">{p.authority}</div>
              <div className="mt-3 p-2 bg-surface-container-lowest rounded border border-outline-variant/10 text-body-sm text-on-surface-variant italic">
                "{p.mandate}"
              </div>
            </div>

            <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between font-mono text-label-sm">
              <span className="text-on-surface-variant">{p.statute}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('ai-copilot');
                }}
                className="text-primary hover:underline font-semibold"
              >
                Cite in Copilot →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
