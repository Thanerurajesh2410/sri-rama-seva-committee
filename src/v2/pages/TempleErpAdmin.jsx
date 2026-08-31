import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, Users, Heart, DollarSign, Building2, Package, Award, ShieldCheck, FileText, Share2, Plus, Trash2, CheckCircle2, Lock, Download, Printer, Bell, AlertCircle, Eye, Phone, Mail, MapPin, Database, ChevronDown, Receipt, Sliders, Image as ImageIcon, ToggleLeft, ToggleRight, Camera, Upload, Sparkles, Edit3, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { getDB, saveDB, validateUniqueDevotee, addAuditLog, defaultWebsiteSettings, defaultGalleryImages, generateSqlDump, resetToInitialDB, getAssetUrl, getActiveLogo, getActiveQrCode, updateMediaAsset, resetMediaAsset } from '../data/v2Database';

export default function TempleErpAdmin({ t, v2T, showToast }) {
  const [db, setDbState] = useState(getDB());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const reportRef = useRef(null);
  const receiptRef = useRef(null);

  // ERP Role State
  const [userRole, setUserRole] = useState('ADMIN / CHIEF EXECUTIVE');

  // New Donor Form State (With Unique Phone & Email Validation)
  const [newDonorName, setNewDonorName] = useState('');
  const [newDonorPhone, setNewDonorPhone] = useState('');
  const [newDonorEmail, setNewDonorEmail] = useState('');
  const [newDonorCity, setNewDonorCity] = useState('');
  const [newDonorAmount, setNewDonorAmount] = useState('');
  const [newDonorSeva, setNewDonorSeva] = useState('రాతి గోడల నిర్మాణం (Pillars & Structure)');
  const [validationError, setValidationError] = useState('');

  // Receipt Generator Form State
  const [selectedDonorId, setSelectedDonorId] = useState('');
  const [receiptName, setReceiptName] = useState('');
  const [receiptAmount, setReceiptAmount] = useState('');
  const [receiptPhone, setReceiptPhone] = useState('');
  const [receiptCity, setReceiptCity] = useState('');
  const [receiptSeva, setReceiptSeva] = useState('రాతి గోడల నిర్మాణం (Pillars & Structure)');
  const [receiptMode, setReceiptMode] = useState('Online (UPI / PhonePe / GPay)');
  const [generatedReceipt, setGeneratedReceipt] = useState(null);

  // Gallery Image Manager State
  const [newImgTitle, setNewImgTitle] = useState('');
  const [newImgTag, setNewImgTag] = useState('');
  const [newImgSrc, setNewImgSrc] = useState('');

  // New Expense Form State
  const [newExpCat, setNewExpCat] = useState('');
  const [newExpAmt, setNewExpAmt] = useState('');
  const [newExpVendor, setNewExpVendor] = useState('');

  // Material Dropdown Items List
  const materialDropdownOptions = [
    "రాతి రాళ్ళు (Carved Granite Stones)",
    "సిమెంట్ బస్తాలు (Cement Bags)",
    "స్టీల్ & ఇనుము (Steel Rods)",
    "ద్వారబంధాలు & కలప (Teak Wood Frames)",
    "ఇటుకలు & కంకర (Bricks & Gravel)",
    "విద్యుత్ సామాగ్రి (Electrical Items)",
    "ప్లంబింగ్ సామాగ్రి (Plumbing Materials)",
    "ఇతర నిర్మాణ సామాగ్రి (Other Construction Material)"
  ];

  // New Material Donation State
  const [newMatType, setNewMatType] = useState(materialDropdownOptions[0]);
  const [newMatQty, setNewMatQty] = useState('');
  const [newMatDonor, setNewMatDonor] = useState('');

  // New Volunteer Form State
  const [newVolName, setNewVolName] = useState('');
  const [newVolPhone, setNewVolPhone] = useState('');
  const [newVolTask, setNewVolTask] = useState('');

  // Active Report Type for Download/Sharing
  const [activeReportType, setActiveReportType] = useState('financial');

  // 🎨 Poster, Pamphlet & Donation Book Studio State
  const designerCanvasRef = useRef(null);
  const [designerType, setDesignerType] = useState('poster'); // 'poster' | 'pamphlet' | 'receipt_book'
  
  // Poster Fields
  const [posterTitle, setPosterTitle] = useState('శ్రీ సీతారాములవారి ఆలయ శంకుస్థాపన & పునాది రాతి గోడల నిర్మాణ మహోత్సవం');
  const [posterSubtitle, setPosterSubtitle] = useState('శ్రీ రామా సేవా కమిటీ & పామినివాండ్లవూరు గ్రామస్థుల దివ్య సమర్పణ');
  const [posterDate, setPosterDate] = useState('తేదీ: 2026-08-15 (ఆదివారం) • సమయం: ఉదయం 9:00 గంటలకు');
  const [posterVenue, setPosterVenue] = useState('స్థలం: పామినివాండ్లవూరు శ్రీ రామాలయ ప్రాంగణం, మంగళపల్లె పంచాయతీ, బంగారుపాళెం');
  const [posterMessage, setPosterMessage] = useState('స్వహస్తాలతో శ్రీ రామాలయ రాతి గోడల నిర్మాణానికి విరాళం సమర్పించి శ్రీరాముని కృపకు పాత్రులు కాగలరని ప్రార్థన.');
  const [posterChiefGuest, setPosterChiefGuest] = useState('ముఖ్య ఆహ్వానితులు: ఆలయ పెద్దలు, పురోహితులు & గ్రామ దాతలు');
  const [posterPhone, setPosterPhone] = useState('9866125609 / 8431806098');
  const [posterUpiId, setPosterUpiId] = useState('9866125609@ybl (PhonePe / GPay)');
  const [posterTheme, setPosterTheme] = useState('divine_maroon'); // 'divine_maroon' | 'royal_gold' | 'sacred_saffron'

  // Pamphlet Fields (Matching Reference Traditional Template)
  const [pamphletMainTitle, setPamphletMainTitle] = useState('శ్రీ సీతారామచంద్ర స్వామి వారి దేవస్థానం నిర్మాణానికి మీ సహాయం కావాలి');
  const [pamphletSubTag, setPamphletSubTag] = useState('ఒక్క అడుగు భక్తితో... ఒక్క విరాళం శాశ్వత సేవగా...');
  const [pamphletAppealText, setPamphletAppealText] = useState('మా గ్రామ ప్రజల దీర్ఘకాల స్వప్నమైన శ్రీ సీతారామచంద్ర స్వామి వారి దేవాలయ నిర్మాణం భక్తుల సహకారంతో, సేవాభావంతో ముందుకు సాగుతోంది. భగవంతుని ఆరాధనకై, ఆధ్యాత్మిక వాతావరణానికి, భవిష్యత్ తరాలకు ఆధ్యాత్మిక వారసత్వాన్ని అందించేందుకు ఈ పుణ్యకార్యంలో మీ పినియాద సహాయం అందించగలరు.');
  const [pamphletVillage, setPamphletVillage] = useState('పామినివాండ్లవూరు గ్రామం');
  const [pamphletDeityName, setPamphletDeityName] = useState('శ్రీ సీతారామచంద్ర స్వామి వారు');
  const [pamphletStatus, setPamphletStatus] = useState('స్థల శుద్ధి పూర్తి, నిర్మాణ పనులు ప్రారంభ దశలో');
  const [pamphletHelpTypes, setPamphletHelpTypes] = useState('ఆర్థిక సహాయం, సామగ్రి, సేవా సహాయం, శ్రమదానం');
  const [pamphletSideNotice, setPamphletSideNotice] = useState('మీ చిన్న సహాయం భగవంతుని సన్నిధిలో అపార పుణ్యఫలం అందిస్తుంది');
  
  // Bank & UPI Details
  const [pamphletTrustName, setPamphletTrustName] = useState('SRI RAMA SEVA COMMITTEE');
  const [pamphletBankName, setPamphletBankName] = useState('State Bank of India');
  const [pamphletAccNo, setPamphletAccNo] = useState('12345678909');
  const [pamphletIfsc, setPamphletIfsc] = useState('SBIN0001234');
  const [pamphletBranch, setPamphletBranch] = useState('Bangarupalem / Chittoor Main');
  const [pamphletUpiId, setPamphletUpiId] = useState('9866125609@ybl');

  // Committee Contacts
  const [pamphletPresident, setPamphletPresident] = useState('అధ్యక్షులు: 9866125609');
  const [pamphletSecretary, setPamphletSecretary] = useState('కార్యదర్శి: 8431806098');
  const [pamphletTreasurer, setPamphletTreasurer] = useState('కోశాధికారి: 9866125609');
  const [pamphletMembers, setPamphletMembers] = useState('సభ్యులు: పామినివాండ్లవూరు గ్రామ పెద్దలు');

  // Donation Receipt Book Template Fields
  const [bookTrustName, setBookTrustName] = useState('SRI RAMA SEVA COMMITTEE PAMINIVANDLAVOORU');
  const [bookStartNo, setBookStartNo] = useState('1001');
  const [bookSlipCount, setBookSlipCount] = useState(3);
  const [bookNotice, setBookNotice] = useState('1. ఈ రశీదు పుస్తకం శ్రీ రామాలయ నిర్మాణ నిధికి అధికారికంగా జారీ చేయబడినది.\n2. విరాళం నగదు లేదా PhonePe / UPI ద్వారా స్వీకరించబడును.');

  // Pamphlet Image & Background Customization & Canvas Editing State
  const [pamphletBgImage, setPamphletBgImage] = useState(getAssetUrl('assets/banner.jpg'));
  const [pamphletDeityHeaderImg, setPamphletDeityHeaderImg] = useState(getAssetUrl('assets/banner.jpg'));
  const [pamphletWatermarkImg, setPamphletWatermarkImg] = useState(getAssetUrl('assets/logo.jpg'));
  const [pamphletQrImg, setPamphletQrImg] = useState(getAssetUrl('assets/phonepe_qr.png'));
  const [pamphletBgOpacity, setPamphletBgOpacity] = useState(85); // 85% opacity overlay
  const [directCanvasEditMode, setDirectCanvasEditMode] = useState(true); // Direct inline editing on canvas preview

  // Logo & QR Manager State
  const [logoMode, setLogoMode] = useState('fixed'); // 'fixed' | 'temporary'
  const [logoTempDuration, setLogoTempDuration] = useState('24'); // Hours
  const [logoNewFile, setLogoNewFile] = useState('');

  const [qrMode, setQrMode] = useState('fixed');
  const [qrTempDuration, setQrTempDuration] = useState('24');
  const [qrNewFile, setQrNewFile] = useState('');

  // Handle Logo Upload
  const handleSaveLogoAsset = (e) => {
    e.preventDefault();
    if (!logoNewFile) {
      showToast("దయచేసి కొత్త లోగో చిత్రాన్ని ఎంచుకోండి.");
      return;
    }
    const updated = updateMediaAsset('logo', logoMode, logoNewFile, logoTempDuration);
    setDbState(updated);
    setLogoNewFile('');
    addAuditLog(userRole, `Updated Temple Logo (${logoMode.toUpperCase()} Mode - ${logoMode === 'temporary' ? logoTempDuration + ' Hours' : 'Permanent'})`);
    showToast(`లోగో విజయవంతంగా అప్‌డేట్ కాబడింది! (${logoMode === 'fixed' ? 'శాశ్వతం / Permanent' : 'తాత్కాలికం / Temporary ' + logoTempDuration + ' గంటలు'})`);
  };

  // Handle QR Code Upload
  const handleSaveQrAsset = (e) => {
    e.preventDefault();
    if (!qrNewFile) {
      showToast("దయచేసి కొత్త QR కోడ్ చిత్రాన్ని ఎంచుకోండి.");
      return;
    }
    const updated = updateMediaAsset('qrCode', qrMode, qrNewFile, qrTempDuration);
    setDbState(updated);
    setQrNewFile('');
    addAuditLog(userRole, `Updated PhonePe QR Code (${qrMode.toUpperCase()} Mode - ${qrMode === 'temporary' ? qrTempDuration + ' Hours' : 'Permanent'})`);
    showToast(`PhonePe QR కోడ్ స్కేనర్ విజయవంతంగా అప్‌డేట్ కాబడింది! (${qrMode === 'fixed' ? 'శాశ్వతం / Permanent' : 'తాత్కాలికం / Temporary ' + qrTempDuration + ' గంటలు'})`);
  };

  // Handle Logo Reset
  const handleResetLogoAsset = () => {
    if (window.confirm("మీరు ఖచ్చితంగా లోగోను ఒరిజినల్ డిఫాల్ట్ ఇమేజ్‌కు రీసెట్ చేయాలనుకుంటున్నారా?")) {
      const updated = resetMediaAsset('logo');
      setDbState(updated);
      addAuditLog(userRole, "Reset Temple Logo to Original Default Asset");
      showToast("లోగో ఒరిజినల్ డిఫాల్ట్‌కు రీసెట్ చేయబడింది!");
    }
  };

  // Handle QR Reset
  const handleResetQrAsset = () => {
    if (window.confirm("మీరు ఖచ్చితంగా PhonePe QR కోడ్‌ను ఒరిజినల్ డిఫాల్ట్ ఇమేజ్‌కు రీసెట్ చేయాలనుకుంటున్నారా?")) {
      const updated = resetMediaAsset('qrCode');
      setDbState(updated);
      addAuditLog(userRole, "Reset PhonePe QR Code to Original Default Asset");
      showToast("PhonePe QR కోడ్ ఒరిజినల్ డిఫాల్ట్‌కు రీసెట్ చేయబడింది!");
    }
  };

  // Helper for uploading and compressing custom images
  const handleCustomImageUpload = (setterFunction) => (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawUrl = event.target.result;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 550;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setterFunction(compressedDataUrl);
          showToast("కస్టమ్ చిత్రం కాంప్రెస్ చేయబడి విజయవంతంగా లోడ్ చేయబడింది!");
        };
        img.onerror = () => {
          setterFunction(rawUrl);
          showToast("కస్టమ్ చిత్రం లోడ్ చేయబడింది!");
        };
        img.src = rawUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  // Download Designer Canvas as High-Res PNG Image
  const downloadDesignImage = async () => {
    if (!designerCanvasRef.current) return;
    showToast("పోస్టర్ / పాంప్లెట్ ఇమేజ్ ڈاؤنన్‌లోడ్ ప్రారంభమైంది...");
    try {
      const element = designerCanvasRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1200
      });
      const link = document.createElement('a');
      link.download = `Sri_Rama_${designerType.toUpperCase()}_DESIGN.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      showToast("ఇమేజ్ (PNG) విజయవంతంగా డౌన్‌లోడ్ చేయబడింది!");
    } catch (err) {
      console.error(err);
      showToast("ఇమేజ్ డౌన్‌లోడ్‌లో లోపం జరిగింది.");
    }
  };

  // Download Designer Canvas as Printable PDF
  const downloadDesignPDF = async () => {
    if (!designerCanvasRef.current) return;
    showToast("పోస్టర్ / పాంప్లెట్ PDF సిద్ధమవుతోంది...");
    try {
      const element = designerCanvasRef.current;
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
      pdf.save(`Sri_Rama_${designerType.toUpperCase()}_DESIGN.pdf`);
      showToast("PDF విజయవంతంగా డౌన్‌లోడ్ చేయబడింది!");
    } catch (err) {
      console.error(err);
      showToast("PDF డౌన్‌లోడ్‌లో లోపం జరిగింది.");
    }
  };

  // Download Database as JSON Backup
  const downloadDatabaseJSON = () => {
    const currentDB = getDB();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentDB, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sri_rama_temple_db_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("డేటాబేస్ JSON బ్యాకప్ ఫైల్ విజయవంతంగా డౌన్‌లోడ్ చేయబడింది!");
  };

  // Download Database as SQL Dump Script (.sql)
  const downloadDatabaseSQL = () => {
    const currentDB = getDB();
    const sqlContent = generateSqlDump(currentDB);
    const blob = new Blob([sqlContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sri_rama_temple_db_dump_${new Date().toISOString().slice(0,10)}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("డేటాబేస్ SQL డ్రిల్ ఫైల్ (sri_rama_temple_db.sql) డౌన్‌లోడ్ చేయబడింది!");
  };

  // Restore Database from uploaded JSON file
  const handleRestoreDatabase = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedDB = JSON.parse(event.target.result);
          if (importedDB && (importedDB.donations || importedDB.devotees)) {
            saveDB(importedDB);
            setDbState(importedDB);
            addAuditLog(userRole, 'Restored Database from JSON File Backup');
            showToast("డేటాబేస్ పునరుద్ధరించబడింది! (Database Restored Successfully)");
          } else {
            showToast("చెల్లని డేటాబేస్ ఫైల్ (Invalid Database File Format)");
          }
        } catch (err) {
          showToast("ఫైల్ రీడ్ చేయడంలో లోపం జరిగింది");
        }
      };
      reader.readAsText(file);
    }
  };

  // Factory Reset / Re-seed Database
  const handleFactoryResetDB = () => {
    if (window.confirm("మీరు ఖచ్చితంగా డేటాబేస్‌ను రీసెట్ చేయాలనుకుంటున్నారా? (రిజిస్టర్డ్ దాతలు & V1 క్లాసిక్ రికార్డులు పునరుద్ధరించబడతాయి)")) {
      const fresh = resetToInitialDB();
      setDbState(fresh);
      addAuditLog(userRole, "Database Factory Reset & Seeded V1 Donors");
      showToast("డేటాబేస్ విజయవంతంగా రీసెట్ & రీ-సీడ్ చేయబడింది!");
    }
  };

  useEffect(() => {
    setDbState(getDB());
  }, []);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === '1252026' || passcode === 'admin123' || passcode === '9866125609') {
      setIsAuthenticated(true);
      setPassError('');
      addAuditLog(userRole, "Admin Logged Into ERP System");
      showToast("శ్రీ రామాలయం ERP కి విజయవంతంగా లాగిన్ అయ్యారు!");
    } else {
      setPassError("తప్పు పాస్‌కోడ్! దయచేసి సరైన అడ్మిన్ పిన్ ఎంటర్ చేయండి.");
    }
  };

  // 🌟 Handle Donor Dropdown Select for Receipt Generator (All V1 Classic Site Donors Supported)
  const handleSelectDonorFromDropdown = (e) => {
    const donorId = e.target.value;
    setSelectedDonorId(donorId);
    if (!donorId) return;

    const currentDB = getDB();
    const donor = currentDB.donations.find(d => String(d.id) === String(donorId));
    if (donor) {
      const cleanNumAmount = typeof donor.amount === 'number' ? donor.amount : parseInt(String(donor.amount).replace(/\D/g, '')) || 0;
      setReceiptName(donor.donorName);
      setReceiptAmount(cleanNumAmount);
      setReceiptPhone(donor.phone || '9866125609');
      setReceiptCity(donor.city || 'పామినివాండ్లవూరు');
      setReceiptSeva(donor.seva || 'రాతి గోడల నిర్మాణం (Pillars & Structure)');
      if (donor.mode) setReceiptMode(donor.mode);
      showToast(`'${donor.donorName}' వివరాలు (₹ ${cleanNumAmount.toLocaleString()}) ఆటోమేటిక్‌గా ఎంచుకోబడ్డాయి.`);
    }
  };

  // Add Donor in CRM with Unique Phone & Email Validation
  const handleAddDonorCRM = (e) => {
    e.preventDefault();
    setValidationError('');

    if (newDonorPhone || newDonorEmail) {
      const check = validateUniqueDevotee(newDonorPhone, newDonorEmail);
      if (!check.valid) {
        setValidationError(check.message);
        showToast(check.message);
        return;
      }
    }

    const currentDB = getDB();
    const newDonationId = 'SRS-2026-' + Math.floor(100 + Math.random() * 900);
    
    const newDonation = {
      id: newDonationId,
      donorName: newDonorName,
      phone: newDonorPhone || 'N/A',
      email: newDonorEmail || 'N/A',
      amount: parseInt(newDonorAmount),
      date: new Date().toLocaleDateString('te-IN'),
      seva: newDonorSeva,
      mode: 'Cash / Bank Transfer',
      city: newDonorCity || 'పామినివాండ్లవూరు'
    };

    currentDB.donations.unshift(newDonation);
    
    currentDB.devotees.unshift({
      id: 'DEV-' + Math.floor(1000 + Math.random() * 9000),
      name: newDonorName,
      phone: newDonorPhone || '9866125609',
      email: newDonorEmail || 'sriramasevacommitteepvv@gmail.com',
      city: newDonorCity || 'పామినివాండ్లవూరు',
      registeredAt: new Date().toLocaleDateString('te-IN')
    });

    saveDB(currentDB);
    setDbState({ ...currentDB, donations: [...currentDB.donations], devotees: [...currentDB.devotees] });
    addAuditLog(userRole, `Added New Donor (${newDonorName}, ₹${newDonorAmount})`);

    showToast("దాత వివరాలు విజయవంతంగా డేటాబేస్‌లో రికార్డ్ అయ్యాయి!");
    setNewDonorName('');
    setNewDonorPhone('');
    setNewDonorEmail('');
    setNewDonorCity('');
    setNewDonorAmount('');
  };

  // Delete Donation Record
  const handleDeleteDonation = (id) => {
    const currentDB = getDB();
    currentDB.donations = currentDB.donations.filter(d => d.id !== id);
    saveDB(currentDB);
    setDbState({ ...currentDB, donations: [...currentDB.donations] });
    addAuditLog(userRole, `Deleted Donation Record (${id})`);
    showToast("విరాళం రికార్డు తొలిగించబడింది.");
  };

  // Admin Portal Receipt Generation with Persistent Save
  const handleGenerateReceipt = (e) => {
    e.preventDefault();
    if (!receiptName || !receiptAmount) {
      showToast("దయచేసి దాత పేరు మరియు మొత్తం నమోదు చేయండి.");
      return;
    }

    const currentDB = getDB();
    const receiptNo = 'SRS-ERP-' + Math.floor(100000 + Math.random() * 900000);
    const currentDate = new Date().toLocaleDateString('te-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    // Save record to DB if not already present
    const existing = currentDB.donations.find(d => d.donorName.toLowerCase() === receiptName.toLowerCase() && parseInt(d.amount) === parseInt(receiptAmount));
    if (!existing) {
      currentDB.donations.unshift({
        id: receiptNo,
        donorName: receiptName,
        phone: receiptPhone || 'N/A',
        amount: parseInt(receiptAmount),
        date: currentDate,
        seva: receiptSeva,
        mode: receiptMode,
        city: receiptCity || 'పామినివాండ్లవూరు'
      });
      saveDB(currentDB);
      setDbState({ ...currentDB, donations: [...currentDB.donations] });
    }

    setGeneratedReceipt({
      receiptNo,
      date: currentDate,
      name: receiptName,
      amount: receiptAmount,
      phone: receiptPhone || 'N/A',
      city: receiptCity || 'పామినివాండ్లవూరు',
      seva: receiptSeva,
      mode: receiptMode
    });

    addAuditLog(userRole, `Generated Receipt (${receiptNo} for ${receiptName})`);
    try { confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); } catch (err) {}
    showToast("ERP డిజిటల్ రశీదు విజయవంతంగా రూపొందించబడింది!");
  };

  // Add Expense
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpCat || !newExpAmt) return;

    const currentDB = getDB();
    const newExp = {
      id: 'EXP-' + Math.floor(100 + Math.random() * 900),
      category: newExpCat,
      amount: parseInt(newExpAmt),
      date: new Date().toLocaleDateString('te-IN'),
      billNo: 'BILL-' + Math.floor(1000 + Math.random() * 9000),
      vendor: newExpVendor || 'General Vendor'
    };

    currentDB.expenses.unshift(newExp);
    saveDB(currentDB);
    setDbState({ ...currentDB, expenses: [...currentDB.expenses] });
    addAuditLog(userRole, `Recorded Expense: ${newExpCat} (₹${newExpAmt})`);

    setNewExpCat('');
    setNewExpAmt('');
    setNewExpVendor('');
    showToast("ఖర్చు వివరాలు రికార్డ్ అయ్యాయి.");
  };

  // Add Material Donation
  const handleAddMaterial = (e) => {
    e.preventDefault();
    if (!newMatType || !newMatQty) return;

    const currentDB = getDB();
    currentDB.materials.unshift({
      id: 'MAT-' + (currentDB.materials.length + 1),
      type: newMatType,
      qty: newMatQty,
      donor: newMatDonor || 'Anonymous Devotee'
    });

    saveDB(currentDB);
    setDbState(currentDB);
    addAuditLog(userRole, `Added Material Donation: ${newMatType} (${newMatQty})`);

    setNewMatQty('');
    setNewMatDonor('');
    showToast("సామగ్రి విరాళం నమోదైంది!");
  };

  // Add Volunteer
  const handleAddVolunteer = (e) => {
    e.preventDefault();
    if (!newVolName) return;

    const currentDB = getDB();
    currentDB.volunteers.unshift({
      id: 'VOL-' + (currentDB.volunteers.length + 1),
      name: newVolName,
      phone: newVolPhone || '9866125609',
      task: newVolTask || 'సాధారణ సేవ',
      status: 'Active'
    });

    saveDB(currentDB);
    setDbState(currentDB);
    addAuditLog(userRole, `Added Volunteer: ${newVolName}`);

    setNewVolName('');
    setNewVolPhone('');
    setNewVolTask('');
    showToast("వాలంటీర్ చేర్చబడ్డారు!");
  };

  // Toggle Public Website Visibility Settings
  const handleToggleWebsiteSetting = (settingKey) => {
    const currentDB = getDB();
    if (!currentDB.websiteSettings) currentDB.websiteSettings = { ...defaultWebsiteSettings };
    currentDB.websiteSettings[settingKey] = !currentDB.websiteSettings[settingKey];
    
    saveDB(currentDB);
    setDbState(currentDB);
    addAuditLog(userRole, `Toggled Website Visibility: ${settingKey} -> ${currentDB.websiteSettings[settingKey]}`);
    showToast(`వెబ్‌సైట్ విభాగం మార్పు నవీకరించబడింది (${settingKey}: ${currentDB.websiteSettings[settingKey] ? 'ON' : 'OFF'})`);
  };

  // Helper to compress single image file to lightweight Base64 JPEG data URL
  const compressGalleryImageFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawUrl = e.target.result;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 850;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = () => resolve(rawUrl);
        img.src = rawUrl;
      };
      reader.readAsDataURL(file);
    });
  };

  // Upload single or multiple files for Gallery & Slideshow
  const handleMultipleFileUploadForGallery = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    showToast(`${files.length} ఫోటోలు కాంప్రెస్ చేయబడుతున్నాయి, దయచేసి వేచివుండండి...`);

    const currentDB = getDB();
    if (!currentDB.galleryImages) currentDB.galleryImages = [];

    const baseTitle = newImgTitle.trim() || 'ఆలయ శోభిత ఫోటో';
    const baseTag = newImgTag.trim() || 'పామినివాండ్లవూరు ఆలయం';

    let addedCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const compressedUrl = await compressGalleryImageFile(file);
      const title = files.length === 1 ? baseTitle : `${baseTitle} - ${i + 1}`;

      const newPhoto = {
        id: 'IMG-' + (currentDB.galleryImages.length + 1) + '-' + Date.now().toString().slice(-4) + '-' + i,
        src: compressedUrl,
        title: title,
        tag: baseTag
      };

      currentDB.galleryImages.push(newPhoto);
      addedCount++;
    }

    saveDB(currentDB);
    setDbState({ ...currentDB });
    addAuditLog(userRole, `Batch Uploaded ${addedCount} Images to Gallery & Slideshow`);

    setNewImgTitle('');
    setNewImgTag('');
    setNewImgSrc('');
    e.target.value = ''; // Reset input
    showToast(`🎉 ${addedCount} ఫోటోలు ఒకేసారి గ్యాలరీ & స్లైడ్‌షోకు విజవంతంగా జోడించబడ్డాయి!`);
  };

  // Add Gallery & Slideshow Image via URL
  const handleAddGalleryImage = (e) => {
    e.preventDefault();
    if (!newImgTitle || !newImgSrc) {
      showToast("దయచేసి ఫోటో శీర్షిక మరియు ఫోటోను నమోదు చేయండి.");
      return;
    }

    const currentDB = getDB();
    if (!currentDB.galleryImages) currentDB.galleryImages = [];

    const newPhoto = {
      id: 'IMG-' + (currentDB.galleryImages.length + 1) + '-' + Date.now().toString().slice(-4),
      src: newImgSrc,
      title: newImgTitle,
      tag: newImgTag || 'పామినివాండ్లవూరు ఆలయం'
    };

    currentDB.galleryImages.push(newPhoto);
    saveDB(currentDB);
    setDbState(currentDB);
    addAuditLog(userRole, `Added Gallery Image to End: ${newImgTitle}`);

    setNewImgTitle('');
    setNewImgTag('');
    setNewImgSrc('');
    showToast("కొత్త ఫోటో గ్యాలరీ & స్లైడ్‌షోకు జోడించబడింది!");
  };

  // Delete Gallery Image
  const handleDeleteGalleryImage = (imageId) => {
    const currentDB = getDB();
    if (!currentDB.galleryImages) return;

    if (!currentDB.deletedGalleryImageIds) currentDB.deletedGalleryImageIds = [];
    if (!currentDB.deletedGalleryImageIds.includes(String(imageId))) {
      currentDB.deletedGalleryImageIds.push(String(imageId));
    }

    currentDB.galleryImages = currentDB.galleryImages.filter(img => String(img.id) !== String(imageId));

    saveDB(currentDB);
    setDbState({ ...currentDB });
    addAuditLog(userRole, `Deleted Gallery Image ID: ${imageId}`);
    showToast("ఫోటో శాశ్వతంగా తొలగించబడింది!");
  };

  // Set Gallery Image as First Slide
  const handleSetFirstGalleryImage = (imageId) => {
    const currentDB = getDB();
    if (!currentDB.galleryImages) return;
    const imgIdx = currentDB.galleryImages.findIndex(img => String(img.id) === String(imageId));
    if (imgIdx > -1) {
      const [selectedImg] = currentDB.galleryImages.splice(imgIdx, 1);
      currentDB.galleryImages.unshift(selectedImg);
      saveDB(currentDB);
      setDbState(currentDB);
      addAuditLog(userRole, `Set Gallery Image '${selectedImg.title}' as First Slide`);
      showToast(`'${selectedImg.title}' మొదటి స్లైడ్ ఫోటోగా అమర్చబడింది!`);
    }
  };

  // Pixel-Perfect A4 Standard PDF Generation for Reports
  const downloadReportPDF = async () => {
    if (!reportRef.current) return;
    showToast("అధికారిక ERP నివేదిక PDF సిద్ధమవుతోంది...");
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: '#FFFDF0' });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Sri_Rama_ERP_${activeReportType.toUpperCase()}_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      showToast("ERP నివేదిక PDF విజయవంతంగా డౌన్‌లోడ్ అయింది!");
    } catch (err) {
      console.error(err);
      showToast("PDF సృష్టించడంలో సమస్య వచ్చింది.");
    }
  };

  // Download Receipt PDF Function (Auto-scaled to fit A4 page completely without bottom cutoff)
  const downloadReceiptPDF = async () => {
    if (!receiptRef.current || !generatedReceipt) return;
    showToast("రశీదు PDF డౌన్‌లోడ్ ప్రారంభమైంది...");
    try {
      const element = receiptRef.current;
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
      pdf.save(`SRI_RAMA_ERP_RECEIPT_${generatedReceipt.receiptNo}.pdf`);
      showToast("రశీదు PDF విజయవంతంగా డౌన్‌లోడ్ చేయబడింది!");
    } catch (err) {
      console.error("PDF generation error:", err);
      showToast("PDF సృష్టించడంలో సమస్య వచ్చింది.");
    }
  };

  // Export Receipt Image (PNG)
  const downloadReceiptImage = async () => {
    if (!receiptRef.current) return;
    showToast("రశీదు ఇమేజ్ (PNG) సిద్ధమవుతోంది...");
    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 3, useCORS: true, backgroundColor: '#FFFDF0' });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Sri_Rama_ERP_Receipt_${generatedReceipt.receiptNo}.png`;
      link.click();
      showToast("ఇమేజ్ (PNG) డౌన్‌లోడ్ అయింది!");
    } catch (err) {
      console.error(err);
    }
  };

  // Share Report Image via WhatsApp
  const shareReportWhatsApp = async () => {
    if (!reportRef.current) return;
    showToast("నివేదిక WhatsApp లో షేర్ చేయడానికి సిద్ధమవుతోంది...");
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: '#FFFDF0' });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `Sri_Rama_ERP_Report.png`, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `శ్రీ రామా సేవా కమిటీ ERP నివేదిక`,
            text: `🚩 శ్రీ రామా సేవా కమిటీ పామినివాండ్లవూరు - అధికారిక ${activeReportType} నివేదిక`,
            files: [file]
          });
        } else {
          const text = encodeURIComponent(`🚩 శ్రీ రామా సేవా కమిటీ పామినివాండ్లవూరు - అధికారిక ${activeReportType} నివేదిక సారాంశం (https://thanerurajesh2410.github.io/sri-rama-seva-committee/)`);
          window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
        }
      }, 'image/png');
    } catch (err) {
      console.error(err);
    }
  };



  // Total Calculations
  const totalDonationSum = db.donations.reduce((acc, curr) => {
    const num = typeof curr.amount === 'number' ? curr.amount : parseInt(String(curr.amount).replace(/\D/g, '')) || 0;
    return acc + num;
  }, 0);

  const totalExpenseSum = db.expenses.reduce((acc, curr) => {
    const num = typeof curr.amount === 'number' ? curr.amount : parseInt(String(curr.amount).replace(/\D/g, '')) || 0;
    return acc + num;
  }, 0);

  return (
    <div className="bg-[#090914] text-white min-h-screen py-6 sacred-temple-bg-masked">
      <div className="w-full px-4 md:px-8 lg:px-12 max-w-full">
        
        {!isAuthenticated ? (
          /* Enlarged Royal Divine God Login Popup Card */
          <div className="my-8 md:my-14 flex justify-center items-center">
            <div className="gold-card max-w-2xl md:max-w-3xl w-full !p-8 md:!p-12 border-4 border-[#FFD700] text-center shadow-[0_0_60px_rgba(255,215,0,0.45)] relative overflow-hidden bg-gradient-to-b from-[#4A0E17]/95 via-[#2D080E]/95 to-[#1A0306]/98 rounded-3xl">
              
              {/* Background God Photo Halo Watermark Overlay */}
              <div
                className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none"
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
                  <div className="absolute -bottom-2 right-1 bg-[#5C121E] text-[#FFD700] p-2 rounded-full border-2 border-[#FFD700] shadow-lg">
                    <Lock className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                </div>

                <span className="bg-[#FFD700] text-[#4A0E17] font-black px-4 py-1 rounded-full text-xs md:text-sm uppercase tracking-wider shadow-md mb-2">
                  🚩 శ్రీ రామా సేవా కమిటీ • పామినివాండ్లవూరు
                </span>

                <h3 className="text-2xl md:text-4xl font-black text-white heading-telugu mb-2 leading-tight text-shadow-gold">
                  శ్రీ రామాలయం ERP డేటాబేస్ పోర్టల్ లాగిన్
                </h3>
                <p className="text-xs md:text-base text-amber-300 font-bold max-w-xl mx-auto">
                  శ్రీ రామాలయ నిర్మాణ విరాళాలు, రశీదుల జారీ & రియల్-టైమ్ ఆడిటింగ్ అడ్మిన్ వ్యవస్థ
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="relative z-10 space-y-6 max-w-md mx-auto">
                <div className="space-y-2">
                  <label className="block text-xs md:text-sm font-black text-amber-200 uppercase tracking-widest">
                    అడ్మిన్ పాస్‌కోడ్ నమోదు చేయండి (Enter Admin PIN)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="అడ్మిన్ PIN (ఉదా: 1252026)"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full bg-[#1A0306]/90 border-3 border-[#FFD700] text-amber-300 rounded-2xl p-4 text-center text-xl md:text-2xl font-mono focus:outline-none focus:ring-4 focus:ring-[#FFD700]/50 shadow-inner placeholder-gray-500 font-bold"
                  />
                </div>

                {passError && (
                  <div className="p-3 rounded-xl bg-red-950/90 border border-red-500 text-xs md:text-sm text-red-300 font-bold animate-bounce">
                    ⚠️ {passError}
                  </div>
                )}

                <button type="submit" className="btn-gold w-full py-4 text-base md:text-xl font-black shadow-2xl tracking-wide rounded-2xl border-2 border-yellow-200 transform hover:scale-[1.02] active:scale-95 transition-all">
                  <span>✨ ERP డేటాబేస్‌లోకి ప్రవేశించండి (Login Now)</span>
                </button>
              </form>

              {/* Official Committee Footnote Badge */}
              <div className="relative z-10 mt-8 pt-6 border-t border-white/10 text-xs text-amber-200/80 font-bold flex flex-col sm:flex-row items-center justify-between gap-2">
                <span>📍 డోర్ నం: 5-233, పామినివాండ్లవూరు, మంగళపల్లె</span>
                <span>🏛️ SBI A/C: 45274946370 • IFSC: SBIN0005691</span>
              </div>

            </div>
          </div>
        ) : (
          /* ERP Main Control Dashboard Suite */
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top Bar Header */}
            <div className="gold-card border-3 border-[#FFD700] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 !p-6">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-[#5C121E] text-[#FFD700] border-2 border-[#FFD700] shadow-lg">
                  <LayoutDashboard className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-white heading-telugu">
                    శ్రీ రామాలయం ERP అడ్మిన్ పోర్టల్
                  </h2>
                  <p className="text-sm md:text-base text-amber-300 font-bold mt-0.5">
                    రోల్: <span className="text-white font-mono bg-black/60 px-2 py-0.5 rounded">{userRole}</span> • మంగళపల్లె పంచాయతీ
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="bg-[#1A0306] border-2 border-[#FFD700] text-amber-300 rounded-xl p-2.5 text-sm font-bold shadow-md focus:outline-none"
                >
                  <option value="ADMIN / CHIEF EXECUTIVE">Admin / Chief Executive</option>
                  <option value="TREASURER (కోశాధికారి)">Treasurer (కోశాధికారి)</option>
                  <option value="SECRETARY (కార్యదర్శి)">Secretary (కార్యదర్శి)</option>
                  <option value="AUDITOR (ఆడిటర్)">Auditor (ఆడిటర్)</option>
                </select>

                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-black bg-red-600/40 text-red-200 border-2 border-red-500/60 hover:bg-red-600 hover:text-white transition-all shadow-lg"
                >
                  లాగౌట్ (Logout)
                </button>
              </div>
            </div>

                {/* Navigation Tabs Bar - Perfectly Aligned */}
                <div className="flex flex-wrap items-center justify-start md:justify-center gap-2 md:gap-3 border-b border-white/10 pb-4 text-base md:text-lg xl:text-[19px] font-black">
                  {[
                    { id: 'dashboard', label: '📊 డ్యాష్‌బోర్డ్' },
                    { id: 'donations', label: '🧾 రశీదుల జారీ' },
                    { id: 'donors', label: '👤 దాతల CRM' },
                    { id: 'expenses', label: '💸 ఖర్చులు & బిల్లులు' },
                    { id: 'reports', label: '📥 నివేదికలు & షేరింగ్' },
                    { id: 'materials', label: '🏗️ సామగ్రి విరాళాలు' },
                    { id: 'volunteers', label: '🤝 వాలంటీర్లు' },
                    { id: 'website-settings', label: '⚙️ వెబ్‌సైట్ విభాగాలు' },
                    { id: 'media-manager', label: '🏷️ లోగో & QR మేనేజర్' },
                    { id: 'gallery-manager', label: '🖼️ గ్యాలరీ & స్లైడ్‌షో ఫోటోలు' },
                    { id: 'poster-designer', label: '🎨 పోస్టర్లు, పాంప్లెట్లు & రశీదు పుస్తకం' },
                    { id: 'audit', label: '📋 ఆడిట్ & డేటాబేస్' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 xl:px-5 py-2.5 xl:py-3 rounded-xl xl:rounded-2xl transition-all shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-[#5C121E] text-[#FFD700] border-2 md:border-3 border-[#FFD700] shadow-2xl font-black scale-105'
                      : 'bg-white/10 text-gray-200 border border-white/20 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: EXECUTIVE DASHBOARD WIDGETS */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="gold-card text-center !p-4 md:!p-5">
                    <span className="text-xs sm:text-sm text-gray-300 font-extrabold uppercase block mb-1">మొత్తం విరాళాలు</span>
                    <span className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-300 font-mono">₹ {totalDonationSum.toLocaleString()}</span>
                  </div>
                  <div className="gold-card text-center !p-4 md:!p-5">
                    <span className="text-xs sm:text-sm text-gray-300 font-extrabold uppercase block mb-1">మొత్తం ఖర్చులు</span>
                    <span className="text-xl sm:text-2xl lg:text-3xl font-black text-sky-400 font-mono">₹ {totalExpenseSum.toLocaleString()}</span>
                  </div>
                  <div className="gold-card text-center !p-4 md:!p-5">
                    <span className="text-xs sm:text-sm text-gray-300 font-extrabold uppercase block mb-1">నిల్వ నిధి (Balance)</span>
                    <span className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-400 font-mono">₹ {(totalDonationSum - totalExpenseSum).toLocaleString()}</span>
                  </div>
                  <div className="gold-card text-center !p-4 md:!p-5">
                    <span className="text-xs sm:text-sm text-gray-300 font-extrabold uppercase block mb-1">నమోదైన భక్తులు</span>
                    <span className="text-xl sm:text-2xl lg:text-3xl font-black text-purple-300 font-mono">{db.devotees.length} భక్తులు</span>
                  </div>
                  <div className="gold-card text-center !p-4 md:!p-5">
                    <span className="text-xs sm:text-sm text-gray-300 font-extrabold uppercase block mb-1">విరాళాల రికార్డులు</span>
                    <span className="text-xl sm:text-2xl lg:text-3xl font-black text-[#FFD700] font-mono">{db.donations.length}</span>
                  </div>
                  <div className="gold-card text-center !p-4 md:!p-5">
                    <span className="text-xs sm:text-sm text-gray-300 font-extrabold uppercase block mb-1">ఆడిట్ లాగ్స్</span>
                    <span className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-300 font-mono">{db.auditLogs.length}</span>
                  </div>
                </div>

                {/* Database Verification Info Card */}
                <div className="gold-card border-3 border-[#FFD700] p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Database className="w-7 h-7 text-[#FFD700]" />
                      <h4 className="text-base sm:text-xl font-black text-white">డేటాబేస్ తనిఖీ వివరాలు (Database Key Info):</h4>
                    </div>
                    <button onClick={downloadDatabaseJSON} className="btn-gold text-sm sm:text-base py-2.5 px-5 flex items-center gap-2 rounded-xl font-bold">
                      <Download className="w-5 h-5" /> డేటాబేస్ JSON బ్యాకప్ డౌన్‌లోడ్
                    </button>
                  </div>
                  <p className="text-sm sm:text-base text-amber-200 mt-3 font-mono">
                    Storage Key: <span className="text-white font-bold bg-black/70 px-3 py-1 rounded-xl">sri_rama_erp_database_v2_v3</span> (Browser LocalStorage)
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: DONATION RECEIPT GENERATOR */}
            {activeTab === 'donations' && (
              <div className="space-y-6">
                <form onSubmit={handleGenerateReceipt} className="bg-[#1A0306] p-6 sm:p-8 rounded-3xl border-2 border-[#FFD700]/50 space-y-6 shadow-2xl">
                  <h4 className="text-xl sm:text-2xl font-black text-[#FFD700] heading-telugu flex items-center gap-3">
                    <Receipt className="w-7 h-7 text-amber-400" />
                    <span>విరాళాల రశీదు సృష్టించు (Generate ERP Official Donor Receipt)</span>
                  </h4>

                  {/* 1. Donor Dropdown populated from database with ALL V1 Classic Donors */}
                  <div className="bg-[#3A0A11]/80 p-4 sm:p-5 rounded-2xl border-2 border-[#FFD700]">
                    <label className="block text-sm sm:text-base font-black text-amber-200 mb-2">
                      1. దాతల డేటాబేస్ నుండి ఎంచుకోండి (Select Donor Dropdown - All 16+ V1 Donors):
                    </label>
                    <select
                      value={selectedDonorId}
                      onChange={handleSelectDonorFromDropdown}
                      className="w-full bg-[#1A0306] border-2 border-[#FFD700] rounded-xl p-3.5 sm:p-4 text-base sm:text-lg text-white font-bold"
                    >
                      <option value="">-- డేటాబేస్ నుండి దాతను ఎంచుకోండి ({db.donations.length} దాతలు) --</option>
                      {db.donations.map((d, idx) => {
                        const numAmt = typeof d.amount === 'number' ? d.amount : parseInt(String(d.amount).replace(/\D/g, '')) || 0;
                        return (
                          <option key={d.id || idx} value={d.id}>
                            #{idx + 1} • {d.donorName} — ₹ {numAmt.toLocaleString()} ({d.seva}) • {d.date} ({d.city || 'పామినివాండ్లవూరు'})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm sm:text-base font-extrabold text-amber-200 mb-1.5">దాత పేరు (Donor Name) *</label>
                      <input
                        type="text"
                        required
                        placeholder="దాత పేరు"
                        value={receiptName}
                        onChange={(e) => setReceiptName(e.target.value)}
                        className="w-full bg-[#3A0A11] border-2 border-white/20 rounded-2xl p-3.5 sm:p-4 text-base sm:text-lg text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-extrabold text-amber-200 mb-1.5">విరాళం మొత్తం (₹) *</label>
                      <input
                        type="number"
                        required
                        placeholder="మొత్తం"
                        value={receiptAmount}
                        onChange={(e) => setReceiptAmount(e.target.value)}
                        className="w-full bg-[#3A0A11] border-2 border-white/20 rounded-2xl p-3.5 sm:p-4 text-base sm:text-lg text-[#FFD700] font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-extrabold text-amber-200 mb-1.5">విరాళం వర్గం / సేవ *</label>
                      <input
                        type="text"
                        required
                        placeholder="ఉదా: ఆలయ నిర్మాణం"
                        value={receiptSeva}
                        onChange={(e) => setReceiptSeva(e.target.value)}
                        className="w-full bg-[#3A0A11] border-2 border-white/20 rounded-2xl p-3.5 sm:p-4 text-base sm:text-lg text-white font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm sm:text-base font-extrabold text-amber-200 mb-1.5">పావతి మార్గం (Mode)</label>
                      <select
                        value={receiptMode}
                        onChange={(e) => setReceiptMode(e.target.value)}
                        className="w-full bg-[#3A0A11] border-2 border-white/20 rounded-2xl p-3.5 sm:p-4 text-base sm:text-lg text-white font-bold"
                      >
                        <option value="Online (UPI / PhonePe / GPay)">Online (UPI / PhonePe / GPay)</option>
                        <option value="Bank Transfer (NEFT/IMPS)">Bank Transfer (NEFT/IMPS)</option>
                        <option value="Cash (నగదు జారీ)">Cash (నగదు జారీ)</option>
                        <option value="Cheque (చెక్కు)">Cheque (చెక్కు)</option>
                        <option value="Demand Draft (DD)">Demand Draft (DD)</option>
                        <option value="In-kind (సామగ్రి కానుక)">In-kind (సామగ్రి కానుక)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-extrabold text-amber-200 mb-1.5">ఫోన్ నంబర్ (Phone)</label>
                      <input
                        type="tel"
                        placeholder="ఫోన్ నంబర్"
                        value={receiptPhone}
                        onChange={(e) => setReceiptPhone(e.target.value)}
                        className="w-full bg-[#3A0A11] border-2 border-white/20 rounded-2xl p-3.5 sm:p-4 text-base sm:text-lg text-white font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-extrabold text-amber-200 mb-1.5">స్థలం / ఊరు (City)</label>
                      <input
                        type="text"
                        placeholder="పామినివాండ్లవూరు"
                        value={receiptCity}
                        onChange={(e) => setReceiptCity(e.target.value)}
                        className="w-full bg-[#3A0A11] border-2 border-white/20 rounded-2xl p-3.5 sm:p-4 text-base sm:text-lg text-white font-bold"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-gold w-full py-4 text-base sm:text-xl font-black shadow-2xl rounded-2xl">
                    రశీదు రూపొందించు (Create ERP Official Receipt)
                  </button>
                </form>

                {/* Rendered Formal TTD-Style Receipt Card */}
                {generatedReceipt && (
                  <div className="space-y-4">
                    <div ref={receiptRef} className="bg-white text-black p-6 sm:p-8 rounded-xl border-2 border-gray-800 shadow-2xl relative overflow-hidden font-sans">
                      
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
                          <span className="text-sm sm:text-base font-mono font-black text-[#5C121E] bg-gray-100 px-3 py-1 rounded border border-gray-400 inline-block">{generatedReceipt.receiptNo}</span>
                        </div>
                      </div>

                      {/* Receipt Title Badge */}
                      <div className="text-center mb-4 relative z-10">
                        <h4 className="text-base sm:text-lg font-black text-[#5C121E] uppercase tracking-wide underline decoration-amber-600 underline-offset-4 heading-telugu">
                          శ్రీ రామాలయం విరాళం రశీదు / Official ERP Donor Receipt
                        </h4>
                      </div>

                      {/* TTD-Style Crisp Grid Table */}
                      <div className="border-2 border-gray-800 text-xs sm:text-sm mb-4 relative z-10 bg-white/90">
                        <div className="grid grid-cols-3 border-b border-gray-400">
                          <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">దాత ఐడీ (Donor ID):</div>
                          <div className="p-2.5 font-mono font-black col-span-2 text-gray-900">{generatedReceipt.receiptNo}</div>
                        </div>

                        <div className="grid grid-cols-3 border-b border-gray-400">
                          <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">తేదీ & సమయం (Date & Time):</div>
                          <div className="p-2.5 font-mono font-bold col-span-2 text-gray-900">{generatedReceipt.date}</div>
                        </div>

                        <div className="grid grid-cols-3 border-b border-gray-400">
                          <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">ఆలయ ట్రస్ట్ పేరు (Trust Name):</div>
                          <div className="p-2.5 font-bold col-span-2 text-[#5C121E]">SRI RAMA SEVA COMMITTEE PAMINIVANDLAVOORU</div>
                        </div>

                        <div className="grid grid-cols-3 border-b border-gray-400 bg-amber-50">
                          <div className="p-2.5 font-black bg-amber-100 border-r border-gray-400 text-sm sm:text-base text-[#5C121E]">విరాళం కానుక మొత్తం (Donation Amount):</div>
                          <div className="p-2.5 font-mono font-black text-lg text-emerald-800 col-span-2">Rs. {parseInt(generatedReceipt.amount || 0).toLocaleString()} /-</div>
                        </div>

                        <div className="grid grid-cols-3 border-b border-gray-400">
                          <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">దాత పేరు (Primary Donor Name):</div>
                          <div className="p-2.5 font-black text-base col-span-2 text-gray-900">{generatedReceipt.name}</div>
                        </div>

                        <div className="grid grid-cols-3 border-b border-gray-400">
                          <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">ఫోన్ నంబర్ (Phone No):</div>
                          <div className="p-2.5 font-mono font-bold col-span-2 text-gray-800">{generatedReceipt.phone || '9866125609'}</div>
                        </div>

                        <div className="grid grid-cols-3 border-b border-gray-400">
                          <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">గ్రామం / ఊరు (Village / City):</div>
                          <div className="p-2.5 font-bold col-span-2 text-gray-900">{generatedReceipt.city || 'పామినివాండ్లవూరు'}</div>
                        </div>

                        <div className="grid grid-cols-3 border-b border-gray-400">
                          <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">విరాళం విభాగం & సేవ (Category & Seva):</div>
                          <div className="p-2.5 font-bold col-span-2 text-[#5C121E]">{generatedReceipt.seva}</div>
                        </div>

                        <div className="grid grid-cols-3">
                          <div className="p-2.5 font-bold bg-gray-100 border-r border-gray-400">చెల్లింపు మార్గం (Payment Mode):</div>
                          <div className="p-2.5 font-bold col-span-2 text-sky-800">{generatedReceipt.mode}</div>
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
                      <button onClick={downloadReceiptImage} className="btn-gold text-sm sm:text-base py-3.5 px-6 flex-1 rounded-2xl font-bold flex items-center justify-center gap-2">
                        🖼️ ఇమేజ్ (PNG) డౌన్‌లోడ్
                      </button>
                      <button onClick={downloadReceiptPDF} className="btn-primary text-sm sm:text-base py-3.5 px-6 flex-1 rounded-2xl font-bold flex items-center justify-center gap-2">
                        📄 PDF డౌన్‌లోడ్
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: DONOR CRM & UNIQUE REGISTRATION */}
            {activeTab === 'donors' && (
              <div className="space-y-6">
                
                {/* Form to Add Donor with Unique Phone & Email Validation */}
                <form onSubmit={handleAddDonorCRM} className="bg-[#1A0306] p-6 sm:p-8 rounded-3xl border-2 border-[#FFD700]/50 space-y-6 shadow-2xl">
                  <h4 className="text-xl sm:text-2xl font-black text-[#FFD700] heading-telugu flex items-center gap-3">
                    <Plus className="w-7 h-7 text-amber-400" />
                    <span>క్రొత్త దాత నమోదు (Add Donor with Category Dropdown)</span>
                  </h4>

                  {validationError && (
                    <div className="p-4 rounded-2xl bg-red-950/90 border-2 border-red-500 text-sm sm:text-base font-bold text-red-300 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <span>{validationError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm sm:text-base font-extrabold text-amber-200 mb-1.5">దాత పేరు (Full Name) *</label>
                      <input
                        type="text"
                        required
                        placeholder="పేరు నమోదు చేయండి"
                        value={newDonorName}
                        onChange={(e) => setNewDonorName(e.target.value)}
                        className="w-full bg-[#3A0A11] border-2 border-white/20 rounded-2xl p-3.5 sm:p-4 text-base sm:text-lg text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-extrabold text-amber-200 mb-1.5">ఫోన్ నంబర్ (Unique Phone)</label>
                      <input
                        type="tel"
                        placeholder="ఫోన్ నంబర్"
                        value={newDonorPhone}
                        onChange={(e) => setNewDonorPhone(e.target.value)}
                        className="w-full bg-[#3A0A11] border-2 border-white/20 rounded-2xl p-3.5 sm:p-4 text-base sm:text-lg text-white font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-extrabold text-amber-200 mb-1.5">ఇమెయిల్ ఐడీ (Unique Email)</label>
                      <input
                        type="email"
                        placeholder="ఇమెయిల్ ఐడీ"
                        value={newDonorEmail}
                        onChange={(e) => setNewDonorEmail(e.target.value)}
                        className="w-full bg-[#3A0A11] border-2 border-white/20 rounded-2xl p-3.5 sm:p-4 text-base sm:text-lg text-white font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm sm:text-base font-extrabold text-amber-200 mb-1.5">విరాళం మొత్తం (₹) *</label>
                      <input
                        type="number"
                        required
                        placeholder="ఉదా: 5000"
                        value={newDonorAmount}
                        onChange={(e) => setNewDonorAmount(e.target.value)}
                        className="w-full bg-[#3A0A11] border-2 border-white/20 rounded-2xl p-3.5 sm:p-4 text-base sm:text-lg text-[#FFD700] font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-extrabold text-amber-200 mb-1.5">విరాళం వర్గం / సేవా రకం (Category Dropdown) *</label>
                      <select
                        value={newDonorSeva}
                        onChange={(e) => setNewDonorSeva(e.target.value)}
                        className="w-full bg-[#3A0A11] border-2 border-[#FFD700]/70 rounded-2xl p-3.5 sm:p-4 text-base sm:text-lg text-white font-bold focus:outline-none"
                      >
                        {v2T.donationCategories.map(cat => (
                          <optgroup key={cat.id} label={cat.name} className="bg-[#1A0306] text-amber-300 font-bold">
                            {cat.subTypes.map((sub, idx) => (
                              <option key={idx} value={sub} className="bg-[#2A060B] text-white">
                                {sub}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-extrabold text-amber-200 mb-1.5">గ్రామం / స్థలం</label>
                      <input
                        type="text"
                        placeholder="పామినివాండ్లవూరు"
                        value={newDonorCity}
                        onChange={(e) => setNewDonorCity(e.target.value)}
                        className="w-full bg-[#3A0A11] border-2 border-white/20 rounded-2xl p-3.5 sm:p-4 text-base sm:text-lg text-white font-bold"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary w-full py-4 text-base sm:text-xl font-black shadow-2xl rounded-2xl">
                    + దాత వివరాలను డేటాబేస్‌లో చేర్చు (Save Donor Record)
                  </button>
                </form>

                {/* Donors List with Delete Button - Large & Clear Table */}
                <div className="gold-card space-y-4 !p-6 sm:!p-8">
                  <h3 className="text-xl sm:text-2xl font-black text-[#FFD700]">నమోదైన దాతల రికార్డులు ({db.donations.length})</h3>
                  <div className="max-h-[550px] overflow-y-auto bg-black/60 rounded-2xl border-2 border-white/20 p-4 text-sm sm:text-base">
                    <table className="w-full text-left border-collapse">
                      <thead className="text-[#FFD700] border-b-2 border-[#FFD700]/50 sticky top-0 bg-[#2D080E] z-10">
                        <tr>
                          <th className="p-3.5 font-black">#</th>
                          <th className="p-3.5 font-black">దాత పేరు</th>
                          <th className="p-3.5 font-black">ఫోన్</th>
                          <th className="p-3.5 font-black">మొత్తం</th>
                          <th className="p-3.5 font-black">వర్గం / సేవ</th>
                          <th className="p-3.5 font-black">తేదీ</th>
                          <th className="p-3.5 text-right font-black">చర్య</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/15">
                        {db.donations.map((d, idx) => {
                          const numAmt = typeof d.amount === 'number' ? d.amount : parseInt(String(d.amount).replace(/\D/g, '')) || 0;
                          return (
                            <tr key={d.id || idx} className="hover:bg-white/5 transition-colors">
                              <td className="p-3.5 font-mono font-bold text-gray-300">{idx + 1}</td>
                              <td className="p-3.5 font-extrabold text-white text-base sm:text-lg">{d.donorName}</td>
                              <td className="p-3.5 font-mono text-gray-200 font-bold">{d.phone}</td>
                              <td className="p-3.5 font-mono text-amber-300 font-black text-base sm:text-lg">₹ {numAmt.toLocaleString()}</td>
                              <td className="p-3.5 text-amber-100 font-bold">{d.seva}</td>
                              <td className="p-3.5 text-gray-300 font-mono font-bold">{d.date}</td>
                              <td className="p-3.5 text-right">
                                <button
                                  onClick={() => handleDeleteDonation(d.id)}
                                  className="p-2 rounded-xl bg-red-600/30 text-red-300 hover:bg-red-600 hover:text-white transition-colors"
                                  title="Delete Donor Record"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 4: EXPENSES MANAGEMENT */}
            {activeTab === 'expenses' && (
              <div className="space-y-6">
                <form onSubmit={handleAddExpense} className="gold-card space-y-5 !p-6 sm:!p-8">
                  <h4 className="text-xl sm:text-2xl font-black text-[#FFD700]">క్రొత్త ఖర్చు నమోదు (Record New Expense)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <input
                      type="text"
                      required
                      placeholder="ఖర్చు విభాగం"
                      value={newExpCat}
                      onChange={(e) => setNewExpCat(e.target.value)}
                      className="bg-[#1A0306] border-2 border-white/20 rounded-2xl p-3.5 sm:p-4 text-base sm:text-lg text-white font-bold"
                    />
                    <input
                      type="number"
                      required
                      placeholder="మొత్తం (₹)"
                      value={newExpAmt}
                      onChange={(e) => setNewExpAmt(e.target.value)}
                      className="bg-[#1A0306] border-2 border-white/20 rounded-2xl p-3.5 sm:p-4 text-base sm:text-lg text-[#FFD700] font-mono font-bold"
                    />
                    <input
                      type="text"
                      placeholder="వెండర్ / సంస్థ పేరు"
                      value={newExpVendor}
                      onChange={(e) => setNewExpVendor(e.target.value)}
                      className="bg-[#1A0306] border-2 border-white/20 rounded-2xl p-3.5 sm:p-4 text-base sm:text-lg text-white font-bold"
                    />
                  </div>
                  <button type="submit" className="btn-primary text-base sm:text-xl py-4 w-full rounded-2xl font-black shadow-2xl">
                    + ఖర్చు రికార్డ్ చేయి
                  </button>
                </form>

                <div className="gold-card space-y-4 !p-6 sm:!p-8">
                  <h4 className="text-xl sm:text-2xl font-black text-[#FFD700] mb-4">నమోదైన ఖర్చులు:</h4>
                  {db.expenses.map((e, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 rounded-2xl bg-black/60 border border-white/15">
                      <div>
                        <span className="font-black text-white text-base sm:text-lg block">{e.category}</span>
                        <span className="text-gray-300 block text-xs sm:text-sm font-bold mt-0.5">{e.date} • Vendor: {e.vendor}</span>
                      </div>
                      <span className="font-mono text-sky-300 font-black text-lg sm:text-xl">₹ {parseInt(e.amount).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: REPORTS & 1-CLICK SHARING SUITE */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                
                {/* Select Report Type Bar */}
                <div className="flex flex-wrap items-center gap-3 bg-[#1A0306] p-4 rounded-2xl border-2 border-[#FFD700]/40 text-sm sm:text-base font-bold">
                  <span className="text-amber-300 font-black">నివేదిక రకం ఎంచుకోండి (Select Report Type):</span>
                  {[
                    { id: 'financial', label: '📊 ఆర్థిక నివేదిక (Financial Summary)' },
                    { id: 'donors', label: '👥 దాతల నివేదిక (Donors Ledger)' },
                    { id: 'construction', label: '🏗️ నిర్మాణ నివేదిక (Construction Audit)' },
                    { id: 'audit', label: '📋 ఆడిట్ లాగ్ నివేదిక (Audit Logs)' }
                  ].map(r => (
                    <button
                      key={r.id}
                      onClick={() => setActiveReportType(r.id)}
                      className={`px-4 py-2.5 rounded-xl transition-all font-black text-sm sm:text-base ${
                        activeReportType === r.id ? 'bg-[#5C121E] text-[#FFD700] border-2 border-[#FFD700] shadow-lg scale-105' : 'bg-white/10 text-gray-200 hover:bg-white/20'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>

                {/* 📄 Printable Report Render Container */}
                <div ref={reportRef} className="bg-[#FFFDF0] text-[#2D080E] p-8 sm:p-10 rounded-3xl border-4 border-[#FFD700] shadow-2xl relative max-w-full overflow-hidden">
                  <div className="flex justify-between border-b-2 border-[#5C121E]/30 pb-5 mb-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={getActiveLogo()}
                        alt="Logo"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getAssetUrl('assets/logo.jpg');
                        }}
                        className="w-14 h-14 rounded-full border-2 border-amber-600 object-cover"
                      />
                      <div>
                        <h3 className="text-2xl font-black text-[#5C121E] heading-telugu">శ్రీ రామా సేవా కమిటీ పామినివాండ్లవూరు</h3>
                        <p className="text-sm font-bold text-amber-900">అధికారిక ERP {activeReportType.toUpperCase()} నివేదిక • {new Date().toLocaleDateString('te-IN')}</p>
                      </div>
                    </div>
                  </div>

                  {activeReportType === 'financial' && (
                    <div className="space-y-5 text-base sm:text-lg">
                      <div className="grid grid-cols-3 gap-5 text-center font-bold">
                        <div className="bg-amber-100 p-5 rounded-2xl border-2 border-amber-400">
                          <span className="block text-sm font-black text-gray-700">మొత్తం ఆదాయం</span>
                          <span className="text-2xl text-emerald-800 block font-mono font-black mt-1">₹ {totalDonationSum.toLocaleString()}</span>
                        </div>
                        <div className="bg-amber-100 p-5 rounded-2xl border-2 border-amber-400">
                          <span className="block text-sm font-black text-gray-700">మొత్తం వ్యయం</span>
                          <span className="text-2xl text-red-800 block font-mono font-black mt-1">₹ {totalExpenseSum.toLocaleString()}</span>
                        </div>
                        <div className="bg-amber-100 p-5 rounded-2xl border-2 border-amber-400">
                          <span className="block text-sm font-black text-gray-700">నిల్వ నిధి</span>
                          <span className="text-2xl text-sky-900 block font-mono font-black mt-1">₹ {(totalDonationSum - totalExpenseSum).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeReportType === 'donors' && (
                    <div className="text-sm sm:text-base">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#5C121E] text-white">
                            <th className="p-3 font-black">#</th>
                            <th className="p-3 font-black">దాత పేరు</th>
                            <th className="p-3 font-black">మొత్తం</th>
                            <th className="p-3 font-black">వర్గం / సేవ</th>
                            <th className="p-3 font-black">తేదీ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-200">
                          {db.donations.map((d, idx) => {
                            const numAmt = typeof d.amount === 'number' ? d.amount : parseInt(String(d.amount).replace(/\D/g, '')) || 0;
                            return (
                              <tr key={idx}>
                                <td className="p-3 font-mono font-bold">{idx + 1}</td>
                                <td className="p-3 font-black">{d.donorName}</td>
                                <td className="p-3 font-mono font-black text-amber-900">₹ {numAmt.toLocaleString()}</td>
                                <td className="p-3 font-bold">{d.seva}</td>
                                <td className="p-3 font-mono font-bold">{d.date}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 🚀 Download & Share Controls */}
                <div className="bg-black/60 p-5 rounded-2xl border-2 border-white/20 flex flex-wrap items-center gap-4 text-base font-bold">
                  <button onClick={downloadReportPDF} className="btn-primary py-3.5 px-6 flex-1 flex justify-center items-center gap-2 rounded-2xl text-base sm:text-lg">
                    <Download className="w-5 h-5" /> PDF డౌన్‌లోడ్
                  </button>
                  <button onClick={shareReportWhatsApp} className="btn-gold py-3.5 px-6 flex-1 flex justify-center items-center gap-2 rounded-2xl text-base sm:text-lg">
                    <Share2 className="w-5 h-5" /> WhatsApp ద్వారా నివేదిక షేర్ చేయి
                  </button>
                </div>

              </div>
            )}

            {/* TAB 6: MATERIALS DONATIONS */}
            {activeTab === 'materials' && (
              <div className="space-y-6">
                <form onSubmit={handleAddMaterial} className="gold-card space-y-5 !p-6 sm:!p-8">
                  <h4 className="text-xl sm:text-2xl font-black text-[#FFD700]">సామగ్రి విరాళం నమోదు (Material Donations Entry)</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm sm:text-base font-extrabold text-amber-200 mb-1.5">సామగ్రి పేరు (Item Name Dropdown) *</label>
                      <select
                        value={newMatType}
                        onChange={(e) => setNewMatType(e.target.value)}
                        className="w-full bg-[#1A0306] border-2 border-[#FFD700] rounded-2xl p-3.5 sm:p-4 text-base sm:text-lg text-white font-bold focus:outline-none"
                      >
                        {materialDropdownOptions.map((opt, idx) => (
                          <option key={idx} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-extrabold text-amber-200 mb-1.5">పరిమాణం (Quantity) *</label>
                      <input
                        type="text"
                        required
                        placeholder="ఉదా: 10 లోడ్లు / 50 బస్తాలు"
                        value={newMatQty}
                        onChange={(e) => setNewMatQty(e.target.value)}
                        className="w-full bg-[#1A0306] border-2 border-white/20 rounded-2xl p-3.5 sm:p-4 text-base sm:text-lg text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-extrabold text-amber-200 mb-1.5">దాత పేరు (Donor Name)</label>
                      <input
                        type="text"
                        placeholder="దాత పేరు నమోదు చేయండి"
                        value={newMatDonor}
                        onChange={(e) => setNewMatDonor(e.target.value)}
                        className="w-full bg-[#3A0A11] border-2 border-white/20 rounded-2xl p-3.5 sm:p-4 text-base sm:text-lg text-white font-bold"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary text-base sm:text-xl py-4 w-full font-black rounded-2xl shadow-2xl">
                    + సామగ్రి రికార్డ్ చేయి (Save Material Donation)
                  </button>
                </form>

                <div className="gold-card space-y-2">
                  <h4 className="text-sm font-bold text-[#FFD700]">సామగ్రి రికార్డులు (Material Ledger):</h4>
                  {db.materials.map((m, idx) => (
                    <div key={idx} className="flex justify-between p-3 rounded-lg bg-black/40 border border-white/10">
                      <span className="font-bold text-white text-sm">{m.type} ({m.qty})</span>
                      <span className="text-amber-300 font-bold">Donor: {m.donor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: VOLUNTEERS */}
            {activeTab === 'volunteers' && (
              <div className="gold-card space-y-4 text-xs">
                <h3 className="text-lg font-bold text-[#FFD700]">వాలంటీర్ల రికార్డులు ({db.volunteers.length})</h3>
                <form onSubmit={handleAddVolunteer} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="వాలంటీర్ పేరు"
                    value={newVolName}
                    onChange={(e) => setNewVolName(e.target.value)}
                    className="flex-1 bg-[#1A0306] border border-white/20 rounded-xl p-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="బాధ్యత"
                    value={newVolTask}
                    onChange={(e) => setNewVolTask(e.target.value)}
                    className="flex-1 bg-[#1A0306] border border-white/20 rounded-xl p-2 text-xs text-white"
                  />
                  <button type="submit" className="btn-gold text-xs px-4">చేర్చు</button>
                </form>

                <div className="space-y-2 pt-2">
                  {db.volunteers.map((v, idx) => (
                    <div key={idx} className="flex justify-between p-2.5 rounded-lg bg-black/40 border border-white/10">
                      <span className="font-bold text-white">{v.name} ({v.phone})</span>
                      <span className="text-amber-300">{v.task}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 9: PUBLIC WEBSITE DISPLAY VISIBILITY CONTROLLER */}
            {activeTab === 'website-settings' && (() => {
              const settings = db.websiteSettings || defaultWebsiteSettings;

              const toggleItems = [
                { key: 'showSlideshow', label: 'హోమ్ స్లైడ్‌షో బానర్ (Home Banner Slideshow)', desc: 'ప్రధాన హోమ్ పేజీలో ఫుల్ స్క్రీన్ ఫోటో స్లైడ్‌షో ప్రదర్శన' },
                { key: 'showAbout', label: 'ఆలయ విశేషాలు (About Temple)', desc: 'ఆలయ చరిత్ర & ట్రస్ట్ రిజిస్ట్రేషన్ వివరాలు' },
                { key: 'showDonations', label: 'ఈ-హుండి & విరాళాల వర్గాలు (Donations & E-Hundi)', desc: 'PhonePe QR స్కేనర్, బ్యాంక్ ఖాతా & విరాళాల డ్రాప్‌డౌన్' },
                { key: 'showCommittee', label: 'కమిటీ సభ్యులు (Committee Members)', desc: 'పాలక మండలి సభ్యులు, అధ్యక్షులు & హోదాలు' },
                { key: 'showTerms', label: 'ఆలయ నిబంధనలు (Terms & Conditions)', desc: 'విరాళాల పారదర్శకత & నిబంధనలు' },
                { key: 'showEvents', label: 'వార్షిక ఉత్సవాలు (Events & Festivals)', desc: 'శ్రీరామనవమి & ధార్మిక కార్యక్రమాలు' },
                { key: 'showGallery', label: 'ఫోటో గ్యాలరీ (Photo Gallery)', desc: 'శ్రీ రామాలయ నిర్మాణ ప్రగతి ఫోటోలు' },
                { key: 'showNews', label: 'వార్తలు & ప్రకటనలు (News & Press Releases)', desc: 'తాజా పత్రికా ప్రకటనలు' },
                { key: 'showReports', label: 'పారదర్శకత నివేదికలు (Financial Audit Reports)', desc: 'డబ్బుల జమ ఖర్చులు & లేడ్జర్' },
                { key: 'showContact', label: 'అధికారిక చిరునామా & WhatsApp ఫారం (Contact & WhatsApp Form)', desc: 'చిరునామా, ఇమెయిల్ & WhatsApp డైరెక్ట్ మెసేజ్ ఫారం' }
              ];

              return (
                <div className="space-y-6">
                  
                  {/* 🎨 GLOBAL SITE-WIDE COLOR THEME CONTROLLER */}
                  <div className="gold-card border-3 border-[#FB6C00] p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-700 pb-4">
                      <div className="flex items-center gap-3">
                        <Palette className="w-8 h-8 text-[#FB6C00] animate-pulse" />
                        <div>
                          <h3 className="text-xl sm:text-2xl font-black text-white heading-telugu flex items-center gap-2">
                            <span>🎨 వెబ్‌సైట్ మొత్తం రంగుల అమరిక (Entire Website Site-Wide Color Theme Selector)</span>
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-300 font-extrabold">
                            ఇక్కడ మీరు ఎంచుకున్న రంగు వెబ్‌సైట్ ప్రతి మూలకు, అన్ని బటన్లు, వ్యూ హెడర్‌లు, బాడ్జీలు, మ్యాప్‌లు మరియు పాపప్‌లకు ప్రపంచవ్యాప్తంగా వర్తిస్తుంది.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-slate-800/90 px-4 py-2 rounded-2xl border border-slate-700">
                        <span className="text-xs font-bold text-slate-300">ప్రస్తుత రంగు:</span>
                        <div className="w-6 h-6 rounded-full border-2 border-white shadow-inner" style={{ backgroundColor: settings.primaryColor || '#FB6C00' }} />
                        <span className="font-mono font-black text-sm text-[#FB6C00]">{settings.primaryColor || '#FB6C00'}</span>
                      </div>
                    </div>

                    {/* Color Input Controls & One-Click Presets */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Left: Custom Color Picker & Hex Input */}
                      <div className="space-y-4 bg-slate-800/60 p-5 rounded-2xl border border-slate-700">
                        <label className="block text-xs font-black text-slate-200 uppercase tracking-wider">
                          1. మీకు నచ్చిన రంగును పిక్ చేయండి లేదా Hex Code నమోదు చేయండి:
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={settings.primaryColor || '#FB6C00'}
                            onChange={(e) => {
                              const newColor = e.target.value;
                              const currentDB = getDB();
                              if (!currentDB.websiteSettings) currentDB.websiteSettings = { ...defaultWebsiteSettings };
                              currentDB.websiteSettings.primaryColor = newColor;
                              saveDB(currentDB);
                              setDbState({ ...currentDB });
                              document.documentElement.style.setProperty('--primary-theme-color', newColor);
                              document.documentElement.style.setProperty('--primary-saffron', newColor);
                              showToast(`ప్రైమరీ కలర్ థీమ్ మార్చబడింది! (${newColor})`);
                            }}
                            className="w-14 h-14 rounded-xl cursor-pointer bg-slate-900 border-2 border-slate-600 p-1 shadow-md shrink-0"
                            title="Color Spectrum Picker"
                          />
                          <input
                            type="text"
                            placeholder="#FB6C00"
                            value={settings.primaryColor || '#FB6C00'}
                            onChange={(e) => {
                              const newColor = e.target.value;
                              const currentDB = getDB();
                              if (!currentDB.websiteSettings) currentDB.websiteSettings = { ...defaultWebsiteSettings };
                              currentDB.websiteSettings.primaryColor = newColor;
                              saveDB(currentDB);
                              setDbState({ ...currentDB });
                              if (/^#[0-9A-F]{6}$/i.test(newColor)) {
                                document.documentElement.style.setProperty('--primary-theme-color', newColor);
                                document.documentElement.style.setProperty('--primary-saffron', newColor);
                              }
                            }}
                            className="w-full bg-slate-900 border-2 border-slate-700 text-white rounded-xl px-4 py-3 text-lg font-mono font-black focus:outline-none focus:border-[#FB6C00]"
                          />
                        </div>
                      </div>

                      {/* Right: Curated Authentic Color Presets */}
                      <div className="space-y-4 bg-slate-800/60 p-5 rounded-2xl border border-slate-700">
                        <label className="block text-xs font-black text-slate-200 uppercase tracking-wider">
                          2. ప్రముఖ సిద్ధమైన రంగుల పాలెట్లు (One-Click Preset Color Themes):
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {[
                            { name: 'విబ్రంట్ కాషాయం (Saffron Orange)', hex: '#FB6C00' },
                            { name: 'పవిత్ర కెంపు (Sacred Crimson)', hex: '#DC2626' },
                            { name: 'మరకత పచ్చ (Emerald Green)', hex: '#059669' },
                            { name: 'రాయల్ బ్లూ (Royal Blue)', hex: '#2563EB' },
                            { name: 'స్వర్ణ పసుపు (Golden Amber)', hex: '#D97706' },
                            { name: 'దివ్య ఊదా (Divine Purple)', hex: '#8B5CF6' },
                            { name: 'గులాబీ వర్ణం (Deep Rose)', hex: '#EC4899' },
                            { name: 'మిడ్‌నైట్ నలుపు (Midnight Slate)', hex: '#1E293B' },
                          ].map(preset => (
                            <button
                              key={preset.hex}
                              type="button"
                              onClick={() => {
                                const currentDB = getDB();
                                if (!currentDB.websiteSettings) currentDB.websiteSettings = { ...defaultWebsiteSettings };
                                currentDB.websiteSettings.primaryColor = preset.hex;
                                saveDB(currentDB);
                                setDbState({ ...currentDB });
                                document.documentElement.style.setProperty('--primary-theme-color', preset.hex);
                                document.documentElement.style.setProperty('--primary-saffron', preset.hex);
                                addAuditLog(userRole, `Changed Website Global Theme Color to ${preset.name} (${preset.hex})`);
                                showToast(`🎉 వెబ్‌సైట్ మొత్తం కలర్ థీమ్ ${preset.name} కి మార్చబడింది!`);
                              }}
                              className={`p-2.5 rounded-xl border-2 transition-all flex items-center gap-2 text-left active:scale-95 ${
                                (settings.primaryColor || '#FB6C00').toUpperCase() === preset.hex.toUpperCase()
                                  ? 'border-white bg-slate-700 shadow-lg ring-2 ring-[#FB6C00]'
                                  : 'border-slate-700 bg-slate-900/80 hover:bg-slate-700'
                              }`}
                            >
                              <span className="w-5 h-5 rounded-full shrink-0 border border-white/40 shadow-sm" style={{ backgroundColor: preset.hex }} />
                              <span className="text-[11px] font-bold text-white truncate">{preset.name.split(' ')[0]}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Real-time Dynamic Preview Card */}
                    <div className="p-4 rounded-2xl bg-slate-900 border-2 border-dashed border-slate-700 space-y-3">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                        👁️ రంగుల ప్రదర్శన (Live Dynamic Component Preview):
                      </span>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          className="px-5 py-2.5 rounded-full text-sm font-black text-white shadow-lg transition-all"
                          style={{ backgroundColor: settings.primaryColor || '#FB6C00' }}
                        >
                          ప్రధాన బటన్ (Primary Button)
                        </button>

                        <button
                          type="button"
                          className="px-5 py-2.5 rounded-full text-sm font-black transition-all bg-white border-2"
                          style={{ borderColor: settings.primaryColor || '#FB6C00', color: settings.primaryColor || '#FB6C00' }}
                        >
                          అవుట్‌లైన్ బటన్ (Outline Button)
                        </button>

                        <span
                          className="px-4 py-1.5 rounded-full text-xs font-black text-white shadow-md"
                          style={{ backgroundColor: settings.primaryColor || '#FB6C00' }}
                        >
                          🚩 లైవ్ బ్యాడ్జ్ (Live Badge)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="gold-card border-3 border-[#FFD700] p-6 rounded-3xl bg-gradient-to-r from-[#5C121E] via-[#3A0A11] to-[#5C121E]">
                    <div className="flex items-center gap-3 mb-2">
                      <Sliders className="w-8 h-8 text-[#FFD700]" />
                      <h3 className="text-xl sm:text-2xl font-black text-[#FFD700] heading-telugu">
                        పబ్లిక్ వెబ్‌సైట్ డిస్‌ప్లే కంట్రోలర్ (Public Website Visibility Manager)
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-200 font-bold">
                      ఇక్కడి టోగుల్ (Switch) ద్వారా పబ్లిక్ వెబ్‌సైట్‌లో ఏయే విభాగాలు లేదా పేజీలు కనిపించాలో అడ్మిన్ నేరుగా నియంత్రించవచ్చు.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {toggleItems.map(item => {
                      const isON = settings[item.key] !== false;
                      return (
                        <div
                          key={item.key}
                          className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 ${
                            isON
                              ? 'bg-gradient-to-r from-[#5C121E] to-[#2D080E] border-[#FFD700] shadow-xl'
                              : 'bg-black/60 border-white/10 opacity-70'
                          }`}
                        >
                          <div>
                            <h4 className="text-base sm:text-lg font-black text-white heading-telugu flex items-center gap-2">
                              <span>{item.label}</span>
                            </h4>
                            <p className="text-xs text-gray-300 font-semibold mt-1">{item.desc}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleWebsiteSetting(item.key)}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 border ${
                              isON
                                ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                                : 'bg-gray-800 text-gray-400 border-gray-600'
                            }`}
                          >
                            {isON ? <ToggleRight className="w-6 h-6 text-black fill-emerald-950" /> : <ToggleLeft className="w-6 h-6" />}
                            <span>{isON ? 'ప్రదర్శించు (VISIBLE)' : 'దాచు (HIDDEN)'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* TAB 10: GALLERY & SLIDESHOW IMAGES MANAGER */}
            {activeTab === 'gallery-manager' && (() => {
              const galleryList = Array.isArray(db.galleryImages) ? db.galleryImages : defaultGalleryImages;

              return (
                <div className="space-y-8">
                  {/* Upload Form */}
                  <form onSubmit={handleAddGalleryImage} className="gold-card bg-gradient-to-r from-[#5C121E] via-[#3A0A11] to-[#5C121E] border-3 border-[#FFD700] p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-white/20">
                      <Camera className="w-8 h-8 text-[#FFD700]" />
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-[#FFD700] heading-telugu">కొత్త ఫోటో జోడించండి (Upload New Image to Gallery & Slideshow)</h3>
                        <p className="text-xs sm:text-sm text-gray-200 font-bold">ఇక్కడ జోడించిన ఫోటోలు పబ్లిక్ వెబ్‌సైట్ స్లైడ్‌షో బానర్ మరియు గ్యాలరీలో ప్రదర్శించబడతాయి.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs sm:text-sm font-black text-amber-200 mb-1">1. ఫోటో శీర్షిక (Image Title) *</label>
                        <input
                          type="text"
                          required
                          placeholder="ఉదా: శ్రీ రామాలయ గర్భగుడి పూజ"
                          value={newImgTitle}
                          onChange={(e) => setNewImgTitle(e.target.value)}
                          className="w-full bg-[#1A0306] border-2 border-white/20 rounded-xl p-3.5 text-sm sm:text-base text-white font-extrabold focus:border-[#FFD700]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-black text-amber-200 mb-1">2. విభాగం టాగ్ (Category Tag)</label>
                        <input
                          type="text"
                          placeholder="ఉదా: రాతి గోడల నిర్మాణం"
                          value={newImgTag}
                          onChange={(e) => setNewImgTag(e.target.value)}
                          className="w-full bg-[#1A0306] border-2 border-white/20 rounded-xl p-3.5 text-sm sm:text-base text-white font-extrabold focus:border-[#FFD700]"
                        />
                      </div>
                    </div>

                    {/* Image Input Options */}
                    <div className="space-y-4 bg-black/60 p-5 rounded-2xl border border-white/15">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <label className="block text-xs sm:text-sm font-black text-amber-200">
                          3. ఫోటోలు ఎంచుకోండి (Select Multiple Images or Enter Single URL) *
                        </label>
                        <span className="text-[11px] font-black text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-400/50">
                          ✨ ఒకేసారి అనేక ఫోటోలు (Multiple Photos Upload Supported)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Option A: Multiple Files Upload */}
                        <div className="p-4 rounded-xl border-2 border-dashed border-[#FFD700] bg-[#1A0306] text-center flex flex-col items-center justify-center space-y-2">
                          <Upload className="w-8 h-8 text-[#FFD700] animate-bounce" />
                          <span className="text-xs sm:text-sm font-black text-white">ఒకేసారి అనేక ఫోటోలు ఎంచుకోండి (Multiple Upload)</span>
                          <span className="text-[11px] font-bold text-amber-300">CTRL నొక్కి ఒకేసారి 2 లేదా అంతకంటే ఎక్కువ ఫోటోలు సెలెక్ట్ చేయవచ్చు</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleMultipleFileUploadForGallery}
                            className="text-xs text-amber-200 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-[#FFD700] file:text-black cursor-pointer shadow-lg"
                          />
                        </div>

                        {/* Option B: Image URL */}
                        <div className="p-4 rounded-xl border-2 border-white/20 bg-[#1A0306] flex flex-col justify-center space-y-2">
                          <span className="text-xs font-bold text-gray-300">లేదా ఒక్క ఇమేజ్ URL నేరుగా నమోదు చేయండి:</span>
                          <input
                            type="text"
                            placeholder="https://... లేదా /assets/temple_photo_1.png"
                            value={newImgSrc}
                            onChange={(e) => setNewImgSrc(e.target.value)}
                            className="w-full bg-black border border-white/20 rounded-xl p-3 text-xs sm:text-sm text-white font-mono"
                          />
                        </div>
                      </div>

                      {/* Image Preview Box for URL entry */}
                      {newImgSrc && (
                        <div className="mt-3 p-3 rounded-xl bg-black border border-emerald-400 flex items-center gap-4">
                          <img src={newImgSrc} alt="Preview" className="w-24 h-16 object-cover rounded-lg border border-amber-300" />
                          <div>
                            <span className="text-xs font-black text-emerald-400 block">✓ ఫోటో ప్రివ్యూ సిద్ధంగా ఉంది</span>
                            <span className="text-xs text-gray-300 font-mono">{newImgTitle || 'శీర్షిక నమోదు చేయబడలేదు'}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <button type="submit" className="btn-gold w-full py-4 text-base font-black rounded-2xl shadow-xl flex items-center justify-center gap-2">
                      <Plus className="w-6 h-6" />
                      <span>URL ద్వారా ఫోటోను స్లైడ్‌షో & గ్యాలరీకి జోడించండి</span>
                    </button>
                  </form>

                  {/* Existing Photos Grid */}
                  <div className="gold-card bg-[#5C121E]/95 border-3 border-amber-400/80 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
                    <div className="flex justify-between items-center pb-3 border-b border-white/20">
                      <h3 className="text-xl sm:text-2xl font-black text-[#FFD700] heading-telugu flex items-center gap-3">
                        <ImageIcon className="w-7 h-7 text-amber-400" />
                        <span>ప్రస్తుత ఫోటోల జాబితా (Active Images - {galleryList.length})</span>
                      </h3>
                      <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-400/50">
                        {galleryList.length} Images
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {galleryList.map((img, idx) => (
                        <div key={img.id} className={`gold-card !p-4 bg-black/60 border-2 rounded-2xl flex flex-col justify-between space-y-3 relative ${idx === 0 ? 'border-[#FFD700] ring-2 ring-[#FFD700]/70' : 'border-white/20'}`}>
                          {idx === 0 && (
                            <span className="absolute top-2 right-2 bg-[#FFD700] text-black font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-lg z-10">
                              ⭐ మొదటి స్లైడ్ (1st Slide)
                            </span>
                          )}
                          <div className="aspect-video rounded-xl overflow-hidden bg-black border border-white/20">
                            <img src={img.src} alt={img.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="text-[11px] font-black text-amber-300 bg-[#5C121E] px-2.5 py-0.5 rounded-full border border-amber-400/40 inline-block mb-1">
                              {img.tag}
                            </span>
                            <h4 className="text-sm font-black text-white heading-telugu line-clamp-2">{img.title}</h4>
                          </div>
                          <div className="flex flex-col gap-2">
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetFirstGalleryImage(img.id)}
                                className="btn-gold text-xs !py-2 !px-3 rounded-xl w-full flex items-center justify-center gap-1.5 font-black shadow-md"
                              >
                                <Sparkles className="w-4 h-4 text-emerald-950" />
                                <span>⭐ మొదటి ఫోటోగా అమర్చు (Set as 1st)</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteGalleryImage(img.id)}
                              className="btn-outline text-xs !py-2 !px-3 text-red-400 border-red-500/50 hover:bg-red-600 hover:text-white rounded-xl w-full flex items-center justify-center gap-1.5 font-bold"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>తొలగించండి (Delete)</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* TAB: LOGO & PHONEPE QR CODE MEDIA MANAGER */}
            {activeTab === 'media-manager' && (
              <div className="space-y-6 animate-fadeIn">
                
                <div className="gold-card border-3 border-[#FFD700] p-6 rounded-3xl space-y-2 bg-gradient-to-r from-[#5C121E] via-[#3A0A11] to-[#5C121E]">
                  <h3 className="text-xl sm:text-2xl font-black text-[#FFD700] heading-telugu flex items-center gap-2">
                    <Camera className="w-7 h-7 text-amber-300" />
                    <span>ఆలయ లోగో & PhonePe QR కోడ్ మేనేజర్ (Fixed & Temporary Mode)</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-200">
                    ఇక్కడ లోగో మరియు QR కోడ్ స్కేనర్‌ను <strong className="text-[#FFD700]">శాశ్వతంగా (Fixed Permanent)</strong> లేదా <strong className="text-[#FFD700]">తాత్కాలికంగా (Temporary Time-bound)</strong> అప్‌లోడ్ చేయవచ్చు. అప్‌లోడ్ చేసిన ఇమేజ్ వెబ్‌సైట్‌లోని అన్ని విభాగాలు, రశీదులు మరియు పోస్టర్లలో ఆటోమేటిక్‌గా ప్రదర్శించబడుతుంది.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* 1. LOGO MANAGER CARD */}
                  <div className="gold-card border-2 border-amber-500/70 p-6 rounded-3xl space-y-5 bg-[#3A0A11]/90">
                    <div className="flex justify-between items-center border-b border-white/15 pb-3">
                      <h4 className="text-lg font-black text-[#FFD700] flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-amber-300" />
                        <span>1. ఆలయ లోగో మేనేజ్‌మెంట్</span>
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                        db.mediaAssets?.logo?.type === 'temporary' && Date.now() < (db.mediaAssets?.logo?.expiresAt || 0)
                          ? 'bg-amber-400 text-amber-950 animate-pulse'
                          : 'bg-emerald-600 text-white'
                      }`}>
                        {db.mediaAssets?.logo?.type === 'temporary' && Date.now() < (db.mediaAssets?.logo?.expiresAt || 0)
                          ? '🟡 తాత్కాలిక మోడ్ యాక్టివ్'
                          : '🟢 శాశ్వత (Fixed) మోడ్ యాక్టివ్'}
                      </span>
                    </div>

                    {/* Current Active Logo Preview */}
                    <div className="text-center space-y-2 bg-black/50 p-4 rounded-2xl border border-white/10">
                      <span className="text-xs text-gray-300 font-bold block uppercase">ప్రస్తుతం ప్రదర్శించబడుతున్న లోగో:</span>
                      <img src={getActiveLogo()} alt="Active Logo Preview" className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-[#FFD700] shadow-xl" />
                      {db.mediaAssets?.logo?.type === 'temporary' && Date.now() < (db.mediaAssets?.logo?.expiresAt || 0) && (
                        <p className="text-xs text-amber-300 font-mono font-bold pt-1">
                          ⏳ గడువు ముగిసే సమయం: {new Date(db.mediaAssets.logo.expiresAt).toLocaleString('te-IN')}
                        </p>
                      )}
                    </div>

                    <form onSubmit={handleSaveLogoAsset} className="space-y-4 pt-2">
                      <div>
                        <label className="block text-xs font-black text-amber-200 mb-1">కొత్త లోగో ఇమేజ్ ఎంచుకోండి (Select Image File):</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCustomImageUpload(setLogoNewFile)}
                          className="w-full text-xs text-gray-200 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-[#FFD700] file:text-black hover:file:bg-amber-300 cursor-pointer"
                        />
                      </div>

                      {/* Mode Selection: Fixed vs Temporary */}
                      <div className="space-y-2 bg-black/40 p-3.5 rounded-xl border border-white/10">
                        <span className="text-xs font-bold text-amber-300 block mb-1">సేవింగ్ రకం ఎంచుకోండి (Persistence Option):</span>
                        
                        <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                          <input
                            type="radio"
                            name="logoMode"
                            value="fixed"
                            checked={logoMode === 'fixed'}
                            onChange={() => setLogoMode('fixed')}
                            className="w-4 h-4 text-amber-500"
                          />
                          <span>🔴 శాశ్వతం (Fixed) - డేటాబేస్‌లో పర్మనెంట్‌గా సేవ్ అవుతుంది</span>
                        </label>

                        <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                          <input
                            type="radio"
                            name="logoMode"
                            value="temporary"
                            checked={logoMode === 'temporary'}
                            onChange={() => setLogoMode('temporary')}
                            className="w-4 h-4 text-amber-500"
                          />
                          <span>🟡 తాత్కాలికం (Temporary) - నిర్ణీత కాలం తర్వాత పాత డిఫాల్ట్‌కు మారుతుంది</span>
                        </label>

                        {logoMode === 'temporary' && (
                          <div className="pt-2">
                            <label className="block text-[11px] font-bold text-amber-200 mb-1">తాత్కాలిక గడువు సమయం (Expiry Duration):</label>
                            <select
                              value={logoTempDuration}
                              onChange={(e) => setLogoTempDuration(e.target.value)}
                              className="w-full bg-[#1A0306] border border-[#FFD700] rounded-lg p-2 text-xs text-white font-bold"
                            >
                              <option value="1">1 గంట (1 Hour)</option>
                              <option value="6">6 గంటలు (6 Hours)</option>
                              <option value="12">12 గంటలు (12 Hours)</option>
                              <option value="24">24 గంటలు / 1 రోజు (24 Hours / 1 Day)</option>
                              <option value="72">3 రోజులు (3 Days)</option>
                              <option value="168">7 రోజులు (7 Days)</option>
                            </select>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button type="submit" className="btn-gold text-xs py-2.5 px-4 font-black flex-1 flex items-center justify-center gap-1.5 shadow-lg">
                          <Upload className="w-4 h-4" />
                          <span>లోగో సేవ్ చేయి</span>
                        </button>
                        <button type="button" onClick={handleResetLogoAsset} className="px-3 py-2.5 rounded-xl font-black text-xs bg-gray-800 text-gray-200 hover:bg-gray-700 transition-all border border-gray-600">
                          రీసెట్
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* 2. QR CODE SCANNER MANAGER CARD */}
                  <div className="gold-card border-2 border-amber-500/70 p-6 rounded-3xl space-y-5 bg-[#3A0A11]/90">
                    <div className="flex justify-between items-center border-b border-white/15 pb-3">
                      <h4 className="text-lg font-black text-[#FFD700] flex items-center gap-2">
                        <QrCode className="w-5 h-5 text-amber-300" />
                        <span>2. PhonePe QR కోడ్ స్కేనర్ మేనేజ్‌మెంట్</span>
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                        db.mediaAssets?.qrCode?.type === 'temporary' && Date.now() < (db.mediaAssets?.qrCode?.expiresAt || 0)
                          ? 'bg-amber-400 text-amber-950 animate-pulse'
                          : 'bg-emerald-600 text-white'
                      }`}>
                        {db.mediaAssets?.qrCode?.type === 'temporary' && Date.now() < (db.mediaAssets?.qrCode?.expiresAt || 0)
                          ? '🟡 తాత్కాలిక మోడ్ యాక్టివ్'
                          : '🟢 శాశ్వత (Fixed) మోడ్ యాక్టివ్'}
                      </span>
                    </div>

                    {/* Current Active QR Preview */}
                    <div className="text-center space-y-2 bg-black/50 p-4 rounded-2xl border border-white/10">
                      <span className="text-xs text-gray-300 font-bold block uppercase">ప్రస్తుతం ప్రదర్శించబడుతున్న PhonePe QR:</span>
                      <img src={getActiveQrCode()} alt="Active QR Code Preview" className="w-28 h-28 mx-auto rounded-xl object-contain bg-white p-1 border-4 border-[#FFD700] shadow-xl" />
                      {db.mediaAssets?.qrCode?.type === 'temporary' && Date.now() < (db.mediaAssets?.qrCode?.expiresAt || 0) && (
                        <p className="text-xs text-amber-300 font-mono font-bold pt-1">
                          ⏳ గడువు ముగిసే సమయం: {new Date(db.mediaAssets.qrCode.expiresAt).toLocaleString('te-IN')}
                        </p>
                      )}
                    </div>

                    <form onSubmit={handleSaveQrAsset} className="space-y-4 pt-2">
                      <div>
                        <label className="block text-xs font-black text-amber-200 mb-1">కొత్త PhonePe QR కోడ్ ఇమేజ్ ఎంచుకోండి (Select Image File):</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCustomImageUpload(setQrNewFile)}
                          className="w-full text-xs text-gray-200 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-[#FFD700] file:text-black hover:file:bg-amber-300 cursor-pointer"
                        />
                      </div>

                      {/* Mode Selection: Fixed vs Temporary */}
                      <div className="space-y-2 bg-black/40 p-3.5 rounded-xl border border-white/10">
                        <span className="text-xs font-bold text-amber-300 block mb-1">సేవింగ్ రకం ఎంచుకోండి (Persistence Option):</span>
                        
                        <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                          <input
                            type="radio"
                            name="qrMode"
                            value="fixed"
                            checked={qrMode === 'fixed'}
                            onChange={() => setQrMode('fixed')}
                            className="w-4 h-4 text-amber-500"
                          />
                          <span>🔴 శాశ్వతం (Fixed) - డేటాబేస్‌లో పర్మనెంట్‌గా సేవ్ అవుతుంది</span>
                        </label>

                        <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                          <input
                            type="radio"
                            name="qrMode"
                            value="temporary"
                            checked={qrMode === 'temporary'}
                            onChange={() => setQrMode('temporary')}
                            className="w-4 h-4 text-amber-500"
                          />
                          <span>🟡 తాత్కాలికం (Temporary) - నిర్ణీత కాలం తర్వాత పాత డిఫాల్ట్‌కు మారుతుంది</span>
                        </label>

                        {qrMode === 'temporary' && (
                          <div className="pt-2">
                            <label className="block text-[11px] font-bold text-amber-200 mb-1">తాత్కాలిక గడువు సమయం (Expiry Duration):</label>
                            <select
                              value={qrTempDuration}
                              onChange={(e) => setQrTempDuration(e.target.value)}
                              className="w-full bg-[#1A0306] border border-[#FFD700] rounded-lg p-2 text-xs text-white font-bold"
                            >
                              <option value="1">1 గంట (1 Hour)</option>
                              <option value="6">6 గంటలు (6 Hours)</option>
                              <option value="12">12 గంటలు (12 Hours)</option>
                              <option value="24">24 గంటలు / 1 రోజు (24 Hours / 1 Day)</option>
                              <option value="72">3 రోజులు (3 Days)</option>
                              <option value="168">7 రోజులు (7 Days)</option>
                            </select>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button type="submit" className="btn-gold text-xs py-2.5 px-4 font-black flex-1 flex items-center justify-center gap-1.5 shadow-lg">
                          <Upload className="w-4 h-4" />
                          <span>QR కోడ్ సేవ్ చేయి</span>
                        </button>
                        <button type="button" onClick={handleResetQrAsset} className="px-3 py-2.5 rounded-xl font-black text-xs bg-gray-800 text-gray-200 hover:bg-gray-700 transition-all border border-gray-600">
                          రీసెట్
                        </button>
                      </div>
                    </form>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 11: POSTER, PAMPHLET & DONATION BOOK DESIGN STUDIO */}
            {activeTab === 'poster-designer' && (
              <div className="space-y-8 animate-fadeIn">
                {/* Studio Header Card */}
                <div className="gold-card bg-gradient-to-r from-[#5C121E] via-[#3A0A11] to-[#5C121E] border-3 border-[#FFD700] p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-[#FFD700]/20 border border-[#FFD700]/50 text-[#FFD700]">
                      <Sparkles className="w-10 h-10 animate-pulse" />
                    </div>
                    <div>
                      <span className="bg-amber-500 text-black font-black text-xs uppercase px-3 py-1 rounded-full inline-block mb-1">
                        ✨ డిజైన్ స్టుడియో • POSTER & PAMPHLET STUDIO
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-[#FFD700] heading-telugu">
                        పోస్టర్లు, పాంప్లెట్లు & రశీదు పుస్తకాల డిజైనర్
                      </h2>
                      <p className="text-sm text-gray-200 mt-1">
                        ఆలయ శంకుస్థాపన పోస్టర్లు, విరాళాల పిలుపు పాంప్లెట్లు మరియు ప్రింటబుల్ రశీదు పుస్తకాలను ఇక్కడే కస్టమైజ్ చేసి PDF / PNG లలో ఉచితంగా డౌన్‌లోడ్ చేసుకోండి.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={downloadDesignImage}
                      className="btn-gold text-sm py-3 px-5 rounded-2xl font-black flex items-center gap-2 shadow-xl"
                    >
                      <Camera className="w-5 h-5" />
                      <span>ఇమేజ్ డౌన్‌లోడ్ (PNG)</span>
                    </button>

                    <button
                      type="button"
                      onClick={downloadDesignPDF}
                      className="px-5 py-3 rounded-2xl font-black text-sm bg-emerald-600 text-white border-2 border-emerald-400 hover:bg-emerald-500 transition-all shadow-xl flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      <span>PDF డౌన్‌లోడ్ (Print PDF)</span>
                    </button>
                  </div>
                </div>

                {/* Designer Type Selector Pills */}
                <div className="flex flex-wrap gap-3 bg-[#3A0A11]/60 p-2 rounded-2xl border border-white/20">
                  <button
                    type="button"
                    onClick={() => setDesignerType('poster')}
                    className={`flex-1 min-w-[200px] py-3.5 px-6 rounded-xl font-extrabold text-base transition-all flex items-center justify-center gap-3 ${
                      designerType === 'poster'
                        ? 'bg-[#FFD700] text-[#5C121E] shadow-xl font-black scale-102 border-2 border-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <ImageIcon className="w-5 h-5" />
                    <span>1. ఆలయ శంకుస్థాపన & నిర్మాణ పోస్టర్</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDesignerType('pamphlet')}
                    className={`flex-1 min-w-[200px] py-3.5 px-6 rounded-xl font-extrabold text-base transition-all flex items-center justify-center gap-3 ${
                      designerType === 'pamphlet'
                        ? 'bg-[#FFD700] text-[#5C121E] shadow-xl font-black scale-102 border-2 border-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                    <span>2. ఆలయ ఆహ్వాన పత్రిక / పాంప్లెట్</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDesignerType('receipt_book')}
                    className={`flex-1 min-w-[200px] py-3.5 px-6 rounded-xl font-extrabold text-base transition-all flex items-center justify-center gap-3 ${
                      designerType === 'receipt_book'
                        ? 'bg-[#FFD700] text-[#5C121E] shadow-xl font-black scale-102 border-2 border-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <Receipt className="w-5 h-5" />
                    <span>3. ప్రింటబుల్ రశీదు పుస్తకం (Receipt Book)</span>
                  </button>
                </div>

                {/* Split Editor Grid: Controls on Left, Live Rendered Canvas on Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* LEFT COLUMN: CONTROLS & EDITABLE FORM (5 cols) */}
                  <div className="lg:col-span-5 bg-gradient-to-b from-[#4A0E17] to-[#2A060B] border-3 border-[#FFD700]/60 p-6 rounded-3xl shadow-2xl space-y-6 text-white">
                    
                    {/* TYPE 1: POSTER FORM */}
                    {designerType === 'poster' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-black text-[#FFD700] border-b border-white/20 pb-2 heading-telugu">
                          🎨 పోస్టర్ కస్టమైజేషన్ ఆప్షన్లు
                        </h3>

                        <div>
                          <label className="block text-xs font-bold text-amber-200 mb-1">ప్రధాన శీర్షిక (Main Title)</label>
                          <input
                            type="text"
                            value={posterTitle}
                            onChange={(e) => setPosterTitle(e.target.value)}
                            className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-3 text-sm text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-amber-200 mb-1">ఉప శీర్షిక (Subtitle)</label>
                          <input
                            type="text"
                            value={posterSubtitle}
                            onChange={(e) => setPosterSubtitle(e.target.value)}
                            className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-3 text-sm text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-amber-200 mb-1">తేదీ & సమయం (Date & Time)</label>
                          <input
                            type="text"
                            value={posterDate}
                            onChange={(e) => setPosterDate(e.target.value)}
                            className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-3 text-sm text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-amber-200 mb-1">కార్యక్రమ స్థలం (Venue Location)</label>
                          <input
                            type="text"
                            value={posterVenue}
                            onChange={(e) => setPosterVenue(e.target.value)}
                            className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-3 text-sm text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-amber-200 mb-1">భక్తులకు పిలుపు సందేశం (Appeal Message)</label>
                          <textarea
                            rows={3}
                            value={posterMessage}
                            onChange={(e) => setPosterMessage(e.target.value)}
                            className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-3 text-sm text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-amber-200 mb-1">ముఖ్య అతిథులు / పెద్దలు (Chief Guests)</label>
                          <input
                            type="text"
                            value={posterChiefGuest}
                            onChange={(e) => setPosterChiefGuest(e.target.value)}
                            className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-3 text-sm text-white font-bold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-amber-200 mb-1">సంప్రదించు ఫోన్</label>
                            <input
                              type="text"
                              value={posterPhone}
                              onChange={(e) => setPosterPhone(e.target.value)}
                              className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-2.5 text-xs text-white font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-amber-200 mb-1">PhonePe / UPI ID</label>
                            <input
                              type="text"
                              value={posterUpiId}
                              onChange={(e) => setPosterUpiId(e.target.value)}
                              className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-2.5 text-xs text-white font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-amber-200 mb-1">పోస్టర్ కలర్ థీమ్ (Theme Color)</label>
                          <select
                            value={posterTheme}
                            onChange={(e) => setPosterTheme(e.target.value)}
                            className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-3 text-sm text-white font-bold"
                          >
                            <option value="divine_maroon">రాయల్ మెరూన్ & గోల్డ్ (Royal Maroon)</option>
                            <option value="royal_gold">స్వర్ణమయం గోల్డ్ (Golden Theme)</option>
                            <option value="sacred_saffron">దివ్య కాషాయం (Sacred Saffron)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* TYPE 2: PAMPHLET FORM (Matching Reference Traditional Template) */}
                    {designerType === 'pamphlet' && (
                      <div className="space-y-5">
                        <h3 className="text-lg font-black text-[#FFD700] border-b border-white/20 pb-2 heading-telugu flex items-center justify-between">
                          <span>📜 ఆలయ ఆహ్వాన పత్రిక / పాంప్లెట్ డిజైనర్</span>
                          <span className="text-xs bg-amber-500 text-black px-2 py-0.5 rounded font-mono font-bold">PRO STUDIO</span>
                        </h3>

                        {/* Image & Background Customization Accordion Box */}
                        <div className="bg-[#3A0A11] border-2 border-amber-500/60 p-4 rounded-2xl space-y-3">
                          <h4 className="text-xs font-black text-[#FFD700] flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            <span>🏛️ పాంప్లెట్ బ్యాక్‌గ్రౌండ్ & డివైన్ చిత్రాలు (Background & Images)</span>
                          </h4>

                          {/* Background Image Selection */}
                          <div>
                            <label className="block text-[11px] font-bold text-amber-200 mb-1">పాంప్లెట్ బ్యాక్‌గ్రౌండ్ ఆలయం ఇమేజ్ (Temple Background)</label>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <button
                                type="button"
                                onClick={() => setPamphletBgImage('/assets/banner.jpg')}
                                className={`text-xs p-2 rounded-xl border font-bold ${pamphletBgImage === '/assets/banner.jpg' ? 'bg-amber-400 text-black border-white' : 'bg-black/40 text-gray-200 border-white/20'}`}
                              >
                                🛕 ఆలయ శంకుస్థాపన
                              </button>
                              <button
                                type="button"
                                onClick={() => setPamphletBgImage('/assets/logo.jpg')}
                                className={`text-xs p-2 rounded-xl border font-bold ${pamphletBgImage === '/assets/logo.jpg' ? 'bg-amber-400 text-black border-white' : 'bg-black/40 text-gray-200 border-white/20'}`}
                              >
                                🕉️ శ్రీరామ లోగో బ్యాక్‌గ్రౌండ్
                              </button>
                            </div>
                            
                            <label className="block text-[11px] font-bold text-amber-300 mb-1">📤 మీ వద్ద ఉన్న ఆలయ ఇమేజ్ అప్‌లోడ్ చేయండి (Upload Custom Background):</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleCustomImageUpload(setPamphletBgImage)}
                              className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-2 text-xs text-amber-200 font-bold file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-amber-400 file:text-black hover:file:bg-amber-300"
                            />
                          </div>

                          {/* Background Opacity Slider */}
                          <div>
                            <div className="flex justify-between items-center text-[11px] font-bold text-amber-200 mb-1">
                              <span>బ్యాక్‌గ్రౌండ్ ఇమేజ్ బ్రైట్‌నెస్ / కాంతి (Background Visibility):</span>
                              <span className="font-mono text-amber-400">{pamphletBgOpacity}%</span>
                            </div>
                            <input
                              type="range"
                              min="30"
                              max="100"
                              value={pamphletBgOpacity}
                              onChange={(e) => setPamphletBgOpacity(Number(e.target.value))}
                              className="w-full accent-amber-400 cursor-pointer"
                            />
                          </div>

                          {/* Header Deity Image Upload */}
                          <div className="border-t border-white/10 pt-2 space-y-2">
                            <label className="block text-[11px] font-bold text-amber-300">🖼️ పైన కనిపించే స్వామివారి ఇమేజ్ (Header Deity Photo Upload):</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleCustomImageUpload(setPamphletDeityHeaderImg)}
                              className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-2 text-xs text-amber-200 font-bold file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-amber-400 file:text-black"
                            />
                          </div>

                          {/* PhonePe QR Code Upload */}
                          <div className="border-t border-white/10 pt-2 space-y-2">
                            <label className="block text-[11px] font-bold text-amber-300">📱 PhonePe / GPay QR కోడ్ చిత్రం (Custom QR Code Upload):</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleCustomImageUpload(setPamphletQrImg)}
                              className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-2 text-xs text-amber-200 font-bold file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-amber-400 file:text-black"
                            />
                          </div>
                        </div>

                        {/* Text Fields */}
                        <div>
                          <label className="block text-xs font-bold text-amber-200 mb-1">ప్రధాన శీర్షిక (Main Banner Title)</label>
                          <textarea
                            rows={2}
                            value={pamphletMainTitle}
                            onChange={(e) => setPamphletMainTitle(e.target.value)}
                            className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-3 text-sm text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-amber-200 mb-1">ఉప శీర్షిక (Sub Tagline)</label>
                          <input
                            type="text"
                            value={pamphletSubTag}
                            onChange={(e) => setPamphletSubTag(e.target.value)}
                            className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-3 text-sm text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-amber-200 mb-1">భక్తులకు పిలుపు సందేశం (Appeal Message Paragraph)</label>
                          <textarea
                            rows={4}
                            value={pamphletAppealText}
                            onChange={(e) => setPamphletAppealText(e.target.value)}
                            className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-3 text-sm text-white font-bold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-amber-200 mb-1">గ్రామం పేరు</label>
                            <input
                              type="text"
                              value={pamphletVillage}
                              onChange={(e) => setPamphletVillage(e.target.value)}
                              className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-2.5 text-xs text-white font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-amber-200 mb-1">ముఖ్య దేవుడు</label>
                            <input
                              type="text"
                              value={pamphletDeityName}
                              onChange={(e) => setPamphletDeityName(e.target.value)}
                              className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-2.5 text-xs text-white font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-amber-200 mb-1">నిర్మాణ పురోగతి స్థితి</label>
                          <input
                            type="text"
                            value={pamphletStatus}
                            onChange={(e) => setPamphletStatus(e.target.value)}
                            className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-3 text-xs text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-amber-200 mb-1">మీ సహకారం మార్గాలు</label>
                          <input
                            type="text"
                            value={pamphletHelpTypes}
                            onChange={(e) => setPamphletHelpTypes(e.target.value)}
                            className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-3 text-xs text-white font-bold"
                          />
                        </div>

                        <div className="border-t border-white/20 pt-3 space-y-3">
                          <h4 className="text-xs font-black text-amber-300">🏦 బ్యాంకు & UPI వివరాలు</h4>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-amber-200 mb-1">ఖాతా పేరు</label>
                              <input
                                type="text"
                                value={pamphletTrustName}
                                onChange={(e) => setPamphletTrustName(e.target.value)}
                                className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-2 text-xs text-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-amber-200 mb-1">బ్యాంకు పేరు</label>
                              <input
                                type="text"
                                value={pamphletBankName}
                                onChange={(e) => setPamphletBankName(e.target.value)}
                                className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-2 text-xs text-white font-bold"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-amber-200 mb-1">ఖాతా సంఖ్య</label>
                              <input
                                type="text"
                                value={pamphletAccNo}
                                onChange={(e) => setPamphletAccNo(e.target.value)}
                                className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-2 text-xs text-white font-mono font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-amber-200 mb-1">IFSC కోడ్</label>
                              <input
                                type="text"
                                value={pamphletIfsc}
                                onChange={(e) => setPamphletIfsc(e.target.value)}
                                className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-2 text-xs text-white font-mono font-bold"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-amber-200 mb-1">PhonePe / GPay UPI ID</label>
                            <input
                              type="text"
                              value={pamphletUpiId}
                              onChange={(e) => setPamphletUpiId(e.target.value)}
                              className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-2 text-xs text-white font-mono font-bold"
                            />
                          </div>
                        </div>

                        <div className="border-t border-white/20 pt-3 space-y-3">
                          <h4 className="text-xs font-black text-amber-300">📞 సంప్రదించవలసిన వారు (కమిటీ ఫోన్లు)</h4>
                          <input
                            type="text"
                            value={pamphletPresident}
                            onChange={(e) => setPamphletPresident(e.target.value)}
                            className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-2 text-xs text-white font-bold mb-2"
                          />
                          <input
                            type="text"
                            value={pamphletSecretary}
                            onChange={(e) => setPamphletSecretary(e.target.value)}
                            className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-2 text-xs text-white font-bold"
                          />
                        </div>
                      </div>
                    )}

                    {/* TYPE 3: DONATION RECEIPT BOOK FORM */}
                    {designerType === 'receipt_book' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-black text-[#FFD700] border-b border-white/20 pb-2 heading-telugu">
                          🧾 రశీదు పుస్తకం టెంప్లేట్ ఆప్షన్లు
                        </h3>

                        <div>
                          <label className="block text-xs font-bold text-amber-200 mb-1">ట్రస్ట్ / కమిటీ అధికారిక పేరు</label>
                          <input
                            type="text"
                            value={bookTrustName}
                            onChange={(e) => setBookTrustName(e.target.value)}
                            className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-3 text-sm text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-amber-200 mb-1">ప్రారంభ రశీదు సంఖ్య (Starting Receipt No)</label>
                          <input
                            type="number"
                            value={bookStartNo}
                            onChange={(e) => setBookStartNo(e.target.value)}
                            className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-3 text-sm text-white font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-amber-200 mb-1">ఒక పేజీకి రశీదు స్లిప్పుల సంఖ్య (Slips per Sheet)</label>
                          <select
                            value={bookSlipCount}
                            onChange={(e) => setBookSlipCount(Number(e.target.value))}
                            className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-3 text-sm text-white font-bold"
                          >
                            <option value={2}>2 రశీదు స్లిప్పులు (2 Slips per A4)</option>
                            <option value={3}>3 రశీదు స్లిప్పులు (3 Slips per A4)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-amber-200 mb-1">రశీదు పుస్తకం నిబంధనలు (Receipt Book Terms)</label>
                          <textarea
                            rows={3}
                            value={bookNotice}
                            onChange={(e) => setBookNotice(e.target.value)}
                            className="w-full bg-[#2A060B] border border-white/30 rounded-xl p-3 text-sm text-white font-bold"
                          />
                        </div>
                      </div>
                    )}

                  </div>

                  {/* RIGHT COLUMN: LIVE RENDERED PRINTABLE CANVAS (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-black/50 p-3.5 rounded-2xl border border-white/10 shadow-xl">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-amber-400" />
                        <span>లైవ్ ప్రింట్ ప్రివ్యూ (Live Rendered Preview)</span>
                      </span>

                      {/* On-Canvas Direct Editing Mode Toggle */}
                      <button
                        type="button"
                        onClick={() => setDirectCanvasEditMode(!directCanvasEditMode)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-black transition-all flex items-center gap-1.5 ${
                          directCanvasEditMode
                            ? 'bg-amber-400 text-black border border-white shadow-md'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{directCanvasEditMode ? '✏️ డైరెక్ట్ ఎడిటింగ్ మోడ్ ఆన్ (Canvas Editable)' : '🔒 లాక్ మోడ్'}</span>
                      </button>
                    </div>

                    {/* PRINTABLE CANVAS CONTAINER */}
                    <div className="overflow-x-auto pb-4">
                      <div
                        ref={designerCanvasRef}
                        className="w-[720px] mx-auto bg-white text-black p-6 sm:p-8 rounded-2xl shadow-2xl border-4 border-gray-900 relative overflow-hidden font-sans"
                      >

                        {/* TEMPLATE 1 RENDER: POSTER */}
                        {designerType === 'poster' && (
                          <div className={`p-6 rounded-xl border-4 ${
                            posterTheme === 'royal_gold'
                              ? 'bg-gradient-to-b from-amber-100 via-amber-50 to-amber-200 border-amber-600 text-amber-950'
                              : posterTheme === 'sacred_saffron'
                              ? 'bg-gradient-to-b from-orange-100 via-amber-50 to-orange-200 border-orange-600 text-orange-950'
                              : 'bg-gradient-to-b from-[#5C121E] via-[#3A0A11] to-[#5C121E] border-[#FFD700] text-white'
                          } relative overflow-hidden space-y-6`}>
                            
                            {/* Poster Watermark */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-10 z-0">
                              <img
                                src={getActiveLogo()}
                                alt="Logo Watermark"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = getAssetUrl('assets/logo.jpg');
                                }}
                                className="w-96 h-96 rounded-full object-cover grayscale"
                              />
                            </div>

                            {/* Poster Header */}
                            <div className="text-center space-y-2 relative z-10 border-b-2 border-current/20 pb-4">
                              <div className="flex items-center justify-center gap-3">
                                <img
                                  src={getActiveLogo()}
                                  alt="Logo"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = getAssetUrl('assets/logo.jpg');
                                  }}
                                  className="w-16 h-16 rounded-full border-2 border-amber-500 shadow-md object-cover"
                                />
                                <div>
                                  <h3 className="text-2xl font-black uppercase tracking-wider heading-telugu">శ్రీ రామా సేవా కమిటీ</h3>
                                  <p className="text-xs font-bold opacity-80">పామినివాండ్లవూరు • మంగళపల్లె పంచాయతీ • బంగారుపాళెం మండలం</p>
                                </div>
                              </div>
                            </div>

                            {/* Poster Title Banner */}
                            <div className="text-center space-y-3 relative z-10 my-4">
                              <span className="inline-block px-4 py-1 rounded-full text-xs font-black bg-amber-400 text-black uppercase shadow-lg">
                                🚩 శ్రీరామ దివ్య సంకల్పం
                              </span>
                              <h1
                                contentEditable={directCanvasEditMode}
                                suppressContentEditableWarning
                                onBlur={(e) => setPosterTitle(e.currentTarget.innerText)}
                                className={`text-2xl sm:text-3xl font-black leading-snug heading-telugu drop-shadow-md outline-none ${directCanvasEditMode ? 'hover:outline-2 hover:outline-dashed hover:outline-amber-400 rounded px-1' : ''}`}
                              >
                                {posterTitle}
                              </h1>
                              <p
                                contentEditable={directCanvasEditMode}
                                suppressContentEditableWarning
                                onBlur={(e) => setPosterSubtitle(e.currentTarget.innerText)}
                                className={`text-sm font-bold opacity-90 outline-none ${directCanvasEditMode ? 'hover:outline-2 hover:outline-dashed hover:outline-amber-400 rounded px-1' : ''}`}
                              >
                                {posterSubtitle}
                              </p>
                            </div>

                            {/* Event Details Highlight Box */}
                            <div className="bg-black/20 backdrop-blur-sm border-2 border-current/30 p-4 rounded-2xl space-y-2 text-center relative z-10 text-sm font-extrabold">
                              <p
                                contentEditable={directCanvasEditMode}
                                suppressContentEditableWarning
                                onBlur={(e) => setPosterDate(e.currentTarget.innerText)}
                                className="text-amber-300 text-base outline-none"
                              >
                                {posterDate}
                              </p>
                              <p
                                contentEditable={directCanvasEditMode}
                                suppressContentEditableWarning
                                onBlur={(e) => setPosterVenue(e.currentTarget.innerText)}
                                className="text-xs opacity-90 outline-none"
                              >
                                {posterVenue}
                              </p>
                              <p
                                contentEditable={directCanvasEditMode}
                                suppressContentEditableWarning
                                onBlur={(e) => setPosterChiefGuest(e.currentTarget.innerText)}
                                className="text-xs opacity-80 border-t border-current/20 pt-2 mt-2 outline-none"
                              >
                                {posterChiefGuest}
                              </p>
                            </div>

                            {/* Appeal Message */}
                            <div className="p-4 rounded-xl bg-white/10 border border-current/20 text-center relative z-10">
                              <p
                                contentEditable={directCanvasEditMode}
                                suppressContentEditableWarning
                                onBlur={(e) => setPosterMessage(e.currentTarget.innerText)}
                                className="text-sm font-bold leading-relaxed outline-none"
                              >
                                {posterMessage}
                              </p>
                            </div>

                            {/* QR Code & Donation Box */}
                            <div className="bg-white text-black p-4 rounded-2xl flex items-center justify-between gap-4 border-2 border-amber-500 shadow-xl relative z-10">
                              <div className="space-y-1 text-left">
                                <span className="bg-emerald-600 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded">
                                  ✓ ఈ-హుండి & PhonePe QR
                                </span>
                                <h4 className="text-sm font-black text-[#5C121E]">విరాళం కానుక చెల్లించండి</h4>
                                <p className="text-xs font-mono font-bold text-sky-900">UPI: {posterUpiId}</p>
                                <p className="text-xs font-bold text-gray-700">ఫోన్ / వాట్సాప్: {posterPhone}</p>
                              </div>
                              <img
                                src={getActiveQrCode()}
                                alt="PhonePe QR"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = getAssetUrl('assets/phonepe_qr.png');
                                }}
                                className="w-24 h-24 rounded-lg border-2 border-amber-600 shadow-md shrink-0"
                              />
                            </div>

                            <div className="text-center text-[11px] font-bold opacity-70 relative z-10 pt-2">
                              శ్రీ రామా సేవా కమిటీ, పామినివాండ్లవూరు • సర్వే జనాః సుఖినో భవంతు
                            </div>
                          </div>
                        )}

                        {/* TEMPLATE 2 RENDER: TRADITIONAL TEMPLE FLYER / PAMPHLET (With Temple Background Image & On-Canvas Direct Edit) */}
                        {designerType === 'pamphlet' && (
                          <div
                            className="bg-[#FFFDF0] text-gray-900 p-5 sm:p-6 rounded-2xl border-4 border-[#8B0000] outline outline-2 outline-[#FFD700] shadow-2xl space-y-4 relative overflow-hidden font-sans bg-cover bg-center"
                            style={{
                              backgroundImage: pamphletBgImage ? `url(${pamphletBgImage})` : 'none',
                            }}
                          >
                            
                            {/* Soft Temple Background Overlay */}
                            <div 
                              className="absolute inset-0 bg-[#FFFDF0] z-0 pointer-events-none transition-all"
                              style={{ opacity: pamphletBgOpacity / 100 }}
                            />

                            {/* Top Mantram Garlands Bar */}
                            <div className="flex justify-between items-center text-[10px] sm:text-xs font-black text-amber-900 border-b-2 border-amber-600/30 pb-2 relative z-10">
                              <span>శ్రీరామ జయ రామ్</span>
                              <span className="text-[#8B0000] text-xs font-black">❖ శుభం భూయాత్ ❖</span>
                              <span>రామో విగ్రహవాన్ ధర్మః</span>
                            </div>

                            {/* Central Mandapam Banner & Deity Header */}
                            <div className="text-center relative z-10 space-y-2">
                              <div className="relative mx-auto w-full max-w-md h-40 sm:h-48 rounded-2xl overflow-hidden border-4 border-[#FFD700] shadow-xl bg-gradient-to-b from-amber-900 to-[#5C121E] flex items-center justify-center">
                                <img src={pamphletDeityHeaderImg || '/assets/banner.jpg'} alt="Sita Rama Mandapam" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 flex items-end justify-center p-2">
                                  <span className="text-[#FFD700] font-black text-xs sm:text-sm drop-shadow-md">
                                    శ్రీ సీతారామచంద్ర స్వామి వారి దివ్య స్వరూపం
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Main Red Arch Banner (Editable On-Canvas) */}
                            <div className="bg-gradient-to-r from-[#7A0C1B] via-[#9E1428] to-[#7A0C1B] text-[#FFD700] border-2 border-[#FFD700] p-4 rounded-3xl text-center space-y-1.5 shadow-2xl relative z-10">
                              <h2
                                contentEditable={directCanvasEditMode}
                                suppressContentEditableWarning
                                onBlur={(e) => setPamphletMainTitle(e.currentTarget.innerText)}
                                className={`text-lg sm:text-xl font-black heading-telugu drop-shadow-md leading-tight outline-none ${directCanvasEditMode ? 'hover:ring-2 hover:ring-amber-300 rounded px-1' : ''}`}
                              >
                                {pamphletMainTitle}
                              </h2>
                              <div
                                contentEditable={directCanvasEditMode}
                                suppressContentEditableWarning
                                onBlur={(e) => setPamphletSubTag(e.currentTarget.innerText)}
                                className="inline-block bg-emerald-800 text-white font-extrabold text-xs px-4 py-1 rounded-full shadow-md outline-none"
                              >
                                {pamphletSubTag}
                              </div>
                            </div>

                            {/* Appeal Message Paragraph (Editable On-Canvas) */}
                            <div
                              contentEditable={directCanvasEditMode}
                              suppressContentEditableWarning
                              onBlur={(e) => setPamphletAppealText(e.currentTarget.innerText)}
                              className={`bg-amber-100/90 border border-amber-400 p-3 rounded-xl text-center text-xs font-semibold leading-relaxed text-amber-950 relative z-10 shadow-sm outline-none ${directCanvasEditMode ? 'hover:ring-2 hover:ring-amber-500' : ''}`}
                            >
                              {pamphletAppealText}
                            </div>

                            {/* Devalayam Construction Details Card */}
                            <div className="border-2 border-amber-700 rounded-xl overflow-hidden bg-white/95 shadow-md relative z-10">
                              <div className="bg-gradient-to-r from-[#7A0C1B] to-[#5C121E] text-[#FFD700] px-4 py-1.5 text-center font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                                <span>❖ దేవాలయం నిర్మాణ వివరాలు ❖</span>
                              </div>

                              <div className="grid grid-cols-12 text-xs p-3 gap-3 items-center">
                                <div className="col-span-8 space-y-1.5 font-bold text-gray-800 border-r border-amber-200 pr-3">
                                  <div className="flex">
                                    <span className="w-28 text-amber-900 shrink-0">❖ దేవాలయం స్థలం</span>
                                    <span className="mr-1">:</span>
                                    <span
                                      contentEditable={directCanvasEditMode}
                                      suppressContentEditableWarning
                                      onBlur={(e) => setPamphletVillage(e.currentTarget.innerText)}
                                      className="outline-none"
                                    >{pamphletVillage}</span>
                                  </div>
                                  <div className="flex">
                                    <span className="w-28 text-amber-900 shrink-0">❖ ముఖ్య దేవుడు</span>
                                    <span className="mr-1">:</span>
                                    <span
                                      contentEditable={directCanvasEditMode}
                                      suppressContentEditableWarning
                                      onBlur={(e) => setPamphletDeityName(e.currentTarget.innerText)}
                                      className="text-[#8B0000] outline-none"
                                    >{pamphletDeityName}</span>
                                  </div>
                                  <div className="flex">
                                    <span className="w-28 text-amber-900 shrink-0">❖ నిర్మాణ పురోగతి</span>
                                    <span className="mr-1">:</span>
                                    <span
                                      contentEditable={directCanvasEditMode}
                                      suppressContentEditableWarning
                                      onBlur={(e) => setPamphletStatus(e.currentTarget.innerText)}
                                      className="outline-none"
                                    >{pamphletStatus}</span>
                                  </div>
                                  <div className="flex">
                                    <span className="w-28 text-amber-900 shrink-0">❖ మీ సహకారం</span>
                                    <span className="mr-1">:</span>
                                    <span
                                      contentEditable={directCanvasEditMode}
                                      suppressContentEditableWarning
                                      onBlur={(e) => setPamphletHelpTypes(e.currentTarget.innerText)}
                                      className="outline-none"
                                    >{pamphletHelpTypes}</span>
                                  </div>
                                </div>

                                <div
                                  contentEditable={directCanvasEditMode}
                                  suppressContentEditableWarning
                                  onBlur={(e) => setPamphletSideNotice(e.currentTarget.innerText)}
                                  className="col-span-4 bg-red-900 text-[#FFD700] p-2.5 rounded-xl text-center font-extrabold text-[11px] leading-snug flex items-center justify-center shadow-md outline-none"
                                >
                                  {pamphletSideNotice}
                                </div>
                              </div>
                            </div>

                            {/* Donation Tiers Chips Box */}
                            <div className="space-y-2 relative z-10">
                              <div className="text-center font-black text-xs text-[#8B0000] uppercase tracking-wide">
                                ❖ విరాళములు పంపించగలరు ❖
                              </div>
                              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[10px] font-black">
                                <div className="bg-amber-200 border border-amber-500 p-2 rounded-lg text-amber-950 shadow-sm">
                                  <div className="text-xs text-[#8B0000]">₹ 501</div>
                                  <div className="text-[9px] font-bold">అభినందన</div>
                                </div>
                                <div className="bg-amber-200 border border-amber-500 p-2 rounded-lg text-amber-950 shadow-sm">
                                  <div className="text-xs text-[#8B0000]">₹ 1,001</div>
                                  <div className="text-[9px] font-bold">ప్రత్యేక పూజ</div>
                                </div>
                                <div className="bg-amber-200 border border-amber-500 p-2 rounded-lg text-amber-950 shadow-sm">
                                  <div className="text-xs text-[#8B0000]">₹ 5,001</div>
                                  <div className="text-[9px] font-bold">అష్ట నామ సంకీర్తన</div>
                                </div>
                                <div className="bg-amber-200 border border-amber-500 p-2 rounded-lg text-amber-950 shadow-sm">
                                  <div className="text-xs text-[#8B0000]">₹ 11,001</div>
                                  <div className="text-[9px] font-bold">కుటుంబ పూజ</div>
                                </div>
                                <div className="bg-amber-200 border border-amber-500 p-2 rounded-lg text-amber-950 shadow-sm">
                                  <div className="text-xs text-[#8B0000]">₹ 21,001</div>
                                  <div className="text-[9px] font-bold">ప్రత్యేక గౌరవం</div>
                                </div>
                                <div className="bg-amber-300 border border-amber-600 p-2 rounded-lg text-amber-950 shadow-sm">
                                  <div className="text-xs text-[#8B0000]">మీ ఇష్టమైన మొత్తం</div>
                                  <div className="text-[9px] font-bold">(స్వచ్ఛంద విరాళం)</div>
                                </div>
                              </div>

                              <div className="text-center text-[10px] font-bold text-amber-900">
                                ప్రతి దాత పేరు దేవాలయ దాతల ఫలకంపై పొందుపరుస్తాము • ❖ ధర్మో రక్షతి రక్షితః ❖
                              </div>
                            </div>

                            {/* Footer 2-Column Boxes: Bank & Contacts */}
                            <div className="grid grid-cols-2 gap-3 text-xs relative z-10">
                              
                              {/* Left Box: Bank & QR Details */}
                              <div className="border-2 border-emerald-800 rounded-xl p-3 bg-emerald-50/95 space-y-1.5">
                                <div className="bg-emerald-800 text-white px-2 py-0.5 rounded text-[11px] font-black text-center mb-1">
                                  విరాళములు పంపించవలసిన ఖాతా వివరాలు
                                </div>
                                <div className="space-y-1 text-[10px] font-bold text-gray-800">
                                  <p><span className="text-emerald-950 font-black">ఖాతా పేరు:</span> <span contentEditable={directCanvasEditMode} suppressContentEditableWarning onBlur={(e) => setPamphletTrustName(e.currentTarget.innerText)} className="outline-none">{pamphletTrustName}</span></p>
                                  <p><span className="text-emerald-950 font-black">బ్యాంకు పేరు:</span> <span contentEditable={directCanvasEditMode} suppressContentEditableWarning onBlur={(e) => setPamphletBankName(e.currentTarget.innerText)} className="outline-none">{pamphletBankName}</span></p>
                                  <p><span className="text-emerald-950 font-black">ఖాతా సంఖ్య:</span> <span contentEditable={directCanvasEditMode} suppressContentEditableWarning onBlur={(e) => setPamphletAccNo(e.currentTarget.innerText)} className="font-mono font-black outline-none">{pamphletAccNo}</span></p>
                                  <p><span className="text-emerald-950 font-black">IFSC కోడ్:</span> <span contentEditable={directCanvasEditMode} suppressContentEditableWarning onBlur={(e) => setPamphletIfsc(e.currentTarget.innerText)} className="font-mono font-black outline-none">{pamphletIfsc}</span></p>
                                  <p><span className="text-emerald-950 font-black">శాఖ:</span> <span contentEditable={directCanvasEditMode} suppressContentEditableWarning onBlur={(e) => setPamphletBranch(e.currentTarget.innerText)} className="outline-none">{pamphletBranch}</span></p>
                                </div>

                                <div className="flex items-center gap-2 bg-white p-1.5 rounded border border-emerald-300 mt-2">
                                  <img
                                    src={pamphletQrImg || getActiveQrCode()}
                                    alt="PhonePe QR"
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = getAssetUrl('assets/phonepe_qr.png');
                                    }}
                                    className="w-14 h-14 rounded border border-gray-400 shrink-0 object-cover"
                                  />
                                  <div className="text-[9px] font-bold text-gray-800 space-y-0.5">
                                    <span className="bg-purple-700 text-white px-1.5 py-0.5 rounded text-[8px]">PhonePe / GPay QR</span>
                                    <p contentEditable={directCanvasEditMode} suppressContentEditableWarning onBlur={(e) => setPamphletUpiId(e.currentTarget.innerText)} className="font-mono text-purple-900 font-black outline-none">{pamphletUpiId}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Right Box: Contacts & Blessing */}
                              <div className="border-2 border-amber-800 rounded-xl p-3 bg-amber-50/95 space-y-2 flex flex-col justify-between">
                                <div>
                                  <div className="bg-amber-800 text-[#FFD700] text-center font-bold text-[11px] py-0.5 rounded">
                                    సంప్రదించవలసిన వారు 🙏
                                  </div>
                                  <div className="space-y-1 text-[10px] font-bold text-gray-800">
                                    <p contentEditable={directCanvasEditMode} suppressContentEditableWarning onBlur={(e) => setPamphletPresident(e.currentTarget.innerText)} className="outline-none">{pamphletPresident}</p>
                                    <p contentEditable={directCanvasEditMode} suppressContentEditableWarning onBlur={(e) => setPamphletSecretary(e.currentTarget.innerText)} className="outline-none">{pamphletSecretary}</p>
                                    <p contentEditable={directCanvasEditMode} suppressContentEditableWarning onBlur={(e) => setPamphletTreasurer(e.currentTarget.innerText)} className="outline-none">{pamphletTreasurer}</p>
                                    <p contentEditable={directCanvasEditMode} suppressContentEditableWarning onBlur={(e) => setPamphletMembers(e.currentTarget.innerText)} className="outline-none">{pamphletMembers}</p>
                                  </div>
                                </div>

                                <div className="bg-[#7A0C1B] text-[#FFD700] p-2 rounded-lg text-center text-[10px] font-extrabold leading-tight shadow-md">
                                  మీరు చేసే సహాయం శ్రీ సీతారామచంద్ర స్వామి వారి అనుగ్రహాన్ని ప్రసాదిస్తుంది. || శ్రీరామ జయం ||
                                </div>
                              </div>

                            </div>

                            {/* Bottom Footer Banner */}
                            <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white p-2 rounded-xl text-center text-xs font-black relative z-10 shadow-md">
                              <p className="text-[11px] font-bold opacity-90 mb-0.5">ఈ పుణ్యకార్యానికి అందరూ చేయూతనిచ్చి భాగస్వాములు కావలసినదిగా ప్రార్థన.</p>
                              <span className="text-[#FFD700] text-sm uppercase tracking-widest block font-black">❖ జై శ్రీరామ్ ❖</span>
                            </div>

                          </div>
                        )}

                        {/* TEMPLATE 3 RENDER: PRINTABLE DONATION RECEIPT BOOK SLIPS WITH LOGO WATERMARK */}
                        {designerType === 'receipt_book' && (
                          <div className="space-y-6 relative z-10">
                            {Array.from({ length: bookSlipCount }).map((_, idx) => {
                              const slipNo = `SRS-BOOK-${(parseInt(bookStartNo) || 1000) + idx}`;
                              return (
                                <div key={idx} className="space-y-2">
                                  
                                  {/* Receipt Book Slip Container */}
                                  <div className="border-2 border-gray-900 rounded-lg p-3 bg-white flex text-[11px] font-sans relative overflow-hidden shadow-sm">
                                    
                                    {/* Prominent Logo Watermark */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.14] z-0">
                                      <img
                                        src={getActiveLogo()}
                                        alt="Logo Watermark"
                                        onError={(e) => {
                                          e.currentTarget.onerror = null;
                                          e.currentTarget.src = getAssetUrl('assets/logo.jpg');
                                        }}
                                        className="w-56 h-56 rounded-full object-cover border-4 border-amber-600/30"
                                      />
                                    </div>

                                    {/* Stub / Counterfoil (Left Part 28%) */}
                                    <div className="w-[28%] border-r-2 border-dashed border-gray-800 pr-3 space-y-2 bg-gray-50/90 p-2 rounded-l relative z-10">
                                      <div className="text-center border-b border-gray-400 pb-1">
                                        <span className="font-black text-[#5C121E] text-[10px] block">దాత కౌంటర్ కాపీ</span>
                                        <span className="font-mono font-black text-xs text-black">{slipNo}</span>
                                      </div>
                                      
                                      <div className="space-y-1 text-[10px]">
                                        <p><span className="font-bold">తేదీ:</span> ___________</p>
                                        <p><span className="font-bold">పేరు:</span> ___________</p>
                                        <p><span className="font-bold">మొత్తం:</span> ₹ _________</p>
                                        <p><span className="font-bold">సేవ:</span> ____________</p>
                                      </div>

                                      <div className="text-center pt-3 border-t border-gray-300 text-[9px] font-bold text-gray-600">
                                        వసూలుదారు సంతకం
                                      </div>
                                    </div>

                                    {/* Main Receipt Voucher (Right Part 72%) */}
                                    <div className="w-[72%] pl-3 space-y-2.5 relative z-10">
                                      
                                      {/* Slip Header */}
                                      <div className="flex justify-between items-start border-b border-gray-800 pb-1.5">
                                        <div className="flex items-center gap-2">
                                          <img
                                            src={getActiveLogo()}
                                            alt="Logo"
                                            onError={(e) => {
                                              e.currentTarget.onerror = null;
                                              e.currentTarget.src = getAssetUrl('assets/logo.jpg');
                                            }}
                                            className="w-8 h-8 rounded-full border border-amber-600 shadow-sm"
                                          />
                                          <div>
                                            <h4 
                                              contentEditable={directCanvasEditMode} 
                                              suppressContentEditableWarning 
                                              onBlur={(e) => setBookTrustName(e.currentTarget.innerText)} 
                                              className="font-black text-[#5C121E] text-xs heading-telugu outline-none"
                                            >
                                              {bookTrustName}
                                            </h4>
                                            <p className="text-[9px] text-gray-600 font-bold">పామినివాండ్లవూరు • విరాళం రశీదు పుస్తకం</p>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <span className="text-[9px] font-bold text-gray-500 block">రశీదు సంఖ్య:</span>
                                          <span className="font-mono font-black text-xs text-[#5C121E]">{slipNo}</span>
                                        </div>
                                      </div>

                                      {/* Fill-in Fields */}
                                      <div className="space-y-1.5 text-[11px] font-medium text-gray-900">
                                        <div className="flex justify-between">
                                          <span>శ్రీ / శ్రీమతి: <strong className="border-b border-dotted border-black px-4 font-normal">____________________________________</strong></span>
                                          <span>తేదీ: <strong className="font-mono">____/____/2026</strong></span>
                                        </div>

                                        <div className="flex justify-between">
                                          <span>గ్రామం: <strong>_____________________</strong></span>
                                          <span>ఫోన్: <strong>_____________________</strong></span>
                                        </div>

                                        <div>
                                          <span>విరాళం కానుక (అక్షరాలా రూపాయిలు): <strong>__________________________________________</strong></span>
                                        </div>

                                        <div className="flex justify-between items-center bg-gray-100/90 p-1.5 rounded border border-gray-300">
                                          <span className="font-bold text-[#5C121E]">మొత్తం (Rs.): <strong className="font-mono text-sm text-emerald-800">₹ ______________ /-</strong></span>
                                          <span>విభాగం: <strong>_______________________</strong></span>
                                        </div>
                                      </div>

                                      {/* Footer Signatures */}
                                      <div className="flex justify-between items-end text-[9px] text-gray-600 font-bold pt-1 border-t border-gray-300">
                                        <span>కానుక స్వీకరించిన వారి సంతకం</span>
                                        <span className="text-[#5C121E] font-black">శ్రీ రామా సేవా కమిటీ</span>
                                      </div>

                                    </div>

                                  </div>

                                  {/* Scissor Cut Line Divider */}
                                  {idx < bookSlipCount - 1 && (
                                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono py-1">
                                      <span>✂️-------------------------------------------------------------------------------------------------------</span>
                                    </div>
                                  )}

                                </div>
                              );
                            })}
                          </div>
                        )}

                      </div>
                    </div>

                  </div>

                </div>
              </div>
            )}

            {/* TAB 8: AUDIT & DATABASE MANAGEMENT SUITE */}
            {activeTab === 'audit' && (
              <div className="space-y-6 text-xs animate-fadeIn">
                
                {/* Database Metrics Header Card */}
                <div className="gold-card bg-gradient-to-r from-[#3A0A11] via-[#5C121E] to-[#3A0A11] border-3 border-[#FFD700] p-6 rounded-3xl shadow-2xl space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/20 pb-4">
                    <div>
                      <span className="bg-emerald-600 text-white font-black text-[10px] uppercase px-3 py-1 rounded-full inline-block mb-1">
                        ✓ ACTIVE DATABASE ENGINE • SQL & JSON SUPPORT
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-[#FFD700] flex items-center gap-2.5 heading-telugu">
                        <Database className="w-7 h-7 text-amber-300 animate-pulse" />
                        <span>శ్రీ రామాలయం సిస్టమ్ డేటాబేస్ మేనేజ్‌మెంట్ నివేదిక</span>
                      </h3>
                      <p className="text-xs text-gray-200 mt-1">
                        స్టోరేజ్ కీ: <span className="font-mono text-amber-300 font-bold bg-black/60 px-2 py-0.5 rounded">sri_rama_erp_database_v2_v3</span> • స్థితి: <span className="text-emerald-400 font-bold">100% భద్రంగా ఆటో-సేవ్ అవుతోంది</span>
                      </p>
                    </div>

                    {/* Database Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button onClick={downloadDatabaseJSON} className="btn-gold text-xs py-2.5 px-4 font-black flex items-center gap-1.5 shadow-lg">
                        <Download className="w-4 h-4" />
                        <span>JSON బ్యాకప్ (.json)</span>
                      </button>

                      <button onClick={downloadDatabaseSQL} className="px-4 py-2.5 rounded-xl font-black text-xs bg-indigo-600 text-white border-2 border-indigo-400 hover:bg-indigo-500 transition-all shadow-lg flex items-center gap-1.5">
                        <Database className="w-4 h-4" />
                        <span>SQL డ్రిల్ ఫైల్ (.sql)</span>
                      </button>

                      <label className="px-4 py-2.5 rounded-xl font-black text-xs bg-emerald-700 text-white border-2 border-emerald-400 hover:bg-emerald-600 transition-all cursor-pointer shadow-lg flex items-center gap-1.5">
                        <Upload className="w-4 h-4" />
                        <span>రిస్టోర్ ఫైల్</span>
                        <input type="file" accept=".json" onChange={handleRestoreDatabase} className="hidden" />
                      </label>

                      <button onClick={handleFactoryResetDB} className="px-3.5 py-2.5 rounded-xl font-black text-xs bg-rose-900/80 text-rose-200 border border-rose-500 hover:bg-rose-800 transition-all shadow-lg flex items-center gap-1">
                        <Trash2 className="w-4 h-4" />
                        <span>రీసెట్</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Database Counters Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-black/40 p-3 rounded-2xl border border-white/10 space-y-1">
                      <span className="text-gray-400 text-[10px] font-bold block uppercase">మొత్తం భక్తులు (Devotees)</span>
                      <span className="text-lg font-mono font-black text-amber-300">{db.devotees?.length || 0}</span>
                    </div>

                    <div className="bg-black/40 p-3 rounded-2xl border border-white/10 space-y-1">
                      <span className="text-gray-400 text-[10px] font-bold block uppercase">విరాళాల రికార్డులు (Donations)</span>
                      <span className="text-lg font-mono font-black text-emerald-400">{db.donations?.length || 0}</span>
                    </div>

                    <div className="bg-black/40 p-3 rounded-2xl border border-white/10 space-y-1">
                      <span className="text-gray-400 text-[10px] font-bold block uppercase">సేవా బుకింగ్స్ (Sevas)</span>
                      <span className="text-lg font-mono font-black text-sky-400">{db.sevaBookings?.length || 0}</span>
                    </div>

                    <div className="bg-black/40 p-3 rounded-2xl border border-white/10 space-y-1">
                      <span className="text-gray-400 text-[10px] font-bold block uppercase">ఆడిట్ లాగ్ ఎంట్రీలు (Audit Logs)</span>
                      <span className="text-lg font-mono font-black text-purple-300">{db.auditLogs?.length || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Audit Log Timeline Card */}
                <div className="gold-card bg-[#3A0A11]/80 border-2 border-[#FFD700]/60 p-6 rounded-3xl shadow-xl space-y-4">
                  <h3 className="text-lg font-black text-[#FFD700] heading-telugu flex items-center justify-between border-b border-white/20 pb-2">
                    <span>📋 రియల్-టైమ్ ఆడిట్ లాగ్ రికార్డులు & ట్రాకింగ్ ({db.auditLogs?.length || 0})</span>
                    <span className="text-xs font-mono font-normal text-amber-300">SECURE LOGS</span>
                  </h3>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {db.auditLogs && db.auditLogs.map((log, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-xl bg-black/50 border border-white/10 hover:border-amber-400/50 transition-all gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                          <span className="text-white font-bold text-xs">{log.action}</span>
                        </div>
                        <span className="text-amber-300 font-mono text-[11px] bg-black/60 px-2.5 py-1 rounded-lg shrink-0">
                          {log.timestamp} ({log.user})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
