import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'శ్రీ రామాలయం పామినివాండ్లవూరు | Sri Rama Temple Paminivandla Vooru',
  description: 'అధికారిక శ్రీ రామాలయ నిర్మాణ ప్రాంగణం & ఈ-హుండి విరాళాల పోర్టల్. పామినివాండ్లవూరు, బంగారుపాళెం మండలం, చిత్తూరు జిల్లా.',
  keywords: ['Sri Ramalayam', 'Paminivandlavooru', 'Bangarupalem', 'Chittoor Temple', 'Sri Rama Seva Committee', 'E-Hundi', 'Temple Construction'],
  openGraph: {
    title: 'శ్రీ రామా సేవా కమిటీ పామినివాండ్లవూరు',
    description: 'శ్రీ సీతారాములవారి దివ్య ఆలయ నిర్మాణంలో భాగస్వాములుకండి.',
    url: 'https://thanerurajesh2410.github.io/sri-rama-seva-committee/',
    siteName: 'Sri Rama Seva Committee',
    locale: 'te_IN',
    type: 'website'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="te">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;700;900&family=Ramabhadra&display=swap" rel="stylesheet" />
      </head>
      <body className="sacred-temple-bg text-amber-100 min-h-screen font-sans">
        <header className="bg-[#2A060B] border-b-2 border-[#FFD700] py-3 px-4 sticky top-0 z-50 shadow-2xl">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-amber-400 bg-amber-950 flex items-center justify-center font-black text-amber-300 text-xl shadow-lg">
                🚩
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-black text-white heading-telugu">శ్రీ రామా సేవా కమిటీ</h1>
                <p className="text-xs text-amber-300 font-bold">పామినివాండ్లవూరు • బంగారుపాళెం మండలం</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-black text-amber-200">
              <a href="/" className="hover:text-white transition">హోమ్</a>
              <a href="/about" className="hover:text-white transition">ఆలయ విశేషాలు</a>
              <a href="/donations" className="hover:text-white transition">ఈ-హుండి</a>
              <a href="/gallery" className="hover:text-white transition">గ్యాలరీ</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-[#1A0306] border-t-2 border-amber-600/40 py-8 px-4 text-center text-xs text-amber-200/80">
          <p>© 2026 Sri Rama Seva Committee, Paminivandlavooru. Regd Society under AP Societies Registration Act.</p>
        </footer>
      </body>
    </html>
  );
}
