import React from 'react';
import { BANK_TRANSFER_SUMMARIES as banks } from '../data/bankData';
const money = (n: number) => `₹${(n / 100000).toFixed(1)}L`;
export const BanksView: React.FC<{ onNavigateToOverview: () => void }> = ({ onNavigateToOverview }) => (
  <div className="p-8 space-y-6 max-w-7xl mx-auto">
    <div className="flex justify-between items-center"><div><h1 className="text-2xl font-extrabold text-slate-900">Bank Transfers</h1><p className="text-xs text-slate-500 mt-1">Inbound, outbound, processing, and failed payment totals by bank</p></div><button onClick={onNavigateToOverview} className="px-4 py-2 bg-white border rounded-lg text-sm">← Overview</button></div>
    <div className="grid md:grid-cols-4 gap-4">{[['Received', '₹6.1 Cr'], ['Sent', '₹4.6 Cr'], ['Processing', '₹95.5 L'], ['Failed', '₹59.5 L']].map(([k,v]) => <div className="bg-white border rounded-2xl p-5" key={k}><div className="text-xs text-slate-500">Total {k}</div><div className="mt-2 text-2xl font-bold text-slate-900">{v}</div></div>)}</div>
    <div className="bg-white border rounded-2xl overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-100 text-slate-600"><tr>{['Bank','Money received','Money sent','Processing','Failed','Updated'].map(x=><th className="p-4" key={x}>{x}</th>)}</tr></thead><tbody className="divide-y">{banks.map((b,i)=><tr key={b.name}><td className="p-4 font-semibold">{b.name}</td><td className="p-4 text-emerald-700">{money(b.received)}</td><td className="p-4">{money(b.sent)}</td><td className="p-4 text-amber-700">{money(b.processing)}</td><td className="p-4 text-red-700">{money(b.failed)}</td><td className="p-4 text-slate-500">Oct 04, 2026 · {`${10+i}:18 IST`}</td></tr>)}</tbody></table></div>
  </div>
);
