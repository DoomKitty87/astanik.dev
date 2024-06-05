import * as THREE from './three.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
document.getElementById("backgroundholder").appendChild( renderer.domElement );

scene.background = new THREE.Color( 0x201E1F );
scene.fog = new THREE.FogExp2( 0x201E1F, 0.008 );

const light = new THREE.DirectionalLight( 0xFEEFDD, 5 );
scene.add( light );

const colors = new Uint8Array( 2 );

for ( let c = 0; c <= colors.length; c ++ ) {
  colors[ c ] = ( c / colors.length ) * 256;
}

const gradientMap = new THREE.DataTexture( colors, colors.length, 1, THREE.RedFormat );
gradientMap.needsUpdate = true;

// const torusKnots = [];
// const knotRotationSpeeds = [];

// for (let i = 0; i < 1; i++) {
//   const torusKnotNew = new THREE.TorusKnotGeometry( 250 + 10 * i, 3, 256, 32, 19, 20 );
//   const randomColor = Math.floor(Math.random()*16777215);
//   const materialNew = new THREE.MeshToonMaterial( { color: randomColor, gradientMap: gradientMap } );
//   const torusKnotNewMesh = new THREE.Mesh( torusKnotNew, materialNew );
//   scene.add( torusKnotNewMesh );
//   torusKnots.push(torusKnotNewMesh);
//   knotRotationSpeeds.push((Math.random() - 0.5) * 0.025);
// }

const torusKnot = new THREE.TorusKnotGeometry( 300, 7, 2048, 64, 19, 20 );
const material = new THREE.MeshToonMaterial( { color: 0xFF4000, gradientMap: gradientMap } );
const torusKnotMesh = new THREE.Mesh( torusKnot, material );
scene.add( torusKnotMesh );

const torusKnot2 = new THREE.TorusKnotGeometry( 300, 7, 2048, 64, 19, 20 );
const material2 = new THREE.MeshToonMaterial( { color: 0x50B2C0, gradientMap: gradientMap } );
const torusKnotMesh2 = new THREE.Mesh( torusKnot2, material2 );
torusKnotMesh2.rotation.x = Math.PI / 2;
scene.add( torusKnotMesh2 );

const torusKnot3 = new THREE.TorusKnotGeometry( 300, 7, 2048, 64, 19, 20 );
const material3 = new THREE.MeshToonMaterial( { color: 0xFAAA8D, gradientMap: gradientMap } );
const torusKnotMesh3 = new THREE.Mesh( torusKnot3, material3 );
torusKnotMesh3.rotation.y = Math.PI / 2;
scene.add( torusKnotMesh3 );

function animate() {
	renderer.render( scene, camera );
  // torusKnots.forEach((torusKnot, index) => {
  //   torusKnot.rotation.x += knotRotationSpeeds[index];
  //   torusKnot.rotation.y += knotRotationSpeeds[index];
  // });

  // Set camera on path through torus
  const t = Date.now() * 0.0005;
  const r = 200;

  const x = r * Math.cos( t );
  const y = r * Math.sin( t );

  camera.position.x = x;
  camera.position.y = y;

  camera.rotation.x = x * 0.01;

  light.position.x = x;
  light.position.y = y;
  
  light.rotation.x = x * 0.01;
}
renderer.setAnimationLoop( animate );