import React, { useState } from 'react';
import { OperatorProfile } from '../types';

interface UserProfileViewProps {
  operator: OperatorProfile;
  onShowToast: (title: string, msg: string) => void;
  onNavigateToOverview: () => void;
  onSignOut: () => void;
}

export function UserProfileView({ operator, onShowToast, onNavigateToOverview, onSignOut }: UserProfileViewProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(operator.name);
  const [email, setEmail] = useState(operator.email);
  const [phone, setPhone] = useState('+91 98765 43210');
  const save = () => { setEditing(false); onShowToast('Profile updated', 'Your profile details have been saved.'); };
  const fields: Array<[string, string, ((value: string) => void)?]> = [["Full name", name, setName], ["Email ID", email, setEmail], ["Phone number", phone, setPhone], ["Bank", operator.bankName], ["ID number", operator.badgeNumber], ["Access level", operator.clearanceLevel]];
  return <div className="min-h-full bg-slate-50 p-6 md:p-8"><div className="max-w-4xl mx-auto space-y-6">
    <div className="flex items-center justify-between"><div><button onClick={onNavigateToOverview} className="text-sm text-slate-500 mb-2">← Back to overview</button><h1 className="text-2xl font-bold text-slate-900">My profile</h1><p className="text-sm text-slate-500 mt-1">Personal and account details</p></div><button onClick={() => editing ? save() : setEditing(true)} className="px-4 py-2 rounded-lg bg-orange-600 text-white text-sm font-semibold">{editing ? 'Save changes' : 'Edit profile'}</button></div>
    <section className="bg-white border border-slate-200 rounded-2xl p-6"><div className="flex items-center gap-4 pb-5 border-b"><div className="w-14 h-14 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xl font-bold">{name.charAt(0)}</div><div><h2 className="font-bold text-slate-900">{name}</h2><p className="text-sm text-slate-500">{operator.role} · {operator.department}</p></div></div>
      <div className="grid sm:grid-cols-2 gap-5 pt-5">{fields.map(([label,value,setter])=><label key={label} className="block text-xs font-semibold text-slate-500">{label}<input disabled={!editing || !setter} value={value} onChange={setter ? (e)=>setter(e.target.value) : undefined} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 disabled:opacity-90" /></label>)}</div>
    </section><button onClick={onSignOut} className="px-4 py-2.5 rounded-lg border border-red-200 text-red-700 bg-white text-sm font-semibold">Sign out</button>
  </div></div>;
}
