import React from 'react';
import {
  Play,
  Pause,
  FastForward,
  Eye,
  Camera,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SpectrumMode, CameraPreset } from '../types/astronomy';
import { playHudClickSound, playWarpSound } from '../utils/spaceAudio';

interface ObservatoryDockProps {
  timeScale: number;
  onSetTimeScale: (scale: number) => void;
  spectrumMode: SpectrumMode;
  onSetSpectrumMode: (mode: SpectrumMode) => void;
  cameraPreset: CameraPreset;
  onSetCameraPreset: (preset: CameraPreset) => void;
  layers: {
    orbits: boolean;
    gravityGrid: boolean;
    celestialGrid: boolean;
    labels: boolean;
    habitableZone: boolean;
  };
  onToggleLayer: (layerKey: keyof ObservatoryDockProps['layers']) => void;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
}

export const ObservatoryDock: React.FC<ObservatoryDockProps> = ({
  timeScale,
  onSetTimeScale,
  spectrumMode,
  onSetSpectrumMode,
  cameraPreset,
  onSetCameraPreset,
  layers,
  onToggleLayer,
  isCollapsed,
  onToggleCollapsed,
}) => {
  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-auto max-w-[min(960px,94vw)] w-full">
      {/* Collapse / Expand Cinema Toggle Button */}
      <button
        onClick={() => {
          playHudClickSound();
          onToggleCollapsed();
        }}
        className="px-3.5 py-1 text-[11px] font-mono-tech tracking-wider uppercase text-slate-300 bg-[#0b0e23]/90 border border-b-0 border-[#00f0ff]/30 rounded-t-lg backdrop-blur-md hover:text-[#00f0ff] hover:bg-[#111836] transition-all flex items-center gap-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.4)]"
      >
        {isCollapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>Show Observatory Controls</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>Hide Controls (Cinema Mode)</span>
          </>
        )}
      </button>

      {/* Dock Container */}
      {!isCollapsed && (
        <div className="w-full bg-[#0b0e23]/95 border border-[#00f0ff]/30 rounded-lg p-3 backdrop-blur-md shadow-[0_8px_32px_rgba(0,240,255,0.14),0_0_1px_1px_rgba(0,240,255,0.25)] flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
          {/* Section 1: Time Acceleration Stepper */}
          <div className="flex items-center gap-2">
            <div className="text-[10px] font-mono-tech uppercase text-slate-400 flex items-center gap-1">
              {timeScale === 0 ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-[#00f0ff]" />}
              <span className="hidden sm:inline">WARP</span>
            </div>

            <div className="flex items-center bg-[#111836] rounded p-0.5 border border-slate-800 text-xs font-mono-tech">
              <button
                onClick={() => {
                  playHudClickSound();
                  onSetTimeScale(0);
                }}
                className={`px-2 py-1 rounded transition-colors ${
                  timeScale === 0 ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                0x
              </button>
              <button
                onClick={() => {
                  playHudClickSound();
                  onSetTimeScale(1);
                }}
                className={`px-2 py-1 rounded transition-colors ${
                  timeScale === 1 ? 'bg-[#00f0ff]/20 text-[#00f0ff] font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                1x
              </button>
              <button
                onClick={() => {
                  playWarpSound();
                  onSetTimeScale(10);
                }}
                className={`px-2 py-1 rounded transition-colors ${
                  timeScale === 10 ? 'bg-[#00f0ff]/20 text-[#00f0ff] font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                10x
              </button>
              <button
                onClick={() => {
                  playWarpSound();
                  onSetTimeScale(100);
                }}
                className={`px-2 py-1 rounded transition-colors ${
                  timeScale === 100 ? 'bg-[#00f0ff]/20 text-[#00f0ff] font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                100x
              </button>
              <button
                onClick={() => {
                  playWarpSound();
                  onSetTimeScale(1000);
                }}
                className={`px-2 py-1 rounded transition-colors ${
                  timeScale === 1000 ? 'bg-[#00f0ff]/20 text-[#00f0ff] font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                1000x
              </button>
            </div>
          </div>

          {/* Section 2: Spectrum Bandpass Filter */}
          <div className="flex items-center gap-2">
            <div className="text-[10px] font-mono-tech uppercase text-slate-400 flex items-center gap-1">
              <Eye className="w-3 h-3 text-[#dcb8ff]" />
              <span className="hidden sm:inline">SPECTRUM</span>
            </div>

            <div className="flex items-center bg-[#111836] rounded p-0.5 border border-slate-800 text-xs font-mono-tech">
              {(
                [
                  { id: 'optical', label: 'Optical' },
                  { id: 'infrared', label: 'Infrared' },
                  { id: 'xray', label: 'X-Ray' },
                  { id: 'radio', label: 'Radio' },
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    playHudClickSound();
                    onSetSpectrumMode(mode.id);
                  }}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    spectrumMode === mode.id
                      ? 'bg-[#8a2be2]/30 text-[#dcb8ff] font-semibold border border-[#8a2be2]/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Camera Presets */}
          <div className="flex items-center gap-2">
            <div className="text-[10px] font-mono-tech uppercase text-slate-400 flex items-center gap-1">
              <Camera className="w-3 h-3 text-[#ffd700]" />
              <span className="hidden sm:inline">CAMERA</span>
            </div>

            <div className="flex items-center bg-[#111836] rounded p-0.5 border border-slate-800 text-xs font-mono-tech">
              {(
                [
                  { id: 'free', label: 'Orbit' },
                  { id: 'zenith', label: 'Zenith' },
                  { id: 'surface', label: 'Surface' },
                ] as const
              ).map((cam) => (
                <button
                  key={cam.id}
                  onClick={() => {
                    playHudClickSound();
                    onSetCameraPreset(cam.id);
                  }}
                  className={`px-2 py-1 rounded transition-colors ${
                    cameraPreset === cam.id
                      ? 'bg-[#ffd700]/20 text-[#ffd700] font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cam.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Visual Layers Toggles */}
          <div className="flex items-center gap-1.5 border-l border-slate-800 pl-3">
            <button
              onClick={() => {
                playHudClickSound();
                onToggleLayer('orbits');
              }}
              title="Toggle Orbital Trajectory Lines"
              className={`p-1.5 rounded text-xs transition-colors border ${
                layers.orbits
                  ? 'border-[#00f0ff]/50 bg-[#00f0ff]/15 text-[#00f0ff]'
                  : 'border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              Orbits
            </button>

            <button
              onClick={() => {
                playHudClickSound();
                onToggleLayer('gravityGrid');
              }}
              title="Toggle Space-Time Gravitational Grid"
              className={`p-1.5 rounded text-xs transition-colors border ${
                layers.gravityGrid
                  ? 'border-[#00f0ff]/50 bg-[#00f0ff]/15 text-[#00f0ff]'
                  : 'border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              Gravity
            </button>

            <button
              onClick={() => {
                playHudClickSound();
                onToggleLayer('habitableZone');
              }}
              title="Toggle Circumstellar Habitable Zone"
              className={`p-1.5 rounded text-xs transition-colors border ${
                layers.habitableZone
                  ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400'
                  : 'border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              Habitable
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
