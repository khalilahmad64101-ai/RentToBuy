import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car } from 'lucide-react';
import { api } from '../services/api';
import { useSEO } from '../hooks/useSEO';
import { mapFriendlyFeedback } from '../utils/feedbackHelper.js';

// Reusable auth section import
import { LoginForm } from '../sections/auth/LoginForm';

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
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-4 sm:py-12 bg-gray-50/50" id="login-form-view">
      <div className="flex justify-center text-indigo-600 mb-4 h-9">
        <Car className="h-9 w-9 stroke-[2.5]" />
      </div>

      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        loading={loading}
        errorMsg={errorMsg}
        successMsg={successMsg}
        fieldErrors={fieldErrors}
        handleLoginSubmit={handleLoginSubmit}
        handleFastLogin={handleFastLogin}
      />

      {/* Redirect sign up */}
      <div className="text-center text-xs text-slate-500 pt-4 pb-1">
        New to our fleet?{' '}
        <Link to="/signup" className="text-[#7CC242] font-semibold hover:underline">
          Register your driver license
        </Link>
      </div>
    </div>
  );
}
