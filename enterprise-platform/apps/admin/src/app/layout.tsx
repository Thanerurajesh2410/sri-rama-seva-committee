import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'శ్రీ రామాలయం ERP అడ్మిన్ పోర్టల్ | Temple Admin ERP',
  description: 'శ్రీ రామా సేవా కమిటీ పాలక మండలి అధికారిక ఎంటర్‌ప్రైజ్ ERP పోర్టల్'
};

export default function AdminLayout({
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
      <body className="admin-dark-bg text-amber-100 min-h-screen font-sans">
        <header className="bg-[#2A060B] border-b-2 border-[#FFD700] py-3.5 px-6 sticky top-0 z-50 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-amber-400 bg-amber-950 flex items-center justify-center text-lg font-black">
              👑
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-white heading-telugu">శ్రీ రామాలయం ERP అడ్మిన్ పోర్టల్</h1>
              <p className="text-xs text-amber-300 font-bold">శ్రీ రామా సేవా కమిటీ • పామినివాండ్లవూరు</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-black">
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-400/50 px-3 py-1 rounded-full">
              🛡️ ROLE: SUPER_ADMIN
            </span>
          </div>
        </header>

        <div className="flex min-h-[calc(100vh-73px)]">
          {/* Sidebar */}
          <aside className="w-64 bg-[#200407] border-r-2 border-amber-600/30 p-4 space-y-3 hidden md:block shrink-0">
            <nav className="space-y-2 text-sm font-black text-amber-200">
              <a href="/" className="block p-3 rounded-xl bg-amber-500/20 text-white border border-amber-400/40">
                📊 ఎగ్జిక్యూటివ్ డాష్‌బోర్డ్
              </a>
              <a href="/donations" className="block p-3 rounded-xl hover:bg-amber-950 hover:text-white border border-transparent">
                🧾 విరాళాలు & రశీదుల లేడ్జర్
              </a>
              <a href="/reconciliation" className="block p-3 rounded-xl hover:bg-amber-950 hover:text-white border border-transparent">
                💳 Razorpay పేమెంట్ రీకాన్సిలియేషన్
              </a>
              <a href="/audit" className="block p-3 rounded-xl hover:bg-amber-950 hover:text-white border border-transparent">
                📜 సిస్టమ్ ఆడిట్ లాగ్‌లు (Audit Logs)
              </a>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 sm:p-8 overflow-x-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
