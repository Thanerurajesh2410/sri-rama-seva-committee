// Express Backend & Database REST API Server with Swagger UI for Sri Rama Seva Committee
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded from project root directory regardless of CWD
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const DB_FILE = path.join(__dirname, 'db.json');
const SWAGGER_FILE = path.join(__dirname, 'swagger.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '50mb' }));

// CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Load Swagger JSON specification
let swaggerDocument = {};
try {
  if (fs.existsSync(SWAGGER_FILE)) {
    const rawSwagger = fs.readFileSync(SWAGGER_FILE, 'utf-8');
    swaggerDocument = JSON.parse(rawSwagger);
  }
} catch (err) {
  console.error("Failed to load swagger.json:", err);
}

// Serve Interactive Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none } body { background-color: #FDFBF7; }',
  customSiteTitle: 'Sri Rama Seva Committee (SRSC) REST API Documentation'
}));

// Route for raw OpenAPI spec export
app.get('/api/openapi.json', (req, res) => {
  res.json(swaggerDocument);
});

// Default Initial Seed Data if DB file does not exist
const initialDB = {
  devotees: [
    { id: 'DEV-1001', name: 'Thaneru Rajesh', phone: '9866125609', email: 'thanerurajesh@gmail.com', city: 'పామినివాండ్లవూరు', gothram: 'Kashyapa', registeredAt: '15/08/2026' },
    { id: 'DEV-1002', name: 'K. Venkatramaiah', phone: '9440123456', email: 'venkat@gmail.com', city: 'బాంగారుపాలెం', gothram: 'Bharadwaja', registeredAt: '14/08/2026' },
    { id: 'DEV-1003', name: 'P. Subramanyam', phone: '9885011223', email: 'subbu@yahoo.com', city: 'చిత్తూరు', gothram: 'Srivatsa', registeredAt: '12/08/2026' }
  ],
  donations: [
    { id: 'SRS-2026-001', donorName: 'Thaneru Rajesh', phone: '9866125609', email: 'rajesh@example.com', amount: 10016, date: '15/08/2026', seva: 'ఆలయ నిర్మాణ విరాళం (Garbhalaya Construction)', mode: 'Online (UPI / PhonePe)', city: 'పామినివాండ్లవూరు', transactionId: 'TXN-986612-001' },
    { id: 'SRS-2026-002', donorName: 'K. Venkatramaiah', phone: '9440123456', email: 'venkat@gmail.com', amount: 50016, date: '14/08/2026', seva: 'ముఖ్య దాత (Main Donor - Pillar Construction)', mode: 'Bank Transfer (NEFT)', city: 'బాంగారుపాలెం', transactionId: 'TXN-944012-002' },
    { id: 'SRS-2026-003', donorName: 'P. Subramanyam', phone: '9885011223', email: 'subbu@yahoo.com', amount: 11016, date: '12/08/2026', seva: 'అన్నదాన నిధి (Annadanam Fund)', mode: 'Cash', city: 'చిత్తూరు', transactionId: 'TXN-988501-003' },
    { id: 'SRS-2026-004', donorName: 'S. Ramanamma', phone: '9848011223', email: 'ramanamma@gmail.com', amount: 5016, date: '10/08/2026', seva: 'నిత్య విగ్రహాల అలంకార విరాళం', mode: 'PhonePe', city: 'పామినివాండ్లవూరు', transactionId: 'TXN-984801-004' }
  ],
  poojas: [
    { id: 'BK-2026-001', devoteeName: 'K. Venkatramaiah', phone: '9440123456', gothram: 'Bharadwaja', poojaName: 'శ్రీ సీతా రామ కళ్యాణం (Sita Rama Kalyanam)', bookingDate: '2026-08-25', timeSlot: '09:00 AM - 11:30 AM', amount: 1116, status: 'Confirmed', createdAt: '15/08/2026' },
    { id: 'BK-2026-002', devoteeName: 'S. Ramanamma', phone: '9848011223', gothram: 'Kashyapa', poojaName: 'నిత్య అర్చన & రుద్రాభిషేకం', bookingDate: '2026-08-20', timeSlot: '07:00 AM - 08:30 AM', amount: 516, status: 'Confirmed', createdAt: '14/08/2026' }
  ],
  events: [
    { id: 1, titleEn: 'Sri Rama Navami Grand Festival & Sita Rama Kalyanam', titleTe: 'శ్రీరామ నవమి మహోత్సవం & సీతా రామ కళ్యాణం', eventDate: '2026-04-12', eventTime: '08:00 AM onwards', location: 'Sri Rama Temple, Paminivandla Vooru', description: 'Grand Sita Rama Kalyanam, Mahaprasadam Annadanam, and procession.', category: 'Festival', rsvpCount: 480 },
    { id: 2, titleEn: 'Hanuman Jayanti Special Abhishekam & Parayanam', titleTe: 'హనుమాన్ జయంతి విశేష అభిషేకం & పారాయణం', eventDate: '2026-05-18', eventTime: '06:00 AM - 12:00 PM', location: 'Sri Rama Temple Premises', description: 'Sundarakanda parayanam, special butter decoration to Anjaneya Swamy.', category: 'Pooja', rsvpCount: 210 },
    { id: 3, titleEn: 'Temple Garbhalaya Bhoomi Pooja & Foundation Ceremony', titleTe: 'ఆలయ గర్భాలయ భూమి పూజా కార్యక్రమం', eventDate: '2026-09-05', eventTime: '07:30 AM Muhurtham', location: 'Main Construction Site, Paminivandla Vooru', description: 'Sacred brick laying and foundation ceremony with Veda Chanting.', category: 'Construction', rsvpCount: 650 }
  ],
  volunteers: [
    { id: 1, fullName: 'M. Suresh', phone: '9988776655', email: 'suresh@example.com', village: 'పామినివాండ్లవూరు', serviceInterest: 'Annadanam & Prasadam Distribution', registeredAt: '15/08/2026' },
    { id: 2, fullName: 'T. Lokesh', phone: '9700112233', email: 'lokesh@example.com', village: 'పామినివాండ్లవూరు', serviceInterest: 'Decoration & Stage Setup', registeredAt: '14/08/2026' }
  ],
  queries: []
};

// Database Read Handler
const readDB = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2), 'utf-8');
      return initialDB;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    
    // Ensure all default collections exist with seed data if empty
    let updated = false;
    ['devotees', 'donations', 'poojas', 'events', 'volunteers'].forEach(key => {
      if (!parsed[key] || !Array.isArray(parsed[key]) || parsed[key].length === 0) {
        parsed[key] = initialDB[key];
        updated = true;
      }
    });

    if (updated) {
      writeDB(parsed);
    }
    return parsed;
  } catch (err) {
    console.error("Read DB Error:", err);
    return initialDB;
  }
};

// Database Write Handler
const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error("Write DB Error:", err);
    return false;
  }
};

// 1. GET API Health & Summary
app.get('/api/health', (req, res) => {
  const db = readDB();
  const devoteeCount = db.devotees ? db.devotees.length : 0;
  const donationCount = db.donations ? db.donations.length : 0;
  const totalAmount = db.donations ? db.donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0) : 0;
  const bookingCount = db.poojas ? db.poojas.length : 0;
  
  res.json({
    status: 'ONLINE',
    database: 'Sri Rama Temple Persistent Database Engine',
    devotees: devoteeCount,
    donations: donationCount,
    totalCollected: totalAmount,
    poojaBookings: bookingCount,
    swaggerDocs: `http://localhost:${PORT}/api-docs`,
    timestamp: new Date().toISOString()
  });
});

// 2. GET Full Database Dump
app.get('/api/database', (req, res) => {
  res.json(readDB());
});

// 3. POST Sync / Save Database
app.post('/api/database/save', (req, res) => {
  const newDB = req.body;
  if (!newDB || typeof newDB !== 'object') {
    return res.status(400).json({ error: 'Invalid database payload' });
  }
  const success = writeDB(newDB);
  if (success) {
    res.json({ message: 'Database state updated successfully', timestamp: new Date().toISOString() });
  } else {
    res.status(500).json({ error: 'Failed to write to database storage' });
  }
});

// 4. GET Donations List
app.get('/api/donations', (req, res) => {
  const db = readDB();
  res.json(db.donations || []);
});

// 5. GET Donation Stats
app.get('/api/donations/stats', (req, res) => {
  const db = readDB();
  const donations = db.donations || [];
  const totalCollected = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const targetGoal = 1500000; // Rs. 15 Lakhs Target
  const percentCompleted = Number(((totalCollected / targetGoal) * 100).toFixed(1));

  res.json({
    totalCollected,
    targetGoal,
    totalDonors: donations.length,
    percentCompleted
  });
});

// 6. POST Record New Donation
app.post('/api/donations', (req, res) => {
  const db = readDB();
  if (!db.donations) db.donations = [];

  const donorName = req.body.donorName || 'Anonymous Devotee';
  const amount = Number(req.body.amount) || 0;

  if (amount <= 0) {
    return res.status(400).json({ error: 'Donation amount must be greater than 0' });
  }

  const newDonation = {
    id: `SRS-2026-${String(db.donations.length + 1).padStart(3, '0')}`,
    donorName: donorName,
    phone: req.body.phone || '',
    email: req.body.email || '',
    amount: amount,
    date: req.body.date || new Date().toLocaleDateString('te-IN'),
    seva: req.body.seva || 'ఆలయ విరాళం',
    mode: req.body.mode || 'Online (UPI / PhonePe)',
    city: req.body.city || 'పామినివాండ్లవూరు',
    transactionId: req.body.transactionId || `TXN-${Date.now().toString().slice(-6)}`
  };

  db.donations.unshift(newDonation);
  writeDB(db);
  res.status(201).json({ message: 'Donation recorded successfully', donation: newDonation });
});

// 7. GET Pooja Bookings
app.get('/api/poojas/bookings', (req, res) => {
  const db = readDB();
  const bookings = db.poojas && db.poojas.length > 0 ? db.poojas : (db.sevaBookings || initialDB.poojas);
  res.json(bookings);
});

// 8. POST Book Pooja
app.post('/api/poojas/bookings', (req, res) => {
  const db = readDB();
  if (!db.poojas) db.poojas = [];

  if (!req.body.devoteeName || !req.body.poojaName || !req.body.bookingDate) {
    return res.status(400).json({ error: 'Missing required booking fields (devoteeName, poojaName, bookingDate)' });
  }

  const newBooking = {
    id: `BK-2026-${String(db.poojas.length + 1).padStart(3, '0')}`,
    devoteeName: req.body.devoteeName,
    phone: req.body.phone || '',
    gothram: req.body.gothram || 'Kashyapa',
    poojaName: req.body.poojaName,
    bookingDate: req.body.bookingDate,
    timeSlot: req.body.timeSlot || '09:00 AM - 11:00 AM',
    amount: Number(req.body.amount) || 516,
    status: 'Confirmed',
    createdAt: new Date().toLocaleDateString('te-IN')
  };

  db.poojas.unshift(newBooking);
  writeDB(db);
  res.status(201).json({ message: 'Pooja slot reserved successfully', booking: newBooking });
});

// 9. GET Events
app.get('/api/events', (req, res) => {
  const db = readDB();
  const events = db.events && db.events.length > 0 ? db.events : initialDB.events;
  res.json(events);
});

// 10. POST Create Event
app.post('/api/events', (req, res) => {
  const db = readDB();
  if (!db.events) db.events = [];

  const newEvent = {
    id: db.events.length + 1,
    titleEn: req.body.titleEn || 'Special Temple Event',
    titleTe: req.body.titleTe || 'విశేష ఆలయ కార్యక్రమం',
    eventDate: req.body.eventDate || new Date().toISOString().split('T')[0],
    eventTime: req.body.eventTime || '08:00 AM',
    location: req.body.location || 'Sri Rama Temple, Paminivandla Vooru',
    description: req.body.description || '',
    category: req.body.category || 'Festival',
    rsvpCount: 0
  };

  db.events.push(newEvent);
  writeDB(db);
  res.status(201).json({ message: 'Event added successfully', event: newEvent });
});

// 11. GET Devotees
app.get('/api/devotees', (req, res) => {
  const db = readDB();
  res.json(db.devotees || []);
});

// 12. POST Register Devotee
app.post('/api/devotees', (req, res) => {
  const db = readDB();
  if (!db.devotees) db.devotees = [];

  const phone = (req.body.phone || req.body.phone || '').trim();

  if (phone && db.devotees.some(d => d.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''))) {
    return res.status(400).json({ error: 'Devotee with this phone number already exists' });
  }

  const newDevotee = {
    id: `DEV-${1001 + db.devotees.length}`,
    name: req.body.name,
    phone: phone,
    email: (req.body.email || '').trim().toLowerCase(),
    city: req.body.city || 'పామినివాండ్లవూరు',
    gothram: req.body.gothram || '',
    registeredAt: new Date().toLocaleDateString('te-IN')
  };

  db.devotees.push(newDevotee);
  writeDB(db);
  res.status(201).json({ message: 'Devotee registered successfully', devotee: newDevotee });
});

// 13. GET Volunteers & POST Volunteer Application
app.get('/api/volunteers', (req, res) => {
  const db = readDB();
  res.json(db.volunteers || []);
});

app.post('/api/volunteers', (req, res) => {
  const db = readDB();
  if (!db.volunteers) db.volunteers = [];

  const newVolunteer = {
    id: db.volunteers.length + 1,
    fullName: req.body.fullName || req.body.name,
    phone: req.body.phone || '',
    email: req.body.email || '',
    village: req.body.village || 'పామినివాండ్లవూరు',
    serviceInterest: req.body.serviceInterest || 'General Divine Service',
    registeredAt: new Date().toLocaleDateString('te-IN')
  };

  db.volunteers.push(newVolunteer);
  writeDB(db);
  res.status(201).json({ message: 'Volunteer application submitted successfully', volunteer: newVolunteer });
});

// 14. POST Contact Query
app.post('/api/contact', (req, res) => {
  const db = readDB();
  if (!db.queries) db.queries = [];

  const newQuery = {
    id: `QRY-${Date.now()}`,
    name: req.body.name || 'Visitor',
    email: req.body.email || '',
    phone: req.body.phone || '',
    message: req.body.message || '',
    submittedAt: new Date().toISOString()
  };

  db.queries.push(newQuery);
  writeDB(db);
  res.status(201).json({ message: 'Message submitted successfully', query: newQuery });
});

// Initialize Razorpay Instance from Environment Variables
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || '';
  return new Razorpay({ key_id, key_secret });
};

// STEP 1: BACKEND - Create Order API Endpoints (/api/create-order & /api/payment/create-order)
const handleCreateOrder = async (req, res) => {
  try {
    const rawAmount = req.body.amount;
    const currency = req.body.currency || 'INR';
    const receipt = req.body.receipt || `rcptid_${Date.now()}`;

    if (!rawAmount || isNaN(Number(rawAmount))) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    // Convert amount to paise if passed in Rupees (e.g. 100 Rs = 10000 paise).
    // If rawAmount is already >= 100 and passed as paise, use it directly.
    let amountInPaise = Math.round(Number(rawAmount));
    if (amountInPaise < 100) {
      amountInPaise = amountInPaise * 100;
    }

    if (amountInPaise < 100) {
      return res.status(400).json({ error: 'Amount must be at least 100 paise (Rs. 1)' });
    }

    const razorpay = getRazorpayInstance();
    const orderOptions = {
      amount: amountInPaise,
      currency,
      receipt
    };

    const order = await razorpay.orders.create(orderOptions);

    return res.status(200).json({
      order_id: order.id,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      receipt: order.receipt
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    if (error.statusCode === 401 || (error.error && error.error.code === 'BAD_REQUEST_ERROR')) {
      return res.status(401).json({ error: 'Razorpay API Authentication Failed', details: error.message });
    }
    return res.status(500).json({ error: 'Failed to create Razorpay order', details: error.message || error });
  }
};

app.post('/api/create-order', handleCreateOrder);
app.post('/api/payment/create-order', handleCreateOrder);

// STEP 3: BACKEND - Verify Payment Signature API Endpoints (/api/verify-payment & /api/payment/verify)
const handleVerifyPayment = (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        error: 'Missing required payment verification fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required'
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    const bodyData = razorpay_order_id + '|' + razorpay_payment_id;
    
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(bodyData)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      return res.status(200).json({
        status: 'success',
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      });
    } else {
      console.warn(`Payment signature mismatch! Received: ${razorpay_signature}, Expected: ${generatedSignature}`);
      return res.status(400).json({
        status: 'failure',
        error: 'Invalid payment signature. Payment verification failed.'
      });
    }
  } catch (error) {
    console.error('Error verifying Razorpay signature:', error);
    return res.status(500).json({ error: 'Internal server error during verification', details: error.message });
  }
};

app.post('/api/verify-payment', handleVerifyPayment);
app.post('/api/payment/verify', handleVerifyPayment);

app.listen(PORT, () => {
  console.log(`Sri Rama Seva Committee REST API & Database running at http://localhost:${PORT}`);
  console.log(`Swagger UI Documentation available at http://localhost:${PORT}/api-docs`);
});
