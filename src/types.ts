export type VaultNavTab =
  | 'overview'
  | 'id-proofs'
  | 'transactions'
  | 'fraud-detection'
  | 'investigations'
  | 'customers'
  | 'merchants'
  | 'rules-models'
  | 'alerts'
  | 'reports'
  | 'banks'
  | 'compliance'
  | 'admin-panel'
  | 'ai-copilot'
  | 'profile';


export interface BankIdProof {
  id: string;
  customerName: string;
  accountNumber: string;
  bankName: string;
  docType: 'Passport' | 'National ID' | 'Driving License' | 'Certificate of Incorporation' | 'Tax ID / PAN' | 'Proof of Address';
  docNumberMasked: string;
  issuingAuthority: string;
  issuingCountry: string;
  issueDate: string;
  expiryDate: string;
  status: 'Verified' | 'Pending Review' | 'Flagged / Mismatch' | 'Expired';
  matchScore: number;
  extractedName: string;
  extractedDob: string;
  extractedAddress: string;
  checksum: string;
  uploadedAt: string;
  verifiedBy: string;
}

export interface OperatorProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  bankName: string;
  clearanceLevel: string;
  badgeNumber: string;
  email: string;
  avatarUrl?: string;
  tokenExpires: string;
}

export interface AlertIncident {
  id: string;
  code: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  segment: 'AU Cards' | 'APAC Cards' | 'ME Cards' | 'AS Cards' | 'EU Payments';
  started: string;
  status: 'Monitoring' | 'Investigating' | 'Resolved' | 'Pending Review';
  owner: {
    name: string;
    avatar?: string;
  };
  details?: {
    volume: string;
    affectedUsers: number;
    description: string;
    suggestedAction: string;
  };
}

export interface RiskContributor {
  label: string;
  percentage: number;
  delta?: string;
  category: string;
}

export interface RiskTimelinePoint {
  time: string;
  suspicious: number;
  blocked: number;
  manualReviews: number;
}

// Backward compatibility types
export type ViewMode =
  | 'overview'
  | 'id-proofs'
  | 'ai-copilot'
  | 'transactions'
  | 'accounts'
  | 'risk-signals'
  | 'investigations'
  | 'regulatory-intelligence'
  | 'findings'
  | 'reports'
  | 'audit-trail'
  | 'gateway';

export interface Transaction {
  id: string;
  timestamp: string;
  channel: string;
  originAccount: string;
  beneficiary: string;
  beneficiaryBank: string;
  beneficiaryAccount: string;
  jurisdiction: string;
  amount: number;
  currency: string;
  ruleTriggered?: string;
  riskScore: number;
  evidenceChecksum: string;
  status: 'Flagged' | 'Cleared' | 'Under Review' | 'Hold';
  dwellMinutes?: number;
}

export interface RiskSignal {
  id: string;
  accountId: string;
  accountName: string;
  triggeredRule: string;
  ruleDescription: string;
  volume: number;
  evidenceCount: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  score: number;
  timestamp: string;
}

export interface AccountEntity {
  id: string;
  name: string;
  lei: string;
  cin: string;
  type: string;
  classification: string;
  corridor: string;
  age: string;
  branch: string;
  leadOfficer: string;
  riskScore: number;
  status: string;
  total90dVolume: string;
  flaggedVolume: string;
  dwellTime: string;
  baselineDwell: string;
  activeRules: string[];
}

export interface RegulatoryFinding {
  id: string;
  title: string;
  targetAccount: string;
  targetEntity: string;
  severity: 'CRITICAL (Tier 1)' | 'HIGH' | 'MEDIUM' | 'INFORMATIONAL';
  primaryStatute: string;
  status: string;
  summary: string;
  dateCreated: string;
  investigator: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  sha256: string;
  status: string;
}
