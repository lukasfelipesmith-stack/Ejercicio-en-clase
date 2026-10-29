import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { CelestialBody, SpectrumMode, CameraPreset } from '../types/astronomy';
import {
  createSunTexture,
  createEarthTexture,
  createEarthCloudTexture,
  createMarsTexture,
  createJupiterTexture,
  createSaturnRingTexture,
  createAccretionDiskTexture,
  createExoplanetTexture,
} from '../utils/proceduralTextures';

// Pre-allocated math objects to ensure zero GC in animation loop
const _vec3 = new THREE.Vector3();
const _targetPos = new THREE.Vector3();
const _camTarget = new THREE.Vector3();
const _screenPos = new THREE.Vector3();

interface CosmicCanvasProps {
  celestialBodies: CelestialBody[];
  selectedBody: CelestialBody;
  onSelectBody: (body: CelestialBody) => void;
  timeScale: number; // 0, 0.5, 1, 10, 100, 1000
  spectrumMode: SpectrumMode;
  cameraPreset: CameraPreset;
  layers: {
    orbits: boolean;
    gravityGrid: boolean;
    celestialGrid: boolean;
    labels: boolean;
    habitableZone: boolean;
  };
  onUpdateScreenCoords?: (coords: { x: number; y: number; visible: boolean } | null) => void;
}

export const CosmicCanvas: React.FC<CosmicCanvasProps> = ({
  celestialBodies,
  selectedBody,
  onSelectBody,
  timeScale,
  spectrumMode,
  cameraPreset,
  layers,
  onUpdateScreenCoords,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // State refs for animation loop
  const selectedBodyRef = useRef(selectedBody);
  selectedBodyRef.current = selectedBody;
  
  const timeScaleRef = useRef(timeScale);
  timeScaleRef.current = timeScale;

  const spectrumModeRef = useRef(spectrumMode);
  spectrumModeRef.current = spectrumMode;

  const cameraPresetRef = useRef(cameraPreset);
  cameraPresetRef.current = cameraPreset;

  const layersRef = useRef(layers);
  layersRef.current = layers;

  const onUpdateScreenCoordsRef = useRef(onUpdateScreenCoords);
  onUpdateScreenCoordsRef.current = onUpdateScreenCoords;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL guard
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 3. Scene & Camera setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060814);
    scene.fog = new THREE.FogExp2(0x060814, 0.0012);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      2000
    );
    camera.position.set(0, 38, 55);
    camera.lookAt(0, 0, 0);

    // 4. Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Lighting Rig
    const sunLight = new THREE.PointLight(0xfff5e6, 3.5, 800, 0.4);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const ambientFill = new THREE.HemisphereLight(0x00f0ff, 0x0b0e23, 0.65);
    scene.add(ambientFill);

    // 6. Deep Space Background Starfield
    const starCount = 4500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const colorCyan = new THREE.Color(0x00f0ff);
    const colorWhite = new THREE.Color(0xf8fafc);
    const colorGold = new THREE.Color(0xffd700);
    const colorPurple = new THREE.Color(0xb347ff);

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      const radius = 600 + Math.random() * 400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[idx] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[idx + 2] = radius * Math.cos(phi);

      const dice = Math.random();
      const chosenColor = dice > 0.8 ? colorCyan : dice > 0.6 ? colorGold : dice > 0.4 ? colorPurple : colorWhite;
      starColors[idx] = chosenColor.r;
      starColors[idx + 1] = chosenColor.g;
      starColors[idx + 2] = chosenColor.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const starField = new THREE.Points(starGeo, starMaterial);
    scene.add(starField);

    // 7. Space-Time Gravitational Curvature Grid
    const gridDim = 120;
    const gridRes = 60;
    const gridGeo = new THREE.PlaneGeometry(gridDim, gridDim, gridRes, gridRes);
    gridGeo.rotateX(-Math.PI / 2);

    // Warp gravity grid toward Sol in center and secondary gravitational wells
    const posAttr = gridGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const d = Math.sqrt(x * x + z * z);
      // General relativistic gravitational depression
      const yWarp = -5.0 / (1.0 + d * 0.18);
      posAttr.setY(i, yWarp - 0.2);
    }
    gridGeo.computeVertexNormals();

    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const gravityGridMesh = new THREE.Mesh(gridGeo, gridMaterial);
    scene.add(gravityGridMesh);

    // 8. Habitable Zone Ring (Circumstellar Habitable Zone)
    const hzGeo = new THREE.RingGeometry(12.5, 17.5, 64);
    hzGeo.rotateX(-Math.PI / 2);
    const hzMaterial = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
    });
    const hzMesh = new THREE.Mesh(hzGeo, hzMaterial);
    hzMesh.position.y = -0.15;
    scene.add(hzMesh);

    // 9. Celestial Grid (Equatorial / Ecliptic reference lines)
    const celestialGrid = new THREE.GridHelper(100, 20, 0x00f0ff, 0x191b28);
    celestialGrid.position.y = -0.05;
    (celestialGrid.material as THREE.Material).transparent = true;
    (celestialGrid.material as THREE.Material).opacity = 0.2;
    scene.add(celestialGrid);

    // 10. Generate Procedural Textures
    const sunTex = createSunTexture();
    const earthTex = createEarthTexture();
    const earthCloudsTex = createEarthCloudTexture();
    const marsTex = createMarsTexture();
    const jupiterTex = createJupiterTexture();
    const saturnRingTex = createSaturnRingTexture();
    const accretionTex = createAccretionDiskTexture();
    const exoplanetOceanTex = createExoplanetTexture('ocean');

    // 11. Celestial Body Meshes Map
    const bodyMeshMap = new Map<string, THREE.Group>();
    const orbitLinesGroup = new THREE.Group();
    scene.add(orbitLinesGroup);

    celestialBodies.forEach((body) => {
      const group = new THREE.Group();
      group.name = body.id;

      // Orbit Path Geometry
      if (body.orbitRadius > 0) {
        const orbitCurve = new THREE.EllipseCurve(
          0, 0,
          body.orbitRadius,
          body.orbitRadius * (1 - (body.eccentricity || 0) * 0.5),
          0, 2 * Math.PI,
          false,
          0
        );
        const points = orbitCurve.getPoints(120);
        const orbitGeo = new THREE.BufferGeometry().setFromPoints(
          points.map(p => new THREE.Vector3(p.x, 0, p.y))
        );
        const orbitMat = new THREE.LineBasicMaterial({
          color: body.id === 'earth' ? 0x00f0ff : 0x3b494b,
          transparent: true,
          opacity: body.id === 'earth' ? 0.45 : 0.22,
        });
        const orbitLine = new THREE.Line(orbitGeo, orbitMat);
        orbitLine.rotation.y = (body.inclinationDeg || 0) * (Math.PI / 180);
        orbitLinesGroup.add(orbitLine);
      }

      // Hero Body Mesh assembly
      if (body.textureType === 'sun') {
        const sphereGeo = new THREE.SphereGeometry(body.renderRadius, 48, 48);
        const sunMat = new THREE.MeshBasicMaterial({
          map: sunTex,
        });
        const sunMesh = new THREE.Mesh(sphereGeo, sunMat);
        group.add(sunMesh);

        // Corona glow envelope
        const coronaGeo = new THREE.SphereGeometry(body.renderRadius * 1.25, 32, 32);
        const coronaMat = new THREE.MeshBasicMaterial({
          color: 0xff8800,
          transparent: true,
          opacity: 0.25,
          side: THREE.BackSide,
        });
        const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
        group.add(coronaMesh);

      } else if (body.textureType === 'earth') {
        const sphereGeo = new THREE.SphereGeometry(body.renderRadius, 36, 36);
        const earthMat = new THREE.MeshStandardMaterial({
          map: earthTex,
          roughness: 0.65,
          metalness: 0.1,
        });
        const earthMesh = new THREE.Mesh(sphereGeo, earthMat);
        group.add(earthMesh);

        // Earth Clouds layer
        const cloudsGeo = new THREE.SphereGeometry(body.renderRadius * 1.025, 36, 36);
        const cloudsMat = new THREE.MeshStandardMaterial({
          map: earthCloudsTex,
          transparent: true,
          opacity: 0.6,
          roughness: 0.9,
        });
        const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
        cloudsMesh.name = 'clouds';
        group.add(cloudsMesh);

        // Thin blue atmospheric rim
        const atmoGeo = new THREE.SphereGeometry(body.renderRadius * 1.07, 32, 32);
        const atmoMat = new THREE.MeshBasicMaterial({
          color: 0x00f0ff,
          transparent: true,
          opacity: 0.16,
          side: THREE.BackSide,
        });
        group.add(new THREE.Mesh(atmoGeo, atmoMat));

      } else if (body.textureType === 'black_hole') {
        // Event Horizon (absorbing all light)
        const ehGeo = new THREE.SphereGeometry(body.renderRadius, 36, 36);
        const ehMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const ehMesh = new THREE.Mesh(ehGeo, ehMat);
        group.add(ehMesh);

        // Swirling Accretion Disk
        const accGeo = new THREE.RingGeometry(body.renderRadius * 1.2, body.renderRadius * 3.4, 64);
        accGeo.rotateX(Math.PI / 2.3);
        const accMat = new THREE.MeshBasicMaterial({
          map: accretionTex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
        });
        const accMesh = new THREE.Mesh(accGeo, accMat);
        accMesh.name = 'accretionDisk';
        group.add(accMesh);

        // Relativistic Photon Ring
        const ringGeo = new THREE.TorusGeometry(body.renderRadius * 1.5, 0.05, 16, 64);
        ringGeo.rotateX(Math.PI / 2.3);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        group.add(new THREE.Mesh(ringGeo, ringMat));

      } else if (body.textureType === 'ringed') {
        // Saturn body + rings
        const sphereGeo = new THREE.SphereGeometry(body.renderRadius, 36, 36);
        const saturnMat = new THREE.MeshStandardMaterial({
          map: jupiterTex,
          roughness: 0.7,
        });
        const saturnMesh = new THREE.Mesh(sphereGeo, saturnMat);
        group.add(saturnMesh);

        // Rings
        if (body.ringSystem) {
          const ringGeo = new THREE.RingGeometry(
            body.renderRadius * body.ringSystem.innerRadius,
            body.renderRadius * body.ringSystem.outerRadius,
            64
          );
          ringGeo.rotateX(Math.PI / 2.35);
          const ringMat = new THREE.MeshStandardMaterial({
            map: saturnRingTex,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.88,
            roughness: 0.5,
          });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          group.add(ringMesh);
        }

      } else if (body.textureType === 'spacecraft') {
        // Procedural Spacecraft assembly (JWST / Voyager 1)
        if (body.id === 'jwst') {
          // Beryllium Gold Mirror + Sunshield
          const craftGroup = new THREE.Group();
          // Hexagonal Gold Mirror Array
          const mirrorGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.04, 6);
          mirrorGeo.rotateX(Math.PI / 2);
          const mirrorMat = new THREE.MeshPhysicalMaterial({
            color: 0xffd700,
            metalness: 0.95,
            roughness: 0.1,
            clearcoat: 1.0,
          });
          craftGroup.add(new THREE.Mesh(mirrorGeo, mirrorMat));

          // 5-layer Sunshield
          const shieldGeo = new THREE.BoxGeometry(1.4, 0.02, 0.9);
          shieldGeo.rotateY(Math.PI / 4);
          const shieldMat = new THREE.MeshStandardMaterial({
            color: 0xdcb8ff,
            metalness: 0.8,
            roughness: 0.2,
          });
          const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
          shieldMesh.position.z = -0.25;
          craftGroup.add(shieldMesh);

          group.add(craftGroup);
        } else {
          // Voyager High Gain Dish Antenna + Boom
          const craftGroup = new THREE.Group();
          const dishGeo = new THREE.SphereGeometry(0.45, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.5);
          dishGeo.rotateX(Math.PI);
          const dishMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
          craftGroup.add(new THREE.Mesh(dishGeo, dishMat));

          const boomGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 8);
          boomGeo.rotateZ(Math.PI / 2.2);
          const boomMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });
          craftGroup.add(new THREE.Mesh(boomGeo, boomMat));

          group.add(craftGroup);
        }

      } else if (body.textureType === 'nebula') {
        // Volumetric particle cloud
        const nebCount = 400;
        const nebGeo = new THREE.BufferGeometry();
        const nebPos = new Float32Array(nebCount * 3);
        for (let n = 0; n < nebCount; n++) {
          const idx = n * 3;
          nebPos[idx] = (Math.random() - 0.5) * body.renderRadius * 2.5;
          nebPos[idx + 1] = (Math.random() - 0.5) * body.renderRadius * 1.5;
          nebPos[idx + 2] = (Math.random() - 0.5) * body.renderRadius * 2.5;
        }
        nebGeo.setAttribute('position', new THREE.BufferAttribute(nebPos, 3));
        const nebMat = new THREE.PointsMaterial({
          color: 0xb347ff,
          size: 2.5,
          transparent: true,
          opacity: 0.65,
        });
        group.add(new THREE.Points(nebGeo, nebMat));

      } else {
        // Standard Rocky or Gas Giant planets
        const sphereGeo = new THREE.SphereGeometry(body.renderRadius, 36, 36);
        const mat = new THREE.MeshStandardMaterial({
          map: body.id === 'mars' ? marsTex : body.id === 'jupiter' ? jupiterTex : exoplanetOceanTex,
          roughness: 0.7,
        });
        const planetMesh = new THREE.Mesh(sphereGeo, mat);
        group.add(planetMesh);
      }

      // Position along orbit initially
      const initialAngle = Math.random() * Math.PI * 2;
      group.position.set(
        Math.cos(initialAngle) * body.orbitRadius,
        0,
        Math.sin(initialAngle) * body.orbitRadius
      );

      // Target Raycasting proxy sphere
      const pickGeo = new THREE.SphereGeometry(Math.max(body.renderRadius * 1.5, 1.2), 12, 12);
      const pickMat = new THREE.MeshBasicMaterial({ visible: false });
      const pickMesh = new THREE.Mesh(pickGeo, pickMat);
      pickMesh.userData = { bodyId: body.id };
      group.add(pickMesh);

      scene.add(group);
      bodyMeshMap.set(body.id, group);
    });

    // 12. Mouse Raycaster for interactive selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (const hit of intersects) {
        if (hit.object.userData?.bodyId) {
          const found = celestialBodies.find(b => b.id === hit.object.userData.bodyId);
          if (found) {
            onSelectBody(found);
            break;
          }
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // 13. Smooth Orbit Controls & Camera Kinematics
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let cameraOrbitAngle = 0.8;
    let cameraElevation = 0.55;
    let cameraDistance = 42;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      cameraOrbitAngle -= dx * 0.006;
      cameraElevation = Math.max(0.08, Math.min(Math.PI / 2.05, cameraElevation + dy * 0.005));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraDistance = Math.max(4, Math.min(220, cameraDistance + e.deltaY * 0.05));
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('wheel', onWheel, { passive: false });

    // 14. Responsive Resize Listener
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 15. Render Loop with Smooth Exponential Damping
    let frameId = 0;
    let clock = new THREE.Clock();
    let simulationTime = 0;

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const activeTimeScale = timeScaleRef.current;
      // Gentle, realistic cosmic simulation pacing
      simulationTime += delta * activeTimeScale * 0.4;

      // Update positions along Keplerian orbits
      celestialBodies.forEach((body) => {
        const group = bodyMeshMap.get(body.id);
        if (!group) return;

        // Axial spin rotation (graceful, slow cosmic rotation)
        group.rotation.y += delta * 0.05;
        const cloudsMesh = group.getObjectByName('clouds');
        if (cloudsMesh) {
          cloudsMesh.rotation.y += delta * 0.012;
        }

        const disk = group.getObjectByName('accretionDisk');
        if (disk) {
          disk.rotation.z += delta * 0.25;
        }

        // Orbital displacement (slowed down so planets cruise gracefully)
        if (body.orbitRadius > 0 && body.orbitalPeriodDays > 0) {
          const meanMotion = (2 * Math.PI) / (body.orbitalPeriodDays * 0.6);
          const currentAngle = simulationTime * meanMotion;

          group.position.x = Math.cos(currentAngle) * body.orbitRadius;
          group.position.z = Math.sin(currentAngle) * body.orbitRadius;
        }
      });

      // Update Layer Visibilities
      const currLayers = layersRef.current;
      orbitLinesGroup.visible = currLayers.orbits;
      gravityGridMesh.visible = currLayers.gravityGrid;
      celestialGrid.visible = currLayers.celestialGrid;
      hzMesh.visible = currLayers.habitableZone;

      // Spectrum Mode Shader / Color Tone adjustments
      const currSpectrum = spectrumModeRef.current;
      if (currSpectrum === 'infrared') {
        renderer.toneMappingExposure = 1.45;
        starMaterial.color.setHex(0xff7700);
      } else if (currSpectrum === 'xray') {
        renderer.toneMappingExposure = 1.6;
        starMaterial.color.setHex(0x00f0ff);
      } else if (currSpectrum === 'radio') {
        renderer.toneMappingExposure = 0.95;
        starMaterial.color.setHex(0xb347ff);
      } else {
        renderer.toneMappingExposure = 1.15;
        starMaterial.color.setHex(0xffffff);
      }

      // Camera Tracking & Smooth Exponential Damping
      const currentSelected = selectedBodyRef.current;
      const targetGroup = bodyMeshMap.get(currentSelected.id);

      if (targetGroup) {
        targetGroup.getWorldPosition(_targetPos);
      } else {
        _targetPos.set(0, 0, 0);
      }

      // Smooth look-at center damping
      _camTarget.x = THREE.MathUtils.damp(_camTarget.x, _targetPos.x, 4.5, delta);
      _camTarget.y = THREE.MathUtils.damp(_camTarget.y, _targetPos.y, 4.5, delta);
      _camTarget.z = THREE.MathUtils.damp(_camTarget.z, _targetPos.z, 4.5, delta);

      // Camera preset positioning
      const preset = cameraPresetRef.current;
      let desiredCamOffset = _vec3;

      if (preset === 'zenith') {
        // Top-down polar view
        desiredCamOffset.set(0, cameraDistance * 1.2, 0.01);
      } else if (preset === 'surface') {
        // Tight close-up inspection
        const closeDist = Math.max(currentSelected.renderRadius * 2.8, 4.0);
        desiredCamOffset.set(
          Math.cos(cameraOrbitAngle) * closeDist,
          Math.sin(cameraElevation) * closeDist,
          Math.sin(cameraOrbitAngle) * closeDist
        );
      } else {
        // Orbital & Free fly standard spherical orbital camera
        desiredCamOffset.set(
          Math.cos(cameraOrbitAngle) * Math.cos(cameraElevation) * cameraDistance,
          Math.sin(cameraElevation) * cameraDistance,
          Math.sin(cameraOrbitAngle) * Math.cos(cameraElevation) * cameraDistance
        );
      }

      const desiredCamPos = _targetPos.clone().add(desiredCamOffset);
      camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredCamPos.x, 4.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredCamPos.y, 4.5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredCamPos.z, 4.5, delta);

      camera.lookAt(_camTarget);

      // Compute 2D Screen projection coordinates for Crosshair Reticle HUD
      if (targetGroup && onUpdateScreenCoordsRef.current) {
        _screenPos.copy(_targetPos).project(camera);
        const halfWidth = container.clientWidth / 2;
        const halfHeight = container.clientHeight / 2;
        const screenX = _screenPos.x * halfWidth + halfWidth;
        const screenY = -_screenPos.y * halfHeight + halfHeight;
        const isFacing = _screenPos.z < 1.0;

        onUpdateScreenCoordsRef.current({
          x: screenX,
          y: screenY,
          visible: isFacing && screenX >= 0 && screenX <= container.clientWidth && screenY >= 0 && screenY <= container.clientHeight,
        });
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      domEl.removeEventListener('pointerdown', handlePointerDown);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);

      // Clean resource disposal
      renderer.dispose();
      sunTex.dispose();
      earthTex.dispose();
      earthCloudsTex.dispose();
      marsTex.dispose();
      jupiterTex.dispose();
      saturnRingTex.dispose();
      accretionTex.dispose();
      exoplanetOceanTex.dispose();
      starGeo.dispose();
      starMaterial.dispose();
      gridGeo.dispose();
      gridMaterial.dispose();
      hzGeo.dispose();
      hzMaterial.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [celestialBodies, onSelectBody]);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 w-full h-full cursor-crosshair overflow-hidden select-none"
    />
  );
};
