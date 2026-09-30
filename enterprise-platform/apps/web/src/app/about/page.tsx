import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl space-y-8">
      <div className="text-center space-y-3">
        <span className="bg-amber-100 text-amber-950 font-black text-xs px-4 py-1.5 rounded-full border border-amber-400">
          ఆలయ విశేషాలు & చరిత్ర
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white heading-telugu">
          శ్రీ రామా సేవా కమిటీ పామినివాండ్లవూరు
        </h1>
        <p className="text-sm sm:text-base text-amber-300 font-bold">
          మంగళపల్లె పంచాయతీ • బంగారుపాళెం మండలం • చిత్తూరు జిల్లా - 517416
        </p>
      </div>

      <div className="bg-gradient-to-b from-[#5C121E] to-[#200407] border-3 border-[#FFD700] p-6 sm:p-8 rounded-3xl space-y-6 text-white shadow-2xl">
        <h2 className="text-xl sm:text-2xl font-black text-[#FFD700] heading-telugu border-b border-amber-400/30 pb-2">
          📜 సొసైటీ రిజిస్ట్రేషన్ (Society Registration Details)
        </h2>
        <div className="bg-black/60 p-5 rounded-2xl border border-white/20 space-y-2 text-xs sm:text-sm font-mono">
          <p className="text-amber-300 font-black">Registration Name: SRI RAMA SEVA COMMITTEE PAMINIVANDLAVOORU</p>
          <p className="text-amber-100 font-bold">Society Act: Andhra Pradesh Societies Registration Act</p>
          <p className="text-amber-100 font-bold">Address: Door No: 5-233, Paminivandlavooru, Mangalapalli, Bangarupalem Mandal, Chittoor Dist - 517416</p>
        </div>
      </div>
    </div>
  );
}
