import React from 'react';
import { VaultNavTab } from '../types';

interface VaultSidebarProps {
  currentTab: VaultNavTab;
  onTabChange: (tab: VaultNavTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const VaultSidebar: React.FC<VaultSidebarProps> = ({
  currentTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navItems: Array<{
    id: VaultNavTab;
    label: string;
    icon: string;
    badge?: string;
  }> = [
    { id: 'overview', label: 'Overview', icon: 'grid_view' },
    { id: 'id-proofs', label: 'Bank ID Proofs', icon: 'badge', badge: '6' },
    { id: 'transactions', label: 'Transactions', icon: 'swap_horiz' },
    { id: 'banks', label: 'Banks', icon: 'account_balance' },
    { id: 'ai-copilot', label: 'AI Fraud Sentinel', icon: 'psychology', badge: 'AI' },
    { id: 'fraud-detection', label: 'Fraud Detection', icon: 'shield_with_heart' },
    { id: 'investigations', label: 'Investigations', icon: 'find_in_page' },
    { id: 'customers', label: 'Customers', icon: 'group' },
    { id: 'merchants', label: 'Merchants', icon: 'storefront' },
    { id: 'rules-models', label: 'Rules & Models', icon: 'tune' },
    { id: 'alerts', label: 'Alerts', icon: 'warning' },
    { id: 'reports', label: 'Reports', icon: 'description' },
    { id: 'compliance', label: 'Compliance', icon: 'verified_user' },
    { id: 'admin-panel', label: 'Admin Panel', icon: 'space_dashboard' },
  ];

  return (
    <aside
      className={`bg-[#1e293b] text-slate-300 flex flex-col justify-between transition-all duration-300 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-4 space-y-4">
        {/* Hide Panel Button */}
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#283548] hover:bg-[#334155] text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">
            {isCollapsed ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left'}
          </span>
          {!isCollapsed && <span>Hide Panel</span>}
        </button>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#334155] text-white shadow-xs font-semibold ring-1 ring-slate-600/50'
                    : 'text-slate-400 hover:bg-[#283548]/70 hover:text-slate-200'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span
                    className={`material-symbols-outlined text-[19px] shrink-0 ${
                      isActive ? 'text-orange-400' : 'text-slate-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isActive ? 'bg-orange-500 text-white' : 'bg-slate-700 text-orange-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Subtle version footnote in sidebar */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-700/50 text-[11px] text-slate-500 font-mono">
          Dhoomketu OS v2.4 • Active
        </div>
      )}
    </aside>
  );
};
