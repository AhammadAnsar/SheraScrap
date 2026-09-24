import React, { useState, useEffect } from 'react';
import { useCMS } from '../cms/CMSContext';
import { SEO } from '../components/SEO';
import { Shield, Lock, User, KeyRound, AlertTriangle, RotateCw, CheckCircle2, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const AdminLayout = React.lazy(() => import('../components/admin/AdminLayout'));

export default function AdminPage() {
  const { currentUser, login } = useCMS();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  const generateCaptcha = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptchaCode(code);
    setCaptchaInput('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter your username/email and password.');
      return;
    }

    if (captchaInput.trim() !== captchaCode) {
      setErrorMsg('Invalid security verification code. Please enter the numbers shown.');
      generateCaptcha();
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const ok = await login(username.trim(), password);
      if (!ok) {
        setErrorMsg('Invalid credentials or insufficient administrator privileges.');
        generateCaptcha();
      }
    } catch {
      setErrorMsg('Authentication service error. Please try again later.');
      generateCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentUser) {
    return (
      <div className="h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden" dir="ltr">
        <SEO 
          title="Admin CMS Dashboard | Shera Scrap" 
          description="Content Management and Administration Dashboard for Shera Scrap" 
          canonicalPath="/admin/"
          noindex={true}
        />
        <React.Suspense fallback={
          <div className="h-full flex items-center justify-center bg-slate-950 text-slate-400 font-bold gap-3" dir="ltr">
            <RotateCw className="w-5 h-5 animate-spin text-emerald-400" />
            <span>Loading Shera Scrap CMS Engine...</span>
          </div>
        }>
          <AdminLayout lang="en" setLang={() => {}} />
        </React.Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans" dir="ltr">
      <SEO 
        title="Admin Login | Shera Scrap CMS Portal" 
        description="Secure Administration Login for Shera Scrap Management" 
        canonicalPath="/admin/"
        noindex={true}
      />
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/5">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white mb-1.5 tracking-tight">Shera Scrap CMS</h1>
          <p className="text-xs text-slate-400 font-medium">Secure Commercial Administration Portal</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username or email"
                autoComplete="username"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 font-medium transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 font-medium transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Security Verification Code
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="4-digit PIN"
                maxLength={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white text-center tracking-widest font-mono font-bold focus:outline-none focus:border-emerald-500 placeholder:text-slate-600 placeholder:font-sans placeholder:tracking-normal"
                required
              />
              <div className="bg-slate-800/80 border border-slate-700 px-4 py-2.5 rounded-xl select-none font-mono font-black text-emerald-400 text-lg tracking-widest flex items-center gap-2 shrink-0">
                <span>{captchaCode}</span>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Refresh security code"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || lockoutTimer > 0}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer disabled:opacity-50 shadow-lg shadow-emerald-500/20 active:scale-[0.99]"
          >
            {isSubmitting ? (
              <RotateCw className="w-4 h-4 animate-spin" />
            ) : (
              <KeyRound className="w-4 h-4" />
            )}
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Admin Portal'}</span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <a 
            href="/en/" 
            className="text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Website</span>
          </a>
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>SSL 256-Bit Encrypted</span>
          </span>
        </div>
      </div>
    </div>
  );
}
