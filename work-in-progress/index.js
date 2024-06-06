import * as THREE from './three.js';

var currentIndex = 0;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
document.getElementById("backgroundholder").appendChild( renderer.domElement );

const light = new THREE.PointLight( 0xFEEFDD, 50000 );
scene.add( light );

const torusKnot = new THREE.TorusKnotGeometry( 300, 7, 2048, 64, 19, 20 );
const material = new THREE.MeshStandardMaterial( { color: 0xFF4000, roughness: 0, metalness: 1 } );
const torusKnotMesh = new THREE.Mesh( torusKnot, material );
scene.add( torusKnotMesh );

const torusKnot2 = new THREE.TorusKnotGeometry( 300, 7, 2048, 64, 19, 20 );
const material2 = new THREE.MeshStandardMaterial( { color: 0x50B2C0, roughness: 0, metalness: 1 } );
const torusKnotMesh2 = new THREE.Mesh( torusKnot2, material2 );
torusKnotMesh2.rotation.x = Math.PI / 2;
scene.add( torusKnotMesh2 );

const torusKnot3 = new THREE.TorusKnotGeometry( 300, 7, 2048, 64, 19, 20 );
const material3 = new THREE.MeshStandardMaterial( { color: 0xFAAA8D, roughness: 0, metalness: 1 } );
const torusKnotMesh3 = new THREE.Mesh( torusKnot3, material3 );
torusKnotMesh3.rotation.y = Math.PI / 2;
scene.add( torusKnotMesh3 );

light.parent = camera;

function lerp(a, b, n) {
  return (1 - n) * a + n * b;
}

var tlast = Date.now();

var camPos = 0;

function animate() {
	renderer.render( scene, camera );

  const t = Date.now() * 0.0005;
  const dt = t - tlast;
  tlast = t;
  const r = 200;

  const x = r * Math.cos( t );
  const y = r * Math.sin( t );

  const camTargets = [];

  camTargets.push(new THREE.Vector3(x, y, 0));
  camTargets.push(new THREE.Vector3(x * 0.01, 0, 0));
  // camera.position.x = x;
  // camera.position.y = y;

  // camera.rotation.x = x * 0.01;

  camTargets.push(new THREE.Vector3(y, x, 0));
  camTargets.push(new THREE.Vector3(y * 0.01, 0, 0));

  camTargets.push(new THREE.Vector3(x * 2, 0, 0));
  camTargets.push(new THREE.Vector3(0, t % 6.28, 0));

  camTargets.push(new THREE.Vector3(0, x * 2, 0));
  camTargets.push(new THREE.Vector3(0, 0, t % 6.28));

  camPos = lerp(camPos, currentIndex, dt);

  const lower = Math.floor(camPos);
  const upper = Math.ceil(camPos);

  const camPosLerp = camPos - lower;

  const targetPosition = camTargets[lower * 2].clone().lerp(camTargets[upper * 2], camPosLerp);
  const targetRotation = camTargets[lower * 2 + 1].clone().lerp(camTargets[upper * 2 + 1], camPosLerp);

  camera.position.copy(targetPosition);
  camera.rotation.x = targetRotation.x;
  camera.rotation.y = targetRotation.y;
  camera.rotation.z = targetRotation.z;
}
renderer.setAnimationLoop( animate );

function navigateTo(index) {
  currentIndex = index;
}

window.navigateTo = navigateTo;