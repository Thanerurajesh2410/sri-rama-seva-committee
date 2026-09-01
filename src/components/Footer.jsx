import React from 'react';
import { ArrowUp, Heart, Lock, Building2, MapPin, Mail, Phone, ShieldCheck } from 'lucide-react';
import { getAssetUrl, getActiveLogo } from '../v2/data/v2Database';

export default function Footer({ t, onOpenAdmin }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#1A0306] via-[#0F0204] to-[#050001] border-t-4 border-amber-500 pt-12 pb-8 text-white z-30">
      
      {/* Top Divine Slogan Banner Bar */}
      <div className="bg-gradient-to-r from-[#4A0E17] via-[#2A060B] to-[#4A0E17] border-y border-amber-500/50 py-3.5 px-4 text-center mb-10 shadow-lg">
        <p className="text-base sm:text-lg md:text-xl font-black text-amber-300 heading-telugu tracking-wide animate-pulse">
          {t.footer.slogan}
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          
          {/* Brand & Address Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={getActiveLogo()}
                alt="Sri Rama Seva Committee Logo"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getAssetUrl('assets/logo.jpg');
                }}
                className="w-13 h-13 rounded-full border-2 border-amber-400 object-cover shadow-lg bg-white p-0.5"
              />
              <div>
                <h3 className="text-lg font-black text-white heading-telugu leading-tight">{t.nav.title}</h3>
                <p className="text-xs text-amber-400 font-extrabold">{t.nav.subtitle}</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-bold">
              పామినివాండ్లవూరు గ్రామంలో శ్రీ రామాలయ నిర్మాణం మరియు ధార్మిక కార్యక్రమాల నిర్వహణకై ఏర్పడిన అధికారిక కమిటీ.
            </p>

            <div className="space-y-1.5 text-xs text-amber-200 font-bold bg-black/60 p-3.5 rounded-2xl border border-amber-500/30">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>పామినివాండ్లవూరు, మంగళపల్లె పం., బంగారుపాళెం మం., చిత్తూరు - 517416</span>
              </p>
              <p className="flex items-center gap-2 pt-1 border-t border-white/10">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>sriramasevacommitteepvv@gmail.com</span>
              </p>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-sm font-black text-amber-300 uppercase tracking-wider mb-4 border-b border-amber-500/40 pb-2 inline-block">
              ముఖ్యమైన లింకులు (Quick Links)
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-extrabold text-slate-200">
              <li>
                <a href="#home" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <span className="text-amber-400">➢</span> హోమ్ (Home)
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <span className="text-amber-400">➢</span> ఆలయ విశేషాలు (About Temple)
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <span className="text-amber-400">➢</span> ఆలయ ప్రగతి ఫోటోలు (Gallery)
                </a>
              </li>
              <li>
                <a href="#committee" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <span className="text-amber-400">➢</span> కమిటీ సభ్యులు (Committee Members)
                </a>
              </li>
              <li>
                <a href="#donations" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <span className="text-amber-400">➢</span> ఈ-హుండి / విరాళాలు (E-Hundi)
                </a>
              </li>
            </ul>
          </div>

          {/* SBI Bank Summary & Admin Portal Access Card */}
          <div className="bg-gradient-to-br from-[#2D080E] to-[#120204] border-2 border-amber-400/60 p-5 rounded-2xl shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  బ్యాంక్ వివరాలు (SBI Account)
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs sm:text-sm text-white font-black mb-1">Sri Rama Seva Committee Paminivandlavooru</p>
              <p className="text-xs sm:text-sm font-mono text-amber-300 font-black mb-1">A/C: 45274946370</p>
              <p className="text-xs font-mono text-gray-300 font-bold">IFSC: SBIN0005691 (State Bank of India)</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/15">
              {/* Admin Portal Button */}
              <button
                onClick={onOpenAdmin}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-black bg-black/70 text-amber-300 hover:bg-black border border-amber-400/50 flex items-center justify-center gap-2 transition-colors shadow"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>అడ్మిన్ పోర్టల్ (Admin Login)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Rights & Scroll to Top Bar */}
        <div className="pt-6 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-gray-300">
          <p className="text-center md:text-left">
            © 2026 {t.footer.rights}
          </p>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-[#4A0E17] text-amber-300 border border-amber-400 hover:bg-amber-500 hover:text-black transition-all shadow-xl"
            title="పైనకి వెళ్ళండి (Back to Top)"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>

    </footer>
  );
}
