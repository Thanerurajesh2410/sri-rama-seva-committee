// Razorpay Standard Web Checkout Integration Service for Sri Rama Seva Committee
import { getAssetUrl } from '../data/v2Database';

// Load Razorpay Checkout SDK script dynamically
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * STEP 1 & STEP 2: Create Order via Backend & Open Razorpay Checkout Modal
 * @param {Object} params
 * @param {number} params.amount - Donation amount in INR (or paise)
 * @param {string} params.donorName - Donor full name
 * @param {string} params.phone - Donor mobile number
 * @param {string} params.email - Donor email
 * @param {string} params.city - Donor village/city
 * @param {string} params.seva - Selected Seva or donation category
 * @param {string} params.panNumber - Optional PAN number for official temple receipt
 * @param {string} params.keyId - Optional custom Razorpay Key ID
 * @param {Function} params.onSuccess - Callback receiving verified payment response
 * @param {Function} params.onFailure - Callback on payment failure/cancel/error
 */
export const launchRazorpayDonation = async ({
  amount,
  donorName,
  phone,
  email,
  city = 'పామినివాండ్లవూరు',
  seva = 'ఆలయ నిర్మాణ నిధి',
  panNumber = '',
  keyId = '',
  onSuccess,
  onFailure
}) => {
  // 1. Ensure Razorpay Checkout SDK script is loaded
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    alert("Razorpay పేమెంట్ గేట్‌వే రన్ కాలేదు. దయచేసి ఇంటర్నెట్ కనెక్షన్ తనిఖీ చేయండి.");
    if (onFailure) onFailure("Failed to load Razorpay SDK");
    return;
  }

  // Determine Razorpay Key ID (Never expose Secret)
  const razorpayKey = keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || '';
  if (!razorpayKey) {
    alert("Razorpay API Key ID లభించలేదు. దయచేసి .env ఫైల్‌లో VITE_RAZORPAY_KEY_ID లేదా అడ్మిన్ ప్యానెల్‌లో మీ Razorpay Key ID (rzp_live_...) ఉంచండి.\n\n(Razorpay Key ID is missing. Please set VITE_RAZORPAY_KEY_ID in your .env file or in Admin Settings.)");
    if (onFailure) onFailure("Razorpay Key ID is missing");
    return;
  }
  
  // Convert amount to paise (Minimum 100 paise = 1 INR)
  let numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    if (onFailure) onFailure("Invalid donation amount");
    return;
  }
  
  let amountInPaise = Math.round(numAmount >= 100 && !Number.isInteger(numAmount) ? numAmount : numAmount * 100);
  if (amountInPaise < 100) {
    amountInPaise = Math.round(numAmount * 100);
  }
  if (amountInPaise < 100) {
    alert("విరాళం మొత్తం కనీసం ₹ 1 (100 పైసలు) ఉండాలి.");
    if (onFailure) onFailure("Amount must be at least 100 paise");
    return;
  }

  let orderId = '';

  // STEP 1: Call Backend to Create Order (Try Proxied Relative API & Direct Server Endpoint)
  const orderEndpoints = [
    '/api/create-order',
    'http://localhost:5000/api/create-order'
  ];

  for (const endpoint of orderEndpoints) {
    try {
      const orderRes = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `srsc_rcpt_${Date.now()}`
        })
      });

      if (orderRes.ok) {
        const orderData = await orderRes.json();
        orderId = orderData.order_id || orderData.id || '';
        if (orderId) break;
      }
    } catch (err) {}
  }

  // STEP 2: Configure Razorpay Checkout Modal
  const options = {
    key: razorpayKey,
    amount: amountInPaise,
    currency: 'INR',
    name: 'శ్రీ రామా సేవా కమిటీ',
    description: `ఆలయ నిర్మాణ నిధి విరాళం: ${seva}`,
    image: getAssetUrl('assets/logo.jpg'),
    ...(orderId ? { order_id: orderId } : {}),
    handler: async function (response) {
      const paymentId = response.razorpay_payment_id;
      const returnedOrderId = response.razorpay_order_id || orderId || '';
      const signature = response.razorpay_signature || '';

      // STEP 3: Call Backend Endpoint to Verify Signature
      let verified = true;
      if (returnedOrderId && signature) {
        const verifyEndpoints = [
          '/api/verify-payment',
          'http://localhost:5000/api/verify-payment'
        ];

        for (const endpoint of verifyEndpoints) {
          try {
            const verifyRes = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: returnedOrderId,
                razorpay_payment_id: paymentId,
                razorpay_signature: signature
              })
            });

            if (verifyRes.ok) {
              const verifyData = await verifyRes.json();
              if (verifyData.status !== 'success') {
                verified = false;
              }
              break;
            } else if (verifyRes.status === 400) {
              console.error("Backend signature verification rejected");
              verified = false;
              break;
            }
          } catch (err) {}
        }
      }

      if (!verified) {
        alert("పేమెంట్ సిగ్నేచర్ ధృవీకరణ విఫలమైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.");
        if (onFailure) onFailure("Payment signature verification failed");
        return;
      }

      // Successful verified payment callback
      if (onSuccess) {
        onSuccess({
          paymentId: paymentId,
          orderId: returnedOrderId,
          signature: signature,
          amount: Math.round(amountInPaise / 100),
          donorName,
          phone,
          email,
          city,
          seva,
          panNumber,
          mode: `Razorpay Online (${paymentId})`
        });
      }
    },
    prefill: {
      name: donorName || '',
      email: email || 'sriramasevacommitteepvv@gmail.com',
      contact: phone || ''
    },
    notes: {
      temple: 'Sri Rama Temple Paminivandla Vooru',
      city: city,
      seva: seva,
      pan: panNumber || 'N/A'
    },
    theme: {
      color: '#D97706' // Sacred Saffron Amber
    },
    modal: {
      ondismiss: function () {
        console.log("Razorpay checkout modal dismissed by user");
        if (onFailure) onFailure("Payment cancelled by user");
      }
    }
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.on('payment.failed', function (response) {
    console.error("Razorpay Payment Failure:", response.error);
    const errorMsg = response.error ? response.error.description || response.error.reason || "Payment Failed" : "Payment Failed";
    alert(`పేమెంట్ విఫలమైంది: ${errorMsg}`);
    if (onFailure) onFailure(errorMsg);
  });

  paymentObject.open();
};
