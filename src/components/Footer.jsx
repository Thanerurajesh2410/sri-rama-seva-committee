import React from 'react';
import { ArrowUp, Heart, Lock } from 'lucide-react';
import { getAssetUrl, getActiveLogo } from '../v2/data/v2Database';

export default function Footer({ t, onOpenAdmin }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#2A060B] via-[#1D0407] to-[#0A0103] border-t-2 border-amber-500/60 pt-12 pb-8 text-gray-300">
      
      {/* Top Slogan Banner Bar */}
      <div className="bg-gradient-to-r from-[#5C121E] via-[#3A0A11] to-[#5C121E] border-y border-amber-500/50 py-4 px-4 text-center mb-12">
        <p className="text-base md:text-xl font-extrabold text-[#FFD700] heading-telugu tracking-wide animate-pulse">
          {t.footer.slogan}
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {/* Brand Col */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={getActiveLogo()}
                alt="Sri Rama Seva Committee Logo"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getAssetUrl('assets/logo.jpg');
                }}
                className="w-12 h-12 rounded-full border-2 border-amber-500 object-cover shadow-lg"
              />
              <div>
                <h3 className="text-lg font-black text-white heading-telugu">{t.nav.title}</h3>
                <p className="text-xs text-amber-500 font-bold">{t.nav.subtitle}</p>
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              పామినివాండ్లవూరు గ్రామంలో శ్రీ రామాలయ నిర్మాణం మరియు ధార్మిక కార్యక్రమాల నిర్వహణకై ఏర్పడిన అధికారిక కమిటీ.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-amber-500/40 pb-2 inline-block">
              ముఖ్యమైన లింకులు (Quick Links)
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-200">
              <li><a href="#home" className="hover:text-amber-400 transition-colors">హోమ్ (Home)</a></li>
              <li><a href="#about" className="hover:text-amber-400 transition-colors">ముఖ్య ఉద్దేశాలు (Objectives)</a></li>
              <li><a href="#gallery" className="hover:text-amber-400 transition-colors">ఆలయ ప్రగతి చిత్రాలు (Photos)</a></li>
              <li><a href="#committee" className="hover:text-amber-400 transition-colors">కమిటీ సభ్యులు (Office Bearers)</a></li>
              <li><a href="#donations" className="hover:text-amber-400 transition-colors">ఈ-హుండి / విరాళాలు (E-Hundi)</a></li>
            </ul>
          </div>

          {/* Bank Summary & Admin Portal Trigger (Dark background container for 100% text visibility without changing footer size) */}
          <div className="bg-[#1A0306] border-2 border-amber-500/50 rounded-2xl !p-5 flex flex-col justify-between shadow-xl">
            <div>
              <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-2">
                బ్యాంక్ వివరాలు (SBI Account)
              </h4>
              <p className="text-xs text-white font-bold mb-1">Sri Rama Seva Committee Paminivandlavooru</p>
              <p className="text-xs font-mono text-amber-200 mb-1 font-bold">A/C: 45274946370</p>
              <p className="text-xs font-mono text-amber-200 mb-3 font-bold">IFSC: SBIN0005691 (State Bank of India)</p>
            </div>

            <div className="space-y-2 mt-2">
              <a href="#donations" className="btn-gold w-full text-xs !py-1.5 justify-center flex items-center gap-1 font-bold">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>ఈ-హుండి విరాళం</span>
              </a>

              {/* Admin Portal Button */}
              <button
                onClick={onOpenAdmin}
                className="w-full py-1.5 px-3 rounded-full text-[11px] font-bold bg-black/60 text-amber-300 hover:bg-white/10 border border-white/20 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>అడ్మిన్ పోర్టల్ (Admin Login)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p className="text-center md:text-left font-bold text-gray-300">
            © 2026 {t.footer.rights}
          </p>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-[#5C121E] text-amber-400 border border-amber-500/50 hover:bg-amber-500 hover:text-black transition-all shadow-xl"
            title="పైనకి వెళ్ళండి (Back to Top)"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>

    </footer>
  );
}
