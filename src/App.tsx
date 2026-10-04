import React, { useState } from 'react';
import { BankIdProof, OperatorProfile, VaultNavTab, AlertIncident } from './types';
import { INITIAL_ALERTS, INITIAL_BANK_ID_PROOFS, CURRENT_OPERATOR, INITIAL_TRANSACTIONS, VaultTransaction } from './data/vaultData';
import { VaultHeader } from './components/VaultHeader';
import { VaultSidebar } from './components/VaultSidebar';
import { VaultLogin } from './components/VaultLogin';
import { VaultOverviewView } from './views/VaultOverviewView';
import { BankIdProofsView } from './views/BankIdProofsView';
import { TransactionsView } from './views/TransactionsView';
import { FraudDetectionView } from './views/FraudDetectionView';
import { InvestigationsView } from './views/InvestigationsView';
import { CustomersView } from './views/CustomersView';
import { MerchantsView } from './views/MerchantsView';
import { RulesModelsView } from './views/RulesModelsView';
import { AlertsView } from './views/AlertsView';
import { ReportsView } from './views/ReportsView';
import { ComplianceView } from './views/ComplianceView';
import { AdminPanelView } from './views/AdminPanelView';
import { AiFraudCopilotView } from './views/AiFraudCopilotView';
import { UserProfileView } from './views/UserProfileView';
import { BanksView } from './views/BanksView';

import { CreateAlertModal } from './components/CreateAlertModal';
import { IncidentDrawer } from './components/IncidentDrawer';
import { BankIdProofModal } from './components/BankIdProofModal';
import { UploadIdProofModal } from './components/UploadIdProofModal';
import { FilterModal, DetailsModal, ComparePeriodsModal } from './components/VaultModals';
import { NotificationsModal } from './components/NotificationsModal';
import { SettingsModal } from './components/SettingsModal';
import { AiChatBotDrawer } from './components/AiChatBotDrawer';

export default function App() {
  // Session & Operator state
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('riskguard-session') === 'active');
  const [operator, setOperator] = useState<OperatorProfile>(CURRENT_OPERATOR);

  // Layout & Navigation states
  const [currentTab, setCurrentTab] = useState<VaultNavTab>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFramedMode, setIsFramedMode] = useState(false);

  // Top header states
  const [region, setRegion] = useState('EU Payments');
  const [timeRange, setTimeRange] = useState('Last 24 hours');
  const [currency, setCurrency] = useState('USD');
  const [searchTerm, setSearchTerm] = useState('');

  // Alerts data state
  const [alerts, setAlerts] = useState<AlertIncident[]>(INITIAL_ALERTS);

  // Bank ID Proofs state
  const [idProofs, setIdProofs] = useState<BankIdProof[]>(INITIAL_BANK_ID_PROOFS);
  const [selectedProof, setSelectedProof] = useState<BankIdProof | null>(null);
  const [isUploadProofOpen, setIsUploadProofOpen] = useState(false);

  // Modals & Drawer states
  const [isCreateAlertOpen, setIsCreateAlertOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<AlertIncident | null>(null);

  // AI Chat Bot state
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [aiChatTargetTx, setAiChatTargetTx] = useState<VaultTransaction | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ title: string; msg: string } | null>(null);

  const showToast = (title: string, msg: string) => {
    setToast({ title, msg });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  const handleCreateAlert = (newAlert: AlertIncident) => {
    setAlerts([newAlert, ...alerts]);
    showToast('Alert Created', `${newAlert.code} added to active monitoring queue.`);
  };

  const handleUpdateStatus = (alertId: string, newStatus: AlertIncident['status']) => {
    setAlerts(
      alerts.map((a) => (a.id === alertId ? { ...a, status: newStatus } : a))
    );
    if (selectedIncident && selectedIncident.id === alertId) {
      setSelectedIncident({ ...selectedIncident, status: newStatus });
    }
  };

  const handleUpdateIdProofStatus = (id: string, newStatus: BankIdProof['status']) => {
    setIdProofs(
      idProofs.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
    if (selectedProof && selectedProof.id === id) {
      setSelectedProof({ ...selectedProof, status: newStatus });
    }
  };

  const handleAddIdProof = (newProof: BankIdProof) => {
    setIdProofs([newProof, ...idProofs]);
    showToast('Bank ID Proof Registered', `${newProof.customerName} (${newProof.id}) added to KYC verification queue.`);
  };

  const filteredAlerts = alerts.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.segment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.owner.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dedicated Login View
  if (!isLoggedIn) {
    if (currentTab === 'overview') return (
      <div className="min-h-screen bg-slate-50" onClick={() => setCurrentTab('profile')}>
        <header className="h-16 px-6 md:px-10 bg-white border-b flex items-center justify-between">
          <div className="font-extrabold text-slate-900 text-lg">Dhoomketu <span className="text-xs font-medium text-slate-500">RiskGuard</span></div>
          <button onClick={() => setCurrentTab('profile')} className="px-4 py-2 rounded-lg bg-orange-600 text-white text-sm font-semibold">Login / Register</button>
        </header>
        <VaultOverviewView alerts={filteredAlerts} region={region} timeRange={timeRange} currency={currency} onOpenFilters={() => setCurrentTab('profile')} onViewDetails={() => setCurrentTab('profile')} onComparePeriods={() => setCurrentTab('profile')} onViewAllAlerts={() => setCurrentTab('profile')} onSelectAlert={() => setCurrentTab('profile')} />
      </div>
    );
    return (
      <div className="relative">
        <VaultLogin
          onLoginSuccess={(email, institution) => {
            setOperator({
              ...operator,
              email,
              bankName: institution,
            });
            setIsLoggedIn(true);
            localStorage.setItem('riskguard-session', 'active');
            setCurrentTab('overview');
            showToast('Operator Authenticated', `Active session bound to ${institution}.`);
          }}
          onShowToast={showToast}
          onCancel={() => setCurrentTab('overview')}
        />

        {/* Floating Toast Notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-800 animate-in fade-in slide-in-from-bottom-2 text-xs font-medium">
            <div className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <span className="font-semibold block text-slate-100">{toast.title}</span>
              <span className="text-slate-400 block">{toast.msg}</span>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-500 hover:text-white ml-2 text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef2f6] text-[#0f172a] antialiased flex flex-col justify-center p-0">


      {/* Main Desktop Window Container — Always Full Screen */}
      <div className="bg-white w-full min-h-screen flex flex-col">
        {/* Top Header */}
        <VaultHeader
          region={region}
          onRegionChange={(r) => {
            setRegion(r);
            showToast('Region Filter Changed', `Active routing gateway switched to ${r}.`);
          }}
          timeRange={timeRange}
          onTimeRangeChange={(t) => {
            setTimeRange(t);
            showToast('Time Range Updated', `Telemetry now filtering for ${t}.`);
          }}
          currency={currency}
          onCurrencyChange={(c) => {
            setCurrency(c);
            showToast('Currency Selected', `Display converted to ${c}.`);
          }}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onCreateAlert={() => setIsCreateAlertOpen(true)}
          onExport={() => setCurrentTab('reports')}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          operator={operator}
          onSignOut={() => {
            localStorage.removeItem('riskguard-session');
            setIsLoggedIn(false);
            showToast('Signed Out', 'Terminated operator session.');
          }}
          onNavigateToTab={(tab) => setCurrentTab(tab)}
          onOpenAiChat={() => setIsAiChatOpen(true)}
          onSelectTransaction={(tx) => {
            setCurrentTab('transactions');
            setAiChatTargetTx(tx);
            showToast('Transaction Selected', `Opened ${tx.id} for inspection.`);
          }}
          onSelectAlert={(alt) => {
            setSelectedIncident(alt);
            showToast('Alert Selected', `Opened incident ${alt.code}.`);
          }}
          onSelectCustomer={(cust) => {
            setCurrentTab('customers');
            showToast('Customer Selected', `Opened profile for ${cust.name}.`);
          }}
          onSelectMerchant={(merch) => {
            setCurrentTab('merchants');
            showToast('Merchant Selected', `Opened profile for ${merch.name}.`);
          }}
        />

        {/* Workspace Body: Sidebar + Main Content Viewport */}
        <div className="flex flex-1 overflow-hidden min-h-[680px]">
          {/* Left Dark Sidebar */}
          <VaultSidebar
            currentTab={currentTab}
            onTabChange={(tab) => {
              setCurrentTab(tab);
              if (tab !== 'overview') {
                showToast('View Changed', `Opened ${tab.replace('-', ' ')} dashboard.`);
              }
            }}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />

          {/* Right Main Content Area */}
          <main className="flex-1 bg-[#f8fafc]/50 overflow-y-auto">
            {currentTab === 'banks' ? (
              <BanksView onNavigateToOverview={() => setCurrentTab('overview')} />
            ) : currentTab === 'overview' ? (
              <VaultOverviewView
                alerts={filteredAlerts}
                region={region}
                timeRange={timeRange}
                currency={currency}
                onOpenFilters={() => setIsFilterModalOpen(true)}
                onViewDetails={() => setIsDetailsModalOpen(true)}
                onComparePeriods={() => setIsCompareModalOpen(true)}
                onViewAllAlerts={() => setCurrentTab('alerts')}
                onSelectAlert={(alert) => setSelectedIncident(alert)}
                onNavigateToIdProofs={() => setCurrentTab('id-proofs')}
                onNavigateToBanks={() => setCurrentTab('banks')}
              />
            ) : currentTab === 'id-proofs' ? (
              <BankIdProofsView
                idProofs={idProofs}
                onSelectProof={(doc) => setSelectedProof(doc)}
                onOpenUploadModal={() => setIsUploadProofOpen(true)}
                onUpdateStatus={handleUpdateIdProofStatus}
                onShowToast={showToast}
                onNavigateToOverview={() => setCurrentTab('overview')}
              />
            ) : currentTab === 'transactions' ? (
              <TransactionsView
                currency={currency}
                region={region}
                onShowToast={showToast}
                onNavigateToOverview={() => setCurrentTab('overview')}
                onAnalyzeWithAi={(tx) => {
                  setAiChatTargetTx(tx);
                  setIsAiChatOpen(true);
                  showToast('AI Sentinel Focused', `Loaded ${tx.id} for Fraud Check.`);
                }}
                onOpenAiScanner={() => setIsAiChatOpen(true)}
              />
            ) : currentTab === 'ai-copilot' ? (
              <AiFraudCopilotView
                currency={currency}
                onShowToast={showToast}
                onNavigateToOverview={() => setCurrentTab('overview')}
                onNavigateToTab={(tab) => setCurrentTab(tab)}
              />
            ) : currentTab === 'fraud-detection' ? (
              <FraudDetectionView
                onShowToast={showToast}
                onNavigateToOverview={() => setCurrentTab('overview')}
              />
            ) : currentTab === 'investigations' ? (
              <InvestigationsView
                currency={currency}
                onShowToast={showToast}
                onNavigateToOverview={() => setCurrentTab('overview')}
              />
            ) : currentTab === 'customers' ? (
              <CustomersView
                currency={currency}
                onShowToast={showToast}
                onNavigateToOverview={() => setCurrentTab('overview')}
                onNavigateToIdProofs={() => setCurrentTab('id-proofs')}
              />
            ) : currentTab === 'merchants' ? (
              <MerchantsView
                currency={currency}
                onShowToast={showToast}
                onNavigateToOverview={() => setCurrentTab('overview')}
              />
            ) : currentTab === 'rules-models' ? (
              <RulesModelsView
                onShowToast={showToast}
                onNavigateToOverview={() => setCurrentTab('overview')}
              />
            ) : currentTab === 'alerts' ? (
              <AlertsView
                alerts={filteredAlerts}
                onSelectAlert={(a) => setSelectedIncident(a)}
                onUpdateStatus={handleUpdateStatus}
                onShowToast={showToast}
                onNavigateToOverview={() => setCurrentTab('overview')}
              />
            ) : currentTab === 'reports' ? (
              <ReportsView
                currency={currency}
                region={region}
                onShowToast={showToast}
                onNavigateToOverview={() => setCurrentTab('overview')}
              />
            ) : currentTab === 'compliance' ? (
              <ComplianceView
                onShowToast={showToast}
                onNavigateToOverview={() => setCurrentTab('overview')}
                onNavigateToIdProofs={() => setCurrentTab('id-proofs')}
              />
            ) : currentTab === 'profile' ? (
              <UserProfileView
                operator={operator}
                onShowToast={showToast}
                onNavigateToOverview={() => setCurrentTab('overview')}
                onSignOut={() => {
                  localStorage.removeItem('riskguard-session');
                  setIsLoggedIn(false);
                  showToast('Signed Out', 'Terminated operator session.');
                }}
              />
            ) : (
              <AdminPanelView
                onShowToast={showToast}
                onNavigateToOverview={() => setCurrentTab('overview')}
              />
            )}
          </main>
        </div>
      </div>

      {/* Modals & Slide-overs */}
      <CreateAlertModal
        isOpen={isCreateAlertOpen}
        onClose={() => setIsCreateAlertOpen(false)}
        onCreate={handleCreateAlert}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={() => showToast('Filters Applied', 'Risk overview metrics updated.')}
      />

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

      <ComparePeriodsModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
      />

      <IncidentDrawer
        alert={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onUpdateStatus={handleUpdateStatus}
        onShowToast={showToast}
      />

      {/* Notifications Drawer */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        alerts={alerts}
        onSelectAlert={(a) => setSelectedIncident(a)}
        onShowToast={showToast}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currency={currency}
        onCurrencyChange={(c) => {
          setCurrency(c);
          showToast('Default Currency Updated', `All figures now displayed in ${c}.`);
        }}
        onShowToast={showToast}
      />

      {/* Bank ID Proof Detailed Inspection Modal */}
      <BankIdProofModal
        doc={selectedProof}
        onClose={() => setSelectedProof(null)}
        onUpdateStatus={handleUpdateIdProofStatus}
        onShowToast={showToast}
      />

      {/* Upload & Simulate Bank KYC ID Proof Modal */}
      <UploadIdProofModal
        isOpen={isUploadProofOpen}
        onClose={() => setIsUploadProofOpen(false)}
        onUpload={handleAddIdProof}
        onShowToast={showToast}
      />

      {/* AI Chat Bot Assistant Drawer */}
      <AiChatBotDrawer
        isOpen={isAiChatOpen}
        onClose={() => {
          setIsAiChatOpen(false);
          setAiChatTargetTx(null);
        }}
        initialTx={aiChatTargetTx}
        onNavigateToTab={(tab) => setCurrentTab(tab)}
        onShowToast={showToast}
      />

      {/* Floating AI Chatbot Action Button */}
      {!isAiChatOpen && (
        <button
          onClick={() => {
            setIsAiChatOpen(true);
            showToast('AI Sentinel Ready', 'Scan all transactions or ask customer support questions.');
          }}
          title="Open AI Sentinel Fraud Chatbot"
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-slate-700/80 hover:border-orange-500 transition-all cursor-pointer group hover:scale-105 active:scale-95"
        >
          <div className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 group-hover:text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-base">psychology</span>
          </div>
          <span className="text-xs font-bold tracking-tight">AI Fraud Sentinel Bot</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-800 animate-in fade-in slide-in-from-bottom-2 text-xs font-medium">
          <div className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
            ✓
          </div>
          <div>
            <span className="font-semibold block text-slate-100">{toast.title}</span>
            <span className="text-slate-400 block">{toast.msg}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-500 hover:text-white ml-2 text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
