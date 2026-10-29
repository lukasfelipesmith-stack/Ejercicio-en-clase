import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { CelestialBody, CelestialCategory } from '../types/astronomy';
import { playTargetAcquisitionSound, playHudClickSound } from '../utils/spaceAudio';

interface CelestialCatalogProps {
  celestialBodies: CelestialBody[];
  selectedBody: CelestialBody;
  onSelectBody: (body: CelestialBody) => void;
  activeCategory: CelestialCategory;
  onSelectCategory: (cat: CelestialCategory) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const CelestialCatalog: React.FC<CelestialCatalogProps> = ({
  celestialBodies,
  selectedBody,
  onSelectBody,
  activeCategory,
  onSelectCategory,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBodies = useMemo(() => {
    return celestialBodies.filter((body) => {
      const matchesCategory =
        activeCategory === 'all' || body.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        body.name.toLowerCase().includes(q) ||
        body.catalogCode.toLowerCase().includes(q) ||
        body.constellation.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [celestialBodies, activeCategory, searchQuery]);

  return (
    <aside
      className={`relative z-20 flex flex-col h-full bg-[#0b0e23]/92 border-r border-[#00f0ff]/15 backdrop-blur-md transition-all duration-300 ease-in-out shrink-0 ${
        isCollapsed ? 'w-14' : 'w-80 md:w-96'
      }`}
    >
      {/* Collapse/Expand Rail Toggle */}
      <button
        onClick={() => {
          playHudClickSound();
          onToggleCollapse();
        }}
        title={isCollapsed ? 'Expand Celestial Catalog' : 'Collapse Catalog Rail'}
        className="absolute -right-3.5 top-6 z-30 w-7 h-7 rounded-full bg-[#0b0e23] border border-[#00f0ff]/40 text-[#00f0ff] flex items-center justify-center hover:bg-[#111836] shadow-[0_0_10px_rgba(0,240,255,0.25)] transition-all"
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* When Collapsed: Vertical Icon Rail */}
      {isCollapsed ? (
        <div className="flex flex-col items-center py-6 gap-6 h-full">
          <div className="text-[#00f0ff] p-2 rounded hover:bg-[#111836] cursor-pointer" onClick={onToggleCollapse}>
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div className="h-[1px] w-8 bg-[#00f0ff]/20" />
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto items-center px-1">
            {celestialBodies.slice(0, 10).map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  playTargetAcquisitionSound();
                  onSelectBody(b);
                }}
                title={`${b.name} (${b.catalogCode})`}
                className={`w-8 h-8 rounded text-[10px] font-mono-tech flex items-center justify-center transition-all ${
                  selectedBody.id === b.id
                    ? 'border border-[#00f0ff] bg-[#00f0ff]/20 text-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent hover:border-slate-700'
                }`}
              >
                {b.catalogCode.split('-')[1]?.substring(0, 3) || b.name.substring(0, 2)}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Expanded Full Directory Panel */
        <div className="flex flex-col h-full p-4 overflow-hidden">
          {/* Header */}
          <div className="mb-3">
            <div className="text-[11px] font-mono-tech tracking-wider uppercase text-slate-400 mb-1">
              OBSERVATORY DIRECTORY
            </div>
            <h2 className="font-space text-lg font-bold text-white">
              Celestial Catalog
            </h2>
          </div>

          {/* Search Bar matching design specification */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00f0ff]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by catalog code, name, constellation..."
              className="w-full bg-[rgba(11,14,35,0.6)] border border-[rgba(248,250,252,0.14)] focus:border-[#00f0ff] focus:outline-none focus:shadow-[0_0_16px_rgba(0,240,255,0.25)] rounded text-xs text-slate-100 placeholder-[#64748b] pl-9 pr-3 py-2 transition-all font-inter"
            />
          </div>

          {/* Category Filter Tabs (Interactive buttons) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none text-xs">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'solar-system', label: 'Sol' },
                { id: 'exoplanets', label: 'Exoplanets' },
                { id: 'deep-space', label: 'Deep Space' },
                { id: 'black-holes', label: 'Black Holes' },
                { id: 'spacecraft', label: 'Fleet' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  playHudClickSound();
                  onSelectCategory(cat.id);
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#00f0ff]/15 border border-[#00f0ff] text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                    : 'bg-[#111836]/60 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Catalog Count Indicator */}
          <div className="text-[11px] font-mono-tech text-slate-400 mb-2 flex items-center justify-between">
            <span>ENTRIES ({filteredBodies.length})</span>
            <span className="text-[#00f0ff]">{activeCategory.toUpperCase()}</span>
          </div>

          {/* Celestial Cards Scroll Container */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {filteredBodies.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No astronomical objects found matching query.
              </div>
            ) : (
              filteredBodies.map((body) => {
                const isSelected = selectedBody.id === body.id;
                return (
                  <div
                    key={body.id}
                    onClick={() => {
                      playTargetAcquisitionSound();
                      onSelectBody(body);
                    }}
                    className={`cursor-pointer rounded-lg p-3 transition-all relative overflow-hidden group ${
                      isSelected
                        ? 'bg-[#111836]/90 border border-[#00f0ff] shadow-[0_8px_32px_-4px_rgba(0,240,255,0.18),inset_0_1px_0_rgba(255,255,255,0.2)]'
                        : 'bg-[#111836]/40 border border-[#00f0ff]/15 hover:border-[#00f0ff]/50 hover:bg-[#111836]/70'
                    }`}
                  >
                    {/* Top edge light */}
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/40 to-transparent opacity-60" />

                    {/* Card Header: Catalog Code & Category */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono-tech text-[11px] font-semibold tracking-wider text-[#00f0ff]">
                        {body.catalogCode}
                      </span>
                      <span className="text-[10px] font-mono-tech text-slate-400 uppercase">
                        {body.category.replace('-', ' ')}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="font-space text-sm font-semibold text-white group-hover:text-[#00f0ff] transition-colors leading-tight mb-1">
                      {body.name}
                    </h3>

                    {/* Clean Unboxed Metadata */}
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-2.5">
                      <span className="truncate">{body.constellation}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {body.distanceAU !== undefined ? `${body.distanceAU} AU` : `${body.distanceLightYears} LY`}
                      </span>
                    </div>

                    {/* Telemetry Parameters Grid (2 columns matching design spec) */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#00f0ff]/10 text-[11px] font-mono-tech">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase">VELOCITY</div>
                        <div className="text-slate-200 tabular-nums">
                          {body.orbitalSpeedKmS} <span className="text-[9px] text-slate-400">km/s</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase">TEMP</div>
                        <div className="text-slate-200 tabular-nums">
                          {body.surfaceTempKelvin} <span className="text-[9px] text-slate-400">K</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
