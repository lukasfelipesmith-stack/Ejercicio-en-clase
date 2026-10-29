import React, { useState } from 'react';
import { X, Scale, Layers } from 'lucide-react';
import { CELESTIAL_BODIES } from '../data/celestialBodies';
import { playHudClickSound } from '../utils/spaceAudio';

interface ScaleComparisonModalProps {
  onClose: () => void;
}

export const ScaleComparisonModal: React.FC<ScaleComparisonModalProps> = ({ onClose }) => {
  const [primaryId, setPrimaryId] = useState<string>('earth');
  const [comparisonId, setComparisonId] = useState<string>('jupiter');

  const primary = CELESTIAL_BODIES.find((b) => b.id === primaryId) || CELESTIAL_BODIES[3];
  const secondary = CELESTIAL_BODIES.find((b) => b.id === comparisonId) || CELESTIAL_BODIES[5];

  const radiusRatio = (secondary.radiusKm / primary.radiusKm).toFixed(2);
  const volumeRatio = (Math.pow(secondary.radiusKm / primary.radiusKm, 3)).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#0b0e23] border border-[#00f0ff]/40 rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.8),0_0_30px_rgba(138,43,226,0.25)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#00f0ff]/20 bg-[#111836]/60">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-[#ffd700]" />
            <div>
              <h2 className="font-space text-lg font-bold text-white leading-tight">
                Celestial Scale & Dimension Comparison Lab
              </h2>
              <div className="text-xs font-mono-tech text-slate-400">
                PROPORTIONAL RADIUS, VOLUME & MASS MECHANICS
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              playHudClickSound();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono-tech uppercase text-slate-400 block mb-1">
                PRIMARY OBJECT (REFERENCE)
              </label>
              <select
                value={primaryId}
                onChange={(e) => setPrimaryId(e.target.value)}
                className="w-full bg-[#111836] border border-[#00f0ff]/30 text-white rounded p-2 text-xs font-mono-tech focus:outline-none focus:border-[#00f0ff]"
              >
                {CELESTIAL_BODIES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.catalogCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono-tech uppercase text-slate-400 block mb-1">
                COMPARISON TARGET
              </label>
              <select
                value={comparisonId}
                onChange={(e) => setComparisonId(e.target.value)}
                className="w-full bg-[#111836] border border-[#00f0ff]/30 text-white rounded p-2 text-xs font-mono-tech focus:outline-none focus:border-[#00f0ff]"
              >
                {CELESTIAL_BODIES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.catalogCode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Visual Scale Diagram */}
          <div className="h-64 bg-[#060814] rounded-lg border border-slate-800 flex items-center justify-around p-6 relative overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            {/* Primary Sphere */}
            <div className="flex flex-col items-center z-10">
              <div
                className="rounded-full flex items-center justify-center border border-white/40 shadow-lg transition-all duration-500"
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: primary.color || '#00f0ff',
                }}
              />
              <span className="font-space text-sm font-semibold text-white mt-3">{primary.name}</span>
              <span className="font-mono-tech text-xs text-slate-400">{primary.radiusKm.toLocaleString()} km</span>
              <span className="font-mono-tech text-[10px] text-[#00f0ff] uppercase mt-0.5">1.00x Base</span>
            </div>

            {/* Versus Indicator */}
            <div className="font-mono-tech text-xs text-slate-500 font-bold z-10">VS</div>

            {/* Comparison Sphere */}
            <div className="flex flex-col items-center z-10">
              <div
                className="rounded-full flex items-center justify-center border border-white/40 shadow-lg transition-all duration-500"
                style={{
                  width: `${Math.min(Math.max(60 * (secondary.radiusKm / primary.radiusKm), 16), 180)}px`,
                  height: `${Math.min(Math.max(60 * (secondary.radiusKm / primary.radiusKm), 16), 180)}px`,
                  backgroundColor: secondary.color || '#ffd700',
                }}
              />
              <span className="font-space text-sm font-semibold text-white mt-3">{secondary.name}</span>
              <span className="font-mono-tech text-xs text-slate-400">{secondary.radiusKm.toLocaleString()} km</span>
              <span className="font-mono-tech text-[10px] text-[#ffd700] uppercase mt-0.5">
                {radiusRatio}x Radius
              </span>
            </div>
          </div>

          {/* Quantitative Comparison Matrix */}
          <div className="grid grid-cols-3 gap-3 font-mono-tech text-xs">
            <div className="p-3 rounded bg-[#111836]/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">RADIUS FACTOR</span>
              <div className="text-lg font-bold text-[#00f0ff] mt-0.5">{radiusRatio}×</div>
              <span className="text-[10px] text-slate-500">Linear equatorial span</span>
            </div>

            <div className="p-3 rounded bg-[#111836]/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">VOLUMETRIC CAPACITY</span>
              <div className="text-lg font-bold text-[#ffd700] mt-0.5">{volumeRatio}×</div>
              <span className="text-[10px] text-slate-500">Sphere volume (4/3 π r³)</span>
            </div>

            <div className="p-3 rounded bg-[#111836]/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">SURFACE GRAVITY RATIO</span>
              <div className="text-lg font-bold text-[#dcb8ff] mt-0.5">
                {(secondary.surfaceGravityG / (primary.surfaceGravityG || 1)).toFixed(2)}×
              </div>
              <span className="text-[10px] text-slate-500">Acceleration in g-units</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
