import React from 'react';
import { Volume2, VolumeX, BookOpen, Orbit } from 'lucide-react';
import { CelestialCategory } from '../types/astronomy';
import { toggleAudioMute, getAudioMutedState, playHudClickSound } from '../utils/spaceAudio';

interface TopBarProps {
  currentCategory: CelestialCategory;
  onSelectCategory: (cat: CelestialCategory) => void;
  onOpenDossier: () => void;
  onOpenSpectroscopy: () => void;
  onOpenScaleModal: () => void;
  onReturnToDashboard: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentCategory,
  onSelectCategory,
  onOpenDossier,
  onOpenSpectroscopy,
  onOpenScaleModal,
  onReturnToDashboard,
}) => {
  const [isMuted, setIsMuted] = React.useState(getAudioMutedState());

  const handleToggleAudio = () => {
    const muted = toggleAudioMute();
    setIsMuted(muted);
    if (!muted) playHudClickSound();
  };

  return (
    <header className="h-14 border-b border-[#00f0ff]/15 bg-[#0b0e23]/90 backdrop-blur-md px-6 flex items-center justify-between gap-8 z-30 shrink-0">
      {/* Zone 1: Single text element wordmark with back to Dashboard action */}
      <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
        <button
          onClick={() => {
            playHudClickSound();
            onReturnToDashboard();
          }}
          className="px-2.5 py-1 rounded bg-[#111836] border border-[#00f0ff]/30 text-xs font-mono-tech text-[#00f0ff] hover:bg-[#00f0ff]/20 flex items-center gap-1.5 transition-all shadow-[0_0_8px_rgba(0,240,255,0.2)]"
          title="Regresar al Centro de Control Cósmico"
        >
          <span className="material-symbols-outlined text-[16px]">grid_view</span>
          <span>Dashboard</span>
        </button>

        <div className="h-4 w-[1px] bg-[#00f0ff]/20 mx-1" />

        <div className="flex items-center gap-2">
          <Orbit className="w-5 h-5 text-[#00f0ff]" />
          <span className="font-space text-base font-bold tracking-tight text-[#f8fafc]">
            Cosmos Explorer
          </span>
        </div>
      </div>

      {/* Zone 2: 4–5 concise single-line nav links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => {
            playHudClickSound();
            onSelectCategory('solar-system');
          }}
          className={`whitespace-nowrap transition-colors hover:text-[#00f0ff] ${
            currentCategory === 'solar-system' ? 'text-[#00f0ff] font-semibold' : ''
          }`}
        >
          Solar System
        </button>

        <button
          onClick={() => {
            playHudClickSound();
            onSelectCategory('exoplanets');
          }}
          className={`whitespace-nowrap transition-colors hover:text-[#00f0ff] ${
            currentCategory === 'exoplanets' ? 'text-[#00f0ff] font-semibold' : ''
          }`}
        >
          Exoplanets
        </button>

        <button
          onClick={() => {
            playHudClickSound();
            onSelectCategory('deep-space');
          }}
          className={`whitespace-nowrap transition-colors hover:text-[#00f0ff] ${
            currentCategory === 'deep-space' ? 'text-[#00f0ff] font-semibold' : ''
          }`}
        >
          Deep Space
        </button>

        <button
          onClick={() => {
            playHudClickSound();
            onSelectCategory('spacecraft');
          }}
          className={`whitespace-nowrap transition-colors hover:text-[#00f0ff] ${
            currentCategory === 'spacecraft' ? 'text-[#00f0ff] font-semibold' : ''
          }`}
        >
          Spacecraft Fleet
        </button>

        <button
          onClick={() => {
            playHudClickSound();
            onOpenSpectroscopy();
          }}
          className="whitespace-nowrap text-[#dcb8ff] hover:text-[#f8fafc] transition-colors"
        >
          Spectroscopy Lab
        </button>

        <button
          onClick={() => {
            playHudClickSound();
            onOpenScaleModal();
          }}
          className="whitespace-nowrap text-slate-400 hover:text-[#00f0ff] transition-colors"
        >
          Scale Comparison
        </button>
      </nav>

      {/* Zone 3: 1 primary action with secondary audio switch */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={handleToggleAudio}
          title={isMuted ? 'Unmute Audio Synthesizer' : 'Mute Audio Synthesizer'}
          className="p-2 rounded text-slate-400 hover:text-[#00f0ff] hover:bg-[#111836] transition-colors border border-transparent hover:border-[#00f0ff]/20"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#00f0ff]" />}
        </button>

        <button
          onClick={() => {
            playHudClickSound();
            onOpenDossier();
          }}
          className="neon-btn-primary px-3.5 py-1.5 text-xs font-semibold rounded flex items-center gap-2 whitespace-nowrap"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Research Dossier</span>
        </button>
      </div>
    </header>
  );
};
