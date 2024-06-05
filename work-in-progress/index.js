import * as THREE from './three.js';

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

function animate() {
	renderer.render( scene, camera );

  const t = Date.now() * 0.0005;
  const r = 200;

  const x = r * Math.cos( t );
  const y = r * Math.sin( t );

  camera.position.x = x;
  camera.position.y = y;

  camera.rotation.x = x * 0.01;
}
renderer.setAnimationLoop( animate );