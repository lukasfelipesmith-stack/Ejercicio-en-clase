import React from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Compass,
  Gauge,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  Volume2,
} from 'lucide-react';
import { CelestialBody } from '../types/astronomy';
import { playBeaconPulseSound, playHudClickSound } from '../utils/spaceAudio';

interface TelemetryPanelProps {
  body: CelestialBody;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenSpectroscopy: () => void;
  onOpenScaleModal: () => void;
  onOpenDossier: () => void;
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({
  body,
  isCollapsed,
  onToggleCollapse,
  onOpenSpectroscopy,
  onOpenScaleModal,
  onOpenDossier,
}) => {
  return (
    <aside
      className={`relative z-20 flex flex-col h-full bg-[#0b0e23]/92 border-l border-[#00f0ff]/15 backdrop-blur-md transition-all duration-300 ease-in-out shrink-0 ${
        isCollapsed ? 'w-14' : 'w-80 md:w-96'
      }`}
    >
      {/* Collapse/Expand Toggle Button */}
      <button
        onClick={() => {
          playHudClickSound();
          onToggleCollapse();
        }}
        title={isCollapsed ? 'Expand Telemetry Panel' : 'Collapse Telemetry Panel'}
        className="absolute -left-3.5 top-6 z-30 w-7 h-7 rounded-full bg-[#0b0e23] border border-[#00f0ff]/40 text-[#00f0ff] flex items-center justify-center hover:bg-[#111836] shadow-[0_0_10px_rgba(0,240,255,0.25)] transition-all"
      >
        {isCollapsed ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      {/* Collapsed Vertical Strip */}
      {isCollapsed ? (
        <div className="flex flex-col items-center py-6 gap-6 h-full">
          <div className="text-[#00f0ff] p-2 rounded hover:bg-[#111836] cursor-pointer" onClick={onToggleCollapse}>
            <Activity className="w-5 h-5" />
          </div>
          <div className="h-[1px] w-8 bg-[#00f0ff]/20" />
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-[10px] font-mono-tech text-slate-400 rotate-90 whitespace-nowrap">
            <span>TELEMETRY: {body.catalogCode}</span>
          </div>
        </div>
      ) : (
        /* Full Telemetry HUD */
        <div className="flex flex-col h-full p-4 overflow-y-auto">
          {/* Header Badge & Identifier */}
          <div className="pb-3 border-b border-[#00f0ff]/15 mb-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-mono-tech text-xs font-semibold tracking-wider text-[#00f0ff]">
                {body.catalogCode}
              </span>
              <span className="text-[10px] font-mono-tech text-slate-400 uppercase tracking-widest">
                TARGET LOCKED
              </span>
            </div>

            <h2 className="font-space text-xl font-bold text-white mb-0.5">
              {body.name}
            </h2>
            <div className="text-xs text-[#dcb8ff] font-medium leading-relaxed">
              {body.subtitle}
            </div>
          </div>

          {/* Target Celestial Coordinates HUD */}
          <div className="mb-4 bg-[#111836]/60 border border-[#00f0ff]/20 rounded-lg p-3">
            <div className="text-[10px] font-mono-tech tracking-wider text-[#00f0ff] uppercase flex items-center gap-1.5 mb-2.5">
              <Compass className="w-3.5 h-3.5" />
              <span>J2000 CELESTIAL COORDINATES</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech">
              <div>
                <div className="text-[10px] text-slate-400 uppercase">RIGHT ASCENSION</div>
                <div className="text-slate-100 font-semibold tabular-nums mt-0.5">
                  {body.rightAscension}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">DECLINATION</div>
                <div className="text-slate-100 font-semibold tabular-nums mt-0.5">
                  {body.declination}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">CONSTELLATION</div>
                <div className="text-slate-100 font-semibold mt-0.5 truncate">
                  {body.constellation}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">DISTANCE</div>
                <div className="text-slate-100 font-semibold tabular-nums mt-0.5">
                  {body.distanceAU !== undefined ? `${body.distanceAU} AU` : `${body.distanceLightYears?.toLocaleString()} LY`}
                </div>
              </div>
            </div>
          </div>

          {/* Orbital Dynamics Telemetry */}
          <div className="mb-4">
            <div className="text-[10px] font-mono-tech tracking-wider text-[#00f0ff] uppercase flex items-center gap-1.5 mb-2">
              <Gauge className="w-3.5 h-3.5" />
              <span>ORBITAL DYNAMICS & KINEMATICS</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech">
              <div className="p-2.5 rounded bg-[#111836]/40 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">VELOCITY</div>
                <div className="text-sm font-semibold text-white tabular-nums mt-0.5">
                  {body.orbitalSpeedKmS}{' '}
                  <span className="text-[10px] font-normal text-slate-400">km/s</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#111836]/40 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">ECCENTRICITY (e)</div>
                <div className="text-sm font-semibold text-white tabular-nums mt-0.5">
                  {body.eccentricity.toFixed(4)}
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#111836]/40 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">SEMI-MAJOR AXIS</div>
                <div className="text-sm font-semibold text-white tabular-nums mt-0.5">
                  {body.semiMajorAxisAU}{' '}
                  <span className="text-[10px] font-normal text-slate-400">AU</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#111836]/40 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">ORBIT PERIOD</div>
                <div className="text-sm font-semibold text-white tabular-nums mt-0.5 truncate">
                  {body.orbitalPeriodDays > 0 ? `${body.orbitalPeriodDays.toFixed(1)} d` : 'Stationary'}
                </div>
              </div>
            </div>
          </div>

          {/* Physical Parameters */}
          <div className="mb-4">
            <div className="text-[10px] font-mono-tech tracking-wider text-[#00f0ff] uppercase flex items-center gap-1.5 mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>PHYSICAL PROPERTIES</span>
            </div>

            <div className="space-y-1.5 text-xs font-mono-tech">
              <div className="flex items-center justify-between p-1.5 rounded hover:bg-[#111836]/40">
                <span className="text-slate-400">Total Mass</span>
                <span className="text-white font-medium">{body.massKg}</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded hover:bg-[#111836]/40">
                <span className="text-slate-400">Equatorial Radius</span>
                <span className="text-white font-medium tabular-nums">{body.radiusKm.toLocaleString()} km</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded hover:bg-[#111836]/40">
                <span className="text-slate-400">Surface Gravity</span>
                <span className="text-white font-medium tabular-nums">{body.surfaceGravityG} g</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded hover:bg-[#111836]/40">
                <span className="text-slate-400">Surface Temp</span>
                <span className="text-white font-medium tabular-nums">
                  {body.surfaceTempKelvin} K ({body.surfaceTempKelvin - 273}°C)
                </span>
              </div>
              {body.surfacePressureBar !== undefined && (
                <div className="flex items-center justify-between p-1.5 rounded hover:bg-[#111836]/40">
                  <span className="text-slate-400">Surface Pressure</span>
                  <span className="text-white font-medium tabular-nums">{body.surfacePressureBar} bar</span>
                </div>
              )}
            </div>
          </div>

          {/* Atmospheric & Chemical Breakdown */}
          {body.atmosphere.length > 0 && (
            <div className="mb-4">
              <div className="text-[10px] font-mono-tech tracking-wider text-[#00f0ff] uppercase flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ATMOSPHERIC SPECTRAL COMPOSITION</span>
              </div>

              <div className="space-y-2">
                {body.atmosphere.map((gas) => (
                  <div key={gas.name} className="text-xs font-mono-tech">
                    <div className="flex items-center justify-between text-slate-300 mb-1">
                      <span>
                        {gas.name} ({gas.formula})
                      </span>
                      <span className="text-[#00f0ff] font-semibold tabular-nums">
                        {gas.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-[#111836] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(gas.percentage, 100)}%`,
                          backgroundColor: gas.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Scientific Actions */}
          <div className="mt-auto pt-3 border-t border-[#00f0ff]/15 space-y-2">
            <button
              onClick={() => {
                playBeaconPulseSound();
              }}
              className="w-full py-1.5 px-3 rounded bg-[#111836] border border-[#00f0ff]/30 text-xs font-mono-tech text-slate-300 hover:text-[#00f0ff] hover:border-[#00f0ff] flex items-center justify-center gap-2 transition-all"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span>Synthesize Telemetry Audio Beacon</span>
            </button>

            <button
              onClick={() => {
                playHudClickSound();
                onOpenSpectroscopy();
              }}
              className="w-full py-2 px-3 rounded bg-gradient-to-r from-[#8a2be2]/20 to-[#b347ff]/10 border border-[#8a2be2]/50 text-xs font-space font-semibold text-[#dcb8ff] hover:text-white hover:border-[#b347ff] flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(138,43,226,0.25)] transition-all"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Spectroscopy & Transit Lab</span>
            </button>

            <button
              onClick={() => {
                playHudClickSound();
                onOpenDossier();
              }}
              className="neon-btn-primary w-full py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Complete Astrophysics Dossier</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
