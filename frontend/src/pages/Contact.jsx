import React, { useState } from 'react';
import { api } from '../services/api';
import { useSEO } from '../hooks/useSEO';

// Importing Modularized Sub-sections
import { HeroSection } from './contact/HeroSection';
import { InfoSection } from './contact/InfoSection';
import { FormSection } from './contact/FormSection';
import { WhyContactSection } from './contact/WhyContactSection';
import { MapSection } from './contact/MapSection';

export function Contact() {
  useSEO({
    title: 'Contact Us | Underwriting Desk & Support Operations | R2BuyCar',
    description: 'Get in touch with our Heathrow Underwriting operations team. Call us, email our support crew, or submit your direct questions regarding our rent-to-buy contracts.',
    keywords: 'R2BuyCar help desk, underwriter contact, car lease support team Manchester, rent to buy London phone number'
  });

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
      
      {/* 1. VIP Hero Section */}
      <HeroSection onSendMessageClick={() => scrollToSection('contact-form-section')} />

      {/* 2. Contact Information Section */}
      <InfoSection />

      {/* 3. Contact Form */}
      <FormSection 
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        phone={phone}
        setPhone={setPhone}
        subject={subject}
        setSubject={setSubject}
        msg={msg}
        setMsg={setMsg}
        loading={loading}
        error={error}
        success={success}
        handleSubmit={handleSubmit}
      />

      {/* 4. Why Contact Us */}
      <WhyContactSection scrollToSection={scrollToSection} />

      {/* 5. Google Map / Location Section */}
      <MapSection />

    </div>
  );
}
