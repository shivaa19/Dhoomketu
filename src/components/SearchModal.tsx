import React, { useState } from 'react';
import { ViewMode } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (view: ViewMode, query?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectResult }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const quickItems = [
    { title: 'ACC-10482 (Alpha Corp Ltd)', subtitle: 'Tier-1 High Risk • 8 outbound txs in 42m', type: 'Account', view: 'accounts' as ViewMode },
    { title: 'TX-9281 (₹9,80,000.00)', subtitle: 'IMPS Outward to DBS Singapore • Threshold Structuring', type: 'Transaction', view: 'transactions' as ViewMode },
    { title: 'AML-04 Section 4.2', subtitle: 'Rapid Dissipation & Structuring Mandate', type: 'Policy', view: 'regulatory-intelligence' as ViewMode },
    { title: 'Finding RF-2026-00481', subtitle: 'Pending Sign-off • Critical Structuring', type: 'Finding', view: 'findings' as ViewMode },
    { title: 'Why was ACC-10482 flagged?', subtitle: 'Run AI Copilot Heuristic Reasoning Query', type: 'Copilot', view: 'ai-copilot' as ViewMode },
  ];

  const filtered = searchTerm
    ? quickItems.filter(
        (i) =>
          i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : quickItems;

  return (
    <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md flex items-start justify-center pt-24 p-space-lg animate-in fade-in">
      <div className="bg-surface-container-low border border-outline-variant/40 max-w-2xl w-full rounded-xl shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 bg-surface-container border-b border-outline-variant/30">
          <span className="material-symbols-outlined text-primary text-[22px] mr-3">search</span>
          <input
            autoFocus
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search accounts (ACC-*), transactions (TX-*), policies, rules..."
            className="w-full bg-transparent text-on-surface placeholder:text-outline focus:outline-none font-body-md text-body-md"
          />
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface text-label-sm font-mono px-2 py-1 bg-surface-container-high rounded"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-space-md max-h-96 overflow-y-auto space-y-1">
          <div className="text-label-sm font-label-sm text-on-surface-variant uppercase px-2 mb-2 font-mono">
            {searchTerm ? 'Search Results' : 'Suggested Entities & Queries'}
          </div>
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-on-surface-variant font-body-md">
              No matching records found for "{searchTerm}".
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelectResult(item.view, item.title);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-high cursor-pointer transition-colors group"
              >
                <div>
                  <div className="font-semibold text-on-surface group-hover:text-primary transition-colors flex items-center gap-2">
                    <span>{item.title}</span>
                  </div>
                  <div className="text-on-surface-variant text-body-sm mt-0.5">{item.subtitle}</div>
                </div>
                <span className="text-label-sm font-label-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono">
                  {item.type}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-surface-container-lowest border-t border-outline-variant/20 flex justify-between text-label-sm font-label-sm text-on-surface-variant font-mono">
          <span>Navigate with arrows or click</span>
          <span>ENTER to inspect</span>
        </div>
      </div>
    </div>
  );
};
