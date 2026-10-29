import * as THREE from 'three';

/**
 * Creates procedural Canvas textures for Three.js without any external image downloads.
 * Guaranteed zero-404, responsive, and tailored to aerospace/astronomy visualization.
 */

// Helper to set standard texture properties
function finalizeTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createSunTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base solar plasma gradient
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#ffcc00');
  grad.addColorStop(0.5, '#ff8800');
  grad.addColorStop(1, '#ff3300');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Solar granules & magnetic turbulence
  for (let i = 0; i < 2400; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 8 + 2;
    const alpha = Math.random() * 0.4 + 0.1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = Math.random() > 0.4 ? `rgba(255, 255, 180, ${alpha})` : `rgba(200, 40, 0, ${alpha * 0.8})`;
    ctx.fill();
  }

  // Sunspots
  for (let s = 0; s < 12; s++) {
    const sx = (Math.random() * 0.8 + 0.1) * canvas.width;
    const sy = (Math.random() * 0.4 + 0.3) * canvas.height;
    const sRadius = Math.random() * 14 + 6;

    // Penumbra
    ctx.beginPath();
    ctx.arc(sx, sy, sRadius * 1.8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(120, 20, 0, 0.6)';
    ctx.fill();

    // Umbra
    ctx.beginPath();
    ctx.arc(sx, sy, sRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(20, 0, 0, 0.9)';
    ctx.fill();
  }

  return finalizeTexture(canvas);
}

export function createEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep Ocean
  ctx.fillStyle = '#071833';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Shallow continental shelf waters
  ctx.fillStyle = '#0e3a63';
  for (let i = 0; i < 60; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * (canvas.height * 0.8) + (canvas.height * 0.1);
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.random() * 60 + 30, Math.random() * 40 + 20, Math.random(), 0, Math.PI * 2);
    ctx.fill();
  }

  // Continents (approximate procedural landmasses)
  ctx.fillStyle = '#1c4a27'; // Lush land
  const landmasses = [
    { x: 250, y: 180, rx: 110, ry: 70 }, // North America
    { x: 330, y: 340, rx: 70, ry: 100 }, // South America
    { x: 520, y: 170, rx: 80, ry: 60 },  // Europe
    { x: 540, y: 280, rx: 90, ry: 90 },  // Africa
    { x: 700, y: 190, rx: 140, ry: 80 }, // Asia
    { x: 790, y: 350, rx: 65, ry: 45 },  // Australia
  ];

  landmasses.forEach((l) => {
    ctx.beginPath();
    ctx.ellipse(l.x, l.y, l.rx, l.ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Arid desert interiors
    ctx.fillStyle = '#6b5832';
    ctx.beginPath();
    ctx.ellipse(l.x + 10, l.y + 10, l.rx * 0.5, l.ry * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1c4a27';
  });

  // Coastal fractal roughness
  for (let j = 0; j < 800; j++) {
    const lx = Math.random() * canvas.width;
    const ly = Math.random() * canvas.height * 0.7 + canvas.height * 0.15;
    ctx.beginPath();
    ctx.arc(lx, ly, Math.random() * 12 + 2, 0, Math.PI * 2);
    ctx.fillStyle = Math.random() > 0.5 ? '#1a4224' : '#0e331e';
    ctx.fill();
  }

  // Polar ice caps
  ctx.fillStyle = '#eef6fc';
  ctx.fillRect(0, 0, canvas.width, 35); // North pole
  ctx.fillRect(0, canvas.height - 45, canvas.width, 45); // Antarctica

  // Jagged polar fringe
  for (let k = 0; k < canvas.width; k += 10) {
    ctx.beginPath();
    ctx.arc(k, 35 + Math.sin(k * 0.05) * 8, 8, 0, Math.PI * 2);
    ctx.arc(k, canvas.height - 45 - Math.cos(k * 0.05) * 10, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  return finalizeTexture(canvas);
}

export function createEarthCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Swirling weather cyclonic cloud systems
  for (let i = 0; i < 450; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const w = Math.random() * 90 + 30;
    const h = Math.random() * 25 + 8;
    const angle = Math.random() * 0.6 - 0.3;
    const alpha = Math.random() * 0.5 + 0.15;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  return finalizeTexture(canvas);
}

export function createMarsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Martian iron oxide red
  ctx.fillStyle = '#b34728';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Darker basaltic maria
  ctx.fillStyle = '#6e2b17';
  for (let i = 0; i < 35; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.7 + canvas.height * 0.15;
    ctx.beginPath();
    ctx.ellipse(x, y, Math.random() * 120 + 30, Math.random() * 70 + 20, Math.random(), 0, Math.PI * 2);
    ctx.fill();
  }

  // Craters & canyon chasms (e.g. Valles Marineris)
  ctx.strokeStyle = '#42160a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(300, 260);
  ctx.bezierCurveTo(450, 270, 550, 250, 700, 280);
  ctx.stroke();

  // White polar dry-ice caps
  ctx.fillStyle = '#f5f0eb';
  ctx.fillRect(0, 0, canvas.width, 22);
  ctx.fillRect(0, canvas.height - 25, canvas.width, 25);

  return finalizeTexture(canvas);
}

export function createJupiterTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Atmospheric zonal jet-stream bands
  const bandColors = [
    '#e3c396', '#be895b', '#e8d2b0', '#8b532e',
    '#d6b38c', '#aa6b42', '#edd9bf', '#a05c31',
    '#dec09e', '#965026', '#e0cbb2', '#b3784c',
  ];

  const bandHeight = canvas.height / bandColors.length;
  bandColors.forEach((color, idx) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, idx * bandHeight, canvas.width, bandHeight);
  });

  // Atmospheric turbulence & eddy waves
  for (let y = 0; y < canvas.height; y += 12) {
    ctx.strokeStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.22)' : 'rgba(80,30,10,0.25)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x < canvas.width; x += 20) {
      const dy = Math.sin(x * 0.03 + y) * 6;
      ctx.lineTo(x, y + dy);
    }
    ctx.stroke();
  }

  // Great Red Spot (persistent anticyclonic storm)
  const grsX = 620;
  const grsY = 320;
  ctx.fillStyle = '#b83b1d';
  ctx.beginPath();
  ctx.ellipse(grsX, grsY, 55, 32, -0.05, 0, Math.PI * 2);
  ctx.fill();

  // Red Spot inner core
  ctx.fillStyle = '#d94b26';
  ctx.beginPath();
  ctx.ellipse(grsX, grsY, 32, 18, -0.05, 0, Math.PI * 2);
  ctx.fill();

  return finalizeTexture(canvas);
}

export function createSaturnRingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Radial ring density with Cassini division
  for (let x = 0; x < canvas.width; x++) {
    const norm = x / canvas.width;
    let alpha = 0.85;

    // Cassini Division gap between 0.68 and 0.73
    if (norm > 0.68 && norm < 0.73) {
      alpha = 0.04;
    } else if (norm < 0.15) {
      alpha = 0.2; // C ring
    } else if (norm > 0.9) {
      alpha = 0.3; // F ring outer edge
    }

    const grain = Math.sin(x * 1.5) * 0.15;
    const r = Math.floor(210 + grain * 20);
    const g = Math.floor(190 + grain * 20);
    const b = Math.floor(160 + grain * 20);

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha + grain))})`;
    ctx.fillRect(x, 0, 1, canvas.height);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createExoplanetTexture(type: 'rocky' | 'ocean' | 'lava' | 'ice'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  if (type === 'ocean') {
    // TRAPPIST-1e style temperate ocean world
    ctx.fillStyle = '#062947';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#115b74';
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 80 + 20, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'lava') {
    // Super-Earth magma world
    ctx.fillStyle = '#1c1719';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 60; i++) {
      ctx.strokeStyle = Math.random() > 0.5 ? '#ff3300' : '#ff9900';
      ctx.lineWidth = Math.random() * 6 + 2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
  } else {
    // General rocky exoplanet
    ctx.fillStyle = '#2c3340';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#1a202c' : '#4a5568';
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 20 + 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return finalizeTexture(canvas);
}

export function createAccretionDiskTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Swirling plasma disk
  const radius = canvas.width * 0.48;
  const innerRadius = canvas.width * 0.18;

  for (let r = innerRadius; r < radius; r += 2) {
    const fraction = (r - innerRadius) / (radius - innerRadius);
    const alpha = Math.sin(fraction * Math.PI) * 0.85;

    // Temperature gradient: ultra-hot white-blue near event horizon to red-orange on outer edge
    const rCol = Math.floor(255);
    const gCol = Math.floor(200 - fraction * 140);
    const bCol = Math.floor(100 - fraction * 90);

    ctx.strokeStyle = `rgba(${rCol}, ${gCol}, ${bCol}, ${alpha})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  return finalizeTexture(canvas);
}
