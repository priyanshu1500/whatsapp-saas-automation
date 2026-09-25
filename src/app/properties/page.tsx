'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Maximize2,
  ShieldCheck,
  FileDown,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { PropertyListing } from '@/types';

export default function PropertiesPortfolioPage() {
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/properties');
        const data = await res.json();
        setProperties(data.properties || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8 animate-enter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
              Skyline Luxury Estates Portfolio
            </span>
            <span className="text-xs text-slate-400">HARERA-GGM-2024-9182</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Active Architectural Developments</h1>
          <p className="text-xs text-slate-400 max-w-2xl mt-0.5">
            Grounded property inventory synced in real-time with the autonomous WhatsApp sales assistant.
          </p>
        </div>

        <Link
          href="/simulator"
          className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C5A880] text-[#090D16] font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-lg shadow-[#D4AF37]/20"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          Test Property AI Inquiry
        </Link>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map((prop) => (
          <div
            key={prop.id}
            className="bg-[#111726] border border-[#1E293B] rounded-2xl overflow-hidden shadow-xl hover:border-[#D4AF37]/60 transition group flex flex-col"
          >
            {/* Image Banner */}
            <div className="relative h-56 w-full overflow-hidden bg-slate-900">
              <img
                src={prop.image_url}
                alt={prop.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111726] via-transparent to-black/30" />

              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#090D16]/80 text-[#D4AF37] border border-[#D4AF37]/30 backdrop-blur-md">
                  {prop.status}
                </span>
              </div>

              {/* Price Banner */}
              <div className="absolute bottom-3 right-3 bg-[#090D16]/90 border border-[#D4AF37]/40 px-3 py-1.5 rounded-xl backdrop-blur-md">
                <span className="text-[10px] text-slate-400 block leading-none">Starting from</span>
                <span className="text-base font-extrabold text-[#D4AF37]">{prop.price_display}</span>
              </div>
            </div>

            {/* Details Body */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span className="truncate">{prop.location}</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition">
                  {prop.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {prop.description}
                </p>
              </div>

              {/* Key Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-[#090D16]/60 p-3 rounded-xl border border-[#1E293B]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Configuration</span>
                  <p className="font-semibold text-white truncate">{prop.configuration}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Carpet Area</span>
                  <p className="font-semibold text-white">{prop.carpet_area_sqft.toLocaleString()} sq.ft</p>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-500">Curated Amenities</span>
                <div className="flex flex-wrap gap-1.5">
                  {prop.amenities.slice(0, 3).map((amenity, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-[#182032] text-slate-300 px-2 py-0.5 rounded-md border border-[#1E293B]"
                    >
                      {amenity}
                    </span>
                  ))}
                  {prop.amenities.length > 3 && (
                    <span className="text-[10px] bg-[#182032] text-[#D4AF37] px-1.5 py-0.5 rounded-md border border-[#1E293B]">
                      +{prop.amenities.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="truncate">{prop.rera_number}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/simulator"
                    className="flex items-center gap-1 bg-[#182032] hover:bg-[#1E293B] text-white px-3 py-1.5 rounded-lg border border-[#1E293B] font-semibold text-[11px] transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Inquire
                  </Link>
                  <Link
                    href="/appointments"
                    className="flex items-center gap-1 bg-[#D4AF37] hover:bg-[#C5A880] text-[#090D16] px-3 py-1.5 rounded-lg font-bold text-[11px] transition shadow-sm"
                  >
                    Book Tour
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
