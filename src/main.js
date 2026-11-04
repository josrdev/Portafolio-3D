import 'aframe';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import soundtrackUrl from '../diamond_tunes-cinematic-sound-effect-327618.mp3?url';
import panelOpenSoundUrl from '../47313572-ui-sounds-pack-2-sound-5-358890.mp3?url';
import experienceAmbienceUrl from '../ambiente.mp3?url';
import './style.css';

// A-Frame gestiona el bucle de renderització; aquesta funció s'assigna quan es carreguen els recursos.
let updatePortfolioFrame = null;
window.AFRAME.registerComponent('portfolio-runtime', {
  tick(time, delta) {
    updateMusicVisuals(time / 1000, Math.min(delta / 1000, 0.05));
    updatePortfolioFrame?.(time, delta);
  },
});

// Contingut editable del portafolis i coordenades de les estacions interactives.
const sections = [
  {
    id: 'sobre-mi',
    number: '01',
    title: 'Sobre mí',
    location: 'Punto de partida',
    description: 'Una presentación breve.',
    position: new THREE.Vector3(-2.9, 0, 3.2),
    content: '<p>Soy Joseph, estudiante de Desarrollo de Aplicaciones Multiplataforma. Me apasiona crear herramientas útiles y bien cuidadas para el día a día, enfocándome siempre en mejorar la experiencia de usuario y la calidad de cada proyecto.</p>',
  },
  {
    id: 'github',
    number: '02',
    title: 'GitHub',
    location: 'Repositorio de código',
    description: 'Explora mis proyectos y código.',
    position: new THREE.Vector3(3.2, 0, 2.4),
    content: '<p>Encuentra mis repositorios, proyectos y experimentos de código.</p><p><a href="https://github.com/josrdev" target="_blank" rel="noopener noreferrer">Visitar GitHub de Joseph ↗</a></p>',
  },
  {
    id: 'trabajos-web',
    number: '03',
    title: 'Proyectos',
    location: 'Proyectos',
    description: 'Sitios y experiencias para la web.',
    position: new THREE.Vector3(4.7, 0, -1.5),
    content: `<p>Una selección de proyectos web del ciclo DAM. Explora cada uno.</p>
      <ul class="panel-list project-grid">
        <li><a href="https://josephfuentesv.netlify.app/ejerciciotienda/" target="_blank" rel="noopener noreferrer"><span class="project-card-meta"><span>01 / WEB</span><span class="project-card-arrow" aria-hidden="true">↗</span></span><strong>My Store</strong><small>Tienda online</small></a></li>
        <li><a href="https://josephfuentesv.netlify.app/ejerciciomusicbox/" target="_blank" rel="noopener noreferrer"><span class="project-card-meta"><span>02 / WEB</span><span class="project-card-arrow" aria-hidden="true">↗</span></span><strong>Music Box</strong><small>Experiencia musical</small></a></li>
        <li><a href="https://josephfuentesv.netlify.app/ejerciciopinturas/" target="_blank" rel="noopener noreferrer"><span class="project-card-meta"><span>03 / WEB</span><span class="project-card-arrow" aria-hidden="true">↗</span></span><strong>Great Painters</strong><small>Galería de pintura</small></a></li>
        <li><a href="https://josephfuentesv.netlify.app/ejercicioparqueambiental/" target="_blank" rel="noopener noreferrer"><span class="project-card-meta"><span>04 / WEB</span><span class="project-card-arrow" aria-hidden="true">↗</span></span><strong>Parc Ambiental</strong><small>Proyecto ambiental</small></a></li>
        <li><a href="https://josephfuentesv.netlify.app/ejerciciowhacamole/" target="_blank" rel="noopener noreferrer"><span class="project-card-meta"><span>05 / WEB</span><span class="project-card-arrow" aria-hidden="true">↗</span></span><strong>Whac a Mole</strong><small>Juego interactivo</small></a></li>
        <li><a href="https://josephfuentesv.netlify.app/ejerciciopokeapi/" target="_blank" rel="noopener noreferrer"><span class="project-card-meta"><span>06 / WEB</span><span class="project-card-arrow" aria-hidden="true">↗</span></span><strong>PokeApi</strong><small>Explorador Pokémon</small></a></li>
      </ul>`,
  },
  {
    id: 'otros-proyectos',
    number: '04',
    title: 'Contáctame',
    location: 'Redes y contacto',
    description: 'Conectemos y hablemos de proyectos.',
    position: new THREE.Vector3(-4.3, 0.4, -2.5),
    content: `<p>Conectemos por LinkedIn o correo electrónico.</p>
      <ul class="panel-list">
        <li><a href="https://www.linkedin.com/in/josrdev/" target="_blank" rel="noopener noreferrer">LinkedIn <small>Visitar perfil ↗</small></a></li>
        <li><a href="mailto:joseph28122@gmail.com">Gmail <small>joseph28122@gmail.com ↗</small></a></li>
      </ul>`,
  },
  {
    id: 'cv',
    number: '05',
    title: 'Currículum',
    location: 'Perfil profesional',
    description: 'Formación, experiencia y trayectoria.',
    position: new THREE.Vector3(0, 0, -3.4),
    content: `<div class="cv-actions">
        <a href="/CV_Joseph_Fuentes.pdf" target="_blank" rel="noopener noreferrer">Abrir en otra pestaña <span aria-hidden="true">↗</span></a>
        <a href="/CV_Joseph_Fuentes.pdf" download="CV_Joseph_Fuentes.pdf">Descargar PDF <span aria-hidden="true">↓</span></a>
      </div>`,
  },
];

const ui = {
  experience: document.querySelector('#experience'),
  scene: document.querySelector('#scene'),
  welcomeHud: document.querySelector('#welcome-hud'),
  loading: document.querySelector('#loading-screen'),
  loadingTitle: document.querySelector('#loading-title'),
  loadingDescription: document.querySelector('#loading-description'),
  loadingMessage: document.querySelector('#loading-message'),
  loadingPercent: document.querySelector('#loading-percent'),
  loadingProgress: document.querySelector('#loading-progress'),
  loadingProgressbar: document.querySelector('#loading-progressbar'),
  loadingVisualizer: document.querySelector('#loading-visualizer'),
  intro: document.querySelector('#intro'),
  introDescription: document.querySelector('.intro-description'),
  introStatus: document.querySelector('#experience-status'),
  enter: document.querySelector('#enter-button'),
  nav: document.querySelector('#section-nav'),
  location: document.querySelector('#location-card'),
  locationName: document.querySelector('#location-name'),
  locationDescription: document.querySelector('#location-description'),
  crosshair: document.querySelector('#crosshair'),
  interactionPrompt: document.querySelector('#interaction-prompt'),
  panel: document.querySelector('#content-panel'),
  panelClose: document.querySelector('#panel-close'),
  panelKicker: document.querySelector('#panel-kicker'),
  panelTitle: document.querySelector('#panel-title'),
  panelContent: document.querySelector('#panel-content'),
  panelFooterLabel: document.querySelector('#panel-footer-label'),
  panelIndex: document.querySelector('#panel-index'),
  toast: document.querySelector('#toast'),
  soundToggle: document.querySelector('#sound-toggle'),
  motionToggle: document.querySelector('#motion-toggle'),
  mobileControls: document.querySelector('#mobile-controls'),
  audioModal: document.querySelector('#audio-modal'),
  audioEnableButton: document.querySelector('#audio-enable-button'),
  audioSilentButton: document.querySelector('#audio-silent-button'),
  audioError: document.querySelector('#audio-modal-error'),
};
const loadingVisualizerContext = ui.loadingVisualizer.getContext('2d');
let loadingVisualizerSize = { width: 0, height: 0, pixelRatio: 0 };
const navItems = [...document.querySelectorAll('.nav-item')];
const movementButtons = [...document.querySelectorAll('[data-move]')];

const sceneElement = ui.scene;
const MODEL_ASSETS = {
  room: document.querySelector('#room-model-source')?.href,
  screen: document.querySelector('#screen-model-source')?.href,
  arm: document.querySelector('#arm-model-source')?.href,
};
if (Object.values(MODEL_ASSETS).some((src) => !src)) {
  throw new Error('Faltan las rutas de los modelos 3D declaradas en index.html.');
}
if (!sceneElement.hasLoaded) {
  await new Promise((resolve) => sceneElement.addEventListener('loaded', resolve, { once: true }));
}
sceneElement.setAttribute('xr-mode-ui', 'enabled: false');
sceneElement.setAttribute('portfolio-runtime', '');

const scene = sceneElement.object3D;
const camera = sceneElement.camera;
const renderer = sceneElement.renderer;
const cameraElement = sceneElement.querySelector('#portfolio-camera');
const playerRig = cameraElement?.object3D;
if (!camera || !renderer || !playerRig) {
  throw new Error('A-Frame no pudo inicializar la cámara o el renderizador.');
}
scene.background = new THREE.Color(0x03050a);
scene.fog = new THREE.FogExp2(0x03050a, 0.04);
camera.rotation.order = 'YXZ';
camera.near = 0.08;
camera.far = 100;
camera.updateProjectionMatrix();
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.82;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
const armOverlayScene = new THREE.Scene();
const armOverlayCamera = camera.clone();
armOverlayCamera.matrixAutoUpdate = false;
armOverlayScene.add(armOverlayCamera);
scene.onAfterRender = (activeRenderer, _renderedScene, activeCamera) => {
  armOverlayCamera.matrix.copy(activeCamera.matrixWorld);
  armOverlayCamera.projectionMatrix.copy(activeCamera.projectionMatrix);
  const shouldAutoClear = activeRenderer.autoClear;
  activeRenderer.autoClear = false;
  try {
    activeRenderer.clearDepth();
    activeRenderer.render(armOverlayScene, armOverlayCamera);
  } finally {
    activeRenderer.autoClear = shouldAutoClear;
  }
};
const armLight = new THREE.PointLight(0xe4f0ff, 32, 4, 1.5);
armLight.position.set(0, 0, 0);
armOverlayCamera.add(armLight);

const flashlight = new THREE.SpotLight(0xffedc2, 180, 22, 0.48, 0.55, 2);
let flashlightEnabled = true;
flashlight.position.set(0.48, -0.42, -1.65);
flashlight.castShadow = true;
flashlight.shadow.mapSize.set(1024, 1024);
flashlight.shadow.camera.near = 0.1;
flashlight.shadow.camera.far = 22;
flashlight.shadow.bias = -0.0001;
flashlight.shadow.normalBias = 0.025;
camera.add(flashlight);
flashlight.target.position.set(0.58, -1.1, -14);
camera.add(flashlight.target);

const ambient = new THREE.HemisphereLight(0xb9c9ff, 0x09070d, 0.035);
scene.add(ambient);
const keyLight = new THREE.PointLight(0xa982ff, 0.9, 7, 1.8);
keyLight.position.set(-1.5, 3.2, 0);
scene.add(keyLight);
const keyLightBaseColor = keyLight.color.clone();
const musicKeyTint = new THREE.Color(0x71dfff);
const accentLight = new THREE.PointLight(0x9be8ff, 0.7, 6, 1.8);
accentLight.position.set(4, 2.5, 4);
scene.add(accentLight);
const accentLightBaseColor = accentLight.color.clone();
const musicAccentTint = new THREE.Color(0xc6fa5f);
const fillLight = new THREE.PointLight(0xc6fa5f, 0.25, 4, 2);
fillLight.position.set(-4, 1.8, 5);
scene.add(fillLight);

const loader = new GLTFLoader();
let roomMixer = null;
let ambientAudioContext = null;
let soundMasterGain = null;
let soundRequestId = 0;
const soundtrackAudio = new Audio(soundtrackUrl);
soundtrackAudio.preload = 'auto';
soundtrackAudio.load();
const panelOpenAudio = new Audio(panelOpenSoundUrl);
panelOpenAudio.preload = 'auto';
panelOpenAudio.load();
const loadingAmbienceAudio = new Audio(experienceAmbienceUrl);
loadingAmbienceAudio.preload = 'auto';
loadingAmbienceAudio.loop = true;
loadingAmbienceAudio.load();
const experienceAmbienceAudio = new Audio(experienceAmbienceUrl);
experienceAmbienceAudio.preload = 'auto';
experienceAmbienceAudio.loop = true;
experienceAmbienceAudio.load();
let soundtrackGain = null;
let soundtrackPauseTimeout = null;
let loadingAmbienceGain = null;
let loadingAmbienceStopTimeout = null;
let experienceAmbienceGain = null;
let musicAnalyser = null;
let musicFrequencyData = null;
let ambientDust = null;
let cinematicIntroRequested = false;
let lastCinematicChapter = '';
const musicLevels = {
  bass: 0,
  mid: 0,
  high: 0,
  energy: 0,
  beat: 0,
  previousBass: 0,
  lastBeatAt: 0,
};
// Atacs mesurats en finestres RMS de 10 ms després de separar les bandes del MP3.
const CINEMATIC_AUDIO_EVENTS = [
  { time: 0.42, strength: 0.65 },
  { time: 0.60, strength: 1 },
  { time: 0.81, strength: 0.7 },
  { time: 1, strength: 0.82 },
  { time: 1.21, strength: 0.6 },
  { time: 1.44, strength: 0.65 },
  { time: 1.71, strength: 0.45 },
  { time: 1.89, strength: 0.82 },
  { time: 2.14, strength: 0.61 },
  { time: 2.37, strength: 0.58 },
  { time: 2.69, strength: 0.56 },
  { time: 3.08, strength: 0.34 },
  { time: 3.34, strength: 0.34 },
  { time: 3.55, strength: 0.34 },
  { time: 3.75, strength: 0.34 },
  { time: 4.33, strength: 0.42 },
  { time: 4.51, strength: 0.45 },
  { time: 4.69, strength: 0.46 },
  { time: 4.91, strength: 0.56 },
  { time: 5.11, strength: 0.62 },
  { time: 5.30, strength: 0.85 },
  { time: 5.67, strength: 0.4 },
  { time: 6, strength: 0.38 },
  { time: 6.35, strength: 0.33 },
  { time: 6.66, strength: 0.4 },
];
const CINEMATIC_CHAPTERS = [
  { time: 0, phase: 'boot', label: 'ACTIVANDO SEÑAL' },
  { time: 0.2, phase: 'charge', label: 'CARGANDO EL NÚCLEO' },
  { time: 0.42, phase: 'impact', label: 'PRIMER DESPERTAR' },
  { time: 0.81, phase: 'impact-two', label: 'SINCRONIZANDO PULSOS' },
  { time: 1.44, phase: 'ignition', label: 'ENCENDIENDO CIRCUITOS' },
  { time: 1.89, phase: 'overdrive', label: 'SOBRECARGA CONTROLADA' },
  { time: 2.37, phase: 'shatter', label: 'FRAGMENTANDO LA LUZ' },
  { time: 2.9, phase: 'drift', label: 'DERIVA ENERGÉTICA' },
  { time: 3.08, phase: 'trace', label: 'TRAZANDO FRECUENCIAS' },
  { time: 3.55, phase: 'crosshair', label: 'FIJANDO COORDENADAS' },
  { time: 4.05, phase: 'lock', label: 'BLOQUEO DE SEÑAL' },
  { time: 4.33, phase: 'surge', label: 'ASCENSO DE FRECUENCIAS' },
  { time: 4.91, phase: 'flare', label: 'LIBERANDO EL DESTELLO' },
  { time: 5.3, phase: 'nova', label: 'NOVA / EXPANSIÓN TOTAL' },
  { time: 5.67, phase: 'echo', label: 'ECO EN LA ATMÓSFERA' },
  { time: 6.35, phase: 'afterglow', label: 'ATENUANDO LA SEÑAL' },
  { time: 7.5, phase: 'opening', label: 'ABRIENDO EL ESPACIO' },
  { time: 8.9, phase: 'reveal', label: 'SISTEMA RESTABLECIDO' },
];
const stationLabels = [];
const keys = new Set();
const heldTouches = new Set();
const player = {
  yaw: 0,
  pitch: 0,
  speed: 3.1,
  verticalVelocity: 0,
  grounded: false,
  active: false,
  reducedMotion: false,
  soundEnabled: false,
  dragLook: false,
};
let sceneReady = false;
let sceneLoadFailed = false;
let focusedStation = null;
let activeStation = null;
let currentNavigationId = null;
let toastTimeout;
let panelRevealTimeout;
let welcomeHudTimeout;
let armGestureUntil = 0;
let armGestureStartedAt = 0;
let elapsedTime = 0;
let wristArm = null;
let armMixer = null;
let armIdleAction = null;
let armShootAction = null;
let armMovementBlend = 0;
const armAnchor = new THREE.Vector3(
  innerWidth <= 760 ? 0.36 : 0.54,
  innerWidth <= 760 ? -0.5 : -0.64,
  innerWidth <= 760 ? -1.28 : -1.5,
);

const stationMaterial = new THREE.MeshStandardMaterial({
  color: 0xc6fa5f,
  emissive: 0x9cdb39,
  emissiveIntensity: 1.5,
  metalness: 0.3,
  roughness: 0.24,
});
const stationRingGeometry = new THREE.TorusGeometry(0.47, 0.012, 8, 48);
const stationCoreGeometry = new THREE.CircleGeometry(0.035, 20);
const stationGlowMaterial = new THREE.MeshBasicMaterial({ color: 0xc6fa5f });
const raycaster = new THREE.Raycaster();
const movementRaycaster = new THREE.Raycaster();
const groundRaycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);
const bounds = { minX: -5.2, maxX: 5.2, minZ: -4.8, maxZ: 9.2 };
const playerRadius = 0.28;
const playerEyeHeight = 1.62;
const collisionHeights = [0.2, 0.65, 1.1, 1.5];
const collisionCellSize = 1.5;
const gravity = 22;
const maxFallSpeed = 16;
const maxStepHeight = 0.2;
const roomCollisionGrid = new Map();
const movementDirection = new THREE.Vector3();
const movementOrigin = new THREE.Vector3();
const groundOffsets = [
  [0, 0],
  [-playerRadius * 0.65, 0],
  [playerRadius * 0.65, 0],
  [0, -playerRadius * 0.65],
  [0, playerRadius * 0.65],
];
const groundDirection = new THREE.Vector3(0, -1, 0);
const groundHits = [];
const movementHits = [];
const spawnFloorHeight = 0.5;
let stationLabelsStartedAt = null;
const defaultSpawn = {
  position: new THREE.Vector3(-2.9, playerEyeHeight + spawnFloorHeight, 1.2),
  yaw: 0,
};

/** Indexa les malles de la sala en cel·les horitzontals per consultar el moviment i el terra. */
function registerRoomColliders(room) {
  room.updateMatrixWorld(true);
  room.traverse((object) => {
    if (!object.isMesh || !object.geometry) return;
    const box = new THREE.Box3().setFromObject(object);
    const collider = { mesh: object, box };
    const minCellX = Math.floor(box.min.x / collisionCellSize);
    const maxCellX = Math.floor(box.max.x / collisionCellSize);
    const minCellZ = Math.floor(box.min.z / collisionCellSize);
    const maxCellZ = Math.floor(box.max.z / collisionCellSize);
    for (let cellX = minCellX; cellX <= maxCellX; cellX += 1) {
      for (let cellZ = minCellZ; cellZ <= maxCellZ; cellZ += 1) {
        const key = `${cellX},${cellZ}`;
        if (!roomCollisionGrid.has(key)) roomCollisionGrid.set(key, []);
        roomCollisionGrid.get(key).push(collider);
      }
    }
  });
}

/** Conserva la posició de repòs dels ventiladors del GLB i manté el gir de l'animació. */
function rebaseFanClip(clip, room) {
  clip.tracks.forEach((track) => {
    if (track.ValueTypeName !== 'quaternion') return;
    const nodeName = track.name.slice(0, track.name.lastIndexOf('.'));
    const fan = room.getObjectByName(nodeName);
    if (!fan) return;

    const values = track.values;
    const initialRotation = new THREE.Quaternion().fromArray(values, 0).invert();
    const restRotation = fan.quaternion.clone();
    for (let offset = 0; offset < values.length; offset += 4) {
      const rotation = new THREE.Quaternion().fromArray(values, offset);
      rotation.premultiply(initialRotation).premultiply(restRotation).normalize();
      rotation.toArray(values, offset);
    }
  });
}

/** Crea partícules de pols subtils que suren per l'oficina. */
function createAmbientDust() {
  const count = 72;
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = THREE.MathUtils.randFloat(-4.6, 4.6);
    positions[index * 3 + 1] = THREE.MathUtils.randFloat(0.65, 3.5);
    positions[index * 3 + 2] = THREE.MathUtils.randFloat(-4.4, 8.6);
    phases[index] = Math.random() * Math.PI * 2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xc6e8df,
    size: 0.022,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
    sizeAttenuation: true,
  });
  ambientDust = new THREE.Points(geometry, material);
  ambientDust.userData.basePositions = positions.slice();
  ambientDust.userData.phases = phases;
  ambientDust.visible = false;
  scene.add(ambientDust);
}

/** Anima la pols seguint els moviments de baixa freqüència de la banda sonora. */
function updateAmbientDust(time) {
  if (!ambientDust) return;
  ambientDust.visible = player.active && !player.reducedMotion;
  if (!ambientDust.visible) return;

  const positions = ambientDust.geometry.attributes.position.array;
  const basePositions = ambientDust.userData.basePositions;
  const phases = ambientDust.userData.phases;
  const bass = musicLevels.bass;
  ambientDust.material.opacity = 0.2 + musicLevels.energy * 0.2;
  ambientDust.material.size = 0.022 + musicLevels.high * 0.006;
  for (let index = 0; index < phases.length; index += 1) {
    const offset = index * 3;
    const phase = phases[index];
    positions[offset] = basePositions[offset] + Math.sin(time * (0.32 + bass * 0.12) + phase) * (0.12 + bass * 0.04);
    positions[offset + 1] = 0.65 + ((basePositions[offset + 1] - 0.65 + time * (0.035 + bass * 0.035)) % 2.85);
    positions[offset + 2] = basePositions[offset + 2] + Math.cos(time * (0.24 + bass * 0.08) + phase) * 0.1;
  }
  ambientDust.geometry.attributes.position.needsUpdate = true;
}

/** Retorna l'atac mesurat més intens que encara es produeix en aquest instant de reproducció. */
function getCinematicImpact(time) {
  let pulse = 0;
  let waveScale = 1;
  for (const event of CINEMATIC_AUDIO_EVENTS) {
    const age = time - event.time;
    if (age < 0 || age > 0.62) continue;
    const strength = event.strength * Math.exp(-age * 5.2);
    if (strength <= pulse) continue;
    pulse = strength;
    waveScale = 0.82 + age * 3.8;
  }
  return { pulse, waveScale };
}

/** Mostra a l'estat de càrrega els trams mesurats de la banda sonora. */
function updateCinematicChapter(time) {
  let chapter = CINEMATIC_CHAPTERS[0];
  for (const item of CINEMATIC_CHAPTERS) {
    if (time < item.time) break;
    chapter = item;
  }
  if (chapter.label !== lastCinematicChapter) {
    lastCinematicChapter = chapter.label;
    ui.loading.dataset.phase = chapter.phase;
  }
  if (!sceneReady) return;
  if (ui.loadingMessage.textContent !== chapter.label) ui.loadingMessage.textContent = chapter.label;
}

/** Inicia la transició quan els models estan preparats i la banda sonora ha acabat. */
function revealExperience() {
  if (!sceneReady || cinematicIntroRequested
    || ui.loading.classList.contains('is-hidden')
    || ui.loading.classList.contains('is-exiting')) return;

  cinematicIntroRequested = true;
  if (!soundtrackAudio.paused && !soundtrackAudio.ended) {
    updateSoundControl(false);
    void setSoundEnabled(false);
  }
  ui.experience.classList.add('is-ready');
  ui.loading.classList.add('is-exiting');
}

function showAudioPrompt() {
  if (!ui.audioModal.open) ui.audioModal.showModal();
  ui.audioEnableButton.focus({ preventScroll: true });
}

function continueWithoutAudio() {
  if (ui.audioModal.open) ui.audioModal.close();
  ui.audioError.hidden = true;
  updateSoundControl(false);
  void setSoundEnabled(false);
  revealExperience();
}

async function enableAudioAndContinue() {
  ui.audioEnableButton.disabled = true;
  ui.audioError.hidden = true;
  let enabled = false;
  try {
    enabled = await setSoundEnabled(true);
  } catch (error) {
    console.error('No se pudo activar el audio desde el diálogo inicial.', error);
  } finally {
    ui.audioEnableButton.disabled = false;
  }

  if (!enabled) {
    ui.audioError.hidden = false;
    ui.audioEnableButton.focus({ preventScroll: true });
    return;
  }

  updateSoundControl(true);
  if (ui.audioModal.open) ui.audioModal.close();
  playInteractionSound('toggle-on', 0.07);
}

soundtrackAudio.addEventListener('ended', () => {
  ui.experience.classList.remove('is-music-playing');
  if (sceneReady) revealExperience();
});

/** Connecta la banda sonora i l'analitzador de freqüències en temps real al bus d'àudio. */
function createMusicAudio() {
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) {
    throw new Error('Web Audio API no está disponible en este navegador.');
  }
  ambientAudioContext = new AudioContextConstructor();
  soundMasterGain = ambientAudioContext.createGain();
  soundMasterGain.gain.value = 0;
  const compressor = ambientAudioContext.createDynamicsCompressor();
  compressor.threshold.value = -18;
  compressor.knee.value = 12;
  compressor.ratio.value = 8;
  compressor.attack.value = 0.008;
  compressor.release.value = 0.18;
  soundMasterGain.connect(compressor);
  compressor.connect(ambientAudioContext.destination);

  musicAnalyser = ambientAudioContext.createAnalyser();
  musicAnalyser.fftSize = 2048;
  musicAnalyser.smoothingTimeConstant = 0.35;
  musicAnalyser.minDecibels = -85;
  musicAnalyser.maxDecibels = -18;
  musicFrequencyData = new Uint8Array(musicAnalyser.frequencyBinCount);
  soundtrackGain = ambientAudioContext.createGain();
  soundtrackGain.gain.value = 0.82;
  const soundtrackSource = ambientAudioContext.createMediaElementSource(soundtrackAudio);
  soundtrackSource.connect(musicAnalyser);
  musicAnalyser.connect(soundtrackGain);
  soundtrackGain.connect(soundMasterGain);
  experienceAmbienceGain = ambientAudioContext.createGain();
  experienceAmbienceGain.gain.value = 0;
  ambientAudioContext.createMediaElementSource(experienceAmbienceAudio).connect(musicAnalyser);
  musicAnalyser.connect(experienceAmbienceGain);
  experienceAmbienceGain.connect(soundMasterGain);
  const panelOpenGain = ambientAudioContext.createGain();
  panelOpenGain.gain.value = 0.58;
  ambientAudioContext.createMediaElementSource(panelOpenAudio).connect(panelOpenGain);
  panelOpenGain.connect(soundMasterGain);
  loadingAmbienceGain = ambientAudioContext.createGain();
  loadingAmbienceGain.gain.value = 0;
  ambientAudioContext.createMediaElementSource(loadingAmbienceAudio).connect(loadingAmbienceGain);
  loadingAmbienceGain.connect(soundMasterGain);
}

/** Reprodueix en bucle un ambient suau mentre es preparen els recursos 3D. */
async function startLoadingAmbience() {
  if (sceneReady || sceneLoadFailed || !loadingAmbienceGain || !ambientAudioContext) return;
  window.clearTimeout(loadingAmbienceStopTimeout);
  const now = ambientAudioContext.currentTime;
  loadingAmbienceGain.gain.cancelScheduledValues(now);
  loadingAmbienceGain.gain.setTargetAtTime(0.16, now, 0.35);
  if (!loadingAmbienceAudio.paused && !loadingAmbienceAudio.ended) return;

  try {
    await loadingAmbienceAudio.play();
  } catch (error) {
    console.error('No se pudo reproducir el ambiente durante la carga 3D.', error);
    showToast('No se pudo reproducir el ambiente de carga.');
  }
}

/** Atenua l'àudio ambiental de càrrega quan s'acaba de carregar el model. */
function stopLoadingAmbience() {
  if (!loadingAmbienceGain || !ambientAudioContext) return;
  const now = ambientAudioContext.currentTime;
  loadingAmbienceGain.gain.cancelScheduledValues(now);
  loadingAmbienceGain.gain.setTargetAtTime(0, now, 0.45);
  window.clearTimeout(loadingAmbienceStopTimeout);
  loadingAmbienceStopTimeout = window.setTimeout(() => {
    loadingAmbienceAudio.pause();
    loadingAmbienceAudio.currentTime = 0;
  }, 1800);
}

/** Reprodueix o pausa la banda sonora i els efectes d'interacció sintetitzats. */
async function setSoundEnabled(enabled) {
  const requestId = ++soundRequestId;
  if (enabled && !ambientAudioContext) {
    try {
      createMusicAudio();
    } catch (error) {
      console.error('No se pudo inicializar el audio de la experiencia.', error);
      if (!ui.loading.classList.contains('is-hidden')) {
        ui.loadingDescription.textContent = 'El navegador no pudo iniciar el audio. Puedes continuar sin sonido.';
      }
      showToast('El navegador no pudo iniciar el audio.');
      updateSoundControl(false);
      return false;
    }
  }
  if (!ambientAudioContext || !soundMasterGain) return !enabled;

  try {
    window.clearTimeout(soundtrackPauseTimeout);
    let resumePromise = Promise.resolve();
    if (enabled) {
      if (ambientAudioContext.state === 'closed') {
        throw new Error('El contexto de audio está cerrado y no se puede reanudar.');
      }
      if (ambientAudioContext.state === 'suspended') {
        resumePromise = ambientAudioContext.resume();
      }
    }
    if (enabled) {
      let playbackPromise;
      if (player.active) {
        soundtrackGain.gain.cancelScheduledValues(ambientAudioContext.currentTime);
        soundtrackGain.gain.setTargetAtTime(0, ambientAudioContext.currentTime, 0.06);
        soundtrackAudio.pause();
        experienceAmbienceGain.gain.cancelScheduledValues(ambientAudioContext.currentTime);
        experienceAmbienceGain.gain.setTargetAtTime(0.52, ambientAudioContext.currentTime, 0.3);
        playbackPromise = experienceAmbienceAudio.play();
      } else {
        if (soundtrackAudio.ended) soundtrackAudio.currentTime = 0;
        experienceAmbienceGain.gain.cancelScheduledValues(ambientAudioContext.currentTime);
        experienceAmbienceGain.gain.setTargetAtTime(0, ambientAudioContext.currentTime, 0.06);
        playbackPromise = soundtrackAudio.play();
      }
      await Promise.all([resumePromise, playbackPromise]);
      if (requestId !== soundRequestId) return false;
      if (ambientAudioContext.state !== 'running') {
        throw new Error(`AudioContext no pudo pasar al estado running (estado actual: ${ambientAudioContext.state}).`);
      }
      if (!sceneReady && !sceneLoadFailed) void startLoadingAmbience();
      if (!player.active && sceneReady && !ui.loading.classList.contains('is-hidden')) {
        cinematicIntroRequested = false;
        lastCinematicChapter = '';
        ui.loadingTitle.textContent = 'Sintonizando el núcleo';
        ui.loadingDescription.textContent = 'Cada impacto activa la señal. Sigue la secuencia hasta el último eco.';
        ui.loading.dataset.phase = 'boot';
      }
    } else {
      const now = ambientAudioContext.currentTime;
      soundtrackGain.gain.cancelScheduledValues(now);
      soundtrackGain.gain.setTargetAtTime(0, now, 0.035);
      experienceAmbienceGain.gain.cancelScheduledValues(now);
      experienceAmbienceGain.gain.setTargetAtTime(0, now, 0.035);
      if (loadingAmbienceGain) {
        loadingAmbienceGain.gain.cancelScheduledValues(now);
        loadingAmbienceGain.gain.setTargetAtTime(0, now, 0.035);
      }
      window.clearTimeout(loadingAmbienceStopTimeout);
      loadingAmbienceAudio.pause();
      loadingAmbienceAudio.currentTime = 0;
      panelOpenAudio.pause();
      panelOpenAudio.currentTime = 0;
      soundtrackPauseTimeout = window.setTimeout(() => {
        soundtrackAudio.pause();
        experienceAmbienceAudio.pause();
      }, 140);
    }
    const now = ambientAudioContext.currentTime;
    if (enabled) {
      if (!player.active) {
        soundtrackGain.gain.cancelScheduledValues(now);
        soundtrackGain.gain.setTargetAtTime(0.82, now, 0.06);
      }
    }
    soundMasterGain.gain.cancelScheduledValues(now);
    soundMasterGain.gain.setTargetAtTime(enabled ? 0.68 : 0, now, enabled ? 0.06 : 0.035);
    const activeMusic = player.active ? experienceAmbienceAudio : soundtrackAudio;
    const musicIsPlaying = enabled && !activeMusic.paused && !activeMusic.ended;
    ui.experience.classList.toggle('is-music-playing', musicIsPlaying);
    return true;
  } catch (error) {
    if (enabled && error?.name === 'NotAllowedError') {
      updateSoundControl(false);
      console.warn('El navegador no permitió iniciar el audio.', error);
      return false;
    }
    console.error('No se pudo actualizar la banda sonora.', error);
    if (!ui.loading.classList.contains('is-hidden')) {
      ui.loadingDescription.textContent = 'No se pudo reproducir la banda sonora. Puedes continuar sin sonido.';
    }
    showToast('No se pudo activar el audio.');
    updateSoundControl(false);
    ui.experience.classList.remove('is-music-playing');
    return false;
  }
}

/** Manté sincronitzats l'estat visual del so i l'etiqueta accessible. */
function updateSoundControl(enabled) {
  player.soundEnabled = enabled;
  ui.soundToggle.setAttribute('aria-pressed', String(enabled));
  ui.soundToggle.setAttribute('aria-label', enabled ? 'Silenciar sonido' : 'Activar sonido');
}

const interactionSoundPresets = {
  enter: { frequencies: [196, 392, 587], endFrequencies: [392, 587, 784], duration: 0.36, volume: 0.28, type: 'triangle', spacing: 0.05 },
  close: { frequencies: [880, 660, 440], endFrequencies: [660, 440, 330], duration: 0.22, volume: 0.21, type: 'triangle', spacing: 0.035 },
  navigate: { frequencies: [660, 990], endFrequencies: [990, 1320], duration: 0.13, volume: 0.2, type: 'sine', spacing: 0.045 },
  'toggle-on': { frequencies: [440, 660, 880], endFrequencies: [660, 880, 1100], duration: 0.18, volume: 0.23, type: 'triangle', spacing: 0.04 },
  'toggle-off': { frequencies: [880, 660, 440], endFrequencies: [660, 440, 330], duration: 0.18, volume: 0.2, type: 'triangle', spacing: 0.04 },
  'flashlight-on': { frequencies: [165, 440, 880], endFrequencies: [330, 660, 1320], duration: 0.19, volume: 0.24, type: 'square', spacing: 0.035 },
  'flashlight-off': { frequencies: [880, 440, 220], endFrequencies: [660, 330, 110], duration: 0.2, volume: 0.2, type: 'triangle', spacing: 0.035 },
};

/** Sintetitza un avís breu i filtrat de la interfície sense carregar fitxers d'àudio. */
function playInteractionSound(name, delay = 0) {
  const preset = interactionSoundPresets[name];
  if (!preset || !player.soundEnabled || !ambientAudioContext
    || !soundMasterGain || ambientAudioContext.state !== 'running') return;

  const now = ambientAudioContext.currentTime + delay;
  const spacing = preset.spacing ?? 0;
  const duration = preset.duration + spacing * (preset.frequencies.length - 1);
  const filter = ambientAudioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(preset.filterFrequency ?? 3800, now);
  filter.frequency.exponentialRampToValueAtTime(
    Math.max(900, (preset.filterFrequency ?? 3800) * 0.45),
    now + duration,
  );
  const envelope = ambientAudioContext.createGain();
  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.exponentialRampToValueAtTime(preset.volume, now + 0.025);
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  filter.connect(envelope);
  envelope.connect(soundMasterGain);

  let voicesRemaining = preset.frequencies.length;
  preset.frequencies.forEach((frequency, index) => {
    const oscillator = ambientAudioContext.createOscillator();
    oscillator.type = preset.type;
    const noteStart = now + spacing * index;
    oscillator.frequency.setValueAtTime(frequency, noteStart);
    oscillator.frequency.exponentialRampToValueAtTime(
      preset.endFrequencies[index],
      noteStart + preset.duration,
    );
    oscillator.connect(filter);
    oscillator.addEventListener('ended', () => {
      oscillator.disconnect();
      voicesRemaining -= 1;
      if (voicesRemaining === 0) {
        filter.disconnect();
        envelope.disconnect();
      }
    }, { once: true });
    oscillator.start(noteStart);
    oscillator.stop(noteStart + preset.duration);
  });
  return true;
}

/** Reprodueix el so de la interfície mitjançant el bus d'àudio compartit i controlat per l'usuari. */
function playPanelOpenSound() {
  if (!player.soundEnabled || !ambientAudioContext || ambientAudioContext.state !== 'running') return;
  panelOpenAudio.pause();
  panelOpenAudio.currentTime = 0;
  void panelOpenAudio.play().catch((error) => {
    console.error('No se pudo reproducir el sonido de apertura del panel.', error);
  });
}

/** Dibuixa l'espectre de la pantalla de càrrega amb l'analitzador del MP3 en reproducció. */
function drawLoadingSpectrum() {
  if (!loadingVisualizerContext) return;

  const bounds = ui.loadingVisualizer.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
  const width = Math.round(bounds.width * pixelRatio);
  const height = Math.round(bounds.height * pixelRatio);
  if (width !== loadingVisualizerSize.width
    || height !== loadingVisualizerSize.height
    || pixelRatio !== loadingVisualizerSize.pixelRatio) {
    ui.loadingVisualizer.width = width;
    ui.loadingVisualizer.height = height;
    loadingVisualizerSize = { width, height, pixelRatio };
  }

  const context = loadingVisualizerContext;
  const musicTime = player.reducedMotion ? 0 : soundtrackAudio.currentTime;
  const impact = player.reducedMotion ? 0 : getCinematicImpact(musicTime).pulse;
  const centerX = width * 0.5;
  const centerY = height * 0.5;
  const radius = Math.min(width, height) * 0.17;
  const rayCount = 128;
  context.clearRect(0, 0, width, height);
  const halo = context.createRadialGradient(centerX, centerY, radius * 0.2, centerX, centerY, radius * 2.8);
  halo.addColorStop(0, `rgba(198, 250, 95, ${0.08 + impact * 0.24})`);
  halo.addColorStop(0.3, `rgba(173, 140, 255, ${0.055 + musicLevels.energy * 0.12})`);
  halo.addColorStop(1, 'rgba(18, 30, 78, 0)');
  context.fillStyle = halo;
  context.fillRect(0, 0, width, height);

  const spectrumGradient = context.createLinearGradient(
    centerX - radius,
    centerY + radius,
    centerX + radius,
    centerY - radius,
  );
  spectrumGradient.addColorStop(0, 'rgba(173, 140, 255, 0.18)');
  spectrumGradient.addColorStop(0.45, 'rgba(198, 250, 95, 0.92)');
  spectrumGradient.addColorStop(1, 'rgba(239, 221, 255, 0.82)');
  context.strokeStyle = spectrumGradient;
  context.lineWidth = Math.max(1, 1.5 * pixelRatio);
  context.lineCap = 'round';
  context.shadowColor = '#c6fa5f';
  context.shadowBlur = (8 + impact * 30) * pixelRatio;
  for (let index = 0; index < rayCount; index += 1) {
    const position = index / rayCount;
    const bin = musicFrequencyData
      ? Math.min(
        musicFrequencyData.length - 1,
        Math.max(1, Math.floor(1 + position ** 1.8 * (musicFrequencyData.length - 2))),
      )
      : 0;
    const spectrum = musicFrequencyData ? musicFrequencyData[bin] / 255 : 0;
    const length = (5 + spectrum ** 0.8 * 64 + impact * 20) * pixelRatio;
    const angle = position * Math.PI * 2 - Math.PI / 2 + musicTime * 0.09;
    const startX = centerX + Math.cos(angle) * radius;
    const startY = centerY + Math.sin(angle) * radius;
    context.globalAlpha = 0.2 + spectrum * 0.76 + impact * 0.3;
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(
      centerX + Math.cos(angle) * (radius + length),
      centerY + Math.sin(angle) * (radius + length),
    );
    context.stroke();
  }

  context.shadowBlur = 0;
  context.lineWidth = pixelRatio;
  for (let index = 0; index < 32; index += 1) {
    const angle = index * 2.399 + musicTime * (0.32 + impact * 0.1);
    const drift = (musicTime * (18 + index % 7 * 4) + index * 41) % (radius * 2.1);
    const distance = radius * 1.15 + drift;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    const size = (0.7 + (index % 3) * 0.45 + impact * 1.4) * pixelRatio;
    context.globalAlpha = 0.15 + impact * 0.65;
    context.fillStyle = index % 4 === 0 ? '#ad8cff' : '#c6fa5f';
    context.fillRect(x, y, size, size);
  }
  context.globalAlpha = 1;
  context.shadowBlur = 0;
}

/** Retorna les malles indexades que se superposen amb la regió 3D indicada. */
function getRoomColliders(minX, maxX, minY, maxY, minZ, maxZ) {
  const colliders = new Set();
  for (let cellX = Math.floor(minX / collisionCellSize);
    cellX <= Math.floor(maxX / collisionCellSize);
    cellX += 1) {
    for (let cellZ = Math.floor(minZ / collisionCellSize);
      cellZ <= Math.floor(maxZ / collisionCellSize);
      cellZ += 1) {
      const cell = roomCollisionGrid.get(`${cellX},${cellZ}`);
      if (!cell) continue;
      cell.forEach((collider) => {
        const { box } = collider;
        if (box.max.x >= minX && box.min.x <= maxX
          && box.max.y >= minY && box.min.y <= maxY
          && box.max.z >= minZ && box.min.z <= maxZ) {
          colliders.add(collider.mesh);
        }
      });
    }
  }
  return [...colliders];
}

/** Crea el marcador 3D i l'etiqueta en canvas d'una secció del portafolis. */
function makeStation(section) {
  const group = new THREE.Group();
  group.position.copy(section.position);
  group.userData.section = section;
  const ring = new THREE.Mesh(stationRingGeometry, stationMaterial);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.025;
  group.add(ring);
  const core = new THREE.Mesh(stationCoreGeometry, stationGlowMaterial);
  core.rotation.x = -Math.PI / 2;
  core.position.y = 0.031;
  group.add(core);
  const beacon = new THREE.Mesh(
    new THREE.CylinderGeometry(0.006, 0.006, 0.8, 6),
    new THREE.MeshBasicMaterial({ color: 0xc6fa5f, transparent: true, opacity: 0.55 }),
  );
  beacon.position.y = 0.43;
  group.add(beacon);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), stationGlowMaterial);
  cap.position.y = 0.84;
  group.add(cap);
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 176;
  const context = canvas.getContext('2d');
  const title = section.title.toUpperCase();
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.shadowColor = 'rgba(0, 0, 0, 0.45)';
  context.shadowBlur = 18;
  context.shadowOffsetY = 8;
  context.fillStyle = 'rgba(8, 12, 19, 0.94)';
  context.beginPath();
  context.roundRect(7, 7, 586, 162, 12);
  context.fill();
  context.shadowColor = 'transparent';
  context.shadowBlur = 0;
  context.shadowOffsetY = 0;

  const panelGradient = context.createLinearGradient(10, 8, 590, 168);
  panelGradient.addColorStop(0, 'rgba(32, 43, 48, 0.48)');
  panelGradient.addColorStop(1, 'rgba(9, 13, 20, 0.08)');
  context.fillStyle = panelGradient;
  context.beginPath();
  context.roundRect(8, 8, 584, 160, 11);
  context.fill();
  context.strokeStyle = 'rgba(205, 221, 208, 0.26)';
  context.lineWidth = 1.5;
  context.beginPath();
  context.roundRect(7.5, 7.5, 585, 161, 11.5);
  context.stroke();

  context.fillStyle = '#c6fa5f';
  context.fillRect(8, 25, 3, 54);
  context.font = '500 16px monospace';
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillStyle = 'rgba(198, 250, 95, 0.92)';
  context.fillText(`PORTAFOLIO  /  ${section.number}`, 30, 37);
  context.font = '500 13px monospace';
  context.textAlign = 'right';
  context.fillStyle = 'rgba(214, 224, 220, 0.62)';
  context.fillText('ESTACIÓN', 568, 37);
  context.fillStyle = '#c6fa5f';
  context.beginPath();
  context.arc(575, 65, 3.5, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = 'rgba(211, 224, 215, 0.18)';
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(29, 59);
  context.lineTo(571, 59);
  context.stroke();

  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.font = '600 38px Manrope, Arial, sans-serif';
  context.fillStyle = '#f2f4ef';
  context.shadowColor = 'rgba(198, 250, 95, 0.22)';
  context.shadowBlur = 12;
  context.fillText(title, 30, 103, 510);
  context.shadowColor = 'transparent';
  context.shadowBlur = 0;
  context.fillStyle = 'rgba(198, 250, 95, 0.82)';
  context.fillRect(30, 143, 38, 2);
  context.font = '500 12px monospace';
  context.fillStyle = 'rgba(221, 227, 220, 0.66)';
  context.fillText('ACERCARSE PARA EXPLORAR', 79, 144);
  context.strokeStyle = '#c6fa5f';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(558, 138);
  context.lineTo(566, 144);
  context.lineTo(558, 150);
  context.stroke();

  const labelTexture = new THREE.CanvasTexture(canvas);
  labelTexture.colorSpace = THREE.SRGBColorSpace;
  const labelSprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: labelTexture,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    opacity: 0,
    color: 0xffffff,
  }));
  const labelHeight = 0.62;
  labelSprite.scale.set((canvas.width / canvas.height) * labelHeight, labelHeight, 1);
  labelSprite.position.set(0, 1.46, 0);
  group.add(labelSprite);
  labelSprite.userData.section = section;
  stationLabels.push(labelSprite);
  group.userData.labelSprite = labelSprite;
  group.userData.labelBaseY = labelSprite.position.y;
  group.userData.labelBaseScale = labelSprite.scale.x;
  group.userData.labelBaseHeight = labelHeight;
  scene.add(group);
  return group;
}

const stations = sections.map(makeStation);

/** Carrega, ajusta i prepara el model animat del braç en primera persona. */
function loadArm() {
  return new Promise((resolve, reject) => {
    const group = new THREE.Group();
    group.visible = false;
    group.position.copy(armAnchor);
    armOverlayCamera.add(group);
    wristArm = group;

    loader.load(
      MODEL_ASSETS.arm,
      (gltf) => {
        try {
          const model = gltf.scene;
          model.traverse((object) => {
            if (object.isMesh) {
              object.frustumCulled = false;
            }
          });

          const bounds = new THREE.Box3().setFromObject(model);
          const size = bounds.getSize(new THREE.Vector3());
          const center = bounds.getCenter(new THREE.Vector3());
          model.position.sub(center);
          const longestSide = Math.max(size.x, size.y, size.z);
          if (longestSide === 0) {
            throw new Error('El modelo brazo.glb no contiene geometría visible.');
          }

          const modelPivot = new THREE.Group();
          const armLength = innerWidth <= 760 ? 1.35 : 2.05;
          modelPivot.scale.setScalar(armLength / longestSide);
          modelPivot.rotation.set(0.12, -Math.PI / 2, -0.2);
          modelPivot.add(model);
          group.add(modelPivot);

          armMixer = new THREE.AnimationMixer(model);
          const idleClip = gltf.animations.find((clip) => /canon_idle$/i.test(clip.name));
          const shootClip = gltf.animations.find((clip) => /shoot_standard$/i.test(clip.name));
          if (idleClip) {
            armIdleAction = armMixer.clipAction(idleClip);
            armIdleAction.setLoop(THREE.LoopRepeat, Infinity).play();
          }
          if (shootClip) {
            armShootAction = armMixer.clipAction(shootClip);
            armMixer.addEventListener('finished', (event) => {
              if (event.action !== armShootAction) return;
              armShootAction.fadeOut(0.18);
              armIdleAction?.reset().fadeIn(0.18).play();
            });
          }
            completeLoadingAsset('arm');
            resolve();
        } catch (error) {
          reject(error);
        }
      },
      (event) => updateLoadingProgress('arm', event),
      reject,
    );
  });
}

const loadingWeights = { room: 0.4, arm: 0.45, screen: 0.15 };
const loadingProgress = { room: 0, arm: 0, screen: 0 };

/** Mostra el progrés real de descàrrega dels fitxers GLB. */
function updateLoadingProgress(asset, event) {
  if (event.total > 0) {
    loadingProgress[asset] = Math.max(
      loadingProgress[asset],
      THREE.MathUtils.clamp(event.loaded / event.total, 0, 1),
    );
  }
  const progress = Object.entries(loadingProgress).reduce(
    (total, [key, value]) => total + value * loadingWeights[key],
    0,
  );
  const percentage = Math.min(94, Math.round(progress * 100));
  ui.loadingProgress.style.width = `${percentage}%`;
  ui.loadingPercent.textContent = `${String(percentage).padStart(2, '0')}%`;
  ui.loadingProgressbar.setAttribute('aria-valuenow', String(percentage));

  const status = loadingProgress.room < 1
    ? 'CARGANDO ENTORNO'
    : loadingProgress.arm < 1
      ? 'PREPARANDO EQUIPO'
      : loadingProgress.screen < 1
        ? 'INICIALIZANDO ESTACIONES'
        : 'INTEGRANDO ESCENA 3D';
  ui.loadingMessage.textContent = status;
}

/** Marca un recurs com a llest encara que el navegador no n'hagi informat la mida. */
function completeLoadingAsset(asset) {
  loadingProgress[asset] = 1;
  updateLoadingProgress(asset, {});
}

/** Construeix el suport de la pantalla i carrega el model a l'escena. */
function loadScreen() {
  const screenStand = new THREE.Group();
  screenStand.position.set(0, 0, 4.2);
  scene.add(screenStand);
  const screenGroup = new THREE.Group();
  screenGroup.position.set(0, 0.92, 4.2);
  scene.add(screenGroup);
  const pedestalMaterial = new THREE.MeshStandardMaterial({ color: 0x20212d, metalness: 0.72, roughness: 0.28 });
  const pedestalBase = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.06, 20), pedestalMaterial);
  pedestalBase.position.set(0, 0.03, 0);
  screenStand.add(pedestalBase);
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.08, 1, 12), pedestalMaterial);
  pedestal.position.set(0, 0.53, 0);
  screenStand.add(pedestal);
  return new Promise((resolve, reject) => {
    loader.load(
      MODEL_ASSETS.screen,
      (gltf) => {
        const model = gltf.scene;
        model.scale.setScalar(0.4);
        model.position.set(0, 0, 0);
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;
            child.material = child.material.clone();
            child.material.color.set(0x242532);
            child.material.metalness = 0.7;
            child.material.roughness = 0.32;
          }
        });
        screenGroup.add(model);
        completeLoadingAsset('screen');
        resolve();
      },
      (event) => updateLoadingProgress('screen', event),
      reject,
    );
  });
}

/** Carrega l'oficina i reprodueix només els dos clips de gir dels ventiladors. */
function loadRoom() {
  return new Promise((resolve, reject) => {
    loader.load(
      MODEL_ASSETS.room,
      (gltf) => {
        gltf.scene.traverse((object) => {
          if (object.isMesh) {
            object.frustumCulled = true;
            object.castShadow = true;
            object.receiveShadow = true;
            if (object.material) {
              const materials = Array.isArray(object.material) ? object.material : [object.material];
              materials.forEach((material) => {
                material.side = THREE.DoubleSide;
              });
            }
          }
        });
        scene.add(gltf.scene);
        registerRoomColliders(gltf.scene);
        createAmbientDust();
        const fanClips = gltf.animations.filter((clip) => (
          clip.name === 'WIndow2_Helix1' || clip.name === 'WIndow2_Helix2'
        ));
        if (fanClips.length) {
          fanClips.forEach((clip) => rebaseFanClip(clip, gltf.scene));
          roomMixer = new THREE.AnimationMixer(gltf.scene);
          fanClips.forEach((clip) => roomMixer.clipAction(clip).play());
        }
        completeLoadingAsset('room');
        resolve();
      },
      (event) => updateLoadingProgress('room', event),
      reject,
    );
  });
}

/** Mostra temporalment un missatge d'estat accessible. */
function showToast(message) {
  ui.toast.textContent = message;
  ui.toast.classList.add('is-visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => ui.toast.classList.remove('is-visible'), 3000);
}

/** Actualitza el text de l'estació propera només quan canvia. */
function setLocation(section) {
  const name = section?.location ?? 'El espacio';
  const description = section?.description ?? 'Acércate a una estación para descubrir más.';
  if (ui.locationName.textContent !== name) ui.locationName.textContent = name;
  if (ui.locationDescription.textContent !== description) {
    ui.locationDescription.textContent = description;
  }
  const isVisible = ui.location.classList.contains('is-visible');
  if (isVisible !== player.active) ui.location.classList.toggle('is-visible', player.active);
}

/** Marca la secció actual a la navegació d'escriptori o mòbil. */
function updateNavigation(section) {
  const sectionId = section?.id ?? 'inicio';
  if (sectionId === currentNavigationId) return;
  currentNavigationId = sectionId;
  navItems.forEach((button) => {
    const isActive = button.dataset.section === sectionId;
    if (button.classList.contains('is-active') !== isActive) {
      button.classList.toggle('is-active', isActive);
    }
  });
}

/** Omple i obre el panell de contingut d'una secció del portafolis. */
function openSection(section) {
  const index = sections.indexOf(section);
  if (index < 0) return;
  clearTimeout(panelRevealTimeout);
  if (document.pointerLockElement === renderer.domElement) {
    document.exitPointerLock();
  }
  renderer.domElement.style.cursor = '';
  activeStation = section;
  focusedStation = section;
  ui.interactionPrompt.classList.remove('is-visible');
  ui.interactionPrompt.setAttribute('aria-hidden', 'true');
  ui.panelKicker.textContent = `${section.number} — ${section.location.toUpperCase()}`;
  ui.panelTitle.textContent = section.title;
  ui.panelContent.innerHTML = section.content;
  ui.panelFooterLabel.textContent = section.id === 'trabajos-web'
    ? '6 PROYECTOS'
    : 'PORTAFOLIO INTERACTIVO';
  ui.panelIndex.textContent = `${section.number} / ${String(sections.length).padStart(2, '0')}`;
  ui.panel.classList.remove('is-open');
  ui.panel.setAttribute('aria-hidden', 'true');
  armGestureStartedAt = elapsedTime;
  armGestureUntil = player.reducedMotion ? 0 : elapsedTime + 1.05;
  if (!player.reducedMotion && armShootAction) {
    armIdleAction?.fadeOut(0.12);
    armShootAction.reset().setLoop(THREE.LoopOnce, 1);
    armShootAction.clampWhenFinished = true;
    armShootAction.fadeIn(0.12).play();
  }
  updateNavigation(section);
  panelRevealTimeout = setTimeout(() => {
    if (activeStation !== section) return;
    ui.panel.classList.add('is-open');
    playPanelOpenSound();
    ui.panel.setAttribute('aria-hidden', 'false');
    ui.panelClose.focus({ preventScroll: true });
  }, player.reducedMotion ? 0 : 480);
}

/** Tanca el panell, restaura el focus i torna a activar la captura del punter. */
function closePanel() {
  clearTimeout(panelRevealTimeout);
  if (!ui.panel.classList.contains('is-open') && !activeStation) return;
  ui.panel.classList.remove('is-open');
  ui.panel.setAttribute('aria-hidden', 'true');
  const sectionId = activeStation?.id;
  armGestureUntil = 0;
  activeStation = null;
  playInteractionSound('close');
  const focusTarget = sectionId
    ? document.querySelector(`[data-section="${sectionId}"]`)
    : ui.enter;
  focusTarget?.focus({ preventScroll: true });
  if (player.active
    && !matchMedia('(pointer: coarse)').matches
    && renderer.domElement.requestPointerLock) {
    requestPointerCapture();
  }
}

/** Activa la mirada amb arrossegament quan no es pot bloquejar el punter. */
function useDragLook(error) {
  player.dragLook = true;
  renderer.domElement.style.cursor = 'grab';
  const unavailable = ['NotAllowedError', 'NotSupportedError', 'SecurityError', 'WrongDocumentError'].includes(error?.name);
  if (unavailable) {
    console.warn('Bloqueo del puntero no disponible; se activa la mirada por arrastre.', error);
    showToast('Arrastra la escena para mirar.');
  } else {
    console.error('No se pudo activar el bloqueo del puntero; se activa la mirada por arrastre.', error);
    showToast('Arrastra la escena para mirar.');
  }
}

/** Sol·licita el bloqueig del punter i gestiona els errors amb l'alternativa disponible. */
function requestPointerCapture() {
  try {
    const request = renderer.domElement.requestPointerLock();
    if (request && typeof request.catch === 'function') request.catch(useDragLook);
  } catch (error) {
    useDragLook(error);
  }
}

/** Entra a l'escena 3D i activa els controls de navegació corresponents. */
function enterExperience() {
  if (player.active || !sceneReady) return;
  playerRig.position.copy(defaultSpawn.position);
  player.verticalVelocity = 0;
  player.grounded = false;
  player.yaw = defaultSpawn.yaw;
  player.pitch = 0;
  camera.rotation.set(player.pitch, player.yaw, 0, 'YXZ');
  player.active = true;
  ui.welcomeHud.classList.remove('is-active');
  void ui.welcomeHud.offsetWidth;
  ui.welcomeHud.classList.add('is-active');
  ui.welcomeHud.setAttribute('aria-hidden', 'false');
  window.clearTimeout(welcomeHudTimeout);
  welcomeHudTimeout = window.setTimeout(() => {
    ui.welcomeHud.classList.remove('is-active');
    ui.welcomeHud.setAttribute('aria-hidden', 'true');
  }, 8200);
  void setSoundEnabled(player.soundEnabled).then((success) => {
    if (!success) return;
    updateSoundControl(player.soundEnabled);
    playInteractionSound('enter', 0.07);
  });
  ui.intro.classList.add('is-hidden');
  ui.intro.inert = true;
  ui.intro.setAttribute('aria-hidden', 'true');
  ui.nav.classList.add('is-visible');
  ui.nav.inert = false;
  ui.nav.setAttribute('aria-hidden', 'false');
  ui.crosshair.classList.add('is-visible');
  ui.mobileControls.classList.toggle('is-visible', matchMedia('(pointer: coarse)').matches);
  setLocation(null);
  if (!matchMedia('(pointer: coarse)').matches && renderer.domElement.requestPointerLock) {
    requestPointerCapture();
  }
  showToast('WASD para moverte · L linterna · E interactuar');
}

/** Mou el jugador respecte de la càmera i el manté dins de la sala. */
function movePlayer(delta) {
  if (!player.active || ui.panel.classList.contains('is-open')) return;
  applyGravity(delta);
  const forward = Number(keys.has('KeyW') || keys.has('ArrowUp') || heldTouches.has('forward'))
    - Number(keys.has('KeyS') || keys.has('ArrowDown') || heldTouches.has('back'));
  const strafe = Number(keys.has('KeyD') || keys.has('ArrowRight') || heldTouches.has('right'))
    - Number(keys.has('KeyA') || keys.has('ArrowLeft') || heldTouches.has('left'));
  if (forward === 0 && strafe === 0) return;
  const directionLength = Math.hypot(forward, strafe);
  const normalizedForward = forward / directionLength;
  const normalizedStrafe = strafe / directionLength;
  const dx = (-Math.sin(player.yaw) * normalizedForward + Math.cos(player.yaw) * normalizedStrafe) * player.speed * delta;
  const dz = (-Math.cos(player.yaw) * normalizedForward - Math.sin(player.yaw) * normalizedStrafe) * player.speed * delta;
  const nextX = THREE.MathUtils.clamp(playerRig.position.x + dx, bounds.minX, bounds.maxX);
  const nextZ = THREE.MathUtils.clamp(playerRig.position.z + dz, bounds.minZ, bounds.maxZ);
  const movementX = nextX - playerRig.position.x;
  const movementZ = nextZ - playerRig.position.z;
  if (!isMovementBlocked(movementX, movementZ)) {
    playerRig.position.x = nextX;
    playerRig.position.z = nextZ;
    return;
  }

  // Resol cada eix per separat perquè el jugador pugui lliscar al llarg d'una paret.
  if (!isMovementBlocked(movementX, 0)) playerRig.position.x = nextX;
  if (!isMovementBlocked(0, movementZ)) playerRig.position.z = nextZ;
}

/** Aplica la gravetat i ajusta els peus del jugador a la superfície sòlida més propera. */
function applyGravity(delta) {
  if (player.grounded) player.verticalVelocity = 0;
  player.verticalVelocity = Math.max(
    player.verticalVelocity - gravity * delta,
    -maxFallSpeed,
  );
  const feetY = playerRig.position.y - playerEyeHeight;
  const nextFeetY = feetY + player.verticalVelocity * delta;
  const rayOriginY = nextFeetY + maxStepHeight;
  const fallDistance = maxStepHeight
    + Math.max(0, -player.verticalVelocity * delta)
    + gravity * delta * delta
    + 0.02;
  const colliders = getRoomColliders(
    playerRig.position.x - playerRadius,
    playerRig.position.x + playerRadius,
    rayOriginY - fallDistance,
    rayOriginY,
    playerRig.position.z - playerRadius,
    playerRig.position.z + playerRadius,
  );
  groundRaycaster.near = 0;
  groundRaycaster.far = fallDistance;
  let groundY = -Infinity;

  groundOffsets.forEach(([offsetX, offsetZ]) => {
    movementOrigin.set(
      playerRig.position.x + offsetX,
      rayOriginY,
      playerRig.position.z + offsetZ,
    );
    groundRaycaster.set(movementOrigin, groundDirection);
    groundHits.length = 0;
    const hit = groundRaycaster.intersectObjects(colliders, false, groundHits)[0];
    if (hit && hit.point.y <= nextFeetY + maxStepHeight) {
      groundY = Math.max(groundY, hit.point.y);
    }
  });

  if (groundY !== -Infinity) {
    playerRig.position.y = groundY + playerEyeHeight;
    player.verticalVelocity = 0;
    player.grounded = true;
  } else {
    playerRig.position.y = nextFeetY + playerEyeHeight;
    player.grounded = false;
  }
}

/** Comprova la càpsula de col·lisió mostrejada del jugador contra la geometria propera. */
function isMovementBlocked(deltaX, deltaZ) {
  const distance = Math.hypot(deltaX, deltaZ);
  if (distance === 0 || roomCollisionGrid.size === 0) return false;

  movementDirection.set(deltaX / distance, 0, deltaZ / distance);
  const startX = playerRig.position.x;
  const startZ = playerRig.position.z;
  const minX = Math.min(startX, startX + deltaX) - playerRadius;
  const maxX = Math.max(startX, startX + deltaX) + playerRadius;
  const minZ = Math.min(startZ, startZ + deltaZ) - playerRadius;
  const maxZ = Math.max(startZ, startZ + deltaZ) + playerRadius;
  const baseHeight = playerRig.position.y - playerEyeHeight;
  const colliders = getRoomColliders(
    minX,
    maxX,
    baseHeight + collisionHeights[0],
    baseHeight + collisionHeights[collisionHeights.length - 1],
    minZ,
    maxZ,
  );
  if (colliders.length === 0) return false;

  const perpendicularX = -movementDirection.z;
  const perpendicularZ = movementDirection.x;
  const rayLength = distance + playerRadius;
  movementRaycaster.near = 0;
  movementRaycaster.far = rayLength;

  for (const height of collisionHeights) {
    for (const offset of [-playerRadius * 0.75, 0, playerRadius * 0.75]) {
      movementOrigin.set(
        startX + perpendicularX * offset,
        baseHeight + height,
        startZ + perpendicularZ * offset,
      );
      movementRaycaster.set(movementOrigin, movementDirection);
      movementHits.length = 0;
      if (movementRaycaster.intersectObjects(colliders, false, movementHits)[0]) return true;
    }
  }
  return false;
}

/** Troba l'estació més propera i l'etiqueta situada sota el punt de mira. */
function updateStations(time) {
  let nearest = null;
  let nearestDistance = Infinity;
  stations.forEach((station) => {
    const section = station.userData.section;
    const distance = Math.hypot(playerRig.position.x - section.position.x, playerRig.position.z - section.position.z);
    const active = distance < 2.3;
    station.scale.setScalar(active && !player.reducedMotion ? 1 + Math.sin(time * 2.4) * 0.055 : 1);
    if (active && distance < nearestDistance) {
      nearestDistance = distance;
      nearest = section;
    }
  });
  raycaster.setFromCamera(center, camera);
  const labelHit = raycaster.intersectObjects(stationLabels, false)[0];
  focusedStation = labelHit?.object.userData.section ?? null;
  const canInteract = Boolean(focusedStation && player.active && !ui.panel.classList.contains('is-open'));
  const promptIsVisible = ui.interactionPrompt.classList.contains('is-visible');
  if (promptIsVisible !== canInteract) {
    ui.interactionPrompt.classList.toggle('is-visible', canInteract);
    ui.interactionPrompt.setAttribute('aria-hidden', String(!canInteract));
  }
  if (player.active && !ui.panel.classList.contains('is-open')) {
    setLocation(nearest);
    updateNavigation(nearest);
  }
}

/** Analitza la banda sonora i converteix les seves freqüències en intensitat visual. */
function updateMusicVisuals(elapsed, delta) {
  const activeMusic = player.active ? experienceAmbienceAudio : soundtrackAudio;
  const musicTime = activeMusic.currentTime;
  const visualTime = player.reducedMotion ? 0 : musicTime;
  const musicIsPlaying = Boolean(
    musicAnalyser && musicFrequencyData && activeMusic
      && ambientAudioContext?.state === 'running'
      && !activeMusic.paused && !activeMusic.ended,
  );
  let bass = 0;
  let mid = 0;
  let high = 0;

  if (musicIsPlaying) {
    musicAnalyser.getByteFrequencyData(musicFrequencyData);
    const binWidth = ambientAudioContext.sampleRate / musicAnalyser.fftSize;
    const averageBand = (minimumFrequency, maximumFrequency) => {
      const start = Math.max(1, Math.floor(minimumFrequency / binWidth));
      const end = Math.min(
        musicFrequencyData.length - 1,
        Math.ceil(maximumFrequency / binWidth),
      );
      let total = 0;
      for (let index = start; index <= end; index += 1) {
        total += musicFrequencyData[index];
      }
      return end >= start ? total / ((end - start + 1) * 255) : 0;
    };
    bass = THREE.MathUtils.clamp(averageBand(35, 180) * 2.4, 0, 1);
    mid = THREE.MathUtils.clamp(averageBand(180, 2200) * 2.1, 0, 1);
    high = THREE.MathUtils.clamp(averageBand(2200, 10000) * 2.3, 0, 1);
  }

  const smoothing = musicIsPlaying ? 20 : 4;
  musicLevels.bass = THREE.MathUtils.damp(musicLevels.bass, bass, smoothing, delta);
  musicLevels.mid = THREE.MathUtils.damp(musicLevels.mid, mid, smoothing, delta);
  musicLevels.high = THREE.MathUtils.damp(musicLevels.high, high, smoothing, delta);
  musicLevels.energy = THREE.MathUtils.damp(
    musicLevels.energy,
    bass * 0.48 + mid * 0.34 + high * 0.18,
    smoothing,
    delta,
  );

  const bassRise = musicLevels.bass - musicLevels.previousBass;
  if (!player.reducedMotion && musicIsPlaying
    && musicLevels.bass > 0.16
    && bassRise > 0.055
    && elapsed - musicLevels.lastBeatAt > 0.24) {
    musicLevels.beat = 1;
    musicLevels.lastBeatAt = elapsed;
  } else {
    musicLevels.beat *= Math.exp(-delta * 7);
  }
  musicLevels.previousBass = musicLevels.bass;

  const motionScale = player.reducedMotion ? 0.18 : 1;
  const energy = musicLevels.energy * motionScale;
  const beat = musicLevels.beat * motionScale;
  const cinematicImpact = player.active ? { pulse: 0, waveScale: 1 } : getCinematicImpact(musicTime);
  const eventPulse = player.reducedMotion ? 0 : cinematicImpact.pulse;
  const glow = 8 + energy * 16 + beat * 20;
  ui.experience.style.setProperty('--music-energy', energy.toFixed(3));
  ui.experience.style.setProperty('--music-bass', (musicLevels.bass * motionScale).toFixed(3));
  ui.experience.style.setProperty('--music-high', (musicLevels.high * motionScale).toFixed(3));
  ui.experience.style.setProperty('--music-beat', beat.toFixed(3));
  ui.experience.style.setProperty('--music-glow', `${glow.toFixed(1)}px`);
  ui.experience.style.setProperty('--music-scale', (1 + beat * 0.35).toFixed(3));
  ui.experience.style.setProperty('--music-vignette-opacity', (0.6 + energy * 0.22).toFixed(3));
  ui.experience.style.setProperty('--music-scan-opacity', (0.12 + musicLevels.high * motionScale * 0.12).toFixed(3));
  if (!ui.loading.classList.contains('is-hidden')) {
    ui.loading.style.setProperty('--loader-core-scale', (1 + energy * 0.18 + beat * 0.34 + eventPulse * 0.1).toFixed(3));
    ui.loading.style.setProperty('--loader-orbit-scale', (1 + musicLevels.bass * motionScale * 0.12 + beat * 0.12 + eventPulse * 0.1).toFixed(3));
    ui.loading.style.setProperty('--loader-mid-opacity', (0.3 + musicLevels.mid * motionScale * 0.6).toFixed(3));
    ui.loading.style.setProperty('--loader-high-opacity', (0.15 + musicLevels.high * motionScale * 0.85).toFixed(3));
    ui.loading.style.setProperty('--loader-scan-scale', (0.65 + musicLevels.high * motionScale * 0.5 + beat * 0.25).toFixed(3));
    ui.loading.style.setProperty('--loader-glow', `${(12 + energy * 20 + beat * 30).toFixed(1)}px`);
    ui.loading.style.setProperty('--loader-pulse', beat.toFixed(3));
    ui.loading.style.setProperty('--loader-event-pulse', eventPulse.toFixed(3));
    ui.loading.style.setProperty('--loader-wave-scale', cinematicImpact.waveScale.toFixed(3));
    ui.loading.style.setProperty('--loader-spectrum-opacity', (0.18 + energy * 0.82).toFixed(3));
    ui.loading.style.setProperty('--loader-orbit-angle', `${(visualTime * 48).toFixed(2)}deg`);
    ui.loading.style.setProperty('--loader-mid-angle', `${(-visualTime * 31).toFixed(2)}deg`);
    ui.loading.classList.toggle('is-music-playing', musicIsPlaying);
    if (musicIsPlaying && !player.active) {
      updateCinematicChapter(musicTime);
    }
    if (musicIsPlaying && !player.active && sceneReady && soundtrackAudio.duration > 0) {
      const progress = Math.round((musicTime / soundtrackAudio.duration) * 100);
      ui.loadingProgress.style.width = `${progress}%`;
      ui.loadingPercent.textContent = `${String(progress).padStart(2, '0')}%`;
      ui.loadingProgressbar.setAttribute('aria-valuenow', String(progress));
    }
    drawLoadingSpectrum();
  }

  keyLight.color.copy(keyLightBaseColor).lerp(musicKeyTint, musicLevels.high * 0.38);
  accentLight.color.copy(accentLightBaseColor).lerp(musicAccentTint, musicLevels.bass * 0.22);
  keyLight.intensity = 0.9 + energy * 0.82 + beat * 0.34;
  accentLight.intensity = 0.7 + energy * 0.6 + beat * 0.18;
  fillLight.intensity = 0.25 + musicLevels.bass * motionScale * 0.48 + beat * 0.24;
  stationMaterial.emissiveIntensity = 1.5 + energy * 1.25 + beat * 0.8;
}

/** Actualitza el moviment, les animacions, els efectes de les estacions i la interfície a cada fotograma. */
function renderFrame(time, deltaMs) {
  const delta = Math.min(deltaMs / 1000, 0.05);
  const elapsed = time / 1000;
  elapsedTime = elapsed;
  if (stationLabelsStartedAt === null) stationLabelsStartedAt = elapsed;
  flashlight.visible = player.active && flashlightEnabled;
  if (wristArm) wristArm.visible = player.active;
  if (wristArm && wristArm.visible) {
    const gestureProgress = (elapsed - armGestureStartedAt) / 1.05;
    const pose = !player.reducedMotion && elapsed < armGestureUntil
      ? THREE.MathUtils.smoothstep(gestureProgress, 0, 0.32)
        * (1 - THREE.MathUtils.smoothstep(gestureProgress, 0.78, 1))
      : 0;
    const canMove = player.active && !ui.panel.classList.contains('is-open');
    const forwardInput = canMove
      ? Number(keys.has('KeyW') || keys.has('ArrowUp') || heldTouches.has('forward'))
        - Number(keys.has('KeyS') || keys.has('ArrowDown') || heldTouches.has('back'))
      : 0;
    const strafeInput = canMove
      ? Number(keys.has('KeyD') || keys.has('ArrowRight') || heldTouches.has('right'))
        - Number(keys.has('KeyA') || keys.has('ArrowLeft') || heldTouches.has('left'))
      : 0;
    const moving = forwardInput !== 0 || strafeInput !== 0;
    armMovementBlend = THREE.MathUtils.damp(armMovementBlend, moving && !player.reducedMotion ? 1 : 0, 7, delta);
    const gait = player.reducedMotion ? 0 : Math.sin(elapsed * 9) * armMovementBlend;
    const idleSway = player.reducedMotion ? 0 : Math.sin(elapsed * 0.9) * 0.012;
    const idleBob = player.reducedMotion ? 0 : Math.sin(elapsed * 1.65) * 0.012;
    const recoil = !player.reducedMotion && elapsed < armGestureUntil
      ? Math.exp(-gestureProgress * 8) * Math.sin(gestureProgress * 22)
      : 0;
    wristArm.position.x = THREE.MathUtils.damp(
      wristArm.position.x,
      armAnchor.x + idleSway - strafeInput * 0.045 * armMovementBlend + gait * 0.024 + pose * 0.16,
      8,
      delta,
    );
    wristArm.position.y = THREE.MathUtils.damp(
      wristArm.position.y,
      armAnchor.y + idleBob + Math.abs(gait) * 0.012 + pose * 0.13 + recoil * 0.018,
      8,
      delta,
    );
    wristArm.position.z = THREE.MathUtils.damp(
      wristArm.position.z,
      armAnchor.z - forwardInput * 0.025 * armMovementBlend - pose * 0.12 - recoil * 0.035,
      8,
      delta,
    );
    wristArm.rotation.z = THREE.MathUtils.damp(
      wristArm.rotation.z,
      0.34 - strafeInput * 0.055 * armMovementBlend + gait * 0.04 + pose * 0.15,
      8,
      delta,
    );
    wristArm.rotation.x = THREE.MathUtils.damp(
      wristArm.rotation.x,
      gait * 0.025 - pose * 0.12 + recoil * 0.025,
      8,
      delta,
    );
    wristArm.rotation.y = THREE.MathUtils.damp(
      wristArm.rotation.y,
      strafeInput * 0.04 * armMovementBlend + idleSway * 0.8,
      8,
      delta,
    );
  }
  movePlayer(delta);
  updateAmbientDust(elapsed);
  if (!player.reducedMotion) {
    roomMixer?.update(delta);
    armMixer?.update(delta);
    stations.forEach((station, index) => {
      const ring = station.children[0];
      ring.rotation.z = elapsed * (index % 2 === 0 ? 0.34 : -0.28);
      ring.scale.setScalar(1 + musicLevels.beat * 0.16 + musicLevels.bass * 0.025);
      station.children[1].material.opacity = THREE.MathUtils.clamp(
        0.8 + Math.sin(elapsed * 2 + index) * 0.2 + musicLevels.energy * 0.12,
        0,
        1,
      );
      station.children[3].scale.setScalar(1 + musicLevels.beat * 0.42 + musicLevels.high * 0.06);
      const label = station.userData.labelSprite;
      const entrance = THREE.MathUtils.smoothstep(
        elapsed - stationLabelsStartedAt - index * 0.12,
        0,
        0.7,
      );
      label.position.y = station.userData.labelBaseY
        + Math.sin(elapsed * 1.1 + index) * 0.035 * entrance;
      label.scale.set(
        station.userData.labelBaseScale * (0.94 + entrance * 0.06),
        station.userData.labelBaseHeight * (0.94 + entrance * 0.06),
        1,
      );
      label.material.opacity = entrance * (focusedStation === station.userData.section ? 1 : 0.92);
      label.material.color.set(focusedStation === station.userData.section ? 0xc6fa5f : 0xffffff);
    });
  }
  if (player.reducedMotion) {
    stations.forEach((station) => {
      station.userData.labelSprite.material.opacity = focusedStation === station.userData.section ? 1 : 0.92;
    });
  }
  if (player.active && !ui.panel.classList.contains('is-open')) {
    updateStations(elapsed);
  }
}

/** Aplica els desplaçaments del punter o del gest d'arrossegament a la càmera en primera persona. */
function lookAround(deltaX, deltaY) {
  player.yaw -= deltaX * 0.0022;
  player.pitch = THREE.MathUtils.clamp(player.pitch - deltaY * 0.002, -1.15, 1.15);
  camera.rotation.set(player.pitch, player.yaw, 0, 'YXZ');
}

ui.enter.addEventListener('click', () => {
  if (sceneReady) enterExperience();
  else if (sceneLoadFailed) window.location.reload();
});
ui.audioEnableButton.addEventListener('click', () => {
  void enableAudioAndContinue();
});
ui.audioSilentButton.addEventListener('click', continueWithoutAudio);
ui.audioModal.addEventListener('cancel', (event) => {
  event.preventDefault();
  continueWithoutAudio();
});
ui.panelClose.addEventListener('click', closePanel);
ui.loading.addEventListener('transitionend', (event) => {
  if (event.target !== ui.loading || event.propertyName !== 'opacity'
    || !ui.loading.classList.contains('is-exiting')) return;
  ui.loading.classList.remove('is-exiting');
  ui.loading.classList.add('is-hidden');
  ui.loading.setAttribute('aria-hidden', 'true');
  ui.loading.setAttribute('aria-busy', 'false');
  ui.enter.focus({ preventScroll: true });
});
ui.soundToggle.addEventListener('click', () => {
  const enabled = !player.soundEnabled;
  if (!enabled) playInteractionSound('toggle-off');
  updateSoundControl(enabled);
  void setSoundEnabled(enabled).then((success) => {
    if (!success) return;
    updateSoundControl(enabled);
    if (enabled) playInteractionSound('toggle-on', 0.07);
  });
});
ui.motionToggle.addEventListener('click', () => {
  player.reducedMotion = !player.reducedMotion;
  ui.experience.classList.toggle('motion-reduced', player.reducedMotion);
  ui.motionToggle.setAttribute('aria-pressed', String(player.reducedMotion));
  ui.motionToggle.querySelector('.motion-label').textContent = player.reducedMotion ? 'Movimiento reducido' : 'Reducir movimiento';
  showToast(player.reducedMotion ? 'Animaciones ambientales pausadas.' : 'Animaciones ambientales activadas.');
});
navItems.forEach((button) => {
  button.addEventListener('click', () => {
    const section = sections.find((item) => item.id === button.dataset.section);
    if (section) openSection(section);
    else {
      const panelWasOpen = ui.panel.classList.contains('is-open') || Boolean(activeStation);
      closePanel();
      setLocation(null);
      updateNavigation(null);
      if (!panelWasOpen) playInteractionSound('navigate');
    }
  });
});
document.addEventListener('keydown', (event) => {
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) event.preventDefault();
  keys.add(event.code);
  if (event.code === 'KeyL' && !event.repeat && player.active) {
    flashlightEnabled = !flashlightEnabled;
    playInteractionSound(flashlightEnabled ? 'flashlight-on' : 'flashlight-off');
    showToast(`Linterna ${flashlightEnabled ? 'encendida' : 'apagada'} · L`);
  }
  if (event.code === 'KeyE' && !event.repeat && player.active) {
    if (ui.panel.classList.contains('is-open')) closePanel();
    else if (focusedStation) openSection(focusedStation);
  }
  if (event.code === 'Escape') {
    const panelIsOpen = ui.panel.classList.contains('is-open') || Boolean(activeStation);
    if (panelIsOpen) closePanel();
    else if (document.pointerLockElement) document.exitPointerLock();
  }
});
document.addEventListener('keyup', (event) => keys.delete(event.code));
window.addEventListener('blur', () => {
  keys.clear();
  heldTouches.clear();
});
document.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement === renderer.domElement) lookAround(event.movementX, event.movementY);
});
renderer.domElement.addEventListener('click', () => {
  if (!player.active || ui.panel.classList.contains('is-open')) return;
  if (!activeStation
    && !matchMedia('(pointer: coarse)').matches
    && !player.dragLook
    && renderer.domElement.requestPointerLock) {
    requestPointerCapture();
  }
});
let dragPointer = null;
renderer.domElement.addEventListener('pointerdown', (event) => {
  if (!player.active || (!matchMedia('(pointer: coarse)').matches && !player.dragLook)) return;
  dragPointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
  renderer.domElement.setPointerCapture(event.pointerId);
  if (player.dragLook) renderer.domElement.style.cursor = 'grabbing';
});
renderer.domElement.addEventListener('pointermove', (event) => {
  if (!dragPointer || event.pointerId !== dragPointer.id) return;
  lookAround(event.clientX - dragPointer.x, event.clientY - dragPointer.y);
  dragPointer.x = event.clientX;
  dragPointer.y = event.clientY;
});
const stopDragLook = (event) => {
  if (dragPointer?.id === event.pointerId) {
    dragPointer = null;
    if (player.dragLook) renderer.domElement.style.cursor = 'grab';
  }
};
renderer.domElement.addEventListener('pointerup', stopDragLook);
renderer.domElement.addEventListener('pointercancel', stopDragLook);
renderer.domElement.addEventListener('lostpointercapture', stopDragLook);
movementButtons.forEach((button) => {
  const start = (event) => {
    event.preventDefault();
    heldTouches.add(button.dataset.move);
    button.setPointerCapture(event.pointerId);
  };
  const stop = () => heldTouches.delete(button.dataset.move);
  button.addEventListener('pointerdown', start);
  button.addEventListener('pointerup', stop);
  button.addEventListener('pointercancel', stop);
  button.addEventListener('lostpointercapture', stop);
});
window.addEventListener('resize', () => {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
});

/** Carrega els recursos de l'escena i inicia el bucle d'interacció. */
async function start() {
  try {
    await Promise.all([loadRoom(), loadArm(), loadScreen()]);
    updatePortfolioFrame = renderFrame;
    sceneReady = true;
    stopLoadingAmbience();
    ui.loadingProgress.style.width = '100%';
    ui.loadingPercent.textContent = '100%';
    ui.loadingProgressbar.setAttribute('aria-valuenow', '100');
    const soundtrackIsPlaying = player.soundEnabled
      && !soundtrackAudio.paused && !soundtrackAudio.ended;
    ui.loadingTitle.textContent = soundtrackIsPlaying ? 'Sincronizando el portal' : 'El espacio está listo';
    ui.loadingDescription.textContent = soundtrackIsPlaying
      ? 'La señal está cargando el núcleo. El portal se abrirá al terminar la secuencia.'
      : 'El entorno está preparado. La banda sonora puede comenzar al instante.';
    if (soundtrackIsPlaying) updateCinematicChapter(soundtrackAudio.currentTime);
    else ui.loadingMessage.textContent = 'SISTEMA LISTO';
    ui.loading.setAttribute('aria-busy', 'false');
    ui.loading.classList.add('is-ready');
    ui.enter.disabled = false;
    ui.enter.querySelector('span').textContent = 'Entrar al espacio';
    ui.introStatus.textContent = 'RECORRIDO LIBRE';
    showAudioPrompt();
    if (soundtrackAudio.ended) revealExperience();
  } catch (error) {
    console.error('No se pudo cargar la experiencia 3D.', error);
    sceneLoadFailed = true;
    stopLoadingAmbience();
    ui.loadingTitle.textContent = 'No se pudo cargar el espacio';
    ui.loadingDescription.textContent = 'Comprueba la conexión e inténtalo de nuevo.';
    ui.loadingMessage.textContent = 'ERROR AL CARGAR LOS MODELOS';
    ui.loadingMessage.setAttribute('role', 'alert');
    ui.loading.setAttribute('aria-busy', 'false');
    ui.loading.classList.add('is-ready');
    ui.enter.disabled = false;
    ui.enter.querySelector('span').textContent = 'Volver a intentar';
    ui.introDescription.textContent = 'No se pudo cargar el espacio 3D. Vuelve a intentarlo.';
    ui.introStatus.textContent = 'ERROR DE CONEXIÓN';
  }
}

if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  player.reducedMotion = true;
  ui.experience.classList.add('motion-reduced');
  ui.motionToggle.setAttribute('aria-pressed', 'true');
  ui.motionToggle.querySelector('.motion-label').textContent = 'Movimiento reducido';
}

start();