Dhoomketu — Risk, Fraud & Regulatory Intelligence Copilot
From risk signals to audit-ready intelligence.

Dhoomketu is a full-stack banking risk and fraud intelligence dashboard built with React, TypeScript, Vite, Express, and Google Gemini. It brings transaction monitoring, fraud analysis, risk investigation, KYC/ID-proof verification, compliance governance, regulatory intelligence, alerts, reports, and an AI copilot into one operator-focused workspace.
The application combines a rule-based transaction risk engine with optional Gemini AI analysis, so core fraud analysis can still return useful results when the Gemini API is unavailable.
🚀 Live Demo
Live Website: https://dhoomketu-nc32.vercel.app/
Open Dhoomketu Live Demo
✨ Highlights
- 🤖 Gemini-powered AI Fraud Copilot
- 🔎 Transaction-level fraud and risk analysis
- 📊 Risk signals and monitoring dashboard
- 🚨 Alerts and incident management
- 🕵️ Investigation workspace
- 👤 Customer and merchant risk intelligence
- 🏦 Bank transfer monitoring
- 🪪 Bank ID Proof & KYC verification vault
- 📋 Compliance mandates and automated audit workflow
- 📑 Regulatory findings and intelligence workspace
- 🧩 Rules & Models management
- 🧾 Audit trail / cryptographic audit ledger UI
- 📈 Reports and analytics
- 🔊 AI text-to-speech support with browser fallback
- 🌐 English, Hindi, and Hinglish AI interaction
- 🔐 Masked/demo identifiers and privacy-aware AI instructions
- ⚡ Responsive modern banking operations UI
🎯 What Problem Does It Solve?
Financial institutions need to detect suspicious activity quickly, understand why a transaction is risky, investigate incidents, maintain KYC evidence, and prepare compliance-ready information.
Dhoomketu provides a single interface for these workflows instead of requiring operators to switch between separate monitoring, investigation, compliance, and reporting tools.
Typical workflow
Transaction / Risk Signal
          ↓
   Risk & Fraud Analysis
          ↓
  ┌───────┴────────┐
  ↓                ↓
Legitimate     Suspicious/Fraud
  ↓                ↓
Approve       Alert / Investigation
                   ↓
            Compliance / KYC
                   ↓
          Findings & Reports
                   ↓
              Audit Trail
🧠 AI Fraud Analysis
The server contains a built-in transaction analysis engine that evaluates signals such as:
- Transaction amount
- Velocity thresholds
- Triggered rules
- Cross-border / corridor indicators
- Transaction status
- Existing risk score
- Merchant and customer context
The engine classifies transactions into:
Verdict	Risk Score	Interpretation
LEGITIMATE	< 45	No major risk detected by the demo rules
SUSPICIOUS	45–74	Elevated risk requiring review
FRAUD_CONFIRMED	≥ 75	High-risk transaction requiring immediate action


Example risk factors
- High-value transaction thresholds
- Velocity anomalies
- Active rule violations
- Cross-border corridor indicators
- Flagged or blocked transaction status
- Baseline device/IP context in the demo engine
The system also generates a recommended action for each classification, such as payment hold, investigator review, additional authentication, or normal settlement.
Note: These rules are implemented as a demonstration risk engine and should not be treated as a production banking fraud model or regulatory decision system.

🤖 AI Fraud Copilot
Dhoomketu includes a conversational AI layer backed by the Google Gemini API.
Copilot capabilities
- Ask questions about transactions
- Analyze a specific transaction ID
- Explain risk factors and fraud probability
- Query demo customer records
- Query demo merchant information
- Query demo bank transfer totals
- Provide banking safety guidance
- Support English, Hindi, and Hinglish conversations
- Maintain recent conversation context
- Adapt responses for different operator personas
Supported personas
- Fraud Analyst
- Customer Support
- Compliance Officer
The backend also provides a rule-based fallback when Gemini is unavailable or not configured.
🔊 AI Voice / Text-to-Speech
The backend exposes a TTS endpoint that can use Gemini audio generation for a professional banking-style voice response.
If Gemini TTS is unavailable, the application can fall back to browser-based Web Speech functionality.
🪪 KYC & Bank ID Proof Vault
The Bank ID Proof workspace provides a dedicated UI for reviewing customer identity documents.
Supported demo document types include:
- Passport
- National ID
- Driving License
- Certificate of Incorporation
- Tax ID / PAN
- Proof of Address
The vault tracks fields such as:
- Customer name
- Bank
- Masked account/document number
- Issuing authority
- Issuing country
- Issue and expiry dates
- Verification status
- Match score
- Extracted identity information
- Checksum
- Verification operator
Possible document states include Verified, Pending Review, Flagged / Mismatch, and Expired.
🏦 Banking Operations Dashboard
Overview
Provides an operator-facing summary of the banking risk environment, including risk health, timelines, trends, and top alerts.
Transactions
Provides transaction-level monitoring and access to AI-assisted fraud analysis.
Banks
Displays demo inbound, outbound, processing, and failed transfer totals by bank.
Customers
Provides customer-level risk information from the demo dataset.
Merchants
Provides merchant category, MCC, volume, chargeback, settlement, and risk information from the demo dataset.
🚨 Alerts & Incidents
The alerting workspace supports operational review of incidents with information such as:
- Alert/incident ID
- Severity
- Segment
- Start time
- Status
- Assigned owner
- Affected users
- Incident volume
- Recommended action
Incident states include monitoring, investigation, resolution, and pending review.
🕵️ Investigations
The investigation workspace is designed to help operators move from a detected signal to an actionable case.
It connects the broader dashboard concepts of:
Risk Signal → Transaction → Alert → Investigation → Finding → Compliance → Report
📋 Compliance & Governance
The compliance workspace provides a UI for monitoring statutory and payment-network governance requirements.
The demo includes references to frameworks and requirements such as:
- RBI KYC
- PMLA
- PCI-DSS 4.0
- Visa VROL
- Mastercard MATCH
- CTR / STR-related workflows
The application includes an Automated Audit interaction that recalculates the displayed compliance status in the demo environment.
Regulatory names and thresholds shown by the demo must be independently validated against current laws, regulations, network rules, and institutional policies before production use.

🧾 Regulatory Intelligence & Findings
The project includes dedicated interfaces for:
- Regulatory intelligence
- Regulatory findings
- Statutory references
- Severity classification
- Target account/entity information
- Investigator ownership
- Finding status
- Audit-oriented reporting
This makes the dashboard useful as a prototype for a broader regulatory intelligence and compliance operations platform.
🔐 Audit Trail
The application includes a Cryptographic Audit Ledger interface with audit records containing fields such as:
- Event ID
- Timestamp
- Actor
- Action
- Target
- SHA-256 evidence checksum
- Status
The current project is a frontend/demo implementation; a production-grade immutable audit ledger would require a persistent backend, access controls, key management, and tamper-evident storage.
📊 Reports & Analytics
Dhoomketu includes reporting and analytics interfaces for turning operational data into reviewable outputs.
The dashboard uses Recharts for data visualization and includes trend/risk analytics components.
🧩 Rules & Models
The Rules & Models workspace is designed around configurable fraud/risk detection logic and model-oriented governance.
The current demo also contains server-side deterministic rules used by the transaction analysis engine, making the fraud workflow understandable and testable without requiring an AI response for every classification.
🛠️ Tech Stack
Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Recharts
- Lucide React
- Motion
Backend
- Node.js
- Express 4
- TypeScript / TSX
- dotenv
AI
- Google Gemini API via @google/genai
- Gemini conversational generation
- Gemini executive fraud-summary generation
- Gemini text-to-speech
- Rule-based fallback analysis when Gemini is unavailable
🏗️ Project Architecture
Dhoomketu
│
├── React + TypeScript Frontend
│   ├── Dashboard / Overview
│   ├── Transactions
│   ├── Fraud Detection
│   ├── Risk Signals
│   ├── Investigations
│   ├── Alerts
│   ├── Customers
│   ├── Merchants
│   ├── Banks
│   ├── KYC / ID Proof Vault
│   ├── Compliance
│   ├── Regulatory Intelligence
│   ├── Findings
│   ├── Reports
│   ├── Rules & Models
│   ├── Audit Trail
│   └── AI Copilot
│
├── Express Server
│   ├── /api/ai/status
│   ├── /api/ai/scan-all-transactions
│   ├── /api/ai/chat
│   └── /api/ai/tts
│
├── Fraud Risk Engine
│   ├── Risk scoring
│   ├── Rule evaluation
│   ├── Fraud classification
│   └── Recommended actions
│
└── Demo Data Layer
    ├── Transactions
    ├── Customers
    ├── Merchants
    ├── Banks
    ├── Alerts
    └── KYC / ID proofs
📁 Project Structure
.
├── src/
│   ├── components/
│   │   ├── AiChatBotDrawer.tsx
│   │   ├── BankIdProofModal.tsx
│   │   ├── IncidentDrawer.tsx
│   │   ├── RiskHealthCard.tsx
│   │   ├── RiskTimelineCard.tsx
│   │   ├── TopAlertsTable.tsx
│   │   ├── TrendAnalyticsPanel.tsx
│   │   └── ...
│   │
│   ├── data/
│   │   ├── bankData.ts
│   │   ├── mockData.ts
│   │   └── vaultData.ts
│   │
│   ├── views/
│   │   ├── OverviewView.tsx
│   │   ├── FraudDetectionView.tsx
│   │   ├── TransactionsView.tsx
│   │   ├── InvestigationsView.tsx
│   │   ├── AlertsView.tsx
│   │   ├── CustomersView.tsx
│   │   ├── MerchantsView.tsx
│   │   ├── ComplianceView.tsx
│   │   ├── RegulatoryIntelView.tsx
│   │   ├── ReportsView.tsx
│   │   ├── RulesModelsView.tsx
│   │   ├── AuditTrailView.tsx
│   │   ├── BankIdProofsView.tsx
│   │   ├── AiFraudCopilotView.tsx
│   │   └── ...
│   │
│   ├── App.tsx
│   ├── main.tsx
│   ├── types.ts
│   └── index.css
│
├── server.ts
├── index.html
├── vite.config.ts
├── package.json
├── .env.example
├── tsconfig.json
└── README.md
🚀 Getting Started
Prerequisites
Make sure you have:
- Node.js 18+ recommended
- npm
- A Google Gemini API key for AI functionality
Check your installation:
node --version
npm --version
📥 Installation
Clone the repository and install dependencies:
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <PROJECT_FOLDER>
npm install
🔑 Environment Variables
Create a .env.local file in the project root:
GEMINI_API_KEY=your_gemini_api_key
APP_URL=http://localhost:3000
Variables
Variable	Required	Purpose
GEMINI_API_KEY	Recommended	Enables Gemini chat, fraud summaries, and TTS
APP_URL	Optional	Application base URL used by the project environment
PORT	Optional	Server port; defaults to 3000


Never commit .env.local or real API keys to GitHub.

▶️ Run Locally
Start the development server:
npm run dev
Then open:
http://localhost:3000
The Express server hosts the Vite development middleware and exposes the AI API endpoints.
📦 Available Scripts
Command	Description
npm run dev	Starts the development server
npm run build	Creates the production Vite build
npm run preview	Previews the production build
npm run lint	Runs TypeScript type checking
npm run start	Starts the server directly
npm run clean	Removes generated build/server artifacts


🔌 API Endpoints
Check AI availability
GET /api/ai/status
Returns whether the Gemini client is configured.
Scan transactions
POST /api/ai/scan-all-transactions
Accepts a transaction array and returns:
- Total scanned
- Fraud count
- Suspicious count
- Legitimate count
- Executive summary
- Per-transaction analysis
AI chat
POST /api/ai/chat
Supports conversational fraud/risk assistance with transaction, customer, merchant, and bank context.
Text-to-speech
POST /api/ai/tts
Generates AI audio when Gemini TTS is available and otherwise signals the client to use browser speech.
🧪 Demo Data
This project currently contains demo/mock banking datasets for development and UI demonstration.
Examples include:
- Transactions
- Customers
- Merchants
- Bank transfer summaries
- Alerts/incidents
- KYC/ID proofs
- Compliance records
- Regulatory findings
- Audit records
Do not use the included demo data as real financial, customer, or regulatory information.
🔒 Security Notes
This project is a prototype / demonstration platform and is not production-ready for handling real banking data without additional security controls.
Before production deployment, consider implementing:
- Authentication and strong authorization
- RBAC/ABAC enforcement on the backend
- Secure session/token management
- Database-backed persistence
- Encryption at rest and in transit
- Secrets management / vault integration
- PII/tokenization controls
- Immutable audit storage
- Rate limiting and abuse protection
- Input validation and schema validation
- API logging and monitoring
- Model governance and evaluation
- Human approval for high-impact fraud decisions
- Regulatory/legal review
- Production KYC/AML integrations
⚠️ Disclaimer
Dhoomketu is an educational/prototype project demonstrating banking risk, fraud monitoring, AI assistance, KYC workflows, and compliance operations.
It is not a substitute for:
- A regulated banking fraud detection system
- Professional compliance advice
- Legal advice
- Production KYC/AML verification
- A certified regulatory reporting system
- Guaranteed fraud classification
All fraud scores, compliance indicators, transaction records, and regulatory information in the demo should be treated as illustrative unless connected to independently validated production systems and policies.
🔮 Future Improvements
Potential next steps for the platform include:
- PostgreSQL / MongoDB persistence
- Real-time transaction streaming
- Production-grade AML/KYC integrations
- OCR and document authenticity verification
- Device fingerprinting
- Graph-based fraud detection
- ML model training and evaluation pipelines
- Explainable AI dashboards
- Real regulatory data ingestion
- RAG-based regulatory document retrieval
- Role-based access control with backend enforcement
- SSO / enterprise identity integration
- Immutable event storage
- Automated SAR/STR workflow integrations
- Docker deployment
- Cloud deployment with managed secrets
- Automated security and integration testing
👨‍💻 Author
Shivam Singh
Computer Science & Engineering Student | Full Stack Development | AI | Cybersecurity
- GitHub: https://github.com/shivaa19
- LinkedIn: https://www.linkedin.com/in/shivaaa19
⭐ Why This Project Stands Out
Dhoomketu is designed as more than a simple CRUD dashboard. It demonstrates how a modern financial-risk platform can combine:
Frontend engineering + backend APIs + deterministic fraud rules + generative AI + risk analytics + KYC workflows + compliance operations + audit-oriented design
into a single end-to-end prototype.
<div align="center">

🛡️ Dhoomketu
Detect risk. Investigate faster. Stay audit-ready.
</div>
