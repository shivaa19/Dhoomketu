import React from 'react';
import { SHIELD_LOGO_URL } from '../data/mockData';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onOpenGateway: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onOpenGateway }) => {
  const navItems: Array<{
    id: ViewMode;
    label: string;
    icon: string;
    badge?: string;
    badgeClass?: string;
  }> = [
    { id: 'overview', label: 'Overview', icon: 'space_dashboard', badge: 'Live', badgeClass: 'bg-surface-container-high text-on-surface-variant' },
    { id: 'ai-copilot', label: 'AI Copilot', icon: 'psychology', badge: 'RAG', badgeClass: 'bg-primary/20 text-primary font-bold' },
    { id: 'transactions', label: 'Transactions', icon: 'swap_horiz', badge: '142k', badgeClass: 'bg-surface-container-high text-on-surface-variant' },
    { id: 'accounts', label: 'Accounts', icon: 'account_balance', badge: 'ACC-10482', badgeClass: 'bg-primary/20 text-primary' },
    { id: 'risk-signals', label: 'Risk Signals', icon: 'bolt', badge: '42 Alert', badgeClass: 'bg-error/20 text-error font-semibold' },
    { id: 'investigations', label: 'Investigations', icon: 'folder_supervised', badge: '7 Open', badgeClass: 'bg-surface-container-high text-on-surface-variant' },
    { id: 'regulatory-intelligence', label: 'Regulatory Intel', icon: 'policy' },
    { id: 'findings', label: 'Findings', icon: 'assignment_late', badge: '12', badgeClass: 'bg-surface-container-high text-on-surface-variant' },
    { id: 'reports', label: 'Reports', icon: 'summarize' },
    { id: 'audit-trail', label: 'Audit Trail', icon: 'receipt_long', badge: 'Hash OK', badgeClass: 'bg-tertiary/20 text-tertiary' },
    { id: 'id-proofs', label: 'Bank ID Proofs', icon: 'badge', badge: '6 KYC', badgeClass: 'bg-secondary/20 text-secondary' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-surface-container-low flex flex-col z-50 shadow-[0_1px_8px_rgba(0,0,0,0.24)] border-r border-outline-variant/20">
      {/* Brand & Live Engine Status */}
      <div className="p-space-lg bg-surface-container-lowest/60">
        <div 
          className="flex items-center gap-space-md cursor-pointer group"
          onClick={() => onNavigate('overview')}
        >
          <img
            alt="RiskGuard AI Shield Logo"
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            src={SHIELD_LOGO_URL}
          />
          <div className="flex flex-col min-w-0">
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight truncate">
              RiskGuard AI
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
              Enterprise AML &amp; Risk Sentinel
            </span>
          </div>
        </div>

        <div className="mt-space-md flex items-center justify-between bg-surface-container px-space-md py-space-xs rounded">
          <div className="flex items-center gap-space-xs">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            <span className="font-label-sm text-label-sm text-tertiary tracking-wide uppercase font-semibold">
              LIVE ENGINE
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">14ms latency</span>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-space-md py-space-md space-y-1">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-space-md py-space-sm rounded transition-colors text-left ${
                isActive
                  ? 'bg-primary-container text-on-primary-container font-semibold shadow-inner'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <div className="flex items-center gap-space-md">
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span className="font-body-md text-body-md">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`font-label-sm text-label-sm px-space-xs py-0.5 rounded font-mono ${
                    isActive ? 'bg-primary/20 text-on-primary-container font-bold' : item.badgeClass || ''
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-2 border-t border-outline-variant/20 mt-2">
          <button
            onClick={onOpenGateway}
            className={`w-full flex items-center justify-between px-space-md py-space-sm rounded transition-colors text-left ${
              currentView === 'gateway'
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-inner'
                : 'text-primary/90 hover:bg-surface-container hover:text-primary'
            }`}
          >
            <div className="flex items-center gap-space-md">
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span className="font-body-md text-body-md font-semibold">Gateway Sign-In</span>
            </div>
            <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-primary/10 text-primary font-mono">
              v4.9
            </span>
          </button>
        </div>
      </nav>

      {/* Lead Investigator Operator Footer */}
      <div className="p-space-md bg-surface-container-lowest/80 border-t border-outline-variant/20 flex flex-col gap-space-sm">
        <div className="flex items-center gap-space-md">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-label-md font-bold shadow-sm">
            <span className="material-symbols-outlined text-[16px]">shield_person</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-body-sm text-body-sm text-on-surface font-semibold truncate">
              Vikram Rao
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
              Lead AML Investigator
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-space-xs">
          <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-secondary-container/40 text-secondary font-medium">
            Compliance Officer L3
          </span>
          <span className="font-label-sm text-label-sm text-tertiary font-medium font-mono">
            99.98% Model
          </span>
        </div>
      </div>
    </aside>
  );
};
