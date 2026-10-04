import { AlertIncident, BankIdProof, OperatorProfile, RiskContributor, RiskTimelinePoint } from '../types';

// ==========================================
// CURRENCIES & CONVERSION ENGINE
// ==========================================
export interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number; // vs USD
  name: string;
}

export const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', rate: 1.0, name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.78, name: 'British Pound' },
  AUD: { code: 'AUD', symbol: 'A$', rate: 1.52, name: 'Australian Dollar' },
  CAD: { code: 'CAD', symbol: 'C$', rate: 1.36, name: 'Canadian Dollar' },
};

export function formatMoney(amountInUSD: number, currencyCode: string = 'USD'): string {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const converted = amountInUSD * curr.rate;
  return `${curr.symbol}${converted.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatCompactMoney(amountInUSD: number, currencyCode: string = 'USD'): string {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const converted = amountInUSD * curr.rate;
  if (converted >= 1_000_000) {
    return `${curr.symbol}${(converted / 1_000_000).toFixed(2)}M`;
  }
  if (converted >= 1_000) {
    return `${curr.symbol}${(converted / 1_000).toFixed(1)}k`;
  }
  return `${curr.symbol}${converted.toFixed(2)}`;
}

// ==========================================
// REGION DATA & METRICS
// ==========================================
export interface RegionProfile {
  region: string;
  score: number;
  delta: string;
  deltaDir: 'up' | 'down';
  totalVolumeUSD: number;
  activeIncidents: number;
  contributors: RiskContributor[];
}

export const REGION_PROFILES: Record<string, RegionProfile> = {
  'EU Payments': {
    region: 'EU Payments',
    score: 1258,
    delta: '+5.2%',
    deltaDir: 'up',
    totalVolumeUSD: 24890000,
    activeIncidents: 5,
    contributors: [
      { label: 'Unusual velocity', percentage: 26, category: 'Velocity' },
      { label: 'New device surge', percentage: 6, category: 'Device' },
      { label: 'Geo mismatch', percentage: 14, category: 'Location' },
      { label: 'High-risk BIN range', percentage: 71, category: 'Card & Issuer' },
      { label: 'Merchant anomaly', percentage: 13, category: 'Merchant' },
    ],
  },
  'US Core': {
    region: 'US Core',
    score: 942,
    delta: '-3.4%',
    deltaDir: 'down',
    totalVolumeUSD: 68420000,
    activeIncidents: 3,
    contributors: [
      { label: 'High-risk BIN range', percentage: 54, category: 'Card & Issuer' },
      { label: 'Unusual velocity', percentage: 38, category: 'Velocity' },
      { label: 'Synthetic identity risk', percentage: 29, category: 'Identity' },
      { label: 'Geo mismatch', percentage: 21, category: 'Location' },
      { label: 'New device surge', percentage: 12, category: 'Device' },
    ],
  },
  'APAC Cards': {
    region: 'APAC Cards',
    score: 1840,
    delta: '+14.8%',
    deltaDir: 'up',
    totalVolumeUSD: 32150000,
    activeIncidents: 8,
    contributors: [
      { label: 'Merchant anomaly', percentage: 48, category: 'Merchant' },
      { label: 'Geo mismatch', percentage: 36, category: 'Location' },
      { label: 'Unusual velocity', percentage: 32, category: 'Velocity' },
      { label: 'High-risk BIN range', percentage: 28, category: 'Card & Issuer' },
      { label: 'New device surge', percentage: 19, category: 'Device' },
    ],
  },
  'Global Routing': {
    region: 'Global Routing',
    score: 4040,
    delta: '+7.1%',
    deltaDir: 'up',
    totalVolumeUSD: 125460000,
    activeIncidents: 16,
    contributors: [
      { label: 'High-risk BIN range', percentage: 65, category: 'Card & Issuer' },
      { label: 'Unusual velocity', percentage: 42, category: 'Velocity' },
      { label: 'Geo mismatch', percentage: 29, category: 'Location' },
      { label: 'Merchant anomaly', percentage: 24, category: 'Merchant' },
      { label: 'New device surge', percentage: 15, category: 'Device' },
    ],
  },
};

// ==========================================
// TIMELINE PROFILES BY TIME RANGE
// ==========================================
export interface TimelineDataset {
  labels: string[];
  orangePath: string;
  navyPath: string;
  tealPath: string;
}

export const TIMELINE_PROFILES: Record<string, TimelineDataset> = {
  'Last 24 hours': {
    labels: ['04:00', '08:00', '12:00', '16:00', '20:00'],
    orangePath: 'M 35 105 Q 70 140 100 130 T 170 85 T 250 95 T 340 55 T 430 75 L 505 55',
    navyPath: 'M 35 155 Q 70 160 100 150 T 170 115 T 250 170 T 340 155 T 430 165 L 505 160',
    tealPath: 'M 35 165 Q 70 175 100 165 T 170 145 T 250 195 T 340 170 T 430 195 L 505 190',
  },
  'Last 7 days': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    orangePath: 'M 35 120 Q 80 90 140 70 T 250 110 T 350 45 T 440 60 L 505 40',
    navyPath: 'M 35 160 Q 80 140 140 130 T 250 150 T 350 120 T 440 135 L 505 125',
    tealPath: 'M 35 175 Q 80 180 140 160 T 250 185 T 350 155 T 440 170 L 505 160',
  },
  'Last 30 days': {
    labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Live'],
    orangePath: 'M 35 140 Q 90 110 160 95 T 280 60 T 390 80 T 460 50 L 505 45',
    navyPath: 'M 35 170 Q 90 155 160 140 T 280 125 T 390 140 T 460 120 L 505 115',
    tealPath: 'M 35 185 Q 90 175 160 170 T 280 150 T 390 165 T 460 150 L 505 140',
  },
  'Quarter to Date': {
    labels: ['Jul', 'Aug', 'Sep', 'Q4 Live'],
    orangePath: 'M 35 130 Q 120 75 220 85 T 360 40 T 450 65 L 505 35',
    navyPath: 'M 35 165 Q 120 135 220 145 T 360 115 T 450 130 L 505 105',
    tealPath: 'M 35 180 Q 120 165 220 170 T 360 145 T 450 160 L 505 135',
  },
};

// ==========================================
// OPERATOR & INITIAL BANK ID PROOFS
// ==========================================
export const CURRENT_OPERATOR: OperatorProfile = {
  id: 'OP-8891',
  name: 'Vikram Rao',
  role: 'Lead AML & Fraud Investigator',
  department: 'Wholesale Banking Risk & Compliance Unit',
  bankName: 'Corp Bank IN',
  clearanceLevel: 'Level 3 Clearance (Supervisory Authority)',
  badgeNumber: 'CB-IN-VR-9902',
  email: 'vikram.rao@corpbank.in',
  tokenExpires: '8h 00m remaining',
};

export const INITIAL_BANK_ID_PROOFS: BankIdProof[] = [
  {
    id: 'DOC-8891-01',
    customerName: 'Alpha Corp Ltd (Director: Rajesh K. Verma)',
    accountNumber: 'ACC-10482',
    bankName: 'Corp Bank IN - Mumbai Fort',
    docType: 'Certificate of Incorporation',
    docNumberMasked: 'CIN: U51909MH•••••••••921',
    issuingAuthority: 'Ministry of Corporate Affairs (MCA), Govt. of India',
    issuingCountry: 'India',
    issueDate: '14 May 2021',
    expiryDate: 'Perpetual',
    status: 'Verified',
    matchScore: 99.4,
    extractedName: 'Alpha Corp Global Impex Private Limited',
    extractedDob: 'Incorporated: 14-05-2021',
    extractedAddress: '402 Trade Centre, Nariman Point, Mumbai 400021',
    checksum: 'sha256:7f4a9b218c...sealed',
    uploadedAt: '12m ago',
    verifiedBy: 'AI Document Vision v4.8 (Auto-Approved)',
  },
  {
    id: 'DOC-8891-02',
    customerName: 'Rajesh K. Verma (Authorized Signatory)',
    accountNumber: 'ACC-10482',
    bankName: 'Corp Bank IN - Mumbai Fort',
    docType: 'Passport',
    docNumberMasked: 'P8921••••',
    issuingAuthority: 'Passport Office Mumbai, Ministry of External Affairs',
    issuingCountry: 'India',
    issueDate: '12 Jan 2020',
    expiryDate: '11 Jan 2030',
    status: 'Verified',
    matchScore: 98.7,
    extractedName: 'Rajesh Kumar Verma',
    extractedDob: '18-08-1979',
    extractedAddress: 'B-14 Silver Beach Heights, Juhu, Mumbai 400049',
    checksum: 'sha256:3e498da1c...sealed',
    uploadedAt: '25m ago',
    verifiedBy: 'AI Biometric Facial & MRZ Engine (Passed)',
  },
  {
    id: 'DOC-8892-01',
    customerName: 'Emily Watson',
    accountNumber: 'ACC-09412',
    bankName: 'Commonwealth Bank of Australia (AU Cards)',
    docType: 'National ID',
    docNumberMasked: 'AU-MED-••••-4912',
    issuingAuthority: 'Services Australia, Govt of Australia',
    issuingCountry: 'Australia',
    issueDate: '01 Feb 2022',
    expiryDate: '01 Feb 2027',
    status: 'Verified',
    matchScore: 99.1,
    extractedName: 'Emily Kate Watson',
    extractedDob: '24-11-1988',
    extractedAddress: '14/88 George Street, Sydney NSW 2000',
    checksum: 'sha256:9d14ea881...sealed',
    uploadedAt: '1h ago',
    verifiedBy: 'AU DVS Gateway Verified',
  },
  {
    id: 'DOC-8893-01',
    customerName: 'Apex Global FZ (Singapore Transit Entity)',
    accountNumber: 'AC-8841-092 (DBS Singapore)',
    bankName: 'DBS Bank Singapore',
    docType: 'Certificate of Incorporation',
    docNumberMasked: 'UEN: 2026••••G',
    issuingAuthority: 'Accounting and Corporate Regulatory Authority (ACRA)',
    issuingCountry: 'Singapore',
    issueDate: '18 Sep 2026',
    expiryDate: 'Annual Renewal Pending',
    status: 'Flagged / Mismatch',
    matchScore: 54.2,
    extractedName: 'Apex Global FZ Pte Ltd (Registered < 38 days)',
    extractedDob: 'Incorporation Date: 18-09-2026',
    extractedAddress: 'Virtual Office Box #102, Marina Bay Financial Tower 2, Singapore',
    checksum: 'sha256:11f9cc002...warning',
    uploadedAt: '10m ago',
    verifiedBy: 'Flagged: Shell Entity Watchlist Triggered',
  },
  {
    id: 'DOC-8894-01',
    customerName: 'Kenji Sato',
    accountNumber: 'ACC-11029',
    bankName: 'Mizuho Bank / JCB International',
    docType: 'Driving License',
    docNumberMasked: 'DL-JP-••••-0921',
    issuingAuthority: 'Tokyo Metropolitan Police Public Safety Commission',
    issuingCountry: 'Japan',
    issueDate: '15 Mar 2021',
    expiryDate: '15 Mar 2026',
    status: 'Pending Review',
    matchScore: 88.5,
    extractedName: 'Kenji Sato',
    extractedDob: '05-06-1991',
    extractedAddress: '3-12 Roppongi, Minato-ku, Tokyo 106-0032',
    checksum: 'sha256:4a8e2bc10...pending',
    uploadedAt: '2h ago',
    verifiedBy: 'Awaiting Operator Translation Verification',
  },
  {
    id: 'DOC-8895-01',
    customerName: 'V-Capital Trade Pte Ltd',
    accountNumber: 'ACC-09144',
    bankName: 'OCBC Bank Singapore',
    docType: 'Tax ID / PAN',
    docNumberMasked: 'TAX-SG-••••-881',
    issuingAuthority: 'Inland Revenue Authority of Singapore (IRAS)',
    issuingCountry: 'Singapore',
    issueDate: '10 Aug 2023',
    expiryDate: 'Active',
    status: 'Verified',
    matchScore: 97.4,
    extractedName: 'V-Capital Trade Services Pte Ltd',
    extractedDob: 'N/A (Corporate)',
    extractedAddress: '68 Circular Road, #02-01, Singapore 049422',
    checksum: 'sha256:5a44ef879...sealed',
    uploadedAt: '3h ago',
    verifiedBy: 'Verified via IRAS Enterprise API',
  },
];

// Fallbacks for compatibility
export const INITIAL_CONTRIBUTORS: RiskContributor[] = REGION_PROFILES['EU Payments'].contributors;
export const INITIAL_TIMELINE_POINTS: RiskTimelinePoint[] = [
  { time: '04:00', suspicious: 175, blocked: 90, manualReviews: 70 },
  { time: '08:00', suspicious: 120, blocked: 80, manualReviews: 60 },
  { time: '12:00', suspicious: 220, blocked: 165, manualReviews: 110 },
  { time: '16:00', suspicious: 200, blocked: 65, manualReviews: 20 },
  { time: '20:00', suspicious: 270, blocked: 85, manualReviews: 65 },
  { time: '24:00', suspicious: 245, blocked: 70, manualReviews: 25 },
  { time: '00:00', suspicious: 265, blocked: 75, manualReviews: 30 },
];

export const INITIAL_ALERTS: AlertIncident[] = [
  {
    id: 'alt-1',
    code: 'ALT-003',
    title: 'High transaction volume observed in AU debit transactions',
    severity: 'medium',
    segment: 'AU Cards',
    started: '10 min ago',
    status: 'Monitoring',
    owner: { name: 'Emily Wang' },
    details: {
      volume: '$482,910.00',
      affectedUsers: 142,
      description: 'Burst of 2,400 debit transactions within 15 minutes routed through Commonwealth Bank Sydney gateway.',
      suggestedAction: 'Keep in active monitoring; verify merchant gateway webhook response.',
    },
  },
  {
    id: 'alt-2',
    code: 'ALT-002',
    title: 'Decline rate increase in APAC credit cards',
    severity: 'high',
    segment: 'APAC Cards',
    started: '5 min ago',
    status: 'Investigating',
    owner: { name: 'John Lee' },
    details: {
      volume: '$1,290,400.00',
      affectedUsers: 512,
      description: 'Elevated authorization decline rate jumped from 3.2% to 18.9% across Hong Kong & Singapore payment rails.',
      suggestedAction: 'Investigating 3D-Secure 2.2 challenge failure rates with issuing banks.',
    },
  },
  {
    id: 'alt-3',
    code: 'ALT-005',
    title: 'System downtime affecting ME card transactions',
    severity: 'low',
    segment: 'ME Cards',
    started: '20 min ago',
    status: 'Resolved',
    owner: { name: 'Amina Hassan' },
    details: {
      volume: '$89,200.00',
      affectedUsers: 48,
      description: 'Transient latency spike on UAE Central Bank routing switch resolved via automatic fallback.',
      suggestedAction: 'Incident mitigated; post-mortem telemetry archived to compliance ledger.',
    },
  },
  {
    id: 'alt-4',
    code: 'ALT-008',
    title: 'Customer request for new features in AS card app',
    severity: 'low',
    segment: 'AS Cards',
    started: '10 min ago',
    status: 'Pending Review',
    owner: { name: 'Mike Chen' },
    details: {
      volume: 'N/A (Feedback)',
      affectedUsers: 18,
      description: 'Customer requested customizable biometric 2FA limits for high-value offshore transfers.',
      suggestedAction: 'Route feedback to Product & Risk Policy Committee.',
    },
  },
  {
    id: 'alt-5',
    code: 'ALT-007',
    title: 'Issue with incorrect transaction amounts on AS card statements',
    severity: 'high',
    segment: 'APAC Cards',
    started: '15 min ago',
    status: 'Monitoring',
    owner: { name: 'Sara Lee' },
    details: {
      volume: '$310,000.00',
      affectedUsers: 84,
      description: 'Discrepancy in FX rate conversion between JPY settlement and USD statement display.',
      suggestedAction: 'Adjusted settlement batch calculator; monitoring next clearing cycle.',
    },
  },
  {
    id: 'alt-6',
    code: 'ALT-011',
    title: 'Rapid cross-border card velocity surge on EU payment rails',
    severity: 'high',
    segment: 'EU Payments',
    started: '2 min ago',
    status: 'Investigating',
    owner: { name: 'Vikram Rao' },
    details: {
      volume: '$620,000.00',
      affectedUsers: 96,
      description: 'High frequency authorization attempts from virtual cards originating in Frankfurt.',
      suggestedAction: 'Enforce Step-Up 3D Secure 2.2 authentication and review BIN range.',
    },
  },
];

// ==========================================
// TRANSACTIONS DATABASE
// ==========================================
export interface VaultTransaction {
  id: string;
  timestamp: string;
  customerName: string;
  accountNumber: string;
  cardNumberMasked: string;
  cardNetwork: 'Visa' | 'Mastercard' | 'JCB' | 'Amex';
  amountUSD: number;
  merchantName: string;
  merchantMcc: string;
  channel: 'POS' | 'Online / Web' | 'Wire / ACH' | 'Mobile App';
  region: 'EU Payments' | 'US Core' | 'APAC Cards' | 'Global Routing';
  riskScore: number;
  status: 'Cleared' | 'Flagged' | 'Under Review' | 'Blocked';
  ruleTriggered?: string;
  location: string;
  ipAddress: string;
}

export const INITIAL_TRANSACTIONS: VaultTransaction[] = [
  {
    id: 'TX-90218',
    timestamp: '2 min ago',
    customerName: 'Emily Watson',
    accountNumber: 'ACC-09412',
    cardNumberMasked: '4532 •••• •••• 8812',
    cardNetwork: 'Visa',
    amountUSD: 1240.5,
    merchantName: 'Harrods London Retail',
    merchantMcc: '5311 (Department Stores)',
    channel: 'POS',
    region: 'EU Payments',
    riskScore: 24,
    status: 'Cleared',
    location: 'London, UK',
    ipAddress: '194.223.12.8',
  },
  {
    id: 'TX-90217',
    timestamp: '5 min ago',
    customerName: 'V-Capital Trade Pte Ltd',
    accountNumber: 'ACC-09144',
    cardNumberMasked: '5120 •••• •••• 9921',
    cardNetwork: 'Mastercard',
    amountUSD: 9800.0,
    merchantName: 'CloudCompute Services SG',
    merchantMcc: '7372 (Computer Programming)',
    channel: 'Online / Web',
    region: 'APAC Cards',
    riskScore: 84,
    status: 'Flagged',
    ruleTriggered: 'RULE-101: Velocity Threshold Exceeded (> $5,000 / hr)',
    location: 'Singapore, SG',
    ipAddress: '103.24.182.11',
  },
  {
    id: 'TX-90216',
    timestamp: '9 min ago',
    customerName: 'Alpha Corp Ltd',
    accountNumber: 'ACC-10482',
    cardNumberMasked: '4912 •••• •••• 3314',
    cardNetwork: 'Visa',
    amountUSD: 18400.0,
    merchantName: 'Emirates Petrochem FZCO',
    merchantMcc: '5172 (Petroleum Products)',
    channel: 'Wire / ACH',
    region: 'Global Routing',
    riskScore: 68,
    status: 'Under Review',
    ruleTriggered: 'RULE-104: Cross-Corridor High Value Wire',
    location: 'Dubai, UAE',
    ipAddress: '94.200.41.9',
  },
  {
    id: 'TX-90215',
    timestamp: '14 min ago',
    customerName: 'Kenji Sato',
    accountNumber: 'ACC-11029',
    cardNumberMasked: '3528 •••• •••• 0192',
    cardNetwork: 'JCB',
    amountUSD: 310.0,
    merchantName: 'Tokyo Electronic Goods',
    merchantMcc: '5732 (Electronics Stores)',
    channel: 'Online / Web',
    region: 'APAC Cards',
    riskScore: 12,
    status: 'Cleared',
    location: 'Tokyo, JP',
    ipAddress: '133.242.18.90',
  },
  {
    id: 'TX-90214',
    timestamp: '18 min ago',
    customerName: 'Liam O’Connor',
    accountNumber: 'ACC-08912',
    cardNumberMasked: '5412 •••• •••• 7712',
    cardNetwork: 'Mastercard',
    amountUSD: 4290.0,
    merchantName: 'Stripe Settlement Gateway Dublin',
    merchantMcc: '7389 (Business Services)',
    channel: 'Online / Web',
    region: 'EU Payments',
    riskScore: 31,
    status: 'Cleared',
    location: 'Dublin, IE',
    ipAddress: '52.18.92.10',
  },
  {
    id: 'TX-90213',
    timestamp: '22 min ago',
    customerName: 'Apex Global FZ',
    accountNumber: 'AC-8841-092',
    cardNumberMasked: '4000 •••• •••• 0041',
    cardNetwork: 'Visa',
    amountUSD: 24500.0,
    merchantName: 'CryptoFlow Vault Direct',
    merchantMcc: '6051 (Quasi-Cash / Crypto)',
    channel: 'Online / Web',
    region: 'APAC Cards',
    riskScore: 96,
    status: 'Blocked',
    ruleTriggered: 'RULE-99: Prohibited Merchant Category + Unverified Shell Company',
    location: 'Tortola, BVI (Proxy)',
    ipAddress: '185.220.101.5',
  },
  {
    id: 'TX-90212',
    timestamp: '30 min ago',
    customerName: 'Marcus Sterling',
    accountNumber: 'ACC-14902',
    cardNumberMasked: '3782 •••• •••• 8109',
    cardNetwork: 'Amex',
    amountUSD: 3450.0,
    merchantName: 'Delta Air Lines International',
    merchantMcc: '3058 (Airlines)',
    channel: 'Mobile App',
    region: 'US Core',
    riskScore: 18,
    status: 'Cleared',
    location: 'Atlanta, US',
    ipAddress: '68.12.90.4',
  },
  {
    id: 'TX-90211',
    timestamp: '45 min ago',
    customerName: 'Sarah Jenkins',
    accountNumber: 'ACC-12001',
    cardNumberMasked: '4111 •••• •••• 4111',
    cardNetwork: 'Visa',
    amountUSD: 850.0,
    merchantName: 'Apple Store New York',
    merchantMcc: '5732 (Electronics Stores)',
    channel: 'POS',
    region: 'US Core',
    riskScore: 15,
    status: 'Cleared',
    location: 'New York, US',
    ipAddress: '12.182.9.44',
  },
];

// ==========================================
// FRAUD DETECTION RULES & ANOMALY ENGINE
// ==========================================
export interface FraudRule {
  id: string;
  name: string;
  condition: string;
  threshold: string;
  action: 'Block' | 'Review' | 'Challenge 3DS' | 'Flag';
  triggersToday: number;
  accuracy: string;
  enabled: boolean;
  category: 'Velocity' | 'Geolocation' | 'Device' | 'Machine Learning' | 'Compliance';
}

export const INITIAL_FRAUD_RULES: FraudRule[] = [
  {
    id: 'RULE-101',
    name: 'High-Velocity Card Testing on Checkout',
    condition: 'Transaction count > 20 within 60 seconds on single IP or card prefix',
    threshold: '20 tx / 60 sec',
    action: 'Block',
    triggersToday: 142,
    accuracy: '99.2%',
    enabled: true,
    category: 'Velocity',
  },
  {
    id: 'RULE-104',
    name: 'Card-Not-Present Billing IP Distance > 3,000km',
    condition: 'Geographic discrepancy between issuing bank country & client IP > 3,000km',
    threshold: '> 3,000 km',
    action: 'Review',
    triggersToday: 48,
    accuracy: '94.6%',
    enabled: true,
    category: 'Geolocation',
  },
  {
    id: 'RULE-202',
    name: 'XGBoost Synthetic Identity Probability > 0.85',
    condition: 'Combination of freshly minted email (< 14d) + new device fingerprint + SSN anomaly',
    threshold: 'Score >= 0.85',
    action: 'Block',
    triggersToday: 19,
    accuracy: '98.8%',
    enabled: true,
    category: 'Machine Learning',
  },
  {
    id: 'RULE-305',
    name: 'Cryptocurrency / Quasi-Cash Unregistered Merchant',
    condition: 'MCC 6051 or 6211 transaction without verified EDD corporate profile',
    threshold: 'MCC 6051 / 6211',
    action: 'Block',
    triggersToday: 11,
    accuracy: '100%',
    enabled: true,
    category: 'Compliance',
  },
  {
    id: 'RULE-408',
    name: 'Dormant Account High-Value Liquidation',
    condition: 'Account inactive for > 180 days attempting transfer > $10,000',
    threshold: 'Inactive > 180d, Amt > $10k',
    action: 'Challenge 3DS',
    triggersToday: 8,
    accuracy: '96.1%',
    enabled: true,
    category: 'Velocity',
  },

  { id: 'RULE-110', name: 'Unusual Cross-Border Burst', condition: 'Score and transaction behavior exceed configured risk profile', threshold: '> 5 events / 10 min', action: 'Review', triggersToday: 5, accuracy: '98.4%', enabled: true, category: 'Velocity' },
  { id: 'RULE-111', name: 'Device Fingerprint Reuse', condition: 'Score and transaction behavior exceed configured risk profile', threshold: '> 6 events / 10 min', action: 'Challenge 3DS', triggersToday: 8, accuracy: '98.4%', enabled: true, category: 'Device' },
  { id: 'RULE-112', name: 'Account Takeover Signal', condition: 'Score and transaction behavior exceed configured risk profile', threshold: '> 7 events / 10 min', action: 'Block', triggersToday: 11, accuracy: '98.4%', enabled: true, category: 'Machine Learning' },
  { id: 'RULE-113', name: 'Rapid Refund Abuse', condition: 'Score and transaction behavior exceed configured risk profile', threshold: '> 8 events / 10 min', action: 'Flag', triggersToday: 14, accuracy: '98.4%', enabled: true, category: 'Compliance' },
  { id: 'RULE-114', name: 'BIN Enumeration Pattern', condition: 'Score and transaction behavior exceed configured risk profile', threshold: '> 9 events / 10 min', action: 'Review', triggersToday: 17, accuracy: '98.4%', enabled: true, category: 'Geolocation' },
  { id: 'RULE-115', name: 'Impossible Travel Velocity', condition: 'Score and transaction behavior exceed configured risk profile', threshold: '> 10 events / 10 min', action: 'Challenge 3DS', triggersToday: 20, accuracy: '98.4%', enabled: true, category: 'Velocity' },
  { id: 'RULE-116', name: 'Synthetic Email Cluster', condition: 'Score and transaction behavior exceed configured risk profile', threshold: '> 11 events / 10 min', action: 'Block', triggersToday: 23, accuracy: '98.4%', enabled: true, category: 'Device' },
  { id: 'RULE-117', name: 'High-Risk MCC Activity', condition: 'Score and transaction behavior exceed configured risk profile', threshold: '> 12 events / 10 min', action: 'Flag', triggersToday: 26, accuracy: '98.4%', enabled: true, category: 'Machine Learning' },
  { id: 'RULE-118', name: 'Repeated Decline Retry', condition: 'Score and transaction behavior exceed configured risk profile', threshold: '> 13 events / 10 min', action: 'Review', triggersToday: 29, accuracy: '98.4%', enabled: true, category: 'Compliance' },
  { id: 'RULE-119', name: 'Dormant Account Reactivation', condition: 'Score and transaction behavior exceed configured risk profile', threshold: '> 14 events / 10 min', action: 'Challenge 3DS', triggersToday: 32, accuracy: '98.4%', enabled: true, category: 'Geolocation' },
  { id: 'RULE-120', name: 'Unusual Cross-Border Burst', condition: 'Score and transaction behavior exceed configured risk profile', threshold: '> 15 events / 10 min', action: 'Block', triggersToday: 35, accuracy: '98.4%', enabled: true, category: 'Velocity' },
  { id: 'RULE-121', name: 'Device Fingerprint Reuse', condition: 'Score and transaction behavior exceed configured risk profile', threshold: '> 16 events / 10 min', action: 'Flag', triggersToday: 38, accuracy: '98.4%', enabled: true, category: 'Device' },
  { id: 'RULE-122', name: 'Account Takeover Signal', condition: 'Score and transaction behavior exceed configured risk profile', threshold: '> 17 events / 10 min', action: 'Review', triggersToday: 41, accuracy: '98.4%', enabled: true, category: 'Machine Learning' },
  { id: 'RULE-123', name: 'Rapid Refund Abuse', condition: 'Score and transaction behavior exceed configured risk profile', threshold: '> 18 events / 10 min', action: 'Challenge 3DS', triggersToday: 44, accuracy: '98.4%', enabled: true, category: 'Compliance' },
  { id: 'RULE-124', name: 'BIN Enumeration Pattern', condition: 'Score and transaction behavior exceed configured risk profile', threshold: '> 19 events / 10 min', action: 'Block', triggersToday: 47, accuracy: '98.4%', enabled: true, category: 'Geolocation' }
];

// ==========================================
// INVESTIGATION CASES
// ==========================================
export interface InvestigationCase {
  id: string;
  title: string;
  exposureUSD: number;
  suspectCount: number;
  leadInvestigator: string;
  status: 'Investigating' | 'Monitoring' | 'Resolved' | 'Escalated to FIU';
  priority: 'Critical' | 'High' | 'Medium';
  openedDate: string;
  summary: string;
  notesCount: number;
  linkedAlertCode: string;
}

export const INITIAL_CASES: InvestigationCase[] = [
  {
    id: 'CASE-4401',
    title: 'Syndicate Card Cycling & BIN Exhaustion',
    exposureUSD: 48200,
    suspectCount: 14,
    leadInvestigator: 'John Lee',
    status: 'Investigating',
    priority: 'Critical',
    openedDate: 'Oct 02, 2026',
    summary: 'Organized testing of compromised Australian BIN ranges across 18 e-commerce merchants in Singapore.',
    notesCount: 6,
    linkedAlertCode: 'ALT-002',
  },
  {
    id: 'CASE-4398',
    title: 'BIN Range Attack on AU Merchant Gateways',
    exposureUSD: 12400,
    suspectCount: 8,
    leadInvestigator: 'Emily Wang',
    status: 'Monitoring',
    priority: 'High',
    openedDate: 'Oct 01, 2026',
    summary: 'Small recurring card authorizations testing valid CVVs through digital subscription services.',
    notesCount: 4,
    linkedAlertCode: 'ALT-003',
  },
  {
    id: 'CASE-4390',
    title: 'Prepaid Virtual Card Cashout Network',
    exposureUSD: 89000,
    suspectCount: 22,
    leadInvestigator: 'Vikram Rao',
    status: 'Escalated to FIU',
    priority: 'Critical',
    openedDate: 'Sep 28, 2026',
    summary: 'Systematic cross-border layering utilizing newly registered Singaporean shell companies.',
    notesCount: 11,
    linkedAlertCode: 'ALT-011',
  },
  {
    id: 'CASE-4384',
    title: 'Merchant Point-of-Sale Firmware Tamper Investigation',
    exposureUSD: 23500,
    suspectCount: 3,
    leadInvestigator: 'Amina Hassan',
    status: 'Resolved',
    priority: 'Medium',
    openedDate: 'Sep 24, 2026',
    summary: 'Hardware token cryptographic mismatch on 3 terminals in Middle East retail outlets.',
    notesCount: 8,
    linkedAlertCode: 'ALT-005',
  },
];

// ==========================================
// CUSTOMER RISK PROFILES
// ==========================================
export interface CustomerRiskProfile {
  id: string;
  name: string;
  type: 'Corporate' | 'Individual';
  accountNumber: string;
  riskScore: number;
  status: 'High Risk' | 'Elevated' | 'Nominal';
  lastActive: string;
  totalVolumeUSD: number;
  linkedCardsCount: number;
  kycStatus: 'Verified' | 'Pending Review' | 'Flagged';
  flagReason?: string;
  country: string;
}

export const INITIAL_CUSTOMERS: CustomerRiskProfile[] = [
  {
    id: 'CUST-8812',
    name: 'Alpha Corp Ltd',
    type: 'Corporate',
    accountNumber: 'ACC-10482',
    riskScore: 92,
    status: 'High Risk',
    lastActive: '2m ago',
    totalVolumeUSD: 284000,
    linkedCardsCount: 4,
    kycStatus: 'Verified',
    flagReason: 'High wire velocity to high-risk offshore corridor',
    country: 'India / UAE',
  },
  {
    id: 'CUST-8740',
    name: 'Apex Global FZ',
    type: 'Corporate',
    accountNumber: 'AC-8841-092',
    riskScore: 96,
    status: 'High Risk',
    lastActive: '10m ago',
    totalVolumeUSD: 412000,
    linkedCardsCount: 2,
    kycStatus: 'Flagged',
    flagReason: 'Shell entity incorporation date < 38 days',
    country: 'Singapore',
  },
  {
    id: 'CUST-8610',
    name: 'Emily Watson',
    type: 'Individual',
    accountNumber: 'ACC-09412',
    riskScore: 21,
    status: 'Nominal',
    lastActive: '1h ago',
    totalVolumeUSD: 14200,
    linkedCardsCount: 2,
    kycStatus: 'Verified',
    country: 'Australia',
  },
  {
    id: 'CUST-8592',
    name: 'Kenji Sato',
    type: 'Individual',
    accountNumber: 'ACC-11029',
    riskScore: 34,
    status: 'Nominal',
    lastActive: '14m ago',
    totalVolumeUSD: 8900,
    linkedCardsCount: 1,
    kycStatus: 'Pending Review',
    country: 'Japan',
  },
  {
    id: 'CUST-8401',
    name: 'V-Capital Trade Pte Ltd',
    type: 'Corporate',
    accountNumber: 'ACC-09144',
    riskScore: 78,
    status: 'Elevated',
    lastActive: '5m ago',
    totalVolumeUSD: 189000,
    linkedCardsCount: 3,
    kycStatus: 'Verified',
    flagReason: 'Unusual rapid turnover within settlement window',
    country: 'Singapore',
  },
  {
    id: 'CUST-8311',
    name: 'Zenith Software Systems',
    type: 'Corporate',
    accountNumber: 'ACC-07119',
    riskScore: 14,
    status: 'Nominal',
    lastActive: '3h ago',
    totalVolumeUSD: 520000,
    linkedCardsCount: 6,
    kycStatus: 'Verified',
    country: 'United Kingdom',
  },

  { id: 'CUST-9000', name: 'Northstar Retail', type: 'Corporate', accountNumber: 'ACC-12000', riskScore: 92, status: 'High Risk', lastActive: '3 min ago', totalVolumeUSD: 25000, linkedCardsCount: 1, kycStatus: 'Verified', country: 'India' },
  { id: 'CUST-9001', name: 'Bluewave Logistics', type: 'Individual', accountNumber: 'ACC-12001', riskScore: 33, status: 'Nominal', lastActive: '4 min ago', totalVolumeUSD: 29900, linkedCardsCount: 2, kycStatus: 'Pending Review', country: 'United Kingdom' },
  { id: 'CUST-9002', name: 'Cedar Financial', type: 'Individual', accountNumber: 'ACC-12002', riskScore: 34, status: 'Nominal', lastActive: '5 min ago', totalVolumeUSD: 34800, linkedCardsCount: 3, kycStatus: 'Flagged', country: 'Singapore' },
  { id: 'CUST-9003', name: 'Orion Technologies', type: 'Corporate', accountNumber: 'ACC-12003', riskScore: 35, status: 'Nominal', lastActive: '6 min ago', totalVolumeUSD: 39700, linkedCardsCount: 4, kycStatus: 'Verified', country: 'Australia' },
  { id: 'CUST-9004', name: 'Maple Health Group', type: 'Individual', accountNumber: 'ACC-12004', riskScore: 36, status: 'Nominal', lastActive: '7 min ago', totalVolumeUSD: 44600, linkedCardsCount: 5, kycStatus: 'Pending Review', country: 'United States' },
  { id: 'CUST-9005', name: 'Silverline Imports', type: 'Individual', accountNumber: 'ACC-12005', riskScore: 69, status: 'Elevated', lastActive: '8 min ago', totalVolumeUSD: 49500, linkedCardsCount: 1, kycStatus: 'Flagged', country: 'India' },
  { id: 'CUST-9006', name: 'Harborview Foods', type: 'Corporate', accountNumber: 'ACC-12006', riskScore: 38, status: 'Nominal', lastActive: '9 min ago', totalVolumeUSD: 54400, linkedCardsCount: 2, kycStatus: 'Verified', country: 'United Kingdom' },
  { id: 'CUST-9007', name: 'Summit Energy', type: 'Individual', accountNumber: 'ACC-12007', riskScore: 92, status: 'High Risk', lastActive: '10 min ago', totalVolumeUSD: 59300, linkedCardsCount: 3, kycStatus: 'Pending Review', country: 'Singapore' },
  { id: 'CUST-9008', name: 'Pioneer Media', type: 'Individual', accountNumber: 'ACC-12008', riskScore: 40, status: 'Nominal', lastActive: '11 min ago', totalVolumeUSD: 64200, linkedCardsCount: 4, kycStatus: 'Flagged', country: 'Australia' },
  { id: 'CUST-9009', name: 'Evergreen Markets', type: 'Corporate', accountNumber: 'ACC-12009', riskScore: 41, status: 'Nominal', lastActive: '12 min ago', totalVolumeUSD: 69100, linkedCardsCount: 5, kycStatus: 'Verified', country: 'United States' },
  { id: 'CUST-9010', name: 'Redwood Consulting', type: 'Individual', accountNumber: 'ACC-12010', riskScore: 69, status: 'Elevated', lastActive: '13 min ago', totalVolumeUSD: 74000, linkedCardsCount: 1, kycStatus: 'Pending Review', country: 'India' },
  { id: 'CUST-9011', name: 'Atlas Mobility', type: 'Individual', accountNumber: 'ACC-12011', riskScore: 43, status: 'Nominal', lastActive: '14 min ago', totalVolumeUSD: 78900, linkedCardsCount: 2, kycStatus: 'Flagged', country: 'United Kingdom' },
  { id: 'CUST-9012', name: 'BrightPath Education', type: 'Corporate', accountNumber: 'ACC-12012', riskScore: 44, status: 'Nominal', lastActive: '15 min ago', totalVolumeUSD: 83800, linkedCardsCount: 3, kycStatus: 'Verified', country: 'Singapore' },
  { id: 'CUST-9013', name: 'Cobalt Manufacturing', type: 'Individual', accountNumber: 'ACC-12013', riskScore: 45, status: 'Nominal', lastActive: '16 min ago', totalVolumeUSD: 88700, linkedCardsCount: 4, kycStatus: 'Pending Review', country: 'Australia' },
  { id: 'CUST-9014', name: 'Meadowbrook Travel', type: 'Individual', accountNumber: 'ACC-12014', riskScore: 92, status: 'High Risk', lastActive: '17 min ago', totalVolumeUSD: 93600, linkedCardsCount: 5, kycStatus: 'Flagged', country: 'United States' },
  { id: 'CUST-9015', name: 'Vertex Telecom', type: 'Corporate', accountNumber: 'ACC-12015', riskScore: 69, status: 'Elevated', lastActive: '18 min ago', totalVolumeUSD: 98500, linkedCardsCount: 1, kycStatus: 'Verified', country: 'India' },
  { id: 'CUST-9016', name: 'Golden Gate Supplies', type: 'Individual', accountNumber: 'ACC-12016', riskScore: 48, status: 'Nominal', lastActive: '19 min ago', totalVolumeUSD: 103400, linkedCardsCount: 2, kycStatus: 'Pending Review', country: 'United Kingdom' },
  { id: 'CUST-9017', name: 'Riverstone Holdings', type: 'Individual', accountNumber: 'ACC-12017', riskScore: 49, status: 'Nominal', lastActive: '20 min ago', totalVolumeUSD: 108300, linkedCardsCount: 3, kycStatus: 'Flagged', country: 'Singapore' },
  { id: 'CUST-9018', name: 'Cloudline Systems', type: 'Corporate', accountNumber: 'ACC-12018', riskScore: 50, status: 'Nominal', lastActive: '21 min ago', totalVolumeUSD: 113200, linkedCardsCount: 4, kycStatus: 'Verified', country: 'Australia' },
  { id: 'CUST-9019', name: 'Urban Harvest', type: 'Individual', accountNumber: 'ACC-12019', riskScore: 51, status: 'Nominal', lastActive: '22 min ago', totalVolumeUSD: 118100, linkedCardsCount: 5, kycStatus: 'Pending Review', country: 'United States' },
  { id: 'CUST-9020', name: 'Saffron Commerce', type: 'Individual', accountNumber: 'ACC-12020', riskScore: 69, status: 'Elevated', lastActive: '23 min ago', totalVolumeUSD: 123000, linkedCardsCount: 1, kycStatus: 'Flagged', country: 'India' },
  { id: 'CUST-9021', name: 'Polar Distribution', type: 'Corporate', accountNumber: 'ACC-12021', riskScore: 92, status: 'High Risk', lastActive: '24 min ago', totalVolumeUSD: 127900, linkedCardsCount: 2, kycStatus: 'Verified', country: 'United Kingdom' },
  { id: 'CUST-9022', name: 'Lighthouse Payments', type: 'Individual', accountNumber: 'ACC-12022', riskScore: 54, status: 'Nominal', lastActive: '25 min ago', totalVolumeUSD: 132800, linkedCardsCount: 3, kycStatus: 'Pending Review', country: 'Singapore' },
  { id: 'CUST-9023', name: 'Oak & Iron Studio', type: 'Individual', accountNumber: 'ACC-12023', riskScore: 55, status: 'Nominal', lastActive: '26 min ago', totalVolumeUSD: 137700, linkedCardsCount: 4, kycStatus: 'Flagged', country: 'Australia' },
  { id: 'CUST-9024', name: 'Eastwind Exports', type: 'Corporate', accountNumber: 'ACC-12024', riskScore: 32, status: 'Nominal', lastActive: '27 min ago', totalVolumeUSD: 142600, linkedCardsCount: 5, kycStatus: 'Verified', country: 'United States' },
  { id: 'CUST-9025', name: 'Crescent Pharma', type: 'Individual', accountNumber: 'ACC-12025', riskScore: 69, status: 'Elevated', lastActive: '28 min ago', totalVolumeUSD: 147500, linkedCardsCount: 1, kycStatus: 'Pending Review', country: 'India' },
  { id: 'CUST-9026', name: 'Nova Home Goods', type: 'Individual', accountNumber: 'ACC-12026', riskScore: 34, status: 'Nominal', lastActive: '29 min ago', totalVolumeUSD: 152400, linkedCardsCount: 2, kycStatus: 'Flagged', country: 'United Kingdom' },
  { id: 'CUST-9027', name: 'Sterling Aviation', type: 'Corporate', accountNumber: 'ACC-12027', riskScore: 35, status: 'Nominal', lastActive: '30 min ago', totalVolumeUSD: 157300, linkedCardsCount: 3, kycStatus: 'Verified', country: 'Singapore' },
  { id: 'CUST-9028', name: 'Greenfield Grocers', type: 'Individual', accountNumber: 'ACC-12028', riskScore: 92, status: 'High Risk', lastActive: '31 min ago', totalVolumeUSD: 162200, linkedCardsCount: 4, kycStatus: 'Pending Review', country: 'Australia' },
  { id: 'CUST-9029', name: 'Monarch Hospitality', type: 'Individual', accountNumber: 'ACC-12029', riskScore: 37, status: 'Nominal', lastActive: '32 min ago', totalVolumeUSD: 167100, linkedCardsCount: 5, kycStatus: 'Flagged', country: 'United States' },
  { id: 'CUST-9030', name: 'Aspen Data Works', type: 'Corporate', accountNumber: 'ACC-12030', riskScore: 69, status: 'Elevated', lastActive: '33 min ago', totalVolumeUSD: 172000, linkedCardsCount: 1, kycStatus: 'Verified', country: 'India' },
  { id: 'CUST-9031', name: 'Keystone Auto', type: 'Individual', accountNumber: 'ACC-12031', riskScore: 39, status: 'Nominal', lastActive: '34 min ago', totalVolumeUSD: 176900, linkedCardsCount: 2, kycStatus: 'Pending Review', country: 'United Kingdom' },
  { id: 'CUST-9032', name: 'Bluebird Wellness', type: 'Individual', accountNumber: 'ACC-12032', riskScore: 40, status: 'Nominal', lastActive: '35 min ago', totalVolumeUSD: 181800, linkedCardsCount: 3, kycStatus: 'Flagged', country: 'Singapore' },
  { id: 'CUST-9033', name: 'Westlake Apparel', type: 'Corporate', accountNumber: 'ACC-12033', riskScore: 41, status: 'Nominal', lastActive: '36 min ago', totalVolumeUSD: 186700, linkedCardsCount: 4, kycStatus: 'Verified', country: 'Australia' },
  { id: 'CUST-9034', name: 'Ironwood Capital', type: 'Individual', accountNumber: 'ACC-12034', riskScore: 42, status: 'Nominal', lastActive: '37 min ago', totalVolumeUSD: 191600, linkedCardsCount: 5, kycStatus: 'Pending Review', country: 'United States' },
  { id: 'CUST-9035', name: 'Sunrise Electronics', type: 'Individual', accountNumber: 'ACC-12035', riskScore: 92, status: 'High Risk', lastActive: '38 min ago', totalVolumeUSD: 196500, linkedCardsCount: 1, kycStatus: 'Flagged', country: 'India' },
  { id: 'CUST-9036', name: 'Coastal Freight', type: 'Corporate', accountNumber: 'ACC-12036', riskScore: 44, status: 'Nominal', lastActive: '39 min ago', totalVolumeUSD: 201400, linkedCardsCount: 2, kycStatus: 'Verified', country: 'United Kingdom' },
  { id: 'CUST-9037', name: 'Amberstone Labs', type: 'Individual', accountNumber: 'ACC-12037', riskScore: 45, status: 'Nominal', lastActive: '40 min ago', totalVolumeUSD: 206300, linkedCardsCount: 3, kycStatus: 'Pending Review', country: 'Singapore' },
  { id: 'CUST-9038', name: 'Highland Services', type: 'Individual', accountNumber: 'ACC-12038', riskScore: 46, status: 'Nominal', lastActive: '41 min ago', totalVolumeUSD: 211200, linkedCardsCount: 4, kycStatus: 'Flagged', country: 'Australia' },
  { id: 'CUST-9039', name: 'TrueNorth Digital', type: 'Corporate', accountNumber: 'ACC-12039', riskScore: 47, status: 'Nominal', lastActive: '42 min ago', totalVolumeUSD: 216100, linkedCardsCount: 5, kycStatus: 'Verified', country: 'United States' },
  { id: 'CUST-9040', name: 'Parkside Pharmacy', type: 'Individual', accountNumber: 'ACC-12040', riskScore: 69, status: 'Elevated', lastActive: '43 min ago', totalVolumeUSD: 221000, linkedCardsCount: 1, kycStatus: 'Pending Review', country: 'India' },
  { id: 'CUST-9041', name: 'Cascade Furniture', type: 'Individual', accountNumber: 'ACC-12041', riskScore: 49, status: 'Nominal', lastActive: '44 min ago', totalVolumeUSD: 225900, linkedCardsCount: 2, kycStatus: 'Flagged', country: 'United Kingdom' },
  { id: 'CUST-9042', name: 'Willow Creek Farms', type: 'Corporate', accountNumber: 'ACC-12042', riskScore: 92, status: 'High Risk', lastActive: '45 min ago', totalVolumeUSD: 230800, linkedCardsCount: 3, kycStatus: 'Verified', country: 'Singapore' },
  { id: 'CUST-9043', name: 'Metroline Transit', type: 'Individual', accountNumber: 'ACC-12043', riskScore: 51, status: 'Nominal', lastActive: '46 min ago', totalVolumeUSD: 235700, linkedCardsCount: 4, kycStatus: 'Pending Review', country: 'Australia' }
];

// ==========================================
// MERCHANTS PORTFOLIO
// ==========================================
export interface MerchantProfile {
  id: string;
  name: string;
  mcc: string;
  category: string;
  chargebackRate: number; // e.g. 1.84%
  volumeUSD: number;
  status: 'Nominal' | 'Under Review' | 'Flagged / Hold';
  settlementStatus: 'Active' | 'Held';
  riskRating: 'Low' | 'Moderate' | 'High';
}

export const INITIAL_MERCHANTS: MerchantProfile[] = [
  {
    id: 'MERCH-0042',
    name: 'Global Luxury Imports SG',
    mcc: '5311',
    category: 'High-Value Luxury Goods',
    chargebackRate: 1.84,
    volumeUSD: 2400000,
    status: 'Under Review',
    settlementStatus: 'Held',
    riskRating: 'High',
  },
  {
    id: 'MERCH-0038',
    name: 'QuickPay Digital Services',
    mcc: '7389',
    category: 'Payment Aggregator',
    chargebackRate: 0.28,
    volumeUSD: 8900000,
    status: 'Nominal',
    settlementStatus: 'Active',
    riskRating: 'Low',
  },
  {
    id: 'MERCH-0029',
    name: 'Pacific Travel Ltd',
    mcc: '4722',
    category: 'Travel Agencies & Tour Operators',
    chargebackRate: 2.12,
    volumeUSD: 1100000,
    status: 'Flagged / Hold',
    settlementStatus: 'Held',
    riskRating: 'High',
  },
  {
    id: 'MERCH-0021',
    name: 'CloudCompute Networks',
    mcc: '7372',
    category: 'SaaS & Cloud Infrastructure',
    chargebackRate: 0.41,
    volumeUSD: 3600000,
    status: 'Nominal',
    settlementStatus: 'Active',
    riskRating: 'Low',
  },
  {
    id: 'MERCH-0018',
    name: 'Nexus Gaming & Virtual Entertainment',
    mcc: '7994',
    category: 'Digital Gaming & Microtransactions',
    chargebackRate: 1.45,
    volumeUSD: 4100000,
    status: 'Under Review',
    settlementStatus: 'Active',
    riskRating: 'Moderate',
  },

  { id: 'MERCH-0100', name: 'MarketSquare', mcc: '5411', category: 'Retail', chargebackRate: 0.22, volumeUSD: 900000, status: 'Under Review', settlementStatus: 'Held', riskRating: 'High' },
  { id: 'MERCH-0101', name: 'NovaPay', mcc: '5732', category: 'Electronics', chargebackRate: 0.46, volumeUSD: 1025000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0102', name: 'AeroLink', mcc: '4722', category: 'Travel', chargebackRate: 0.83, volumeUSD: 1150000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0103', name: 'FreshBasket', mcc: '5812', category: 'Dining', chargebackRate: 1.14, volumeUSD: 1275000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0104', name: 'PixelCraft', mcc: '7399', category: 'Business Services', chargebackRate: 0.22, volumeUSD: 1400000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Moderate' },
  { id: 'MERCH-0105', name: 'MetroTickets', mcc: '5411', category: 'Retail', chargebackRate: 0.46, volumeUSD: 1525000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0106', name: 'Luna Cosmetics', mcc: '5732', category: 'Electronics', chargebackRate: 0.83, volumeUSD: 1650000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0107', name: 'Summit Outdoors', mcc: '4722', category: 'Travel', chargebackRate: 1.14, volumeUSD: 1775000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0108', name: 'QuickCart', mcc: '5812', category: 'Dining', chargebackRate: 0.22, volumeUSD: 1900000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Moderate' },
  { id: 'MERCH-0109', name: 'Harbor Books', mcc: '7399', category: 'Business Services', chargebackRate: 0.46, volumeUSD: 2025000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0110', name: 'Zenith Mobile', mcc: '5411', category: 'Retail', chargebackRate: 0.83, volumeUSD: 2150000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0111', name: 'Urban Threads', mcc: '5732', category: 'Electronics', chargebackRate: 1.14, volumeUSD: 2275000, status: 'Under Review', settlementStatus: 'Active', riskRating: 'High' },
  { id: 'MERCH-0112', name: 'CloudNine Hosting', mcc: '4722', category: 'Travel', chargebackRate: 0.22, volumeUSD: 2400000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Moderate' },
  { id: 'MERCH-0113', name: 'Cedar Pharmacy', mcc: '5812', category: 'Dining', chargebackRate: 0.46, volumeUSD: 2525000, status: 'Nominal', settlementStatus: 'Held', riskRating: 'Low' },
  { id: 'MERCH-0114', name: 'Bluefin Travel', mcc: '7399', category: 'Business Services', chargebackRate: 0.83, volumeUSD: 2650000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0115', name: 'Pioneer Tools', mcc: '5411', category: 'Retail', chargebackRate: 1.14, volumeUSD: 2775000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0116', name: 'BrightHome', mcc: '5732', category: 'Electronics', chargebackRate: 0.22, volumeUSD: 2900000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Moderate' },
  { id: 'MERCH-0117', name: 'Silver Spoon', mcc: '4722', category: 'Travel', chargebackRate: 0.46, volumeUSD: 3025000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0118', name: 'Atlas Fitness', mcc: '5812', category: 'Dining', chargebackRate: 0.83, volumeUSD: 3150000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0119', name: 'Everest Learning', mcc: '7399', category: 'Business Services', chargebackRate: 1.14, volumeUSD: 3275000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0120', name: 'GreenLeaf Market', mcc: '5411', category: 'Retail', chargebackRate: 0.22, volumeUSD: 3400000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Moderate' },
  { id: 'MERCH-0121', name: 'Orchid Beauty', mcc: '5732', category: 'Electronics', chargebackRate: 0.46, volumeUSD: 3525000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0122', name: 'Northstar Media', mcc: '4722', category: 'Travel', chargebackRate: 0.83, volumeUSD: 3650000, status: 'Under Review', settlementStatus: 'Active', riskRating: 'High' },
  { id: 'MERCH-0123', name: 'Coastline Rentals', mcc: '5812', category: 'Dining', chargebackRate: 1.14, volumeUSD: 3775000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0124', name: 'RedRock Motors', mcc: '7399', category: 'Business Services', chargebackRate: 0.22, volumeUSD: 3900000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Moderate' },
  { id: 'MERCH-0125', name: 'Maple & Main', mcc: '5411', category: 'Retail', chargebackRate: 0.46, volumeUSD: 4025000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0126', name: 'SwiftShip Global', mcc: '5732', category: 'Electronics', chargebackRate: 0.83, volumeUSD: 4150000, status: 'Nominal', settlementStatus: 'Held', riskRating: 'Low' },
  { id: 'MERCH-0127', name: 'Golden Hour Jewelry', mcc: '4722', category: 'Travel', chargebackRate: 1.14, volumeUSD: 4275000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0128', name: 'Cobalt Gaming', mcc: '5812', category: 'Dining', chargebackRate: 0.22, volumeUSD: 4400000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Moderate' },
  { id: 'MERCH-0129', name: 'Riverbend Dining', mcc: '7399', category: 'Business Services', chargebackRate: 0.46, volumeUSD: 4525000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0130', name: 'TrueNorth Telecom', mcc: '5411', category: 'Retail', chargebackRate: 0.83, volumeUSD: 4650000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0131', name: 'Sunbeam Solar', mcc: '5732', category: 'Electronics', chargebackRate: 1.14, volumeUSD: 4775000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0132', name: 'Oakridge Supplies', mcc: '4722', category: 'Travel', chargebackRate: 0.22, volumeUSD: 4900000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Moderate' },
  { id: 'MERCH-0133', name: 'Polar Express', mcc: '5812', category: 'Dining', chargebackRate: 0.46, volumeUSD: 5025000, status: 'Under Review', settlementStatus: 'Active', riskRating: 'High' },
  { id: 'MERCH-0134', name: 'Meadow Foods', mcc: '7399', category: 'Business Services', chargebackRate: 0.83, volumeUSD: 5150000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0135', name: 'Keystone Software', mcc: '5411', category: 'Retail', chargebackRate: 1.14, volumeUSD: 5275000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0136', name: 'Willow Wellness', mcc: '5732', category: 'Electronics', chargebackRate: 0.22, volumeUSD: 5400000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Moderate' },
  { id: 'MERCH-0137', name: 'Crescent Airlines', mcc: '4722', category: 'Travel', chargebackRate: 0.46, volumeUSD: 5525000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0138', name: 'Parkview Hotels', mcc: '5812', category: 'Dining', chargebackRate: 0.83, volumeUSD: 5650000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0139', name: 'Vertex Marketplace', mcc: '7399', category: 'Business Services', chargebackRate: 1.14, volumeUSD: 5775000, status: 'Nominal', settlementStatus: 'Held', riskRating: 'Low' },
  { id: 'MERCH-0140', name: 'Saffron Kitchen', mcc: '5411', category: 'Retail', chargebackRate: 0.22, volumeUSD: 5900000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Moderate' },
  { id: 'MERCH-0141', name: 'Highland Books', mcc: '5732', category: 'Electronics', chargebackRate: 0.46, volumeUSD: 6025000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0142', name: 'Amber Electronics', mcc: '4722', category: 'Travel', chargebackRate: 0.83, volumeUSD: 6150000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0143', name: 'Westwind Apparel', mcc: '5812', category: 'Dining', chargebackRate: 1.14, volumeUSD: 6275000, status: 'Nominal', settlementStatus: 'Active', riskRating: 'Low' },
  { id: 'MERCH-0144', name: 'Cascade Crafts', mcc: '7399', category: 'Business Services', chargebackRate: 0.22, volumeUSD: 6400000, status: 'Under Review', settlementStatus: 'Active', riskRating: 'High' }
];

// ==========================================
// MACHINE LEARNING MODELS
// ==========================================
export interface MachineLearningModel {
  id: string;
  name: string;
  version: string;
  type: string;
  accuracy: number;
  precision: number;
  recall: number;
  latencyMs: number;
  mode: 'Live (Production)' | 'Shadow Mode';
  lastTrained: string;
  driftScore: number;
}

export const INITIAL_MODELS: MachineLearningModel[] = [
  {
    id: 'MODEL-X9',
    name: 'Deep Fraud Neural Network',
    version: 'v3.8.4',
    type: 'Multi-layer Perceptron (Embeddings)',
    accuracy: 99.4,
    precision: 98.6,
    recall: 99.1,
    latencyMs: 14,
    mode: 'Live (Production)',
    lastTrained: 'Oct 01, 2026',
    driftScore: 0.012,
  },
  {
    id: 'MODEL-B4',
    name: 'Bayesian Velocity Predictor',
    version: 'v2.1.0',
    type: 'Hierarchical Bayesian Time-Series',
    accuracy: 98.1,
    precision: 97.4,
    recall: 96.8,
    latencyMs: 6,
    mode: 'Live (Production)',
    lastTrained: 'Sep 29, 2026',
    driftScore: 0.008,
  },
  {
    id: 'MODEL-S2',
    name: 'XGBoost Synthetic Identity Classifier',
    version: 'v4.0.1',
    type: 'Gradient Boosted Decision Trees',
    accuracy: 98.9,
    precision: 99.0,
    recall: 97.5,
    latencyMs: 8,
    mode: 'Live (Production)',
    lastTrained: 'Oct 02, 2026',
    driftScore: 0.015,
  },
  {
    id: 'MODEL-I1',
    name: 'Graph Isolation Forest for Syndicates',
    version: 'v1.5.2',
    type: 'Graph Neural Network (Unsupervised)',
    accuracy: 97.5,
    precision: 95.8,
    recall: 98.2,
    latencyMs: 22,
    mode: 'Shadow Mode',
    lastTrained: 'Sep 26, 2026',
    driftScore: 0.024,
  },
];

// ==========================================
// COMPLIANCE FRAMEWORKS & MANDATES
// ==========================================
export interface ComplianceFramework {
  id: string;
  name: string;
  authority: string;
  status: 'Compliant (100%)' | 'Action Required' | 'Audit in Progress';
  nextAuditDate: string;
  checklistItems: Array<{ id: string; title: string; passed: boolean }>;
}

export const INITIAL_COMPLIANCE: ComplianceFramework[] = [
  {
    id: 'VISA-VROL',
    name: 'Visa Dispute Resolution Mandate 2026.2',
    authority: 'Visa International Risk Council',
    status: 'Compliant (100%)',
    nextAuditDate: 'Nov 15, 2026',
    checklistItems: [
      { id: 'v1', title: 'Automated 30-day pre-arbitration response', passed: true },
      { id: 'v2', title: 'Compelling Evidence 3.0 API handshake', passed: true },
      { id: 'v3', title: 'Real-time cardholder dispute notification token', passed: true },
    ],
  },
  {
    id: 'MC-MATCH',
    name: 'Mastercard Terminated Merchant Check (MATCH)',
    authority: 'Mastercard Global Clearing Standards',
    status: 'Compliant (100%)',
    nextAuditDate: 'Dec 01, 2026',
    checklistItems: [
      { id: 'm1', title: 'Daily automated MATCH API screening', passed: true },
      { id: 'm2', title: 'Principal owner beneficial identity verification', passed: true },
      { id: 'm3', title: 'Merchant chargeback ratio threshold enforcement', passed: true },
    ],
  },
  {
    id: 'PCI-DSS-4',
    name: 'Payment Card Industry Data Security Standard (v4.0.1)',
    authority: 'PCI Security Standards Council',
    status: 'Compliant (100%)',
    nextAuditDate: 'Jan 20, 2027',
    checklistItems: [
      { id: 'p1', title: 'Full end-to-end tokenization of PAN and CVV2 data', passed: true },
      { id: 'p2', title: 'Multi-factor authentication on all administrative endpoints', passed: true },
      { id: 'p3', title: 'Immutable cryptographic audit trails stored for 365 days', passed: true },
    ],
  },
  {
    id: 'RBI-PMLA',
    name: 'RBI Prevention of Money Laundering Act (PMLA 2026)',
    authority: 'Reserve Bank of India & Financial Intelligence Unit (FIU-IND)',
    status: 'Action Required',
    nextAuditDate: 'Oct 15, 2026',
    checklistItems: [
      { id: 'r1', title: 'Automated Cash Transaction Report (CTR) filing above ₹10 Lakhs', passed: true },
      { id: 'r2', title: 'Suspicious Activity Report (SAR) XML generation with SHA-256 seal', passed: true },
      { id: 'r3', title: 'Review flagged DBS Singapore shell entity (AC-8841-092)', passed: false },
    ],
  },
];

// ==========================================
// SYSTEM AUDIT LOGS & ADMIN DATA
// ==========================================
export interface AdminApiKey {
  id: string;
  name: string;
  prefix: string;
  scope: string;
  createdAt: string;
  lastUsed: string;
  status: 'Active' | 'Revoked';
}

export const INITIAL_API_KEYS: AdminApiKey[] = [
  {
    id: 'KEY-01',
    name: 'Production Gateway Live Ingestion',
    prefix: 'vg_live_88a9••••••••21',
    scope: 'Full Write (Transactions + Alerts)',
    createdAt: 'Sep 01, 2026',
    lastUsed: 'Just now',
    status: 'Active',
  },
  {
    id: 'KEY-02',
    name: 'Compliance Audit Exporter',
    prefix: 'vg_audit_44b1••••••••09',
    scope: 'Read Only (SAR & KYC Vault)',
    createdAt: 'Aug 15, 2026',
    lastUsed: '4 hours ago',
    status: 'Active',
  },
];
