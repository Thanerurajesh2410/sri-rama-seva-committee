import React, { useState, useEffect, useRef } from 'react';
import { User, LogIn, UserPlus, History, Award, Bell, ShieldCheck, Heart, Download, CheckCircle2, AlertCircle, Calendar, Plus, Mail, Phone, MapPin, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { getDB, saveDB, validateUniqueDevotee, addAuditLog, getAssetUrl, getActiveLogo } from '../data/v2Database';

export default function DevoteePortal({ t, showToast }) {
  const [db, setDbState] = useState(getDB());
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  // Devotee Authentication State
  const [loggedInDevotee, setLoggedInDevotee] = useState(null);
  
  // Devotee Selected Receipt State for Modal View & Download
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const receiptModalRef = useRef(null);

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regPass, setRegPass] = useState('');
  const [validationError, setValidationError] = useState('');

  // Login Form State
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Devotee Dashboard Sub-tab State
  const [activeTab, setActiveTab] = useState('history');

  // Book Seva Form State
  const [bookSevaName, setBookSevaName] = useState('నిత్య పంచామృత అభిషేకం');
  const [bookSevaDate, setBookSevaDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookSevaAmt, setBookSevaAmt] = useState(501);

  useEffect(() => {
    setDbState(getDB());
  }, []);

  // Download Receipt PDF Function (Auto-scaled to fit A4 page completely without bottom cutoff)
  const downloadReceiptPDF = async () => {
    if (!receiptModalRef.current || !selectedReceipt) return;
    showToast("రశీదు PDF డౌన్‌లోడ్ ప్రారంభమైంది...");
    try {
      const element = receiptModalRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1200
      });
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const margin = 8;
      const maxPdfWidth = pageWidth - (margin * 2);
      const maxPdfHeight = pageHeight - (margin * 2);
      
      let imgWidth = maxPdfWidth;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      if (imgHeight > maxPdfHeight) {
        imgHeight = maxPdfHeight;
        imgWidth = (canvas.width * imgHeight) / canvas.height;
      }
      
      const xOffset = (pageWidth - imgWidth) / 2;
      const yOffset = margin;
      
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
      pdf.save(`SRI_RAMA_SEVA_RECEIPT_${selectedReceipt.id || 'DONATION'}.pdf`);
      showToast("రశీదు PDF విజయవంతంగా డౌన్‌లోడ్ చేయబడింది!");
    } catch (err) {
      console.error("PDF generation error:", err);
      showToast("PDF డౌన్‌లోడ్‌లో లోపం జరిగింది.");
    }
  };

  // Handle Registration with Unique Phone & Email Validation
  const handleRegister = (e) => {
    e.preventDefault();
    setValidationError('');

    // Validate Unique Phone & Email
    const check = validateUniqueDevotee(regPhone, regEmail);
    if (!check.valid) {
      setValidationError(check.message);
      showToast(check.message);
      return;
    }

    const currentDB = getDB();
    const newDevotee = {
      id: 'DEV-' + Math.floor(1000 + Math.random() * 9000),
      name: regName,
      phone: regPhone,
      email: regEmail,
      city: regCity || 'పామినివాండ్లవూరు',
      registeredAt: new Date().toLocaleDateString('te-IN')
    };

    currentDB.devotees.push(newDevotee);
    saveDB(currentDB);
    setDbState(currentDB);
    addAuditLog(regName, `New Devotee Registered (${regPhone}, ${regEmail})`);

    setLoggedInDevotee(newDevotee);
    showToast("భక్తుడి నమోదు విజయవంతంగా పూర్తయింది!");
    setRegName('');
    setRegPhone('');
    setRegEmail('');
    setRegCity('');
    setRegPass('');
  };

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    setValidationError('');

    const currentDB = getDB();
    const cleanPhone = loginPhone.trim().replace(/\D/g, '');
    const found = currentDB.devotees.find(d => d.phone.replace(/\D/g, '') === cleanPhone);

    if (found) {
      setLoggedInDevotee(found);
      addAuditLog(found.name, `Devotee Logged In (${found.phone})`);
      showToast(`నమస్కారం ${found.name}! పోర్టల్‌లోకి విజయవంతంగా లాగిన్ అయ్యారు.`);
    } else {
      setValidationError("ఈ ఫోన్ నంబర్‌తో ఏ భక్తుడి ఖాతా కనుగొనబడలేదు. దయచేసి ముందస్తుగా సైన్ అప్ చేయండి.");
    }
  };

  // Handle Seva Booking
  const handleBookSevaSubmit = (e) => {
    e.preventDefault();
    if (!loggedInDevotee) return;

    const currentDB = getDB();
    const newBooking = {
      id: 'SEVA-' + Math.floor(1000 + Math.random() * 9000),
      devoteeName: loggedInDevotee.name,
      phone: loggedInDevotee.phone,
      sevaName: bookSevaName,
      date: bookSevaDate,
      amount: bookSevaAmt,
      status: 'Confirmed'
    };

    currentDB.sevaBookings.push(newBooking);
    saveDB(currentDB);
    setDbState(currentDB);
    addAuditLog(loggedInDevotee.name, `Booked Seva: ${bookSevaName} on ${bookSevaDate}`);

    showToast(`${bookSevaName} సేవ విజయవంతంగా బుక్ కాబడింది!`);
  };

  // Devotee Specific Donations List
  const devoteeDonations = db.donations.filter(
    d => loggedInDevotee && (d.phone.replace(/\D/g, '') === loggedInDevotee.phone.replace(/\D/g, '') || d.donorName.toLowerCase().includes(loggedInDevotee.name.toLowerCase()))
  );

  // Devotee Specific Seva Bookings List
  const devoteeSevas = db.sevaBookings.filter(
    s => loggedInDevotee && s.phone.replace(/\D/g, '') === loggedInDevotee.phone.replace(/\D/g, '')
  );

  return (
    <div className="bg-[#090914] text-white min-h-screen py-8 sacred-temple-bg-masked">
      <div className="w-full px-4 md:px-8 lg:px-12 max-w-full">
        
        {/* Top Portal Badge Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs md:text-sm font-black bg-[#5C121E] text-[#FFD700] border-2 border-[#FFD700] shadow-lg mb-3">
            <User className="w-4 h-4 text-amber-300" />
            <span>🚩 పామినివాండ్లవూరు శ్రీ రామాలయం - భక్తుల అధికారిక డిజిటల్ పోర్టల్</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 heading-telugu leading-tight">
            <span className="heading-gold">భక్తుల డిజిటల్ సేవల నమోదు & పారదర్శకత పోర్టల్</span>
          </h2>
        </div>

        {/* 🔒 Devotee Authentication Popup Card (Enlarged Divine God Photo Screen) */}
        {!loggedInDevotee ? (
          <div className="my-6 flex justify-center items-center">
            <div className="gold-card max-w-2xl md:max-w-3xl w-full !p-8 md:!p-12 border-4 border-[#FFD700] text-center shadow-[0_0_60px_rgba(255,215,0,0.45)] relative overflow-hidden bg-gradient-to-b from-[#4A0E17]/95 via-[#2D080E]/95 to-[#1A0306]/98 rounded-3xl">
              
              {/* Background God Photo Watermark Overlay */}
              <div
                className="absolute inset-0 opacity-30 bg-cover bg-center pointer-events-none"
                style={{ backgroundImage: `url('${getAssetUrl('assets/temple_bg.jpg')}')` }}
              />

              {/* Divine God Photo Emblem Header */}
              <div className="relative z-10 mb-6 flex flex-col items-center">
                <div className="relative mb-3 group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#FFD700] via-[#FF9933] to-[#FFD700] rounded-full blur-md opacity-85 group-hover:opacity-100 transition duration-500 animate-pulse" />
                  <img
                    src={getActiveLogo()}
                    alt="Sri Rama Seva Committee Official Logo"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getAssetUrl('assets/logo.jpg');
                    }}
                    className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#FFD700] shadow-2xl object-cover bg-[#1A0306] p-0.5 ring-4 ring-[#FFD700]/60"
                  />
                  <div className="absolute -bottom-2 right-0 bg-[#5C121E] text-sky-400 p-2 rounded-full border-2 border-[#FFD700] shadow-lg">
                    <User className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl md:text-3xl font-black text-white heading-telugu mb-1">
                  భక్తుల ఖాతా సైన్ ఇన్ & నమోదు
                </h3>
                <p className="text-xs md:text-sm text-amber-300 font-bold max-w-lg mx-auto">
                  మీ రశీదులు తనిఖీ చేయడానికి, సేవలు బుక్ చేయడానికి & డిజిటల్ సర్టిఫికెట్లు పొందడానికి సైన్ ఇన్ చేయండి
                </p>
              </div>

              {/* Toggle Auth Mode Buttons */}
              <div className="relative z-10 flex rounded-2xl bg-black/70 p-1.5 border-2 border-[#FFD700]/60 mb-6 max-w-md mx-auto shadow-inner">
                <button
                  onClick={() => { setAuthMode('login'); setValidationError(''); }}
                  className={`flex-1 py-3 text-sm md:text-base font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
                    authMode === 'login' ? 'bg-[#5C121E] text-[#FFD700] border border-[#FFD700] shadow-lg' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <LogIn className="w-4 h-4 text-amber-300" />
                  <span>సైన్ ఇన్ (Sign In)</span>
                </button>
                <button
                  onClick={() => { setAuthMode('register'); setValidationError(''); }}
                  className={`flex-1 py-3 text-sm md:text-base font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
                    authMode === 'register' ? 'bg-[#5C121E] text-[#FFD700] border border-[#FFD700] shadow-lg' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-4 h-4 text-sky-400" />
                  <span>క్రొత్త ఖాతా (Register)</span>
                </button>
              </div>

              {validationError && (
                <div className="relative z-10 mb-6 p-3.5 rounded-2xl bg-red-950/90 border border-red-500 text-xs md:text-sm font-bold text-red-300 flex items-start justify-center gap-2 max-w-md mx-auto animate-bounce">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* 1. Devotee Login Form */}
              {authMode === 'login' ? (
                <form onSubmit={handleLogin} className="relative z-10 space-y-5 max-w-md mx-auto text-left">
                  <div>
                    <label className="block text-xs md:text-sm font-black text-amber-200 mb-1.5 uppercase">
                      నమోదైన ఫోన్ నంబర్ (Registered Phone Number) *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="ఉదా: 9866125609"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        className="w-full bg-[#1A0306]/90 border-2 border-[#FFD700] rounded-2xl py-3.5 px-4 pl-12 text-base md:text-lg text-amber-300 focus:outline-none focus:ring-4 focus:ring-[#FFD700]/40 font-mono font-bold"
                      />
                      <Phone className="w-5 h-5 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <button type="submit" className="btn-gold w-full py-4 text-base md:text-xl font-black shadow-2xl rounded-2xl border-2 border-yellow-200 transform hover:scale-[1.02] active:scale-95 transition-all">
                    <span>✨ పోర్టల్‌లోకి ప్రవేశించండి (Login Now)</span>
                  </button>
                </form>
              ) : (
                /* 2. Devotee Registration Form with Unique Phone & Email Validation */
                <form onSubmit={handleRegister} className="relative z-10 space-y-4 max-w-md mx-auto text-left">
                  <div>
                    <label className="block text-xs md:text-sm font-black text-amber-200 mb-1 uppercase">భక్తుడి పూర్తి పేరు (Full Name) *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="మీ పూర్తి పేరు"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full bg-[#1A0306]/90 border-2 border-[#FFD700] rounded-2xl py-3 px-4 pl-11 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] font-bold"
                      />
                      <User className="w-5 h-5 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-black text-amber-200 mb-1 uppercase">ఫోన్ నంబర్ (Unique Phone) *</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="ఉదా: 9866125609"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full bg-[#1A0306]/90 border-2 border-[#FFD700] rounded-2xl py-3 px-4 pl-11 text-sm md:text-base text-amber-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700] font-mono font-bold"
                      />
                      <Phone className="w-5 h-5 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-black text-amber-200 mb-1 uppercase">ఇమెయిల్ అడ్రస్ (Unique Email) *</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="ఉదా: devotee@gmail.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full bg-[#1A0306]/90 border-2 border-[#FFD700] rounded-2xl py-3 px-4 pl-11 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] font-bold"
                      />
                      <Mail className="w-5 h-5 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-black text-amber-200 mb-1 uppercase">గ్రామం / ఊరు (City / Village)</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="పామినివాండ్లవూరు"
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        className="w-full bg-[#1A0306]/90 border-2 border-white/30 rounded-2xl py-3 px-4 pl-11 text-sm md:text-base text-white focus:outline-none focus:border-[#FFD700] font-bold"
                      />
                      <MapPin className="w-5 h-5 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary w-full py-3.5 text-base md:text-lg font-black shadow-2xl rounded-2xl border-2 border-amber-300 transform hover:scale-[1.02] active:scale-95 transition-all">
                    <span>+ భక్తుడి ఖాతా సృష్టించండి (Register Account)</span>
                  </button>
                </form>
              )}

            </div>
          </div>
        ) : (
          /* Devotee Logged In Customer Dashboard */
          <div className="space-y-6 animate-fadeIn">
            
            {/* Devotee Profile Summary Header */}
            <div className="gold-card border-2 border-sky-400/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-sky-950 text-sky-300 border border-sky-400">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-white heading-telugu">{loggedInDevotee.name}</h3>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                      VERIFIED DEVOTEE ({loggedInDevotee.id})
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 font-mono mt-0.5">
                    📱 {loggedInDevotee.phone} | ✉️ {loggedInDevotee.email} | 📍 {loggedInDevotee.city}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setLoggedInDevotee(null)}
                className="px-4 py-1.5 rounded-full text-xs font-bold bg-red-600/30 text-red-300 border border-red-500/40 hover:bg-red-600 hover:text-white transition-colors"
              >
                లాగౌట్ (Logout)
              </button>
            </div>

            {/* Dashboard Sub-Tabs Bar - Font Size 20px */}
            <div className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-4 text-[20px] font-black">
              <button
                onClick={() => setActiveTab('history')}
                className={`px-5 py-3 rounded-2xl transition-all flex items-center gap-2 ${
                  activeTab === 'history' ? 'bg-[#5C121E] text-[#FFD700] border-2 border-[#FFD700] font-black shadow-xl scale-105' : 'bg-white/10 text-gray-200 hover:bg-white/20'
                }`}
              >
                <History className="w-5 h-5 text-amber-300" />
                <span>విరాళాల చరిత్ర ({devoteeDonations.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('book-seva')}
                className={`px-5 py-3 rounded-2xl transition-all flex items-center gap-2 ${
                  activeTab === 'book-seva' ? 'bg-[#5C121E] text-[#FFD700] border-2 border-[#FFD700] font-black shadow-xl scale-105' : 'bg-white/10 text-gray-200 hover:bg-white/20'
                }`}
              >
                <Calendar className="w-5 h-5 text-amber-300" />
                <span>సేవ బుకింగ్ (Book Seva)</span>
              </button>

              <button
                onClick={() => setActiveTab('booked-sevas')}
                className={`px-5 py-3 rounded-2xl transition-all flex items-center gap-2 ${
                  activeTab === 'booked-sevas' ? 'bg-[#5C121E] text-[#FFD700] border-2 border-[#FFD700] font-black shadow-xl scale-105' : 'bg-white/10 text-gray-200 hover:bg-white/20'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>బుక్ చేసిన సేవలు ({devoteeSevas.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('certificates')}
                className={`px-5 py-3 rounded-2xl transition-all flex items-center gap-2 ${
                  activeTab === 'certificates' ? 'bg-[#5C121E] text-[#FFD700] border-2 border-[#FFD700] font-black shadow-xl scale-105' : 'bg-white/10 text-gray-200 hover:bg-white/20'
                }`}
              >
                <Award className="w-5 h-5 text-amber-300" />
                <span>ధృవీకరణ పత్రాలు (Certificates)</span>
              </button>
            </div>

            {/* TAB 1: Donation History Log */}
            {activeTab === 'history' && (
              <div className="gold-card space-y-4">
                <h4 className="text-base font-bold text-[#FFD700] flex items-center gap-2">
                  <History className="w-5 h-5 text-amber-400" />
                  <span>మీ శ్రీ రామ ఈ-హుండి & నిర్మాణ విరాళాల రికార్డు</span>
                </h4>

                {devoteeDonations.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">
                    ఇప్పటివరకు ఏమీ విరాళాలు నమోదు కాబడలేదు. మీరు ఈ-హుండి ద్వారా విరాళం సమర్పించవచ్చు.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {devoteeDonations.map((d, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-black/60 border border-[#FFD700]/40 text-xs sm:text-sm">
                        <div>
                          <span className="font-mono text-amber-300 font-bold block">{d.id}</span>
                          <span className="font-black text-white text-base block my-0.5">{d.seva}</span>
                          <span className="text-gray-300 block">{d.date} • {d.mode}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono block">₹ {typeof d.amount === 'number' ? d.amount.toLocaleString() : d.amount}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedReceipt(d)}
                            className="btn-gold text-xs py-1.5 px-3.5 rounded-xl font-bold inline-flex items-center gap-1.5 mt-2 shadow-md"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>రశీదు చూడండి & డౌన్‌లోడ్</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Book Seva Form */}
            {activeTab === 'book-seva' && (
              <div className="gold-card space-y-4">
                <h4 className="text-base font-bold text-[#FFD700] flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <span>శ్రీ రామాలయ నిత్య & విశేష సేవ బుకింగ్ (Book Seva)</span>
                </h4>

                <form onSubmit={handleBookSevaSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">సేవా విభాగం ఎంచుకోండి *</label>
                      <select
                        value={bookSevaName}
                        onChange={(e) => setBookSevaName(e.target.value)}
                        className="w-full bg-[#1A0306] border border-white/20 rounded-xl p-2.5 text-xs text-amber-300 font-bold"
                      >
                        <option value="శ్రీ రామ అష్టోత్తర శతనామావళి అర్చన">శ్రీ రామ అష్టోత్తర శతనామావళి అర్చన (₹ 108)</option>
                        <option value="నిత్య పంచామృత అభిషేకం">నిత్య పంచామృత అభిషేకం (₹ 501)</option>
                        <option value="పవిత్ర దీపారాధన & అలంకార సేవ">పవిత్ర దీపారాధన & అలంకార సేవ (₹ 1,008)</option>
                        <option value="స్వామివారి పట్టు వస్త్రముల సేవ">స్వామివారి పట్టు వస్త్రముల సేవ (₹ 2,500)</option>
                        <option value="శ్రీ సీతారామ కల్యాణోత్సవం & ఊంజల్ సేవ">శ్రీ సీతారామ కల్యాణోత్సవం (₹ 5,008)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">సేవా తేదీ (Select Date) *</label>
                      <input
                        type="date"
                        required
                        value={bookSevaDate}
                        onChange={(e) => setBookSevaDate(e.target.value)}
                        className="w-full bg-[#1A0306] border border-white/20 rounded-xl p-2.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-gold w-full py-2.5 text-xs font-extrabold shadow-xl">
                    + సేవ బుక్ చేయండి (Confirm Seva Booking)
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: Booked Sevas List */}
            {activeTab === 'booked-sevas' && (
              <div className="gold-card space-y-4">
                <h4 className="text-base font-bold text-[#FFD700]">మీరు బుక్ చేసిన ఆలయ సేవలు</h4>
                {devoteeSevas.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">ఇప్పటివరకు ఏమీ సేవలు బుక్ చేయబడలేదు.</p>
                ) : (
                  <div className="space-y-3">
                    {devoteeSevas.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-black/50 border border-white/10 text-xs">
                        <div>
                          <span className="font-mono text-sky-300 font-bold block">{s.id}</span>
                          <span className="font-bold text-white text-sm">{s.sevaName}</span>
                          <span className="text-gray-400 block font-mono">తేదీ: {s.date}</span>
                        </div>
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3 py-1 rounded-full font-bold">
                          {s.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Certificates */}
            {activeTab === 'certificates' && (
              <div className="gold-card space-y-4">
                <h4 className="text-base font-bold text-[#FFD700]">ఆలయ నిర్మాణ భాగస్వామ్య సర్టిఫికేట్</h4>
                <div className="bg-[#FFFDF0] text-[#2D080E] p-6 rounded-2xl border-4 border-[#FFD700] text-center space-y-3">
                  <Award className="w-12 h-12 text-amber-600 mx-auto" />
                  <h3 className="text-xl font-black heading-telugu text-[#5C121E]">శ్రీ రామా సేవా ప్రశంసా పురస్కారము</h3>
                  <p className="text-xs font-bold text-amber-900 leading-relaxed">
                    శ్రీ రామాలయ రాతి గోడల నిర్మాణ పవిత్ర యజ్ఞంలో తమ అమూల్యమైన కానుకతో భాగస్వాములైనందుకు భక్తులు <span className="font-black underline">{loggedInDevotee.name}</span> గారికి అందజేయు దివ్య ప్రశంసా పత్రము.
                  </p>
                  <button onClick={() => showToast("సర్టిఫికేట్ PDF డౌన్‌లోడ్ చేయబడింది!")} className="btn-gold text-xs py-2 px-4 inline-flex items-center gap-1">
                    <Download className="w-4 h-4" /> సర్టిఫికేట్ డౌన్‌లోడ్ చేయండి
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* 📄 FORMAL TTD-STYLE DEVOTEE RECEIPT MODAL WITH WATERMARK */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-gradient-to-b from-[#4A0E17] via-[#2A060B] to-[#1A0306] border-4 border-[#FFD700] p-6 sm:p-8 rounded-3xl max-w-2xl w-full max-h-[94vh] overflow-y-auto shadow-2xl relative text-white space-y-6">
            
            <button
              type="button"
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-red-600 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <span className="bg-emerald-500 text-black font-black text-xs uppercase px-4 py-1 rounded-full shadow-lg inline-block mb-2">
                ✓ ధృవీకరించబడిన డిజిటల్ రశీదు
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#FFD700] heading-telugu">శ్రీ రామాలయం అధికారిక విరాళం రశీదు</h3>
            </div>

            {/* Rendered Printable Formal TTD-Style Receipt Card with Watermark */}
            <div ref={receiptModalRef} className="bg-white text-black p-6 sm:p-8 rounded-xl border-2 border-gray-800 shadow-2xl relative overflow-hidden font-sans">
              
              {/* Watermark Background Layer - Official Temple Logo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.14] z-0">
                <div className="text-center">
                  <img
                    src={getActiveLogo()}
                    alt="Sri Rama Seva Committee Logo Watermark"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getAssetUrl('assets/logo.jpg');
                    }}
                    className="w-72 h-72 sm:w-80 sm:h-80 mx-auto rounded-full object-cover border-4 border-amber-600/40 shadow-2xl"
                  />
                  <span className="text-3xl sm:text-4xl font-black uppercase text-[#5C121E] tracking-widest block mt-2">SRI RAMA SEVA COMMITTEE</span>
                  <span className="text-xl font-black text-amber-900 block mt-0.5">పామినివాండ్లవూరు</span>
                </div>
              </div>

              {/* Header Section */}
              <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <img
                    src={getActiveLogo()}
                    alt="Logo"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getAssetUrl('assets/logo.jpg');
                    }}
                    className="w-16 h-16 rounded-full border-2 border-amber-600 shadow-md"
                  />
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-[#5C121E] heading-telugu">శ్రీ రామా సేవా కమిటీ (SRI RAMA SEVA COMMITTEE)</h3>
                    <p className="text-xs font-bold text-gray-700">పామినివాండ్లవూరు • మంగళపల్లె పంచాయతీ • బంగారుపాళెం మండలం</p>
                    <p className="text-[11px] font-semibold text-gray-600">చిత్తూరు జిల్లా - 517416, ఆంధ్రప్రదేశ్, భారతదేశం</p>
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  <span className="text-[11px] font-bold text-gray-600 block">రశీదు సంఖ్య (Receipt No):</span>
                  <span className="text-sm sm:text-base font-mono font-black text-[#5C121E] bg-gray-100 px-3 py-1 rounded border border-gray-400 inline-block">{selectedReceipt.id || selectedReceipt.receiptNo}</span>
                </div>
              </div>

              {/* Receipt Title Badge */}
              <div className="text-center mb-4 relative z-10">
                <h4 className="text-base sm:text-lg font-black text-[#5C121E] uppercase tracking-wide underline decoration-amber-600 underline-offset-4 heading-telugu">
                  శ్రీ రామాలయం విరాళం రశీదు / Official Donation Receipt
                </h4>
              </div>

              {/* TTD-Style Crisp Grid Table */}
              <div className="border-2 border-gray-800 text-xs sm:text-sm mb-4 relative z-10 bg-white/90">
                <div className="grid grid-cols-3 border-b border-gray-400">
                  <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">దాత ఐడీ (Donor ID):</div>
                  <div className="p-2.5 font-mono font-black col-span-2 text-gray-900">{selectedReceipt.id || selectedReceipt.receiptNo}</div>
                </div>

                <div className="grid grid-cols-3 border-b border-gray-400">
                  <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">తేదీ & సమయం (Date & Time):</div>
                  <div className="p-2.5 font-mono font-bold col-span-2 text-gray-900">{selectedReceipt.date || new Date().toLocaleDateString('te-IN')}</div>
                </div>

                <div className="grid grid-cols-3 border-b border-gray-400">
                  <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">ఆలయ ట్రస్ట్ పేరు (Trust Name):</div>
                  <div className="p-2.5 font-bold col-span-2 text-[#5C121E]">SRI RAMA SEVA COMMITTEE PAMINIVANDLAVOORU</div>
                </div>

                <div className="grid grid-cols-3 border-b border-gray-400 bg-amber-50">
                  <div className="p-2.5 font-black bg-amber-100 border-r border-gray-400 text-sm sm:text-base text-[#5C121E]">విరాళం కానుక మొత్తం (Donation Amount):</div>
                  <div className="p-2.5 font-mono font-black text-lg text-emerald-800 col-span-2">Rs. {(typeof selectedReceipt.amount === 'number' ? selectedReceipt.amount : parseInt(String(selectedReceipt.amount).replace(/\D/g, '')) || 0).toLocaleString()} /-</div>
                </div>

                <div className="grid grid-cols-3 border-b border-gray-400">
                  <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">దాత పేరు (Primary Donor Name):</div>
                  <div className="p-2.5 font-black text-base col-span-2 text-gray-900">{selectedReceipt.donorName || selectedReceipt.name || loggedInDevotee?.name}</div>
                </div>

                <div className="grid grid-cols-3 border-b border-gray-400">
                  <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">ఫోన్ నంబర్ (Phone No):</div>
                  <div className="p-2.5 font-mono font-bold col-span-2 text-gray-800">{selectedReceipt.phone || loggedInDevotee?.phone || '9866125609'}</div>
                </div>

                <div className="grid grid-cols-3 border-b border-gray-400">
                  <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">గ్రామం / ఊరు (Village / City):</div>
                  <div className="p-2.5 font-bold col-span-2 text-gray-900">{selectedReceipt.city || loggedInDevotee?.city || 'పామినివాండ్లవూరు'}</div>
                </div>

                <div className="grid grid-cols-3 border-b border-gray-400">
                  <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">విరాళం విభాగం & సేవ (Category & Seva):</div>
                  <div className="p-2.5 font-bold col-span-2 text-[#5C121E]">{selectedReceipt.seva || 'రాతి గోడల నిర్మాణం'}</div>
                </div>

                <div className="grid grid-cols-3">
                  <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">చెల్లింపు మార్గం (Payment Mode):</div>
                  <div className="p-2.5 font-bold col-span-2 text-sky-800">{selectedReceipt.mode || 'PhonePe Standee QR / UPI'}</div>
                </div>
              </div>

              {/* Important Information Box (TTD Format) */}
              <div className="border border-red-800 bg-red-50/70 p-3 rounded text-[11px] text-red-950 mb-4 space-y-1 relative z-10">
                <p className="font-bold text-red-900 border-b border-red-300 pb-1">Important Information to the Donor:</p>
                <p>1. Sri Ramalayam construction donations are strictly utilized for temple stone wall work, sanctum sanctorum, and religious rituals.</p>
                <p>2. This receipt is automatically recorded in the official Sri Rama Seva Committee ERP audit ledger.</p>
                <p>3. For further information or donation queries, please contact Sri Rama Seva Committee at +91 9866125609.</p>
              </div>

              {/* Signatures & Note */}
              <div className="flex justify-between items-end text-[11px] font-bold text-gray-700 pt-2 relative z-10">
                <div>
                  <p className="text-gray-500 italic">NOTE: This is an electronically generated document and does not require a physical signature.</p>
                </div>
                <div className="text-right border-t border-gray-800 pt-1">
                  <p className="font-black text-[#5C121E] text-xs">Executive Committee</p>
                  <p className="font-bold text-gray-800">Sri Rama Seva Committee, Paminivandlavooru</p>
                </div>
              </div>

            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={downloadReceiptPDF} className="btn-primary text-sm py-3.5 px-6 w-full rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl">
                <Download className="w-5 h-5" />
                <span>రశీదు PDF డౌన్‌లోడ్ చేసుకోండి (Download Official Receipt PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
