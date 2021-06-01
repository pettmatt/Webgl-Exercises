global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

const canvasSketch = require('canvas-sketch');
const funcs = require('./functions');
const planets = require('./planets.json');

const settings = {
  dimensions: 'A4',
  units: 'm',
  // How good quality should the printed image be
  //pixelsPerInch: 300,
  //orientation: 'landscape',
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl'
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor('#000', 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(500, 1, 0.01, 1000);
  camera.position.set(3, 3, -5);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 32, 16);

  const loader = new THREE.TextureLoader();

  const sunTexture = loader.load('https://www.solarsystemscope.com/textures/download/8k_sun.jpg');
  const earthTexture = loader.load('https://raw.githubusercontent.com/mattdesl/workshop-webgl-glsl/master/src/demos/earth.jpg');
  const moonTexture = loader.load('https://raw.githubusercontent.com/mattdesl/workshop-webgl-glsl/master/src/demos/moon.jpg');

  // Create planets from the data inside of planets.json
  planets.forEach(planet => {
    const geom = new THREE.SphereGeometry(funcs.ScaleDown(planet.size), 32, 16);

    let distance = planet.distance * 0.001;

    const sunMaterial = new THREE.MeshStandardMaterial({
      roughness: 1,
      metalness: 0,
      map: sunTexture//planet.texture
    });

    // Creating mesh with texture
    const mesh = new THREE.Mesh(geom, sunMaterial);
    mesh.position.set(distance, 0, 0);

    console.log(planet.distance)

    // If planet orbits a star create orbital group for it
    if(planet.orbits[0] === true) {
      let orbitalGroup = new THREE.Group();
      scene.add(orbitalGroup);
    }

    // else let it be the center of the solar system
    else {
      scene.add(mesh);
    }
  });

  // Setup a material
  const earthMaterial = new THREE.MeshStandardMaterial({
    roughness: 1,
    metalness: 0,
    map: earthTexture
  });

  // Setup a mesh with geometry + material
  const earthMesh = new THREE.Mesh(geometry, earthMaterial);
  scene.add(earthMesh);

  const moonGroup = new THREE.Group();

  const moonMaterial = new THREE.MeshStandardMaterial({
    roughness: 1,
    metalness: 0,
    map: moonTexture
  });

  const moonMesh = new THREE.Mesh(geometry, moonMaterial);
  moonMesh.position.set(1.5 * 2, 1, 0);
  moonMesh.scale.setScalar(0.25);
  moonGroup.add(moonMesh);

  scene.add(moonGroup);

  const light = new THREE.PointLight('white', 2);
  light.position.set(40, 1, -20);
  scene.add(light);

  //scene.add(new THREE.GridHelper(5, 100));
  scene.add(new THREE.PointLightHelper(light, 0.15));

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      earthMesh.rotation.y = time * 0.15;
      moonMesh.rotation.y = time * 0.035;
      moonGroup.rotation.y = time * 0.35;

      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
