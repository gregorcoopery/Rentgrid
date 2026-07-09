'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function GlobalBackground() {
  const pathname = usePathname();
  
  // Do not render on the homepage
  if (pathname === '/') {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80')`,
          filter: 'blur(28px) brightness(0.95)',
        }}
      />
      {/* Light mode / Dark mode responsive overlay */}
      <div className="absolute inset-0 bg-background/50 dark:bg-background/80" />
    </div>
  );
}
