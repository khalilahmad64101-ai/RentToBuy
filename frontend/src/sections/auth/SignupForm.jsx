import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, ShieldCheck, AlertCircle, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function SignupForm({
  register,
  handleSubmit,
  onInvalidSubmit,
  errors,
  watchPassword,
  strength,
  showPassword,
  setShowPassword,
  loading,
  errorMsg,
  successMsg,
  handleSignupSubmit
}) {
  return (
    <div className="max-w-md w-full bg-white p-5 sm:p-8 rounded-2xl border border-gray-150 shadow-sm relative overflow-hidden text-left" id="signup-container-card">
      
      {/* GDPR Badge */}
      <div className="absolute top-4 right-4 text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider font-mono flex items-center space-x-1 uppercase">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>FCA Compliant</span>
      </div>

      <div className="text-center space-y-1 mb-5">
        <h2 className="font-sans font-black text-2xl text-gray-950 tracking-tight leading-none" id="signup-title">
          Create Driver Account
        </h2>
        <p className="text-xs text-gray-500 max-w-xs mx-auto text-center" id="signup-subtitle">
          Register to find your perfect Rent-to-Buy car.
        </p>
      </div>

      {errorMsg && (
        <div id="signup-error-alert-wrapper" className="bg-red-50 text-red-700 text-xs p-3.5 rounded-xl border border-red-100 font-medium mb-4 flex items-center gap-2" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-800 text-xs p-3.5 rounded-xl border border-emerald-100 font-semibold mb-4 flex items-center gap-2" role="alert">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* SIGNUP FORM */}
      <form onSubmit={handleSubmit(handleSignupSubmit, onInvalidSubmit)} className="space-y-4" id="signup-credentials-form" noValidate>
        
        {/* 1. Full Legal Name Input */}
        <div>
          <label htmlFor="signup-fullname-input" className="block text-xs text-slate-500 font-bold mb-1">Full Legal Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input
              type="text"
              id="signup-fullname-input"
              name="fullName"
              autoComplete="name"
              maxLength={50}
              {...register('fullName')}
              placeholder="Jane Doe"
              className={`w-full text-xs pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.fullName ? 'border-red-500 bg-red-50/10 focus:ring-red-500' : 'border-gray-250'
              }`}
            />
          </div>
          {errors.fullName && (
            <span id="fullName-error" className="text-[10px] text-red-600 font-medium mt-1 block px-1 animate-fade-in">{errors.fullName.message}</span>
          )}
        </div>

        {/* 2. Mobile Phone UK Number */}
        <div>
          <label htmlFor="signup-phone-input" className="block text-xs text-slate-500 font-bold mb-1">Mobile Phone (UK)</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input
              type="tel"
              id="signup-phone-input"
              name="phone"
              autoComplete="tel"
              maxLength={15}
              {...register('phone')}
              placeholder="07758313276"
              className={`w-full text-xs pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.phone ? 'border-red-500 bg-red-50/10 focus:ring-red-500' : 'border-gray-250'
              }`}
            />
          </div>
          {errors.phone ? (
            <span id="phone-error" className="text-[10px] text-red-600 font-medium mt-1 block px-1 animate-fade-in">{errors.phone.message}</span>
          ) : (
            <span className="text-[9px] text-gray-400 italic block mt-1 px-1">Must start with 07 or +447 followed by 9 digits</span>
          )}
        </div>

        {/* 3. Email Address Input */}
        <div>
          <label htmlFor="signup-email-input" className="block text-xs text-slate-500 font-bold mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input
              type="email"
              id="signup-email-input"
              name="email"
              autoComplete="email"
              maxLength={100}
              {...register('email')}
              placeholder="driver@r2buy.com"
              className={`w-full text-xs pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.email ? 'border-red-500 bg-red-50/10 focus:ring-red-500' : 'border-gray-250'
              }`}
            />
          </div>
          {errors.email && (
            <span id="email-error" className="text-[10px] text-red-600 font-medium mt-1 block px-1 animate-fade-in">{errors.email.message}</span>
          )}
        </div>

        {/* 4. Password Input */}
        <div>
          <label htmlFor="signup-password-input" className="block text-xs text-slate-500 font-bold mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input
              type={showPassword ? "text" : "password"}
              id="signup-password-input"
              name="password"
              autoComplete="new-password"
              maxLength={128}
              {...register('password')}
              placeholder="••••••••"
              className={`w-full text-xs pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
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

          {/* Password Strength Meter */}
          {watchPassword && (
            <div className="mt-2 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-gray-100 animate-fade-in text-left">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-gray-400 uppercase tracking-wider font-mono">Password strength</span>
                <span className={strength.textClass}>{strength.label.toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-gray-100 rounded overflow-hidden">
                {[1, 2, 3, 4].map((barIdx) => (
                  <div
                    key={barIdx}
                    className={`h-full transition-all duration-300 ${
                      strength.score >= barIdx ? strength.color : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                💡 Must be at least 6 characters. No complex symbols needed!
              </p>
            </div>
          )}
          {errors.password && (
            <span id="password-error" className="text-[10px] text-red-600 font-medium mt-1 block px-1 animate-fade-in">{errors.password.message}</span>
          )}
        </div>

        {/* 5. Terms and Privacy Policy Tickbox */}
        <div className="flex items-start gap-2 pt-1">
          <input
            type="checkbox"
            id="signup-agreement-checkbox"
            name="agreeTerms"
            {...register('agreeTerms')}
            className="mt-1 h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary cursor-pointer"
          />
          <label htmlFor="signup-agreement-checkbox" className="text-[11px] text-gray-500 leading-normal cursor-pointer select-none">
            I agree to the <Link to="/terms" className="text-indigo-600 font-semibold hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-indigo-600 font-semibold hover:underline">Privacy Policy</Link>.
          </label>
        </div>
        {errors.agreeTerms && (
          <span className="text-[10px] text-red-600 font-medium block px-1 animate-fade-in">{errors.agreeTerms.message}</span>
        )}

        {/* 7. Action Button Form Trigger */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            id="signup-submit-button"
            className="w-full font-bold py-3 shadow-md bg-slate-950 text-white hover:bg-slate-900 justify-center flex items-center cursor-pointer"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>
        
        {/* 8. Professional Google Auth Integration Panel */}
        <div className="border-t border-gray-150 pt-4 space-y-3">
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-400 font-bold text-[9px]">OR REGISTER WITH</span>
          </div>
          
          <div className="flex justify-center w-full max-w-full overflow-hidden" id="signup-google-btn-wrapper" style={{ minHeight: '44px' }}>
            <span className="text-xs text-slate-400 animate-pulse py-2">Loading Google Securing Services...</span>
          </div>
        </div>
      </form>
    </div>
  );
}
