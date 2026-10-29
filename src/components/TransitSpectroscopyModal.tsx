import React, { useState } from 'react';
import { X, Play, Pause, RotateCcw, Activity, Sparkles, HelpCircle } from 'lucide-react';
import { CelestialBody } from '../types/astronomy';
import { playHudClickSound } from '../utils/spaceAudio';

interface TransitSpectroscopyModalProps {
  body: CelestialBody;
  onClose: () => void;
}

export const TransitSpectroscopyModal: React.FC<TransitSpectroscopyModalProps> = ({
  body,
  onClose,
}) => {
  const [transitProgress, setTransitProgress] = useState(0.5); // 0 (before transit) to 1 (after)
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMolecule, setActiveMolecule] = useState<string | null>(null);

  React.useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const step = () => {
        setTransitProgress((prev) => {
          const next = prev + 0.003;
          if (next >= 1.0) return 0;
          return next;
        });
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Exoplanet transit depth calculation (or default simulated transit)
  const transitDepthPercent = body.transitData?.transitDepthPercent ?? 1.45;
  const transitDepthFraction = transitDepthPercent / 100;

  // Compute flux based on transit progress:
  // Ingress: 0.25 to 0.35, Full transit: 0.35 to 0.65, Egress: 0.65 to 0.75
  let currentFlux = 1.0;
  if (transitProgress >= 0.25 && transitProgress <= 0.75) {
    if (transitProgress < 0.35) {
      // Ingress slope
      const ingressFraction = (transitProgress - 0.25) / 0.1;
      currentFlux = 1.0 - transitDepthFraction * ingressFraction;
    } else if (transitProgress > 0.65) {
      // Egress slope
      const egressFraction = (0.75 - transitProgress) / 0.1;
      currentFlux = 1.0 - transitDepthFraction * egressFraction;
    } else {
      // Bottom of transit (limb darkening gives slight curve)
      const centerDist = Math.abs(transitProgress - 0.5) / 0.15;
      currentFlux = 1.0 - transitDepthFraction * (1.0 - centerDist * 0.04);
    }
  }

  // Spectral transmission lines
  const spectralBands = [
    { name: 'Sodium Doublet (Na)', wavelength: '0.589 µm', depth: 0.42, molecule: 'Na', color: '#ffd700' },
    { name: 'Potassium (K)', wavelength: '0.769 µm', depth: 0.31, molecule: 'K', color: '#fb923c' },
    { name: 'Water Vapor (H₂O)', wavelength: '1.400 µm', depth: 0.88, molecule: 'H2O', color: '#00f0ff' },
    { name: 'Water Vapor (H₂O)', wavelength: '1.900 µm', depth: 0.76, molecule: 'H2O', color: '#00f0ff' },
    { name: 'Methane (CH₄)', wavelength: '2.300 µm', depth: 0.64, molecule: 'CH4', color: '#10b981' },
    { name: 'Carbon Dioxide (CO₂)', wavelength: '4.300 µm', depth: 0.95, molecule: 'CO2', color: '#ec4899' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-[#0b0e23] border border-[#00f0ff]/40 rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.8),0_0_30px_rgba(138,43,226,0.25)] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-[#00f0ff]/20 bg-[#111836]/60">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-[#00f0ff]" />
            <div>
              <h2 className="font-space text-lg font-bold text-white leading-tight">
                Transit Photometry & Transmission Spectroscopy Lab
              </h2>
              <div className="text-xs font-mono-tech text-slate-400">
                TARGET: <span className="text-[#00f0ff]">{body.catalogCode} ({body.name})</span>
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Visual Transit Photometry Simulation */}
          <div className="bg-[#111836]/50 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-mono-tech uppercase text-[#00f0ff] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>EXOPLANETARY TRANSIT ORBITAL GEOMETRY</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3 py-1 rounded bg-[#00f0ff]/20 border border-[#00f0ff]/50 text-xs font-mono-tech text-[#00f0ff] hover:bg-[#00f0ff]/30 flex items-center gap-1.5 transition-colors"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Simulate'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setTransitProgress(0);
                  }}
                  className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Reset Orbit"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Visual Transit Canvas Representation */}
            <div className="relative h-44 bg-[#060814] rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden">
              {/* Host Star Center Disk */}
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 shadow-[0_0_50px_rgba(251,191,36,0.6)] flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-yellow-300 opacity-20 blur-md" />
              </div>

              {/* Transit Horizontal Trajectory Wireframe */}
              <div className="absolute w-full h-[1px] bg-slate-800 border-dashed border-b border-slate-700" />

              {/* Transiting Planet Silhouette */}
              <div
                className="absolute w-6 h-6 rounded-full bg-slate-950 border border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.8)] pointer-events-none transition-all duration-75"
                style={{
                  left: `calc(${transitProgress * 100}% - 12px)`,
                  top: 'calc(50% - 12px)',
                }}
              />

              {/* Ingress / Egress Markers */}
              <div className="absolute bottom-2 left-4 text-[10px] font-mono-tech text-slate-500">
                INGRESS PHASE: T - 0.5h
              </div>
              <div className="absolute bottom-2 right-4 text-[10px] font-mono-tech text-slate-500">
                EGRESS PHASE: T + 0.5h
              </div>
            </div>

            {/* Scrubber slider */}
            <div className="mt-3 flex items-center gap-3">
              <span className="text-[11px] font-mono-tech text-slate-400">ORBIT PHASE:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.005"
                value={transitProgress}
                onChange={(e) => setTransitProgress(parseFloat(e.target.value))}
                className="flex-1 accent-[#00f0ff] cursor-ew-resize"
              />
              <span className="text-[11px] font-mono-tech text-[#00f0ff] tabular-nums">
                {(transitProgress * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Section 2: Normalized Stellar Flux Light Curve Chart */}
          <div className="bg-[#111836]/50 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono-tech uppercase text-[#00f0ff] font-semibold">
                NORMALIZED STELLAR FLUX LIGHT CURVE (ΔF / F)
              </div>
              <div className="text-xs font-mono-tech text-slate-300 tabular-nums">
                CURRENT FLUX: <span className="text-[#00f0ff] font-semibold">{currentFlux.toFixed(4)}</span>
              </div>
            </div>

            {/* SVG Light Curve Graph */}
            <div className="w-full h-36 bg-[#060814] rounded border border-slate-800 p-2 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                {/* Horizontal reference lines */}
                <line x1="0" y1="15" x2="500" y2="15" stroke="#334155" strokeDasharray="3 3" strokeWidth="1" />
                <line x1="0" y1="85" x2="500" y2="85" stroke="#334155" strokeDasharray="3 3" strokeWidth="1" />
                
                {/* Baseline 1.000 label */}
                <text x="10" y="12" fill="#64748b" fontSize="8" fontFamily="JetBrains Mono">F = 1.0000</text>
                <text x="10" y="82" fill="#64748b" fontSize="8" fontFamily="JetBrains Mono">
                  F = {(1.0 - transitDepthFraction).toFixed(4)} (-{transitDepthPercent}%)
                </text>

                {/* Transit Light Curve SVG Path */}
                <path
                  d="M 0 15 L 125 15 L 175 85 L 325 85 L 375 15 L 500 15"
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="2.5"
                />

                {/* Shaded Transit Dip Area */}
                <path
                  d="M 125 15 L 175 85 L 325 85 L 375 15 Z"
                  fill="rgba(0, 240, 255, 0.12)"
                />

                {/* Current Time Cursor on Graph */}
                <line
                  x1={transitProgress * 500}
                  y1="0"
                  x2={transitProgress * 500}
                  y2="100"
                  stroke="#ffd700"
                  strokeWidth="2"
                  strokeDasharray="2 2"
                />
              </svg>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs font-mono-tech">
              <div className="p-2 rounded bg-[#0b0e23] border border-slate-800">
                <span className="text-slate-500 text-[10px]">TRANSIT DEPTH</span>
                <div className="text-[#00f0ff] font-semibold">{transitDepthPercent}%</div>
              </div>
              <div className="p-2 rounded bg-[#0b0e23] border border-slate-800">
                <span className="text-slate-500 text-[10px]">ESTIMATED RADIUS RATIO (Rp/R*)</span>
                <div className="text-white font-semibold">{Math.sqrt(transitDepthFraction).toFixed(3)}</div>
              </div>
              <div className="p-2 rounded bg-[#0b0e23] border border-slate-800">
                <span className="text-slate-500 text-[10px]">TRANSIT DURATION</span>
                <div className="text-white font-semibold">
                  {body.transitData?.transitDurationHours ?? 2.4} hrs
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Transmission Spectroscopy Lines (Absorption Spectrum) */}
          <div className="bg-[#111836]/50 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs font-mono-tech uppercase text-[#dcb8ff] font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>ATMOSPHERIC TRANSMISSION SPECTROSCOPY (JWST NIRSpec / MIRI)</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Filter by absorption band to isolate atmospheric molecular fingerprints.
                </div>
              </div>

              {/* Molecule filter buttons */}
              <div className="flex items-center gap-1 text-xs font-mono-tech">
                <button
                  onClick={() => setActiveMolecule(null)}
                  className={`px-2 py-1 rounded transition-colors ${
                    activeMolecule === null ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Lines
                </button>
                {['H2O', 'CO2', 'CH4', 'Na'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setActiveMolecule(activeMolecule === m ? null : m)}
                    className={`px-2 py-1 rounded transition-colors ${
                      activeMolecule === m ? 'bg-[#00f0ff]/20 text-[#00f0ff] font-semibold border border-[#00f0ff]/40' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Spectroscopic Lines Visualizer */}
            <div className="space-y-2">
              {spectralBands
                .filter((b) => activeMolecule === null || b.molecule === activeMolecule)
                .map((band) => (
                  <div key={band.name + band.wavelength} className="p-2.5 rounded bg-[#060814] border border-slate-800">
                    <div className="flex items-center justify-between text-xs font-mono-tech mb-1.5">
                      <span className="text-white font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: band.color }} />
                        {band.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">λ = {band.wavelength}</span>
                        <span className="text-[#00f0ff] font-semibold">
                          DEPTH: {(band.depth * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    {/* Bar visualizer */}
                    <div className="w-full bg-[#111836] h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${band.depth * 100}%`,
                          backgroundColor: band.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
