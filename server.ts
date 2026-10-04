import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// README setup uses .env.local. Load it first, then fall back to .env.
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK per gemini-api skill instructions
let genAI: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  try {
    genAI = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI with key:', err);
  }
}

app.get('/api/ai/status', (_req, res) => {
  res.json({ ready: Boolean(genAI) });
});

// Built-in intelligent transaction fraud analysis engine
// Used either directly or as ground-truth context for Gemini prompt
interface TransactionAnalysisInput {
  id: string;
  customerName: string;
  amountUSD: number;
  merchantName: string;
  merchantMcc?: string;
  channel: string;
  region: string;
  timestamp?: string;
  riskScore: number;
  status: string;
  ruleTriggered?: string;
  location?: string;
  ipAddress?: string;
  accountNumber?: string;
  cardNumberMasked?: string;
  cardNetwork?: string;
}

function analyzeTransactionRisk(tx: TransactionAnalysisInput) {
  let score = tx.riskScore || 20;
  const factors: string[] = [];
  const rules: string[] = [];

  if (tx.amountUSD >= 10000) {
    score = Math.max(score, 88);
    factors.push(`High value transaction ($${tx.amountUSD.toLocaleString()}) exceeding standard single-auth limits`);
    rules.push('RULE-104: High Value Wire/Remittance Threshold');
  } else if (tx.amountUSD >= 5000) {
    score = Math.max(score, 72);
    factors.push(`Elevated velocity volume ($${tx.amountUSD.toLocaleString()})`);
    rules.push('RULE-101: Velocity Threshold Alert');
  }

  if (tx.ruleTriggered) {
    rules.push(tx.ruleTriggered);
    factors.push(`Active rule violation: ${tx.ruleTriggered}`);
    score = Math.max(score, 75);
  }

  if (tx.location && (tx.location.includes('UAE') || tx.location.includes('Dubai') || tx.location.includes('Offshore'))) {
    factors.push('Cross-border transit corridor routing with reduced KYC dwell time');
    score = Math.max(score, 68);
  }

  if (tx.status === 'Flagged' || tx.status === 'Blocked') {
    score = Math.max(score, 82);
  }

  let verdict: 'FRAUD_CONFIRMED' | 'SUSPICIOUS' | 'LEGITIMATE' = 'LEGITIMATE';
  if (score >= 75) {
    verdict = 'FRAUD_CONFIRMED';
  } else if (score >= 45) {
    verdict = 'SUSPICIOUS';
  }

  return {
    txId: tx.id,
    customerName: tx.customerName,
    verdict,
    fraudProbability: score,
    riskFactors: factors.length > 0 ? factors : ['Normal transaction frequency', 'Baseline device and IP match'],
    rulesTriggered: rules.length > 0 ? rules : ['Standard Basel & PCI Compliance checks passed'],
    recommendedAction:
      verdict === 'FRAUD_CONFIRMED'
        ? 'Place immediate payment hold, freeze outward corridor, and request enhanced KYC video verification.'
        : verdict === 'SUSPICIOUS'
        ? 'Route to Tier-2 investigator queue; trigger automated 3D-Secure 2.2 SMS/Biometric challenge.'
        : 'Approve transaction and allow settlement via regular clearing batch.',
  };
}

// POST /api/ai/scan-all-transactions
app.post('/api/ai/scan-all-transactions', async (req, res) => {
  try {
    const transactions: TransactionAnalysisInput[] = req.body.transactions || [];
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({ error: 'No transactions provided to scan.' });
    }

    const analyses = transactions.map((tx) => analyzeTransactionRisk(tx));

    const totalScanned = analyses.length;
    const fraudCount = analyses.filter((a) => a.verdict === 'FRAUD_CONFIRMED').length;
    const suspiciousCount = analyses.filter((a) => a.verdict === 'SUSPICIOUS').length;
    const legitimateCount = analyses.filter((a) => a.verdict === 'LEGITIMATE').length;

    // If Gemini is available, generate an executive summary synthesis
    let aiSummary = `Audit completed: Scanned ${totalScanned} transactions. Identified ${fraudCount} critical fraud instances and ${suspiciousCount} suspicious anomalies. ${legitimateCount} transactions cleared standard baseline rules.`;

    if (genAI) {
      try {
        const prompt = `You are Dhoomketu Sentinel AI, an expert banking fraud risk investigator.
You just scanned ${totalScanned} banking transactions.
Summary statistics:
- Fraud Confirmed: ${fraudCount}
- Suspicious / Elevated Risk: ${suspiciousCount}
- Legitimate / Safe: ${legitimateCount}

Flagged Transactions:
${analyses
  .filter((a) => a.verdict !== 'LEGITIMATE')
  .map(
    (a) =>
      `- [${a.verdict}] ${a.txId} (${a.customerName}): Probability ${a.fraudProbability}%. Factors: ${a.riskFactors.join(
        '; '
      )}`
  )
  .join('\n')}

Provide a concise, professional executive summary (2-3 paragraphs) in natural English (with optional key bullet points) explaining:
1. The dominant fraud patterns detected (e.g., velocity spikes, shell company routing, structuring).
2. Recommended immediate operator enforcement actions.
3. Keep it authoritative, clear, and actionable.`;

        const response = await genAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        if (response.text) {
          aiSummary = response.text.trim();
        }
      } catch (geminiErr) {
        console.warn('Gemini executive summary error (using rule engine):', geminiErr);
      }
    }

    return res.json({
      success: true,
      totalScanned,
      fraudCount,
      suspiciousCount,
      legitimateCount,
      summary: aiSummary,
      results: analyses,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/scan-all-transactions:', error);
    return res.status(500).json({ error: error?.message || 'Internal server error' });
  }
});

// POST /api/ai/chat
// Handles multi-turn chat with conversation history, role-based system instructions,
// fraud analysis, and customer support queries
app.post('/api/ai/chat', async (req, res) => {
  try {
    const {
      message,
      history,
      role = 'fraud_analyst',
      model = 'gemini-3.8-flash',
      transactions,
      customers,
      merchants,
      banks,
      selectedTxId,
      mode,
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const txList: TransactionAnalysisInput[] = Array.isArray(transactions) ? transactions : [];

    // Check if the query asks about a specific transaction
    let targetTx: TransactionAnalysisInput | undefined;
    if (mode === 'fraud_check' && selectedTxId) {
      targetTx = txList.find((t) => t.id.toLowerCase() === selectedTxId.toLowerCase());
    }
    if (!targetTx) {
      const match = message.match(/TX-\d+/i);
      if (match) {
        const foundId = match[0].toUpperCase();
        targetTx = txList.find((t) => t.id.toUpperCase() === foundId);
      }
    }

    let txAnalysisResult = null;
    if (targetTx) {
      txAnalysisResult = analyzeTransactionRisk(targetTx);
    }

    // Role-tailored system instructions
    let roleDescription = 'You are a general conversational assistant with expertise in bank fraud, payments, and risk. Answer general questions as well as banking questions.';
    if (role === 'customer_support' || mode === 'customer_support') {
      roleDescription = 'You are Dhoomketu Customer Concierge. You provide clear, empathetic, respectful banking assistance to customers in English and Hindi/Hinglish. You help them understand pending charges, resolve card blocks, and submit KYC proof safely.';
    } else if (role === 'compliance_officer') {
      roleDescription = 'You are Dhoomketu Head of Regulatory Compliance. You advise on statutory compliance (AML-04, PMLA 2002, Visa VROL, Mastercard MATCH, PCI-DSS 4.0), CTR/STR thresholds, and legal audit readiness.';
    }

    const systemInstruction = `You are Dhoomketu Sentinel AI, a helpful conversational assistant that can answer general questions and banking questions.
Active Persona & Role: ${roleDescription}

Your capabilities:
1. TRANSACTION AUDITING & FRAUD ANALYSIS: You analyze transactions, determine whether they are fraudulent or legitimate, compute fraud probability scores, explain the risk factors (velocity, structuring, shell entity, corridor mismatch, MCC anomaly), and give actionable regulatory recommendations.
2. CUSTOMER SUPPORT & INQUIRY RESOLUTION: You answer questions from bank customers (or operators handling customers) with polite, clear, empathetic, and authoritative guidance. You explain why transactions are delayed or flagged, how to submit KYC ID proof, how to unblock accounts, how to contest unauthorized charges, and how to stay safe from banking scams.
3. MULTILINGUAL SUPPORT: You fluently understand and reply in English, Hindi, and Hinglish (e.g., "Aapka transaction safe hai", "Fraud protection ke liye humne hold lagaya hai"). If the user asks in Hindi or Hinglish, reply warmly in Hinglish/Hindi with clear instructions.
4. CONVERSATION CONTINUITY: Use prior turns only to resolve references such as "that transaction". Answer the user's latest question directly; do not repeat a previous answer or add a fixed introduction, menu, or unrelated facts.
5. CONCISE, QUESTION-LED ANSWERS: Start with the exact answer. Give only the detail requested; expand only when asked. Match the user's language (English, Hindi, or Hinglish). Answer ordinary general-knowledge questions naturally instead of forcing them into a banking topic.
6. ACCURACY & PRIVACY: Treat all dashboard records below as demo data. Do not invent balances, fees, timelines, bank policies, reversals, or actions. If information is missing, say so and ask one focused follow-up. Never expose full account or card numbers; use only masked/demo identifiers. For real payment disputes, give safe next steps without claiming a refund is guaranteed.

Current Banking System Context:
- Active Transactions in memory: ${JSON.stringify(txList.slice(0, 10))}
- Bank transfer summaries (INR demo totals): ${JSON.stringify(Array.isArray(banks) ? banks : [])}
- Customer risk records (demo data; use a named record only when that customer is specifically asked about): ${JSON.stringify(Array.isArray(customers) ? customers : [])}
- Merchant records (demo data; use only when the user asks about a specific merchant or merchant totals): ${JSON.stringify(Array.isArray(merchants) ? merchants : [])}
- Target Transaction under review (if any): ${JSON.stringify(targetTx || null)}
- Pre-computed rule analysis for target: ${JSON.stringify(txAnalysisResult || null)}

Response Format:
- Use clean Markdown format with bold highlights and bullet points.
- If asked whether a transaction is fraud: give Verdict (FRAUD / SUSPICIOUS / LEGITIMATE), Probability Score (%), Risk Factors, and Recommended Action.`;

    let replyText = '';
    let classification = txAnalysisResult;

    if (genAI) {
      try {
        // Build multi-turn dialog contents
        const pastTurns = Array.isArray(history)
          ? history
              .filter((h: any) => h && h.text && typeof h.text === 'string')
              .slice(-10)
              .map((h: any) => ({
                role: h.role === 'assistant' || h.role === 'model' ? ('model' as const) : ('user' as const),
                parts: [{ text: h.text }],
              }))
          : [];

        const contents = [
          ...pastTurns,
          {
            role: 'user' as const,
            parts: [{ text: message }],
          },
        ];

        const targetModel =
          model === 'gemini-3.5-flash-lite'
            ? 'gemini-3.5-flash-lite'
            : model === 'gemini-3.1-pro-preview'
            ? 'gemini-3.1-pro-preview'
            : 'gemini-3.8-flash';

        const response = await genAI.models.generateContent({
          model: targetModel,
          contents,
          config: {
            systemInstruction,
          },
        });

        if (response.text) {
          replyText = response.text.trim();
        }
      } catch (geminiErr) {
        console.warn('Gemini generateContent error, activating rule-based response:', geminiErr);
      }
    }

    // Fallback if Gemini did not reply or is not configured
    if (!replyText) {
      const bankRows = Array.isArray(banks) ? banks : [];
      const customerRows = Array.isArray(customers) ? customers : [];
      const normalizedMessage = message.toLocaleLowerCase();
      const formatINR = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
      const askedForFraudVerdict = /fraud|suspicious|legitimate|safe|risk score|risk factors|analy[sz]/i.test(message);

      if (txAnalysisResult && targetTx && askedForFraudVerdict) {
        const isFraud = txAnalysisResult.verdict === 'FRAUD_CONFIRMED';
        const isSuspicious = txAnalysisResult.verdict === 'SUSPICIOUS';
        const verdictTitle = isFraud ? 'High fraud risk' : isSuspicious ? 'Suspicious; review needed' : 'No major risk detected';
        replyText = `**${targetTx.id}: ${verdictTitle} (${txAnalysisResult.fraudProbability}% risk).**\n` +
          (txAnalysisResult.riskFactors.length ? `Risk factors: ${txAnalysisResult.riskFactors.join('; ')}. ` : '') +
          `Recommended action: ${txAnalysisResult.recommendedAction}`;
      } else if (targetTx) {
        if (/amount|kitna|how much|value/i.test(message)) replyText = `${targetTx.id} is for $${targetTx.amountUSD.toLocaleString()} USD.`;
        else if (/merchant|shop|payee/i.test(message)) replyText = `${targetTx.id} was paid to ${targetTx.merchantName}.`;
        else if (/customer|cardholder|kisne|who/i.test(message)) replyText = `${targetTx.id} is associated with ${targetTx.customerName}.`;
        else if (/status|pending|fail|hold|clear/i.test(message)) replyText = `${targetTx.id} is currently marked **${targetTx.status}** in the demo ledger.`;
        else if (/where|location|place/i.test(message)) replyText = `${targetTx.id} is associated with ${targetTx.location || 'no location recorded'}.`;
        else if (/when|time|date/i.test(message)) replyText = `${targetTx.id} is recorded as ${targetTx.timestamp || 'a recent transaction'} in the demo ledger.`;
        else replyText = `${targetTx.id}: $${targetTx.amountUSD.toLocaleString()} USD at ${targetTx.merchantName}; status ${targetTx.status}.`;
      } else if (/how many|count|total number|kitne|kitni/i.test(message) && /customer|account|grahak/i.test(message)) {
        replyText = `There are ${customerRows.length} customer records in this demo dataset.`;
      } else if (/how many|count|total number|kitne|kitni/i.test(message) && /merchant|duk[aā]n/i.test(message)) {
        replyText = `There are ${Array.isArray(merchants) ? merchants.length : 0} merchant records in this demo dataset.`;
      } else if (bankRows.length && (/bank|received|sent|processing|failed|transfer|payment|paisa|paise|rupay/i.test(message) || bankRows.some((bank: any) => normalizedMessage.includes(String(bank.name).toLocaleLowerCase())))) {
        const selectedBank = bankRows.find((bank: any) => normalizedMessage.includes(String(bank.name).toLocaleLowerCase()));
        if (/which banks|list banks|all banks|bank names|banks are/i.test(message)) {
          replyText = `Banks in this demo: ${bankRows.map((bank: any) => bank.name).join(', ')}.`;
        } else if (selectedBank) {
          const field = /process|pending|chal raha/i.test(message) ? 'processing' : /fail|declin|asafal/i.test(message) ? 'failed' : /sent|outgoing|paid|gaya|bhej/i.test(message) ? 'sent' : 'received';
          replyText = `${selectedBank.name}: ${formatINR(selectedBank[field] || 0)} ${field} (demo total).`;
        } else {
          const received = bankRows.reduce((sum: number, bank: any) => sum + (bank.received || 0), 0);
          const sent = bankRows.reduce((sum: number, bank: any) => sum + (bank.sent || 0), 0);
          const processing = bankRows.reduce((sum: number, bank: any) => sum + (bank.processing || 0), 0);
          const failed = bankRows.reduce((sum: number, bank: any) => sum + (bank.failed || 0), 0);
          replyText = `Across ${bankRows.length} demo banks: received ${formatINR(received)}, sent ${formatINR(sent)}, processing ${formatINR(processing)}, and failed ${formatINR(failed)}.`;
        }
      } else if (Array.isArray(merchants) && merchants.some((merchant: any) => merchant.name && normalizedMessage.includes(String(merchant.name).toLocaleLowerCase()))) {
        const merchant = merchants.find((row: any) => row.name && normalizedMessage.includes(String(row.name).toLocaleLowerCase()));
        if (/chargeback|dispute/i.test(message)) replyText = `${merchant.name} has a ${merchant.chargebackRate}% chargeback rate in the demo data.`;
        else if (/volume|sales|amount/i.test(message)) replyText = `${merchant.name} has a recorded monthly volume of $${Number(merchant.volumeUSD).toLocaleString()} USD in the demo data.`;
        else if (/status|hold|settlement|payout/i.test(message)) replyText = `${merchant.name} settlement is ${merchant.settlementStatus}; portfolio status: ${merchant.status}.`;
        else replyText = `${merchant.name} is in ${merchant.category} (MCC ${merchant.mcc}); risk rating ${merchant.riskRating}.`;
      } else {
        const customer = customerRows.find((row: any) =>
          (row.name && normalizedMessage.includes(String(row.name).toLocaleLowerCase())) ||
          (row.id && normalizedMessage.includes(String(row.id).toLocaleLowerCase()))
        );
        if (customer) {
          if (/risk|score|tier/i.test(message)) replyText = `${customer.name} is marked **${customer.status}**, risk score ${customer.riskScore}/100 in this demo dataset.`;
          else if (/country|where|location/i.test(message)) replyText = `${customer.name} is listed in ${customer.country}.`;
          else if (/volume|transaction|amount/i.test(message)) replyText = `${customer.name} has a demo recorded volume of $${Number(customer.totalVolumeUSD).toLocaleString()} USD.`;
          else replyText = `${customer.name} is listed as ${customer.status} risk in the demo customer data. What detail about this customer do you need?`;
        } else if (/hello|hi\b|namaste|hey/i.test(message)) {
          replyText = 'Namaste! What would you like to know?';
        } else if (/thank/i.test(message)) {
          replyText = 'You’re welcome.';
        } else if (/card.*block|block.*card|card.*declin/i.test(message)) {
          replyText = 'If your card was blocked or declined, check the bank app for the decline reason and contact the number on your card. Never share your PIN, password, or OTP in chat.';
        } else if (/unauthori[sz]ed|unknown transaction|not mine|fraud charge/i.test(message)) {
          replyText = 'Report an unrecognized transaction to your bank using the official app or the number on your card, and ask them to secure the card. Do not share your PIN, password, or OTP here.';
        } else if (/refund|reverse/i.test(message)) {
          replyText = 'I can’t see a refund status or promise a reversal time from this demo. Check the transaction in your bank app and contact the merchant or bank with its reference number.';
        } else if (/fee|charge|interest|rate/i.test(message)) {
          replyText = 'This demo does not include your bank’s fee schedule. Check the bank’s official tariff or share the exact fee name and bank so I can help explain it.';
        } else {
          replyText = 'I can answer that when the Gemini service is connected. For now, ask about a demo bank total, customer record, or transaction ID.';
        }
      }
    }

    return res.json({
      success: true,
      reply: replyText,
      classification,
      role,
      model,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    return res.status(500).json({ error: error?.message || 'Internal server error' });
  }
});

// POST /api/ai/tts - Generates natural voice audio using gemini-3.8-flash-lite-tts
app.post('/api/ai/tts', async (req, res) => {
  try {
    const { text, voice = 'Kore' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    if (genAI) {
      try {
        const cleanText = text.replace(/[*#_`>]/g, '').slice(0, 450);
        const response = await genAI.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: cleanText,
                  speechMetadata: {
                    style: 'Clear, reassuring professional banking voice',
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice as any },
              },
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          return res.json({ audioBase64: base64Audio, mimeType: 'audio/wav' });
        }
      } catch (ttsErr) {
        console.warn('Gemini TTS error (falling back to client Web Speech):', ttsErr);
      }
    }

    return res.json({ useWebSpeech: true });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'TTS Error' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        port: PORT,
        host: '0.0.0.0',
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dhoomketu Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
