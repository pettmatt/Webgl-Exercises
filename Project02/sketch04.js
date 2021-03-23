// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const {random} = require('canvas-sketch-util');
const palettes = require('nice-color-palettes');
const eases = require('eases');
const BezierEasing = require('bezier-easing');

const settings = {
  dimensions: [ 512, 512],
  fps: 24,
  duration: 7,
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("hsl(0, 0%, 95%)", 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup your scene
  const scene = new THREE.Scene();

  const palette = random.pick(palettes);

  // Setup a geometry
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  // Setup a mesh with geometry + material
  for(let i = 0; i < 50; i++){
    // Setup a material
    const material = new THREE.MeshStandardMaterial({
      color: random.pick(palette),
      wireframe: false
    });

    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    
    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );

    mesh.scale.multiplyScalar(0.4);
    scene.add(mesh);
  }

  scene.add(new THREE.AmbientLight('hsl(0, 7%, 40%)', 1.0));

  const light = new THREE.DirectionalLight('white', 1);
  light.position.set(2, 5, 1);
  scene.add(light);

  const easeFn = BezierEasing(0.42, 0, 0.58, 1.0);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);

      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 2.0;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ playhead }) {
      const r = Math.sin(playhead * Math.PI);
      scene.rotation.y = playhead * Math.PI;
      scene.rotation.z = easeFn(r);
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
