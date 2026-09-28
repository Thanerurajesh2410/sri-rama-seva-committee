import React, { useState } from 'react';
import { Camera, Maximize2, X, ChevronLeft, ChevronRight, CheckCircle2, Hammer, Building2, Image as ImageIcon } from 'lucide-react';
import { getAssetUrl } from '../v2/data/v2Database';

export default function ConstructionGallery({ t }) {
  const [activePhoto, setActivePhoto] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const openLightbox = (idx) => {
    setPhotoIndex(idx);
    setActivePhoto(t.gallery.photos[idx]);
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    const nextIdx = (photoIndex + 1) % t.gallery.photos.length;
    setPhotoIndex(nextIdx);
    setActivePhoto(t.gallery.photos[nextIdx]);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    const prevIdx = (photoIndex - 1 + t.gallery.photos.length) % t.gallery.photos.length;
    setPhotoIndex(prevIdx);
    setActivePhoto(t.gallery.photos[prevIdx]);
  };

  return (
    <section id="gallery" className="py-16 md:py-24 relative bg-[#090914]">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="section-tag">
            <Camera className="w-4 h-4 text-[var(--primary-saffron)]" />
            {t.gallery.tag}
          </span>
          <h2 className="section-title text-white heading-telugu">
            <span className="heading-saffron">{t.gallery.title}</span>
          </h2>
          <p className="text-gray-300 text-base md:text-lg">
            {t.gallery.subtitle}
          </p>
        </div>

        {/* Construction Status Progress Bar */}
        <div className="max-w-4xl mx-auto mb-12 gold-card !p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[var(--sacred-maroon)] text-[var(--primary-saffron)] border border-[var(--border-gold)]">
                <Hammer className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="text-xs font-bold text-[var(--primary-saffron)] uppercase tracking-wider">Status Update</span>
                <h4 className="text-base md:text-lg font-bold text-white heading-telugu">
                  {t.gallery.statusTitle}
                </h4>
              </div>
            </div>
            <span className="hidden md:inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              In Active Construction
            </span>
          </div>

          {/* Timeline Steps */}
          <div className="grid grid-cols-3 gap-2 mt-6">
            <div className="bg-emerald-500/20 border border-emerald-500/40 p-3 rounded-xl text-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-white">1. శంకుస్థాపన</div>
              <div className="text-[10px] text-gray-400">Foundation Completed</div>
            </div>
            <div className="bg-[var(--primary-saffron)]/20 border border-[var(--primary-saffron)] p-3 rounded-xl text-center relative overflow-hidden">
              <Building2 className="w-5 h-5 text-[var(--primary-saffron)] mx-auto mb-1 animate-pulse" />
              <div className="text-xs font-bold text-white">2. రాతి గోడల నిర్మాణం</div>
              <div className="text-[10px] text-[var(--primary-saffron)] font-bold">In Progress (75%)</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center opacity-60">
              <Hammer className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-gray-300">3. గోపురం & కుంభాభిషేకం</div>
              <div className="text-[10px] text-gray-400">Upcoming Stage</div>
            </div>
          </div>
        </div>

        {/* Dedicated Photos Gallery Grid (All 5 Photos segregated cleanly) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {t.gallery.photos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(idx)}
              className="gold-card !p-3 group cursor-pointer relative overflow-hidden rounded-2xl border-2 border-[var(--primary-gold)]/50 hover:border-[var(--primary-gold)] transition-all duration-300"
            >
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black/60">
                <img
                  src={getAssetUrl(photo.src)}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Photo Tag Badge */}
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#FFD700] border border-[#FFD700]/40 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>{photo.tag}</span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="flex items-center justify-between text-white">
                    <span className="text-xs font-bold line-clamp-1">{photo.title}</span>
                    <Maximize2 className="w-5 h-5 text-[var(--primary-gold)] shrink-0" />
                  </div>
                </div>
              </div>

              <div className="p-3 text-center">
                <h4 className="text-sm font-bold text-gray-200 heading-telugu line-clamp-1 group-hover:text-[var(--primary-gold)] transition-colors">
                  {photo.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal Viewer */}
      {activePhoto && (
        <div className="modal-overlay" onClick={() => setActivePhoto(null)}>
          <div className="modal-content !max-w-5xl !p-4" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActivePhoto(null)}>
              <X className="w-5 h-5" />
            </button>

            {/* Navigation Arrows */}
            <button
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/80 border border-[#FFD700]/60 text-[#FFD700] flex items-center justify-center hover:bg-[var(--primary-saffron)] hover:text-white transition-all shadow-xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/80 border border-[#FFD700]/60 text-[#FFD700] flex items-center justify-center hover:bg-[var(--primary-saffron)] hover:text-white transition-all shadow-xl"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="rounded-xl overflow-hidden border-2 border-[var(--border-gold)] bg-black">
              <img
                src={getAssetUrl(activePhoto.src)}
                alt={activePhoto.title}
                className="w-full max-h-[78vh] object-contain mx-auto"
              />
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-lg md:text-xl font-extrabold text-white heading-telugu">
                {activePhoto.title}
              </h3>
              <p className="text-xs text-[var(--primary-gold)] font-bold mt-1">
                Photo {photoIndex + 1} of {t.gallery.photos.length} • Sri Rama Temple Photo Gallery, Paminivandla Vooru
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
