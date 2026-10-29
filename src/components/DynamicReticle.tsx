import React from 'react';
import { CelestialBody } from '../types/astronomy';

interface DynamicReticleProps {
  coords: { x: number; y: number; visible: boolean } | null;
  selectedBody: CelestialBody;
}

export const DynamicReticle: React.FC<DynamicReticleProps> = ({ coords, selectedBody }) => {
  if (!coords || !coords.visible) return null;

  return (
    <div
      className="absolute pointer-events-none transition-transform duration-75 ease-out z-20"
      style={{
        left: `${coords.x}px`,
        top: `${coords.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* 4 Corner Aerospace HUD Brackets */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Top-Left Corner */}
        <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[#00f0ff] drop-shadow-[0_0_8px_#00f0ff]" />
        
        {/* Top-Right Corner */}
        <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-[#00f0ff] drop-shadow-[0_0_8px_#00f0ff]" />
        
        {/* Bottom-Left Corner */}
        <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-[#00f0ff] drop-shadow-[0_0_8px_#00f0ff]" />
        
        {/* Bottom-Right Corner */}
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[#00f0ff] drop-shadow-[0_0_8px_#00f0ff]" />

        {/* Center Target Crosshair Hairlines */}
        <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] opacity-80" />
        <div className="absolute w-8 h-[1px] bg-[#00f0ff]/40" />
        <div className="absolute h-8 w-[1px] bg-[#00f0ff]/40" />
      </div>

      {/* Floating Tactical Data Readout */}
      <div className="absolute left-28 top-0 whitespace-nowrap bg-[#0b0e23]/90 border border-[#00f0ff]/30 backdrop-blur-sm px-2.5 py-1.5 rounded text-[11px] font-mono-tech shadow-[0_4px_20px_rgba(0,240,255,0.15)]">
        <div className="text-[#00f0ff] font-semibold tracking-wider flex items-center gap-1.5">
          <span>{selectedBody.catalogCode}</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-200">{selectedBody.name}</span>
        </div>
        <div className="text-slate-400 text-[10px] mt-0.5 flex gap-2 tabular-nums">
          <span>RA: {selectedBody.rightAscension}</span>
          <span>DEC: {selectedBody.declination}</span>
        </div>
        <div className="text-slate-400 text-[10px] mt-0.5 flex gap-2 tabular-nums">
          <span>VEL: {selectedBody.orbitalSpeedKmS} km/s</span>
          <span>DIST: {selectedBody.distanceAU !== undefined ? `${selectedBody.distanceAU} AU` : `${selectedBody.distanceLightYears} LY`}</span>
        </div>
      </div>
    </div>
  );
};
