import React from 'react';
import { Mail, Lock, Eye, EyeOff, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  loading,
  errorMsg,
  successMsg,
  fieldErrors,
  handleLoginSubmit,
  handleFastLogin
}) {
  return (
    <div className="max-w-md w-full space-y-4 sm:space-y-6 bg-white p-5 sm:p-8 rounded-2xl border border-gray-150 shadow-sm relative text-left">
      <div className="absolute top-4 right-4 text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center space-x-1">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Session Encrypted</span>
      </div>

      <div className="text-center space-y-1">
        <h2 className="font-sans font-black text-2xl text-gray-950 tracking-tight leading-none">Welcome Back</h2>
        <p className="text-xs text-gray-500 font-sans">
          Access your driver account.
        </p>
      </div>

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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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

      {/* Fast login helpers */}
      <div className="border-t border-gray-100 pt-4 space-y-2">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block text-center">DEMO SESSIONS</span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => handleFastLogin('user@example.com', 'password123')}
            className="p-2 border border-brand-primary/20 rounded-lg bg-brand-primary/5 hover:bg-brand-primary/10 text-brand-secondary text-left font-sans text-[11px] cursor-pointer"
          >
            <strong className="block text-brand-secondary font-extrabold pb-0.5">Lease Driver</strong>
            user@example.com
          </button>
          <button
            onClick={() => handleFastLogin('admin@example.com', 'admin123')}
            className="p-2 border border-amber-100 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-left font-sans text-[11px] cursor-pointer"
          >
            <strong className="block text-amber-900 font-semibold">Underwriter</strong>
            admin@example.com
          </button>
        </div>
      </div>
    </div>
  );
}
