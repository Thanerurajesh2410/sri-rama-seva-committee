'use client';

import React, { useState } from 'react';

const mockDonations = [
  { id: 'SRS-2026-001', name: 'Thaneru Munirathnam & Neelamma family', amount: 50000, date: '06-07-2026', mode: 'SBI Direct Transfer', pan: 'ABCDE1234F', category: 'ఆలయ నిర్మాణ నిధి' },
  { id: 'SRS-2026-002', name: 'Thaneru Rajesh', amount: 5000, date: '12-06-2026', mode: 'Razorpay Online (pay_P1008)', pan: 'XYZPD9876K', category: 'రాతి గోడల నిర్మాణం' },
  { id: 'SRS-2026-003', name: 'Prathap T', amount: 5000, date: '15-05-2026', mode: 'Razorpay Online (pay_P1009)', pan: 'PLMKO5432M', category: 'రాతి గోడల నిర్మాణం' }
];

export default function DonationsLedgerPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockDonations.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.pan && d.pan.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white heading-telugu">
            🧾 విరాళాలు & రశీదుల లేడ్జర్ (Donations & 80G Receipts)
          </h1>
          <p className="text-xs sm:text-sm text-amber-300 font-bold">
            అధికారిక రశీదు నంబర్ లేదా PAN నంబర్ ద్వారా దాతల సమాచారం శోధించండి.
          </p>
        </div>
      </div>

      <div className="bg-[#2A060B] border-2 border-amber-400/60 p-4 rounded-2xl">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 దాత పేరు, రశీదు నంబర్ లేదా PAN కార్డ్ నంబర్ నమోదు చేయండి..."
          className="w-full bg-[#1A0306] border border-amber-400/40 p-3 rounded-xl text-white font-extrabold focus:border-[#FFD700] outline-none text-sm"
        />
      </div>

      <div className="bg-[#2A060B] border-2 border-amber-400/40 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#5C121E] text-[#FFD700] font-black border-b border-amber-400/40 uppercase">
              <tr>
                <th className="p-4">రశీదు సంఖ్య</th>
                <th className="p-4">దాత పేరు</th>
                <th className="p-4">విరాళం మొత్తం</th>
                <th className="p-4">PAN నంబర్ (80G)</th>
                <th className="p-4">చెల్లింపు మార్గం</th>
                <th className="p-4">తేదీ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 font-extrabold">
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-white/5 transition">
                  <td className="p-4 font-mono text-amber-300">{d.id}</td>
                  <td className="p-4 text-white">{d.name}</td>
                  <td className="p-4 font-mono text-emerald-400 text-base">₹ {d.amount.toLocaleString()}</td>
                  <td className="p-4 font-mono uppercase text-amber-200">{d.pan || 'N/A'}</td>
                  <td className="p-4 text-gray-300">{d.mode}</td>
                  <td className="p-4 font-mono text-gray-400">{d.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
