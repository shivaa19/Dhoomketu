export interface BankTransferSummary {
  name: string;
  received: number;
  sent: number;
  processing: number;
  failed: number;
}

// Demo payment totals in INR, shared by the bank dashboard and AI context.
export const BANK_TRANSFER_SUMMARIES: BankTransferSummary[] = [
  { name: 'HDFC Bank', received: 12840000, sent: 9640000, processing: 1820000, failed: 1380000 },
  { name: 'ICICI Bank', received: 10920000, sent: 8210000, processing: 1740000, failed: 970000 },
  { name: 'State Bank of India', received: 9240000, sent: 6840000, processing: 1540000, failed: 860000 },
  { name: 'Axis Bank', received: 7810000, sent: 5820000, processing: 1210000, failed: 780000 },
  { name: 'Kotak Mahindra Bank', received: 6380000, sent: 4810000, processing: 980000, failed: 590000 },
  { name: 'DBS Bank', received: 5240000, sent: 3960000, processing: 820000, failed: 460000 },
  { name: 'Barclays', received: 4620000, sent: 3310000, processing: 790000, failed: 520000 },
  { name: 'Commonwealth Bank', received: 3980000, sent: 2940000, processing: 650000, failed: 390000 },
];
