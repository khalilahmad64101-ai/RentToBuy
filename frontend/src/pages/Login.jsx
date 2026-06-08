import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Mail, Lock, Car, Sparkles, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';
import { useSEO } from '../hooks/useSEO';

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
                await googleLogin(response.credential);
                navigate(redirectUrl);
              } catch (err) {
                setErrorMsg(err?.message || "Google login failed");
              } finally {
                setLoading(false);
              }
            },
          });

          const container = document.getElementById("login-google-btn-wrapper");
          if (container) {
            window.google.accounts.id.renderButton(container, {
              theme: "outline",
              size: "large",
              shape: "pill",
              width: 320,
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
    setLoading(true);

    try {
      await login({ email, password });
      navigate(redirectUrl);
    } catch (err) {
      setErrorMsg(err.message || 'Credentials authentication failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  // Demo driver fast login profiles
  const handleFastLogin = async (selectedEmail, selectedPassword) => {
    setEmail(selectedEmail);
    setPassword(selectedPassword);
    setErrorMsg('');
    setLoading(true);
    try {
      await login({ email: selectedEmail, password: selectedPassword });
      navigate(redirectUrl);
    } catch (err) {
      setErrorMsg(err.message || 'Pre-load profiles validation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50" id="login-form-view">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-gray-150 shadow-sm relative">
        <div className="absolute top-4 right-4 text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Session Encrypted</span>
        </div>

        {/* Branding header */}
        <div className="text-center space-y-1">
          <div className="flex justify-center text-indigo-600 mb-2">
            <Car className="h-10 w-10 stroke-[2.5]" />
          </div>
          <h2 className="font-sans font-bold text-2xl text-gray-950 tracking-tight">Well Come Back</h2>
          <p className="text-xs text-gray-500 font-sans">
            Access your secure Rent2Buy driver workspace.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 text-xs p-3.5 rounded-xl border border-red-100 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 font-semibold mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="driver@example.com"
                className="w-full text-xs pl-10 pr-3 py-2.5 border border-gray-250 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-505"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 font-semibold mb-1">Pass Word</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-10 py-2.5 border border-gray-250 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-505"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none flex items-center justify-center"
                id="login-password-toggle-btn"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full font-bold py-2.5 shadow"
            >
              {loading ? 'Authenticating with core db...' : 'Sign In to Driver Workspace'}
            </Button>
          </div>
        </form>

        {/* Real Google Sign-In button container wrapper */}
        <div className="border-t border-gray-150 pt-4 flex flex-col items-center space-y-2.5">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Or sign in with Google</span>
          
          <div className="flex justify-center w-full" id="login-google-btn-wrapper" style={{ minHeight: '44px' }}>
            <span className="text-xs text-slate-400 animate-pulse py-2">Loading Google Securing Services...</span>
          </div>
        </div>

        {/* Fast login helpers */}
        <div className="border-t border-gray-100 pt-5 space-y-2">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block text-center">DEMO FAST PORTAL SESSIONS</span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleFastLogin('user@example.com', 'password123')}
              className="p-2 border border-brand-primary/20 rounded-lg bg-brand-primary/5 hover:bg-brand-primary/10 text-brand-secondary text-left font-sans text-[11px]"
            >
              <strong className="block text-brand-secondary font-extrabold pb-0.5">Lease Driver</strong>
              user@example.com
            </button>
            <button
              onClick={() => handleFastLogin('admin@example.com', 'admin123')}
              className="p-2 border border-amber-100 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-left font-sans text-[11px]"
            >
              <strong className="block text-amber-900 font-semibold">Fleet Underwriter</strong>
              admin@example.com
            </button>
          </div>
        </div>

        {/* Redirect sign up */}
        <div className="text-center text-xs text-gray-500 pt-2 pb-1">
          New to are fleet?{' '}
          <Link to="/signup" className="text-brand-primary font-bold hover:underline">
            Register your driver licence here
          </Link>
        </div>
      </div>
    </div>
  );
}
