import * as THREE from 'three';
import vertexShader from '../src/shaders/vertex.glsl';
import fragmentShader from '../src/shaders/fragment.glsl';
import LocomotiveScroll from 'locomotive-scroll';

// Create the scene
const scene = new THREE.Scene();

// Create a camera
const distance = 5;
const fov = (2 * Math.atan((window.innerHeight / 2) / distance) * (180 / Math.PI)); // Calculate FOV in degrees based on pixel height

const camera = new THREE.PerspectiveCamera(
  fov, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);
camera.position.z = 5;

// Create the renderer
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Create a raycaster and mouse vector
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Create a geometry and material, then combine them into a mesh
const geometry = new THREE.PlaneGeometry(120, 400);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

// Add the mesh to the scene
scene.add(cube);

const Image = document.querySelectorAll('img');
const planes = [];
Image.forEach(image => {
  let imagebounds = image.getBoundingClientRect();
  const geometry = new THREE.PlaneGeometry(imagebounds.width, imagebounds.height);
  const texture = new THREE.TextureLoader().load(image.src);
  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(
    imagebounds.left - window.innerWidth / 2 + imagebounds.width / 2,
    -imagebounds.top + window.innerHeight / 2 - imagebounds.height / 2,
    0
  );
  scene.add(plane);
  planes.push({ mesh: plane, material });
});

function updateimagePosition() {
  planes.forEach((planeObj, index) => {
    const image = Image[index];
    let imagebounds = image.getBoundingClientRect();
    planeObj.mesh.position.set(
      imagebounds.left - window.innerWidth / 2 + imagebounds.width / 2,
      -imagebounds.top + window.innerHeight / 2 - imagebounds.height / 2,
      0
    );
  });
}

// Update mouse position and raycaster
function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(planes.map(p => p.mesh));
  if (intersects.length > 0) {
    const intersectedPlane = intersects[0].object;
    const planeObj = planes.find(p => p.mesh === intersectedPlane);
    if (planeObj) {
      planeObj.material.uniforms.uMouse.value.set(mouse.x, mouse.y);
    }
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  updateimagePosition();
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Add mousemove event listener
window.addEventListener('mousemove', onMouseMove);

// Start the animation loop
animate();