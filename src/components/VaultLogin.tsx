import React, { useState } from 'react';

interface VaultLoginProps {
  onLoginSuccess: (email: string, institution: string) => void;
  onShowToast: (title: string, msg: string) => void;
  onCancel?: () => void;
}

export const VaultLogin: React.FC<VaultLoginProps> = ({ onLoginSuccess, onShowToast, onCancel }) => {
  const institution = 'RiskGuard Demo Bank';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [fullName, setFullName] = useState('');
  const [operatorId, setOperatorId] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const registered = JSON.parse(localStorage.getItem('riskguard-users') || '[]') as Array<{name:string; id:string; email:string; phone:string; password:string}>;
    if (isRegistering) {
      if (password !== confirmPassword) { onShowToast('Password mismatch', 'Please make both passwords identical.'); return; }
      if (registered.some((u) => u.email === email || u.phone === phone || u.id === operatorId)) { onShowToast('Already registered', 'Use your existing email, phone number, or ID to sign in.'); return; }
      registered.push({ name: fullName, id: operatorId, email, phone, password });
      localStorage.setItem('riskguard-users', JSON.stringify(registered));
      setFullName('');
      setOperatorId('');
      setPhone('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsRegistering(false);
      onShowToast('Registration complete', 'Sign in with your registered email or phone and password.');
      return;
    }
    const user = registered.find((u) => (u.email === email || u.phone === email) && u.password === password);
    if (!user) { onShowToast('Sign-in failed', 'Use the email or phone and password from your registration.'); return; }
    setIsAuthenticating(true);
    onShowToast('mTLS Handshake Initiated', 'Validating digital certificate & biometric clearance token...');

    setTimeout(() => {
      setIsAuthenticating(false);
      onShowToast('Identity Verified', 'Welcome back to RiskGuard.');
      onLoginSuccess(user.email, institution);
    }, 1100);
  };

  return (
    <div className="min-h-screen bg-[#eef2f6] flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none">
      {/* Top Brand Bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 flex items-center justify-center text-orange-600">
            <svg className="w-8 h-8" viewBox="0 0 28 28" fill="none">
              <path
                d="M14 2.5L23.5 6.5V13.8C23.5 19.8 19.4 24.8 14 26.5C8.6 24.8 4.5 19.8 4.5 13.8V6.5L14 2.5Z"
                stroke="#EA580C"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 13.5L12.8 16.5L18.5 10.5"
                stroke="#EA580C"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight block leading-none">
              Dhoomketu
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              Bank Sentinel &amp; ID Proof Gateway
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
          <div className="hidden sm:flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>BANK_CORE: SECURED (mTLS 1.3)</span>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-md border border-slate-200 transition-colors cursor-pointer"
            >
              Skip to Desktop →
            </button>
          )}
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-4xl mx-auto w-full my-auto py-6">
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-5 bg-slate-50 p-8 flex flex-col justify-between border-r border-slate-100">
            <div><div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">D</div><h1 className="mt-5 text-2xl font-bold text-slate-900">Welcome to RiskGuard</h1><p className="mt-2 text-sm leading-relaxed text-slate-600">Sign in to review payment activity, fraud signals, customers, merchants, and bank settlements.</p></div>
            <p className="text-xs text-slate-500">Secure access for registered users</p>
          </div>

          {/* Right Column: Sign In Form */}
          <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {isRegistering ? 'Create your account' : 'Sign in'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {isRegistering ? 'Register to access the risk dashboard' : 'Use your registered email or phone number and password'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {isRegistering && <>
                <div><label className="block text-slate-700 font-semibold mb-1">Full name <span className="text-red-600">*</span></label><input required autoComplete="name" value={fullName} onChange={e=>setFullName(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:outline-none" placeholder="Enter your full name" /></div>
                <div><label className="block text-slate-700 font-semibold mb-1">ID number <span className="text-red-600">*</span></label><input required autoComplete="off" value={operatorId} onChange={e=>setOperatorId(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:outline-none" placeholder="Enter your ID number" /></div>
                <div><label className="block text-slate-700 font-semibold mb-1">Phone number <span className="text-red-600">*</span></label><input required type="tel" autoComplete="tel" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:outline-none" placeholder="Enter your phone number" /></div>
                </>}


                {/* Email / Operator ID */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Email ID or phone number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete={isRegistering ? 'email' : 'username'}
                    placeholder="Enter your email or phone number"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-semibold">Password <span className="text-red-600">*</span></label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-orange-600 hover:text-orange-700 font-semibold"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>

                {isRegistering && <div><div className="flex items-center justify-between mb-1"><label className="block text-slate-700 font-semibold">Confirm password <span className="text-red-600">*</span></label><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-orange-600 font-semibold">{showConfirmPassword ? 'Hide' : 'Show'}</button></div><input required type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:outline-none" placeholder="Re-enter your password" /></div>}


                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-500 active:scale-98 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-4"
                >
                  {isAuthenticating ? (
                    <>
                      <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
                      <span>Verifying Security Clearance...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">lock_open</span>
                      <span>{isRegistering ? 'Create account' : 'Sign in'}</span>
                    </>
                  )}
                </button>
              </form>
              <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="mt-4 text-sm font-semibold text-orange-700">{isRegistering ? 'Already registered? Sign in' : 'New here? Create an account'}</button>
            </div>


          </div>
        </div>
      </div>

      {/* Footer Ribbons */}
      <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-mono py-2">
        <div className="flex items-center gap-3">
          <span>ISO/IEC 27001 Certified</span>
          <span>•</span>
          <span>RBI KYC / PMLA Compliant</span>
          <span>•</span>
          <span>PCI-DSS 4.0 Standard</span>
        </div>
        <div>© 2026 Dhoomketu Financial Technologies Inc.</div>
      </div>
    </div>
  );
};
