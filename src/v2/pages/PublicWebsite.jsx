import React, { useState, useEffect, useRef } from 'react';
import { Building2, Heart, Calendar, FileText, Camera, ShieldCheck, MapPin, Mail, MessageSquare, Phone, CheckCircle2, ChevronRight, Award, DollarSign, Wallet, Users, Sparkles, Send, Download, FileCheck, Layers, Info, Bell, TrendingUp, CheckCircle, Database, ChevronLeft, Copy, Check, QrCode, Crown, UserCheck, UserPlus, Coins, User, X, Printer, CreditCard, ArrowRight, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { getDB, saveDB, addAuditLog, getAssetUrl, getActiveLogo, getActiveQrCode } from '../data/v2Database';

const slideshowImages = [
  { id: 1, src: getAssetUrl('assets/temple_photo_1.png'), title: 'శ్రీ రామాలయ శంకుస్థాపన పవిత్ర రాతి స్తంభాల పూజ', tag: 'పామినివాండ్లవూరు శంకుస్థాపన' },
  { id: 2, src: getAssetUrl('assets/temple_photo_2.png'), title: 'గ్రామస్థులు & భక్తుల సమక్షంలో ఆలయ పునాది పూజా మహోత్సవం', tag: 'పవిత్ర శంకుస్థాపన మహోత్సవం' },
  { id: 3, src: getAssetUrl('assets/temple_photo_3.png'), title: 'రాతి గోడల ఆలయ శంకుస్థాపన పునాది నిర్మాణం', tag: 'ఆలయ పునాది ప్రగతి' },
  { id: 4, src: getAssetUrl('assets/temple_photo_4.png'), title: 'అలంకరించిన టేకు కలప ప్రధాన ద్వారబంధం', tag: 'ఆలయ ద్వారబంధం' },
  { id: 5, src: getAssetUrl('assets/temple_photo_5.png'), title: 'పునాది గుంటలో పవిత్ర రాతి రాళ్ళ ప్రతిష్ఠాపన పూజ', tag: 'గర్భగుడి శంకుస్థాపన' },
  { id: 6, src: getAssetUrl('assets/temple_photo_6.png'), title: 'ఆలయ పెద్దలు & భక్తుల పవిత్ర దర్శన దృశ్యం', tag: 'పామినివాండ్లవూరు గ్రామస్థులు' },
  { id: 7, src: getAssetUrl('assets/temple_photo_7.png'), title: 'శ్రీ రామాలయ ప్రాంగణం & చెక్కిన రాతి నిర్మాణం', tag: 'ఆలయ ప్రాంగణ ప్రగతి' },
  { id: 8, src: getAssetUrl('assets/temple_photo_8.png'), title: 'శ్రీ రామాలయ రాతి గోడలు & ద్వార బంధాల అమరిక', tag: 'రాతి గోడల నిర్మాణం' },
  { id: 9, src: getAssetUrl('assets/temple_photo_9.png'), title: 'గర్భగుడి అంతర్భాగం & చెక్కిన రాతి గోడలు', tag: 'గర్భగుడి నిర్మాణం' },
  { id: 10, src: getAssetUrl('assets/temple_photo_10.png'), title: 'శ్రీ రామాలయ పవిత్ర రాతి నిర్మాణం పూర్తయిన దృశ్యం', tag: 'ఆలయ రాతి నిర్మాణం' }
];

export default function PublicWebsite({ t, v2T, showToast, subSection, setSubSection }) {
  const [activeTab, setActiveTab] = useState(subSection || 'home');
  const [donorVerifyId, setDonorVerifyId] = useState('');
  const [verifiedResult, setVerifiedResult] = useState(null);

  // Dynamic Database Settings & Images from Admin
  const currentDB = getDB();
  const websiteSettings = currentDB.websiteSettings || {};
  const activeGalleryImages = Array.isArray(currentDB.galleryImages) ? currentDB.galleryImages : slideshowImages;
  
  // Slideshow State
  const [slideIdx, setSlideIdx] = useState(0);

  // Auto-play slideshow timer
  useEffect(() => {
    if (activeGalleryImages.length === 0) return;
    const timer = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % activeGalleryImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeGalleryImages.length]);

  // WhatsApp Contact Form State
  const [waName, setWaName] = useState('');
  const [waPhone, setWaPhone] = useState('');
  const [waCity, setWaCity] = useState('');
  const [waMsg, setWaMsg] = useState('');

  // Dropdown Donation Selection State
  const [selectedCatId, setSelectedCatId] = useState('cat-1');
  const [selectedSubCat, setSelectedSubCat] = useState('');

  // Copy State for Bank Details
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Payment Gateway Modal & Digital Receipt Modal State
  const [showPaymentGatewayModal, setShowPaymentGatewayModal] = useState(false);
  const [payName, setPayName] = useState('');
  const [payPhone, setPayPhone] = useState('');
  const [payCity, setPayCity] = useState('');
  const [payAmount, setPayAmount] = useState('1116');
  const [payMode, setPayMode] = useState('PhonePe / UPI Direct');
  const [digitalReceipt, setDigitalReceipt] = useState(null);
  const receiptModalRef = useRef(null);

  const bankSectionRef = useRef(null);

  // Complete Payment & Save Donation for Audit & Receipt
  const handleCompleteDonationPayment = (e) => {
    e.preventDefault();
    if (!payName || !payAmount) {
      showToast("దయచేసి మీ పేరు మరియు విరాళం మొత్తం నమోదు చేయండి.");
      return;
    }

    const currentDB = getDB();
    if (!currentDB.donations) currentDB.donations = [];
    if (!currentDB.auditLogs) currentDB.auditLogs = [];

    const numAmount = parseInt(String(payAmount).replace(/\D/g, '')) || 0;
    const catObj = v2T.donationCategories.find(c => c.id === selectedCatId) || v2T.donationCategories[0];
    const subCatName = selectedSubCat || (availableSubTypes[0] || 'సాధారణ విరాళం');

    const newDonation = {
      id: 'SRS-2026-' + String(currentDB.donations.length + 1).padStart(3, '0'),
      donorName: payName,
      phone: payPhone || '9866125609',
      email: 'sriramasevacommitteepvv@gmail.com',
      amount: numAmount,
      date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      seva: `${catObj.name} > ${subCatName}`,
      category: catObj.name,
      subcategory: subCatName,
      mode: payMode || 'PhonePe / UPI Online',
      city: payCity || 'పామినివాండ్లవూరు'
    };

    currentDB.donations.unshift(newDonation);
    currentDB.auditLogs.unshift({
      id: 'LOG-' + (currentDB.auditLogs.length + 1),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'Devotee Portal',
      action: `Online E-Hundi Donation Received: ₹${numAmount} for [${catObj.name} > ${subCatName}] by ${payName}`
    });

    saveDB(currentDB);
    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (err) {}
    
    setDigitalReceipt(newDonation);
    setShowPaymentGatewayModal(false);
    showToast(`ధన్యవాదాలు శ్రీ ${payName} గారూ! మీ ₹ ${numAmount.toLocaleString()} విరాళం నమోదైంది.`);
  };

  // Download PDF Receipt
  // Download PDF Receipt (Auto-scaled to fit A4 page completely without bottom cutoff)
  const downloadDigitalReceiptPDF = async () => {
    if (!receiptModalRef.current || !digitalReceipt) return;
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
      pdf.save(`SRI_RAMA_SEVA_RECEIPT_${digitalReceipt.id}.pdf`);
      showToast("రశీదు PDF విజయవంతంగా డౌన్‌లోడ్ చేయబడింది!");
    } catch (err) {
      console.error("PDF download error:", err);
      showToast("PDF డౌన్‌లోడ్‌లో లోపం జరిగింది.");
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'account') {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2500);
    } else if (type === 'ifsc') {
      setCopiedIfsc(true);
      setTimeout(() => setCopiedIfsc(false), 2500);
    } else if (type === 'upi') {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    }
    showToast("కాపీ చేయబడింది: " + text);
  };

  const handleSendWhatsAppForm = (e) => {
    e.preventDefault();
    if (!waName || !waMsg) {
      showToast("దయచేసి మీ పేరు మరియు సందేశం నమోదు చేయండి.");
      return;
    }
    const text = encodeURIComponent(
      `జై శ్రీరామ్!\n\n` +
      `పేరు: ${waName}\n` +
      `ఫోన్: ${waPhone || 'N/A'}\n` +
      `గ్రామం: ${waCity || 'పామినివాండ్లవూరు'}\n` +
      `సందేశం: ${waMsg}`
    );
    window.open(`https://wa.me/919866125609?text=${text}`, '_blank');
    showToast("WhatsApp సందేశం తెరవబడింది!");
    setWaName('');
    setWaPhone('');
    setWaCity('');
    setWaMsg('');
  };

  const scrollToBank = () => {
    if (bankSectionRef.current) {
      bankSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectedCategoryObj = v2T.donationCategories.find(c => c.id === selectedCatId) || v2T.donationCategories[0];
  const availableSubTypes = selectedCategoryObj ? selectedCategoryObj.subTypes : [];

  const navTabs = [
    { id: 'home', label: 'హోమ్ (Home)', show: true },
    { id: 'about', label: 'ఆలయ విశేషాలు (About)', show: websiteSettings.showAbout !== false },
    { id: 'donations', label: 'ఈ-హుండి & వర్గాలు (Donations)', show: websiteSettings.showDonations !== false },
    { id: 'committee', label: 'కమిటీ సభ్యులు (Committee)', show: websiteSettings.showCommittee !== false },
    { id: 'terms', label: '📜 నిబంధనలు (Terms)', show: websiteSettings.showTerms !== false },
    { id: 'events', label: 'ఉత్సవాలు (Events)', show: websiteSettings.showEvents !== false },
    { id: 'gallery', label: 'చిత్రావళి (Gallery)', show: websiteSettings.showGallery !== false },
    { id: 'news', label: 'వార్తలు (News)', show: websiteSettings.showNews !== false },
    { id: 'reports', label: 'పారదర్శకత (Reports)', show: websiteSettings.showReports !== false },
    { id: 'contact', label: 'సంప్రదించండి (Contact)', show: websiteSettings.showContact !== false }
  ].filter(tab => tab.show);

  const dbDonationsList = currentDB.donations || [];
  const dbExpensesList = currentDB.expenses || [];

  const totalDonationsReceived = dbDonationsList.reduce((acc, curr) => {
    const num = typeof curr.amount === 'number' ? curr.amount : parseInt(String(curr.amount).replace(/\D/g, '')) || 0;
    return acc + num;
  }, 0);

  const totalExpensesUtilized = dbExpensesList.reduce((acc, curr) => {
    const num = typeof curr.amount === 'number' ? curr.amount : parseInt(String(curr.amount).replace(/\D/g, '')) || 0;
    return acc + num;
  }, 0);

  const netBalance = totalDonationsReceived - totalExpensesUtilized;

  const juneDonations = dbDonationsList.filter(d => String(d.date).includes('06-2026') || String(d.date).includes('June'));
  const julyDonations = dbDonationsList.filter(d => String(d.date).includes('07-2026') || String(d.date).includes('July'));

  const juneSum = juneDonations.reduce((acc, curr) => acc + (typeof curr.amount === 'number' ? curr.amount : parseInt(String(curr.amount).replace(/\D/g, '')) || 0), 0);
  const julySum = julyDonations.reduce((acc, curr) => acc + (typeof curr.amount === 'number' ? curr.amount : parseInt(String(curr.amount).replace(/\D/g, '')) || 0), 0);

  const safeSlideIdx = slideIdx % (activeGalleryImages.length || 1);

  return (
    <div className="text-slate-900 min-h-screen sacred-temple-bg-masked">
      
      {/* Sub-Navigation Menu Bar */}
      <div className="bg-white/95 border-b border-slate-200 sticky top-[73px] z-40 backdrop-blur-md overflow-x-auto scrollbar-none py-2.5 px-3 shadow-xs">
        <div className="flex items-center justify-start gap-2.5 md:gap-3 whitespace-nowrap text-sm sm:text-base md:text-lg font-black px-2">
          {navTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); if (setSubSection) setSubSection(tab.id); }}
              className={`px-4 sm:px-5 py-2 rounded-full transition-all border shrink-0 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-500 shadow-sm scale-105 font-black'
                  : 'bg-slate-100/90 text-slate-700 border-slate-200 hover:bg-amber-50 hover:text-amber-800 font-extrabold'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. HOME SUB-SECTION */}
      {activeTab === 'home' && (
        <div className="space-y-10 animate-fadeIn">
          
          <div className="container mx-auto px-4 py-4 relative z-10">
            {/* Hero Header Section with Divine Lord Rama Emblem */}
            <div className="text-center max-w-4xl mx-auto py-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs md:text-sm font-black bg-amber-100 text-amber-900 border border-amber-300 shadow-xs mb-4">
                <span>🚩 {t.hero.badge}</span>
              </div>

              {/* Lord Rama Divine Portrait Emblem */}
              <div className="flex justify-center my-4">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition duration-700 animate-pulse" />
                  <img
                    src={getActiveLogo()}
                    alt="Lord Rama Portrait"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getAssetUrl('assets/logo.jpg');
                    }}
                    className="relative w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-amber-500 shadow-[0_0_30px_rgba(217,119,6,0.25)] object-cover bg-white"
                  />
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-800 to-orange-900 text-amber-100 border border-amber-400 px-4 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>॥ జై శ్రీ రామ్ ॥</span>
                  </div>
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-black heading-telugu leading-tight mb-2 text-slate-900">
                <span className="heading-gold">{t.hero.title}</span>
              </h1>
              <p className="text-lg md:text-xl font-extrabold text-amber-800 heading-telugu mb-6">
                "{t.hero.slogan}"
              </p>
            </div>
          </div>

          {/* 📸 80% SCREEN SIZE TEMPLE SLIDESHOW BANNER WITH HIGH CONTRAST PHOTO CAPTIONS */}
          {websiteSettings.showSlideshow !== false && activeGalleryImages.length > 0 && (
            <div className="w-[92%] md:w-[80%] max-w-6xl mx-auto shadow-2xl bg-black rounded-3xl border-4 border-[#FFD700] overflow-hidden group my-6 relative">
              <div className="relative h-[340px] sm:h-[460px] md:h-[540px] lg:h-[600px] w-full">
                {/* Blurred Background Backdrop for Full Aspect Ratio Fill */}
                <div
                  className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-50 scale-110 pointer-events-none"
                  style={{ backgroundImage: `url('${activeGalleryImages[safeSlideIdx].src}')` }}
                />

                {/* Uncropped Image Display */}
                <img
                  src={activeGalleryImages[safeSlideIdx].src}
                  alt={activeGalleryImages[safeSlideIdx].title}
                  className="relative z-10 w-full h-full object-contain object-center transition-all duration-700"
                />
                
                {/* Text & Photo Information Bar Overlay (High Contrast & Clear) */}
                <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-5 sm:p-8 md:p-10 pointer-events-none pb-12 sm:pb-14">
                  <div className="max-w-4xl mx-auto w-full pointer-events-auto space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs sm:text-sm font-black text-[#FFD700] bg-[#5C121E] px-4 py-1 rounded-full border border-[#FFD700] shadow-md">
                        🚩 {activeGalleryImages[safeSlideIdx].tag || 'ఆలయ ప్రగతి ఫోటో'}
                      </span>
                      <span className="text-xs sm:text-sm font-mono font-black text-amber-300 bg-black/90 px-3.5 py-1 rounded-full border border-amber-400/50">
                        {safeSlideIdx + 1} / {activeGalleryImages.length}
                      </span>
                    </div>
                    
                    <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-white heading-telugu leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
                      {activeGalleryImages[safeSlideIdx].title}
                    </h2>
                  </div>
                </div>

                {/* Slideshow Navigation Arrows */}
                <button
                  onClick={() => setSlideIdx((prev) => (prev === 0 ? activeGalleryImages.length - 1 : prev - 1))}
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-4 rounded-full bg-black/80 text-[#FFD700] hover:bg-[#5C121E] border-2 border-[#FFD700] transition-transform hover:scale-110 shadow-2xl"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
                </button>
                <button
                  onClick={() => setSlideIdx((prev) => (prev + 1) % activeGalleryImages.length)}
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-4 rounded-full bg-black/80 text-[#FFD700] hover:bg-[#5C121E] border-2 border-[#FFD700] transition-transform hover:scale-110 shadow-2xl"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
                </button>

                {/* Slide Position Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex justify-center items-center gap-2 z-30">
                  {activeGalleryImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSlideIdx(idx)}
                      className={`h-2.5 rounded-full transition-all ${
                        idx === safeSlideIdx ? 'w-8 bg-[#FFD700] shadow-[0_0_12px_#FFD700]' : 'w-2.5 bg-white/50 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="container mx-auto px-4 pb-8 relative z-10">
            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button onClick={() => { setActiveTab('donations'); setShowPaymentGatewayModal(true); }} className="btn-primary px-7 py-4 text-lg font-black shadow-[0_0_35px_rgba(230,81,0,0.8)] border-2 border-amber-300 rounded-2xl">
                <Wallet className="w-6 h-6 text-yellow-300" />
                <span>ఈ-హుండి ద్వారా విరాళం సమర్పించండి</span>
              </button>
              <button onClick={() => setActiveTab('committee')} className="btn-outline px-7 py-4 text-lg font-black rounded-2xl">
                <Users className="w-6 h-6 text-amber-300" />
                <span>కమిటీ సభ్యుల వివరాలు</span>
              </button>
            </div>

            {/* 🚩 PhonePe QR Scanner & Bank Transfer Card with Copy Functionality */}
            <div ref={bankSectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              
              {/* E-Hundi & QR Scanner Card */}
              <div className="gold-card border border-amber-500/40 shadow-xl bg-gradient-to-br from-[#4A0E17] via-[#2A060B] to-[#1A0306] text-white flex flex-col justify-between !p-6 sm:!p-8 rounded-3xl">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-950 bg-amber-300 px-3.5 py-1 rounded-full shadow-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 fill-amber-950 text-amber-950" />
                      ఈ-హుండి (E-HUNDI)
                    </span>
                    <span className="text-xs sm:text-sm font-black text-amber-300">100% SECURE & DIRECT</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white heading-telugu mb-3">
                    PhonePe & UPI E-Hundi Scanner
                  </h3>

                  <p className="text-sm sm:text-base text-gray-200 mb-6 leading-relaxed font-semibold">
                    {t.donation.scanQr}
                  </p>

                  <div className="bg-black/50 p-5 rounded-2xl border border-amber-500/40 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left shadow-lg">
                    <img
                      src={getActiveQrCode()}
                      alt="PhonePe QR Scanner"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getAssetUrl('assets/phonepe_qr.png');
                      }}
                      className="w-36 h-36 rounded-xl object-contain bg-white p-1.5 border border-amber-400 shadow-lg cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setShowQrModal(true)}
                    />

                    <div>
                      <h4 className="text-base sm:text-lg font-black text-white mb-1.5 leading-snug">
                        SRI RAMA SEVA COMMITTEE PAMINIVANDLAVOORU
                      </h4>
                      <p className="text-sm sm:text-base font-mono text-amber-300 font-black mb-3">
                        UPI ID: {t.donation.upiId}
                      </p>

                      <button
                        onClick={() => copyToClipboard(t.donation.upiId, 'upi')}
                        className="btn-gold text-xs sm:text-sm !py-2 !px-4 rounded-xl font-bold"
                      >
                        {copiedUpi ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedUpi ? "UPI ID కాపీ అయింది" : "UPI ID కాపీ చేయి"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-white/15 flex justify-center">
                  <button
                    onClick={() => setShowQrModal(true)}
                    className="btn-primary text-sm sm:text-base w-full py-3.5 shadow-lg flex items-center justify-center gap-2.5 font-black rounded-2xl"
                  >
                    <QrCode className="w-5 h-5" />
                    <span>QR కోడ్ జూమ్ చేసి స్కాన్ చేయండి (Open Scanner)</span>
                  </button>
                </div>
              </div>

              {/* Direct SBI Bank Account Transfer Card */}
              <div className="gold-card border border-amber-500/40 bg-gradient-to-br from-[#4A0E17] via-[#2A060B] to-[#1A0306] text-white flex flex-col justify-between !p-6 sm:!p-8 rounded-3xl shadow-xl">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-300 bg-black/50 px-3.5 py-1.5 rounded-full border border-amber-500/40 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-amber-300" />
                      BANK TRANSFER
                    </span>
                    <span className="text-xs sm:text-sm font-black text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> SBI Official Account
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white heading-telugu mb-4">
                    {t.donation.bankTitle}
                  </h3>

                  <div className="space-y-4">
                    {/* Account Name */}
                    <div className="bg-black/60 p-4 rounded-2xl border border-white/15">
                      <span className="text-xs font-black text-amber-300 uppercase tracking-wider block mb-0.5">ఖాతా పేరు (Account Name)</span>
                      <span className="text-base sm:text-lg font-black text-white font-mono">{t.donation.accountName}</span>
                    </div>

                    {/* Account Number */}
                    <div className="bg-black/60 p-4 rounded-2xl border-2 border-[#FFD700]/60 flex items-center justify-between shadow-inner">
                      <div>
                        <span className="text-xs font-black text-amber-300 uppercase tracking-wider block mb-0.5">ఖాతా సంఖ్య (Account Number)</span>
                        <span className="text-xl sm:text-2xl lg:text-3xl font-black text-[var(--primary-gold)] font-mono">{t.donation.accountNo}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(t.donation.accountNo, 'account')}
                        className="p-3 rounded-xl bg-white/10 text-amber-300 hover:bg-white/20 transition-colors"
                        title="Account Number Copy"
                      >
                        {copiedAccount ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* IFSC Code */}
                    <div className="bg-black/60 p-4 rounded-2xl border border-white/15 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-amber-300 uppercase tracking-wider block mb-0.5">IFSC కోడ్</span>
                        <span className="text-lg sm:text-xl font-black text-white font-mono">{t.donation.ifsc}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(t.donation.ifsc, 'ifsc')}
                        className="p-3 rounded-xl bg-white/10 text-amber-300 hover:bg-white/20 transition-colors"
                        title="IFSC Code Copy"
                      >
                        {copiedIfsc ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Bank & Branch */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-black/60 p-3.5 rounded-2xl border border-white/15">
                        <span className="text-gray-400 block text-xs font-bold">బ్యాంక్ పేరు</span>
                        <span className="font-extrabold text-white text-base">{t.donation.bankName}</span>
                      </div>
                      <div className="bg-black/60 p-3.5 rounded-2xl border border-white/15">
                        <span className="text-gray-400 block text-xs font-bold">బ్రాంచ్</span>
                        <span className="font-extrabold text-white text-base">{t.donation.branch}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-white/15 text-center">
                  <p className="text-sm sm:text-base text-amber-200 font-extrabold">
                    గూగుల్ పే / ఫోన్‌పే / పేటీఎం / నెట్ బ్యాంకింగ్ ద్వారా నేరుగా జమ చేయవచ్చు.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

        {/* 2. ABOUT TEMPLE SUB-SECTION */}
        {activeTab === 'about' && (
          <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
            <div className="text-center mb-8">
              <span className="section-tag text-sm sm:text-base font-black px-5 py-2">ఆలయ విశేషాలు</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black heading-telugu mt-3 text-slate-900">
                <span className="heading-gold">శ్రీ రామాలయం పామినివాండ్లవూరు - చరిత్ర & వివరాలు</span>
              </h2>
            </div>

            <div className="gold-card space-y-6 text-base sm:text-lg leading-relaxed text-gray-100 bg-[#5C121E]/95 border-3 border-amber-400/80 !p-8 rounded-3xl shadow-2xl">
              <h3 className="text-2xl sm:text-3xl font-black text-[#FFD700] heading-telugu">ఆలయ చరిత్ర (History)</h3>
              <p className="font-bold">
                చిత్తూరు జిల్లా బంగారుపాళెం మండలం మంగళపల్లె పంచాయతీ పరిధిలోని పామినివాండ్లవూరు గ్రామంలో గ్రామస్థులందరి ఏకోపితి సంకల్పంతో ఈ పవిత్ర రాతి గోడల శ్రీ రామాలయ శంకుస్థాపన జరిగింది.
              </p>

              <h3 className="text-2xl sm:text-3xl font-black text-[#FFD700] pt-4 border-t border-white/20 heading-telugu">సోసైటీ రిజిస్ట్రేషన్ (Trust Registration)</h3>
              <div className="bg-black/70 p-6 rounded-2xl border-2 border-white/20 text-sm sm:text-base font-mono space-y-2 shadow-inner">
                <p className="text-amber-300 font-black text-base sm:text-lg">Registration Name: SRI RAMA SEVA COMMITTEE PAMINIVANDLAVOORU</p>
                <p className="text-gray-200 font-extrabold">Society Act: Andhra Pradesh Societies Registration Act</p>
                <p className="text-gray-200 font-extrabold">Address: Door No: 5-233, Paminivandlavooru, Mangalapalli, Bangarupalem Mandal, Chittoor Dist - 517416</p>
              </div>
            </div>
          </div>
        )}

        {/* 3. 🏆 COMPREHENSIVE DONATIONS SUB-SECTION WITH CATEGORY & SUBCATEGORY DROPDOWNS */}
        {activeTab === 'donations' && (
          <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
            <div className="text-center mb-8">
              <span className="section-tag text-sm sm:text-base font-black px-5 py-2">విరాళాల వర్గీకరణ & సమర్పణ</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black heading-telugu mt-3 mb-2 text-slate-900">
                <span className="heading-gold">శ్రీ రామాలయం విరాళాల పథకాలు & విభాగాలు</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-amber-900 font-extrabold max-w-3xl mx-auto mt-2">
                పారదర్శకత మరియు సులువైన లెక్కల నిర్వహణ కొరకు విరాళాలు పవిత్ర వర్గాలుగా వర్గీకరించబడ్డాయి.
              </p>
            </div>

            {/* 🎯 Interactive Category & Subcategory Dropdown Selector Card (Requirement 4) */}
            <div className="gold-card bg-gradient-to-r from-[#5C121E] via-[#3A0A11] to-[#5C121E] border-3 border-[#FFD700] !p-6 sm:!p-8 rounded-3xl shadow-2xl space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-white/20">
                <Layers className="w-8 h-8 text-[#FFD700]" />
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#FFD700] heading-telugu">విరాళాల విభాగం & ఉప విభాగం ఎంచుకోండి (Select Category & Subcategory)</h3>
                  <p className="text-xs sm:text-sm text-gray-200 font-bold">మీరు విరాళం ఇవ్వాలనుకుంటున్న పవిత్ర విభాగాన్ని క్రింది డ్రాప్‌డౌన్ నుండి ఎంచుకోండి.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Category Dropdown */}
                <div>
                  <label className="block text-sm sm:text-base font-black text-amber-200 mb-2">1. విరాళాల ప్రధాన విభాగం (Main Category)</label>
                  <select
                    value={selectedCatId}
                    onChange={(e) => {
                      setSelectedCatId(e.target.value);
                      const newCat = v2T.donationCategories.find(c => c.id === e.target.value);
                      if (newCat && newCat.subTypes && newCat.subTypes.length > 0) {
                        setSelectedSubCat(newCat.subTypes[0]);
                      }
                    }}
                    className="w-full bg-[#1A0306] border-2 border-[#FFD700] rounded-2xl p-4 text-base sm:text-lg text-white font-black shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  >
                    {v2T.donationCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Subcategory Dropdown */}
                <div>
                  <label className="block text-sm sm:text-base font-black text-amber-200 mb-2">2. ఉప విభాగం (Subcategory Scheme)</label>
                  <select
                    value={selectedSubCat || (availableSubTypes[0] || '')}
                    onChange={(e) => setSelectedSubCat(e.target.value)}
                    className="w-full bg-[#1A0306] border-2 border-[#FFD700] rounded-2xl p-4 text-base sm:text-lg text-white font-black shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  >
                    {availableSubTypes.map((sub, idx) => (
                      <option key={idx} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/60 p-4 rounded-2xl border border-white/10">
                <div className="text-sm sm:text-base font-bold text-amber-300">
                  ఎంచుకున్న సేవ: <span className="text-[#FFD700] font-black">{selectedCategoryObj.name}</span> {selectedSubCat && <span>👉 <span className="text-emerald-400 font-black">{selectedSubCat}</span></span>}
                </div>
                <button
                  onClick={() => {
                    showToast(`'${selectedSubCat || selectedCategoryObj.name}' సేవ కొరకు విరాళం సమర్పించే చెల్లింపు గెట్‌వే తెరవబడింది.`);
                    setShowPaymentGatewayModal(true);
                  }}
                  className="btn-primary px-6 py-3.5 text-base font-black rounded-2xl shadow-xl w-full sm:w-auto shrink-0 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5 text-amber-300" />
                  <span>ఈ వర్గంలో విరాళం సమర్పించండి (Donate Now)</span>
                </button>
              </div>
            </div>

            {/* PhonePe Standee QR Code Section (Centered & Prominent) */}
            <div className="max-w-3xl mx-auto pt-4">
              <div className="gold-card border-4 border-[#FFD700] bg-gradient-to-b from-[#5C121E] via-[#3A0A11] to-[#200407] !p-6 sm:!p-10 rounded-3xl shadow-[0_0_60px_rgba(255,215,0,0.4)] text-center space-y-6">
                <div className="inline-flex items-center gap-2 bg-[#FFD700] text-black font-black text-xs sm:text-sm uppercase px-5 py-2 rounded-full shadow-lg animate-pulse">
                  <QrCode className="w-5 h-5 text-black" />
                  <span>అధికారిక PhonePe Standee QR స్కాన్ & E-HUNDI</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-black text-white heading-telugu">
                  శ్రీ రామా సేవా కమిటీ పామినివాండ్లవూరు
                </h3>
                <p className="text-sm sm:text-base text-amber-200 font-extrabold max-w-xl mx-auto">
                  మీ మొబైల్ ఫోన్‌లోని PhonePe, GPay, Paytm లేదా ఏ ఇతర UPI యాప్ ద్వారానైనా క్రింది QR కోడ్‌ను స్కాన్ చేసి నేరుగా ఆలయ ఖాతాకు విరాళం సమర్పించండి.
                </p>

                {/* QR Display Container */}
                <div className="bg-white p-6 rounded-3xl border-4 border-[#FFD700] shadow-2xl inline-block my-2 cursor-pointer hover:scale-105 transition-transform" onClick={() => setShowQrModal(true)}>
                  <img
                    src={getActiveQrCode()}
                    alt="Sri Rama Seva Committee PhonePe Standee QR"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getAssetUrl('assets/phonepe_qr.png');
                    }}
                    className="w-64 h-64 sm:w-80 sm:h-80 object-contain mx-auto"
                  />
                  <span className="text-xs font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-400 inline-block mt-3">
                    🔍 జూమ్ చేయడానికి క్లిక్ చేయండి (Click to Zoom)
                  </span>
                </div>

                <div className="bg-black/70 p-4 sm:p-5 rounded-2xl border-2 border-white/20 max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left">
                    <span className="text-xs text-amber-300 font-bold block uppercase">అధికారిక UPI ID:</span>
                    <span className="text-base sm:text-lg font-mono font-black text-[#FFD700] block">{t.donation.upiId}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(t.donation.upiId, 'upi')}
                    className="btn-gold text-xs sm:text-sm py-3 px-5 rounded-xl font-black shrink-0 shadow-lg flex items-center gap-2"
                  >
                    {copiedUpi ? <CheckCircle2 className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedUpi ? "కాపీ చేయబడింది!" : "UPI ID కాపీ చేయండి"}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="btn-primary text-base sm:text-lg py-4 px-8 w-full max-w-lg mx-auto font-black rounded-2xl shadow-2xl flex items-center justify-center gap-3"
                >
                  <QrCode className="w-6 h-6 text-amber-300" />
                  <span>పెద్దదిగా QR కోడ్ చూడండి (Open Large QR Popup)</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* 4. 👑 COMMITTEE MEMBERS SUB-SECTION (Requirement 6) */}
        {activeTab === 'committee' && (
          <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
            <div className="text-center mb-8">
              <span className="section-tag text-sm sm:text-base font-black px-5 py-2">కమిటీ సభ్యులు</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black heading-telugu mt-3 text-slate-900">
                <span className="heading-gold">శ్రీ రామా సేవా కమిటీ పాలక వర్గం & సభ్యులు</span>
              </h2>
              <p className="text-sm sm:text-base text-amber-900 font-extrabold max-w-2xl mx-auto mt-2">
                పామినివాండ్లవూరు గ్రామ శ్రీ రామాలయ నిర్మాణ నిర్వహణ సమితి సభ్యుల వివరాలు.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.committee.members.map((member, idx) => {
                const isPresident = member.role.includes("PRESIDENT") && !member.role.includes("VICE");
                const isSecretary = member.role.includes("SECRETARY");

                return (
                  <div
                    key={idx}
                    className={`gold-card relative flex flex-col justify-between group transform transition-all duration-500 hover:-translate-y-2 !p-6 rounded-3xl ${
                      isPresident
                        ? 'border-3 border-[#FFD700] shadow-[0_0_35px_rgba(255,215,0,0.45)] bg-gradient-to-b from-[#5C121E] via-[#3A0A11] to-[#200407]'
                        : isSecretary
                        ? 'border-3 border-amber-400/80 shadow-[0_0_25px_rgba(251,191,36,0.3)] bg-gradient-to-b from-[#4D0F18] to-[#1D0407]'
                        : 'bg-[#5C121E]/95 border-2 border-amber-400/60'
                    }`}
                  >
                    {isPresident && (
                      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-xl flex items-center gap-1 animate-pulse">
                        <Sparkles className="w-3.5 h-3.5 fill-black" />
                        <span>అధ్యక్షులు • Leader</span>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-2xl bg-amber-400/20 text-[#FFD700] border border-[#FFD700]">
                          <Crown className="w-6 h-6" />
                        </div>
                        <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase bg-[#5C121E] text-[#FFD700] border border-[#FFD700]/50">
                          {member.role}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-white heading-telugu mb-1">
                        {member.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-amber-300 font-bold mb-4">
                        {member.father}
                      </p>

                      <div className="space-y-2 text-xs sm:text-sm text-gray-200 bg-black/60 p-4 rounded-2xl border border-white/15">
                        <p><span className="text-gray-400 font-bold">వృత్తి:</span> <strong className="text-white font-black">{member.occ}</strong></p>
                        <p><span className="text-gray-400 font-bold">చిరునామా:</span> <span className="text-gray-200 font-bold">{member.address}</span></p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-amber-200 font-bold">
                      <span>పామినివాండ్లవూరు పాలక వర్గం</span>
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. 📜 TERMS & CONDITIONS SUB-SECTION */}
        {activeTab === 'terms' && (
          <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
            <div className="text-center mb-8">
              <span className="section-tag text-sm sm:text-base font-black px-5 py-2">అధికారిక నిబంధనలు</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black heading-telugu mt-3 text-slate-900">
                <span className="heading-gold">శ్రీ రామాలయం పామినివాండ్లవూరు - నిబంధనలు & షరతులు</span>
              </h2>
              <p className="text-sm sm:text-base text-amber-900 font-extrabold max-w-2xl mx-auto mt-2">
                ఆలయ నిధుల పారదర్శకత, విరాళాల వినియోగం మరియు భక్తుల హక్కుల కొరకు పవిత్ర నిబంధనలు.
              </p>
            </div>

            <div className="space-y-5">
              {v2T.termsAndConditions.map((term) => (
                <div key={term.id} className="gold-card bg-[#5C121E]/95 border-3 border-amber-400/80 !p-6 sm:!p-8 rounded-3xl flex items-start gap-5 shadow-2xl">
                  <div className="p-4 rounded-2xl bg-[#1A0306] border-2 border-[#FFD700] text-[#FFD700] shrink-0 shadow-lg">
                    <FileCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#FFD700] heading-telugu mb-2">
                      {term.title}
                    </h3>
                    <p className="text-base sm:text-lg font-extrabold text-gray-100 leading-relaxed">
                      {term.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. EVENTS SUB-SECTION */}
        {activeTab === 'events' && (
          <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
            <div className="text-center mb-8">
              <span className="section-tag text-sm sm:text-base font-black px-5 py-2">ఉత్సవాలు</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black heading-telugu mt-3 text-slate-900">
                <span className="heading-gold">వార్షిక శ్రీరామనవమి & ధార్మిక కార్యక్రమాలు</span>
              </h2>
            </div>

            <div className="space-y-5">
              {v2T.events.map((e) => (
                <div key={e.id} className="gold-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#5C121E]/95 border-3 border-amber-400/80 !p-6 sm:!p-8 rounded-3xl shadow-2xl">
                  <div>
                    <span className="text-sm sm:text-base font-mono font-black text-amber-300 bg-amber-500/20 px-4 py-1.5 rounded-full border border-amber-400/40 inline-block mb-2">
                      📅 {e.date}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white heading-telugu mb-1">{e.title}</h3>
                    <p className="text-base sm:text-lg font-extrabold text-gray-200 mt-1">{e.desc}</p>
                  </div>
                  <button onClick={() => showToast(`${e.title} ఉత్సవానికి నమోదు చేసుకోబడింది!`)} className="btn-gold text-base font-black whitespace-nowrap !py-3.5 !px-6 rounded-2xl shadow-xl shrink-0">
                    ఉత్సవానికి హాజరు అవ్వండి
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. GALLERY SUB-SECTION WITH ALL TEMPLE PHOTOS */}
        {activeTab === 'gallery' && (
          <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
            <div className="text-center mb-8">
              <span className="section-tag text-sm sm:text-base font-black px-5 py-2">ఆలయ ప్రగతి చిత్రాలు</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black heading-telugu mt-3 text-slate-900">
                <span className="heading-gold">శ్రీ రామాలయ నిర్మాణ & శంకుస్థాపన ఫోటోల గ్యాలరీ</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeGalleryImages.map((p, idx) => (
                <div key={p.id || idx} className="gold-card !p-4 group bg-[#5C121E]/95 border-3 border-amber-400/80 rounded-3xl shadow-2xl">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-black mb-4 border border-white/20">
                    <img src={p.src} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <span className="text-[11px] font-black text-amber-300 bg-black/60 px-2.5 py-0.5 rounded-full border border-amber-400/40 inline-block mb-1">
                    {p.tag}
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-white heading-telugu">{p.title}</h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. NEWS SUB-SECTION */}
        {activeTab === 'news' && (
          <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
            <div className="text-center mb-8">
              <span className="section-tag text-sm sm:text-base font-black px-5 py-2">వార్తలు & ప్రకటనలు</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black heading-telugu mt-3 text-slate-900">
                <span className="heading-gold">తాజా వివరాలు & పత్రికా ప్రకటనలు</span>
              </h2>
            </div>

            <div className="space-y-5">
              {v2T.news.map((n) => (
                <div key={n.id} className="gold-card bg-[#5C121E]/95 border-3 border-amber-400/80 !p-6 sm:!p-8 rounded-3xl shadow-2xl space-y-2">
                  <span className="text-sm font-mono text-amber-300 font-black bg-black/60 px-3.5 py-1 rounded-lg border border-white/10">{n.date}</span>
                  <h3 className="text-xl sm:text-2xl font-black text-white heading-telugu mt-2 mb-2">{n.title}</h3>
                  <p className="text-base sm:text-lg font-extrabold text-gray-100 leading-relaxed">{n.snippet}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. REPORTS SUB-SECTION */}
        {activeTab === 'reports' && (
          <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
            <div className="text-center mb-8">
              <span className="section-tag text-sm sm:text-base font-black px-5 py-2">పారదర్శకత నివేదికలు</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black heading-telugu mt-3 mb-2 text-slate-900">
                <span className="heading-gold">ఆదాయ వ్యయాలు & ఆడిట్ నివేదిక</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-amber-900 font-extrabold max-w-3xl mx-auto mt-2">
                ఆలయ డేటాబేస్ నుండి లైవ్ విరాళాల జాబితా ప్రకారం లెక్కించబడిన అధికారిక ఆర్థిక నివేదిక.
              </p>
            </div>

            {/* 📊 Summary Financial Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="gold-card bg-[#5C121E]/95 border-3 border-emerald-400 !p-6 rounded-3xl text-center shadow-2xl space-y-2">
                <span className="text-xs sm:text-sm font-black text-gray-200 uppercase tracking-wider block">మొత్తం సేకరించిన విరాళాలు (Income)</span>
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-400 font-mono block">₹ {totalDonationsReceived.toLocaleString()}</span>
                <span className="text-xs font-bold text-emerald-300 block">({dbDonationsList.length} విరాళాల రికార్డులు)</span>
              </div>

              <div className="gold-card bg-[#5C121E]/95 border-3 border-sky-400 !p-6 rounded-3xl text-center shadow-2xl space-y-2">
                <span className="text-xs sm:text-sm font-black text-gray-200 uppercase tracking-wider block">మొత్తం నిర్మాణ ఖర్చులు (Expenses)</span>
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-sky-300 font-mono block">₹ {totalExpensesUtilized.toLocaleString()}</span>
                <span className="text-xs font-bold text-sky-200 block">({dbExpensesList.length} ఖర్చుల బిల్లులు)</span>
              </div>

              <div className="gold-card bg-[#5C121E]/95 border-3 border-[#FFD700] !p-6 rounded-3xl text-center shadow-2xl space-y-2">
                <span className="text-xs sm:text-sm font-black text-gray-200 uppercase tracking-wider block">నికర ఆలయ నిల్వ నిధి (Net Balance)</span>
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#FFD700] font-mono block">₹ {netBalance.toLocaleString()}</span>
                <span className="text-xs font-bold text-amber-200 block">(నిఖార్సైన ఆలయ ఖాతా నిధి)</span>
              </div>
            </div>

            {/* 📅 Monthly Summary */}
            <div className="gold-card bg-[#5C121E]/95 border-3 border-amber-400/80 !p-6 sm:!p-8 rounded-3xl space-y-6 shadow-2xl">
              <h3 className="text-xl sm:text-2xl font-black text-[#FFD700] heading-telugu flex items-center gap-3">
                <TrendingUp className="w-7 h-7 text-amber-400" />
                <span>నెలవారీ ఆదాయ వ్యయ విశ్లేషణ నివేదిక (Monthly Summary)</span>
              </h3>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-black/70 border-2 border-white/20 gap-3 shadow-lg">
                  <div>
                    <span className="text-lg sm:text-xl font-black text-white block">జూన్ 2026 (June 2026)</span>
                    <span className="text-xs sm:text-sm text-amber-200 font-extrabold">{juneDonations.length} రికార్డులు సేకరించబడ్డాయి</span>
                  </div>
                  <div className="flex items-center gap-4 text-base sm:text-xl font-black font-mono">
                    <span className="text-emerald-400 bg-emerald-950/60 px-4 py-1.5 rounded-xl border border-emerald-500/40">ఆదాయం: ₹ {juneSum.toLocaleString()}</span>
                    <span className="text-sky-300 bg-sky-950/60 px-4 py-1.5 rounded-xl border border-sky-500/40">ఖర్చు: ₹ 0</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-black/70 border-2 border-white/20 gap-3 shadow-lg">
                  <div>
                    <span className="text-lg sm:text-xl font-black text-white block">జులై 2026 (July 2026)</span>
                    <span className="text-xs sm:text-sm text-amber-200 font-extrabold">{julyDonations.length} రికార్డులు సేకరించబడ్డాయి</span>
                  </div>
                  <div className="flex items-center gap-4 text-base sm:text-xl font-black font-mono">
                    <span className="text-emerald-400 bg-emerald-950/60 px-4 py-1.5 rounded-xl border border-emerald-500/40">ఆదాయం: ₹ {julySum.toLocaleString()}</span>
                    <span className="text-sky-300 bg-sky-950/60 px-4 py-1.5 rounded-xl border border-sky-500/40">ఖర్చు: ₹ 0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="gold-card bg-[#5C121E]/95 border-3 border-[#FFD700]/80 !p-6 sm:!p-8 rounded-3xl space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/20">
                <h3 className="text-xl sm:text-2xl font-black text-[#FFD700] heading-telugu flex items-center gap-3">
                  <Database className="w-7 h-7 text-amber-400" />
                  <span>అధికారిక విరాళాల జాబితా & రికార్డులు (Database Donors Ledger)</span>
                </h3>
                <span className="text-xs sm:text-sm font-black text-emerald-400 bg-emerald-950/80 px-4 py-1.5 rounded-full border border-emerald-400/50">
                  మొత్తం రికార్డులు: {dbDonationsList.length}
                </span>
              </div>

              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-black/70 text-[#FFD700] text-sm sm:text-base font-black border-b-2 border-[#FFD700]">
                      <th className="p-3.5">దాత పేరు (Donor Name)</th>
                      <th className="p-3.5">మొత్తం (Amount)</th>
                      <th className="p-3.5">తేదీ (Date)</th>
                      <th className="p-3.5">సేవ (Seva)</th>
                      <th className="p-3.5">చెల్లింపు మార్గం (Mode)</th>
                      <th className="p-3.5">గ్రామం (City)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-sm sm:text-base font-extrabold text-white">
                    {dbDonationsList.map((d, idx) => (
                      <tr key={idx} className="hover:bg-white/10 transition-colors">
                        <td className="p-3.5 text-amber-200 font-bold">{d.donorName}</td>
                        <td className="p-3.5 text-emerald-400 font-mono font-black">₹ {(typeof d.amount === 'number' ? d.amount : parseInt(String(d.amount).replace(/\D/g, '')) || 0).toLocaleString()}</td>
                        <td className="p-3.5 font-mono text-gray-300 text-xs sm:text-sm">{d.date}</td>
                        <td className="p-3.5 text-xs sm:text-sm text-gray-200">{d.seva}</td>
                        <td className="p-3.5 text-xs sm:text-sm text-sky-300">{d.mode || 'Direct Transfer'}</td>
                        <td className="p-3.5 text-xs sm:text-sm text-amber-300">{d.city}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 11. CONTACT SUB-SECTION WITH DIRECT WHATSAPP FORM (Requirement 2) */}
        {activeTab === 'contact' && (
          <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
            <div className="text-center mb-8">
              <span className="section-tag text-sm sm:text-base font-black px-5 py-2">సంప్రదించండి</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black heading-telugu mt-3 text-slate-900">
                <span className="heading-gold">అధికారిక చిరునామా & WhatsApp నేరుగా సంప్రదింపుల ఫారం</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Address & Direct WhatsApp Call Card */}
              <div className="gold-card space-y-5 text-base sm:text-lg bg-[#5C121E]/95 border-3 border-amber-400/80 !p-8 rounded-3xl shadow-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#FFD700] heading-telugu mb-3">అధికారిక ఆలయ చిరునామా:</h3>
                  <p className="font-extrabold text-white leading-relaxed">శ్రీ రామా సేవా కమిటీ, డోర్ నం: 5-233, పామినివాండ్లవూరు</p>
                  <p className="font-extrabold text-white leading-relaxed">మంగళపల్లె పంచాయతీ, బంగారుపాళెం మండలం, చిత్తూరు జిల్లా - 517416</p>
                  <p className="text-amber-300 font-mono font-black pt-4 border-t border-white/20 text-base sm:text-lg">ఇమెయిల్: sriramasevacommitteepvv@gmail.com</p>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <div className="bg-black/60 p-4 rounded-2xl border border-amber-400/40 text-sm font-bold text-amber-200">
                    💡 సంప్రదింపుల సమయాలు: ఉదయం 08:00 నుండి రాత్రి 08:00 వరకు నేరుగా WhatsApp లో చాట్ చేయవచ్చు.
                  </div>
                </div>
              </div>

              {/* 📲 Direct WhatsApp Message Form (Requirement 2) */}
              <form onSubmit={handleSendWhatsAppForm} className="gold-card space-y-4 bg-[#5C121E]/95 border-3 border-[#FFD700] !p-8 rounded-3xl shadow-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="w-8 h-8 text-emerald-400" />
                  <h3 className="text-2xl sm:text-3xl font-black text-[#FFD700] heading-telugu">WhatsApp సంప్రదింపుల ఫారం (WhatsApp Message Form)</h3>
                </div>

                <div>
                  <label className="block text-sm font-black text-amber-200 mb-1">1. మీ పేరు (Your Name) *</label>
                  <input
                    type="text"
                    required
                    placeholder="ఉదా: రాజేష్ రామ్"
                    value={waName}
                    onChange={(e) => setWaName(e.target.value)}
                    className="w-full bg-[#1A0306] border-2 border-white/20 rounded-2xl p-3.5 text-base sm:text-lg text-white font-extrabold focus:border-[#FFD700] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-amber-200 mb-1">2. ఫోన్ నంబర్ (Phone Number)</label>
                  <input
                    type="tel"
                    placeholder="ఉదా: 9866125609"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    className="w-full bg-[#1A0306] border-2 border-white/20 rounded-2xl p-3.5 text-base sm:text-lg text-white font-extrabold focus:border-[#FFD700] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-amber-200 mb-1">3. మీ గ్రామం / నగరం (Village / City)</label>
                  <input
                    type="text"
                    placeholder="ఉదా: పామినివాండ్లవూరు / చిత్తూరు"
                    value={waCity}
                    onChange={(e) => setWaCity(e.target.value)}
                    className="w-full bg-[#1A0306] border-2 border-white/20 rounded-2xl p-3.5 text-base sm:text-lg text-white font-extrabold focus:border-[#FFD700] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-amber-200 mb-1">4. మీ సందేశం / విచారణ (Your Message) *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="ఆలయ సేవలు లేదా విరాళాల గురించిన మీ సందేశం ఇక్కడ నమోదు చేయండి..."
                    value={waMsg}
                    onChange={(e) => setWaMsg(e.target.value)}
                    className="w-full bg-[#1A0306] border-2 border-white/20 rounded-2xl p-3.5 text-base sm:text-lg text-white font-extrabold focus:border-[#FFD700] transition-colors"
                  />
                </div>

                <button type="submit" className="btn-gold w-full text-base sm:text-lg font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2">
                  <MessageSquare className="w-6 h-6 text-emerald-950" />
                  <span>WhatsApp ద్వారా నేరుగా సందేశం పంపండి</span>
                </button>
              </form>
            </div>
          </div>
        )}

      {/* 💳 INSTANT E-HUNDI ONLINE PAYMENT GATEWAY MODAL */}
      {showPaymentGatewayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-gradient-to-b from-[#4A0E17] via-[#2A060B] to-[#1A0306] border-4 border-[#FFD700] p-6 sm:p-8 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-[0_0_80px_rgba(255,215,0,0.5)] relative text-white">
            
            <button
              type="button"
              onClick={() => setShowPaymentGatewayModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-red-600 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6 pb-4 border-b border-white/20">
              <div className="inline-flex items-center gap-2 bg-[#FFD700] text-[#4A0E17] font-black px-4 py-1 rounded-full text-xs uppercase mb-2 shadow-lg">
                <CreditCard className="w-4 h-4 fill-[#4A0E17]" />
                <span>శ్రీ రామాలయం ఆన్‌లైన్ ఈ-హుండి చెల్లింపు గెట్‌వే</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white heading-telugu">ఈ-హుండి ఆన్‌లైన్ విరాళం సమర్పణ</h3>
              <p className="text-xs sm:text-sm text-amber-300 font-bold mt-1">100% పారదర్శకత • నేరుగా ఆలయ అధికారిక బ్యాంక్ ఖాతాకు జమ</p>
            </div>

            {/* Selected Scheme Badge & Dropdowns */}
            <div className="bg-[#5C121E] p-4 rounded-2xl border-2 border-[#FFD700] mb-6 space-y-3 shadow-lg">
              <div className="text-center">
                <span className="text-xs text-amber-200 font-bold uppercase block">ఎంచుకున్న పవిత్ర సేవ / వర్గం:</span>
                <h4 className="text-lg sm:text-xl font-black text-[#FFD700] heading-telugu">
                  {(v2T.donationCategories.find(c => c.id === selectedCatId) || v2T.donationCategories[0]).name}
                </h4>
                <span className="text-sm font-extrabold text-emerald-400 bg-black/60 px-3 py-1 rounded-full border border-emerald-400/40 inline-block mt-1">
                  👉 ఉప వర్గం: {selectedSubCat || (availableSubTypes[0] || 'సాధారణ విరాళం')}
                </span>
              </div>

              {/* Category & Subcategory Quick Dropdown Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/15">
                <div>
                  <label className="block text-xs font-bold text-amber-200 mb-1">వర్గం మార్చుకోండి (Category):</label>
                  <select
                    value={selectedCatId}
                    onChange={(e) => {
                      setSelectedCatId(e.target.value);
                      const newCat = v2T.donationCategories.find(c => c.id === e.target.value);
                      if (newCat && newCat.subTypes && newCat.subTypes.length > 0) {
                        setSelectedSubCat(newCat.subTypes[0]);
                      }
                    }}
                    className="w-full bg-[#1A0306] border border-[#FFD700] rounded-xl p-2 text-xs sm:text-sm text-white font-bold"
                  >
                    {v2T.donationCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-200 mb-1">ఉప వర్గం మార్చుకోండి (Subcategory):</label>
                  <select
                    value={selectedSubCat || (availableSubTypes[0] || '')}
                    onChange={(e) => setSelectedSubCat(e.target.value)}
                    className="w-full bg-[#1A0306] border border-[#FFD700] rounded-xl p-2 text-xs sm:text-sm text-white font-bold"
                  >
                    {availableSubTypes.map((sub, idx) => (
                      <option key={idx} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <form onSubmit={handleCompleteDonationPayment} className="space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-black text-amber-200 mb-1">1. భక్తుని పూర్తి పేరు (Devotee Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="ఉదా: రాజేష్ రామ్"
                  value={payName}
                  onChange={(e) => setPayName(e.target.value)}
                  className="w-full bg-[#1A0306] border-2 border-white/20 rounded-xl p-3.5 text-base sm:text-lg text-white font-bold focus:border-[#FFD700]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-black text-amber-200 mb-1">2. ఫోన్ నంబర్ (Phone Number)</label>
                  <input
                    type="tel"
                    placeholder="9866125609"
                    value={payPhone}
                    onChange={(e) => setPayPhone(e.target.value)}
                    className="w-full bg-[#1A0306] border-2 border-white/20 rounded-xl p-3.5 text-base sm:text-lg text-white font-mono font-bold focus:border-[#FFD700]"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-black text-amber-200 mb-1">3. గ్రామం / ఊరు (Village / City)</label>
                  <input
                    type="text"
                    placeholder="పామినివాండ్లవూరు"
                    value={payCity}
                    onChange={(e) => setPayCity(e.target.value)}
                    className="w-full bg-[#1A0306] border-2 border-white/20 rounded-xl p-3.5 text-base sm:text-lg text-white font-bold focus:border-[#FFD700]"
                  />
                </div>
              </div>

              {/* Amount Selection Pills */}
              <div>
                <label className="block text-xs sm:text-sm font-black text-amber-200 mb-2">4. విరాళం మొత్తం ఎంచుకోండి (Select Amount) *</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                  {['501', '1116', '2101', '5001', '10000', '50000'].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setPayAmount(amt)}
                      className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-mono font-black border transition-all ${
                        payAmount === amt
                          ? 'bg-[#FFD700] text-black border-amber-300 shadow-md scale-105'
                          : 'bg-black/60 text-amber-200 border-white/20 hover:bg-white/10'
                      }`}
                    >
                      ₹ {parseInt(amt).toLocaleString()}
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  required
                  placeholder="మొత్తం నమోదు చేయండి (₹)"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full bg-[#1A0306] border-2 border-[#FFD700] rounded-xl p-4 text-xl font-mono font-black text-[#FFD700]"
                />
              </div>

              {/* Payment Option Selector - QR Code Standee Only */}
              <div>
                <label className="block text-xs sm:text-sm font-black text-amber-200 mb-2">5. చెల్లింపు మార్గం (Payment Option)</label>
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="btn-gold w-full p-4 rounded-2xl text-sm sm:text-base font-black flex items-center justify-center gap-3 shadow-xl"
                >
                  <QrCode className="w-6 h-6 text-black" />
                  <span>PhonePe Standee QR స్కాన్ & E-HUNDI</span>
                </button>
              </div>

              <button
                type="submit"
                className="btn-gold w-full py-4 text-lg font-black rounded-2xl shadow-2xl flex items-center justify-center gap-2 mt-4"
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-950" />
                <span>విరాళం సమర్పించి రశీదు పొందండి (Submit & Get Official Receipt)</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 📄 INSTANT DIGITAL RECEIPT MODAL (TTD Devasthanam Formal Style with Watermark) */}
      {digitalReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white border-4 border-[#FB6C00] p-6 sm:p-8 rounded-3xl max-w-2xl w-full max-h-[94vh] overflow-y-auto shadow-2xl relative text-slate-900 space-y-6">
            
            <button
              type="button"
              onClick={() => setDigitalReceipt(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-red-600 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <span className="bg-[#FB6C00] text-white font-black text-xs uppercase px-4 py-1 rounded-full shadow-md inline-block mb-2">
                ✓ విరాళం నమోదైంది
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#FB6C00] heading-telugu">శ్రీ రామాలయం అధికారిక డిజిటల్ రశీదు</h3>
            </div>

            {/* Rendered Printable Formal TTD-Style Receipt Card with Watermark */}
            <div ref={receiptModalRef} className="bg-white text-black p-6 sm:p-8 rounded-xl border-2 border-gray-800 shadow-2xl relative overflow-hidden font-sans">
              
              {/* Watermark Background Layer - Official Temple Logo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.14] z-0">
                <div className="text-center">
                  <img src={getActiveLogo()} alt="Sri Rama Seva Committee Logo Watermark" className="w-72 h-72 sm:w-80 sm:h-80 mx-auto rounded-full object-cover border-4 border-amber-600/40 shadow-2xl" />
                  <span className="text-3xl sm:text-4xl font-black uppercase text-[#C25200] tracking-widest block mt-2">SRI RAMA SEVA COMMITTEE</span>
                  <span className="text-xl font-black text-amber-900 block mt-0.5">పామినివాండ్లవూరు</span>
                </div>
              </div>

              {/* Header Section */}
              <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <img src={getActiveLogo()} alt="Logo" className="w-16 h-16 rounded-full border-2 border-[#FB6C00] shadow-md" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-[#C25200] heading-telugu">శ్రీ రామా సేవా కమిటీ (SRI RAMA SEVA COMMITTEE)</h3>
                    <p className="text-xs font-bold text-gray-700">పామినివాండ్లవూరు • మంగళపల్లె పంచాయతీ • బంగారుపాళెం మండలం</p>
                    <p className="text-[11px] font-semibold text-gray-600">చిత్తూరు జిల్లా - 517416, ఆంధ్రప్రదేశ్, భారతదేశం</p>
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  <span className="text-[11px] font-bold text-gray-600 block">రశీదు సంఖ్య (Receipt No):</span>
                  <span className="text-sm sm:text-base font-mono font-black text-[#C25200] bg-gray-100 px-3 py-1 rounded border border-gray-400 inline-block">{digitalReceipt.id}</span>
                </div>
              </div>

              {/* Receipt Title Badge */}
              <div className="text-center mb-4 relative z-10">
                <h4 className="text-base sm:text-lg font-black text-[#C25200] uppercase tracking-wide underline decoration-[#FB6C00] underline-offset-4 heading-telugu">
                  శ్రీ రామాలయం విరాళం రశీదు / Official Donation Receipt
                </h4>
              </div>

              {/* TTD-Style Crisp Grid Table */}
              <div className="border-2 border-gray-800 text-xs sm:text-sm mb-4 relative z-10 bg-white/90">
                <div className="grid grid-cols-3 border-b border-gray-400">
                  <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">దాత ఐడీ (Donor ID):</div>
                  <div className="p-2.5 font-mono font-black col-span-2 text-gray-900">{digitalReceipt.id}</div>
                </div>

                <div className="grid grid-cols-3 border-b border-gray-400">
                  <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">తేదీ & సమయం (Date & Time):</div>
                  <div className="p-2.5 font-mono font-bold col-span-2 text-gray-900">{digitalReceipt.date}</div>
                </div>

                <div className="grid grid-cols-3 border-b border-gray-400">
                  <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">ఆలయ ట్రస్ట్ పేరు (Trust Name):</div>
                  <div className="p-2.5 font-bold col-span-2 text-[#C25200]">SRI RAMA SEVA COMMITTEE PAMINIVANDLAVOORU</div>
                </div>

                <div className="grid grid-cols-3 border-b border-gray-400 bg-orange-50">
                  <div className="p-2.5 font-black bg-orange-100 border-r border-gray-400 text-sm sm:text-base text-[#C25200]">విరాళం కానుక మొత్తం (Donation Amount):</div>
                  <div className="p-2.5 font-mono font-black text-lg text-[#FB6C00] col-span-2">Rs. {digitalReceipt.amount.toLocaleString()} /-</div>
                </div>

                <div className="grid grid-cols-3 border-b border-gray-400">
                  <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">దాత పేరు (Primary Donor Name):</div>
                  <div className="p-2.5 font-black text-base col-span-2 text-gray-900">{digitalReceipt.donorName}</div>
                </div>

                <div className="grid grid-cols-3 border-b border-gray-400">
                  <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">ఫోన్ నంబర్ (Phone No):</div>
                  <div className="p-2.5 font-mono font-bold col-span-2 text-gray-800">{digitalReceipt.phone || '9866125609'}</div>
                </div>

                <div className="grid grid-cols-3 border-b border-gray-400">
                  <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">గ్రామం / ఊరు (Village / City):</div>
                  <div className="p-2.5 font-bold col-span-2 text-gray-900">{digitalReceipt.city || 'పామినివాండ్లవూరు'}</div>
                </div>

                <div className="grid grid-cols-3 border-b border-gray-400">
                  <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">విరాళం విభాగం & సేవ (Category & Seva):</div>
                  <div className="p-2.5 font-bold col-span-2 text-[#C25200]">{digitalReceipt.seva}</div>
                </div>

                <div className="grid grid-cols-3">
                  <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">చెల్లింపు మార్గం (Payment Mode):</div>
                  <div className="p-2.5 font-bold col-span-2 text-orange-900">{digitalReceipt.mode || 'PhonePe Standee QR / UPI'}</div>
                </div>
              </div>

              {/* Important Information Box (TTD Format) */}
              <div className="border border-orange-300 bg-orange-50 p-3 rounded text-[11px] text-orange-950 mb-4 space-y-1 relative z-10">
                <p className="font-bold text-orange-900 border-b border-orange-200 pb-1">Important Information to the Donor:</p>
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
                  <p className="font-black text-[#C25200] text-xs">Executive Committee</p>
                  <p className="font-bold text-gray-800">Sri Rama Seva Committee, Paminivandlavooru</p>
                </div>
              </div>

            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={downloadDigitalReceiptPDF} className="btn-primary text-sm py-3.5 px-6 w-full rounded-2xl font-bold flex items-center justify-center gap-2 bg-[#FB6C00] text-white">
                <Download className="w-5 h-5" />
                <span>రశీదు PDF డౌన్‌లోడ్ చేసుకోండి</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📷 PHONEPE STANDEE QR CODE FULL SCREEN LARGE POPUP MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn" onClick={() => setShowQrModal(false)}>
          <div className="bg-white border-4 border-[#FB6C00] p-6 sm:p-10 rounded-3xl max-w-2xl w-full shadow-2xl relative text-center text-slate-900 space-y-6" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-100 text-slate-700 hover:bg-red-600 hover:text-white transition-colors"
            >
              <X className="w-7 h-7" />
            </button>

            <div className="space-y-2">
              <span className="inline-block px-5 py-1.5 rounded-full text-xs sm:text-sm font-black bg-[#FB6C00] text-white shadow-md">
                🚩 PHONEPE OFFICIAL STANDEE QR SCANNER
              </span>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 heading-telugu">
                శ్రీ రామా సేవా కమిటీ పామినివాండ్లవూరు
              </h3>
              <p className="text-xs sm:text-sm text-[#FB6C00] font-extrabold">100% పారదర్శకత • నేరుగా ఆలయ అధికారిక బ్యాంక్ ఖాతాకు జమ</p>
            </div>

            {/* High-Resolution Large QR Code Display Container */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border-4 border-[#FB6C00] shadow-xl inline-block my-2">
              <img
                src={getActiveQrCode()}
                alt="PhonePe QR Standee Scanner Large View"
                className="w-72 h-72 sm:w-96 sm:h-96 object-contain mx-auto"
              />
            </div>

            <div className="bg-orange-50 p-4 rounded-2xl border-2 border-orange-200 max-w-md mx-auto space-y-1">
              <span className="text-xs text-orange-950 font-bold uppercase block">అధికారిక UPI ID:</span>
              <span className="text-base sm:text-xl font-mono font-black text-[#FB6C00] block my-0.5">8431806098@ibl</span>
              <span className="text-xs text-slate-700 font-semibold block">మొబైల్ ఫోన్‌లోని PhonePe, GPay, Paytm లేదా ఏ ఇతర UPI యాప్ ద్వారా స్కాన్ చేయండి</span>
            </div>

            <div className="flex gap-4 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => copyToClipboard('8431806098@ibl', 'upi')}
                className="btn-gold text-sm sm:text-base w-full py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl bg-[#FB6C00] text-white"
              >
                {copiedUpi ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5" />}
                <span>{copiedUpi ? "UPI ID కాపీ చేయబడింది!" : "UPI ID కాపీ చేయండి"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
