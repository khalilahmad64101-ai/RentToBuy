import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Mail, Lock, Car, Sparkles, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { useSEO } from '../hooks/useSEO';
import { mapFriendlyFeedback } from '../utils/feedbackHelper.js';

export function Login() {
  useSEO({
    title: 'Driver Login | Manage Your Lease & Underwriting | R2BuyCar',
    description: 'Log in to your R2BuyCar secure driver portal. Access your lease active pipeline trackers, download motor certificates of insurance, or settle contributions.',
    keywords: 'R2BuyCar driver portal login, lease dashboard access, rent to buy log in'
  });

  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

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
                setLoading(true);
                setErrorMsg('');
                setSuccessMsg('');
                setFieldErrors({});
                await googleLogin(response.credential);
                setSuccessMsg("Welcome! Secure session active.");
                setTimeout(() => {
                  navigate(redirectUrl);
                }, 1000);
              } catch (err) {
                setErrorMsg(mapFriendlyFeedback(err));
              } finally {
                setLoading(false);
              }
            },
          });

          const container = document.getElementById("login-google-btn-wrapper");
          if (container) {
            const clientW = container.clientWidth || (window.innerWidth < 400 ? 270 : 320);
            const computedWidth = Math.max(200, Math.min(clientW, 320));
            window.google.accounts.id.renderButton(container, {
              theme: "outline",
              size: "large",
              shape: "pill",
              width: computedWidth,
            });
          }

          // Trigger one-tap prompt for nice UX
          window.google.accounts.id.prompt();
        })
        .catch(console.error);
    };

    loadGoogle();

    return () => {
      active = false;
    };
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setFieldErrors({});

    const errors = {};
    if (!email) {
      errors.email = "Email Address is required.";
    } else if (!email.includes('@')) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      
      // Auto Scroll to the first error and focus related input
      const firstField = Object.keys(errors)[0];
      const element = document.getElementById(`login-${firstField}-input`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          element.focus();
        }, 150);
      }
      return;
    }

    setLoading(true);

    try {
      await login({ email, password });
      setSuccessMsg("Welcome! Secure session active.");
      setTimeout(() => {
        navigate(redirectUrl);
      }, 1000);
    } catch (err) {
      setErrorMsg(mapFriendlyFeedback(err));
      // Scroll to the top error alert box for quick reference
      const alertContainer = document.getElementById("login-error-alert-wrapper");
      if (alertContainer) {
        alertContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Demo driver fast login profiles
  const handleFastLogin = async (selectedEmail, selectedPassword) => {
    setEmail(selectedEmail);
    setPassword(selectedPassword);
    setErrorMsg('');
    setSuccessMsg('');
    setFieldErrors({});
    setLoading(true);
    try {
      await login({ email: selectedEmail, password: selectedPassword });
      setSuccessMsg("Welcome! Secure session active.");
      setTimeout(() => {
        navigate(redirectUrl);
      }, 1000);
    } catch (err) {
      setErrorMsg(mapFriendlyFeedback(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-4 sm:py-12 bg-gray-50/50" id="login-form-view">
      <div className="max-w-md w-full space-y-4 sm:space-y-6 bg-white p-5 sm:p-8 rounded-2xl border border-gray-150 shadow-sm relative">
        <div className="absolute top-4 right-4 text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Session Encrypted</span>
        </div>

        {/* Branding header */}
        <div className="text-center space-y-1">
          <div className="flex justify-center text-indigo-600 mb-2">
            <Car className="h-9 w-9 stroke-[2.5]" />
          </div>
          <h2 className="font-sans font-black text-2xl text-gray-950 tracking-tight leading-none">Welcome Back</h2>
          <p className="text-xs text-gray-500 font-sans">
            Access your driver account.
          </p>
        </div>

        {/* Global form error box */}
        {errorMsg && (
          <div id="login-error-alert-wrapper" className="bg-red-50 text-red-700 text-xs p-3.5 rounded-xl border border-red-100 font-medium">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 text-emerald-800 text-xs p-3.5 rounded-xl border border-emerald-100 font-semibold flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="login-email-input" className="block text-xs text-slate-500 font-bold mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                id="login-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) {
                    setFieldErrors(prev => ({ ...prev, email: '' }));
                  }
                }}
                placeholder="driver@example.com"
                className={`w-full text-xs pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  fieldErrors.email ? 'border-red-500 bg-red-50/10 focus:ring-red-500' : 'border-gray-250'
                }`}
              />
            </div>
            {fieldErrors.email && (
              <span className="text-[10px] text-red-600 font-medium mt-1 block px-1 animate-fade-in">{fieldErrors.email}</span>
            )}
          </div>

          <div>
            <label htmlFor="login-password-input" className="block text-xs text-slate-500 font-bold mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                id="login-password-input"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors(prev => ({ ...prev, password: '' }));
                  }
                }}
                placeholder="••••••••"
                className={`w-full text-xs pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  fieldErrors.password ? 'border-red-500 bg-red-50/10 focus:ring-red-500' : 'border-gray-250'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none flex items-center justify-center cursor-pointer"
                id="login-password-toggle-btn"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <span className="text-[10px] text-red-600 font-medium mt-1 block px-1 animate-fade-in">{fieldErrors.password}</span>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full font-bold py-3 shadow justify-center flex items-center"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </div>
        </form>

        {/* Real Google Sign-In button container wrapper */}
        <div className="border-t border-gray-150 pt-4 flex flex-col items-center space-y-2.5">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Or sign in with Google</span>
          
          <div className="flex justify-center w-full max-w-full overflow-hidden" id="login-google-btn-wrapper" style={{ minHeight: '44px' }}>
            <span className="text-xs text-slate-400 animate-pulse py-2">Loading Google Securing Services...</span>
          </div>
        </div>

        {/* Redirect sign up */}
        <div className="text-center text-xs text-gray-500 pt-2 pb-1">
          New to our fleet?{' '}
          <Link to="/signup" className="text-brand-primary font-bold hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}
