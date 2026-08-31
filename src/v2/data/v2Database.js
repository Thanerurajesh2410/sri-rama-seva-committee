// Persistent Database Engine for Version 2 Sri Ramalayam ERP & Devotee Portal
const DB_STORAGE_KEY = 'sri_rama_erp_database_v2_v3';

// Asset URL Helper for Base URL & Subpath compatibility (GitHub Pages / Vercel / Local)
export const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const baseUrl = import.meta.env.BASE_URL || './';
  
  let clean = path.trim();
  if (clean.startsWith('/')) {
    clean = clean.slice(1);
  }
  // Strip any accidental repeated base URL subpaths
  while (clean.startsWith('sri-rama-seva-committee/')) {
    clean = clean.slice('sri-rama-seva-committee/'.length);
  }
  while (clean.startsWith('SRSC/')) {
    clean = clean.slice('SRSC/'.length);
  }

  if (baseUrl === './' || baseUrl === '' || baseUrl === '.') {
    return `./${clean}`;
  }

  const prefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${prefix}${clean}`;
};

// 🌟 Full 16 Authentic Donors List from V1 Classic Site
const v1ClassicDonors = [
  { id: 'SRS-2026-001', donorName: 'Cash Deposit Self', phone: '9866125609', email: 'sriramasevacommitteepvv@gmail.com', amount: 1116, date: '12-06-2026', seva: 'నగదు జమ', mode: 'Cash Deposit', city: 'ఆలయ నిధి' },
  { id: 'SRS-2026-002', donorName: 'Thaneru (T. Haneru)', phone: '9866125609', email: 'sriramasevacommitteepvv@gmail.com', amount: 5000, date: '12-06-2026', seva: 'రాతి గోడల నిర్మాణం', mode: 'Cash Deposit', city: 'పామినివాండ్లవూరు' },
  { id: 'SRS-2026-003', donorName: 'T. Chandra', phone: '9866125609', email: 'sriramasevacommitteepvv@gmail.com', amount: 51, date: '12-06-2026', seva: 'విరాళం', mode: 'Cash Deposit', city: 'పామినివాండ్లవూరు' },
  { id: 'SRS-2026-004', donorName: 'T. Chandr', phone: '9866125609', email: 'sriramasevacommitteepvv@gmail.com', amount: 50, date: '12-06-2026', seva: 'విరాళం', mode: 'Cash Deposit', city: 'పామినివాండ్లవూరు' },
  { id: 'SRS-2026-005', donorName: 'T. Karthi', phone: '9866125609', email: 'sriramasevacommitteepvv@gmail.com', amount: 30, date: '14-06-2026', seva: 'విరాళం', mode: 'Cash Deposit', city: 'పామినివాండ్లవూరు' },
  { id: 'SRS-2026-006', donorName: 'T. Murali', phone: '9866125609', email: 'sriramasevacommitteepvv@gmail.com', amount: 116, date: '14-06-2026', seva: 'విరాళం', mode: 'Cash Deposit', city: 'పామినివాండ్లవూరు' },
  { id: 'SRS-2026-007', donorName: 'P. Sandeep', phone: '9866125609', email: 'sriramasevacommitteepvv@gmail.com', amount: 116, date: '17-06-2026', seva: 'విరాళం', mode: 'Cash Deposit', city: 'పామినివాండ్లవూరు' },
  { id: 'SRS-2026-008', donorName: 'Thaneru (T. Hanneru)', phone: '9866125609', email: 'sriramasevacommitteepvv@gmail.com', amount: 505, date: '18-06-2026', seva: 'విరాళం', mode: 'Cash Deposit', city: 'పామినివాండ్లవూరు' },
  { id: 'SRS-2026-009', donorName: 'P. Naveen', phone: '9866125609', email: 'sriramasevacommitteepvv@gmail.com', amount: 11, date: '25-06-2026', seva: 'విరాళం', mode: 'Cash Deposit', city: 'పామినివాండ్లవూరు' },
  { id: 'SRS-2026-010', donorName: 'P. Rishi', phone: '9866125609', email: 'sriramasevacommitteepvv@gmail.com', amount: 2101, date: '04-07-2026', seva: 'ఈ-హుండి కానుక', mode: 'UPI / PhonePe', city: 'పామినివాండ్లవూరు' },
  { id: 'SRS-2026-011', donorName: 'Sri Sai Mahila Mandali', phone: '9866125609', email: 'sriramasevacommitteepvv@gmail.com', amount: 10000, date: '06-07-2026', seva: 'మహిళా మండలి విరాళం', mode: 'SBI Direct Transfer', city: 'మంగళపల్లె' },
  { id: 'SRS-2026-012', donorName: 'SHG Rajeshwari Mahila Mandali', phone: '9866125609', email: 'sriramasevacommitteepvv@gmail.com', amount: 10000, date: '06-07-2026', seva: 'మహిళా మండలి విరాళం', mode: 'SBI Direct Transfer', city: 'పామినివాండ్లవూరు' },
  { id: 'SRS-2026-013', donorName: 'Sri Ganesh Mahila Mandali', phone: '9866125609', email: 'sriramasevacommitteepvv@gmail.com', amount: 10000, date: '06-07-2026', seva: 'మహిళా మండలి విరాళం', mode: 'SBI Direct Transfer', city: 'పామినివాండ్లవూరు' },
  { id: 'SRS-2026-014', donorName: 'SHG Mahila Mandali Group', phone: '9866125609', email: 'sriramasevacommitteepvv@gmail.com', amount: 10000, date: '06-07-2026', seva: 'మహిళా మండలి విరాళం', mode: 'SBI Direct Transfer', city: 'పామినివాండ్లవూరు' },
  { id: 'SRS-2026-015', donorName: 'Jyoshna / Vanama', phone: '9866125609', email: 'sriramasevacommitteepvv@gmail.com', amount: 5000, date: '06-07-2026', seva: 'స్వామివారి సేవ', mode: 'Cash Deposit', city: 'పామినివాండ్లవూరు' },
  { id: 'SRS-2026-016', donorName: 'Thaneru Munirathnam & Neelamma family', phone: '9866125609', email: 'sriramasevacommitteepvv@gmail.com', amount: 50000, date: '06-07-2026', seva: 'ఆలయ నిర్మాణ నిధి', mode: 'SBI Direct Transfer', city: 'పామినివాండ్లవూరు' }
];

export const defaultWebsiteSettings = {
  showSlideshow: true,
  showAbout: true,
  showDonations: true,
  showCommittee: true,
  showTerms: true,
  showEvents: true,
  showGallery: true,
  showNews: true,
  showReports: true,
  showContact: true
};

export const defaultGalleryImages = [
  { id: 'IMG-1', src: getAssetUrl('assets/temple_photo_1.png'), title: 'శ్రీ రామాలయ శంకుస్థాపన పవిత్ర రాతి స్తంభాల పూజ', tag: 'పామినివాండ్లవూరు శంకుస్థాపన' },
  { id: 'IMG-2', src: getAssetUrl('assets/temple_photo_2.png'), title: 'గ్రామస్థులు & భక్తుల సమక్షంలో ఆలయ పునాది పూజా మహోత్సవం', tag: 'పవిత్ర శంకుస్థాపన మహోత్సవం' },
  { id: 'IMG-3', src: getAssetUrl('assets/temple_photo_3.png'), title: 'రాతి గోడల ఆలయ శంకుస్థాపన పునాది నిర్మాణం', tag: 'ఆలయ పునాది ప్రగతి' },
  { id: 'IMG-4', src: getAssetUrl('assets/temple_photo_4.png'), title: 'అలంకరించిన టేకు కలప ప్రధాన ద్వారబంధం', tag: 'ఆలయ ద్వారబంధం' },
  { id: 'IMG-5', src: getAssetUrl('assets/temple_photo_5.png'), title: 'పునాది గుంటలో పవిత్ర రాతి రాళ్ళ ప్రతిష్ఠాపన పూజ', tag: 'గర్భగుడి శంకుస్థాపన' },
  { id: 'IMG-6', src: getAssetUrl('assets/temple_photo_6.png'), title: 'ఆలయ పెద్దలు & భక్తుల పవిత్ర దర్శన దృశ్యం', tag: 'పామినివాండ్లవూరు గ్రామస్థులు' },
  { id: 'IMG-7', src: getAssetUrl('assets/temple_photo_7.png'), title: 'శ్రీ రామాలయ ప్రాంగణం & చెక్కిన రాతి నిర్మాణం', tag: 'ఆలయ ప్రాంగణ ప్రగతి' },
  { id: 'IMG-8', src: getAssetUrl('assets/temple_photo_8.png'), title: 'శ్రీ రామాలయ రాతి గోడలు & ద్వార బంధాల అమరిక', tag: 'రాతి గోడల నిర్మాణం' },
  { id: 'IMG-9', src: getAssetUrl('assets/temple_photo_9.png'), title: 'గర్భగుడి అంతర్భాగం & చెక్కిన రాతి గోడలు', tag: 'గర్భగుడి నిర్మాణం' },
  { id: 'IMG-10', src: getAssetUrl('assets/temple_photo_10.png'), title: 'శ్రీ రామాలయ పవిత్ర రాతి నిర్మాణం పూర్తయిన దృశ్యం', tag: 'ఆలయ రాతి నిర్మాణం' }
];

const defaultMediaAssets = {
  logo: {
    type: 'fixed',
    fixedUrl: '',
    tempUrl: '',
    expiresAt: null
  },
  qrCode: {
    type: 'fixed',
    fixedUrl: '',
    tempUrl: '',
    expiresAt: null
  }
};

const initialDB = {
  devotees: [
    { id: 'DEV-1001', name: 'Thaneru Rajesh', phone: '9866125609', email: 'sriramasevacommitteepvv@gmail.com', city: 'పామినివాండ్లవూరు', registeredAt: '12-05-2026' },
    { id: 'DEV-1002', name: 'Prathap T', phone: '8431806098', email: 'prathap@gmail.com', city: 'పామినివాండ్లవూరు', registeredAt: '15-05-2026' }
  ],
  donations: [...v1ClassicDonors],
  sevaBookings: [
    { id: 'SEVA-101', devoteeName: 'Thaneru Rajesh', phone: '9866125609', sevaName: 'నిత్య పంచామృత అభిషేకం', date: '2026-08-01', amount: 501, status: 'Confirmed' }
  ],
  expenses: [],
  materials: [
    { id: 'MAT-1', type: 'రాతి రాళ్ళు (Carved Granite Stones)', qty: '38 Loads', donor: 'Thaneru Family' },
    { id: 'MAT-2', type: 'సిమెంట్ బస్తాలు (Cement Bags)', qty: '1120 Bags', donor: 'Ganesh Group' }
  ],
  volunteers: [
    { id: 'VOL-1', name: 'Ramu T', phone: '9866125609', email: 'ramu@gmail.com', task: 'అన్నదానం పర్యవేక్షణ', status: 'Active' },
    { id: 'VOL-2', name: 'Siva K', phone: '8431806098', email: 'siva@gmail.com', task: 'నిర్మాణ పర్యవేక్షణ', status: 'Active' }
  ],
  websiteSettings: { ...defaultWebsiteSettings },
  mediaAssets: { ...defaultMediaAssets },
  galleryImages: [...defaultGalleryImages],
  auditLogs: [
    { id: 'LOG-1', timestamp: '2026-07-26 09:30:00', user: 'Admin', action: 'System Database Initialized with V1 Classic Donors' }
  ]
};

const isValidImageSrc = (src) => {
  if (!src || typeof src !== 'string') return false;
  const trimmed = src.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('data:image/')) {
    if (trimmed.length < 100 || !trimmed.includes(';base64,')) return false;
    const base64Data = trimmed.split(';base64,')[1];
    if (!base64Data || base64Data.length < 50) return false;
  }
  return true;
};

export const getDB = () => {
  try {
    const data = localStorage.getItem(DB_STORAGE_KEY);
    if (!data) return initialDB;

    const parsed = JSON.parse(data);
    if (!parsed.mediaAssets) {
      parsed.mediaAssets = { ...defaultMediaAssets };
    } else {
      if (parsed.mediaAssets.logo && !isValidImageSrc(parsed.mediaAssets.logo.fixedUrl)) {
        parsed.mediaAssets.logo.fixedUrl = '';
      }
      if (parsed.mediaAssets.logo && !isValidImageSrc(parsed.mediaAssets.logo.tempUrl)) {
        parsed.mediaAssets.logo.tempUrl = '';
      }
      if (parsed.mediaAssets.qrCode && !isValidImageSrc(parsed.mediaAssets.qrCode.fixedUrl)) {
        parsed.mediaAssets.qrCode.fixedUrl = '';
      }
      if (parsed.mediaAssets.qrCode && !isValidImageSrc(parsed.mediaAssets.qrCode.tempUrl)) {
        parsed.mediaAssets.qrCode.tempUrl = '';
      }
    }
    // Filter out initial development mock expenses if present
    if (parsed.expenses && parsed.expenses.some(e => e.id === 'EXP-101' || e.id === 'EXP-102')) {
      parsed.expenses = parsed.expenses.filter(e => e.id !== 'EXP-101' && e.id !== 'EXP-102');
    }
    if (!parsed.expenses) parsed.expenses = [];

    // Ensure websiteSettings and galleryImages exist
    if (!parsed.websiteSettings) {
      parsed.websiteSettings = { ...defaultWebsiteSettings };
    }
    if (!parsed.deletedGalleryImageIds) {
      parsed.deletedGalleryImageIds = [];
    }
    if (!Array.isArray(parsed.galleryImages)) {
      parsed.galleryImages = [...defaultGalleryImages];
    } else {
      parsed.galleryImages = parsed.galleryImages.map(img => ({
        ...img,
        src: getAssetUrl(img.src)
      }));
    }
    
    // Filter out permanently deleted photos
    if (parsed.deletedGalleryImageIds && parsed.deletedGalleryImageIds.length > 0) {
      parsed.galleryImages = parsed.galleryImages.filter(img => !parsed.deletedGalleryImageIds.includes(String(img.id)));
    }

    // Ensure all V1 classic donors exist in donations list
    if (!parsed.donations || parsed.donations.length < 16) {
      if (!parsed.donations) parsed.donations = [];
      v1ClassicDonors.forEach(donor => {
        if (!parsed.donations.some(d => d.donorName.toLowerCase() === donor.donorName.toLowerCase())) {
          parsed.donations.push(donor);
        }
      });
    }
    return parsed;
  } catch (e) {
    return initialDB;
  }
};

export const saveDB = (db) => {
  try {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.error("Failed to save to localStorage", e);
  }
};

// Unique Validation Helpers
export const validateUniqueDevotee = (phone, email, currentId = null) => {
  const db = getDB();
  const cleanPhone = phone ? phone.trim().replace(/\D/g, '') : '';
  const cleanEmail = email ? email.trim().toLowerCase() : '';

  const phoneMatch = db.devotees.find(d => d.id !== currentId && d.phone.replace(/\D/g, '') === cleanPhone);
  if (phoneMatch) {
    return { valid: false, message: `ఈ ఫోన్ నంబర్ (${phone})తో ఇదివరకే ఒక భక్తుడు నమోదు కాబడి ఉన్నారు.` };
  }

  const emailMatch = db.devotees.find(d => d.id !== currentId && d.email.toLowerCase() === cleanEmail);
  if (emailMatch) {
    return { valid: false, message: `ఈ ఇమెయిల్ ఐడీ (${email})తో ఇదివరకే ఒక భక్తుడు నమోదు కాబడి ఉన్నారు.` };
  }

  return { valid: true };
};

// Record Audit Log
export const addAuditLog = (user, action) => {
  const db = getDB();
  const newLog = {
    id: 'LOG-' + Math.floor(1000 + Math.random() * 9000),
    timestamp: new Date().toLocaleString('te-IN'),
    user,
    action
  };
  if (!Array.isArray(db.auditLogs)) db.auditLogs = [];
  db.auditLogs.unshift(newLog);
  saveDB(db);
};

// Generate SQL Database Export Dump File
export const generateSqlDump = (db) => {
  const sanitize = (str) => {
    if (str === null || str === undefined) return "NULL";
    return "'" + String(str).replace(/'/g, "''") + "'";
  };

  let sql = `-- ============================================================================\n`;
  sql += `-- SRI RAMA SEVA COMMITTEE TEMPLE DATABASE EXPORT\n`;
  sql += `-- Export Date: ${new Date().toLocaleString('te-IN')}\n`;
  sql += `-- ============================================================================\n\n`;

  // Devotees SQL
  if (db.devotees && db.devotees.length > 0) {
    sql += `-- Devotees Records (${db.devotees.length})\n`;
    db.devotees.forEach(d => {
      sql += `INSERT INTO devotees (id, name, phone, email, city, registered_at) VALUES (${sanitize(d.id)}, ${sanitize(d.name)}, ${sanitize(d.phone)}, ${sanitize(d.email)}, ${sanitize(d.city)}, ${sanitize(d.registeredAt)});\n`;
    });
    sql += `\n`;
  }

  // Donations SQL
  if (db.donations && db.donations.length > 0) {
    sql += `-- Donations & Hundi Records (${db.donations.length})\n`;
    db.donations.forEach(d => {
      sql += `INSERT INTO donations (id, donor_name, phone, email, amount, date, seva, mode, city) VALUES (${sanitize(d.id)}, ${sanitize(d.donorName)}, ${sanitize(d.phone)}, ${sanitize(d.email)}, ${d.amount || 0}, ${sanitize(d.date)}, ${sanitize(d.seva)}, ${sanitize(d.mode)}, ${sanitize(d.city)});\n`;
    });
    sql += `\n`;
  }

  // Seva Bookings SQL
  if (db.sevaBookings && db.sevaBookings.length > 0) {
    sql += `-- Seva Bookings (${db.sevaBookings.length})\n`;
    db.sevaBookings.forEach(s => {
      sql += `INSERT INTO seva_bookings (id, devotee_name, phone, seva_name, date, amount, status) VALUES (${sanitize(s.id)}, ${sanitize(s.devoteeName)}, ${sanitize(s.phone)}, ${sanitize(s.sevaName)}, ${sanitize(s.date)}, ${s.amount || 0}, ${sanitize(s.status)});\n`;
    });
    sql += `\n`;
  }

  // Expenses SQL
  if (db.expenses && db.expenses.length > 0) {
    sql += `-- Construction Expenses (${db.expenses.length})\n`;
    db.expenses.forEach(e => {
      sql += `INSERT INTO expenses (id, category, amount, vendor, date, status, bill_no, notes) VALUES (${sanitize(e.id)}, ${sanitize(e.category)}, ${e.amount || 0}, ${sanitize(e.vendor)}, ${sanitize(e.date)}, ${sanitize(e.status)}, ${sanitize(e.billNo)}, ${sanitize(e.notes)});\n`;
    });
    sql += `\n`;
  }

  // Audit Logs SQL
  if (db.auditLogs && db.auditLogs.length > 0) {
    sql += `-- Audit Logs (${db.auditLogs.length})\n`;
    db.auditLogs.forEach(l => {
      sql += `INSERT INTO audit_logs (id, timestamp, user, action) VALUES (${sanitize(l.id)}, ${sanitize(l.timestamp)}, ${sanitize(l.user)}, ${sanitize(l.action)});\n`;
    });
    sql += `\n`;
  }

  return sql;
};

// Reset DB to initial seeded state
export const resetToInitialDB = () => {
  saveDB(initialDB);
  return initialDB;
};

// Dynamic Media Assets Resolvers (Fixed vs Temporary Expiry Check)
export const getActiveLogo = () => {
  try {
    const db = getDB();
    const logo = db.mediaAssets?.logo;
    if (logo && logo.type === 'temporary' && logo.tempUrl && logo.expiresAt) {
      if (Date.now() < logo.expiresAt && isValidImageSrc(logo.tempUrl)) {
        return getAssetUrl(logo.tempUrl);
      }
    }
    if (logo && logo.fixedUrl && isValidImageSrc(logo.fixedUrl)) {
      return getAssetUrl(logo.fixedUrl);
    }
  } catch (e) {}
  return getAssetUrl('assets/logo.jpg');
};

export const getActiveQrCode = () => {
  try {
    const db = getDB();
    const qr = db.mediaAssets?.qrCode;
    if (qr && qr.type === 'temporary' && qr.tempUrl && qr.expiresAt) {
      if (Date.now() < qr.expiresAt && isValidImageSrc(qr.tempUrl)) {
        return getAssetUrl(qr.tempUrl);
      }
    }
    if (qr && qr.fixedUrl && isValidImageSrc(qr.fixedUrl)) {
      return getAssetUrl(qr.fixedUrl);
    }
  } catch (e) {}
  return getAssetUrl('assets/phonepe_qr.png');
};

// Set Fixed or Temporary Media Asset
export const updateMediaAsset = (assetKey, type, imageUrl, durationHours = 24) => {
  const db = getDB();
  if (!db.mediaAssets) db.mediaAssets = { logo: { type: 'fixed' }, qrCode: { type: 'fixed' } };
  if (!db.mediaAssets[assetKey]) db.mediaAssets[assetKey] = { type: 'fixed' };

  if (type === 'fixed') {
    db.mediaAssets[assetKey].type = 'fixed';
    db.mediaAssets[assetKey].fixedUrl = imageUrl;
    db.mediaAssets[assetKey].tempUrl = '';
    db.mediaAssets[assetKey].expiresAt = null;
  } else {
    const expiresAt = Date.now() + (Number(durationHours) || 24) * 60 * 60 * 1000;
    db.mediaAssets[assetKey].type = 'temporary';
    db.mediaAssets[assetKey].tempUrl = imageUrl;
    db.mediaAssets[assetKey].expiresAt = expiresAt;
  }

  saveDB(db);
  return db;
};

// Reset Media Asset to Default
export const resetMediaAsset = (assetKey) => {
  const db = getDB();
  if (db.mediaAssets && db.mediaAssets[assetKey]) {
    db.mediaAssets[assetKey] = {
      type: 'fixed',
      fixedUrl: '',
      tempUrl: '',
      expiresAt: null
    };
    saveDB(db);
  }
  return db;
};
