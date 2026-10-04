import React, { useState, useEffect, useRef } from 'react';
import { EMBLEM_LOGO_URL } from '../data/mockData';
import { ViewMode } from '../types';

interface GatewayViewProps {
  onAuthenticated: () => void;
  onShowToast: (title: string, msg: string, icon?: string) => void;
}

export const GatewayView: React.FC<GatewayViewProps> = ({ onAuthenticated, onShowToast }) => {
  const [selectedRole, setSelectedRole] = useState('AML Investigator');
  const [email, setEmail] = useState('vikram.rao@corpbank.in');
  const [password, setPassword] = useState('InstitutionalPass2025#');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'cipher' | 'smartcard' | 'hardware' | 'totp'>('cipher');

  // Cipher state
  const [cipherSeconds, setCipherSeconds] = useState(29);
  const [hexTokens, setHexTokens] = useState<string[]>([
    '0x7F4A', '0x992B', '0x1C4E', '0xE831', '0x55FA', '0x3B88', '0xA40C', '0x8D29',
  ]);
  const [challengeNonce, setChallengeNonce] = useState('NONCE: #CH-9941-8A-SENTINEL');
  const [otpDigits, setOtpDigits] = useState<string[]>(['8', '4', '9', '2', '0', '6']);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[10:48:22.104] CIPHER_INIT: Elliptic-curve Diffie-Hellman handshake completed.',
    '[10:48:22.450] SHA-256 SEED DERIVATION: 0x9B4F81... OK',
    '[10:48:22.810] ROLLING TIME-SYNCHRONIZED CHALLENGE READY. Nonce generated.',
  ]);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer loop for cipher sync
  useEffect(() => {
    if (activeTab !== 'cipher') return;
    const interval = setInterval(() => {
      setCipherSeconds((prev) => {
        if (prev <= 1) {
          rotateHexMatrix();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const rotateHexMatrix = () => {
    const chars = '0123456789ABCDEF';
    const newTokens = Array.from({ length: 8 }, () => {
      let hex = '0x';
      for (let i = 0; i < 4; i++) {
        hex += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return hex;
    });
    setHexTokens(newTokens);
    const randNonce = Math.floor(1000 + Math.random() * 9000);
    setChallengeNonce(`NONCE: #CH-${randNonce}-8A-SENTINEL`);
    appendLog('EPOCH ROLLOVER. New ephemeral Galois challenge generated.');
  };

  const appendLog = (msg: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
    setConsoleLogs((prev) => [...prev.slice(-4), `[${timeStr}] ${msg}`]);
  };

  const runMatrixDecryption = () => {
    setIsDecrypting(true);
    appendLog('RUNNING SHAMIR SECRET RECONSTRUCTION...');

    let count = 0;
    const shuffle = setInterval(() => {
      setOtpDigits(Array.from({ length: 6 }, () => String(Math.floor(Math.random() * 10))));
      count++;
      if (count > 7) {
        clearInterval(shuffle);
        setOtpDigits(['8', '4', '9', '2', '0', '6']);
        setIsDecrypting(false);
        appendLog('DECRYPTION SUCCESSFUL. Ephemeral OTP verified (849-206).');
        onShowToast('Cipher Decrypted', 'Ephemeral dynamic OTP 849-206 verified against HSM.', 'check_circle');
      }
    }, 70);
  };

  const handleDigitChange = (index: number, val: string) => {
    const char = val.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFillDemo = () => {
    setEmail('vikram.rao@corpbank.in');
    setPassword('InstitutionalPass2025#');
    setOtpDigits(['8', '4', '9', '2', '0', '6']);
    setSelectedRole('AML Investigator');
    appendLog('DEMO CREDENTIALS LOADED (Vikram Rao, L3 Clearance).');
    onShowToast('Demo Operator Loaded', 'Assigned Vikram Rao (Lead AML Investigator L3) credentials.', 'badge');
  };

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    appendLog('SIGN-IN CHALLENGE TRANSMITTED TO SENTINEL GATEWAY...');
    onShowToast('Authenticating', 'Verifying mTLS, SHA-256 Nonce & Cipher Matrix...', 'sync');

    setTimeout(() => {
      appendLog('AUTHENTICATION APPROVED // OPERATOR ID AUTHORIZED.');
      setIsAuthenticating(false);
      onShowToast('Access Granted', 'Institutional Clearance Level 3 active. Entering Sentinel...', 'verified');
      setTimeout(() => {
        onAuthenticated();
      }, 700);
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-container-low via-surface to-surface-container-lowest flex flex-col justify-between text-on-surface">
      {/* Top Header Bar */}
      <header className="w-full bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/30 py-space-sm px-margin flex items-center justify-between z-50">
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-xl">shield_locked</span>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight uppercase">
              RiskGuard <span className="text-primary">AI</span>
            </span>
          </div>
          <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant uppercase tracking-wider font-mono">
            Gateway v4.9
          </span>
        </div>

        <div className="flex items-center gap-space-lg font-mono">
          <div className="hidden md:flex items-center gap-space-sm">
            <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            <span className="font-label-md text-label-md text-on-surface-variant">
              NODE_SYS: <span className="text-tertiary">OPTIMAL (99.99%)</span>
            </span>
          </div>
          <div className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant bg-surface-container-low px-space-sm py-1 rounded border border-outline-variant/20">
            <span className="material-symbols-outlined text-primary text-base">lock</span>
            <span>TLS 1.3 / AES-256-GCM</span>
          </div>
          <div className="hidden sm:flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">public</span>
            <span>SEC-REGION: US-EAST-01</span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 flex items-center justify-center p-margin w-full">
        <div className="relative w-full max-w-7xl mx-auto flex flex-col gap-space-lg py-space-sm sm:py-space-md">
          {/* Top Brand & Telemetry Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest/80 backdrop-blur-md rounded-xl p-space-md shadow-xl border border-outline-variant/30">
            <div className="flex items-center gap-space-md min-w-0">
              <div className="relative flex-shrink-0 w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center p-1.5 shadow-md border border-outline-variant/20">
                <img
                  alt="RiskGuard AI Institutional Emblem"
                  className="w-full h-full object-contain rounded"
                  src={EMBLEM_LOGO_URL}
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-tertiary rounded-full shadow-sm" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-space-sm flex-wrap">
                  <span className="font-headline-md text-headline-md text-on-surface tracking-tight">
                    RiskGuard <span className="text-primary font-bold">AI</span>
                  </span>
                  <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-primary-container/20 text-primary uppercase tracking-wider font-semibold font-mono">
                    Institutional Edition
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  Enterprise AML, Fraud &amp; Regulatory Intelligence Gateway
                </p>
              </div>
            </div>

            <div className="flex items-center gap-space-sm flex-wrap font-mono">
              <div className="flex items-center gap-space-xs px-space-sm py-1.5 rounded-lg bg-surface-container-high shadow-inner border border-outline-variant/20">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                <span className="font-label-sm text-label-sm text-on-surface font-medium">Sentinel Core v4.8 Active</span>
              </div>
              <div className="hidden sm:flex items-center gap-space-xs px-space-sm py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-base">verified</span>
                <span className="font-label-sm text-label-sm">FIPS 140-3 L3 Validated</span>
              </div>
              <div className="flex items-center gap-space-xs px-space-sm py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant border border-outline-variant/20">
                <span className="material-symbols-outlined text-tertiary text-base">lock</span>
                <span className="font-label-sm text-label-sm">TLS 1.3 / mTLS Enforced</span>
              </div>
            </div>
          </div>

          {/* Main Split Auth Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg w-full items-stretch">
            {/* Left Column: Context & Bento Highlights (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-space-lg bg-surface-container-lowest/90 backdrop-blur-xl rounded-xl p-space-xl shadow-xl relative overflow-hidden border border-outline-variant/20">
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col gap-space-lg">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                    Node Telemetry // Cluster IND-01
                  </span>
                  <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-tertiary-container/30 text-tertiary font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary" /> LIVE
                  </span>
                </div>

                <div className="flex flex-col gap-space-xs">
                  <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight leading-snug">
                    Autonomous Financial Defense &amp; Regulatory Governance
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    From continuous transaction anomaly graph signals to verifiable, audit-ready enforcement reports under statutory mandates.
                  </p>
                </div>

                {/* Key Metrics Bento */}
                <div className="grid grid-cols-1 gap-space-sm pt-space-xs">
                  <div className="p-space-md rounded-lg bg-surface-container-low shadow-sm flex items-start gap-space-md border border-outline-variant/20">
                    <div className="p-2 rounded bg-primary-container/20 text-primary flex-shrink-0">
                      <span className="material-symbols-outlined text-xl">psychology</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-baseline gap-space-sm font-mono">
                        <span className="font-code-metric text-code-metric text-primary font-bold">99.4%</span>
                        <span className="font-label-sm text-label-sm text-tertiary font-semibold">+0.3% Q4</span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                        Deterministic Explainability via Bayesian DAGs
                      </span>
                    </div>
                  </div>

                  <div className="p-space-md rounded-lg bg-surface-container-low shadow-sm flex items-start gap-space-md border border-outline-variant/20">
                    <div className="p-2 rounded bg-tertiary/15 text-tertiary flex-shrink-0">
                      <span className="material-symbols-outlined text-xl">account_balance</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-baseline gap-space-sm font-mono">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-sans">FIU-IND &amp; PMLA</span>
                        <span className="font-label-sm text-label-sm text-primary uppercase font-bold">Sec 4.2</span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Real-time statutory rule synthesis engine
                      </span>
                    </div>
                  </div>

                  <div className="p-space-md rounded-lg bg-surface-container-low shadow-sm flex items-start gap-space-md border border-outline-variant/20">
                    <div className="p-2 rounded bg-secondary-container/20 text-secondary flex-shrink-0">
                      <span className="material-symbols-outlined text-xl">fingerprint</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-baseline gap-space-sm font-mono">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-sans">SHA-256 Ledger</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">IMMUTABLE</span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Cryptographic chain-of-custody for court presentation
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ticker */}
                <div className="p-space-sm rounded-lg bg-surface-container-high/60 backdrop-blur-md flex items-center justify-between gap-space-sm border border-outline-variant/20 font-mono">
                  <div className="flex items-center gap-space-xs text-on-surface-variant min-w-0">
                    <span className="material-symbols-outlined text-primary text-sm flex-shrink-0">sensors</span>
                    <p className="font-label-sm text-label-sm truncate">
                      <span className="text-on-surface font-semibold">Ind-Mum Cluster Online</span> (Latency: 14ms) · 0 Unhandled Breaches
                    </p>
                  </div>
                  <span className="font-label-sm text-label-sm text-tertiary whitespace-nowrap font-bold">
                    SYNCHRONIZED
                  </span>
                </div>
              </div>

              {/* Demo Quick-Switch Profile Card */}
              <div className="relative z-10 p-space-md rounded-xl bg-surface-container-high shadow-lg mt-space-md border border-primary/30">
                <div className="flex items-center justify-between mb-space-xs font-mono">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-base">badge</span>
                    <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
                      Demo Quick-Switch Profile
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-primary text-on-primary font-bold">
                    ACTIVE
                  </span>
                </div>
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-sm shadow-md flex-shrink-0 font-mono">
                    VR
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="font-body-md text-body-md text-on-surface font-semibold truncate">Vikram Rao</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant truncate">
                      Lead AML Investigator L3 · Corp Banking IN
                    </p>
                  </div>
                </div>
                <div className="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant font-mono">
                  <span className="font-label-sm text-label-sm">Sec Token: <span className="text-tertiary">#SENTINEL-9904-AUTH</span></span>
                  <button
                    onClick={handleFillDemo}
                    className="font-label-sm text-label-sm text-primary hover:text-primary-fixed underline transition-colors cursor-pointer"
                    type="button"
                  >
                    Use Credentials
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Gateway Sign-In Card (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between bg-surface-container-lowest/95 backdrop-blur-xl rounded-xl p-space-xl shadow-2xl relative border border-outline-variant/30">
              <div className="flex flex-col gap-space-md">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                  <div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                      Secure Gateway Sign-In
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Enter your institutional credentials or hardware security key
                    </p>
                  </div>
                  <div className="flex items-center gap-space-xs self-start sm:self-center px-space-sm py-1 rounded bg-surface-container-high text-primary font-label-sm text-label-sm border border-primary/20 font-mono">
                    <span className="material-symbols-outlined text-sm">security</span>
                    <span>Level 3 Clearance</span>
                  </div>
                </div>

                {/* Role Selector */}
                <div className="flex flex-col gap-space-xs font-mono">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                    Select Operating Authorization Role
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
                    {['AML Investigator', 'Compliance Off.', 'Risk Admin', 'Supervisory Audit'].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`px-space-sm py-space-xs rounded-lg font-label-md text-label-md transition-all text-center cursor-pointer ${
                          selectedRole === role
                            ? 'bg-primary text-on-primary font-semibold shadow-md'
                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleAuthenticate} className="flex flex-col gap-space-md">
                  {/* Email */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center font-mono">
                      <label className="font-label-md text-label-md text-on-surface font-medium font-sans">
                        Corporate Email / Operator ID
                      </label>
                      <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">verified</span> Verified Domain (@corpbank.in)
                      </span>
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
                        alternate_email
                      </span>
                      <input
                        className="w-full bg-surface-container-low text-on-surface pl-10 pr-4 py-2 rounded-lg font-body-md text-body-md focus:outline-none focus:bg-surface-container shadow-inner border border-outline-variant/20"
                        placeholder="operator.id@corpbank.in"
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Password & Tenant */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <label className="font-label-md text-label-md text-on-surface font-medium">
                          Password / Passphrase
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer font-mono"
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
                          password
                        </span>
                        <input
                          className="w-full bg-surface-container-low text-on-surface pl-10 pr-10 py-2 rounded-lg font-body-md text-body-md focus:outline-none focus:bg-surface-container shadow-inner border border-outline-variant/20"
                          required
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-tertiary text-base cursor-pointer">
                          check_circle
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-label-md text-on-surface font-medium">
                        Organization Tenant
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
                          domain
                        </span>
                        <input
                          className="w-full bg-surface-container text-on-surface-variant pl-10 pr-3 py-2 rounded-lg font-label-md text-label-md cursor-not-allowed select-none shadow-inner truncate font-mono border border-outline-variant/20"
                          readOnly
                          type="text"
                          value="Corp Bank IN - Wholesale Banking [IND-MUM-01]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2nd Factor Modality Tabs */}
                  <div className="flex flex-col gap-space-xs mt-1 font-mono">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                      2nd Factor Authentication Protocol
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
                      <button
                        type="button"
                        onClick={() => setActiveTab('cipher')}
                        className={`px-space-xs sm:px-space-sm py-2 rounded-lg font-label-sm text-label-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          activeTab === 'cipher'
                            ? 'bg-surface-container-high text-primary font-bold shadow-sm ring-1 ring-primary/40'
                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                        <span className="material-symbols-outlined text-base">terminal</span>
                        <span className="truncate">OTP Cipher</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('smartcard')}
                        className={`px-space-xs sm:px-space-sm py-2 rounded-lg font-label-sm text-label-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          activeTab === 'smartcard'
                            ? 'bg-surface-container-high text-primary font-bold shadow-sm ring-1 ring-primary/40'
                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">credit_card</span>
                        <span className="truncate">ATM Card</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('hardware')}
                        className={`px-space-xs sm:px-space-sm py-2 rounded-lg font-label-sm text-label-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          activeTab === 'hardware'
                            ? 'bg-surface-container-high text-primary font-bold shadow-sm ring-1 ring-primary/40'
                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">vpn_key</span>
                        <span className="truncate">YubiKey</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('totp')}
                        className={`px-space-xs sm:px-space-sm py-2 rounded-lg font-label-sm text-label-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          activeTab === 'totp'
                            ? 'bg-surface-container-high text-primary font-bold shadow-sm ring-1 ring-primary/40'
                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">timer</span>
                        <span className="truncate">Sentinel TOTP</span>
                      </button>
                    </div>
                  </div>

                  {/* Challenge Container */}
                  <div className="p-space-md rounded-xl bg-surface-container-low shadow-lg flex flex-col gap-space-sm border border-outline-variant/30 font-mono">
                    {activeTab === 'cipher' && (
                      <div className="flex flex-col gap-space-sm">
                        {/* Terminal Header & Sync Status */}
                        <div className="flex flex-wrap items-center justify-between pb-2 border-b border-outline-variant/30 gap-2">
                          <div className="flex items-center gap-space-xs text-primary font-label-md text-label-md font-semibold">
                            <span className="material-symbols-outlined text-lg">terminal</span>
                            <span>CIPHER TERMINAL v4.8</span>
                            <span className="hidden sm:inline-block text-xs font-mono px-1.5 py-0.5 rounded bg-primary-container/20 text-primary uppercase">
                              Matrix: Active
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 font-mono font-label-sm text-label-sm text-tertiary bg-surface-container-high px-space-xs py-0.5 rounded border border-tertiary/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                              <span>SYNC: <span className="font-bold">{cipherSeconds}s</span></span>
                            </div>
                            <div className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all duration-1000 ease-linear"
                                style={{ width: `${(cipherSeconds / 30) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Hex Matrix Banner */}
                        <div className="relative overflow-hidden rounded-lg bg-surface-container-lowest border border-outline-variant/30 p-2.5 font-mono text-xs shadow-inner">
                          <div className="flex items-center justify-between text-outline mb-1 font-label-sm text-label-sm">
                            <span className="flex items-center gap-1 text-primary">
                              <span className="material-symbols-outlined text-xs animate-spin">sync</span>
                              CRYPTOGRAPHIC STREAM MATRIX
                            </span>
                            <span className="text-tertiary">ENTROPY: 256-BIT TRNG</span>
                          </div>
                          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 text-center font-mono py-1">
                            {hexTokens.map((token, idx) => (
                              <span
                                key={idx}
                                className={`py-1 px-1.5 rounded bg-surface-container text-on-surface-variant border border-outline-variant/20 hover:border-primary/50 transition-colors ${
                                  idx === 2 ? 'text-primary border-primary/40 font-bold bg-primary/10' : ''
                                }`}
                              >
                                {token}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Challenge Nonce & Auto-Decrypt */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-2 rounded-lg bg-surface-container border border-outline-variant/20">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-base">fingerprint</span>
                            <div className="flex flex-col">
                              <span className="font-label-sm text-label-sm text-on-surface-variant">
                                Active Ephemeral Challenge
                              </span>
                              <span className="font-mono text-xs text-on-surface font-semibold">
                                {challengeNonce}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <button
                              disabled={isDecrypting}
                              onClick={runMatrixDecryption}
                              className="px-2.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary border border-primary/30 font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
                              type="button"
                            >
                              <span className={`material-symbols-outlined text-sm ${isDecrypting ? 'animate-spin' : ''}`}>
                                {isDecrypting ? 'sync' : 'enhanced_encryption'}
                              </span>
                              <span>{isDecrypting ? 'Decrypting Stream...' : 'Auto-Decrypt Token'}</span>
                            </button>
                            <button
                              onClick={() => {
                                setOtpDigits(['8', '4', '9', '2', '0', '6']);
                                appendLog('OTP BUFFER INJECTED INTO CIPHER REGISTER.');
                                onShowToast('OTP Injected', 'Populated register with 849-206.', 'input');
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1 transition-all border border-primary/40 active:scale-95 cursor-pointer"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-sm">input</span>
                              <span>Inject OTP</span>
                            </button>
                          </div>
                        </div>

                        {/* 6-Digit OTP Verification Inputs */}
                        <div className="flex flex-col gap-1.5 pt-1">
                          <div className="flex items-center justify-between">
                            <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                              <span>Enter 6-Digit Dynamic OTP Token</span>
                              <span className="text-outline text-xs">(Auto-advancing cipher key)</span>
                            </label>
                            <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-1 font-mono">
                              <span className="material-symbols-outlined text-xs">check_circle</span> TOKEN COMPILED: {otpDigits.join('')}
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
                            {otpDigits.slice(0, 3).map((digit, idx) => (
                              <input
                                key={idx}
                                ref={(el) => { inputRefs.current[idx] = el; }}
                                className="w-10 sm:w-12 h-12 text-center font-code-metric text-code-metric bg-surface-container-high text-primary rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all border border-outline-variant/20"
                                maxLength={1}
                                type="text"
                                value={digit}
                                onChange={(e) => handleDigitChange(idx, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(idx, e)}
                              />
                            ))}
                            <div className="w-2 h-0.5 bg-outline-variant rounded" />
                            {otpDigits.slice(3, 6).map((digit, idx) => {
                              const actualIndex = idx + 3;
                              return (
                                <input
                                  key={actualIndex}
                                  ref={(el) => { inputRefs.current[actualIndex] = el; }}
                                  className="w-10 sm:w-12 h-12 text-center font-code-metric text-code-metric bg-surface-container-high text-primary rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all border border-outline-variant/20"
                                  maxLength={1}
                                  type="text"
                                  value={digit}
                                  onChange={(e) => handleDigitChange(actualIndex, e.target.value)}
                                  onKeyDown={(e) => handleKeyDown(actualIndex, e)}
                                />
                              );
                            })}
                          </div>
                        </div>

                        {/* Cipher Console Logs */}
                        <div className="mt-1 rounded-lg bg-surface-container-lowest/90 border border-outline-variant/30 p-2 font-mono text-[11px] leading-relaxed text-on-surface-variant shadow-inner">
                          <div className="flex items-center justify-between text-outline text-[10px] pb-1 mb-1 border-b border-outline-variant/20 uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                              REAL-TIME CIPHER CONSOLE
                            </span>
                            <span className="text-tertiary">AES-GCM // TRACE: OK</span>
                          </div>
                          <div className="flex flex-col gap-0.5 text-on-surface-variant max-h-16 overflow-hidden">
                            {consoleLogs.map((log, i) => (
                              <div key={i}>{log}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'smartcard' && (
                      <div className="space-y-space-sm">
                        <div className="flex items-center justify-between pb-1 border-b border-outline-variant/30">
                          <div className="flex items-center gap-space-xs text-primary font-label-md text-label-md font-semibold">
                            <span className="material-symbols-outlined text-lg">contactless</span>
                            <span>Institutional ATM Card &amp; EMV Chip Verification</span>
                          </div>
                          <div className="flex items-center gap-space-xs font-mono font-label-sm text-label-sm text-tertiary bg-surface-container-high px-space-xs py-0.5 rounded border border-tertiary/20">
                            <span className="material-symbols-outlined text-xs">memory</span>
                            <span>EMV-CHIP: SYNCHRONIZED</span>
                          </div>
                        </div>
                        <div className="p-space-md rounded-lg bg-surface-container border border-outline-variant/30 flex flex-col gap-space-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-space-xs">
                              <span className="material-symbols-outlined text-primary text-xl">credit_card</span>
                              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface font-semibold font-sans">
                                Corp Bank Commercial Debit // RuPay EMV
                              </span>
                            </div>
                            <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-tertiary/15 text-tertiary font-bold tracking-wider">
                              CONNECTED VIA TERMINAL
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-space-sm">
                            <div className="sm:col-span-7 flex flex-col gap-1">
                              <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-between">
                                <span>Card Number (EMV Masked)</span>
                                <span className="text-tertiary flex items-center gap-0.5">
                                  <span className="material-symbols-outlined text-xs">check_circle</span> Valid
                                </span>
                              </label>
                              <input
                                className="w-full bg-surface-container-low text-on-surface pl-3 pr-3 py-2 rounded-lg font-mono text-body-md focus:outline-none shadow-inner tracking-wider border border-outline-variant/20"
                                readOnly
                                type="text"
                                value="4532 •••• •••• 8812"
                              />
                            </div>
                            <div className="sm:col-span-2 flex flex-col gap-1">
                              <label className="font-label-sm text-label-sm text-on-surface-variant">Expiry</label>
                              <input
                                className="w-full bg-surface-container-low text-on-surface px-2 py-2 rounded-lg font-mono text-body-md text-center focus:outline-none shadow-inner border border-outline-variant/20"
                                readOnly
                                type="text"
                                value="08/28"
                              />
                            </div>
                            <div className="sm:col-span-3 flex flex-col gap-1">
                              <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-between">
                                <span>CVV / CVC</span>
                              </label>
                              <input
                                className="w-full bg-surface-container-low text-primary font-mono text-body-md text-center py-2 rounded-lg shadow-inner focus:outline-none font-bold tracking-widest border border-outline-variant/20"
                                readOnly
                                type="password"
                                value="742"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'hardware' && (
                      <div className="space-y-space-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-space-xs text-primary font-label-md text-label-md font-semibold">
                            <span className="material-symbols-outlined text-lg">token</span>
                            <span>Hardware Key Challenge Triggered</span>
                          </div>
                          <span className="font-label-sm text-label-sm text-tertiary font-mono">CHALLENGE_NONCE: 0x8F4E</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Tap your YubiKey FIDO2 token or enter dynamic security PIN:
                        </p>
                        <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
                          {['8', '4', '9', '2', '0', '1'].map((d, i) => (
                            <input
                              key={i}
                              readOnly
                              value={d}
                              className="w-10 sm:w-12 h-12 text-center font-code-metric text-code-metric bg-surface-container-high text-primary rounded-lg shadow-inner border border-outline-variant/20"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'totp' && (
                      <div className="space-y-space-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-space-xs text-primary font-label-md text-label-md font-semibold">
                            <span className="material-symbols-outlined text-lg">timer</span>
                            <span>Authenticator TOTP Sync</span>
                          </div>
                          <span className="font-label-sm text-label-sm text-tertiary font-mono">WINDOW: 28s remaining</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Launch Sentinel Authenticator on registered mobile hardware and enter dynamic rotating PIN:
                        </p>
                        <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
                          {['3', '7', '1', '9', '5', '4'].map((d, i) => (
                            <input
                              key={i}
                              readOnly
                              value={d}
                              className="w-10 sm:w-12 h-12 text-center font-code-metric text-code-metric bg-surface-container-high text-primary rounded-lg shadow-inner border border-outline-variant/20"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Session Checkbox */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                    <label className="flex items-center gap-space-xs cursor-pointer select-none">
                      <input defaultChecked className="w-4 h-4 rounded bg-surface-container-high text-primary focus:ring-0 focus:outline-none cursor-pointer" type="checkbox" />
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        Keep hardware session active for 8h on authorized terminal
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => onShowToast('Emergency Override', 'Dispatched emergency bypass token to senior supervisor phone.', 'lock_reset')}
                      className="font-label-sm text-label-sm text-primary hover:text-primary-fixed underline transition-colors cursor-pointer text-left"
                    >
                      Emergency Access Request
                    </button>
                  </div>

                  {/* Primary Action Button */}
                  <button
                    disabled={isAuthenticating}
                    className="w-full py-3.5 px-space-lg rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-space-sm shadow-xl hover:bg-primary-fixed hover:shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50"
                    type="submit"
                  >
                    <span className={`material-symbols-outlined text-xl ${isAuthenticating ? 'animate-spin' : ''}`}>
                      {isAuthenticating ? 'sync' : 'lock_open'}
                    </span>
                    <span>{isAuthenticating ? 'Verifying mTLS & Cipher Matrix...' : 'Authenticate & Enter Sentinel'}</span>
                  </button>
                </form>

                {/* SSO Fallback */}
                <div className="flex flex-col gap-space-sm mt-space-xs">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-px bg-outline-variant/30" />
                    </div>
                    <span className="relative px-space-md bg-surface-container-lowest font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-mono">
                      Or federate via institutional identity
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        onShowToast('Okta SSO', 'Federating SAML 2.0 assertion via Okta tenant...', 'verified_user');
                        setTimeout(onAuthenticated, 800);
                      }}
                      className="px-space-sm py-2 rounded-lg bg-surface-container hover:bg-surface-container-high font-label-sm text-label-sm text-on-surface flex items-center justify-center gap-space-xs transition-colors shadow-sm cursor-pointer border border-outline-variant/20"
                    >
                      <span className="material-symbols-outlined text-base text-primary">verified_user</span>
                      <span>Okta SSO</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onShowToast('Microsoft Entra', 'Exchanging OpenID Connect token via Azure AD...', 'cloud_done');
                        setTimeout(onAuthenticated, 800);
                      }}
                      className="px-space-sm py-2 rounded-lg bg-surface-container hover:bg-surface-container-high font-label-sm text-label-sm text-on-surface flex items-center justify-center gap-space-xs transition-colors shadow-sm cursor-pointer border border-outline-variant/20"
                    >
                      <span className="material-symbols-outlined text-base text-secondary">cloud_done</span>
                      <span>Microsoft Entra</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onShowToast('SmartCard Verified', 'PKCS#11 hardware certificate signed.', 'badge');
                        setTimeout(onAuthenticated, 800);
                      }}
                      className="px-space-sm py-2 rounded-lg bg-surface-container hover:bg-surface-container-high font-label-sm text-label-sm text-on-surface flex items-center justify-center gap-space-xs transition-colors shadow-sm cursor-pointer border border-outline-variant/20"
                    >
                      <span className="material-symbols-outlined text-base text-tertiary">badge</span>
                      <span>Intranet SmartCard</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Terminal Footnote */}
              <div className="mt-space-md pt-space-xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm font-mono border-t border-outline-variant/20">
                <span>Terminal ID: <span className="text-on-surface">BOM-HQ-TRM-804</span></span>
                <span className="text-tertiary flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary" /> ZERO_TRUST_VERIFIED
                </span>
              </div>
            </div>
          </div>

          {/* Statutory Regulatory Notice */}
          <div className="flex flex-col gap-space-sm bg-surface-container-lowest/80 backdrop-blur-md rounded-xl p-space-md shadow-lg border border-outline-variant/20">
            <div className="flex items-start gap-space-sm">
              <span className="material-symbols-outlined text-primary text-xl flex-shrink-0 mt-0.5">policy</span>
              <div className="flex flex-col min-w-0">
                <p className="font-label-md text-label-md text-on-surface font-semibold tracking-wide uppercase font-mono">
                  Statutory Access Warning &amp; Forensic Logging Notice
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Authorized Personnel Only. All queries, entity risk explorations, model inferences, and copilot actions are cryptographically hashed and logged to immutable tamper-evident audit trails in compliance with RBI / FIU-IND regulatory guidelines under PMLA 2002. Unauthorized attempts incur civil and criminal statutory prosecution.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs font-mono">
              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="font-label-sm text-label-sm px-space-sm py-1 rounded bg-surface-container text-tertiary font-semibold flex items-center gap-1 border border-outline-variant/30">
                  <span className="material-symbols-outlined text-xs">shield</span> ISO/IEC 27001 Certified
                </span>
                <span className="font-label-sm text-label-sm px-space-sm py-1 rounded bg-surface-container text-tertiary font-semibold flex items-center gap-1 border border-outline-variant/30">
                  <span className="material-symbols-outlined text-xs">verified</span> SOC2 Type II Certified
                </span>
                <span className="font-label-sm text-label-sm px-space-sm py-1 rounded bg-surface-container text-primary font-semibold flex items-center gap-1 border border-outline-variant/30">
                  <span className="material-symbols-outlined text-xs">lock</span> PCI-DSS 4.0 Standard
                </span>
                <span className="font-label-sm text-label-sm px-space-sm py-1 rounded bg-surface-container text-primary font-semibold flex items-center gap-1 border border-outline-variant/30">
                  <span className="material-symbols-outlined text-xs">gavel</span> PMLA 2002 Compliant
                </span>
              </div>
              <div className="font-label-sm text-label-sm text-outline">
                EPOCH: 1739501824 // SIGNATURE: VALID
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest/90 backdrop-blur-md border-t border-outline-variant/20 py-space-md px-margin text-on-surface-variant flex flex-col md:flex-row items-center justify-between gap-space-md font-mono">
        <div className="flex flex-wrap items-center justify-center gap-space-md">
          <div className="flex items-center gap-space-xs px-space-sm py-1 rounded bg-surface-container border border-outline-variant/40">
            <span className="material-symbols-outlined text-tertiary text-sm">verified_user</span>
            <span className="font-label-sm text-label-sm text-on-surface">ISO/IEC 27001:2022</span>
          </div>
          <div className="flex items-center gap-space-xs px-space-sm py-1 rounded bg-surface-container border border-outline-variant/40">
            <span className="material-symbols-outlined text-tertiary text-sm">security</span>
            <span className="font-label-sm text-label-sm text-on-surface">SOC2 TYPE II AUDITED</span>
          </div>
          <div className="flex items-center gap-space-xs px-space-sm py-1 rounded bg-surface-container border border-outline-variant/40">
            <span className="material-symbols-outlined text-primary text-sm">gavel</span>
            <span className="font-label-sm text-label-sm text-on-surface">PMLA DIRECTIVE SECURE</span>
          </div>
          <div className="flex items-center gap-space-xs px-space-sm py-1 rounded bg-surface-container border border-outline-variant/40">
            <span className="material-symbols-outlined text-primary text-sm">policy</span>
            <span className="font-label-sm text-label-sm text-on-surface">FIPS 140-3 LEVEL 3</span>
          </div>
        </div>
        <div className="font-label-sm text-label-sm text-center md:text-right text-outline">
          <p>© 2026 RiskGuard AI Inc. Statutory Authorization Required. All access attempts logged and telemetrically verified.</p>
        </div>
      </footer>
    </div>
  );
};
