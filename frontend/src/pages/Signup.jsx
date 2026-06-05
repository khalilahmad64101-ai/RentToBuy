import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import zxcvbn from 'zxcvbn';
import { z } from 'zod';
import { api } from '../services/api';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Car, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  ShieldCheck, 
  Smartphone, 
  ArrowRight,
  Info,
  CheckSquare,
  AlertCircle
} from 'lucide-react';

// Form Zod validation schema matching strict UK mobile standards and password refinement check
const signupSchema = z.object({
  fullName: z.string()
    .min(3, "Full Name must be at least 3 characters")
    .max(50, "Full Name must not exceed 50 characters")
    .regex(/^[^0-9]*$/, "Full legal name cannot contain numbers or digits"),
  email: z.string()
    .email("Please provide a valid email address"),
  phone: z.string()
    .regex(/^(\+44|0)7\d{9}$/, "Must be a valid UK mobile number starting with 07 or +447 (11 digits)"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least 1 special character"),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine(val => val === true, "You must agree to the Terms & Conditions and Privacy Policy to register.")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export function Signup() {
  const { verifyAndSignup, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  // State configurations
  const [verificationStep, setVerificationStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');

  // UI elements triggers
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Live resend countdown timer details
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Custom visual triggers for Google Login simulation
  const [showGooglePopup, setShowGooglePopup] = useState(false);
  const [googlePopupLoading, setGooglePopupLoading] = useState(false);

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    }
  });

  const watchEmail = watch('email', '');
  const watchPassword = watch('password', '');

  // Computed live password strength indicators using elite zxcvbn
  const getPasswordStrength = () => {
    if (!watchPassword) {
      return { 
        label: 'None', 
        score: 0, 
        color: 'bg-gray-100', 
        textClass: 'text-gray-400', 
        suggestions: [], 
        warning: '' 
      };
    }
    
    const analysis = zxcvbn(watchPassword);
    const score = analysis.score; // Integer range 0 to 4
    
    let label = 'Weak';
    let color = 'bg-red-500';
    let textClass = 'text-red-500';
    
    if (score === 2) {
      label = 'Medium';
      color = 'bg-amber-500';
      textClass = 'text-amber-500';
    } else if (score === 3) {
      label = 'Strong';
      color = 'bg-lime-500';
      textClass = 'text-[#A3E635]';
    } else if (score === 4) {
      label = 'Very Strong';
      color = 'bg-emerald-500';
      textClass = 'text-emerald-500';
    }
    
    return {
      label,
      score,
      color,
      textClass,
      suggestions: analysis.feedback.suggestions || [],
      warning: analysis.feedback.warning || ''
    };
  };

  const strength = getPasswordStrength();

  // Watch for validation state and countdown triggers
  useEffect(() => {
    let interval = null;
    if (verificationStep && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [verificationStep, timer]);

  // Request secure OTP code generation from backend server
  const handlePreSignupSubmit = async (data) => {
    if (loading) return; // double submit prevention guard
    setLoading(true);
    setErrorMsg('');
    setOtpError('');

    try {
      const payload = {
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim().replace(/\s+/g, ''),
        password: data.password
      };

      const result = await api.auth.sendSignupOTP(payload);
      
      setVerificationStep(true);
      setTimer(60);
      setCanResend(false);

    } catch (err) {
      console.error("Backend validation trigger crash:", err);
      setErrorMsg(err?.message || "An authentication connection error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP code request handler
  const handleResendOtp = async () => {
    if (!canResend || loading) return; // rate-limit defense guard
    setLoading(true);
    setOtpError('');

    try {
      const payload = {
        fullName: watch('fullName').trim(),
        email: watch('email').trim().toLowerCase(),
        phone: watch('phone').trim().replace(/\s+/g, ''),
        password: watch('password')
      };

      const result = await api.auth.sendSignupOTP(payload);

      setTimer(60);
      setCanResend(false);

    } catch (err) {
      setOtpError(err?.message || "Failed to dispatch resend PIN code. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  // Submit official verification OTP code checks to complete signup
  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // double submit prevention guard
    setOtpError('');

    if (!otpCode || otpCode.length !== 6) {
      setOtpError('Please provide a complete 6-digit confirmation PIN.');
      return;
    }

    setLoading(true);
    try {
      await verifyAndSignup(watchEmail.trim().toLowerCase(), otpCode);
      navigate(redirectUrl);
    } catch (err) {
      setOtpError(err.message || 'Verification could not connect to authenticating database.');
    } finally {
      setLoading(false);
    }
  };

  // Real Google Sign-In Integration hook
  useEffect(() => {
    let active = true;

    const loadGoogle = () => {
      if (!window.google?.accounts?.id) {
        setTimeout(loadGoogle, 200);
        return;
      }

      api.auth.getGoogleClientId()
        .then(({ googleClientId }) => {
          if (!active) return;

          const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || googleClientId;

          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
              try {
                setGooglePopupLoading(true);
                setErrorMsg('');
                await googleLogin(response.credential);
                navigate(redirectUrl);
              } catch (err) {
                setErrorMsg(err?.message || "Google signup failed");
              } finally {
                setGooglePopupLoading(false);
              }
            },
          });

          const container = document.getElementById("signup-google-btn-wrapper");
          if (container) {
            window.google.accounts.id.renderButton(container, {
              theme: "outline",
              size: "large",
              shape: "pill",
              width: 320,
            });
          }

          // Optionally show One-Tap prompt to improve sign-up conversion rate
          window.google.accounts.id.prompt();
        })
        .catch(console.error);
    };

    loadGoogle();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gray-50/50 font-sans" id="signup-main-page">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-150 shadow-sm relative overflow-hidden" id="signup-container-card">
        
        {/* GDPR Badge */}
        <div className="absolute top-4 right-4 text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest font-mono flex items-center space-x-1 uppercase">
          <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
          <span>FCA & GDPR compliant</span>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-1.5 mb-6">
          <div className="flex justify-center text-slate-900 mb-2">
            <Car className="h-9 w-9 stroke-[2.5] text-[#CDA275]" />
          </div>
          <h2 className="font-sans font-black text-2xl text-gray-950 tracking-tight leading-none" id="signup-title">
            {verificationStep ? "Verify Your Email" : "Create Driver Profile"}
          </h2>
          <p className="text-xs text-gray-500 max-w-xs mx-auto text-center" id="signup-subtitle">
            {verificationStep 
              ? `We have dispatched a 6-digit verification code to ${watchEmail}`
              : "Register your secure PCO Rent-to-Buy and lease agreement profile."
            }
          </p>
        </div>

        {/* Global form errors */}
        {errorMsg && (
          <div className="bg-red-50 text-red-700 text-xs p-3.5 rounded-xl border border-red-100 font-medium mb-4 flex items-center gap-2" id="signup-error-alert" role="alert">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP A: OTP VERIFICATION DISPLAY */}
        {verificationStep ? (
          <form onSubmit={handleVerifyOtpSubmit} className="space-y-5" id="signup-otp-form">
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-xs text-amber-950 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-amber-950">
                <Mail className="w-4 h-4 text-[#CDA275]" />
                <span>Verification PIN Dispatched</span>
              </div>
              <p className="font-light leading-relaxed">
                Enter the security PIN received. A verification token has been posted to your email inbox folder.
              </p>
            </div>

            {otpError && (
              <div className="bg-red-50 text-red-700 text-xs p-3.5 rounded-xl border border-red-100 font-medium font-mono" id="otp-error-alert" role="alert">
                {otpError}
              </div>
            )}

            <div>
              <label htmlFor="signup-otp-input" className="block text-xs text-gray-500 font-black tracking-wider uppercase mb-1.5 font-mono">6-Digit Verification PIN</label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  id="signup-otp-input"
                  name="otp"
                  autoComplete="one-time-code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="e.g. 123456"
                  className="w-full text-sm pl-10 pr-3 py-3 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDA275] tracking-widest text-center font-bold"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              id="signup-otp-button"
              className="w-full font-bold py-3 uppercase tracking-wider text-xs justify-center flex items-center gap-1.5"
            >
              {loading ? 'Authorizing identity...' : 'Verify Email & Complete Account Setup'}
              <ArrowRight className="w-4 h-4" />
            </Button>

            {/* Countdown timer with professional resend trigger link */}
            <div className="text-center pt-2 border-t border-gray-100 mt-2 space-y-2">
              <div className="text-xs text-gray-400">
                {timer > 0 ? (
                  <span className="flex items-center justify-center gap-1 font-mono font-medium">
                    Resend code in <strong className="text-[#CDA275]">{`00:${timer < 10 ? '0' + timer : timer}`}</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer focus:outline-none"
                  >
                    Resend Code PIN
                  </button>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setVerificationStep(false)}
                  className="text-xs text-gray-400 hover:text-indigo-600 transition-colors font-medium underline cursor-pointer"
                >
                  Go back & edit details
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* STEP B: SIGNUP FILL FORMS VIEW */
          <form onSubmit={handleSubmit(handlePreSignupSubmit)} className="space-y-4" id="signup-credentials-form" noValidate>
            
            {/* 1. Full Legal Name Input */}
            <div>
              <label htmlFor="signup-fullname-input" className="block text-xs text-slate-500 font-bold mb-1">Full Legal Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  id="signup-fullname-input"
                  name="fullName"
                  autoComplete="name"
                  maxLength={50}
                  {...register('fullName')}
                  placeholder="Jane Doe"
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                  className={`w-full text-xs pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.fullName ? 'border-red-500 bg-red-50/10 focus:ring-red-500' : 'border-gray-250'
                  }`}
                />
              </div>
              {errors.fullName && (
                <span id="fullName-error" className="text-[10px] text-red-600 font-medium mt-1 block px-1">{errors.fullName.message}</span>
              )}
            </div>

            {/* 2. Mobile Phone UK Number */}
            <div>
              <label htmlFor="signup-phone-input" className="block text-xs text-slate-500 font-bold mb-1">Mobile Phone (UK)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  id="signup-phone-input"
                  name="phone"
                  autoComplete="tel"
                  maxLength={15}
                  {...register('phone')}
                  placeholder="07758313276"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  className={`w-full text-xs pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.phone ? 'border-red-500 bg-red-50/10 focus:ring-red-500' : 'border-gray-250'
                  }`}
                />
              </div>
              {errors.phone ? (
                <span id="phone-error" className="text-[10px] text-red-600 font-medium mt-1 block px-1">{errors.phone.message}</span>
              ) : (
                <span className="text-[9px] text-gray-400 italic block mt-1 px-1">Pattern: Starting with 07 or +447 followed by 9 digits</span>
              )}
            </div>

            {/* 3. Email Address Input */}
            <div>
              <label htmlFor="signup-email-input" className="block text-xs text-slate-500 font-bold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  id="signup-email-input"
                  name="email"
                  autoComplete="email"
                  maxLength={100}
                  {...register('email')}
                  placeholder="driver@r2buy.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`w-full text-xs pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.email ? 'border-red-500 bg-red-50/10 focus:ring-red-500' : 'border-gray-250'
                  }`}
                />
              </div>
              {errors.email && (
                <span id="email-error" className="text-[10px] text-red-600 font-medium mt-1 block px-1">{errors.email.message}</span>
              )}
            </div>

            {/* 4. Password Input */}
            <div>
              <label htmlFor="signup-password-input" className="block text-xs text-slate-500 font-bold mb-1">Secure Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="signup-password-input"
                  name="password"
                  autoComplete="new-password"
                  maxLength={128}
                  {...register('password')}
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={`w-full text-xs pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-250'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-slate-800 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter computed using real zxcvbn entropy checks */}
              {watchPassword && (
                <div className="mt-2 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-gray-150 animate-fade-in text-left">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-gray-400 uppercase tracking-wider font-mono">zxcvbn strength estimation</span>
                    <span className={strength.textClass}>{strength.label.toUpperCase()}</span>
                  </div>
                  {/* Dynamic Colored Intensity Bars */}
                  <div className="grid grid-cols-4 gap-1 h-1.5 w-full mt-1 bg-gray-100 rounded overflow-hidden">
                    {[1, 2, 3, 4].map((barIdx) => (
                      <div
                        key={barIdx}
                        className={`h-full transition-all duration-300 ${
                          strength.score >= barIdx ? strength.color : 'bg-gray-150'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Suggestions or warnings feedback blocks */}
                  {(strength.warning || strength.suggestions.length > 0) && (
                    <div className="mt-1.5 p-1.5 bg-[#FFFCE8] border border-[#FEF3C7] rounded text-[9px] text-[#854D0E] space-y-0.5">
                      {strength.warning && <p className="font-bold flex items-center gap-1">⚠ {strength.warning}</p>}
                      {strength.suggestions.map((s, idx) => (
                        <p key={idx} className="font-light">• {s}</p>
                      ))}
                    </div>
                  )}

                  {/* Standard criteria guidelines checklist */}
                  <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] text-slate-400 leading-normal">
                    <span className="flex items-center gap-1">
                      {watchPassword.length >= 8 ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-red-400" />}
                      Min 8 characters
                    </span>
                    <span className="flex items-center gap-1">
                      {/[A-Z]/.test(watchPassword) ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-red-400" />}
                      1 Uppercase letter
                    </span>
                    <span className="flex items-center gap-1">
                      {/[a-z]/.test(watchPassword) ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-red-400" />}
                      1 Lowercase letter
                    </span>
                    <span className="flex items-center gap-1">
                      {/[0-9]/.test(watchPassword) ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-red-400" />}
                      1 Number digit
                    </span>
                    <span className="flex items-center gap-1 col-span-2">
                      {/[!@#$%^&*(),.?":{}|<>]/.test(watchPassword) ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-red-400" />}
                      1 Special character (!@#$%^&*)
                    </span>
                  </div>
                </div>
              )}
              {errors.password && (
                <span id="password-error" className="text-[10px] text-red-600 font-medium mt-1 block px-1">{errors.password.message}</span>
              )}
            </div>

            {/* 5. Confirm Password Input */}
            <div>
              <label htmlFor="signup-confirmpassword-input" className="block text-xs text-slate-500 font-bold mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="signup-confirmpassword-input"
                  name="confirmPassword"
                  autoComplete="new-password"
                  maxLength={128}
                  {...register('confirmPassword')}
                  placeholder="••••••••"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                  className={`w-full text-xs pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-250'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-slate-800 focus:outline-none cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 animate-pulse" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span id="confirmPassword-error" className="text-[10px] text-red-600 font-medium mt-1 block px-1">{errors.confirmPassword.message}</span>
              )}
            </div>

            {/* 6. Terms and Privacy Policy Tickbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="signup-agreement-checkbox"
                name="agreeTerms"
                {...register('agreeTerms')}
                aria-invalid={!!errors.agreeTerms}
                className="mt-1 h-4 w-4 text-[#CDA275] border-gray-300 rounded focus:ring-[#CDA275] cursor-pointer"
              />
              <label htmlFor="signup-agreement-checkbox" className="text-[11px] text-gray-500 leading-normal cursor-pointer select-none">
                I agree to the <a href="#terms" className="text-indigo-600 font-semibold hover:underline">Terms of Service</a> & <a href="#privacy" className="text-indigo-600 font-semibold hover:underline">Privacy Policy</a>. I consent to my license records verification under PCO nationwide standards.
              </label>
            </div>
            {errors.agreeTerms && (
              <span className="text-[10px] text-red-600 font-medium block px-1">{errors.agreeTerms.message}</span>
            )}

            {/* 7. Action Button Form Trigger */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                id="signup-submit-button"
                className="w-full font-bold py-3 shadow-md bg-slate-950 text-white hover:bg-slate-900 justify-center flex items-center"
              >
                {loading ? 'Pre-validating credentials...' : 'Register Driver Profile'}
              </Button>
            </div>
            
            {/* 8. Professional Google Auth Integration Panel */}
            <div className="border-t border-gray-150 pt-5 space-y-4">
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-400 font-black tracking-widest text-[9px] font-mono">OR JOIN INSTANTLY WITH</span>
              </div>
              
              <div className="flex justify-center w-full" id="signup-google-btn-wrapper" style={{ minHeight: '44px' }}>
                <span className="text-xs text-slate-400 animate-pulse py-2">Loading Google Securing Services...</span>
              </div>
            </div>
          </form>
        )}

        {/* Dynamic Redirect Footer links */}
        <div className="text-center text-xs text-gray-500 pt-3 pb-1 border-t border-gray-100 mt-5">
          Already have an R2Buy profile?{' '}
          <Link to="/login" className="text-indigo-600 font-bold hover:underline" id="signup-redirect-login-link">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
