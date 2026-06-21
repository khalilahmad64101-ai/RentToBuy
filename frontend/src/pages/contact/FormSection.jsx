import React from 'react';
import { CheckCircle, AlertCircle, Send } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function FormSection({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  subject,
  setSubject,
  msg,
  setMsg,
  loading,
  error,
  success,
  handleSubmit
}) {
  return (
    <section className="bg-slate-50 py-16 scroll-mt-6" id="contact-form-section">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-10 shadow-sm">
          <div className="text-center space-y-2 mb-8">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block font-mono">SECURE INTERACTIVE LINK</span>
            <h2 className="text-2xl font-black text-slate-950 tracking-tight">Send a Secure Inquiry</h2>
            <p className="text-xs text-gray-500 max-w-sm mx-auto font-light">
              Fill in the details below and our client coordinators will get back to you within 2 working hours.
            </p>
          </div>

          {success && (
            <div className="bg-emerald-50 text-emerald-700 p-4 border border-emerald-100 rounded-xl text-xs font-semibold mb-6 flex items-start space-x-2 animate-fade-in" id="contact-success-box">
              <CheckCircle className="w-4.5 h-4.5 shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <span>Message dispatched successfully!</span>
                <p className="text-[11px] text-emerald-650 mt-1 font-medium">An expert advisor will reply to your inquiry details shortly.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 p-4 border border-red-100 rounded-xl text-xs font-semibold mb-6 flex items-start space-x-2 animate-pulse" id="contact-error-box">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-650 mt-0.5" />
              <div>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full text-xs py-2.5 px-3 border border-gray-250 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full text-xs py-2.5 px-3 border border-gray-250 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 07758 313276"
                  className="w-full text-xs py-2.5 px-3 border border-gray-250 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Vehicle Rent-To-Buy Estimate"
                  className="w-full text-xs py-2.5 px-3 border border-gray-255 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 font-semibold mb-1">Message</label>
              <textarea
                required
                rows="4"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Details of your requested vehicle or questions about physical documentation verification..."
                className="w-full text-xs py-2.5 px-3 border border-gray-255 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>

            <div className="pt-2 text-center">
              <Button type="submit" variant="primary" disabled={loading} className="font-bold w-full uppercase tracking-wider text-xs py-3 justify-center flex items-center">
                <Send className="w-4 h-4 mr-1.5" />
                {loading ? 'Sending Message...' : 'Send Message'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
