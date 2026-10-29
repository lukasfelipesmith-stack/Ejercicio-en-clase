import React from 'react';
import { X, BookOpen, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CelestialBody } from '../types/astronomy';
import { playHudClickSound } from '../utils/spaceAudio';

interface DossierModalProps {
  body: CelestialBody;
  onClose: () => void;
}

export const DossierModal: React.FC<DossierModalProps> = ({ body, onClose }) => {
  const [downloadSuccess, setDownloadSuccess] = React.useState(false);

  const handleExportData = () => {
    playHudClickSound();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(body, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `COSMOS_TELEMETRY_${body.catalogCode}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-[#0b0e23] border border-[#00f0ff]/40 rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.8),0_0_30px_rgba(138,43,226,0.25)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#00f0ff]/20 bg-[#111836]/60">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#00f0ff]" />
            <div>
              <div className="text-[10px] font-mono-tech uppercase text-[#00f0ff] font-semibold tracking-wider">
                ASTROPHYSICAL RESEARCH DOSSIER · REF: {body.catalogCode}
              </div>
              <h2 className="font-space text-xl font-bold text-white leading-tight">
                {body.name}
              </h2>
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
          {/* Scientific Overview Card */}
          <div className="bg-[#111836]/50 border border-slate-800 rounded-lg p-5">
            <h3 className="font-space text-base font-semibold text-white mb-2">
              Scientific Overview & Physical Classification
            </h3>
            <p className="font-inter text-sm text-slate-300 leading-relaxed mb-4">
              {body.description}
            </p>
            <p className="font-inter text-sm text-slate-400 leading-relaxed bg-[#060814] p-4 rounded border border-slate-800/80">
              {body.scientificDossier}
            </p>
          </div>

          {/* Key Empirical Discoveries */}
          <div className="bg-[#111836]/50 border border-slate-800 rounded-lg p-5">
            <h3 className="font-space text-base font-semibold text-[#00f0ff] mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Empirical Findings & Observational Key Facts</span>
            </h3>
            <ul className="space-y-2.5">
              {body.keyFacts.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs font-inter text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Comprehensive Instrumental Telemetry Grid */}
          <div className="bg-[#111836]/50 border border-slate-800 rounded-lg p-5">
            <h3 className="font-space text-base font-semibold text-white mb-3">
              Standardized Telemetry Metric Index (J2000 Epoch)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono-tech">
              <div className="p-3 bg-[#060814] rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Mass</span>
                <div className="text-white font-semibold mt-1 truncate">{body.massKg}</div>
              </div>
              <div className="p-3 bg-[#060814] rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Radius</span>
                <div className="text-white font-semibold mt-1">{body.radiusKm.toLocaleString()} km</div>
              </div>
              <div className="p-3 bg-[#060814] rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Velocity</span>
                <div className="text-white font-semibold mt-1">{body.orbitalSpeedKmS} km/s</div>
              </div>
              <div className="p-3 bg-[#060814] rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Surface Temp</span>
                <div className="text-white font-semibold mt-1">{body.surfaceTempKelvin} K</div>
              </div>
              <div className="p-3 bg-[#060814] rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Right Ascension</span>
                <div className="text-white font-semibold mt-1">{body.rightAscension}</div>
              </div>
              <div className="p-3 bg-[#060814] rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Declination</span>
                <div className="text-white font-semibold mt-1">{body.declination}</div>
              </div>
              <div className="p-3 bg-[#060814] rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Orbit Period</span>
                <div className="text-white font-semibold mt-1">{body.orbitalPeriodDays} d</div>
              </div>
              <div className="p-3 bg-[#060814] rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Eccentricity</span>
                <div className="text-white font-semibold mt-1">{body.eccentricity}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Export Action */}
        <div className="p-4 border-t border-[#00f0ff]/20 bg-[#111836]/60 flex items-center justify-between">
          <div className="text-xs font-mono-tech text-slate-400">
            OBSERVATIONAL ARCHIVE · ASTRONOMICAL PRECISION V2.4
          </div>
          <div className="flex items-center gap-3">
            {downloadSuccess && (
              <span className="text-xs font-mono-tech text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Telemetry Exported Successfully</span>
              </span>
            )}
            <button
              onClick={handleExportData}
              className="neon-btn-primary px-4 py-2 text-xs font-semibold rounded flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Telemetry JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
