import React, { useState } from 'react';
import { 
  Search, 
  FileText, 
  UploadCloud, 
  Key, 
  MapPin, 
  User, 
  ShieldCheck, 
  Calendar,
  UserCheck, 
  DollarSign, 
  TrendingUp,
  Gauge,
  Zap,
  Car
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

// Importing Modularized Sub-sections
import { HeroSection } from './HowItWorks/HeroSection';
import { ProcessSection } from './HowItWorks/ProcessSection';
import { DocumentsSection } from './HowItWorks/DocumentsSection';
import { WhyChooseSection } from './HowItWorks/WhyChooseSection';
import { CtaSection } from './HowItWorks/CtaSection';

export function HowItWorks() {
  useSEO({
    title: 'How It Works | No Credit Barrier Rent-to-Buy Steps | R2BuyCar',
    description: 'Understand the clear, step-by-step pathway from flexible car renting to full vehicle ownership. No strict bank score thresholds, no application feed burdens, plus complete road servicing covered.',
    keywords: 'how rent to buy works, hire purchase car, bad credit car lease UK, buycarz roadmap, R2BuyCar guide'
  });

  // Interactive timeline preview active step state (indexes 0 to 5)
  const [activeStep, setActiveStep] = useState(0);

  // SECTION 1 - The 6 Steps Dataset
  const processSteps = [
    {
      step: 'Step 1',
      title: 'Choose Your Budget',
      desc: 'Determine your realistic weekly contribution rate with our smart affordability features.',
      icon: DollarSign,
    },
    {
      step: 'Step 2',
      title: 'Browse Matching Vehicles',
      desc: 'Explore available fuel-efficient, high-spec hybrid and electric cars that fit your budget.',
      icon: Search,
    },
    {
      step: 'Step 3',
      title: 'Select Your Vehicle',
      desc: 'Pick your perfect vehicle and lock in pricing, features, and key specifications.',
      icon: Car,
    },
    {
      step: 'Step 4',
      title: 'Complete Your Application',
      desc: 'Submit your fast, secure digital application online to get fast response underwriting.',
      icon: FileText,
    },
    {
      step: 'Step 5',
      title: 'Upload Required Documents',
      desc: 'Securely upload clear digital copies of your DVLA driving license and basic identification documents.',
      icon: UploadCloud,
    },
    {
      step: 'Step 6',
      title: 'Get Approved & Collect Your Vehicle',
      desc: 'Sign your digital agreement, finalise your starter deposit, and collect your keys.',
      icon: Key,
    }
  ];

  // SECTION 2 - Required Documents Dataset
  const requiredDocs = [
    {
      title: 'Driving Licence Front',
      desc: 'A clear scan or color photo of the front of your valid photocard DVLA driving licence showing your name and photograph clearly.',
      icon: UserCheck
    },
    {
      title: 'Driving Licence Back',
      desc: 'A clear photo of the back of your DVLA driving licence card to check category approvals, restrictions, and expiry dates.',
      icon: FileText
    },
    {
      title: 'Selfie Verification Photo',
      desc: 'A quick digital selfie confirming your live face matches the valid photocard identification provided.',
      icon: User
    },
    {
      title: 'Proof of Address (if required)',
      desc: 'Utility bills (water, council tax, or electricity) or standard bank statements issued within the past 90 days.',
      icon: MapPin
    }
  ];

  // SECTION 3 - Why Choose Us Dataset
  const keyBenefits = [
    {
      title: 'No Large Upfront Cost',
      desc: 'Bypass hefty high-street hire purchase down payments. Pay a minimal initial deposit to secure your vehicle.',
      icon: DollarSign,
      color: 'bg-[#7CC242]/10 text-[#7CC242]'
    },
    {
      title: 'Flexible Weekly Payments',
      desc: 'Enjoy manageable, predictable weekly contributions directly debited and aligned with your driving schedule.',
      icon: Calendar,
      color: 'bg-indigo-50 text-[#1F3F7A]'
    },
    {
      title: 'Build Towards Ownership',
      desc: 'A structured, interest-free portion of every payment translates into real equity ownership over time.',
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: 'Suitable For Drivers With Limited Credit History',
      desc: 'We look at your current income stability, driving status, and identification — not past credit score metrics.',
      icon: ShieldCheck,
      color: 'bg-teal-50 text-teal-600'
    },
    {
      title: 'Road-Ready Vehicles',
      desc: 'Every vehicle is fully inspected, serviced, detailed, and thoroughly roadtested before handover.',
      icon: Gauge,
      color: 'bg-rose-50 text-rose-600'
    },
    {
      title: 'Fast Application Process',
      desc: 'Our administrative pipeline ensures verification and underwriting review results within 48 hours.',
      icon: Zap,
      color: 'bg-amber-50 text-amber-600'
    }
  ];

  const handleStartJourney = () => {
    const scrollDestination = document.getElementById('six-step-timeline-section');
    if (scrollDestination) {
      scrollDestination.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white min-h-screen pb-16 font-sans antialiased" id="how-it-works-page">
      {/* 1. HERO SECTION */}
      <HeroSection onStartClick={handleStartJourney} />

      {/* 2. PROCESS TIMELINE */}
      <ProcessSection 
        processSteps={processSteps}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      />

      {/* 3. REQUIRED DOCUMENTS */}
      <DocumentsSection requiredDocs={requiredDocs} />

      {/* 4. WHY CHOOSE RENT-TO-BUY */}
      <WhyChooseSection keyBenefits={keyBenefits} />

      {/* 5. READY TO GET STARTED CTA */}
      <CtaSection />
    </div>
  );
}
