import React from 'react';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex justify-between items-center pb-4 border-b border-white/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white heading-telugu">
            ఎగ్జిక్యూటివ్ ఫైనాన్షియల్ డాష్‌బోర్డ్ (Executive Dashboard)
          </h1>
          <p className="text-xs sm:text-sm text-amber-300 font-bold">
            శ్రీ రామాలయం రాతి గోడల నిర్మాణం & విరాళాల జమ ఖర్చుల రికార్డులు.
          </p>
        </div>
        <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950 px-3.5 py-1.5 rounded-full border border-emerald-400/50">
          • LIVE AUDIT READY
        </span>
      </div>

      {/* Financial Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#5C121E] to-[#2D080E] border-2 border-emerald-400 p-6 rounded-3xl space-y-2 shadow-2xl">
          <span className="text-xs font-black text-emerald-300 uppercase">మొత్తం వసూలైన విరాళాలు (Total Donations)</span>
          <h2 className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">₹ 15,48,500</h2>
          <span className="text-[11px] text-gray-300 block font-bold">16 దాతల రికార్డులు</span>
        </div>

        <div className="bg-gradient-to-br from-[#5C121E] to-[#2D080E] border-2 border-amber-400 p-6 rounded-3xl space-y-2 shadow-2xl">
          <span className="text-xs font-black text-amber-300 uppercase">నిర్మాణ ఖర్చులు (Total Expenses)</span>
          <h2 className="text-3xl sm:text-4xl font-black text-amber-300 font-mono">₹ 11,20,000</h2>
          <span className="text-[11px] text-gray-300 block font-bold">రాతి రాళ్ళు, సిమెంట్ & ద్వార బంధాలు</span>
        </div>

        <div className="bg-gradient-to-br from-[#5C121E] to-[#2D080E] border-2 border-[#FFD700] p-6 rounded-3xl space-y-2 shadow-2xl">
          <span className="text-xs font-black text-[#FFD700] uppercase">నికర నిల్వ (Net Fund Balance)</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#FFD700] font-mono">₹ 4,28,500</h2>
          <span className="text-[11px] text-emerald-300 block font-bold">SBI బ్యాంక్ ఖాతాలో నిల్వ</span>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <a href="/donations" className="bg-[#2A060B] border-2 border-amber-400/60 p-6 rounded-3xl hover:border-[#FFD700] transition space-y-3">
          <h3 className="text-lg font-black text-[#FFD700] heading-telugu">🧾 రశీదుల జారీ & దాతల శోధన</h3>
          <p className="text-xs text-gray-300 font-bold">దాతల పేరు లేదా PAN నంబర్ ద్వారా శోధించి 80G పన్ను మినహాయింపు రశీదు PDF జారీ చేయండి.</p>
        </a>

        <a href="/reconciliation" className="bg-[#2A060B] border-2 border-amber-400/60 p-6 rounded-3xl hover:border-[#FFD700] transition space-y-3">
          <h3 className="text-lg font-black text-[#FFD700] heading-telugu">💳 Razorpay ఆన్‌లైన్ పేమెంట్ రీకాన్సిలియేషన్</h3>
          <p className="text-xs text-gray-300 font-bold">ఆన్‌లైన్ చెల్లింపుల ఆర్డర్ ఐడీలు, సిగ్నేచర్ హ్యాష్ మరియు పేమెంట్ స్టేటస్ ఆడిట్ చేయండి.</p>
        </a>
      </div>
    </div>
  );
}
