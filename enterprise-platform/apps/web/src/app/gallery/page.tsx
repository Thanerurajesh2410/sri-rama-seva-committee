import React from 'react';

const galleryPhotos = [
  { id: 1, title: 'శ్రీ రామాలయం శంకుస్థాపన పవిత్ర రాతి స్తంభాల పూజ', src: '/assets/construction_1.jpg', tag: 'పామినివాండ్లవూరు శంకుస్థాపన' },
  { id: 2, title: 'గ్రామస్థులు & భక్తుల సమక్షంలో ఆలయ పునాది పూజా మహోత్సవం', src: '/assets/construction_2.jpg', tag: 'పవిత్ర శంకుస్థాపన మహోత్సవం' },
  { id: 3, title: 'రాతి గోడల ఆలయ శంకుస్థాపన పునాది నిర్మాణం', src: '/assets/construction_3.jpg', tag: 'ఆలయ పునాది ప్రగతి' },
  { id: 4, title: 'అలంకరించిన టేకు కలప ప్రధాన ద్వారబంధం', src: '/assets/construction_4.jpg', tag: 'ఆలయ ద్వారబంధం' },
  { id: 5, title: 'శ్రీ సీతారాములవారి ఆలయ నిర్మణ ప్రాంగణ దృశ్యం', src: '/assets/banner.jpg', tag: 'ఆలయ బ్యానర్' }
];

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-10 space-y-8 max-w-6xl">
      <div className="text-center space-y-3">
        <span className="bg-amber-100 text-amber-950 font-black text-xs px-4 py-1.5 rounded-full border border-amber-400">
          ఆలయ చిత్రాలు (గ్యాలరీ)
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white heading-telugu">
          శ్రీ రామాలయ నిర్మాణ ప్రగతి ఫోటోలు
        </h1>
        <p className="text-sm sm:text-base text-amber-300 font-bold">
          పామినివాండ్లవూరు శ్రీ రామాలయ నిర్మాణ పనులు మరియు అధికారిక బ్యానర్ ఫోటోలు
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {galleryPhotos.map((photo) => (
          <div key={photo.id} className="bg-gradient-to-b from-[#5C121E] to-[#2A060B] border-2 border-amber-400/60 p-3 rounded-2xl space-y-3 shadow-xl hover:scale-105 transition">
            <div className="aspect-video bg-black rounded-xl overflow-hidden relative border border-white/20">
              <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 bg-black/80 text-[#FFD700] text-[10px] font-black px-2.5 py-1 rounded-full border border-amber-400/40">
                {photo.tag}
              </span>
            </div>
            <h3 className="text-sm font-bold text-gray-100 heading-telugu px-1">{photo.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
