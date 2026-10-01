import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  KeyRound, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  RotateCw, 
  X, 
  CheckCircle2, 
  LockKeyhole,
  AlertTriangle,
  Fingerprint
} from 'lucide-react';
import { useCMS } from '../../cms/CMSContext';

interface AdminLoginModalProps {
  lang: 'ar' | 'en';
}

export default function AdminLoginModal({ lang }: AdminLoginModalProps) {
  const { login, setIsAdminOpen } = useCMS();
  const isRtl = lang === 'ar';

  // Empty initial states - NO default credentials prefilled!
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const sendVerification = async () => {
    setIsSubmitting(true);
    try {
      const [{ signInWithEmailAndPassword, sendEmailVerification, signOut }, { auth }] = await Promise.all([import('firebase/auth'), import('../../lib/firebase')]);
      const credential = await signInWithEmailAndPassword(auth, username.trim(), password);
      try {
        if (!credential.user.emailVerified) await sendEmailVerification(credential.user);
        setVerificationSent(true);
        setErrorMsg(isRtl ? 'تحقق من بريدك الإلكتروني ثم سجّل الدخول مرة أخرى.' : 'Check your email, follow the verification link, then sign in again.');
      } finally { await signOut(auth); }
    } catch {
      setErrorMsg(isRtl ? 'تعذر إرسال رسالة التحقق. تحقق من البيانات وحاول لاحقاً.' : 'Could not send verification email. Check your credentials and try again later.');
    } finally { setIsSubmitting(false); }
  };

  // Generate dynamic 4-digit security code
  const generateCaptcha = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptchaCode(code);
    setCaptchaInput('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // Lockout countdown handler
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
    setErrorMsg('');

    if (lockoutTimer > 0) {
      return;
    }

    // Security captcha validation
    if (captchaInput.trim() !== captchaCode) {
      setErrorMsg(
        isRtl 
          ? 'رمز التحقق الأمني المكتوب غير صحيح. يرجى إعادة المحاولة' 
          : 'Security verification code is invalid. Please try again.'
      );
      generateCaptcha();
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await login(username, password);

      if (success) {
        setFailedAttempts(0);
        setErrorMsg('');
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        generateCaptcha();

        if (newAttempts >= 5) {
          setLockoutTimer(60); // 60 seconds lockout
          setErrorMsg(
            isRtl
              ? 'تم حظر النظام مؤقتاً لمدة 60 ثانية بسبب تجاوز المحاولات الفاشلة'
              : 'System temporarily locked for 60s due to multiple failed attempts'
          );
        } else {
          setErrorMsg(
            isRtl
              ? `بيانات الدخول غير صحيحة. المحاولة (${newAttempts}/5) المتبقية`
              : `Authentication failed. Invalid credentials (${newAttempts}/5 attempts)`
          );
        }
      }
      
    } catch(e) {
      if (e instanceof Error && e.message === 'EMAIL_NOT_VERIFIED') {
        setNeedsVerification(true);
        setErrorMsg(isRtl ? 'يرجى تأكيد بريدك الإلكتروني قبل الدخول.' : 'Verify your email before signing in.');
      } else setErrorMsg(isRtl ? 'تعذر تسجيل الدخول. حاول مرة أخرى.' : 'Unable to sign in. Please try again.');
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsAdminOpen(false)}
          className="absolute top-4 left-4 text-slate-400 hover:text-white bg-slate-800/80 p-2 rounded-full transition-all hover:scale-105 cursor-pointer z-10"
          title={isRtl ? "إغلاق النافذة" : "Close"}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Security Shield Header */}
        <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 p-6 pb-4 border-b border-slate-800/80 text-center relative">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500/20 via-emerald-500/10 to-teal-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-emerald-400 shadow-xl shadow-emerald-500/10">
            <ShieldCheck className="w-9 h-9 animate-pulse" />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-wide">
            {isRtl ? "منظومة الدخول الآمن للوحة التحكم" : "Secure Portal Control Login"}
          </h2>
          <p className="text-slate-400 text-xs mt-1 font-medium">
            {isRtl 
              ? "يتطلب حساب إداري مسبق وشفرة تحقق أمنية مشفرة" 
              : "Pre-authorized credentials & encrypted security challenge required"}
          </p>

          <div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-slate-400 bg-slate-950/60 py-1.5 px-3 rounded-full border border-slate-800/60 max-w-xs mx-auto">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <LockKeyhole className="w-3 h-3" /> SSL 256-Bit
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-blue-400 font-bold">
              <Fingerprint className="w-3 h-3" /> Auth-Restricted
            </span>
          </div>
        </div>

        {/* Lockout Screen overlay if locked */}
        {lockoutTimer > 0 ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold text-red-400">
              {isRtl ? "تم تفعيل حظر الحماية المؤقت" : "Temporary Security Lockout"}
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              {isRtl 
                ? "تم حظر محاولات الدخول تلقائياً لحماية اللوحة من الهجمات التخمينية. يرجى الانتظار لحين انتهاء العداد." 
                : "Login suspended due to multiple failed attempts. Please wait for the timer countdown."}
            </p>
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
              <span className="text-3xl font-black font-mono text-amber-400">{lockoutTimer}s</span>
              <p className="text-[10px] text-slate-500 mt-1">
                {isRtl ? "ثانية متبقية لإعادة فتح المنفذ" : "seconds remaining until unlocked"}
              </p>
            </div>
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {needsVerification && !verificationSent && (
              <button type="button" onClick={sendVerification} disabled={isSubmitting} className="w-full rounded-lg bg-emerald-700 px-4 py-2 text-sm text-white disabled:opacity-50">
                {isRtl ? 'إرسال رسالة تأكيد البريد الإلكتروني' : 'Send verification email'}
              </button>
            )}
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-2xl font-bold flex items-start gap-2 animate-in fade-in zoom-in-95">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Username Input - Clean & Empty */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 text-start">
                {isRtl ? "اسم المستخدم المعتمد / البريد" : "Authorized Username or Email"}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5 ltr:right-auto ltr:left-3.5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="off"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-2.5 px-10 text-white text-xs font-medium focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder={isRtl ? "أدخل الإيميل" : "Enter email"}
                />
              </div>
            </div>

            {/* Password Input - Clean, Empty, Hide/Show Toggle */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 text-start">
                {isRtl ? "كلمة المرور المشفرة" : "Encrypted Password"}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5 ltr:right-auto ltr:left-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-2.5 px-10 text-white text-xs font-medium focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3.5 left-3.5 ltr:left-auto ltr:right-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Security Verification Code Challenge */}
            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {isRtl ? "رمز التحقق الأمني (PIN)" : "Security PIN Challenge"}
                </span>
                
                {/* Visual PIN Badge */}
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-black tracking-widest text-sm px-3 py-1 rounded-xl shadow-inner select-none">
                    {captchaCode}
                  </span>
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    title={isRtl ? "تغيير رمز التحقق" : "Refresh Code"}
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                required
                maxLength={6}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-emerald-400 font-mono text-center text-xs font-black tracking-wider focus:border-emerald-500 focus:outline-none"
                placeholder={isRtl ? "اكتب الأرقام الظاهرة أعلاه" : "Type digits shown above"}
              />
            </div>

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black py-3.5 px-4 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
            >
              {isSubmitting ? (
                <RotateCw className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <KeyRound className="w-4 h-4" />
              )}
              <span>
                {isSubmitting
                  ? (isRtl ? "جاري التحقق التشفيري..." : "Verifying Auth Credentials...")
                  : (isRtl ? "التحقق والولوج للوحة التحكم" : "Authenticate & Login")}
              </span>
            </button>

            {/* Strict Notice */}
            <div className="pt-2 text-center">
              <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>
                  {isRtl 
                    ? "الوصول مقتصر فقط على المستخدمين المعتمدين مسبقاً" 
                    : "Access strictly restricted to pre-registered personnel"}
                </span>
              </p>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
