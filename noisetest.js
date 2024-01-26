import { createNoise2D } from "./simplex-noise.js";
import * as THREE from './three.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BufferGeometry();

const vertices = new Float32Array( [
  -1.0, 0.0, 0.0,
  0.0, 0.0, 0.0,
  1.0, 0.0, 0.0,
  -1.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
  1.0, 0.0, 1.0
]);

const indices = [
  0, 1, 2,
  3, 4, 5,
  0, 3, 0,
  1, 4, 1,
  2, 5, 2,
];

const noise2D = createNoise2D();

geometry.setIndex(indices);
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
material.wireframe = true;
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );
  for (int i = 0; i < vertices.length / 3; i++) {
    vertices[i * 3 + 1] += noise2D(vertices[i * 3], vertices[i * 3 + 2]); 
  }
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
	renderer.render( scene, camera );
}
animate();