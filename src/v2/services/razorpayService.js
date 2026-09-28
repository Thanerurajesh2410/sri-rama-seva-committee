// Razorpay Checkout Integration Service for Sri Rama Seva Committee
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
 * Open Razorpay Payment Modal
 * @param {Object} params
 * @param {number} params.amount - Donation amount in INR
 * @param {string} params.donorName - Donor full name
 * @param {string} params.phone - Donor mobile number
 * @param {string} params.email - Donor email
 * @param {string} params.city - Donor village/city
 * @param {string} params.seva - Selected Seva or donation category
 * @param {string} params.panNumber - Optional PAN number for 80G tax receipt
 * @param {string} params.keyId - Razorpay Key ID
 * @param {Function} params.onSuccess - Callback receiving payment response
 * @param {Function} params.onFailure - Callback on payment failure/cancel
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
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    alert("Razorpay పేమెంట్ గేట్‌వే రన్ కాలేదు. దయచేసి ఇంటర్నెట్ కనెక్షన్ తనిఖీ చేయండి.");
    if (onFailure) onFailure("Failed to load Razorpay SDK");
    return;
  }

  const razorpayKey = keyId || 'rzp_test_SRSC1008Temple';

  const options = {
    key: razorpayKey,
    amount: Math.round(Number(amount) * 100), // Amount in paise
    currency: 'INR',
    name: 'శ్రీ రామా సేవా కమిటీ',
    description: `ఆలయ నిర్మాణ నిధి విరాళం: ${seva}`,
    image: getAssetUrl('assets/logo.jpg'),
    handler: function (response) {
      if (onSuccess) {
        onSuccess({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id || '',
          signature: response.razorpay_signature || '',
          amount: Number(amount),
          donorName,
          phone,
          email,
          city,
          seva,
          panNumber,
          mode: 'Razorpay Online'
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
        if (onFailure) onFailure("Payment cancelled by user");
      }
    }
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.on('payment.failed', function (response) {
    console.error("Payment failure:", response.error);
    if (onFailure) onFailure(response.error.description || "Payment Failed");
  });

  paymentObject.open();
};
