import React, { useState, useEffect } from 'react';
import {
  Orbit,
  Rocket,
  Compass,
  Radio,
  ExternalLink,
  PlayCircle,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Download,
  CheckCircle2,
  XCircle,
  Search,
  Bell,
  Sliders,
  Calendar,
  Satellite,
  Volume2,
  ChevronRight,
  Sun,
  Shield,
  Activity,
  Award,
} from 'lucide-react';
import { playHudClickSound, playBeaconPulseSound } from '../utils/spaceAudio';

interface MissionControlDashboardProps {
  onLaunchSimulator: (targetBodyId?: string) => void;
  onOpenDossier: () => void;
  onOpenSpectroscopy: () => void;
}

export const MissionControlDashboard: React.FC<MissionControlDashboardProps> = ({
  onLaunchSimulator,
  onOpenDossier,
  onOpenSpectroscopy,
}) => {
  // Stardate MJD real-time calculation
  const [stardate, setStardate] = useState('');
  useEffect(() => {
    const updateStardate = () => {
      const now = new Date();
      const baseMJD = 59847 + (now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds()) / 86400;
      setStardate(baseMJD.toFixed(4) + ' UTC');
    };
    updateStardate();
    const interval = setInterval(updateStardate, 1000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer for Eclipse Solar & JWST Sync
  const [countdown, setCountdown] = useState(2 * 3600 + 43 * 60 + 22);
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const countHours = String(Math.floor(countdown / 3600)).padStart(2, '0');
  const countMins = String(Math.floor((countdown % 3600) / 60)).padStart(2, '0');
  const countSecs = String(countdown % 60).padStart(2, '0');

  // Interactive Daily Quiz
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const correctQuizIndex = 1; // Voyager 1 y 2

  const handleSelectQuiz = (index: number) => {
    if (quizSubmitted) return;
    playHudClickSound();
    setSelectedQuizAnswer(index);
    setQuizSubmitted(true);
  };

  // Audio Telemetry simulation (Sonificación Magallanes)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioBars, setAudioBars] = useState([8, 16, 24, 12, 20, 16, 24, 8, 12, 20]);

  useEffect(() => {
    let anim: number;
    if (isPlayingAudio) {
      const interval = setInterval(() => {
        setAudioBars((prev) =>
          prev.map(() => Math.floor(Math.random() * 20) + 4)
        );
      }, 150);
      return () => clearInterval(interval);
    } else {
      setAudioBars([8, 16, 24, 12, 20, 16, 24, 8, 12, 20]);
    }
  }, [isPlayingAudio]);

  const toggleAudio = () => {
    playBeaconPulseSound();
    setIsPlayingAudio(!isPlayingAudio);
  };

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // 4K Broadcast Stream simulation modal
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-[#0b0d1a] text-[#e1e1f3] font-inter overflow-x-hidden flex">
      {/* 1. Left Persistent Aerospace Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-[#191b28]/95 backdrop-blur-2xl z-40 flex flex-col justify-between py-5 px-4 shadow-[4px_0_24px_rgba(0,0,0,0.5)] border-r border-[#3b494b]/30">
        <div className="flex flex-col gap-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 px-2">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#272937] shadow-[0_0_16px_rgba(0,240,255,0.25)] border border-[#00f0ff]/30">
              <span className="material-symbols-outlined text-[#00f0ff] text-[24px]">public</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#7701d0] shadow-[0_0_8px_rgba(119,1,208,0.8)]"></span>
            </div>
            <div>
              <div className="font-space text-lg text-[#dbfcff] font-bold tracking-wider">COSMOS</div>
              <div className="font-mono-tech text-[11px] text-[#00dbe9] uppercase tracking-widest">Explorer HUD</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <button
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all bg-[#272937] text-[#00f0ff] font-semibold shadow-[0_0_12px_rgba(0,240,255,0.15)] border-l-2 border-[#00f0ff] text-left w-full"
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
              <span className="font-inter text-sm">Inicio / Dashboard</span>
            </button>

            <button
              onClick={() => {
                playHudClickSound();
                onLaunchSimulator();
              }}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[#b9cacb] hover:bg-[#1d1f2c] hover:text-[#e1e1f3] transition-all text-sm w-full text-left group"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] group-hover:text-[#00f0ff] transition-colors">view_in_ar</span>
                <span>Sistema Solar 3D</span>
              </div>
              <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20">
                WEBGL
              </span>
            </button>

            <button
              onClick={() => {
                playHudClickSound();
                onLaunchSimulator('mars');
              }}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[#b9cacb] hover:bg-[#1d1f2c] hover:text-[#e1e1f3] transition-all text-sm w-full text-left"
            >
              <span className="material-symbols-outlined text-[20px]">orbit</span>
              <span>Planetas & Cuerpos</span>
            </button>

            <button
              onClick={() => {
                playHudClickSound();
                const el = document.getElementById('missions-feed');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[#b9cacb] hover:bg-[#1d1f2c] hover:text-[#e1e1f3] transition-all text-sm w-full text-left"
            >
              <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
              <span>Noticias & Misiones</span>
            </button>

            <button
              onClick={() => {
                playHudClickSound();
                onOpenSpectroscopy();
              }}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[#b9cacb] hover:bg-[#1d1f2c] hover:text-[#e1e1f3] transition-all text-sm w-full text-left"
            >
              <span className="material-symbols-outlined text-[20px]">school</span>
              <span>Academia Cósmica</span>
            </button>

            <button
              onClick={() => {
                playHudClickSound();
                const el = document.getElementById('quiz-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[#b9cacb] hover:bg-[#1d1f2c] hover:text-[#e1e1f3] transition-all text-sm w-full text-left"
            >
              <span className="material-symbols-outlined text-[20px]">psychology</span>
              <span>Quiz & Desafíos</span>
            </button>

            <button
              onClick={() => {
                playHudClickSound();
                onOpenDossier();
              }}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[#b9cacb] hover:bg-[#1d1f2c] hover:text-[#e1e1f3] transition-all text-sm w-full text-left"
            >
              <span className="material-symbols-outlined text-[20px]">bookmark</span>
              <span>Favoritos Guardados</span>
            </button>
          </nav>
        </div>

        {/* Bottom Station Telemetry Card */}
        <div className="flex flex-col gap-3 p-3.5 rounded-xl bg-[#0b0d1a]/80 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-[#3b494b]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] animate-pulse"></span>
              <span className="font-mono-tech text-[11px] text-[#b9cacb] uppercase">Estación Terrena</span>
            </div>
            <span className="font-mono-tech text-xs text-[#dcb8ff]">CANBERRA-43</span>
          </div>

          <div className="flex items-center justify-between text-[#b9cacb] font-mono-tech text-xs">
            <span className="text-[#849495]">RA / DEC</span>
            <span className="text-[#7df4ff]">17h 45m / -29° 00′</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#3b494b]/20">
            <span className="font-mono-tech text-[11px] text-[#849495] uppercase">Link Telemetría</span>
            <span className="font-mono-tech text-xs text-[#00f0ff]">98.4% LOCK</span>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area Offset by Sidebar */}
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        {/* Top Header Fixed Bar */}
        <header className="sticky top-0 left-72 right-0 h-16 bg-[#0b0d1a]/85 backdrop-blur-xl z-30 flex items-center justify-between px-6 shadow-[0_4px_24px_rgba(0,0,0,0.5)] border-b border-[#3b494b]/30">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#191b28] shadow-[inset_0_0_8px_rgba(0,240,255,0.1)] border border-[#00f0ff]/20">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_6px_#00f0ff]"></span>
              <span className="font-mono-tech text-[11px] text-[#7df4ff] uppercase tracking-wider">
                TELEMETRY ONLINE // DSN NODE-07
              </span>
            </div>
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#191b28] border border-[#dcb8ff]/20">
              <span className="material-symbols-outlined text-[#dcb8ff] text-[16px]">satellite_alt</span>
              <span className="font-mono-tech text-[11px] text-[#dcb8ff] uppercase">JWST / L2 LINK</span>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-4 flex-1 max-w-lg mx-6">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#00f0ff] text-[18px]">
                travel_explore
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar exoplanetas, sondas (Voyager, James Webb), misiones..."
                className="w-full bg-[#191b28]/70 focus:bg-[#191b28] rounded-lg pl-9 pr-4 py-1.5 font-inter text-sm text-[#e1e1f3] placeholder:text-[#849495] outline-none transition-all shadow-[0_0_12px_rgba(0,0,0,0.2)] focus:shadow-[0_0_16px_rgba(0,240,255,0.2)] border border-[#3b494b]/30 focus:border-[#00f0ff]/50"
              />
            </div>
          </div>

          {/* Right Header Controls & Profile */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => playHudClickSound()}
              className="relative p-2 rounded-lg bg-[#191b28] hover:bg-[#1d1f2c] text-[#b9cacb] hover:text-[#dbfcff] transition-all border border-[#3b494b]/20"
            >
              <span className="material-symbols-outlined text-[20px]">notifications_active</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#7701d0] shadow-[0_0_6px_rgba(119,1,208,0.9)]"></span>
            </button>

            <button
              onClick={() => playHudClickSound()}
              className="p-2 rounded-lg bg-[#191b28] hover:bg-[#1d1f2c] text-[#b9cacb] hover:text-[#dbfcff] transition-all border border-[#3b494b]/20"
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-[#3b494b]/30">
              <div className="text-right hidden sm:block">
                <div className="font-space text-sm text-[#dbfcff] font-semibold leading-tight">Cmdr. Sarah Vance</div>
                <div className="font-mono-tech text-[10px] text-[#dcb8ff] uppercase">Astrophysicist Lvl. IX</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#dbfcff] flex items-center justify-center shadow-[0_0_12px_rgba(0,240,255,0.4)] text-[#00363a] font-bold text-sm">
                SV
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main Scrollable Body */}
        <main className="w-full p-6 flex flex-col gap-6 relative">
          {/* Ambient Glowing Orbs */}
          <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-[#00f0ff]/10 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-[#7701d0]/15 rounded-full blur-[130px] pointer-events-none"></div>
          <div className="absolute bottom-10 left-10 w-[600px] h-[350px] bg-[#00dbe9]/5 rounded-full blur-[150px] pointer-events-none"></div>

          {/* Top Mission Command Header Banner */}
          <section className="relative z-10 w-full flex flex-col lg:flex-row lg:items-center justify-between rounded-2xl bg-[#191b28]/70 backdrop-blur-2xl border border-[#3b494b]/40 shadow-[0_12px_40px_rgba(0,0,0,0.6)] p-5 gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#272937]/90 text-[#7df4ff] font-mono-tech text-[11px] tracking-widest uppercase border border-[#00f0ff]/20">
                  <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping"></span>
                  SYS STATUS // NOMINAL T-0
                </span>
                <span className="text-[#849495] font-mono-tech text-[11px]">//</span>
                <span className="text-[#dcb8ff] font-mono-tech text-[11px]">SECTOR DE OBSERVACIÓN: ORÓN-ALPHA</span>
                <span className="text-[#849495] font-mono-tech text-[11px]">//</span>
                <span className="text-[#e9c400] font-mono-tech text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700]"></span>HUBBLE + WEBB SYNC
                </span>
              </div>
              <div className="flex items-baseline gap-4 flex-wrap">
                <h1 className="font-space text-3xl font-bold tracking-tight text-[#dbfcff]">
                  Centro de Control Cósmico
                </h1>
                <span className="font-inter text-sm text-[#b9cacb]">
                  Bienvenido de nuevo, <strong className="text-[#e1e1f3] font-space font-semibold">Cmdr. Vance</strong>. 14 canales de telemetría orbital activos.
                </span>
              </div>
            </div>

            {/* Real-time Stardate & Quick Operations */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#272937]/80 border border-[#3b494b]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
                <div className="flex flex-col text-right">
                  <span className="font-mono-tech text-[11px] text-[#849495] uppercase tracking-wider">
                    Fecha Estelar MJD
                  </span>
                  <span className="font-mono-tech text-sm text-[#00f0ff] font-semibold">
                    {stardate || '59847.3710 UTC'}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-lg bg-[#1d1f2c] flex items-center justify-center text-[#00f0ff]">
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#272937]/80 border border-[#3b494b]/30">
                <button
                  onClick={() => {
                    playHudClickSound();
                    onLaunchSimulator('earth');
                  }}
                  className="px-3.5 py-2 rounded-lg bg-[#1d1f2c] hover:bg-[#10131f] text-[#dbfcff] font-mono-tech text-[11px] tracking-wider transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#00f0ff]">satellite_alt</span>
                  RADAR LEO
                </button>
                <button
                  onClick={() => {
                    playHudClickSound();
                    onLaunchSimulator('sol');
                  }}
                  className="px-3.5 py-2 rounded-lg hover:bg-[#10131f] text-[#b9cacb] font-mono-tech text-[11px] tracking-wider transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#dcb8ff]">flare</span>
                  SOLAR WIND
                </button>
                <button
                  onClick={() => playHudClickSound()}
                  className="w-9 h-9 rounded-lg bg-[#1d1f2c] hover:bg-[#10131f] flex items-center justify-center text-[#b9cacb] hover:text-[#00f0ff] transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">filter_list</span>
                </button>
              </div>
            </div>
          </section>

          {/* Main Bento Grid: Left Hero + Missions, Right Cosmo Pup + Telemetry */}
          <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 items-start gap-6">
            {/* Left 8 Columns */}
            <div className="xl:col-span-8 flex flex-col gap-6">
              {/* 1. Live Astronomical Hero Event Banner */}
              <div className="relative rounded-2xl overflow-hidden bg-[#191b28] border border-[#00f0ff]/30 shadow-[0_16px_40px_rgba(0,0,0,0.7)] group">
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 opacity-35"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAdmMK8QNtjJnsql8kgirjCK6BVJxR1gvlOSdUOpwdNZXJwAs1HuzazxGVk50tsHbwOJHESpbuLPHvrsTHie22olqkchU8N6dkr0Tz9M4vSHJp9EPzDBb9lfTJUri9tTH2_FtdFbJWuutEF3Tvw-DROXS7BdB8Ta6hNwK9p4hjXWw8yXgkYJ30c-YzSU0lusTdo8eqVxpzVy8Dq0If6JBskOg0BwJHg-qxlwrLAzjAd')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d1a] via-[#191b28]/85 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b0d1a]/95 via-[#0b0d1a]/60 to-transparent"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between p-6 sm:p-7 min-h-[380px]">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-[#93000a] text-[#ffdad6] font-mono-tech text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,180,171,0.3)]">
                        <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-pulse"></span>
                        EN DIRECTO // 4K BROADCAST
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#323442]/90 text-[#7df4ff] font-mono-tech text-[11px] uppercase tracking-wider border border-[#00f0ff]/20">
                        SINCRO: JWST NIRCam + DSN GOLDSTONE
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7701d0]/30 text-[#dcb8ff] font-mono-tech text-[11px] uppercase tracking-wider border border-[#dcb8ff]/30">
                        <span className="material-symbols-outlined text-[14px]">satellite_alt</span>
                        ORBITA LAGRANGE L2 OK
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-[#0b0d1a]/80 px-3.5 py-1.5 rounded-xl backdrop-blur-md border border-[#3b494b]/30">
                      <span className="material-symbols-outlined text-[#dcb8ff] text-[18px]">nest_clock_farsight_analog</span>
                      <span className="font-mono-tech text-[11px] text-[#b9cacb]">T-MINUS CLOCK</span>
                    </div>
                  </div>

                  {/* Center Block */}
                  <div className="flex flex-col gap-3 max-w-2xl my-4">
                    <div className="font-mono-tech text-[11px] text-[#dcb8ff] uppercase tracking-widest flex items-center gap-2">
                      <span>EVENTO ESTELAR INTERSECTORIAL</span>
                      <span className="w-8 h-[1px] bg-[#dcb8ff]/50"></span>
                      <span>CALIBRACIÓN ÓPTICA 0.04 AU</span>
                    </div>
                    <h2 className="font-space text-3xl font-bold text-[#dbfcff] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                      Eclipse Solar Anular & James Webb Deep Field Sync
                    </h2>
                    <p className="font-inter text-sm text-[#b9cacb] max-w-xl">
                      Alineación orbital crítica entre la Luna, el Sol y el observatorio L2. Midiendo lentes gravitacionales y curvatura lumínica en la corona solar exterior en ultra alta definición espectral infrarroja.
                    </p>
                  </div>

                  {/* Footer: Telemetry + Action + Live Timer */}
                  <div className="flex items-end justify-between gap-6 flex-wrap pt-2 border-t border-[#3b494b]/30">
                    <div className="flex items-center gap-6 flex-wrap">
                      {/* Countdown T-Zero */}
                      <div className="flex items-center gap-3 bg-[#0b0d1a]/85 p-3 rounded-xl backdrop-blur-md border border-[#3b494b]/30">
                        <div className="text-center px-1.5">
                          <span className="font-space text-2xl text-[#00f0ff] font-bold">{countHours}</span>
                          <span className="block font-mono-tech text-[10px] text-[#849495] uppercase">HRS</span>
                        </div>
                        <span className="font-space text-2xl text-[#849495]">:</span>
                        <div className="text-center px-1.5">
                          <span className="font-space text-2xl text-[#00f0ff] font-bold">{countMins}</span>
                          <span className="block font-mono-tech text-[10px] text-[#849495] uppercase">MIN</span>
                        </div>
                        <span className="font-space text-2xl text-[#849495]">:</span>
                        <div className="text-center px-1.5">
                          <span className="font-space text-2xl text-[#dcb8ff] font-bold">{countSecs}</span>
                          <span className="block font-mono-tech text-[10px] text-[#849495] uppercase">SEG</span>
                        </div>
                      </div>

                      {/* Live Stream Action */}
                      <button
                        onClick={() => {
                          playHudClickSound();
                          setIsBroadcastOpen(true);
                        }}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00f0ff]/30 to-[#00f0ff]/10 hover:from-[#00f0ff]/40 hover:to-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50 font-space text-sm font-semibold flex items-center gap-2.5 shadow-[0_0_24px_rgba(0,240,255,0.3)] transition-all"
                      >
                        <span className="material-symbols-outlined text-[22px]">play_circle</span>
                        <span>Iniciar Transmisión 4K</span>
                      </button>
                    </div>

                    {/* Telemetry Specs */}
                    <div className="hidden sm:flex items-center gap-4">
                      <div className="flex flex-col text-right">
                        <span className="font-mono-tech text-[10px] text-[#849495]">DISTANCIA FOCAL</span>
                        <span className="font-mono-tech text-xs text-[#e1e1f3]">1,500,000 KM (L2)</span>
                      </div>
                      <div className="w-px h-8 bg-[#3b494b]/50"></div>
                      <div className="flex flex-col text-right">
                        <span className="font-mono-tech text-[10px] text-[#849495]">FLUJO FOTÓNICO</span>
                        <span className="font-mono-tech text-xs text-[#7df4ff]">9.84 × 10⁸ /s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Feed de Expediciones Activas & Misiones (4 Cards Grid) */}
              <div id="missions-feed" className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#00f0ff] text-[22px]">rocket_launch</span>
                    <h3 className="font-space text-xl text-[#e1e1f3] font-semibold">Feed de Expediciones & Misiones Activas</h3>
                  </div>
                  <button
                    onClick={() => onOpenDossier()}
                    className="font-mono-tech text-[11px] text-[#00dbe9] hover:text-[#00f0ff] flex items-center gap-1 uppercase tracking-wider transition-colors"
                  >
                    <span>Bitácora Completa (42)</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: Europa Clipper */}
                  <div
                    onClick={() => {
                      playHudClickSound();
                      onLaunchSimulator('jupiter');
                    }}
                    className="cursor-pointer flex flex-col justify-between rounded-xl bg-[#191b28]/80 hover:bg-[#1d1f2c] transition-all group border border-[#3b494b]/30 hover:border-[#00f0ff]/40 shadow-md p-4"
                  >
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded bg-[#272937] text-[#7df4ff] font-mono-tech text-[11px] uppercase tracking-wider border border-[#00f0ff]/20">
                          NASA / JÚPITER
                        </span>
                        <span className="material-symbols-outlined text-[#849495] group-hover:text-[#00f0ff] transition-colors text-[20px]">
                          arrow_outward
                        </span>
                      </div>
                      <div>
                        <h4 className="font-space text-base text-[#dbfcff] font-bold group-hover:text-[#7df4ff] transition-colors">
                          Europa Clipper
                        </h4>
                        <p className="font-inter text-xs text-[#b9cacb] line-clamp-2 mt-1">
                          Trayectoria de asistencia gravitacional Tierra-Marte hacia el océano subterráneo salino de Europa.
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 flex flex-col gap-2 border-t border-[#3b494b]/20 mt-3">
                      <div className="flex items-center justify-between font-mono-tech text-xs text-[#b9cacb]">
                        <span className="text-[#849495]">Distancia Solar: <strong className="text-[#e1e1f3]">1.34 AU</strong></span>
                        <span className="text-[#00f0ff] font-semibold">31.8 KM/S</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#323442] overflow-hidden">
                        <div className="h-full rounded-full bg-[#00f0ff] w-[34%] shadow-[0_0_8px_rgba(0,240,255,0.6)]"></div>
                      </div>
                      <div className="flex items-center justify-between font-mono-tech text-[11px] text-[#849495]">
                        <span>T-FLYBY: 412 DÍAS</span>
                        <span className="text-[#00f0ff] font-semibold">EN TRÁNSITO</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Perseverance Mars Rover */}
                  <div
                    onClick={() => {
                      playHudClickSound();
                      onLaunchSimulator('mars');
                    }}
                    className="cursor-pointer flex flex-col justify-between rounded-xl bg-[#191b28]/80 hover:bg-[#1d1f2c] transition-all group border border-[#3b494b]/30 hover:border-[#e9c400]/40 shadow-md p-4"
                  >
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded bg-[#272937] text-[#e9c400] font-mono-tech text-[11px] uppercase tracking-wider border border-[#ffd700]/20">
                          MARS 2020 / JEZERO
                        </span>
                        <span className="material-symbols-outlined text-[#849495] group-hover:text-[#e9c400] transition-colors text-[20px]">
                          arrow_outward
                        </span>
                      </div>
                      <div>
                        <h4 className="font-space text-base text-[#dbfcff] font-bold group-hover:text-[#e9c400] transition-colors">
                          Perseverance Rover & Ingenuity
                        </h4>
                        <p className="font-inter text-xs text-[#b9cacb] line-clamp-2 mt-1">
                          Toma de muestras geológicas de sedimentos deltaicos antiguos para biosignaturas fósiles.
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 flex flex-col gap-2 border-t border-[#3b494b]/20 mt-3">
                      <div className="flex items-center justify-between font-mono-tech text-xs text-[#b9cacb]">
                        <span className="text-[#849495]">Tubo de muestra #24: <strong className="text-[#e1e1f3]">Sellado</strong></span>
                        <span className="text-[#e9c400] font-semibold">SOL 1148</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#323442] overflow-hidden">
                        <div className="h-full rounded-full bg-[#e9c400] w-[85%] shadow-[0_0_8px_rgba(233,196,0,0.5)]"></div>
                      </div>
                      <div className="flex items-center justify-between font-mono-tech text-[11px] text-[#849495]">
                        <span>DIST. RECORRIDA: 28.4 KM</span>
                        <span className="text-[#e9c400] font-semibold">ACTIVO // CRÁTER</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Nancy Grace Roman Space Telescope */}
                  <div
                    onClick={() => {
                      playHudClickSound();
                      onOpenSpectroscopy();
                    }}
                    className="cursor-pointer flex flex-col justify-between rounded-xl bg-[#191b28]/80 hover:bg-[#1d1f2c] transition-all group border border-[#3b494b]/30 hover:border-[#dcb8ff]/40 shadow-md p-4"
                  >
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded bg-[#272937] text-[#dcb8ff] font-mono-tech text-[11px] uppercase tracking-wider border border-[#dcb8ff]/20">
                          ASTROFÍSICA NIR / WFIRST
                        </span>
                        <span className="material-symbols-outlined text-[#849495] group-hover:text-[#dcb8ff] transition-colors text-[20px]">
                          arrow_outward
                        </span>
                      </div>
                      <div>
                        <h4 className="font-space text-base text-[#dbfcff] font-bold group-hover:text-[#dcb8ff] transition-colors">
                          Telescopio Nancy Grace Roman
                        </h4>
                        <p className="font-inter text-xs text-[#b9cacb] line-clamp-2 mt-1">
                          Campo visual 100 veces mayor que Hubble para mapeo de energía oscura y censo de exoplanetas.
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 flex flex-col gap-2 border-t border-[#3b494b]/20 mt-3">
                      <div className="flex items-center justify-between font-mono-tech text-xs text-[#b9cacb]">
                        <span className="text-[#849495]">Integración Óptica: <strong className="text-[#e1e1f3]">92% OK</strong></span>
                        <span className="text-[#dcb8ff] font-semibold">FASE D</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#323442] overflow-hidden">
                        <div className="h-full rounded-full bg-[#7701d0] w-[92%] shadow-[0_0_8px_rgba(119,1,208,0.6)]"></div>
                      </div>
                      <div className="flex items-center justify-between font-mono-tech text-[11px] text-[#849495]">
                        <span>LANZAMIENTO: MAYO 2027</span>
                        <span className="text-[#dcb8ff] font-semibold">CALIBRACIÓN L2</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Artemis III Lunar Landing */}
                  <div
                    onClick={() => {
                      playHudClickSound();
                      onLaunchSimulator('earth');
                    }}
                    className="cursor-pointer flex flex-col justify-between rounded-xl bg-[#191b28]/80 hover:bg-[#1d1f2c] transition-all group border border-[#3b494b]/30 hover:border-[#7df4ff]/40 shadow-md p-4"
                  >
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded bg-[#272937] text-[#7df4ff] font-mono-tech text-[11px] uppercase tracking-wider border border-[#dbfcff]/20">
                          LUNAR SURFACE / HLS
                        </span>
                        <span className="material-symbols-outlined text-[#849495] group-hover:text-[#7df4ff] transition-colors text-[20px]">
                          arrow_outward
                        </span>
                      </div>
                      <div>
                        <h4 className="font-space text-base text-[#dbfcff] font-bold group-hover:text-[#7df4ff] transition-colors">
                          Programa Artemisa III
                        </h4>
                        <p className="font-inter text-xs text-[#b9cacb] line-clamp-2 mt-1">
                          Retorno de astronautas a la superficie del polo sur lunar y exploración de depósitos de hielo en cráteres.
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 flex flex-col gap-2 border-t border-[#3b494b]/20 mt-3">
                      <div className="flex items-center justify-between font-mono-tech text-xs text-[#b9cacb]">
                        <span className="text-[#849495]">Sitio Objetivo: <strong className="text-[#e1e1f3]">Malapert A</strong></span>
                        <span className="text-[#7df4ff] font-semibold">ORION + HLS</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#323442] overflow-hidden">
                        <div className="h-full rounded-full bg-[#00f0ff] w-[65%] shadow-[0_0_8px_rgba(0,240,255,0.6)]"></div>
                      </div>
                      <div className="flex items-center justify-between font-mono-tech text-[11px] text-[#849495]">
                        <span>VENTANA: SEP 2026</span>
                        <span className="text-[#7df4ff] font-semibold">PRE-INSERCIÓN</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Cosmo Pup Astronaut + Telemetry Deck */}
            <div className="xl:col-span-4 flex flex-col gap-6">
              {/* Prominent Card: Cadete Espacial Cosmo Pup (Perro Astronauta) */}
              <div className="relative rounded-2xl bg-gradient-to-b from-[#191b28] to-[#0b0d1a] p-5 border border-[#00f0ff]/40 shadow-[0_16px_40px_rgba(0,240,255,0.15)] flex flex-col gap-4 overflow-hidden group">
                {/* Glow Orbs inside card */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#00f0ff]/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#7701d0]/25 rounded-full blur-2xl pointer-events-none"></div>

                {/* Mascot Card Header */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-ping"></span>
                    <span className="font-mono-tech text-[11px] text-[#7df4ff] uppercase tracking-wider font-semibold">
                      CO-PILOTO DE MISIÓN // EVA-L2
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#00f0ff]/15 text-[#00f0ff] font-mono-tech text-[11px] uppercase border border-[#00f0ff]/30">
                    MICROGRAVEDAD 0.0G
                  </span>
                </div>

                {/* Mascot Render & Badges */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative w-full aspect-square max-w-[280px] rounded-2xl overflow-hidden border-2 border-[#00f0ff]/50 shadow-[0_0_30px_rgba(0,240,255,0.3)] bg-[#0b0d1a] group-hover:border-[#00f0ff] transition-all">
                    <img
                      alt="Cadete Cosmo Pup perro astronauta en gravedad cero"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      src="https://lh3.googleusercontent.com/aida/AEtjO1Xvo1G-7Vb4cOeTTHjCRbip1tBCWDKbT-GbYKeFePkBcsV1I_n7Akm2DTvrNrqKvYcgQiRpSEqDMC_bJer8yUhc1aIFLuGJVDKUUKZbODWtcb_sSA9CCTjBERha7zq7vnHIAyfAZ1hrhI2Lu0LQ8OGDZ9bM1i8fwy6ZKbx2DPC90N1Cyk7Mwj3ymSsP0k0ePGL6iTca3jf4Pod-a9TNOE57G6DugyxnxJh7cBShWg6p"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d1a]/80 via-transparent to-transparent"></div>

                    {/* Live Telemetry Tag on Image */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#0b0d1a]/90 backdrop-blur-md border border-[#3b494b]/30 text-[11px] font-mono-tech">
                      <span className="flex items-center gap-1.5 text-[#7df4ff]">
                        <span className="material-symbols-outlined text-[14px] text-[#00f0ff]">favorite</span>
                        PULSO: 82 BPM
                      </span>
                      <span className="text-[#dcb8ff] font-semibold">O2: 99.4%</span>
                    </div>
                  </div>

                  <div className="mt-3 text-center">
                    <h3 className="font-space text-lg text-[#dbfcff] font-bold">Cadete Cosmo Pup</h3>
                    <div className="font-mono-tech text-[#dcb8ff] uppercase text-[11px] tracking-wider">
                      Oficial Canino de Telemetría & Co-Piloto
                    </div>
                    <p className="font-inter text-xs text-[#b9cacb] mt-1 max-w-xs">
                      Monitoreo biométrico sincronizado en cabina presurizada. Traje espacial de alta resistencia hermética.
                    </p>
                  </div>
                </div>

                {/* Canine Bio-Telemetry Grid */}
                <div className="grid grid-cols-2 gap-2 relative z-10 pt-2 border-t border-[#3b494b]/30 font-mono-tech text-xs">
                  <div className="flex flex-col p-2.5 rounded-xl bg-[#272937]/80 border border-[#3b494b]/20">
                    <span className="font-mono-tech text-[#849495] uppercase text-[10px]">TRAJE ESTANCO</span>
                    <span className="text-[#00f0ff] font-semibold text-xs">1.02 ATM (ÓPTIMO)</span>
                  </div>
                  <div className="flex flex-col p-2.5 rounded-xl bg-[#272937]/80 border border-[#3b494b]/20">
                    <span className="font-mono-tech text-[#849495] uppercase text-[10px]">NIVEL DE JUEGO</span>
                    <span className="text-[#e9c400] font-semibold text-xs">100% (MÁXIMO)</span>
                  </div>
                  <div className="flex flex-col p-2.5 rounded-xl bg-[#272937]/80 border border-[#3b494b]/20">
                    <span className="font-mono-tech text-[#849495] uppercase text-[10px]">CO2 EN VISOR</span>
                    <span className="text-[#e1e1f3] font-semibold text-xs">0.03% (NOMINAL)</span>
                  </div>
                  <div className="flex flex-col p-2.5 rounded-xl bg-[#272937]/80 border border-[#3b494b]/20">
                    <span className="font-mono-tech text-[#849495] uppercase text-[10px]">ESTADO CO-PILOTO</span>
                    <span className="text-[#dcb8ff] font-semibold text-xs">A BORDO & SEGURO</span>
                  </div>
                </div>
              </div>

              {/* Real-time Orbital Telemetry HUD Deck */}
              <div className="rounded-2xl bg-[#191b28]/90 backdrop-blur-2xl border border-[#3b494b]/40 shadow-[0_16px_40px_rgba(0,0,0,0.6)] flex flex-col p-5 gap-4">
                {/* HUD Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#3b494b]/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] shadow-[0_0_10px_#00f0ff] animate-pulse"></span>
                    <span className="font-space text-base text-[#dbfcff] font-bold tracking-wider">
                      CENTRO DE TELEMETRÍA
                    </span>
                  </div>
                  <span className="font-mono-tech text-[11px] text-[#7df4ff] uppercase px-2 py-0.5 rounded bg-[#272937] border border-[#00f0ff]/20">
                    DEFCON-ORBIT 1
                  </span>
                </div>

                {/* Section 1: ISS Live Position Tracker & Vector Arc */}
                <div className="flex flex-col gap-2.5 rounded-xl bg-[#0b0d1a]/80 p-3.5 border border-[#3b494b]/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#00f0ff] text-[20px]">spatial_tracking</span>
                      <span className="font-space text-sm text-[#dbfcff] font-semibold">Estación Espacial (ISS)</span>
                    </div>
                    <span className="font-mono-tech text-xs text-[#dcb8ff]">EXPEDICIÓN 71</span>
                  </div>

                  {/* Stylized Orbital SVG Projection Vector */}
                  <div className="relative w-full rounded-lg bg-[#1d1f2c] overflow-hidden flex items-center justify-center h-24 border border-[#3b494b]/20">
                    <svg className="absolute inset-0 w-full h-full text-[#3b494b]/30" preserveAspectRatio="none" viewBox="0 0 300 120">
                      <line stroke="currentColor" strokeDasharray="2,4" x1="0" x2="300" y1="30" y2="30"></line>
                      <line stroke="currentColor" strokeDasharray="2,4" x1="0" x2="300" y1="60" y2="60"></line>
                      <line stroke="currentColor" strokeDasharray="2,4" x1="0" x2="300" y1="90" y2="90"></line>
                      <line stroke="currentColor" strokeDasharray="2,4" x1="75" x2="75" y1="0" y2="120"></line>
                      <line stroke="currentColor" strokeDasharray="2,4" x1="150" x2="150" y1="0" y2="120"></line>
                      <line stroke="currentColor" strokeDasharray="2,4" x1="225" x2="225" y1="0" y2="120"></line>
                      <path className="text-[#00f0ff]/40" d="M 0,80 Q 75,10 150,60 T 300,40" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
                      <path className="text-[#00f0ff]" d="M 0,80 Q 75,10 150,60 T 210,48" fill="none" stroke="currentColor" strokeWidth="2.5"></path>
                      <circle className="animate-ping" cx="210" cy="48" fill="rgba(0, 240, 255, 0.2)" r="7" stroke="#00f0ff" strokeWidth="1.5"></circle>
                      <circle cx="210" cy="48" fill="#00f0ff" r="3.5"></circle>
                    </svg>
                    <div className="absolute bottom-1.5 left-2 px-2 py-0.5 rounded bg-[#0b0d1a]/90 font-mono-tech text-[#7df4ff] text-[10px]">
                      SOBRE EL PACÍFICO // 51.64° INC
                    </div>
                    <div className="absolute top-1.5 right-2 px-2 py-0.5 rounded bg-[#0b0d1a]/90 font-mono-tech text-[#dcb8ff] text-[10px]">
                      ALT: 408.0 KM
                    </div>
                  </div>

                  {/* Parameters Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-1 font-mono-tech text-xs">
                    <div className="flex flex-col p-2 rounded bg-[#1d1f2c] border border-[#3b494b]/10">
                      <span className="text-[#849495] font-mono-tech text-[10px]">VEL. ORBITAL</span>
                      <span className="text-[#e1e1f3] font-semibold">27,580 km/h</span>
                    </div>
                    <div className="flex flex-col p-2 rounded bg-[#1d1f2c] border border-[#3b494b]/10">
                      <span className="text-[#849495] font-mono-tech text-[10px]">PERÍODO ORBITAL</span>
                      <span className="text-[#e1e1f3] font-semibold">92.8 min</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Heliosphere SOHO / Solar Wind */}
                <div className="flex flex-col gap-2.5 rounded-xl bg-[#0b0d1a]/80 p-3.5 border border-[#3b494b]/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#e9c400] text-[20px]">wb_sunny</span>
                      <span className="font-space text-sm text-[#dbfcff] font-semibold">Viento Solar / SOHO</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#ffd700]/20 text-[#fff5de] font-mono-tech text-[11px] uppercase border border-[#ffd700]/30">
                      CLASE M2.4
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-space text-2xl text-[#e9c400] font-bold">420</span>
                      <span className="font-mono-tech text-xs text-[#b9cacb] ml-1">km/s VELOCIDAD</span>
                    </div>
                    {/* Solar Storm Indicator Gauge */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-6 rounded-sm bg-[#00f0ff]"></div>
                      <div className="w-2.5 h-6 rounded-sm bg-[#00f0ff]"></div>
                      <div className="w-2.5 h-6 rounded-sm bg-[#ffd700]"></div>
                      <div className="w-2.5 h-6 rounded-sm bg-[#ffd700]"></div>
                      <div className="w-2.5 h-6 rounded-sm bg-[#323442]"></div>
                    </div>
                  </div>
                  <p className="font-inter text-xs text-[#b9cacb] leading-relaxed">
                    Flujo de plasma y protones estable. Perturbación geomagnética G1 esperada en los polos en las próximas 14h.
                  </p>
                </div>

                {/* Section 3: Deep Space Network (DSN) Real-Time Status */}
                <div className="flex flex-col gap-2.5 rounded-xl bg-[#0b0d1a]/80 p-3.5 border border-[#3b494b]/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#dcb8ff] text-[20px]">cell_tower</span>
                      <span className="font-space text-sm text-[#dbfcff] font-semibold">Deep Space Network (DSN)</span>
                    </div>
                    <span className="font-mono-tech text-xs text-[#00f0ff]">42 SONDAS ACTIVAS</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between p-2 rounded bg-[#1d1f2c] border border-[#3b494b]/10">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] shadow-[0_0_4px_#00f0ff]"></span>
                        <span className="font-mono-tech text-xs text-[#e1e1f3]">GOLDSTONE DSS-14</span>
                      </div>
                      <span className="font-mono-tech text-xs text-[#7df4ff]">VOYAGER 1 (X-BAND)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-[#1d1f2c] border border-[#3b494b]/10">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] shadow-[0_0_4px_#00f0ff]"></span>
                        <span className="font-mono-tech text-xs text-[#e1e1f3]">MADRID DSS-65</span>
                      </div>
                      <span className="font-mono-tech text-xs text-[#7df4ff]">MARS PERSEVERANCE</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-[#1d1f2c] border border-[#3b494b]/10">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#dcb8ff] shadow-[0_0_4px_#dcb8ff]"></span>
                        <span className="font-mono-tech text-xs text-[#e1e1f3]">CANBERRA DSS-43</span>
                      </div>
                      <span className="font-mono-tech text-xs text-[#dcb8ff]">NEW HORIZONS (KU)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playHudClickSound();
                    onOpenDossier();
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#1d1f2c] hover:bg-[#272937] text-[#dbfcff] font-mono-tech text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#3b494b]/30 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">terminal</span>
                  <span>Descargar Vector de Telemetría (CSV/JSON)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Quick-Access Tools Triad */}
          <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 pt-2 gap-6">
            {/* Module 1: 3D Solar System Simulator CTA Card */}
            <div className="relative rounded-2xl bg-[#191b28]/80 backdrop-blur-xl border border-[#00f0ff]/30 shadow-lg flex flex-col justify-between overflow-hidden group p-5">
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#00f0ff]/10 rounded-full blur-3xl group-hover:bg-[#00f0ff]/20 transition-all"></div>
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-[#272937] text-[#00f0ff] shadow-[0_0_16px_rgba(0,240,255,0.2)] border border-[#00f0ff]/20">
                    <span className="material-symbols-outlined text-[24px]">view_in_ar</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#00f0ff]/10 text-[#7df4ff] font-mono-tech text-[11px] uppercase tracking-wider border border-[#00f0ff]/20">
                    MOTOR WEBGL 2.0
                  </span>
                </div>
                <div>
                  <h3 className="font-space text-xl text-[#dbfcff] font-bold">Simulador Orbital 3D</h3>
                  <p className="font-inter text-xs text-[#b9cacb] mt-2 leading-relaxed">
                    Navega en tiempo real a través de órbitas keplerianas, lunas galileanas y trayectorias interplanetarias hiperbólicas en escala 1:1.
                  </p>
                </div>

                {/* Visual preview miniature of orbits */}
                <div className="w-full h-24 rounded-xl bg-[#1d1f2c] flex items-center justify-center relative overflow-hidden border border-[#3b494b]/30">
                  <div className="absolute w-20 h-20 rounded-full border border-[#00f0ff]/30"></div>
                  <div className="absolute w-36 h-36 rounded-full border border-[#dcb8ff]/30"></div>
                  <div className="w-4 h-4 rounded-full bg-[#ffd700] shadow-[0_0_12px_#ffd700]"></div>
                  <div className="absolute top-4 right-10 w-2.5 h-2.5 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]"></div>
                  <span className="absolute bottom-2 right-3 font-mono-tech text-[#849495] text-[10px]">
                    FPS: 60.0 // 120K BODIES
                  </span>
                </div>
              </div>

              <div className="relative z-10 pt-4">
                <button
                  onClick={() => {
                    playHudClickSound();
                    onLaunchSimulator();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#00f0ff] hover:bg-[#dbfcff] text-[#00363a] font-space text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all font-semibold"
                >
                  <span>Lanzar Simulador WebGL</span>
                  <span className="material-symbols-outlined text-[20px]">explore</span>
                </button>
              </div>
            </div>

            {/* Module 2: Daily Astronomy Quiz & XP Challenge */}
            <div id="quiz-section" className="relative rounded-2xl bg-[#191b28]/80 backdrop-blur-xl border border-[#dcb8ff]/30 shadow-lg flex flex-col justify-between overflow-hidden p-5">
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#7701d0]/10 rounded-full blur-3xl"></div>
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-[#272937] text-[#dcb8ff] shadow-[0_0_16px_rgba(119,1,208,0.2)] border border-[#dcb8ff]/20">
                    <span className="material-symbols-outlined text-[24px]">psychology</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-[#7701d0]/20 text-[#dcb8ff] font-mono-tech text-[11px] uppercase tracking-wider font-semibold border border-[#dcb8ff]/30">
                      +50 XP CADETE
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 font-mono-tech text-[#dcb8ff] uppercase tracking-widest text-[11px]">
                    <span>DESAFÍO DIARIO DE HOY</span>
                    <span>#048</span>
                  </div>
                  <h3 className="font-space text-base text-[#dbfcff] font-bold mt-1">
                    ¿Qué sonda espacial transporta el Disco de Oro original?
                  </h3>
                </div>

                {/* Interactive Choices */}
                <div className="flex flex-col gap-2">
                  {[
                    { text: 'A) Pioneer 10', correct: false },
                    { text: 'B) Voyager 1 y 2', correct: true },
                    { text: 'C) Cassini-Huygens', correct: false },
                  ].map((opt, idx) => {
                    const isSelected = selectedQuizAnswer === idx;
                    const isCorrect = opt.correct;
                    let btnStyle = 'bg-[#1d1f2c] border-[#3b494b]/20 text-[#e1e1f3] hover:bg-[#272937]';
                    if (quizSubmitted) {
                      if (isCorrect) {
                        btnStyle = 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff] font-semibold';
                      } else if (isSelected) {
                        btnStyle = 'bg-[#93000a]/30 text-[#ffb4ab] border-[#ffb4ab]';
                      } else {
                        btnStyle = 'opacity-50 bg-[#1d1f2c] border-transparent';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={quizSubmitted}
                        onClick={() => handleSelectQuiz(idx)}
                        className={`w-full p-2.5 rounded-lg border text-left font-inter text-xs flex items-center justify-between transition-all ${btnStyle}`}
                      >
                        <span>{opt.text}</span>
                        {quizSubmitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-[#00f0ff]" />
                        )}
                        {quizSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-[#ffb4ab]" />
                        )}
                        {!quizSubmitted && (
                          <span className="material-symbols-outlined text-[#849495] text-[18px]">
                            radio_button_unchecked
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative z-10 pt-3 flex items-center justify-between border-t border-[#3b494b]/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#e9c400] text-[18px]">military_tech</span>
                  <span className="font-mono-tech text-[#b9cacb] text-[11px]">RANGO GLOBAL: #14 (NIVEL 9)</span>
                </div>
                {quizSubmitted && (
                  <span className={`font-mono-tech text-xs font-semibold ${selectedQuizAnswer === correctQuizIndex ? 'text-[#00f0ff]' : 'text-[#ffb4ab]'}`}>
                    {selectedQuizAnswer === correctQuizIndex ? '+50 XP OBTENIDOS!' : 'RESPUESTA INCORRECTA'}
                  </span>
                )}
              </div>
            </div>

            {/* Module 3: Fact of the Day with Interactive Audio Telemetry */}
            <div className="relative rounded-2xl bg-[#191b28]/80 backdrop-blur-xl border border-[#ffd700]/30 shadow-lg flex flex-col justify-between overflow-hidden p-5">
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#ffd700]/10 rounded-full blur-3xl"></div>
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-[#272937] text-[#e9c400] shadow-[0_0_16px_rgba(233,196,0,0.15)] border border-[#ffd700]/20">
                    <span className="material-symbols-outlined text-[24px]">tips_and_updates</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#272937] text-[#e9c400] font-mono-tech text-[11px] uppercase tracking-wider border border-[#ffd700]/20">
                    ANOMALÍA PLANETARIA
                  </span>
                </div>
                <div>
                  <div className="font-mono-tech text-[#849495] uppercase tracking-wider text-[11px]">
                    DATO CIENTÍFICO // ARCHIVO 77-B
                  </div>
                  <h3 className="font-space text-base text-[#dbfcff] font-bold mt-1">
                    ¿Sabías que un día en Venus dura más que su año?
                  </h3>
                </div>
                <p className="font-inter text-xs text-[#b9cacb] leading-relaxed">
                  Venus rota retrógradamente tan despacio que completa un giro sobre su eje cada <strong className="text-[#e1e1f3]">243 días terrestres</strong>, mientras que su traslación orbital alrededor del Sol toma únicamente <strong className="text-[#e1e1f3]">225 días terrestres</strong>.
                </p>

                {/* Audio Waveform Visualization Simulation */}
                <div className="p-3 rounded-xl bg-[#1d1f2c] flex items-center justify-between gap-3 border border-[#3b494b]/20">
                  <button
                    onClick={toggleAudio}
                    className="w-10 h-10 rounded-lg bg-[#272937] text-[#00f0ff] flex items-center justify-center hover:scale-105 border border-[#00f0ff]/20 transition-all"
                  >
                    {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-[#00f0ff]" />}
                  </button>
                  <div className="flex-1 flex items-center gap-1 h-6">
                    {audioBars.map((height, i) => (
                      <span
                        key={i}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          i % 3 === 0 ? 'bg-[#00f0ff]' : i % 3 === 1 ? 'bg-[#dcb8ff]' : 'bg-[#00f0ff]/60'
                        }`}
                        style={{ height: `${height}px` }}
                      />
                    ))}
                  </div>
                  <span className="font-mono-tech text-[#849495] text-[11px]">
                    {isPlayingAudio ? '00:13' : '00:14'}
                  </span>
                </div>
              </div>

              <div className="relative z-10 pt-3 flex items-center justify-between border-t border-[#3b494b]/20">
                <div className="flex items-center gap-1.5 text-[#b9cacb] font-mono-tech text-xs">
                  <span className="material-symbols-outlined text-[16px] text-[#e9c400]">sensors</span>
                  <span className="text-[11px]">SONIFICACIÓN MAGALLANES</span>
                </div>
                <button
                  onClick={() => {
                    playHudClickSound();
                    onLaunchSimulator('venus');
                  }}
                  className="font-mono-tech text-[#7df4ff] hover:text-[#00f0ff] uppercase text-[11px] transition-colors"
                >
                  EXPANDIR FICHA +
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* 4K Stream Broadcast Modal Simulation */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-3xl bg-[#0b0e23] border border-[#00f0ff]/40 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-[#00f0ff]/20 bg-[#111836]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="font-mono-tech text-xs text-[#00f0ff] uppercase tracking-wider font-semibold">
                  FEED 4K // JWST NIRCam + DSN GOLDSTONE SATELLITE LINK
                </span>
              </div>
              <button
                onClick={() => setIsBroadcastOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdmMK8QNtjJnsql8kgirjCK6BVJxR1gvlOSdUOpwdNZXJwAs1HuzazxGVk50tsHbwOJHESpbuLPHvrsTHie22olqkchU8N6dkr0Tz9M4vSHJp9EPzDBb9lfTJUri9tTH2_FtdFbJWuutEF3Tvw-DROXS7BdB8Ta6hNwK9p4hjXWw8yXgkYJ30c-YzSU0lusTdo8eqVxpzVy8Dq0If6JBskOg0BwJHg-qxlwrLAzjAd"
                alt="Eclipse Solar Stream"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono-tech text-white">
                <div>
                  <div className="text-[#00f0ff] font-bold">SOL-LUNA-L2 CONJUNCTION</div>
                  <div className="text-[11px] text-slate-300">Resolución: 3840×2160 @ 60 FPS · Cifrado Cuántico</div>
                </div>
                <button
                  onClick={() => {
                    setIsBroadcastOpen(false);
                    onLaunchSimulator('sol');
                  }}
                  className="px-3 py-1.5 rounded bg-[#00f0ff] text-black font-semibold font-space hover:bg-white transition-colors"
                >
                  Ver en 3D
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
