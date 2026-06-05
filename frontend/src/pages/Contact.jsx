import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle, Send, HelpCircle, AlertCircle, Clock, ChevronRight, MessageSquare, Car, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [msg, setMsg] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // Pack the comprehensive payload cleanly
      const formattedMessage = `
Subject: ${subject}
Phone: ${phone}
---
Message: 
${msg}
      `.trim();
      
      await api.admin.submitInquiry({ name, email, msg: formattedMessage });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMsg('');
    } catch (err) {
      setError(err?.message || "Failed to submit inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-0 pb-16 animate-fade-in font-sans antialiased" id="contact-view">
      
      {/* 1. Bespoke Hero Section */}
      <section className="relative bg-[#080B12] text-white overflow-hidden py-20 lg:py-24 border-b border-gray-950" id="contact-hero">
        {/* Background Grids & Soft Radial Ambient Accents */}
        <div className="absolute inset-0 bg-[#080B12] bg-[linear-gradient(to_right,#1e293b26_1px,transparent_1px),linear-gradient(to_bottom,#1e293b26_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#CDA275]/5 pointer-events-none blur-[120px]"></div>
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-600/10 pointer-events-none blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="space-y-5 max-w-3xl mx-auto">
            {/* Top Badge */}
            <div className="inline-block text-[#CDA275] border border-[#CDA275]/20 bg-[#CDA275]/5 font-black text-[10.5px] tracking-[0.2em] px-4 py-1.5 rounded-md uppercase font-mono">
              GET IN TOUCH
            </div>

            {/* Main Title Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
              Contact R2Buy
            </h1>

            {/* Subheading */}
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-light">
              Have questions about our vehicles, applications, or rent-to-buy process? Our team is ready to assist you.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a
                href="tel:01613689635"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#CDA275] hover:bg-[#b88f63] text-[#080B12] font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 duration-200"
              >
                <Phone className="w-4 h-4" />
                Call Us
              </a>
              <button
                onClick={() => scrollToSection('contact-form-section')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-black text-xs uppercase tracking-wider rounded-xl transition-transform hover:-translate-y-0.5 duration-200 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Contact Information Section */}
      <section className="bg-white py-16 border-b border-gray-100" id="contact-info-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Side: Office Address, Contact Numbers, Email */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block font-mono mb-1">HQ Coordination</span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Our Office</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {/* Office Address Card */}
                <div className="bg-slate-50 border border-gray-150 rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-2.5 text-slate-800 mb-4 pb-3 border-b border-gray-200/60">
                    <MapPin className="w-5 h-5 text-[#CDA275]" />
                    <h3 className="font-extrabold text-sm text-slate-900 font-mono">Office Address</h3>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed font-light">
                    <strong className="block text-slate-900 font-extrabold text-sm mb-1">R2Buy.com</strong>
                    <span>Piccadilly Business Centre</span>
                    <span className="block">Aldow Enterprise Park</span>
                    <span className="block">Manchester</span>
                    <span className="block">M12 6AE</span>
                    <span className="block font-semibold text-slate-800">United Kingdom</span>
                  </div>
                </div>

                {/* Contact Numbers & Email Card */}
                <div className="bg-slate-50 border border-gray-150 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2.5 text-slate-800 mb-4 pb-3 border-b border-gray-200/60">
                      <Phone className="w-5 h-5 text-[#CDA275]" />
                      <h3 className="font-extrabold text-sm text-slate-900 font-mono">Contact Numbers</h3>
                    </div>
                    <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                      <div className="flex justify-between items-center bg-white px-3 py-1.5 rounded-lg border border-gray-100">
                        <span className="font-semibold text-slate-500">Landline:</span>
                        <a href="tel:01613689635" className="font-extrabold text-indigo-600 hover:underline">0161 368 9635</a>
                      </div>
                      <div className="flex justify-between items-center bg-white px-3 py-1.5 rounded-lg border border-gray-100">
                        <span className="font-semibold text-slate-500">Mobile:</span>
                        <a href="tel:07758313276" className="font-extrabold text-indigo-600 hover:underline">07758 313276</a>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-200/60">
                    <div className="flex items-center space-x-2.5 text-slate-850 mb-2">
                      <Mail className="w-4 h-4 text-[#CDA275]" />
                      <span className="font-extrabold text-xs text-slate-900 font-mono">Email Communications</span>
                    </div>
                    <div className="text-xs">
                      <a href="mailto:info@r2buy.com" className="font-black text-indigo-600 hover:underline">info@r2buy.com</a>
                      <span className="text-[9px] text-orange-600 block mt-1 font-mono italic">
                        (Placeholder — client se actual email confirm kar lena.)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Business Hours */}
            <div className="lg:col-span-5 bg-slate-950 text-white rounded-3xl p-8 shadow-xl border border-slate-850 relative overflow-hidden self-stretch flex flex-col justify-between">
              {/* Subtle backdrop mesh */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:16px_24px]"></div>
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center space-x-2 text-[#CDA275]">
                  <Clock className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest font-mono">Live Operations Timetable</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">Business Hours</h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Our professional Manchester dispatch desk is ready to organize your documents review and help coordinate vehicle pickups.
                </p>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <span className="text-xs text-slate-300 font-medium">Monday — Friday</span>
                    <span className="text-xs font-black text-white">9:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <span className="text-xs text-slate-300 font-medium">Saturday</span>
                    <span className="text-xs font-black text-[#CDA275]">10:00 AM – 4:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-450 font-medium">Sunday</span>
                    <span className="text-xs font-black text-red-400">Closed</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-8 pt-4 border-t border-white/5 text-[11px] text-slate-400 font-mono flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Nationwide UK service coordination support.</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Contact Form */}
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
                <Button type="submit" variant="primary" disabled={loading} className="font-bold w-full uppercase tracking-wider text-xs py-3">
                  <Send className="w-4 h-4 mr-1.5" />
                  {loading ? 'Sending Message...' : 'Send Message'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 4. Why Contact Us */}
      <section className="bg-white py-16 border-b border-gray-100" id="why-contact-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-[10px] font-black text-[#CDA275] uppercase tracking-widest block font-mono">ARE TEAM ATTENTION</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-none">
              Why Contact Us
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
              We guide you transparently through are complete fleet inventory and UK-wide underwriting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Vehicle Enquiries',
                desc: 'Get help finding the right vehicle for your needs. Choose from eco-friendly hybrids and premier comfort models.',
                colorClass: 'border-[#CDA275]'
              },
              {
                title: 'Application Support',
                desc: 'Need assistance with your application or documents? Are support agents verify uploaded files within hours.',
                colorClass: 'border-indigo-500'
              },
              {
                title: 'Customer Support',
                desc: 'Speak with our team for general enquiries, weekly payments configuration, or bespoke Northwest services guidance.',
                colorClass: 'border-slate-800'
              }
            ].map((card, idx) => (
              <div 
                key={idx} 
                className={`p-6 bg-slate-50 border-t-4 ${card.colorClass} border-x border-b border-gray-150 rounded-b-2xl rounded-t-lg transition-transform hover:-translate-y-1 duration-300 flex flex-col justify-between`}
              >
                <div className="space-y-2">
                  <h3 className="font-sans font-black text-sm text-slate-900">{card.title}</h3>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">{card.desc}</p>
                </div>
                <div className="pt-4 flex items-center text-indigo-600 text-xs font-semibold uppercase tracking-wider group cursor-pointer" onClick={() => scrollToSection('contact-form-section')}>
                  <span>Get support</span>
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Google Map / Location Section */}
      <section className="bg-slate-50 py-16" id="location-map">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block font-mono">VISIT US</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-none">
              Visit Our Office
            </h2>
            <p className="text-xs text-gray-500 font-light">
              We are situated at Piccadilly Business Centre, Aldow Enterprise Park, Manchester, M12 6AE.
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-sm border border-gray-150">
            {/* Embedded interactive Google Map focused precisely on Aldow Enterprise Park Manchester */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2374.8870197771727!2d-2.2132338!3d53.4704981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487bb19460dfbf31%3A0xe5c165fdecda3c8d!2sPiccadilly%20Business%20Centre!5e0!3m2!1sen!2suk!4v1717142400000!5m2!1sen!2suk" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="R2Buy Piccadilly Business Centre Manchester Map Location"
              className="w-full h-[400px] sm:h-[450px]"
            ></iframe>
          </div>
        </div>
      </section>

    </div>
  );
}
