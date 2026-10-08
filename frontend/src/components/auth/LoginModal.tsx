import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Building2, ArrowRight, ArrowLeft, Lock, Mail, KeyRound, CheckCircle2, RefreshCw, Send, ChevronDown } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/api/endpoints';
import { auth as firebaseAuth, RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider, signInWithPopup } from '@/config/firebase';
import type { ConfirmationResult } from '@/config/firebase';
import toast from 'react-hot-toast';
import { GoogleAccountChooser } from '@/components/auth/GoogleAccountChooser';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Mode: 'customer' | 'staff'
  const [roleMode, setRoleMode] = useState<'customer' | 'staff'>('customer');

  // Customer sub-views: 'getStarted' (BookMyShow format) | 'email' | 'phoneVerify'
  const [customerView, setCustomerView] = useState<'getStarted' | 'email' | 'phoneVerify'>('getStarted');
  const [isGoogleChooserOpen, setIsGoogleChooserOpen] = useState(false);

  // Email sub-mode: 'emailOtp' | 'password'
  const [emailAuthMethod, setEmailAuthMethod] = useState<'emailOtp' | 'password'>('emailOtp');
  const [customerMode, setCustomerMode] = useState<'signin' | 'signup'>('signin');
  const [customerIdentifier, setCustomerIdentifier] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');

  // Customer Email OTP State (Brevo)
  const [otpEmail, setOtpEmail] = useState('');
  const [otpName, setOtpName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpStep, setOtpStep] = useState<'input' | 'verify'>('input');
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Customer Phone SMS State
  const [phoneMobile, setPhoneMobile] = useState('');
  const [phoneOtpCode, setPhoneOtpCode] = useState('');
  const [phoneCountdown, setPhoneCountdown] = useState(0);
  const [isSendingPhoneOtp, setIsSendingPhoneOtp] = useState(false);
  const [isVerifyingPhoneOtp, setIsVerifyingPhoneOtp] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Customer Registration fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);

  // Staff State (Theatre Manager & System Admin)
  const [staffRole, setStaffRole] = useState<'manager' | 'admin'>('manager');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setInterval(() => {
      setOtpCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCountdown]);

  useEffect(() => {
    if (phoneCountdown <= 0) return;
    const timer = setInterval(() => {
      setPhoneCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [phoneCountdown]);

  const cleanupRecaptcha = () => {
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch (err) {
        console.warn('Recaptcha clear warning:', err);
      }
      recaptchaVerifierRef.current = null;
    }
    const container = document.getElementById('firebase-recaptcha-container');
    if (container) {
      container.remove();
    }
  };

  useEffect(() => {
    return () => {
      cleanupRecaptcha();
    };
  }, []);

  const handlePhoneChange = (val: string) => {
    let digits = val.replace(/\D/g, '');
    if (digits.startsWith('91') && digits.length > 10) {
      digits = digits.slice(2);
    } else if (digits.startsWith('0') && digits.length > 10) {
      digits = digits.slice(1);
    }
    setPhoneMobile(digits.slice(0, 10));
  };

  const getOrCreateRecaptcha = () => {
    if (recaptchaVerifierRef.current) {
      return recaptchaVerifierRef.current;
    }

    const existing = document.getElementById('firebase-recaptcha-container');
    if (existing) {
      existing.remove();
    }
    const container = document.createElement('div');
    container.id = 'firebase-recaptcha-container';
    document.body.appendChild(container);

    const verifier = new RecaptchaVerifier(firebaseAuth, container, {
      size: 'invisible',
      callback: () => {},
      'expired-callback': () => {
        toast.error('Security verification expired. Please request OTP again.');
        cleanupRecaptcha();
      },
    });

    recaptchaVerifierRef.current = verifier;
    return verifier;
  };

  const handleSendPhoneOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let cleanNumber = phoneMobile.replace(/\D/g, '');
    if (cleanNumber.startsWith('91') && cleanNumber.length > 10) {
      cleanNumber = cleanNumber.slice(2);
    } else if (cleanNumber.startsWith('0') && cleanNumber.length > 10) {
      cleanNumber = cleanNumber.slice(1);
    }
    if (cleanNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setIsSendingPhoneOtp(true);
    try {
      const verifier = getOrCreateRecaptcha();
      const formattedPhone = `+91${cleanNumber}`;
      const confirmation = await signInWithPhoneNumber(firebaseAuth, formattedPhone, verifier);
      setConfirmationResult(confirmation);
      setCustomerView('phoneVerify');
      setPhoneCountdown(60);
      toast.success(`Verification code sent to +91 ${cleanNumber}!`);
    } catch (err: any) {
      console.error('Firebase Phone Auth Error:', err);
      cleanupRecaptcha();
      let msg = 'Failed to send SMS OTP. Please check your connection.';
      if (err.code === 'auth/billing-not-enabled' || (err.message && err.message.includes('billing-not-enabled'))) {
        msg = 'Phone SMS requires Firebase setup. Use Gmail OTP for instant free delivery!';
      } else if (err.message && (err.message.toLowerCase().includes('region') || err.message.toLowerCase().includes('country'))) {
        msg = 'SMS blocked by region policy: Enable India (+91) in Firebase Console.';
      } else if (err.code === 'auth/invalid-phone-number') {
        msg = 'Invalid mobile number. Please check the 10-digit number.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many requests. Please wait a moment or try Gmail OTP.';
      } else if (err.code === 'auth/quota-exceeded') {
        msg = 'SMS quota reached. Please use Gmail OTP.';
      } else if (err.code === 'auth/captcha-check-failed') {
        msg = 'Security check failed. Please try again.';
      } else if (err.message) {
        msg = err.message;
      }
      toast.error(msg, { duration: 6000 });
    } finally {
      setIsSendingPhoneOtp(false);
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneOtpCode.length < 6) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }
    if (!confirmationResult) {
      toast.error('Please request a code first');
      return;
    }
    setIsVerifyingPhoneOtp(true);
    try {
      const result = await confirmationResult.confirm(phoneOtpCode.trim());
      const fbUser = result.user;
      let cleanPhone = (fbUser.phoneNumber || phoneMobile).replace(/[^0-9]/g, '');
      if (cleanPhone.startsWith('91') && cleanPhone.length > 10) cleanPhone = cleanPhone.slice(2);
      cleanPhone = cleanPhone.slice(-10);
      const verifiedUser = {
        id: fbUser.uid || '1008',
        name: `Customer (${cleanPhone.slice(-4)})`,
        phone: cleanPhone,
        email: `${cleanPhone}@phone.cinego.com`,
        role: 'USER' as const,
      };
      login(`token_firebase_${fbUser.uid}`, verifiedUser);
      toast.success('Mobile verified! Signed into CineGo.');
      onClose();
    } catch (err: any) {
      console.error('Phone OTP Verification Error:', err);
      let msg = 'Invalid or expired verification code.';
      if (err.code === 'auth/invalid-verification-code') {
        msg = 'Incorrect 6-digit code. Please check and re-enter.';
      } else if (err.code === 'auth/code-expired') {
        msg = 'Verification code has expired. Please request a new code.';
      }
      toast.error(msg);
    } finally {
      setIsVerifyingPhoneOtp(false);
    }
  };

  const handleSendEmailOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otpEmail.trim() || !otpEmail.includes('@')) {
      toast.error('Please enter a valid Gmail / Email address');
      return;
    }
    setIsSendingOtp(true);
    try {
      const res = await authApi.sendEmailOtp(otpEmail.trim().toLowerCase(), otpName.trim() || undefined);
      if (res.data?.success) {
        toast.success(res.data.message || 'Verification OTP sent to your Gmail inbox!');
        setOtpStep('verify');
        setOtpCountdown(60);
      } else {
        toast.error(res.data?.message || 'Failed to send verification email');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send OTP to your Gmail.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      toast.error('Please enter the 6-digit OTP received in your Gmail');
      return;
    }
    setIsVerifyingOtp(true);
    try {
      const res = await authApi.verifyEmailOtp(otpEmail.trim().toLowerCase(), otpCode.trim());
      if (res.data?.success && res.data?.data) {
        const { user, token } = res.data.data;
        login(token, {
          id: user.id,
          name: user.name,
          phone: user.mobile,
          email: user.email,
          role: 'USER',
        });
        toast.success(`Welcome to CineGo, ${user.name}!`);
        onClose();
      } else {
        toast.error(res.data?.message || 'Invalid verification code');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP code');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleChooserOpen(true);
  };

  const handleSelectGoogleAccount = (acc: { name: string; email: string; avatar: string }) => {
    const isRuthra = acc.email.toLowerCase().includes('ragaruthra') || acc.name.toLowerCase().includes('ruthra');
    const isRudhresh = acc.email.toLowerCase().includes('rudhresh');
    const verifiedUser = {
      id: isRuthra ? '1001' : isRudhresh ? '1002' : '1005',
      name: acc.name,
      phone: '9597314692',
      email: acc.email,
      role: 'USER' as const,
      avatar: acc.avatar,
    };
    login(`token_google_${verifiedUser.id}`, verifiedUser);
    toast.success(`Welcome, ${acc.name}! Signed in with Google.`);
    setIsGoogleChooserOpen(false);
    onClose();
  };

  const handleAppleLogin = () => {
    const verifiedUser = {
      id: '1006',
      name: 'Manikandan (Apple)',
      phone: '9487576563',
      email: 'manikandan@icloud.com',
      role: 'USER' as const,
    };
    login('token_apple_verified_1006', verifiedUser);
    toast.success('Signed in with Apple ID!');
    onClose();
  };

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerIdentifier.trim()) {
      toast.error('Please enter your email or mobile number');
      return;
    }
    if (!customerPassword) {
      toast.error('Please enter your password');
      return;
    }

    setIsLoadingCustomer(true);
    try {
      const res = await authApi.login({
        email: customerIdentifier.trim().toLowerCase(),
        password: customerPassword,
      });
      if (res.data?.success && res.data?.data) {
        const { token, user } = res.data.data;
        login(token, {
          id: user.id,
          name: user.name,
          phone: user.mobile,
          email: user.email,
          role: 'USER',
        });
        toast.success(`Welcome back, ${user.name}!`);
        onClose();
      } else {
        toast.error(res.data?.message || 'Invalid credentials');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials. Please check your email and password.');
    } finally {
      setIsLoadingCustomer(false);
    }
  };

  const handleCustomerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      toast.error('Please enter your Full Name');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      toast.error('Please enter a valid Gmail / Email address');
      return;
    }
    const cleanMobile = regMobile.replace(/[^0-9]/g, '').slice(-10);
    if (cleanMobile.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    if (regPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoadingCustomer(true);
    try {
      const res = await authApi.register({
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        mobile: cleanMobile,
        password: regPassword,
      });
      if (res.data?.success && res.data?.data) {
        const { token, user } = res.data.data;
        login(token, {
          id: user.id,
          name: user.name,
          phone: user.mobile,
          email: user.email,
          role: 'USER',
        });
        toast.success(`Account created successfully! Welcome, ${user.name}!`);
        onClose();
      } else {
        toast.error(res.data?.message || 'Registration failed');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setIsLoadingCustomer(false);
    }
  };

  const handleManagerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managerEmail.trim() || !managerPassword.trim()) {
      toast.error('Please provide manager email and password');
      return;
    }
    if (managerEmail.trim().toLowerCase() === 'manager@pvr.com' && managerPassword === 'pvr@1234') {
      const managerUser = {
        id: '1002',
        name: 'Suresh (Cinema Operations)',
        phone: '9000000022',
        email: managerEmail.trim(),
        role: 'MANAGER' as const,
      };
      login('token_manager_session_1002', managerUser);
      toast.success('Signed in as Theatre Manager');
      onClose();
      navigate('/manager?tab=SHOWS');
    } else {
      toast.error('Invalid Theatre Manager credentials.');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword.trim()) {
      toast.error('Please provide admin email and password');
      return;
    }
    if (adminEmail.trim().toLowerCase() === 'admin@cinego.com' && adminPassword === 'admin@1234') {
      const adminUser = {
        id: '1001',
        name: 'Chief Administrator',
        phone: '9000000001',
        email: adminEmail.trim(),
        role: 'ADMIN' as const,
      };
      login('token_admin_session_1001', adminUser);
      toast.success('Signed in as System Administrator');
      onClose();
      navigate('/admin');
    } else {
      toast.error('Invalid System Administrator credentials.');
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-5">
        {/* ======================================================== */}
        {/* 1. CUSTOMER PORTAL (Exact BookMyShow "Get Started" Format) */}
        {/* ======================================================== */}
        {roleMode === 'customer' && (
          <div>
            {/* VIEW A: GET STARTED ROOT (MATCHING BOOKMYSHOW SCREENSHOT) */}
            {customerView === 'getStarted' && (
              <div className="space-y-4 text-center">
                <h2 className="text-xl font-bold font-display text-white">Get Started</h2>

                {/* 3 Prominent Continue Buttons (BookMyShow Layout) */}
                <div className="space-y-3 pt-1">
                  {/* 1. Continue with Google */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full bg-white hover:bg-zinc-100 text-zinc-800 text-sm font-semibold py-3 px-4 rounded-xl border border-zinc-200 flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  {/* 2. Continue with Email */}
                  <button
                    type="button"
                    onClick={() => setCustomerView('email')}
                    className="w-full bg-white hover:bg-zinc-100 text-zinc-800 text-sm font-semibold py-3 px-4 rounded-xl border border-zinc-200 flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm"
                  >
                    <Mail className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                    <span>Continue with Email</span>
                  </button>

                  {/* 3. Continue with Apple */}
                  <button
                    type="button"
                    onClick={handleAppleLogin}
                    className="w-full bg-white hover:bg-zinc-100 text-zinc-800 text-sm font-semibold py-3 px-4 rounded-xl border border-zinc-200 flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.66-1.06 1.72-.93 2.75 1 .08 2.02-.5 2.64-1.25" />
                    </svg>
                    <span>Continue with Apple</span>
                  </button>
                </div>

                {/* OR Divider */}
                <div className="relative my-4 flex items-center justify-center">
                  <div className="border-t border-white/10 w-full absolute"></div>
                  <span className="bg-zinc-950 px-3 text-xs text-zinc-500 font-semibold relative z-10 uppercase tracking-widest">
                    OR
                  </span>
                </div>

                {/* Mobile Phone Input Row (BookMyShow Style with Flag) */}
                <form onSubmit={handleSendPhoneOtp} className="space-y-3.5 pt-1">
                  <div className="flex items-center border-b border-white/20 hover:border-white/40 focus-within:border-primary transition-all pb-2">
                    <div className="flex items-center gap-1.5 pr-3 text-sm text-zinc-300 font-semibold select-none">
                      <span className="text-base">🇮🇳</span>
                      <span>+91</span>
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                    </div>
                    <input
                      type="tel"
                      value={phoneMobile}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="Continue with mobile number"
                      className="w-full bg-transparent text-white text-sm placeholder-zinc-500 focus:outline-none font-medium"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSendingPhoneOtp}
                    className="w-full rounded-xl py-3 text-sm font-bold shadow-lg shadow-primary/25 cursor-pointer"
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </form>

                {/* Footer Terms */}
                <div className="pt-4 text-[11px] text-zinc-500 leading-relaxed">
                  By continuing, you agree to our{' '}
                  <span className="text-zinc-400 underline hover:text-white cursor-pointer">Terms & Conditions</span>{' '}
                  and{' '}
                  <span className="text-zinc-400 underline hover:text-white cursor-pointer">Privacy Policy</span>.
                </div>

                {/* Cinema Staff Switcher */}
                <div className="pt-3 border-t border-white/5 text-center">
                  <button
                    type="button"
                    onClick={() => setRoleMode('staff')}
                    className="text-xs text-zinc-400 hover:text-primary transition-colors cursor-pointer"
                  >
                    Theatre Manager or Administrator? <span className="text-primary font-bold">Staff Login &rarr;</span>
                  </button>
                </div>
              </div>
            )}

            {/* VIEW B: VERIFY MOBILE OTP */}
            {customerView === 'phoneVerify' && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setCustomerView('getStarted')}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Get Started
                </button>

                <div className="text-center">
                  <h3 className="text-lg font-bold text-white">Verify Mobile Number</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Enter the 6-digit verification code for <strong className="text-zinc-200">+91 {phoneMobile}</strong>
                  </p>
                </div>

                <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      value={phoneOtpCode}
                      onChange={(e) => setPhoneOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="••••••"
                      className="w-full rounded-xl bg-zinc-900 border border-primary/50 text-white text-center text-xl tracking-[10px] font-mono py-3 focus:outline-none focus:border-primary font-bold"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Delivered to +91 {phoneMobile}</span>
                    {phoneCountdown > 0 ? (
                      <span className="font-mono text-zinc-500">Resend in {phoneCountdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendPhoneOtp()}
                        className="text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> Resend Code
                      </button>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isVerifyingPhoneOtp}
                    className="w-full rounded-xl py-3 text-xs font-bold shadow-lg shadow-primary/30 cursor-pointer"
                  >
                    Verify & Continue <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </form>
              </div>
            )}

            {/* VIEW C: EMAIL FLOW (GMAIL OTP & PASSWORD SIGN IN) */}
            {customerView === 'email' && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setCustomerView('getStarted')}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Get Started
                </button>

                {/* Sub-tab: Gmail OTP vs Password */}
                <div className="grid grid-cols-2 bg-zinc-900 p-1 rounded-xl border border-white/10 gap-1 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setEmailAuthMethod('emailOtp')}
                    className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      emailAuthMethod === 'emailOtp' ? 'bg-primary text-white shadow' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" /> Gmail OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailAuthMethod('password')}
                    className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      emailAuthMethod === 'password' ? 'bg-primary text-white shadow' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" /> Password
                  </button>
                </div>

                {/* EMAIL OTP WORKFLOW */}
                {emailAuthMethod === 'emailOtp' && (
                  <div>
                    {otpStep === 'input' ? (
                      <form onSubmit={handleSendEmailOtp} className="space-y-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1">
                            Your Gmail Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                              type="email"
                              required
                              value={otpEmail}
                              onChange={(e) => setOtpEmail(e.target.value)}
                              placeholder="Enter your email address"
                              className="w-full rounded-xl bg-zinc-900 border border-white/10 text-white text-xs pl-10 pr-4 py-3 focus:outline-none focus:border-primary"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1">
                            Your Name <span className="text-zinc-500 font-normal">(Optional)</span>
                          </label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                              type="text"
                              value={otpName}
                              onChange={(e) => setOtpName(e.target.value)}
                              placeholder="Enter your name"
                              className="w-full rounded-xl bg-zinc-900 border border-white/10 text-white text-xs pl-10 pr-4 py-3 focus:outline-none focus:border-primary"
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          variant="primary"
                          isLoading={isSendingOtp}
                          className="w-full rounded-xl py-3 text-xs font-bold shadow-lg shadow-primary/30 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 mr-1.5" /> Send Verification Code
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyEmailOtp} className="space-y-3.5">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-zinc-300">Enter 6-Digit Code</label>
                          <button
                            type="button"
                            onClick={() => setOtpStep('input')}
                            className="text-[11px] text-primary hover:underline cursor-pointer"
                          >
                            Change {otpEmail}
                          </button>
                        </div>
                        <div className="relative">
                          <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                          <input
                            type="text"
                            maxLength={6}
                            autoFocus
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="••••••"
                            className="w-full rounded-xl bg-zinc-900 border border-primary/50 text-white text-center text-lg tracking-[8px] font-mono py-2.5 focus:outline-none focus:border-primary font-bold"
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-zinc-400">
                          <span>Expires in 5 minutes</span>
                          {otpCountdown > 0 ? (
                            <span className="font-mono text-zinc-500">Resend in {otpCountdown}s</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSendEmailOtp()}
                              className="text-primary hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3" /> Resend Code
                            </button>
                          )}
                        </div>

                        <Button
                          type="submit"
                          variant="primary"
                          isLoading={isVerifyingOtp}
                          className="w-full rounded-xl py-3 text-xs font-bold shadow-lg shadow-primary/30 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Verify & Continue
                        </Button>
                      </form>
                    )}
                  </div>
                )}

                {/* PASSWORD SIGN IN / SIGN UP WORKFLOW */}
                {emailAuthMethod === 'password' && (
                  <div className="space-y-3.5">
                    <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/10">
                      <button
                        type="button"
                        onClick={() => setCustomerMode('signin')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          customerMode === 'signin' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomerMode('signup')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          customerMode === 'signup' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Create Account
                      </button>
                    </div>

                    {customerMode === 'signin' ? (
                      <form onSubmit={handleCustomerLogin} className="space-y-3.5" autoComplete="off">
                        <input type="text" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
                        <input type="password" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 mb-1">Email or Mobile</label>
                          <input
                            type="text"
                            required
                            name="cinego_cust_uid"
                            id="cinego_cust_uid"
                            autoComplete="new-password"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck={false}
                            value={customerIdentifier}
                            onChange={(e) => setCustomerIdentifier(e.target.value)}
                            placeholder="Enter your email or 10-digit mobile"
                            className="w-full rounded-xl bg-zinc-900 border border-white/10 text-white text-xs px-3.5 py-2.5 focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 mb-1">Password</label>
                          <input
                            type="password"
                            required
                            name="cinego_cust_pwd"
                            id="cinego_cust_pwd"
                            autoComplete="new-password"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck={false}
                            value={customerPassword}
                            onChange={(e) => setCustomerPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full rounded-xl bg-zinc-900 border border-white/10 text-white text-xs px-3.5 py-2.5 focus:outline-none focus:border-primary"
                          />
                        </div>
                        <Button
                          type="submit"
                          variant="primary"
                          isLoading={isLoadingCustomer}
                          className="w-full rounded-xl py-2.5 text-xs font-bold shadow-lg shadow-primary/30"
                        >
                          Sign In <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleCustomerRegister} className="space-y-3" autoComplete="off">
                        <input type="text" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
                        <input type="password" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 mb-1">Full Name</label>
                          <input
                            type="text"
                            required
                            name="cinego_reg_fullname"
                            id="cinego_reg_fullname"
                            autoComplete="new-password"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck={false}
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full rounded-xl bg-zinc-900 border border-white/10 text-white text-xs px-3.5 py-2 focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 mb-1">Email Address</label>
                          <input
                            type="email"
                            required
                            name="cinego_reg_email"
                            id="cinego_reg_email"
                            autoComplete="new-password"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck={false}
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="w-full rounded-xl bg-zinc-900 border border-white/10 text-white text-xs px-3.5 py-2 focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 mb-1">Mobile Number</label>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            name="cinego_reg_mobile"
                            id="cinego_reg_mobile"
                            autoComplete="new-password"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck={false}
                            value={regMobile}
                            onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ''))}
                            placeholder="10-digit mobile number"
                            className="w-full rounded-xl bg-zinc-900 border border-white/10 text-white text-xs px-3.5 py-2 focus:outline-none focus:border-primary font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 mb-1">Create Password</label>
                          <input
                            type="password"
                            required
                            name="cinego_reg_pwd"
                            id="cinego_reg_pwd"
                            autoComplete="new-password"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck={false}
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="Minimum 6 characters"
                            className="w-full rounded-xl bg-zinc-900 border border-white/10 text-white text-xs px-3.5 py-2 focus:outline-none focus:border-primary"
                          />
                        </div>
                        <Button
                          type="submit"
                          variant="primary"
                          isLoading={isLoadingCustomer}
                          className="w-full rounded-xl py-2.5 text-xs font-bold shadow-lg shadow-primary/30 mt-1"
                        >
                          Create Account & Sign In <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. STAFF PORTAL (THEATRE MANAGER & SYSTEM ADMIN) */}
        {/* ======================================================== */}
        {roleMode === 'staff' && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setRoleMode('customer')}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Customer Login
            </button>

            {/* Manager vs Admin Toggle */}
            <div className="grid grid-cols-2 bg-zinc-900 p-1 rounded-xl border border-white/10 gap-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setStaffRole('manager')}
                className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  staffRole === 'manager' ? 'bg-emerald-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Theatre Manager
              </button>
              <button
                type="button"
                onClick={() => setStaffRole('admin')}
                className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  staffRole === 'admin' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" /> System Admin
              </button>
            </div>

            {/* MANAGER FORM */}
            {staffRole === 'manager' && (
              <form onSubmit={handleManagerLogin} className="space-y-3.5" autoComplete="off">
                {/* Hidden decoy fields to divert aggressive browser password autofill */}
                <input type="text" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
                <input type="password" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
                  Manager Portal: Supervise auditorium screenings, rates & admissions.
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Official Cinema Email</label>
                  <input
                    type="email"
                    name="cinego_mgr_sec_usr"
                    id="cinego_mgr_sec_usr"
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    required
                    value={managerEmail}
                    onChange={(e) => setManagerEmail(e.target.value)}
                    placeholder="manager@pvr.com"
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 text-white text-xs px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Password</label>
                  <input
                    type="password"
                    name="cinego_mgr_sec_pwd"
                    id="cinego_mgr_sec_pwd"
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    required
                    value={managerPassword}
                    onChange={(e) => setManagerPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 text-white text-xs px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 min-w-0">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">Demo: <span className="text-zinc-200 font-mono">manager@pvr.com</span></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setManagerEmail('manager@pvr.com'); setManagerPassword('pvr@1234'); }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold transition-all cursor-pointer flex-shrink-0"
                  >
                    Load Credentials
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl py-3 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center cursor-pointer"
                >
                  Sign In to Manager Portal <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>
              </form>
            )}

            {/* ADMIN FORM */}
            {staffRole === 'admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-3.5" autoComplete="off">
                {/* Hidden decoy fields to divert aggressive browser password autofill */}
                <input type="text" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
                <input type="password" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs text-purple-300">
                  Administration Console: Manage movies, platform pricing rules & reports.
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Administrator Email</label>
                  <input
                    type="email"
                    name="cinego_adm_sec_usr"
                    id="cinego_adm_sec_usr"
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@cinego.com"
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 text-white text-xs px-3.5 py-2.5 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Master Password</label>
                  <input
                    type="password"
                    name="cinego_adm_sec_pwd"
                    id="cinego_adm_sec_pwd"
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 text-white text-xs px-3.5 py-2.5 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 min-w-0">
                    <Shield className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    <span className="truncate">Demo: <span className="text-zinc-200 font-mono">admin@cinego.com</span></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setAdminEmail('admin@cinego.com'); setAdminPassword('admin@1234'); }}
                    className="px-2.5 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-400 text-[11px] font-semibold transition-all cursor-pointer flex-shrink-0"
                  >
                    Load Credentials
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl py-3 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center cursor-pointer"
                >
                  Sign In to Admin Console <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </Modal>
    <GoogleAccountChooser
      isOpen={isGoogleChooserOpen}
      onClose={() => setIsGoogleChooserOpen(false)}
      onSelectAccount={handleSelectGoogleAccount}
    />
  </>
  );
};
