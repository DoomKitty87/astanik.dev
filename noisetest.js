import { createNoise2D } from "./simplex-noise.js";
import * as THREE from './three.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById("renderercontainer").appendChild( renderer.domElement );

const geometry = new THREE.BufferGeometry();

const width = 250;
const depth = 100;

const vertices = new Float32Array(width * depth * 3);

const vertexScale = 1;

for (var i = 0; i < width * depth; i++) {
  vertices[i * 3] = (i % width - width / 2) * vertexScale;
  vertices[i * 3 + 1] = 0;
  vertices[i * 3 + 2] = -Math.floor(i / width) * vertexScale;
}

const indices = [];

for (var x = 0; x < (width - 1); x++) {
  for (var z = 0; z < (depth - 1); z++) {
    indices.push(x + z * width);
    indices.push(x + 1 + z * width);
    indices.push(x + z * width);
    indices.push(x + 1 + z * width);
    indices.push(x + 1 + (z + 1) * width);
    indices.push(x + (z + 1) * width);
  }
}

const noise2D = createNoise2D();

geometry.setIndex(indices);
var buffer = new THREE.BufferAttribute(vertices, 3);
geometry.setAttribute('position', buffer);
const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
material.wireframe = true;
const plane = new THREE.Mesh( geometry, material );
scene.add( plane );

var mousePos = {x: 0, y: 0};

const resolutionX = window.innerWidth;
const resolutionY = window.innerHeight;
document.addEventListener('mousemove', function(e) {
  mousePos.x = e.clientX / resolutionX * 2 - 1;
  mousePos.y = e.clientY / resolutionY * 2 - 1;
});

camera.position.y = 5;
const speed = 0.02;
const delay = 1 / speed;
const movementSensitivity = 0.1;
const rotationSensitivity = 0.02;
var frames = 0;
function animate() {
	requestAnimationFrame( animate );
  if (frames % delay == 0) {
    for (var i = 0; i < vertices.length / 3; i++) {
      vertices[i * 3 + 2] -= vertexScale;
      vertices[i * 3 + 1] = noise2D(vertices[i * 3] / 100, vertices[i * 3 + 2] / 40) * Math.abs(vertices[i * 3]) * 0.25; 
    }
    buffer.needsUpdate = true;
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
  }
  plane.position.x = -(mousePos.x) * movementSensitivity;
  plane.position.y = (mousePos.y) * movementSensitivity;
  camera.setRotationFromEuler(new THREE.Euler((mousePos.y) * -rotationSensitivity, (mousePos.x) * -rotationSensitivity, 0));
  frames++;
  plane.position.z = frames / delay * vertexScale;
	renderer.render( scene, camera );
}
animate();