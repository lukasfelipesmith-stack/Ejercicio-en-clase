import React, { useState } from 'react';
import { CELESTIAL_BODIES } from './data/celestialBodies';
import { CelestialBody, CelestialCategory, SpectrumMode, CameraPreset } from './types/astronomy';
import { CosmicCanvas } from './components/CosmicCanvas';
import { TopBar } from './components/TopBar';
import { CelestialCatalog } from './components/CelestialCatalog';
import { TelemetryPanel } from './components/TelemetryPanel';
import { ObservatoryDock } from './components/ObservatoryDock';
import { DynamicReticle } from './components/DynamicReticle';
import { TransitSpectroscopyModal } from './components/TransitSpectroscopyModal';
import { ScaleComparisonModal } from './components/ScaleComparisonModal';
import { DossierModal } from './components/DossierModal';
import { MissionControlDashboard } from './components/MissionControlDashboard';

export default function App() {
  // Navigation view: 'dashboard' is shown first, before launching the 3D simulator!
  const [currentView, setCurrentView] = useState<'dashboard' | 'simulator'>('dashboard');

  const [selectedBody, setSelectedBody] = useState<CelestialBody>(
    () => CELESTIAL_BODIES.find((b) => b.id === 'earth') || CELESTIAL_BODIES[0]
  );
  const [activeCategory, setActiveCategory] = useState<CelestialCategory>('solar-system');
  const [timeScale, setTimeScale] = useState<number>(1);
  const [spectrumMode, setSpectrumMode] = useState<SpectrumMode>('optical');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('free');

  // Visual layer toggles
  const [layers, setLayers] = useState({
    orbits: true,
    gravityGrid: true,
    celestialGrid: false,
    labels: true,
    habitableZone: true,
  });

  // Screen coordinates of selected 3D body for dynamic HUD reticle
  const [screenCoords, setScreenCoords] = useState<{ x: number; y: number; visible: boolean } | null>(null);

  // HUD collapsible rails
  const [isLeftRailCollapsed, setIsLeftRailCollapsed] = useState(false);
  const [isRightRailCollapsed, setIsRightRailCollapsed] = useState(false);
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);

  // Modals
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isSpectroscopyOpen, setIsSpectroscopyOpen] = useState(false);
  const [isScaleModalOpen, setIsScaleModalOpen] = useState(false);

  const handleLaunchSimulator = (targetBodyId?: string) => {
    if (targetBodyId) {
      const found = CELESTIAL_BODIES.find((b) => b.id === targetBodyId);
      if (found) setSelectedBody(found);
    }
    setCurrentView('simulator');
  };

  const handleToggleLayer = (layerKey: keyof typeof layers) => {
    setLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  };

  const handleCategorySelect = (category: CelestialCategory) => {
    setActiveCategory(category);
    // Auto-focus first body in selected category
    const firstMatch = CELESTIAL_BODIES.find(
      (b) => category === 'all' || b.category === category
    );
    if (firstMatch) {
      setSelectedBody(firstMatch);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-[#060814] text-[#f8fafc] font-inter select-none">
      {currentView === 'dashboard' ? (
        <MissionControlDashboard
          onLaunchSimulator={handleLaunchSimulator}
          onOpenDossier={() => setIsDossierOpen(true)}
          onOpenSpectroscopy={() => setIsSpectroscopyOpen(true)}
        />
      ) : (
        <>
          {/* 1. Header (Strict Top Bar Contract) */}
          <TopBar
            currentCategory={activeCategory}
            onSelectCategory={handleCategorySelect}
            onOpenDossier={() => setIsDossierOpen(true)}
            onOpenSpectroscopy={() => setIsSpectroscopyOpen(true)}
            onOpenScaleModal={() => setIsScaleModalOpen(true)}
            onReturnToDashboard={() => setCurrentView('dashboard')}
          />

          {/* 2. Main Observational Stage Layout */}
          <main className="relative flex-1 flex w-full h-full overflow-hidden">
            {/* Left Navigation & Celestial Catalog Rail */}
            <CelestialCatalog
              celestialBodies={CELESTIAL_BODIES}
              selectedBody={selectedBody}
              onSelectBody={setSelectedBody}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              isCollapsed={isLeftRailCollapsed}
              onToggleCollapse={() => setIsLeftRailCollapsed(!isLeftRailCollapsed)}
            />

            {/* Central 3D Interactive Viewport */}
            <div className="relative flex-1 h-full overflow-hidden">
              {/* Three.js 3D WebGL Canvas */}
              <CosmicCanvas
                celestialBodies={CELESTIAL_BODIES}
                selectedBody={selectedBody}
                onSelectBody={setSelectedBody}
                timeScale={timeScale}
                spectrumMode={spectrumMode}
                cameraPreset={cameraPreset}
                layers={layers}
                onUpdateScreenCoords={setScreenCoords}
              />

              {/* Dynamic HUD Reticle Tracking the Selected Body */}
              <DynamicReticle
                coords={screenCoords}
                selectedBody={selectedBody}
              />

              {/* Spectrum HUD Watermark */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none font-mono-tech text-[11px] text-[#00f0ff]/60 tracking-wider">
                FILTER: {spectrumMode.toUpperCase()} BAND · SPEED: {timeScale}x
              </div>

              {/* Collapsible Ergonomic Bottom HUD Dock */}
              <ObservatoryDock
                timeScale={timeScale}
                onSetTimeScale={setTimeScale}
                spectrumMode={spectrumMode}
                onSetSpectrumMode={setSpectrumMode}
                cameraPreset={cameraPreset}
                onSetCameraPreset={setCameraPreset}
                layers={layers}
                onToggleLayer={handleToggleLayer}
                isCollapsed={isDockCollapsed}
                onToggleCollapsed={() => setIsDockCollapsed(!isDockCollapsed)}
              />
            </div>

            {/* Right Collapsible Contextual Telemetry HUD Panel */}
            <TelemetryPanel
              body={selectedBody}
              isCollapsed={isRightRailCollapsed}
              onToggleCollapse={() => setIsRightRailCollapsed(!isRightRailCollapsed)}
              onOpenSpectroscopy={() => setIsSpectroscopyOpen(true)}
              onOpenScaleModal={() => setIsScaleModalOpen(true)}
              onOpenDossier={() => setIsDossierOpen(true)}
            />
          </main>
        </>
      )}

      {/* 3. Scientific Interactive Modals */}
      {isSpectroscopyOpen && (
        <TransitSpectroscopyModal
          body={selectedBody}
          onClose={() => setIsSpectroscopyOpen(false)}
        />
      )}

      {isScaleModalOpen && (
        <ScaleComparisonModal
          onClose={() => setIsScaleModalOpen(false)}
        />
      )}

      {isDossierOpen && (
        <DossierModal
          body={selectedBody}
          onClose={() => setIsDossierOpen(false)}
        />
      )}
    </div>
  );
}
