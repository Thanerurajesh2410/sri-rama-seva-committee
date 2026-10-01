'use client';

import React, { useState } from 'react';

export default function EDonationsPage() {
  const [donorName, setDonorName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('1116');
  const [panNumber, setPanNumber] = useState('');
  const [category, setCategory] = useState('రాతి గోడల నిర్మాణం');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`శ్రీ ${donorName} గారూ, ₹ ${amount} ఆన్‌లైన్ పేమెంట్ గేట్‌వే ద్వారా విరాళం స్వీకరించబడుతోంది.`);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl space-y-8">
      <div className="text-center space-y-3">
        <span className="bg-amber-100 text-amber-950 font-black text-xs px-4 py-1.5 rounded-full border border-amber-400">
          పవిత్ర ధర్మ నిధి
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white heading-telugu">
          ఈ-హుండి & విరాళాల సమర్పణ (Online E-Hundi)
        </h1>
        <p className="text-sm sm:text-base text-amber-300 font-bold">
          శ్రీ సీతారాములవారి ఆలయ నిర్మాణానికి పవిత్ర కానుకలు సమర్పించండి.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-gradient-to-b from-[#5C121E] to-[#200407] border-3 border-[#FFD700] p-6 sm:p-8 rounded-3xl space-y-6 text-white shadow-2xl">
        <div className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-black text-amber-200 mb-1">1. దాత పేరు (Full Name) *:</label>
            <input
              type="text"
              required
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="ఉదా: శ్రీ తనేరు రాజేష్"
              className="w-full bg-[#1A0306] border-2 border-amber-400/60 p-3.5 rounded-xl text-white font-extrabold focus:border-[#FFD700] outline-none"
            />
          </div>

          <div>
            <label className="block font-black text-amber-200 mb-1">2. మొబైల్ ఫోన్ నంబర్ (Phone Number) *:</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="ఉదా: 9866125609"
              className="w-full bg-[#1A0306] border-2 border-amber-400/60 p-3.5 rounded-xl text-white font-extrabold focus:border-[#FFD700] outline-none font-mono"
            />
          </div>

          <div>
            <label className="block font-black text-amber-200 mb-1">3. విరాళం మొత్తం (Amount Rs. ₹) *:</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1116"
              className="w-full bg-[#1A0306] border-2 border-amber-400/60 p-3.5 rounded-xl text-white font-black text-base focus:border-[#FFD700] outline-none font-mono"
            />
          </div>

          <div className="bg-black/40 p-4 rounded-2xl border border-amber-400/30">
            <label className="block font-black text-amber-200 mb-1">
              4. PAN కార్డ్ నంబర్ (PAN Card Number) <span className="text-amber-400 font-normal">(Optional / ఐచ్ఛికం)</span>:
            </label>
            <input
              type="text"
              maxLength={10}
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
              placeholder="ఉదా: ABCDE1234F"
              className="w-full bg-[#1A0306] border-2 border-amber-400/60 p-3 rounded-xl text-white font-mono font-black uppercase outline-none"
            />
            <p className="text-[11px] text-amber-300 font-bold mt-2">
              💡 <strong>PAN నంబర్ ఎందుకు?:</strong> అధికారిక ఆలయ రశీదు మరియు ప్రభుత్వ పారదర్శకత రికార్డు కొరకు PAN వివరాలు సేకరిస్తారు.
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 px-6 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-black font-black text-lg rounded-2xl border-2 border-[#FFD700] shadow-2xl hover:scale-105 transition"
        >
          💳 ఆన్‌లైన్ గేట్‌వే ద్వారా విరాళం చెల్లించండి (Pay via Razorpay)
        </button>
      </form>
    </div>
  );
}
