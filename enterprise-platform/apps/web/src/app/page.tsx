import React from 'react';

export default function DevoteeHomePage() {
  return (
    <div className="space-y-12 py-10 container mx-auto px-4">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-black bg-amber-100 text-amber-950 border border-amber-400 shadow-md">
          <span>🚩 శ్రీ సీతారాములవారి దివ్య ఆలయ శంకుస్థాపన & నిర్మాణ నిధి</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white heading-telugu leading-tight">
          శ్రీ రామాలయం పామినివాండ్లవూరు
        </h1>

        <p className="text-lg sm:text-xl font-extrabold text-amber-300 heading-telugu drop-shadow-md">
          "శ్రీ సీతారాములవారి దివ్య ఆలయ నిర్మాణంలో భాగస్వాములుకండి — పవిత్ర ధర్మ సేవలో తరించండి"
        </p>

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <a
            href="/donations"
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-lg rounded-2xl shadow-2xl border-2 border-amber-300 hover:scale-105 transition"
          >
            💳 ఈ-హుండి ఆన్‌లైన్ విరాళం సమర్పించండి
          </a>
          <a
            href="/gallery"
            className="px-8 py-4 bg-black/60 text-amber-200 border border-amber-400/50 font-black text-lg rounded-2xl hover:bg-amber-950 transition"
          >
            📸 నిర్మాణ ప్రగతి ఫోటోలు చూడండి
          </a>
        </div>
      </section>

      {/* Temple Construction Highlights */}
      <section className="bg-gradient-to-r from-[#5C121E] to-[#3A0A11] border-3 border-[#FFD700] p-8 rounded-3xl shadow-2xl max-w-5xl mx-auto space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black text-[#FFD700] heading-telugu border-b border-amber-400/30 pb-3">
          🏗️ ప్రస్తుత నిర్మాణ దశ: శంకుస్థాపన & రాతి గోడల నిర్మాణం
        </h2>
        <p className="text-base text-gray-100 font-bold leading-relaxed">
          చిత్తూరు జిల్లా, బంగారుపాళెం మండలం, మంగళపల్లె పంచాయతీ పరిధిలోని పామినివాండ్లవూరు గ్రామంలో శ్రీ రామాలయ శంకుస్థాపన పవిత్ర రాతి స్తంభాల పూజ మరియు గర్భగుడి రాతి గోడల నిర్మాణం వేగంగా ముందుకు సాగుతోంది.
        </p>
      </section>
    </div>
  );
}
