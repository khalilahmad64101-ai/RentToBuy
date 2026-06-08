import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      if (scrolled > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-20 md:bottom-6 right-6 p-3 rounded-full bg-brand-secondary text-white shadow-xl hover:bg-brand-secondary-hover transition-all duration-250 z-40 md:z-50 animate-bounce focus:outline-none focus:ring-2 focus:ring-brand-secondary cursor-pointer hidden md:block"
      title="Back to top"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}
