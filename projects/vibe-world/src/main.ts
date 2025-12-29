import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e); // Dark blue vibe
scene.fog = new THREE.FogExp2(0x1a1a2e, 0.02);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(20, 20, 20);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(50, 50, 50);
dirLight.castShadow = true;
scene.add(dirLight);

// Load Procedural Textures
const textureLoader = new THREE.TextureLoader();
const playerSprite = textureLoader.load('./src/assets/sprites/player.png');

// Create Player (Billboard)
const playerMat = new THREE.SpriteMaterial({ map: playerSprite });
const player = new THREE.Sprite(playerMat);
player.scale.set(4, 4, 1);
player.position.set(0, 5, 0);
scene.add(player);

// Create Terrain (Placeholder for now, in real version we'd import the generator logic or load the heightmap)
// For this demo, we'll create a simple grid
const geometry = new THREE.PlaneGeometry(100, 100, 20, 20);
const material = new THREE.MeshStandardMaterial({ 
  color: 0x2e7d32,
  wireframe: true,
});
const terrain = new THREE.Mesh(geometry, material);
terrain.rotation.x = -Math.PI / 2;
scene.add(terrain);

// Add some floating cubes for "Vibe"
for (let i = 0; i < 20; i++) {
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
  const cube = new THREE.Mesh(geo, mat);
  cube.position.set(
    (Math.random() - 0.5) * 50,
    Math.random() * 10 + 2,
    (Math.random() - 0.5) * 50
  );
  scene.add(cube);
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Bob player
  player.position.y = 5 + Math.sin(Date.now() * 0.002) * 0.5;

  renderer.render(scene, camera);
}

animate();

// Resize Handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});