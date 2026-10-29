export type CelestialCategory = 
  | 'all'
  | 'solar-system'
  | 'exoplanets'
  | 'deep-space'
  | 'black-holes'
  | 'spacecraft';

export type SpectrumMode = 'optical' | 'infrared' | 'xray' | 'radio';

export type CameraPreset = 'zenith' | 'orbital' | 'surface' | 'free';

export interface SpectralLine {
  element: string;
  wavelength: number; // in nanometers
  absorptionDepth: number; // 0 to 1
  description: string;
}

export interface AtmosphericGas {
  name: string;
  formula: string;
  percentage: number;
  color: string;
}

export interface CelestialBody {
  id: string;
  catalogCode: string;
  name: string;
  designation: string;
  category: CelestialCategory;
  subtitle: string;
  description: string;
  scientificDossier: string;
  
  // Orbital & Physical Telemetry
  semiMajorAxisAU: number; // in AU (or relative orbit distance)
  orbitalPeriodDays: number; // in Earth days
  orbitalSpeedKmS: number; // km/s
  eccentricity: number;
  inclinationDeg: number;
  massKg: string; // scientific notation string
  massEarthRel: number;
  radiusKm: number;
  radiusEarthRel: number;
  surfaceGravityG: number;
  surfaceTempKelvin: number;
  surfacePressureBar?: number;
  
  // Coordinates (J2000 epoch)
  rightAscension: string; // e.g. "17h 45m 40.04s"
  declination: string; // e.g. "-29° 00' 28.1""
  constellation: string;
  distanceLightYears?: number;
  distanceAU?: number;
  
  // Visual & Rendering
  renderRadius: number; // Three.js units
  orbitRadius: number; // Three.js units
  color: string;
  glowColor: string;
  textureType: 'sun' | 'earth' | 'rocky' | 'gas_giant' | 'ringed' | 'ice_giant' | 'black_hole' | 'nebula' | 'spacecraft';
  ringSystem?: {
    innerRadius: number;
    outerRadius: number;
    color: string;
  };
  
  // Spectroscopy & Atmosphere
  atmosphere: AtmosphericGas[];
  spectralClass?: string;
  habitabilityIndex?: number; // 0.00 to 1.00
  transitData?: {
    transitDepthPercent: number; // e.g. 1.45%
    transitDurationHours: number; // e.g. 2.8 hours
    hostStarName: string;
    hostStarRadiusSolar: number;
  };
  
  // Discoveries & Missions
  discoveryYear?: number;
  discoveredBy?: string;
  notableMissions?: string[];
  keyFacts: string[];
}
