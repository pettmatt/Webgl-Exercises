// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const glsl = require('glslify');

const settings = {
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
  renderer.setClearColor("#fff", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 20, 20);

  const vertexShader = /* glsl */ `
    varying vec2 vUv;
    void main () {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
    }
  `;

  const fragmentShader =  glsl(/* glsl */ `
    #pragma glslify: noise = require('glsl-noise/simplex/3d');
    varying vec2 vUv;
    uniform vec3 color;
    uniform float time;
    void main() {
      // Defining center point
      vec2 center = vec2(0.5, 0.5);

      // Fixing how circles are drawn so that it looks good on a sphere
      // Because of the sphere gets streched about twice by its original width 
      // we could give it some extra width
      vec2 sphereUv = vUv;
      sphereUv.x *= 2.0;
      sphereUv *= 10.0;

      // Position of the circles
      vec2 pos = mod(sphereUv, 1.0);

      // Distance from the center
      float dis = distance(pos, center);

      // Create a mask from the circles
      // Animation: sin() is used to resizing circles based on their placement in the x-axis.
      //float mask = step(0.25 + sin(time + vUv.x) * 0.25, dis);

      // Adding noise from glslify library
      vec2 noiseInput = floor(sphereUv * 80.0);
      float offset = noise(vec3(noiseInput.xy, time) * 0.20) * 1.0;
      float mask = step(0.25 + offset, dis);

      // Invert the mask
      mask = 1.0 - mask;

      // Make a mix of colours for the masked circles
      // 1.0 white -> 0.0 black
      vec3 fragColor = mix(color, vec3(1.0), mask);

      gl_FragColor = vec4(vec3(fragColor), 1.0);
    }
  `);

  // Setup a material
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color('pink') }
    },
    vertexShader,
    fragmentShader
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

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
      material.uniforms.time.value = time;
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
